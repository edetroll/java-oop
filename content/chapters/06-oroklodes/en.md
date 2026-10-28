# Inheritance

## The Principle of Inheritance {#inheritance-principle}

When we want to create a new class, we often find that many of its fields and methods are already present in a class we have implemented. Copying the existing source code is not a good solution, because the same functionality would have to be maintained in several places, and a later correction could easily be applied to one copy but not to the others. The OOP principle of **inheritance** allows us to derive a new, more specialized class from an existing one and reuse the elements we have already implemented. We call the existing class the **base class** (or parent class) and the new one the **derived class** (or child class).

Suppose we want to store information about university students and teachers. Members of both groups are people, so both have a name, and we can use the same methods to read or change that name. Instead of independently implementing name storage and its methods in two classes, we create a common `Person` base class and derive `Student` and `Teacher` from it. In Java we express inheritance with the `extends` keyword; in a derived class, we only need to write the additional fields and methods required for its specific responsibilities.

We must also consider whether the classes really have an **is-a** relationship. A student is a kind of person, and an electric car is a kind of car, so both relationships are suitable examples of inheritance. We should not use inheritance merely because two classes happen to contain fields with identical names, but because the derived class represents a more specialized form of the base class. A car may have an engine, but a car is not a kind of engine.

:::lang java
```java
class Person {
    private String name;

    public String getName() { return name; }
    public void setName(String value) { name = value; }
}

class Student extends Person {
    private String studentId;

    public void setStudentId(String value) { studentId = value; }
    public String getStudentId() { return studentId; }
    public void enroll(String course) {
        System.out.println(getName() + " enrolled in " + course);
    }
}

class Teacher extends Person {
    public void teach(String course) {
        System.out.println(getName() + " teaches " + course);
    }
}

class Main {
    public static void main(String[] args) {
        Student student = new Student();
        student.setName("Anna");
        student.setStudentId("ABC123");
        student.enroll("OOP");
    }
}
```
:::end

:::lang csharp
```csharp
using System;

class Person {
    private string name;
    public string GetName() { return name; }
    public void SetName(string value) { name = value; }
}

class Student : Person {
    private string studentId;
    public void SetStudentId(string value) { studentId = value; }
    public string GetStudentId() { return studentId; }
    public void Enroll(string course) {
        Console.WriteLine(GetName() + " enrolled in " + course);
    }
}

class Teacher : Person {
    public void Teach(string course) {
        Console.WriteLine(GetName() + " teaches " + course);
    }
}

class Program {
    static void Main() {
        Student student = new Student();
        student.SetName("Anna");
        student.SetStudentId("ABC123");
        student.Enroll("OOP");
    }
}
```
:::end

:::lang python
```python
class Person:
    def set_name(self, value):
        self._name = value

    def get_name(self):
        return self._name

class Student(Person):
    def set_student_id(self, value):
        self._student_id = value

    def get_student_id(self):
        return self._student_id

    def enroll(self, course):
        print(self.get_name() + " enrolled in " + course)

class Teacher(Person):
    def teach(self, course):
        print(self.get_name() + " teaches " + course)

student = Student()
student.set_name("Anna")
student.set_student_id("ABC123")
student.enroll("OOP")
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
    std::string getName() const { return name; }
};

class Student : public Person {
    std::string studentId;
public:
    void setStudentId(const std::string& value) { studentId = value; }
    std::string getStudentId() const { return studentId; }
    void enroll(const std::string& course) const {
        std::cout << getName() << " enrolled in " << course << '\n';
    }
};

class Teacher : public Person {
public:
    void teach(const std::string& course) const {
        std::cout << getName() << " teaches " << course << '\n';
    }
};

int main() {
    Student student;
    student.setName("Anna");
    student.setStudentId("ABC123");
    student.enroll("OOP");
}
```
:::end

![Inheritance between Person, Student and Teacher](content/chapters/06-oroklodes/media/inheritance-en.svg){width=640}

## Inherited Members and Their Accessibility {#inherited-members}

