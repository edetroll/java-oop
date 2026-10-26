# Class-Level Fields and Methods

## Memory Management {#memory}

So far, we have created classes whose fields and methods belong to individual objects. When we create several instances of the same class, each object has its own fields, so changing the data of one object does not change the fields of another object with the same names. For example, when we create two students, their names and earned credits are stored independently. We call these **instance fields**.

In Java, objects created using the `new` keyword are stored in the **heap**. The `first` and `second` variables declared in the main program do not contain the objects themselves, but **references** to them. The objects are drawn side by side in the diagram for clarity, although they do not necessarily occupy adjacent locations in memory. An object's fields belong to that instance; if a field refers to another object, such as a string, that object may be stored separately.

:::lang java
```java
class Student {
    private String name;
    private int credits;

    public Student(String name, int credits) {
        this.name = name;
        this.credits = credits;
    }
}

class Main {
    public static void main(String[] args) {
        Student first = new Student("Anna", 30);
        Student second = new Student("Bela", 45);
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Student
{
    private string name;
    private int credits;

    public Student(string name, int credits)
    {
        this.name = name;
        this.credits = credits;
    }
}

class Program
{
    static void Main(string[] args)
    {
        Student first = new Student("Anna", 30);
        Student second = new Student("Bela", 45);
    }
}
```
:::end

:::lang python
```python
class Student:
    def __init__(self, name, credits):
        self.name = name
        self.credits = credits

first = Student("Anna", 30)
second = Student("Bela", 45)
```
:::end

:::lang cpp
```cpp
#include <string>

class Student {
    std::string name;
    int credits;
public:
    Student(const std::string& name, int credits)
        : name(name), credits(credits) {}
};

int main() {
    Student first("Anna", 30);
    Student second("Bela", 45);
}
```
:::end

![Instances and references](content/chapters/05-osztalyszintu-elemek/media/memory-instances-en.svg){width=620}

Instance methods work somewhat differently. Although we always invoke such a method on a particular object, a separate copy of the method's program code is not created for every instance. The method executes the same code, but through `this` it accesses the fields of the instance on which it was called. That is why the same method can work with `30` credits for one student and `45` for another.

## Class-Level Fields {#static-fields}

We often need to store information that belongs not to one particular object but to the class as a whole. For students, this could be the name of their university, provided that every student in our application attends the same university. It would be unnecessary to store the same text separately in each student, because we want every instance to access identical information. In this case we create a **class-level field**, which has a single shared value for the class, regardless of how many objects have been created.

In Java, we mark class-level fields with the `static` keyword. Such a field should be accessed through the class name, for example `Student.UNIVERSITY_NAME`, while instance fields are accessed through a particular object. Class-level fields can have `public` or `private` visibility just like the fields we learned about earlier. For simplicity, the following example makes the university name directly accessible, but in real applications it is worth controlling access to mutable class-level data through methods.

:::lang java
```java
class Student {
    public static String UNIVERSITY_NAME = "Example University";
    private String name;

    public Student(String name) {
        this.name = name;
    }
}

class Main {
    public static void main(String[] args) {
        Student first = new Student("Anna");
        Student second = new Student("Bela");
        System.out.println(Student.UNIVERSITY_NAME);
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Student
{
    public static string UNIVERSITY_NAME = "Example University";
    private string name;

    public Student(string name)
    {
        this.name = name;
    }
}

class Program
{
    static void Main(string[] args)
    {
        Student first = new Student("Anna");
        Student second = new Student("Bela");
        Console.WriteLine(Student.UNIVERSITY_NAME);
    }
}
```
:::end

:::lang python
```python
class Student:
    UNIVERSITY_NAME = "Example University"

    def __init__(self, name):
        self.name = name

first = Student("Anna")
second = Student("Bela")
print(Student.UNIVERSITY_NAME)
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>

class Student {
public:
    inline static std::string UNIVERSITY_NAME = "Example University";
private:
    std::string name;
public:
    explicit Student(const std::string& name) : name(name) {}
};

int main() {
    Student first("Anna");
    Student second("Bela");
    std::cout << Student::UNIVERSITY_NAME << '\n';
}
```
:::end

![Shared class-level field and instances](content/chapters/05-osztalyszintu-elemek/media/memory-en.svg){width=760}

