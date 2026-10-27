# Binding – early and late binding

## What binding means {#binding}

In our earlier examples, whenever we called a method, it was generally obvious which method body would be executed. After introducing inheritance, however, the base class and a derived class may both contain a method with the same name, so the method name alone does not always tell us which implementation will run. For every method call, the program must select the specific implementation whose instructions it will execute. This association is called **binding**.

Binding can take place during compilation; this is known as **early binding**. In other cases, the implementation to execute is selected only while the program is running, which is known as **late binding**. The difference becomes particularly important when a reference is declared using a base-class type but actually refers to an object of one of its derived classes. We have already seen that the declared type of a reference may differ from the actual type of the object; here we shall examine how this affects method calls.

## Overriding methods {#overriding}

Suppose we have created a `Person` class to store personal data, with a `getRole()` method returning a person’s role. In the derived `Student` and `Teacher` classes, the answer to that question will be different. We do not want to introduce differently named methods, because the operation means the same thing in all three classes; only its implementation needs to be adapted to each type. In this case, we **override** the base-class method in each derived class, using the same method name and a compatible parameter list, but providing a different method body.

In Java, it is good practice to place the `@Override` annotation before an overriding method. This lets the compiler check whether a suitable overridable method really exists in a parent class, so we can catch a mistake in the method name sooner. An overriding method cannot reduce the visibility of the inherited method, and its return type must satisfy the language’s compatibility rules. Our examples all return a `String`, so we do not need to explore those additional rules yet.

:::lang java
```java
class Person {
    public String getRole() {
        return "person";
    }
}

class Student extends Person {
    @Override
    public String getRole() {
        return "student";
    }
}

class Teacher extends Person {
    @Override
    public String getRole() {
        return "teacher";
    }
}
```
:::end

:::lang csharp
```csharp
class Person {
    public virtual string GetRole() {
        return "person";
    }
}

class Student : Person {
    public override string GetRole() {
        return "student";
    }
}

class Teacher : Person {
    public override string GetRole() {
        return "teacher";
    }
}
```
:::end

:::lang python
```python
class Person:
    def get_role(self):
        return "person"

class Student(Person):
    def get_role(self):
        return "student"

class Teacher(Person):
    def get_role(self):
        return "teacher"
```
:::end

:::lang cpp
```cpp
#include <string>

class Person {
public:
    virtual std::string getRole() const {
        return "person";
    }
};

class Student : public Person {
public:
    std::string getRole() const override {
        return "student";
    }
};

class Teacher : public Person {
public:
    std::string getRole() const override {
        return "teacher";
    }
};
```
:::end

![Role methods in Person, Student and Teacher](content/chapters/07-kotes/media/roles-en.svg){width=590}

We must not confuse **overriding** with **overloading**. If methods have the same name but different parameter lists, whether in the same class or an inheritance hierarchy, they are regarded as distinct methods. For example, `register()` and `register(String course)` are not two overridden implementations of the same method, because their parameter lists are different. The compiler selects the appropriate overload based on the supplied arguments and their types. In Java, changing only the return type is not sufficient to overload a method.

:::lang java
```java
class Student extends Person {
    public void register() {
        System.out.println("Registration started");
    }

    public void register(String course) {
        System.out.println("Registered for " + course);
    }
}

class Main {
    public static void main(String[] args) {
        Student student = new Student();
        student.register();
        student.register("OOP");
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Person { }
class Student : Person {
    public void Register() {
        Console.WriteLine("Registration started");
    }
    public void Register(string course) {
        Console.WriteLine("Registered for " + course);
    }
}
class Program {
    static void Main() {
        Student student = new Student();
        student.Register();
        student.Register("OOP");
    }
}
```
:::end

:::lang python
```python
class Student(Person):
    # Python does not overload methods by parameter list.
    def register(self, course=None):
        if course is None:
            print("Registration started")
        else:
            print("Registered for " + course)

student = Student()
student.register()
student.register("OOP")
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>
class Person { };
class Student : public Person {
public:
    void registerCourse() const {
        std::cout << "Registration started\n";
    }
    void registerCourse(const std::string& course) const {
        std::cout << "Registered for " << course << '\n';
    }
};

int main() {
    Student student;
    student.registerCourse();
    student.registerCourse("OOP");
}
```
:::end