In addition to the fields and methods inherited from the base class, the derived class may naturally introduce new fields and methods of its own. In our example, `Student` adds a `studentId` field and an `enroll()` method, while it can also use the `getName()` and `setName()` methods inherited from `Person`. Constructors are an exception to this simple rule: constructors are not inherited in Java. Class-level fields and methods may also be accessible from a derived class, but they belong to the class itself rather than being duplicated in every instance.

We must distinguish between an inherited object's internal state and what the source code of the derived class can access directly. Public methods are available from both the derived class and the main program, while Java's `protected` members are accessible within the same package and, under inheritance access rules, from derived classes. The base class's `private` fields remain part of the object's internal state, but in Java they are not inherited as directly accessible members: code in the derived class must access them through suitable methods of the base class. This means that information hiding remains effective even when we extend a class.

In the next example, `Student` can access the inherited `age` field directly, but it cannot directly refer to the private `name` field. To retrieve the name, it calls the public `getName()` method it already received from the base class. This preserves the access rules we established earlier, just as if we were using the object from the main program. In the UML diagram, inheritance is shown by a solid line ending in a hollow triangle pointing towards the base class.

:::lang java
```java
class Person {
    private String name;
    protected int age;

    public String getName() { return name; }
    public void setName(String value) { name = value; }
}

class Student extends Person {
    public String describe() {
        // name is private: it cannot be accessed directly here.
        return getName() + " (" + age + ")";
    }
}
```
:::end

:::lang csharp
```csharp
class Person {
    private string name;
    protected int age;
    public string GetName() { return name; }
    public void SetName(string value) { name = value; }
}

class Student : Person {
    public string Describe() {
        // name is private: use the inherited getter.
        return GetName() + " (" + age + ")";
    }
}
```
:::end

:::lang python
```python
class Person:
    def set_name(self, value):
        self.__name = value

    def get_name(self):
        return self.__name

class Student(Person):
    def describe(self):
        # _age is a naming convention, not protected access control.
        return self.get_name() + " (" + str(self._age) + ")"
```
:::end

:::lang cpp
```cpp
#include <string>

class Person {
    std::string name;
protected:
    int age = 0;
public:
    std::string getName() const { return name; }
    void setName(const std::string& value) { name = value; }
};

class Student : public Person {
public:
    std::string describe() const {
        // name is private: use the inherited getter.
        return getName() + " (" + std::to_string(age) + ")";
    }
};
```
:::end

![Visibility in a derived class](content/chapters/06-oroklodes/media/visibility-en.svg){width=430}

## Inheritance Hierarchies {#inheritance-hierarchies}

A class may have several different derived classes, and we may derive additional classes from an existing derived class. The result is an **inheritance hierarchy**, in which more general classes appear above more specialized ones. For example, `ScholarshipStudent` derives from `Student`, so it can use not only the methods introduced for students but also those inherited from `Person`. UML class diagrams make these relationships particularly easy to follow.

In Java and C#, a class may directly inherit from at most one other class. C++ and Python also support **multiple inheritance**, where one class can have several direct base classes at the same time. The example below uses single inheritance in all four languages, so we can focus on how the hierarchy works. We do not need to examine the additional complications of multiple inheritance in detail here.

In Java, if we do not explicitly specify a parent for a class, its parent is `Object`; `Object` itself is the root of the class hierarchy. Consequently, the objects we create have access to basic operations that we have already used, such as `toString()`. UML diagrams normally omit `Object` above every class, because drawing it repeatedly would make the diagrams unnecessarily complicated.

:::lang java
```java
class Person { public void greet() { System.out.println("Hello!"); } }
class Student extends Person { public void enroll() { } }
class ScholarshipStudent extends Student { public void applyForScholarship() { } }
class Teacher extends Person { public void teach() { } }

class Main {
    public static void main(String[] args) {
        ScholarshipStudent student = new ScholarshipStudent();
        student.greet();
        student.enroll();
        student.applyForScholarship();
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Person { public void Greet() { Console.WriteLine("Hello!"); } }
class Student : Person { public void Enroll() { } }
class ScholarshipStudent : Student { public void ApplyForScholarship() { } }
class Teacher : Person { public void Teach() { } }

class Program {
    static void Main() {
        ScholarshipStudent student = new ScholarshipStudent();
        student.Greet();
        student.Enroll();
        student.ApplyForScholarship();
    }
}
```
:::end