Throughout this material, to make the distinction easier to recognize, we write class-level field names in uppercase and separate words with underscores, for example `UNIVERSITY_NAME` or `NEXT_ID`. For mutable static fields, this is our own naming convention; the usual Java convention primarily uses this form for constants. We continue to name class-level methods in the usual way.

A class-level field is not part of a particular `Student` object, but is shared data associated with the class. If we change the name of the university, every instance will see the new value because we have modified one shared field rather than separate fields in every object. This does not make the students' remaining information shared: the `name` field still belongs to each individual object.

### Class-Level Constants {#constants}

Some class-level values must not change while the application is running. Examples include the permitted maximum number of credits or an institutional identifier that we regard as fixed during execution. In Java, we mark these fields with `final` as well as `static`. According to Java's usual naming conventions, class-level constants are also written in uppercase with underscores between words.

:::lang java
```java
class Student {
    public static final int MAX_CREDITS = 300;
}

class Main {
    public static void main(String[] args) {
        System.out.println(Student.MAX_CREDITS);
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Student
{
    public const int MAX_CREDITS = 300;
}

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine(Student.MAX_CREDITS);
    }
}
```
:::end

:::lang python
```python
class Student:
    MAX_CREDITS = 300

print(Student.MAX_CREDITS)
```
:::end

:::lang cpp
```cpp
#include <iostream>

class Student {
public:
    static constexpr int MAX_CREDITS = 300;
};

int main() {
    std::cout << Student::MAX_CREDITS << '\n';
}
```
:::end

The `final` keyword prevents a Java program from assigning a new value to the field later. However, if the field refers to an object, `final` alone does not prevent that object's internal state from changing. In C#, we use `const` for the simple constant shown here, while C++ provides `constexpr` for similar purposes. In Python, uppercase spelling is only a naming convention and does not itself prevent later modification of the value.

## Class-Level Methods {#static-methods}

Fields are not the only class members that can be class-level: methods can be class-level as well. We do not need to create an object before calling such a method, so these methods are particularly useful for working with the class's shared data or for operations that do not require object state at all. Reading or modifying the university name provides a simple example. In the following solution, we make the previously public field `private` and provide access through class-level methods.

:::lang java
```java
class Student {
    private static String UNIVERSITY_NAME = "Example University";

    public static String getUniversityName() {
        return UNIVERSITY_NAME;
    }

    public static void setUniversityName(String value) {
        if (value == null || value.isBlank())
            throw new IllegalArgumentException("Invalid university name.");
        UNIVERSITY_NAME = value;
    }
}

class Main {
    public static void main(String[] args) {
        Student.setUniversityName("New University");
        System.out.println(Student.getUniversityName());
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Student
{
    private static string UNIVERSITY_NAME = "Example University";

    public static string GetUniversityName()
    {
        return UNIVERSITY_NAME;
    }

    public static void SetUniversityName(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Invalid university name.");
        UNIVERSITY_NAME = value;
    }
}

class Program
{
    static void Main(string[] args)
    {
        Student.SetUniversityName("New University");
        Console.WriteLine(Student.GetUniversityName());
    }
}
```
:::end

:::lang python
```python
class Student:
    _UNIVERSITY_NAME = "Example University"

    @classmethod
    def get_university_name(cls):
        return cls._UNIVERSITY_NAME

    @classmethod
    def set_university_name(cls, value):
        if not value or not value.strip():
            raise ValueError("Invalid university name.")
        cls._UNIVERSITY_NAME = value

Student.set_university_name("New University")
print(Student.get_university_name())
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <stdexcept>
#include <string>

class Student {
    inline static std::string UNIVERSITY_NAME = "Example University";
public:
    static std::string getUniversityName() {
        return UNIVERSITY_NAME;
    }

    static void setUniversityName(const std::string& value) {
        if (value.empty())
            throw std::invalid_argument("Invalid university name.");
        UNIVERSITY_NAME = value;
    }
};

int main() {
    Student::setUniversityName("New University");
    std::cout << Student::getUniversityName() << '\n';
}
```
:::end

Java and C# use the `static` keyword for class-level methods, and C++ uses a similar mechanism. Python offers `@classmethod`, which automatically receives the class through the `cls` parameter, and `@staticmethod`, which automatically receives neither the class nor an instance. The two Python mechanisms are therefore not identical; we choose whichever is better suited to the operation we want to perform.

### Access Rules {#access}