## Late binding {#late-binding}

To understand late binding, let us add an `introduce()` method to `Person`, displaying a person’s name and role. We shall use the existing `getRole()` method, so we need to implement `introduce()` only once, in the base class. `Student` and `Teacher` inherit it unchanged, while overriding `getRole()` with their own implementations. Which `getRole()` will the inherited `introduce()` call when invoked on a student or a teacher?

In Java, calls to overridable instance methods use **late binding**. This means that the method body is selected at runtime according to the actual type of the object. Although `introduce()` was written in `Person`, the call to `getRole()` inside it executes `Student.getRole()` for a `Student` object and `Teacher.getRole()` for a `Teacher` object. Late binding therefore allows an algorithm implemented in a base class to use behaviour supplied by its derived classes without rewriting that algorithm.

:::lang java
```java
class Person {
    private String name;

    public void setName(String value) { name = value; }
    public String getName() { return name; }

    public String getRole() { return "person"; }

    public void introduce() {
        System.out.println(name + " is a " + getRole());
    }
}

class Student extends Person {
    @Override
    public String getRole() { return "student"; }
}

class Teacher extends Person {
    @Override
    public String getRole() { return "teacher"; }
}

class Main {
    public static void main(String[] args) {
        Person[] people = {new Student(), new Teacher()};
        people[0].setName("Anna");
        people[1].setName("Peter");

        for (Person person : people) {
            person.introduce();
        }
        // Anna is a student
        // Peter is a teacher
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Person {
    private string name;
    public void SetName(string value) { name = value; }
    public virtual string GetRole() { return "person"; }
    public void Introduce() {
        Console.WriteLine(name + " is a " + GetRole());
    }
}
class Student : Person {
    public override string GetRole() { return "student"; }
}
class Teacher : Person {
    public override string GetRole() { return "teacher"; }
}
class Program {
    static void Main() {
        Person[] people = {new Student(), new Teacher()};
        people[0].SetName("Anna");
        people[1].SetName("Peter");
        foreach (Person person in people)
            person.Introduce();
    }
}
```
:::end

:::lang python
```python
class Person:
    def set_name(self, value):
        self._name = value

    def get_role(self):
        return "person"

    def introduce(self):
        print(self._name + " is a " + self.get_role())

class Student(Person):
    def get_role(self):
        return "student"

class Teacher(Person):
    def get_role(self):
        return "teacher"

people = [Student(), Teacher()]
people[0].set_name("Anna")
people[1].set_name("Peter")
for person in people:
    person.introduce()
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>

class Person {
    std::string name;
public:
    void setName(const std::string& value) { name = value; }
    virtual std::string getRole() const { return "person"; }
    void introduce() const {
        std::cout << name << " is a " << getRole() << '\n';
    }
};
class Student : public Person {
public:
    std::string getRole() const override { return "student"; }
};
class Teacher : public Person {
public:
    std::string getRole() const override { return "teacher"; }
};

int main() {
    Student student;
    Teacher teacher;
    student.setName("Anna");
    teacher.setName("Peter");
    Person* people[] = {&student, &teacher};
    for (Person* person : people)
        person->introduce();
}
```
:::end

![Method dispatch in introduce and getRole](content/chapters/07-kotes/media/dispatch-en.svg){width=620}

This example also shows that a `Person` array can hold references to objects of several derived classes. Inside the loop, the declared type of `person` is always `Person`, although the actual object may be a `Student` or a `Teacher`. The compiler checks whether calling `person.introduce()` is permitted using the declared type, while the appropriate overridden `getRole()` is selected at runtime. This mechanism is one of the most important foundations of **polymorphism**: we can process objects of different types with the same algorithm without writing separate conditions for each type.

## Using a base-class method {#super-call}