:::lang python
```python
class Person:
    def greet(self):
        print("Hello!")

class Student(Person):
    def enroll(self):
        pass

class ScholarshipStudent(Student):
    def apply_for_scholarship(self):
        pass

class Teacher(Person):
    def teach(self):
        pass

student = ScholarshipStudent()
student.greet()
student.enroll()
student.apply_for_scholarship()
```
:::end

:::lang cpp
```cpp
#include <iostream>

class Person {
public:
    void greet() { std::cout << "Hello!\n"; }
};
class Student : public Person { public: void enroll() {} };
class ScholarshipStudent : public Student {
public:
    void applyForScholarship() {}
};
class Teacher : public Person { public: void teach() {} };

int main() {
    ScholarshipStudent student;
    student.greet();
    student.enroll();
    student.applyForScholarship();
}
```
:::end

![Multilevel inheritance hierarchy](content/chapters/06-oroklodes/media/hierarchy-en.svg){width=630}

## Type Compatibility {#type-compatibility}

One of the most important consequences of inheritance is **type compatibility**. If `Student` derives from `Person`, we can use a `Student` instance wherever a `Person` is expected. This is possible because every student is also a person and supports the operations provided by the base class. The reverse is generally not true: a person is not necessarily a student.

In Java, the compiler automatically accepts a derived-class object through a compatible base-class reference; this is called **upcasting**. No new object is created: we simply refer to the same instance through a variable of a more general type. In the example, the variable `person` has the **declared or static type** `Person`, while the object it refers to has the **actual or runtime type** `Student`. Through the reference, we may directly use only the members known to the declared `Person` type, even though the object itself has additional capabilities.

Type compatibility is **transitive**: if `ScholarshipStudent` derives from `Student` and `Student` derives from `Person`, a `ScholarshipStudent` object is also compatible with `Person`. This allows us to implement general-purpose methods that expect a base-class argument but also accept any of its derived classes. The same idea allows us to store students and teachers together in an array of `Person` references.

:::lang java
```java
class Person { public void greet() { } }
class Student extends Person { public void enroll() { } }

class Main {
    public static void processPerson(Person value) { value.greet(); }
    public static void main(String[] args) {
        Student student = new Student();
        processPerson(student);
        Person person = student;      // Automatic conversion to the base type.
        person.greet();              // Available through Person.
        // person.enroll();           // Not available through Person.
        Student original = (Student) person; // Safe: the object is Student.
        original.enroll();
    }
}
```
:::end

:::lang csharp
```csharp
class Person { public void Greet() {} }
class Student : Person { public void Enroll() {} }

class Program {
    static void ProcessPerson(Person value) { value.Greet(); }
    static void Main() {
        Student student = new Student();
        ProcessPerson(student);
        Person person = student;        // Upcast.
        person.Greet();
        // person.Enroll();             // Not available through Person.
        Student original = (Student)person;
        original.Enroll();
    }
}
```
:::end

:::lang python
```python
class Person:
    def greet(self):
        pass

class Student(Person):
    def enroll(self):
        pass

def process_person(person):
    person.greet()

student = Student()
process_person(student)
person = student       # Both names reference the same object.
person.greet()
person.enroll()       # Python checks the object at runtime.
```
:::end

:::lang cpp
```cpp
class Person { public: void greet() {} };
class Student : public Person { public: void enroll() {} };

void processPerson(Person& value) { value.greet(); }

int main() {
    Student student;
    processPerson(student);
    Person& person = student;     // Base-class reference to Student.
    person.greet();
    // person.enroll();           // Not available through Person.
    Student& original = static_cast<Student&>(person);
    original.enroll();           // Safe here: the object is Student.
}
```
:::end

### Type Conversion and Type Checking {#type-casting}