Instance methods can directly access both the fields and methods of the current object and the class-level members. Class-level methods have no current instance, so they can directly use only class-level fields and methods. This does not mean that a static method can never access instance data: if it has a reference to a particular object, it can use that reference to access the object's fields and methods. Since the access takes place inside the defining class, it can also include `private` fields.

:::lang java
```java
class Student {
    private String name;
    private static String UNIVERSITY_NAME = "Example University";

    public Student(String name) {
        this.name = name;
    }

    public String getDescription() {
        return name + " - " + UNIVERSITY_NAME;
    }

    public static String describe(Student student) {
        return student.name + " - " + UNIVERSITY_NAME;
        // return name; // Invalid: no current instance.
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Student
{
    private string name;
    private static string UNIVERSITY_NAME = "Example University";

    public Student(string name) { this.name = name; }

    public string GetDescription()
    {
        return name + " - " + UNIVERSITY_NAME;
    }

    public static string Describe(Student student)
    {
        return student.name + " - " + UNIVERSITY_NAME;
        // return name; // Invalid: no current instance.
    }
}
```
:::end

:::lang python
```python
class Student:
    UNIVERSITY_NAME = "Example University"

    def __init__(self, name):
        self.name = name

    def get_description(self):
        return self.name + " - " + Student.UNIVERSITY_NAME

    @staticmethod
    def describe(student):
        return student.name + " - " + Student.UNIVERSITY_NAME
```
:::end

:::lang cpp
```cpp
#include <string>

class Student {
    std::string name;
    inline static std::string UNIVERSITY_NAME = "Example University";
public:
    explicit Student(const std::string& name) : name(name) {}

    std::string getDescription() const {
        return name + " - " + UNIVERSITY_NAME;
    }

    static std::string describe(const Student& student) {
        return student.name + " - " + UNIVERSITY_NAME;
        // return name; // Invalid: no current instance.
    }
};
```
:::end

In UML class diagrams, we **underline** class-level fields and methods, allowing us to distinguish them from instance members. The notation is independent of the member's visibility, so a `+` or `-` may appear alongside the underline. In the diagram below, `name` is an instance field, whereas `UNIVERSITY_NAME` and `getUniversityName()` are class-level members.

![Student UML class diagram](content/chapters/05-osztalyszintu-elemek/media/student-static-en.svg){width=420}

## Static Constructor {#static-initialization}

We used constructors to assign initial values to instance fields, but we must not initialize shared class-level fields every time we create a new object. In most cases, it is sufficient to give a class-level field its initial value directly in its declaration. Sometimes, however, initialization requires more complex operations, such as calculating several values or checking a setting. Java provides a **static initialization block** using `static { ... }` for this purpose; Java has no separate static constructor.

:::lang java
```java
class Student {
    private static int NEXT_ID;

    static {
        NEXT_ID = 1000;
        System.out.println("Student class initialized.");
    }

    public static int getNextId() {
        return NEXT_ID;
    }
}

class Main {
    public static void main(String[] args) {
        System.out.println(Student.getNextId());
        System.out.println(Student.getNextId());
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Student
{
    private static int NEXT_ID;

    static Student()
    {
        NEXT_ID = 1000;
        Console.WriteLine("Student class initialized.");
    }

    public static int GetNextId() { return NEXT_ID; }
}

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine(Student.GetNextId());
        Console.WriteLine(Student.GetNextId());
    }
}
```
:::end

:::lang python
```python
class Student:
    NEXT_ID = 1000
    print("Student class initialized.")

    @classmethod
    def get_next_id(cls):
        return cls.NEXT_ID

print(Student.get_next_id())
print(Student.get_next_id())
```
:::end

:::lang cpp
```cpp
#include <iostream>

class Student {
    static int initializeNextId() {
        std::cout << "Student class initialized.\n";
        return 1000;
    }

    inline static int NEXT_ID = initializeNextId();
public:
    static int getNextId() { return NEXT_ID; }
};

int main() {
    std::cout << Student::getNextId() << '\n';
    std::cout << Student::getNextId() << '\n';
}
```
:::end

A Java static initialization block cannot be called explicitly: the runtime executes it automatically when the class is initialized. This does not happen every time a new instance is created, so the message in the example is printed only once. In C#, a parameterless **static constructor** serves a similar purpose. C++ and Python provide other language mechanisms for initializing data associated with a class, and their precise timing can differ from Java's behavior.

## Applications {#applications}

