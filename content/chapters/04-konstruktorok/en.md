# Constructors

By using getter and setter methods and language-supported properties, we ensured that invalid data cannot be stored in the fields of our instances. However, this does not guarantee that every required value is available immediately after instantiation. The purpose of a **constructor** is to initialize the fields of an instance and ensure that the data needed for its correct operation are available. Of course, we must also validate the values supplied to a constructor.

A constructor is a special method-like member invoked during **instantiation**. In Java, we create the instance using `new`, which invokes the appropriate constructor.

:::lang java
```java
class Student {
    private String name;

    public void setName(String name) {
        this.name = name;
    }
}

class Main {
    public static void main(String[] args) {
        Student first = new Student();
        Student second = new Student();
    }
}
```
:::end

:::lang csharp
```csharp
class Student
{
    public string Name { get; set; }
    // ...
}

class Program
{
    static void Main(string[] args)
    {
        Student first = new Student();
        Student second = new Student();
    }
}
```
:::end

:::lang python
```python
class Student:
    def __init__(self):
        self.name = None

first = Student()
second = Student()
```
:::end

:::lang cpp
```cpp
#include <string>

class Student {
public:
    std::string name;
};

int main() {
    Student first;
    Student second;
}
```
:::end

What does a constructor look like in general? It has the same name as its class, but it does not have a return type.

:::lang java
```java
class ClassName {
    // accessModifier ClassName(parameterList) {
    // }
}
```
:::end

:::lang csharp
```csharp
class ClassName
{
    [accessModifier] ClassName([parameterList])
    {
    }
}
```
:::end

:::lang python
```python
class ClassName:
    def __init__(self, parameters):
        pass
```
:::end

:::lang cpp
```cpp
class ClassName {
public:
    ClassName(/* parameter list */) {
    }
};
```
:::end

One might reasonably ask how we called a constructor in the previous example without having written one. If we do not declare any constructor in a class, the compiler automatically supplies a parameterless default constructor. In Java, its accessibility corresponds to the accessibility of the class.

:::lang java
```java
class Student {
    private String name;

    public Student() {
    }
}
```
:::end

:::lang csharp
```csharp
class Student
{
    public Student()
    {
    }

    public string Name { get; set; }
}
```
:::end

:::lang python
```python
class Student:
    def __init__(self):
        self.name = None
```
:::end

:::lang cpp
```cpp
#include <string>

class Student {
public:
    Student() {}
    std::string name;
};
```
:::end

We may also write a constructor that receives the data required for an instance to operate correctly. These values must be validated just as they are in setter methods.

In the following example, the constructor receives a parameter named `name`, while the class also has a field with the same name. In this case, `name` by itself refers to the parameter, whereas `this.name` refers to the field of the current instance. The `this` keyword refers to the instance on which the constructor or instance method is operating. If we used a different name for the parameter, `this` would not be necessary here.

:::lang java
```java
class Student {
    private String name;

    public Student(String name) {
        this.name = name;
    }
}
```
:::end

:::lang csharp
```csharp
class Student
{
    public Student(string name)
    {
        Name = name;
    }

    public string Name { get; set; }
}
```
:::end

:::lang python
```python
class Student:
    def __init__(self, name):
        self.name = name
```
:::end

:::lang cpp
```cpp
#include <string>

class Student {
public:
    explicit Student(const std::string& name) : name(name) {}
    std::string name;
};
```
:::end

![UML](content/chapters/04-konstruktorok/media/constructor-en.svg){width=330}

Importantly, if we write a constructor with parameters but no parameterless constructor, the compiler does not create the latter automatically. In that case, we must instantiate the class using one of the constructors we have defined.

:::lang java
```java
class Student {
    private String name;

    public Student(String name) {
        this.name = name;
    }
}

class Main {
    public static void main(String[] args) {
        Student first = new Student("Alex Smith");
        Student second = new Student(); // Compilation error: no matching constructor.
    }
}
```
:::end

:::lang csharp
```csharp
class Student
{
    public Student(string name)
    {
        Name = name;
    }

    public string Name { get; set; }
}

class Program
{
    static void Main(string[] args)
    {
        Student first = new Student("Alex Smith");
        Student second = new Student(); // Compilation error: no parameterless constructor exists.
    }
}
```
:::end

:::lang python
```python
class Student:
    def __init__(self, name):
        self.name = name

first = Student("Alex Smith")
second = Student()  # TypeError: missing required argument 'name'
```
:::end

:::lang cpp
```cpp
#include <string>

class Student {
public:
    explicit Student(const std::string& name) : name(name) {}
    std::string name;
};

int main() {
    Student first("Alex Smith");
    Student second; // Compilation error: no default constructor.
}
```
:::end