Sometimes a reference has a general base-class type, but we know that it actually refers to an object of a more specialized type and want to use the extra methods of that type. In this case we perform **downcasting**. In Java we write the target type in parentheses, for example `(Student) person`. This conversion still does not create a new object; it only allows us to work with the existing object through a reference of a different type.

Downcasting is valid only when the actual object really has the requested derived type. Otherwise Java throws a `ClassCastException` at runtime, so when the object's type is not known we should check it first. We use the `instanceof` operator for this purpose; it returns a boolean indicating whether the object is compatible with the specified type. Modern Java also supports `instanceof Student student`, which checks the type and introduces a correctly typed variable at the same time, so a separate cast is no longer necessary.

There are important differences between the languages in this area. C# uses the `is` operator, whereas Python offers the `isinstance()` function and does not require a separate cast in order to call the object's methods. In C++, `dynamic_cast` can perform runtime type checks when the base class is polymorphic; our example therefore gives the base class a virtual destructor. We will examine those details later. For now, it is sufficient to understand that a downward conversion may fail and that we must check whether it is valid.

:::lang java
```java
class Person { }
class Student extends Person {
    public String getStudentId() { return "ABC123"; }
}

class Main {
    public static void main(String[] args) {
        Person person = new Student();
        if (person instanceof Student student) {
            System.out.println(student.getStudentId());
        }
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Person { }
class Student : Person {
    public string GetStudentId() { return "ABC123"; }
}

class Program {
    static void Main() {
        Person person = new Student();
        if (person is Student student) {
            Console.WriteLine(student.GetStudentId());
        }
    }
}
```
:::end

:::lang python
```python
class Person:
    pass

class Student(Person):
    def get_student_id(self):
        return "ABC123"

person = Student()
if isinstance(person, Student):
    print(person.get_student_id())
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>

class Person {
public:
    virtual ~Person() = default; // Enables runtime type checking.
};
class Student : public Person {
public:
    std::string getStudentId() const { return "ABC123"; }
};

int main() {
    Student student;
    Person* person = &student;
    if (Student* result = dynamic_cast<Student*>(person)) {
        std::cout << result->getStudentId() << '\n';
    }
}
```
:::end

### Selection Based on Type {#type-selection}

Type compatibility becomes especially useful when we want to manage objects of several derived types in a single collection. For example, we can create an array of `Person` references holding both students and teachers, because both types are compatible with the common base class. When we traverse the array, we can use the methods of `Person` on every element. If a particular operation should only be performed on students, we can select those objects by checking their actual types.

In the following example, we traverse an array of people and call `enroll()` only for elements whose actual type is `Student`. At the same time we count the students without copying them into a separate array. The key point is that the common base class lets us store the objects uniformly while still distinguishing their specific types when required. We do not yet need method overriding to implement this behavior.

:::lang java
```java
class Person { }
class Student extends Person {
    public void enroll() { System.out.println("Student"); }
}
class Teacher extends Person { }

class Main {
    public static void main(String[] args) {
        Person[] people = {new Student(), new Teacher(), new Student()};
        int studentCount = 0;
        for (Person person : people) {
            if (person instanceof Student student) {
                student.enroll();
                studentCount++;
            }
        }
        System.out.println(studentCount);
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Person { }
class Student : Person {
    public void Enroll() { Console.WriteLine("Student"); }
}
class Teacher : Person { }

class Program {
    static void Main() {
        Person[] people = {new Student(), new Teacher(), new Student()};
        int studentCount = 0;
        foreach (Person person in people) {
            if (person is Student student) {
                student.Enroll();
                studentCount++;
            }
        }
        Console.WriteLine(studentCount);
    }
}
```
:::end

:::lang python
```python
class Person:
    pass

class Student(Person):
    def enroll(self):
        print("Student")

class Teacher(Person):
    pass

people = [Student(), Teacher(), Student()]
student_count = 0
for person in people:
    if isinstance(person, Student):
        person.enroll()
        student_count += 1
print(student_count)
```
:::end