### Automatically Increasing Identifiers {#automatic-ids}

A common requirement is to assign an automatically generated, unique identifier to each new object. We can create a class-level field called `NEXT_ID` that initially contains `1`. Whenever a new student is created, the constructor reads the next identifier from this shared field, stores it in the object's own `id` field, and then increments the shared value. Each student therefore receives a different identifier, while the next available value is stored in only one place.

:::lang java
```java
class Student {
    private static int NEXT_ID = 1;
    private final int id;
    private final String name;

    public Student(String name) {
        this.name = name;
        this.id = NEXT_ID;
        NEXT_ID++;
    }

    public int getId() { return id; }
}

class Main {
    public static void main(String[] args) {
        Student first = new Student("Anna");
        Student second = new Student("Bela");
        System.out.println(first.getId());  // 1
        System.out.println(second.getId()); // 2
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Student
{
    private static int NEXT_ID = 1;
    public int Id { get; }
    public string Name { get; }

    public Student(string name)
    {
        Name = name;
        Id = NEXT_ID;
        NEXT_ID++;
    }
}

class Program
{
    static void Main(string[] args)
    {
        Student first = new Student("Anna");
        Student second = new Student("Bela");
        Console.WriteLine(first.Id);  // 1
        Console.WriteLine(second.Id); // 2
    }
}
```
:::end

:::lang python
```python
class Student:
    NEXT_ID = 1

    def __init__(self, name):
        self.name = name
        self.id = Student.NEXT_ID
        Student.NEXT_ID += 1

first = Student("Anna")
second = Student("Bela")
print(first.id)   # 1
print(second.id)  # 2
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>

class Student {
    inline static int NEXT_ID = 1;
    const int id;
    std::string name;
public:
    explicit Student(const std::string& name)
        : id(NEXT_ID++), name(name) {}

    int getId() const { return id; }
};

int main() {
    Student first("Anna");
    Student second("Bela");
    std::cout << first.getId() << '\n';   // 1
    std::cout << second.getId() << '\n';  // 2
}
```
:::end

The value of the field used to allocate identifiers is not the same as the number of objects that currently exist. If an earlier object is no longer accessible, the next identifier must not decrease, because that could allow an identifier to be assigned again. We must therefore distinguish the **next identifier** from the **number of instances created**, even if the two values are closely related at the beginning of a simple program.

### Object Factory {#object-factory}

Until now, we have created objects directly using the `new` keyword and a suitable constructor. Sometimes, however, we want to make object creation depend on a condition, or check whether additional objects may be created. We can make the constructor `private` and provide a public class-level method that performs the checks and creates an instance only when appropriate. This solution is called an **object factory**.

In the following example, at most three students can be created during one run of the application. The `create` method keeps track of the number of students created and returns `null` instead of another instance after reaching the limit. Because the constructor is private, the main program cannot bypass the restriction by calling it directly. The caller must, of course, check whether object creation has succeeded.

:::lang java
```java
class Student {
    private static final int MAX_STUDENTS = 3;
    private static int CREATED_COUNT = 0;
    private final String name;

    private Student(String name) {
        this.name = name;
    }

    public static Student create(String name) {
        if (name == null || name.isBlank())
            throw new IllegalArgumentException("Invalid name.");
        if (CREATED_COUNT >= MAX_STUDENTS)
            return null;

        Student student = new Student(name);
        CREATED_COUNT++;
        return student;
    }
}

class Main {
    public static void main(String[] args) {
        Student first = Student.create("Anna");
        Student second = Student.create("Bela");
        Student third = Student.create("Cecilia");
        Student fourth = Student.create("David"); // null
    }
}
```
:::end

:::lang csharp
```csharp
#nullable enable
using System;
class Student
{
    private const int MAX_STUDENTS = 3;
    private static int CREATED_COUNT = 0;
    private readonly string name;

    private Student(string name) { this.name = name; }

    public static Student? Create(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Invalid name.");
        if (CREATED_COUNT >= MAX_STUDENTS)
            return null;

        Student student = new Student(name);
        CREATED_COUNT++;
        return student;
    }
}

class Program
{
    static void Main(string[] args)
    {
        Student? first = Student.Create("Anna");
        Student? second = Student.Create("Bela");
        Student? third = Student.Create("Cecilia");
        Student? fourth = Student.Create("David"); // null
    }
}
```
:::end