When overriding a method, we do not necessarily want to discard the algorithm already implemented in the base class. Often that algorithm provides a suitable starting point, and we need only extend it with a few instructions. Suppose `Person.getDescription()` returns the person’s name and we also want a student’s ID to appear in the description. There is no reason to implement name retrieval again: in Java, we can call the base-class implementation using `super` and then extend the returned string.

The expression `super.getDescription()` specifically invokes the base-class implementation, whereas `getDescription()` or `this.getDescription()` can use the usual late binding. We must distinguish these expressions carefully: calling the overriding method itself from its own body may result in infinite recursion. C# uses `base` for this purpose, C++ uses the base class name with `::`, and Python provides `super()`.

:::lang java
```java
class Person {
    private String name;
    public void setName(String value) { name = value; }
    public String getDescription() { return name; }
}

class Student extends Person {
    private String studentId;
    public void setStudentId(String value) { studentId = value; }

    @Override
    public String getDescription() {
        return super.getDescription() + " (" + studentId + ")";
    }
}
```
:::end

:::lang csharp
```csharp
class Person {
    private string name;
    public void SetName(string value) { name = value; }
    public virtual string GetDescription() { return name; }
}
class Student : Person {
    private string studentId;
    public void SetStudentId(string value) { studentId = value; }
    public override string GetDescription() {
        return base.GetDescription() + " (" + studentId + ")";
    }
}
```
:::end

:::lang python
```python
class Person:
    def set_name(self, value):
        self._name = value

    def get_description(self):
        return self._name

class Student(Person):
    def set_student_id(self, value):
        self._student_id = value

    def get_description(self):
        return super().get_description() + " (" + self._student_id + ")"
```
:::end

:::lang cpp
```cpp
#include <string>
class Person {
    std::string name;
public:
    void setName(const std::string& value) { name = value; }
    virtual std::string getDescription() const { return name; }
};
class Student : public Person {
    std::string studentId;
public:
    void setStudentId(const std::string& value) { studentId = value; }
    std::string getDescription() const override {
        return Person::getDescription() + " (" + studentId + ")";
    }
};
```
:::end

## Early binding {#early-binding}

Late binding is useful, but we do not always need to wait until runtime to choose a method implementation. If the implementation can be determined during compilation, we speak of **early binding**. A Java class-level method is a good example, because it belongs to the class rather than to a particular object. Java’s `private` and `final` methods are likewise not overridden using ordinary virtual dispatch, although we shall encounter their exact rules in other contexts.

In the following example, `Student` declares a class-level method with the same name as a method in `Person`. In Java this is not overriding but **method hiding**. The calls `Person.getCategory()` and `Student.getCategory()` show exactly which method we intend to use. This is also why class-level methods should be called using the class name rather than through an object reference.

:::lang java
```java
class Person {
    public static String getCategory() {
        return "person";
    }
}
class Student extends Person {
    public static String getCategory() {
        return "student";
    }
}
class Main {
    public static void main(String[] args) {
        System.out.println(Person.getCategory());  // person
        System.out.println(Student.getCategory()); // student
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Person {
    public static string GetCategory() { return "person"; }
}
class Student : Person {
    public new static string GetCategory() { return "student"; }
}
class Program {
    static void Main() {
        Console.WriteLine(Person.GetCategory());  // person
        Console.WriteLine(Student.GetCategory()); // student
    }
}
```
:::end

:::lang python
```python
class Person:
    @staticmethod
    def get_category():
        return "person"

class Student(Person):
    @staticmethod
    def get_category():
        return "student"

print(Person.get_category())   # person
print(Student.get_category())  # student
# Python resolves attributes dynamically; this is not Java-style static binding.
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>
class Person {
public:
    static std::string getCategory() { return "person"; }
};
class Student : public Person {
public:
    static std::string getCategory() { return "student"; }
};
int main() {
    std::cout << Person::getCategory() << '\n';  // person
    std::cout << Student::getCategory() << '\n'; // student
}
```
:::end