:::lang cpp
```cpp
#include <iostream>
class Person {
public:
    virtual ~Person() = default;
};
class Student : public Person {
public:
    void enroll() { std::cout << "Student\n"; }
};
class Teacher : public Person { };

int main() {
    Student first, second;
    Teacher teacher;
    Person* people[] = {&first, &teacher, &second};
    int studentCount = 0;
    for (Person* person : people) {
        if (Student* student = dynamic_cast<Student*>(person)) {
            student->enroll();
            studentCount++;
        }
    }
    std::cout << studentCount << '\n';
}
```
:::end

## Exercises {#exercises}

The exercises focus on moving common data into superclasses, using inheritance, and handling objects of different types together. Each field description also specifies its getter and setter. Unless stated otherwise, a setter must throw `IllegalArgumentException` when given an invalid value without changing the previous field value.

:::exercise
### Rectangles

![Rectangles – UML](content/chapters/06-oroklodes/media/complete-task-1-en.svg){width=620}

Create a `Shape` superclass for the existing `Rectangle` class, and derive a new `Circle` class from it as well. Colour is a common property and must be stored only in the superclass.

**`Shape` – fields**

- **`color : String`** – a private field storing the shape's colour. The public `getColor() : String` returns its current value. The `setColor(color : String) : void` setter must reject `null`, empty strings, and strings containing only whitespace.

**`Rectangle` – fields**

- **`x : double`** – horizontal coordinate of the top-left corner; any real number is allowed. The private field has public `getX() : double` and `setX(x : double) : void` methods, which return and update the coordinate.
- **`y : double`** – vertical coordinate of the top-left corner; any real number is allowed. The public `getY() : double` returns the stored value, and `setY(y : double) : void` updates it. Positive vertical direction points upward.
- **`width : double`** – rectangle width, which must be strictly positive. The `getWidth() : double` getter returns the current width; `setWidth(width : double) : void` accepts positive values only.
- **`height : double`** – rectangle height, which must also be strictly positive. The `getHeight() : double` getter returns the stored height; `setHeight(height : double) : void` rejects zero and negative values.
- **`CREATED_COUNT : int`** – a private static counter initially equal to `0`. It increases exactly once for each successfully created rectangle. The public static `getCreatedCount() : int` returns the total number created; there is no setter.

**`Rectangle` – constructors and operations**

`Rectangle()` creates a `1 × 1` rectangle whose top-left corner is `(0, 0)`. `Rectangle(x : double, y : double, width : double, height : double)` uses the supplied values and validates width and height. Delegating between constructors must not count the same instance twice.

- **`getArea() : double`** – returns width multiplied by height.
- **`getPerimeter() : double`** – returns `2 × (width + height)`.
- **`overlaps(other : Rectangle) : boolean`** – returns true only if the two rectangles share a region with positive area. Touching along an edge or at one corner does not count as overlap.
- **`getQuadrant() : int`** – returns a number from `1` to `4` when the entire rectangle lies strictly inside one quadrant; otherwise, including when touching an axis, returns `-1`.

**`Circle` – fields and operations**

- **`radius : double`** – a private radius that must be positive. `getRadius() : double` returns the stored value; `setRadius(radius : double) : void` rejects invalid values.

The circle's `getArea() : double` returns `π × radius²`, and `getPerimeter() : double` returns `2 × π × radius`. These are new methods of `Circle`; do not define them in `Shape` yet.

**Main program**

Store rectangles and circles together in an `ArrayList<Shape>`. Use `instanceof` to select the circles into a new list, then calculate the sum of their areas. Notice that both subclasses access colour using the inherited methods.
:::endexercise

:::exercise
### Books

![Books – UML](content/chapters/06-oroklodes/media/complete-task-2-en.svg){width=620}

Create a `Publication` superclass, then derive the existing `Book` and a new `Magazine` class from it. Publisher and country are shared data, so neither subclass should declare duplicate fields for them.

**`Publication` – fields**

- **`publisher : String`** – private publisher name. `getPublisher() : String` returns the stored name; `setPublisher(publisher : String) : void` rejects `null` or empty strings.
- **`country : String`** – private name of the publication country. `getCountry() : String` returns the stored country; `setCountry(country : String) : void` rejects `null`, empty, or whitespace-only strings.