## Constructor overloading and delegation {#constructor-chaining}

We can, of course, declare **several constructors** in the same class, provided that their parameter lists differ. This is called **constructor overloading**. It allows us to create instances using different amounts of information.

However, we should consider whether every constructor really needs its own initialization code. Repeating the same assignments and validation in several constructors would make the program harder to maintain. In Java, we can **invoke another constructor of the same class** with `this(...)`. `this.name` therefore refers to the field of the current instance, whereas `this(...)` invokes another constructor. In our examples, we place this call at the beginning of the constructor body. In the following example, the parameterless constructor delegates the initialization of the name to the other constructor.

:::lang java
```java
class Student {
    private String name;

    public Student() {
        this("Unknown Student");
    }

    public Student(String name) {
        setName(name);
    }

    public void setName(String name) {
        if (name == null || name.isBlank())
            throw new IllegalArgumentException("Name cannot be empty!");
        this.name = name;
    }
}
```
:::end

:::lang csharp
```csharp
class Student
{
    private string name;

    public Student() : this("Unknown Student")
    {
    }

    public Student(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name cannot be empty!");
        this.name = name;
    }
}
```
:::end

:::lang python
```python
class Student:
    def __init__(self, name="Unknown Student"):
        if not name or not name.strip():
            raise ValueError("Name cannot be empty!")
        self.name = name
```
:::end

:::lang cpp
```cpp
#include <stdexcept>
#include <string>

class Student {
    std::string name;
public:
    Student() : Student("Unknown Student") {}

    explicit Student(const std::string& name) : name(name) {
        if (name.empty())
            throw std::invalid_argument("Name cannot be empty!");
    }
};
```
:::end

This means that we only need to write the assignment and validation of the name once. Further constructors may also invoke existing ones. The resulting sequence of calls is known as a **constructor invocation chain**. For now, we only examine calls within the same class; we will study the complete chain after inheritance has been introduced.

C# provides a similar mechanism using `: this(...)`, and C++ supports delegating constructors. In Python, separate overloads of `__init__` do not work in the same way, but default parameter values can provide similar behaviour.

## Exercises {#exercises}

We will now extend the five classes from the previous chapters with constructors. Where several constructors are required, use constructor delegation whenever possible instead of repeating the same initialization and validation code.

:::exercise
### Rectangles

![UML](content/chapters/04-konstruktorok/media/rect-en.svg){width=355}

Extend the `Rectangle` class with a constructor that receives the top-left corner coordinates and the width and height. Use the existing setter methods to validate the two side lengths.

Write a parameterless constructor that creates a `1 × 1` rectangle starting at `(0, 0)`. **It must invoke the parameterized constructor**, rather than repeat the initialization code. Create rectangles using both constructors and display their perimeter and area.
:::endexercise

:::exercise
### Books

![UML](content/chapters/04-konstruktorok/media/book-en.svg){width=400}

Add a constructor to `Book` that receives the author, title, price, genre and whether the book is printed. Validate the input using the methods already written.

Write another constructor that receives only the author, title and price. It must **invoke the first constructor**, supplying a selected default genre and the value indicating a printed book. Create at least four books using both constructors and test an invalid price.
:::endexercise

:::exercise
### Cars

![UML](content/chapters/04-konstruktorok/media/car-en.svg){width=355}

Write a constructor for `Car` that receives the make, model, year of manufacture and initial mileage. It must ensure that each value satisfies the rules introduced in the previous chapter.

Create another constructor that receives only the make, model and year, and initializes mileage to zero. **The second constructor must invoke the first one.** Create three cars and use `drive` to increase their mileage.
:::endexercise

:::exercise
### Bank accounts

![UML](content/chapters/04-konstruktorok/media/bank-en.svg){width=400}

Write a constructor for `BankAccount` that receives the account holder's name, account number and initial balance. It must only allow valid data.

Also create a constructor that receives the holder's name and account number only, and **invokes the first constructor** to create an account with a zero balance. Do not add a public setter for balance. Create several accounts and test deposits and withdrawals in the main program.
:::endexercise

:::exercise
### Films

![UML](content/chapters/04-konstruktorok/media/movie-en.svg){width=450}

Extend `Movie` with a constructor that receives the director, title, duration, language and a boolean indicating whether subtitles are used. Validate the values and initialize the cast and category lists to empty lists.

Write another constructor that does not receive the subtitle flag. It must **invoke the first constructor** and create a film without subtitles by default. Create three movies, add cast members and genres, and display their data. Verify that the internal lists still cannot be modified directly through the getters.
:::endexercise