There are significant differences between programming languages. In Java, overridable instance methods use late binding by default. In C#, the base-class method must be marked `virtual` and the derived method `override`. C++ also uses `virtual` to enable virtual dispatch, while Python looks up methods through its dynamic attribute system. Thus a Python `@staticmethod` is not identical to a Java static method. Our code examples use the natural approach in each language, without implying that every detail behaves identically.

Not only methods but also fields can be hidden in an inheritance hierarchy. However, **access to instance fields in Java does not use late binding**. If a derived class declares a field with the same name, the base-class field still exists, but the declared type and access rules determine which field a reference accesses. It is usually better to avoid reusing a field name in parent and child classes, because doing so makes the code harder to understand. For this reason, we mainly take advantage of late binding through overridden methods.

## Using late binding {#applications}

In the previous chapter, we learned that references to different derived-class objects can be stored in an array of the common base type and checked individually if necessary. With late binding, however, a separate branch for each object type is often unnecessary. It is enough that every derived class provides the same operation and implements it in its own way. For example, while traversing a `Person` array, we can call `introduce()` on each element, and the result depends on the actual object stored in that position.

Late binding also applies to methods inherited from the common `Object` base class. We have used some of these methods before; now we shall examine why they are worth overriding and how they support textual representation, object comparison and searching in collections.

## Methods inherited from Object {#object-methods}

As we have already seen, all Java classes ultimately inherit from `Object`, even when we do not specify it in the class declaration. Consequently, all objects provide the methods defined by `Object`, among which `toString()`, `equals()` and `hashCode()` are particularly useful. We can override these methods so that their behaviour reflects our own class rather than the general implementation. We have already used `toString()` to display objects; now we shall connect it to equality testing and hash-code calculation.

The `toString()` method returns a textual representation of an object. Unless we override it, the default implementation inherited from `Object` typically produces a string containing the class name and a hexadecimal representation of the object's hash code, which is not very useful for displaying its actual data. Therefore, we generally assemble the returned string from the object's important fields. When we pass an object to `System.out.println()`, Java calls its `toString()` method as needed, and late binding ensures that the version belonging to the object's actual type is executed.

:::lang java
```java
class Course {
    private String code;
    private String title;

    public Course(String code, String title) {
        this.code = code;
        this.title = title;
    }

    @Override
    public String toString() {
        return code + ": " + title;
    }
}

class Main {
    public static void main(String[] args) {
        Course course = new Course("OOP101", "Object-oriented programming");
        System.out.println(course);
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Course {
    private string code, title;
    public Course(string code, string title) {
        this.code = code;
        this.title = title;
    }
    public override string ToString() {
        return code + ": " + title;
    }
}
class Program {
    static void Main() {
        Course course = new Course("OOP101", "Object-oriented programming");
        Console.WriteLine(course);
    }
}
```
:::end

:::lang python
```python
class Course:
    def __init__(self, code, title):
        self.code = code
        self.title = title

    def __str__(self):
        return self.code + ": " + self.title

course = Course("OOP101", "Object-oriented programming")
print(course)
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>
class Course {
    std::string code, title;
public:
    Course(std::string code, std::string title)
        : code(code), title(title) { }
    std::string toString() const {
        return code + ": " + title;
    }
};
int main() {
    Course course("OOP101", "Object-oriented programming");
    std::cout << course.toString() << '\n';
}
```
:::end

The `equals(Object obj)` method determines whether two objects should be considered equal. The implementation inherited from `Object` compares their identity, meaning that it returns `true` only when the references refer to the very same object. Frequently, however, we want two different objects to be equal if some essential property has the same value. In our `Course` example, we can decide that two courses represent the same course when their course codes match, even if they are stored in two separate instances.

When overriding `equals()`, we must make sure that an object is equal to itself, that the outcome does not depend on which object is compared first, and that comparisons across three objects remain consistent. Comparing an object with `null` must return `false`, and the outcome should not change while the values used in the comparison remain unchanged. In our example, the course code is established in the constructor and cannot be modified afterwards, so our basis for equality remains stable.