**`Book` – fields**

- **`author : String`** – author name. `getAuthor() : String` returns the stored name; `setAuthor(author : String) : void` requires at least two characters and permits only letters, spaces, periods, and hyphens.
- **`title : String`** – book title. `getTitle() : String` returns the stored title; `setTitle(title : String) : void` accepts only non-`null` strings of at least two characters.
- **`price : int`** – price in whole Hungarian forints. `getPrice() : int` returns the current price; `setPrice(price : int) : void` permits only values in `[500, 50000]`.
- **`genre : Genre`** – book genre, with values such as `BIOGRAPHY`, `HORROR`, `DRAMA`, `HISTORY`, `SCIFI`, and `COMEDY`. `getGenre() : Genre` returns the stored value; `setGenre(genre : Genre) : void` rejects `null`.
- **`printed : boolean`** – true for a printed book, false for an e-book. `isPrinted() : boolean` returns the stored flag; `setPrinted(printed : boolean) : void` updates it without additional validation.
- **`MIN_PRICE : int` and `MAX_PRICE : int`** – public `static final` constants of `Book`, equal to `500` and `50000`. The public static `isValidPrice(price : int) : boolean` returns whether a value lies within these limits.

**`Book` – constructors and operations**

`Book(author : String, title : String, price : int, genre : Genre, printed : boolean)` validates and initializes all book-specific fields. `Book(author : String, title : String, price : int)` delegates to the full constructor, using `Genre.DRAMA` and a printed book as defaults. The shared publication fields can be assigned through inherited setters.

- **`discount(percent : int) : void`** – applies a reduction from `1` to `99` percent, rounding the resulting price down to whole forints. An invalid percentage or a resulting price below `899` must leave the stored price unchanged.
- **`toString() : String`** – returns a readable text containing the important book data.

**`Magazine` – fields**

- **`title : String`** – private magazine title. `getTitle() : String` returns the stored title; `setTitle(title : String) : void` rejects `null` and empty strings.
- **`issueNumber : int`** – positive issue number. `getIssueNumber() : int` returns the stored number; `setIssueNumber(issueNumber : int) : void` rejects zero and negative values.

**Main program**

Create books and magazines, set their common publication fields, and store them together in an `ArrayList<Publication>`. Select magazines using type checks and display their titles, issue numbers, and publishers.
:::endexercise

:::exercise
### Cars

![Cars – UML](content/chapters/06-oroklodes/media/complete-task-3-en.svg){width=620}

Move the brand field from the existing `Car` class into a new `Vehicle` superclass, which also stores maximum speed. Add a `Motorcycle` subclass. Neither subclass may duplicate the common fields.

**`Vehicle` – fields**

- **`brand : String`** – private brand name. `getBrand() : String` returns the current brand; `setBrand(brand : String) : void` rejects `null` and empty strings.
- **`maxSpeed : int`** – maximum speed in km/h; a positive integer. `getMaxSpeed() : int` returns the stored speed; `setMaxSpeed(maxSpeed : int) : void` rejects nonpositive values.

**`Car` – fields**

- **`model : String`** – model name. `getModel() : String` returns it; `setModel(model : String) : void` permits only nonempty strings.
- **`year : int`** – production year within `[1886, 2100]`. `getYear() : int` returns the year; `setYear(year : int) : void` rejects out-of-range values.
- **`mileage : int`** – mileage in whole kilometres; never negative. `getMileage() : int` returns the stored value. There is no public setter: mileage changes only through a constructor or `drive()`.
- **`id : int`** – automatically assigned positive instance identifier. `getId() : int` returns it; it stays unchanged throughout the instance's lifetime and has no setter.
- **`NEXT_ID : int`** – private static field initially equal to `1`. Each new `Car` receives the current value as its ID, after which the counter increases by one.

**`Car` – constructors and operations**

`Car(brand : String, model : String, year : int, mileage : int)` validates its arguments. `Car(brand : String, model : String, year : int)` delegates to it, using zero mileage. Use the superclass setter to assign the brand.