:::lang python
```python
class Student:
    MAX_STUDENTS = 3
    CREATED_COUNT = 0

    def __init__(self, name):
        self.name = name

    @classmethod
    def create(cls, name):
        if not name or not name.strip():
            raise ValueError("Invalid name.")
        if cls.CREATED_COUNT >= cls.MAX_STUDENTS:
            return None

        student = cls(name)
        cls.CREATED_COUNT += 1
        return student

first = Student.create("Anna")
second = Student.create("Bela")
third = Student.create("Cecilia")
fourth = Student.create("David")  # None
```
:::end

:::lang cpp
```cpp
#include <memory>
#include <stdexcept>
#include <string>

class Student {
    inline static constexpr int MAX_STUDENTS = 3;
    inline static int CREATED_COUNT = 0;
    std::string name;

    explicit Student(const std::string& name) : name(name) {}
public:
    static std::unique_ptr<Student> create(const std::string& name) {
        if (name.empty())
            throw std::invalid_argument("Invalid name.");
        if (CREATED_COUNT >= MAX_STUDENTS)
            return nullptr;

        std::unique_ptr<Student> student(new Student(name));
        CREATED_COUNT++;
        return student;
    }
};

int main() {
    auto first = Student::create("Anna");
    auto second = Student::create("Bela");
    auto third = Student::create("Cecilia");
    auto fourth = Student::create("David"); // nullptr
}
```
:::end

An object factory does not have to restrict the number of instances. It can also decide what kind of object to create from the supplied data. The validation introduced in constructors and setters remains important, because a newly created object must not be placed in an invalid state. Python cannot enforce private constructors in the same way as Java; in Python, calling the class-level `create` method is primarily a convention.

### Singleton {#singleton}

An object factory lets us control the number of instances that can be created. A special case occurs when we want to ensure that **only one instance of a class exists**. This may be useful for shared application settings if we want to store them in one object and have every part of the program use that same object. This solution is known as the **Singleton** design pattern.

One of the simplest Java implementations makes the constructor private, creates the only instance in a class-level field in advance, and makes it accessible through a public class-level method. Calling `getInstance()` repeatedly then always returns the same object. We can achieve similar behavior in C#, Python, and C++, although the languages provide different tools for doing so.

:::lang java
```java
class Settings {
    private static final Settings INSTANCE = new Settings();
    private String language = "en";

    private Settings() {}

    public static Settings getInstance() {
        return INSTANCE;
    }

    public String getLanguage() { return language; }
    public void setLanguage(String value) { language = value; }
}

class Main {
    public static void main(String[] args) {
        Settings first = Settings.getInstance();
        Settings second = Settings.getInstance();
        first.setLanguage("hu");
        System.out.println(second.getLanguage()); // hu
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Settings
{
    public static Settings Instance { get; } = new Settings();
    public string Language { get; set; } = "en";

    private Settings() {}
}

class Program
{
    static void Main(string[] args)
    {
        Settings first = Settings.Instance;
        Settings second = Settings.Instance;
        first.Language = "hu";
        Console.WriteLine(second.Language); // hu
    }
}
```
:::end

:::lang python
```python
class Settings:
    _instance = None

    def __init__(self):
        self.language = "en"

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

first = Settings.get_instance()
second = Settings.get_instance()
first.language = "hu"
print(second.language)  # hu
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>

class Settings {
    std::string language = "en";
    Settings() = default;
public:
    Settings(const Settings&) = delete;
    Settings& operator=(const Settings&) = delete;

    static Settings& getInstance() {
        static Settings instance;
        return instance;
    }

    void setLanguage(const std::string& value) { language = value; }
    const std::string& getLanguage() const { return language; }
};

int main() {
    Settings& first = Settings::getInstance();
    Settings& second = Settings::getInstance();
    first.setLanguage("hu");
    std::cout << second.getLanguage() << '\n'; // hu
}
```
:::end

A Singleton is not simply a static field: it also controls how the class's single instance is created and accessed. The Java and C# solutions shown prevent the main program from directly creating another instance, and the C++ example also disables copying. Python has no protection fully equivalent to a Java `private` constructor, so the Python example demonstrates the use of a shared object but does not prevent direct instantiation.

## Exercises {#exercises}

The tasks below specify the type, accessibility and validity of each field, as well as the required behaviour of each operation. The UML diagrams illustrate these requirements, but the textual specifications are complete on their own.

