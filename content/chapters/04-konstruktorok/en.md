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

The tasks below specify the type, accessibility and validity of each field, as well as the required behaviour of each operation. The UML diagrams illustrate these requirements, but the textual specifications are complete on their own.

:::exercise
### Rectangles
![Rectangles – UML](content/chapters/04-konstruktorok/media/complete-task-1-en.svg){width=560}
Create the `Rectangle` class with the following fields and operations. Implement the following fields and methods with the specified behaviour.

**Fields and properties**
- `x : double` – x-coordinate of the top-left corner; any real number. Private field with public `getX() : double` and `setX(x : double) : void`. The coordinate may be changed freely.
- `y : double` – y-coordinate of the top-left corner; any real number. Private field with public `getY() : double` and `setY(y : double) : void`. The coordinate may be changed freely.
- `width : double` – the width; strictly positive from the data-hiding chapter onward. Private field with public `getWidth() : double` getter and `setWidth(width : double) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.
- `height : double` – the height; strictly positive from the data-hiding chapter onward. Private field with public `getHeight() : double` getter and `setHeight(height : double) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.

**Constructors**
- `Rectangle()` – Delegate to the full constructor; the omitted value defaults to top-left corner `(0,0)` and size `1 × 1`.
- `Rectangle(x : double, y : double, width : double, height : double)` – Validate every supplied value and reject invalid parameters by throwing an exception.

**Methods**
- `getPerimeter() : double` – parameterless function returning `2 × (width + height)`.
- `getArea() : double` – parameterless function returning `width × height`.
- `overlaps(other : Rectangle) : boolean` – checks whether the two rectangles have a common area of positive size; touching edges alone do not count.
- `getQuadrant() : int` – returns `1`–`4` if the entire rectangle lies strictly in one quadrant, otherwise `-1`.
Provide getters and setters with the accessibility stated for each field. An unsuccessful validation must not damage the previously valid state.

**Main program**
Create five different instances, supply their data and test all required operations. Where validation has been introduced, try both valid and invalid values.
:::endexercise

:::exercise
### Books
![Books – UML](content/chapters/04-konstruktorok/media/complete-task-2-en.svg){width=560}
Create the `Book` class with the following fields and operations. Implement the following fields and methods with the specified behaviour.

**Fields and properties**
- `author : String` – author; at least two characters, containing only letters, spaces, periods or hyphens. Private field with public `getAuthor() : String` getter and `setAuthor(author : String) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.
- `title : String` – book title; at least two characters. Private field with public `getTitle() : String` getter and `setTitle(title : String) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.
- `price : int` – price in whole forints; valid range `[500, 50 000]`. Private field with public `getPrice() : int` getter and `setPrice(price : int) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.
- `genre : Genre` – enumeration; e.g. BIOGRAPHY, HORROR, DRAMA, HISTORY, SCIFI, COMEDY. Private field with public `getGenre() : Genre` getter and `setGenre(genre : Genre) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.
- `printed : boolean` – true for printed books, false for e-books. Private field with public `isPrinted() : boolean` and `setPrinted(printed : boolean) : void`; boolean values need no additional validation.

**Constructors**
- `Book(author : String, title : String, price : int, genre : Genre, printed : boolean)` – Validate every supplied value and reject invalid parameters by throwing an exception.
- `Book(author : String, title : String, price : int)` – Delegate to the full constructor; the omitted value defaults to `Genre.DRAMA` and a printed book.

**Methods**
- `discount(percent : int) : void` – accepts an integer percentage from `1` to `99`; invalid input leaves the price unchanged; round the discounted price down to whole forints and do not allow a price under `899`.
- `toString() : String` – returns a readable text with the book’s key fields.
Provide getters and setters with the accessibility stated for each field. An unsuccessful validation must not damage the previously valid state.

**Main program**
Create five different instances, supply their data and test all required operations. Where validation has been introduced, try both valid and invalid values.
:::endexercise

:::exercise
### Cars
![Cars – UML](content/chapters/04-konstruktorok/media/complete-task-3-en.svg){width=560}
Create the `Car` class with the following fields and operations. Implement the following fields and methods with the specified behaviour.