Another important method inherited from `Object` is `hashCode()`. It produces an integer associated with an object, mainly used by hash-based collections to locate values efficiently. A fundamental rule is that **whenever two objects are equal according to `equals()`, they must return the same value from `hashCode()`**. The converse is not true: two unequal objects can have the same hash code. Therefore, whenever we override `equals()`, we usually override `hashCode()` as well, calculating both from the same significant fields.

:::lang java
```java
import java.util.ArrayList;
import java.util.HashSet;

class Course {
    private final String code;
    private String title;

    public Course(String code, String title) {
        if (code == null || code.isEmpty())
            throw new IllegalArgumentException("Invalid course code");
        this.code = code;
        this.title = title;
    }

    @Override
    public String toString() {
        return code + ": " + title;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Course other = (Course) obj;
        return code.equals(other.code);
    }

    @Override
    public int hashCode() {
        return code.hashCode();
    }
}

class Main {
    public static void main(String[] args) {
        Course first = new Course("OOP101", "OOP");
        Course second = new Course("OOP101", "Object-oriented programming");
        System.out.println(first.equals(second)); // true

        ArrayList<Course> list = new ArrayList<>();
        list.add(first);
        System.out.println(list.contains(second)); // true

        HashSet<Course> set = new HashSet<>();
        set.add(first);
        System.out.println(set.contains(second)); // true
    }
}
```
:::end

:::lang csharp
```csharp
using System;
using System.Collections.Generic;
class Course {
    private readonly string code;
    private string title;
    public Course(string code, string title) {
        if (string.IsNullOrEmpty(code))
            throw new ArgumentException("Invalid course code");
        this.code = code;
        this.title = title;
    }
    public override string ToString() { return code + ": " + title; }
    public override bool Equals(object obj) {
        Course other = obj as Course;
        return other != null && GetType() == other.GetType()
            && code == other.code;
    }
    public override int GetHashCode() { return code.GetHashCode(); }
}
class Program {
    static void Main() {
        Course first = new Course("OOP101", "OOP");
        Course second = new Course("OOP101", "Object-oriented programming");
        Console.WriteLine(first.Equals(second)); // True
        var list = new List<Course> { first };
        Console.WriteLine(list.Contains(second)); // True
        var set = new HashSet<Course> { first };
        Console.WriteLine(set.Contains(second)); // True
    }
}
```
:::end

:::lang python
```python
class Course:
    def __init__(self, code, title):
        if not code:
            raise ValueError("Invalid course code")
        self._code = code
        self.title = title

    def __str__(self):
        return self._code + ": " + self.title

    def __eq__(self, other):
        return type(self) is type(other) and self._code == other._code

    def __hash__(self):
        return hash(self._code)

first = Course("OOP101", "OOP")
second = Course("OOP101", "Object-oriented programming")
print(first == second)     # True
print(second in [first])   # True
print(second in {first})   # True
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>
#include <unordered_set>
#include <functional>
class Course {
    const std::string code;
    std::string title;
public:
    Course(std::string code, std::string title)
        : code(code), title(title) { }
    std::string toString() const { return code + ": " + title; }
    bool operator==(const Course& other) const { return code == other.code; }
    const std::string& getCode() const { return code; }
};
struct CourseHash {
    std::size_t operator()(const Course& course) const {
        return std::hash<std::string>{}(course.getCode());
    }
};
int main() {
    Course first("OOP101", "OOP");
    Course second("OOP101", "Object-oriented programming");
    std::cout << (first == second) << '\n';
    std::unordered_set<Course, CourseHash> courses;
    courses.insert(first);
    std::cout << (courses.find(second) != courses.end()) << '\n';
}
```
:::end

![Inherited and overridden methods of Object](content/chapters/07-kotes/media/object-methods-en.svg){width=510}

When using the container classes introduced earlier, we often need to determine whether a given object is already among the stored elements. Java's `ArrayList.contains()` compares elements using `equals()`, while `HashSet.contains()` also uses `hashCode()` to locate potential matches and checks equality using `equals()`. The example above creates two distinct `Course` objects with the same course code, so both collections recognize them as equal. If `hashCode()` and `equals()` did not agree, a hash-based collection could produce an incorrect result.