:::exercise
### Rectangles

![Rectangles – UML](content/chapters/05-osztalyszintu-elemek/media/complete-task-1-en.svg){width=620}

Extend the existing `Rectangle` class. Preserve its earlier functionality; the specification below states the new requirements together with the required behaviour of existing members.

**Fields and properties**

Retain the earlier instance fields and validation; add the following class-level field:

- `CREATED_COUNT : int` – private static field initially `0`, incremented once per successful construction.

**Constructors**

Count creations in constructors rather than instance methods; delegating constructors must not count one object twice.

**Methods**

- `getCreatedCount() : int` – public static method returning total number ever constructed, not the number still reachable.


**Main program**

Create several instances, verify the class-level mechanism and test the stated boundary conditions.
:::endexercise

:::exercise
### Books

![Books – UML](content/chapters/05-osztalyszintu-elemek/media/complete-task-2-en.svg){width=620}

Extend the existing `Book` class. Preserve its earlier functionality; the specification below states the new requirements together with the required behaviour of existing members.

**Fields and properties**

Retain the earlier instance fields and validation; add the following class-level field:

- `MIN_PRICE : int / MAX_PRICE : int` – public `static final` constants with values `500` and `50000`.

**Constructors**

Reuse the shared constants and validator in earlier price checks. The discount must still never result in a price below `899`.

**Methods**

- `isValidPrice(price : int) : boolean` – public static function, true if the price is within both inclusive bounds.


**Main program**

Create several instances, verify the class-level mechanism and test the stated boundary conditions.
:::endexercise

:::exercise
### Cars

![Cars – UML](content/chapters/05-osztalyszintu-elemek/media/complete-task-3-en.svg){width=620}

Extend the existing `Car` class. Preserve its earlier functionality; the specification below states the new requirements together with the required behaviour of existing members.

**Fields and properties**

Retain the earlier instance fields and validation; add the following class-level field:

- `NEXT_ID : int` – private static field starting from `1`; stores the next available id.

- `id : int` – private instance field assigned by the constructor and immutable afterwards.

**Constructors**

Each new instance receives the next id from the constructor, which then increments the counter. The id cannot be changed from outside.

**Methods**

- `getId() : int` – public instance method returning the private immutable id.


**Main program**

Create several instances, verify the class-level mechanism and test the stated boundary conditions.
:::endexercise

:::exercise
### Bank accounts

![Bank accounts – UML](content/chapters/05-osztalyszintu-elemek/media/complete-task-4-en.svg){width=620}

Extend the existing `BankAccount` class. Preserve its earlier functionality; the specification below states the new requirements together with the required behaviour of existing members.

**Fields and properties**

Retain the earlier instance fields and validation; add the following class-level field:

- `CREATED_COUNT : int / MAX_CREATED : int` – private static counter (`0`) and private static constant (`3`).

**Constructors**

Make the constructor private so the factory cannot be bypassed. Invalid data raise the previous validation error; increase the counter only after successful creation.

**Methods**

- `create(owner : String, accountNumber : String, balance : int) : BankAccount` – public static factory; at most three valid accounts can be created, returns `null` when capacity is exhausted.


**Main program**

Create several instances, verify the class-level mechanism and test the stated boundary conditions.
:::endexercise

:::exercise
### Movies

![Movies – UML](content/chapters/05-osztalyszintu-elemek/media/complete-task-5-en.svg){width=620}

Extend the existing `Movie` class. Preserve its earlier functionality; the specification below states the new requirements together with the required behaviour of existing members.

**Fields and properties**

Retain the earlier instance fields and validation; add the following class-level field:

- `INSTANCE : MovieLibrary` – private static field holding the sole MovieLibrary instance.

In `MovieLibrary`, `movies : ArrayList<Movie>` is also private; only one library instance is allowed.

**Constructors**

Keep the MovieLibrary constructor and its movie list private. Create the sole instance eagerly; no concurrency knowledge is required.

**Methods**

- `getInstance() : MovieLibrary` – public static method returning exactly the same instance for every call.
- `addMovie(movie : Movie) : void` – adds a non-null movie; raises an error for duplicate title and director.
- `getCount() : int` – returns number of stored movies.

The MovieLibrary constructor is not callable externally; the collection must be handled only through its public methods.

**Main program**

Create several instances, verify the class-level mechanism and test the stated boundary conditions.
:::endexercise