- **`drive(distance : int) : void`** – increases mileage by a strictly positive whole number of kilometres only.
- **`toString() : String`** – returns text containing brand, model, year, and current mileage.

**`Motorcycle` – fields**

- **`engineCapacity : int`** – engine displacement in cm³; a positive integer. `getEngineCapacity() : int` returns it; `setEngineCapacity(engineCapacity : int) : void` accepts positive values only.
- **`sidecar : boolean`** – indicates whether a sidecar is attached. `hasSidecar() : boolean` returns the stored flag; `setSidecar(sidecar : boolean) : void` updates it with any boolean value.

**Main program**

Store cars and motorcycles together in an `ArrayList<Vehicle>`. Select motorcycles and count those with sidecars. Demonstrate that both kinds of vehicle expose their brand through methods inherited from `Vehicle`.
:::endexercise

:::exercise
### Bank accounts

![Bank accounts – UML](content/chapters/06-oroklodes/media/complete-task-4-en.svg){width=620}

Create a simple `BankAccount` superclass and derive `SavingsAccount` and `BusinessAccount`. Do not redeclare inherited fields in either subclass.

**`BankAccount` – fields**

- **`owner : String`** – account holder name. `getOwner() : String` returns the stored name; `setOwner(owner : String) : void` rejects `null` or empty strings.
- **`accountNumber : String`** – account identifier. `getAccountNumber() : String` returns it. `setAccountNumber(accountNumber : String) : void` allows the first valid assignment only; once set, the number cannot change. It must reject `null` or empty strings.
- **`balance : int`** – balance in whole forints, initially `0`. `getBalance() : int` returns the current amount. No public setter is permitted; only deposit and withdrawal operations can update it, and it cannot become negative.

**`BankAccount` – operations**

- **`deposit(amount : int) : void`** – adds a strictly positive amount to the balance.
- **`withdraw(amount : int) : void`** – subtracts only a positive amount not exceeding the available balance. Invalid amounts must not change the balance.

**`SavingsAccount` – fields**

- **`interestRate : double`** – annual interest rate within `[0, 1]`. `getInterestRate() : double` returns the stored rate; `setInterestRate(interestRate : double) : void` rejects values outside that interval.

**`BusinessAccount` – fields**

- **`companyName : String`** – company name. `getCompanyName() : String` returns the stored name; `setCompanyName(companyName : String) : void` accepts only nonempty, non-`null` text.

**Main program**

Create both account types, initialize their data, and perform deposits and withdrawals. Store them in an `ArrayList<BankAccount>` and use type checks to select business accounts. Display each selected account's owner, company name, and balance.
:::endexercise

:::exercise
### Movies

![Movies – UML](content/chapters/06-oroklodes/media/complete-task-5-en.svg){width=620}

Create a `MediaItem` superclass with `Movie` and `Series` subclasses. Title and release year are shared fields and must appear only in `MediaItem`.

**`MediaItem` – fields**

- **`title : String`** – private title. `getTitle() : String` returns it; `setTitle(title : String) : void` accepts only non-`null` titles containing at least two characters.
- **`releaseYear : int`** – release year as a positive integer. `getReleaseYear() : int` returns it; `setReleaseYear(releaseYear : int) : void` rejects zero and negative values.

**`Movie` – fields**

- **`director : String`** – director name. `getDirector() : String` returns it; `setDirector(director : String) : void` requires a non-`null` value of at least two characters, containing only letters, spaces, periods, and hyphens.
- **`duration : int`** – running time in minutes, within `[10, 360]`. `getDuration() : int` returns it; `setDuration(duration : int) : void` rejects out-of-range values.

**`Series` – fields**

- **`seasons : int`** – positive number of completed seasons. `getSeasons() : int` returns it; `setSeasons(seasons : int) : void` accepts positive values only.

**Main program**

Create several movies and series and store them in an `ArrayList<MediaItem>`. Use type checks to select series, then display their titles, release years, and numbers of seasons.
:::endexercise