The Java method is named `hashCode()`, whereas the corresponding C# method is called `GetHashCode()`. Python uses the special methods `__str__()`, `__eq__()` and `__hash__()`, while C++ usually relies on its own methods and operators for textual representation and comparisons. Their syntax differs, but the requirement remains the same: equal objects must have equal hash codes whenever we store them in a hash-based container.

## Exercises {#exercises}

These tasks use method overriding for calculations and decisions that depend on the actual object type rather than for generating another description string. Extend the existing hierarchies with the specified operations; their signatures are also shown in the UML diagrams.

:::exercise
### Rectangles

![Rectangles – UML](content/chapters/07-kotes/media/complete-task-1-en.svg){width=620}



**Requirements**

- In `Shape`, implement `canFitInside(screenWidth : double, screenHeight : double) : boolean` to check whether the figure fits a rectangular display without rotation.
- The base implementation returns `false`, since a generic shape has no dimensions.
- In `Rectangle`, compare its width and height with the available dimensions; in `Circle`, check whether its diameter fits in both directions.
- Reject non-positive display dimensions with `IllegalArgumentException`.
- Add `isDisplayable(screenWidth : double, screenHeight : double) : boolean` to the base class; it simply calls `canFitInside()`.
- Demonstrate that the inherited method uses the correct implementation for different objects stored in a `Shape` list.
:::endexercise

:::exercise
### Books

![Books – UML](content/chapters/07-kotes/media/complete-task-2-en.svg){width=620}



**Requirements**

- Add `calculateLateFee(daysLate : int) : int` to `Publication`.
- The base class returns `0`, `Book` charges `50` forints per overdue day, and `Magazine` charges `20`.
- Reject a negative number of days.
- The inherited `calculateTotalLateFee(daysLate : int, copies : int) : int` calculates the fee for several copies using `calculateLateFee()`; `copies` must be positive.
- Show how the same inherited method calls different overridden implementations.
:::endexercise

:::exercise
### Cars

![Cars – UML](content/chapters/07-kotes/media/complete-task-3-en.svg){width=620}



**Requirements**

- Add `getServiceIntervalKm() : int` to `Vehicle`; the base implementation returns `0` for an unknown interval.
- `Car` returns `15000`, `Motorcycle` returns `6000`.
- The inherited `needsService(kmSinceService : int) : boolean` checks whether the distance since the last service reaches the actual vehicle's interval, returns `false` for an unknown interval, and rejects negative distances.
- Use a mixed `Vehicle` collection to identify vehicles due for service without type-specific calculations.
:::endexercise

:::exercise
### Bank accounts

![Bank accounts – UML](content/chapters/07-kotes/media/complete-task-4-en.svg){width=620}



**Requirements**

- Define `calculateTransferFee(amount : int) : int` in `BankAccount`: the base and `SavingsAccount` versions return `0`, whereas `BusinessAccount` charges the greater of `100` forints and one percent of the amount, rounded down to a whole forint.
- Every method rejects non-positive amounts.
- In the base class, `canAffordTransfer(amount : int) : boolean` determines whether the current balance covers the transfer amount plus the dynamically calculated fee.
- The method must not alter the balance.
- Test it via `BankAccount` references.
:::endexercise

:::exercise
### Movies

![Movies – UML](content/chapters/07-kotes/media/complete-task-5-en.svg){width=620}



**Requirements**

- In `MediaItem`, introduce `getViewingMinutes() : int` returning `0` by default.
- In `Movie`, return `duration`.
- In `Series`, add two private, positive integer fields: `episodesPerSeason` and `minutesPerEpisode`; calculate the total as `seasons × episodesPerSeason × minutesPerEpisode`.
- Add `canWatchWithin(maxMinutes : int) : boolean` to `MediaItem`; it returns `true` only for a known, positive running time not exceeding the given positive time limit.
- Invalid limits raise an exception.
- Find the items that fit into a `180`-minute time slot using a mixed collection.
:::endexercise