**Fields and properties**
- `brand : String` – brand; must not be null or empty. Private field with public `getBrand() : String` getter and `setBrand(brand : String) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.
- `model : String` – model; must not be null or empty. Private field with public `getModel() : String` getter and `setModel(model : String) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.
- `year : int` – year of manufacture in `[1886, 2100]`. Private field with public `getYear() : int` getter and `setYear(year : int) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.
- `mileage : int` – odometer in whole kilometres, nonnegative. Private field with public `getMileage() : int` only; changes are permitted through the operation and constructor.

**Constructors**
- `Car(brand : String, model : String, year : int, mileage : int)` – Validate every supplied value and reject invalid parameters by throwing an exception.
- `Car(brand : String, model : String, year : int)` – Delegate to the full constructor; the omitted value defaults to mileage of `0` kilometres.

**Methods**
- `drive(distance : int) : void` – accepts only a positive number of whole kilometres and increases `mileage`.
- `toString() : String` – returns a displayable summary of brand, model, year and mileage.
Provide getters and setters with the accessibility stated for each field. An unsuccessful validation must not damage the previously valid state.

**Main program**
Create five different instances, supply their data and test all required operations. Where validation has been introduced, try both valid and invalid values.
:::endexercise

:::exercise
### Bank accounts
![Bank accounts – UML](content/chapters/04-konstruktorok/media/complete-task-4-en.svg){width=560}
Create the `BankAccount` class with the following fields and operations. Implement the following fields and methods with the specified behaviour.

**Fields and properties**
- `owner : String` – account holder name; not null or empty. Private field with public `getOwner() : String` getter and `setOwner(owner : String) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.
- `accountNumber : String` – account number; not null or empty and cannot change after creation. Private field with public `getAccountNumber() : String` only; no public setter. The constructor initializes this field.
- `balance : int` – balance in whole forints; nonnegative. Private field with public `getBalance() : int` only; changes are permitted through the operation and constructor.

**Constructors**
- `BankAccount(owner : String, accountNumber : String, balance : int)` – Validate every supplied value and reject invalid parameters by throwing an exception.
- `BankAccount(owner : String, accountNumber : String)` – Delegate to the full constructor; the omitted value defaults to opening balance of `0`.

**Methods**
- `deposit(amount : int) : void` – accepts a positive amount and increases the balance.
- `withdraw(amount : int) : void` – withdraws only a positive amount not exceeding the balance.
- `getBalance() : int` – returns the current balance.
- `toString() : String` – returns a readable string with number, holder and balance.
Provide getters and setters with the accessibility stated for each field. An unsuccessful validation must not damage the previously valid state.

**Main program**
Create five different instances, supply their data and test all required operations. Where validation has been introduced, try both valid and invalid values.
:::endexercise

:::exercise
### Movies
![Movies – UML](content/chapters/04-konstruktorok/media/complete-task-5-en.svg){width=560}
Create the `Movie` class with the following fields and operations. Implement the following fields and methods with the specified behaviour.

**Fields and properties**
- `director : String` – director; not null, at least two characters, only letters, spaces, periods and hyphens. Private field with public `getDirector() : String` getter and `setDirector(director : String) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.
- `title : String` – title; not null and at least two characters. Private field with public `getTitle() : String` getter and `setTitle(title : String) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.
- `duration : int` – length in whole minutes; range `[10, 360]`. Private field with public `getDuration() : int` getter and `setDuration(duration : int) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.
- `language : Language` – language as an enumeration. Private field with public `getLanguage() : Language` getter and `setLanguage(language : Language) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.
- `subtitles : boolean` – true if the film has subtitles. Private field with public `hasSubtitles() : boolean` and `setSubtitles(subtitles : boolean) : void`; boolean values need no additional validation.
- `actors : ArrayList<String>` – list of actors; private, external code only receives a copy. Private field; public `getActors() : ArrayList<String>` getter must return a defensive copy; only the dedicated add method may modify the collection.
- `categories : ArrayList<Genre>` – list of genres; private, getter only returns a copy. Private field; public `getCategories() : ArrayList<Genre>` getter must return a defensive copy; only the dedicated add method may modify the collection.

**Constructors**
- `Movie(director : String, title : String, duration : int, language : Language, subtitles : boolean)` – Validate every supplied value and reject invalid parameters by throwing an exception.
- `Movie(director : String, title : String, duration : int, language : Language)` – Delegate to the full constructor; the omitted value defaults to a film without subtitles.

**Methods**
- `hasActor(name : String) : boolean` – returns whether the named actor appears in the film.
- `addActor(name : String) : void` – validates the name as for the director and adds it only if absent.
- `addCategory(genre : Genre) : void` – adds a non-null genre without duplicates.
- `getActors() : ArrayList<String>` – returns a new list containing the actors.
- `getCategories() : ArrayList<Genre>` – returns a new list of genres.
- `toString() : String` – readable text with time formatted as `hours:minutes:00`; show subtitle info only for non-Hungarian films.
Provide getters and setters with the accessibility stated for each field. An unsuccessful validation must not damage the previously valid state.

**Main program**
Create five different instances, supply their data and test all required operations. Where validation has been introduced, try both valid and invalid values.
:::endexercise
