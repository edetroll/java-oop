# Data Hiding and Properties

One of the important tasks of object-oriented programming is protecting the data stored in classes. This means preventing unauthorized access by other parts of the code and ensuring that invalid values cannot be stored even when access is permitted.

> **During this semester, we will simulate data protection and unauthorized access attempts as follows: whatever we can do with an object's data in the main program could also be done by anyone else.**

## Access Levels {#access-levels}

Classes, fields, and methods all have an access level. To understand the problem and its solution, we need to become familiar with the following levels.

- **`public`**: accessible from anywhere
- **`private`**: accessible only within the defining class
- **`protected`**: accessible within the defining class and its subclasses (in Java, also from other classes in the same package in certain cases)
- **package-private**: if no modifier is specified in Java, the member is accessible within the same package

C# also provides **`internal`** access, which makes a member accessible within the same assembly. The two languages do not have identical access rules.

The problem with the examples from the previous chapter was that every field was marked `public`, so anyone could access the fields and assign invalid values.

:::lang java
```java
class Student {
    public String name;
}

class Main {
    public static void main(String[] args) {
        Student alex = new Student();
        alex.name = null;
        alex.name = "E";
        alex.name = "AlexTaylor";
        alex.name = "Al3x T4yl0r";
    }
}
```
:::end

:::lang csharp
```csharp
class Student
{
		public string name;
		//...
}

class Program
{
		static void Main(string[] args)
		{
				Student alex = new Student();
				alex.name = null;
				alex.name = "E";
				alex.name = "AlexTaylor";
				alex.name = "Al3x T4yl0r";
				//...
		}
}
```
:::end

:::lang python
```python
class Student:
    def __init__(self):
        self.name = None

alex = Student()
alex.name = None
alex.name = "E"
alex.name = "AlexTaylor"
alex.name = "Al3x T4yl0r"
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
    Student alex;
    alex.name = "E";
    alex.name = "AlexTaylor";
    alex.name = "Al3x T4yl0r";
}
```
:::end


## Getter and Setter Methods {#getters-setters}

To protect our data, we must restrict access. However, the main program can then no longer access the fields directly, so we provide public methods. Traditionally, a method that modifies a field is called `setField`, while a method that retrieves its value is called `getField`. These are **setter** and **getter** methods. In Java, they are commonly named according to JavaBeans conventions.

:::lang java
```java
class Student {
    private String name;

    public void setName(String value) {
        name = value;
    }

    public String getName() {
        return name;
    }
}

class Main {
    public static void main(String[] args) {
        Student alex = new Student();
        alex.setName(null);
        alex.setName("E");
        System.out.println(alex.getName());
    }
}
```
:::end

:::lang csharp
```csharp
class Student
{
		private string name;
		public void SetName(string value)
		{
				name = value;
		}
		public string GetName()
		{
				return name;
		}
}

class Program
{
		static void Main(string[] args)
		{
				Student alex = new Student();
				alex.SetName(null);
				alex.SetName("E");				
				//...

				Console.WriteLine(alex.GetName());
		}
}
```
:::end

:::lang python
```python
class Student:
    def __init__(self):
        self._name = None

    def set_name(self, value):
        self._name = value

    def get_name(self):
        return self._name

alex = Student()
alex.set_name(None)
alex.set_name("E")
print(alex.get_name())
```
:::end

:::lang cpp
```cpp
#include <string>
#include <iostream>
class Student {
private:
    std::string name;
public:
    void setName(const std::string& value) { name = value; }
    const std::string& getName() const { return name; }
};

int main() {
    Student alex;
    alex.setName("E");
    std::cout << alex.getName();
}
```
:::end


At first glance, we have restricted access on one hand and restored it on the other. The difference is that access now goes through methods, so we can validate the argument before storing it.

In the previous examples, we declared both getter and setter methods as `public`. This does not mean, however, that we must allow both operations for every field. Sometimes we want the main program to read a value without being able to change it. In this case, it is sufficient to create a public getter, while the setter can be omitted or, if necessary, declared `private`. The important point is that a field should only be modified from places where the rules governing the modification can be checked.

Since getter and setter methods often have a very similar structure, IntelliJ IDEA can generate them automatically. While editing a class, select **Code → Generate… → Getter and Setter**, then choose the fields for which you want to create these methods. The same operation is also available from the **Generate…** context menu. Note that a generated setter does not validate the supplied value by default, so we must add any necessary validation ourselves.

## Validation and Exceptions {#validation}

When validation fails, the standard approach is not to print an error or make the computer beep, but to throw an exception. We will discuss exception handling later. For now, it is enough to know that Java exceptions are subclasses of `Throwable` and are thrown with `throw`. Invalid arguments are often signaled with `IllegalArgumentException`.

:::lang java
```java
throw new IllegalArgumentException("Error message");
```
:::end

:::lang csharp
```csharp
throw new Exception("Error message");
```
:::end

:::lang python
```python
raise ValueError("Error message")
```
:::end

:::lang cpp
```cpp
throw std::invalid_argument("Error message");
```
:::end


If an exception is not handled, the current operation is interrupted and the exception propagates up the call stack. The thread terminates only if the exception reaches its top level without being handled.

Suppose we require students' names to satisfy the following conditions.

- the name must not be `null` or empty
- it must contain at least one space
- each part of the name must contain at least **2** characters

In this case, validation can be implemented as follows. In Java, `split(" ", -1)` preserves empty parts of the name, so repeated spaces cannot bypass validation.

:::lang java
```java
class Student {
    private String name;

    public void setName(String value) {
        if (value == null || value.isEmpty())
            throw new IllegalArgumentException("Name must not be empty!");

        if (!value.contains(" "))
            throw new IllegalArgumentException("Name must contain at least one space!");

        String[] parts = value.split(" ", -1);
        for (String tag : parts) {
            if (tag.length() < 2)
                throw new IllegalArgumentException("Every part of the name must contain at least two characters!");
        }
        name = value;
    }

    public String getName() {
        return name;
    }
}
```
:::end

:::lang csharp
```csharp
class Student
{
		private string name;
		public void SetName(string value)
		{
				if (string.IsNullOrEmpty(value))
						throw new Exception("Name must not be empty!");

				if (!value.Contains(' '))
						throw new Exception("Name must contain at least one space!");				

				string[] parts = value.Split(' ');
				foreach (string tag in parts)
				{
						if (tag.Length < 2)
								throw new Exception("Each part of the name must have at least two characters!");
				}

				name = value;
		}
		public string GetName()
		{
				return name;
		}
}
```
:::end

:::lang python
```python
class Student:
    def __init__(self):
        self._name = None

    def set_name(self, value):
        if not value:
            raise ValueError("Name must not be empty!")
        if " " not in value:
            raise ValueError("Name must contain a space!")
        if any(len(tag) < 2 for tag in value.split(" ")):
            raise ValueError("Every part of the name must contain at least two characters!")
        self._name = value

    def get_name(self):
        return self._name
```
:::end

:::lang cpp
```cpp
#include <string>
#include <stdexcept>
#include <sstream>
class Student {
private:
    std::string name;
public:
    void setName(const std::string& value) {
        if (value.empty())
            throw std::invalid_argument("A name nem lehet ures!");
        if (value.find(' ') == std::string::npos)
            throw std::invalid_argument("A nevnek szokoz kell!");
        std::istringstream parts(value);
        std::string part;
        while (std::getline(parts, part, ' ')) {
            if (part.size() < 2)
                throw std::invalid_argument("A name minden tagja legalabb 2 character!");
        }
        name = value;
    }
    const std::string& getName() const { return name; }
};
```
:::end


## Access Levels in UML {#uml-access}

In UML, `+` means public, `-` means private, and `#` means protected access. The symbol is written before the field or method.

![UML](content/chapters/03-adatrejtes/media/hallgato-en.svg){width=370}

## Language-level Properties {#properties}

C# supports properties directly in the language, allowing `get` and `set` to provide field-like access. Java does not offer an equivalent built-in property syntax; we use conventional getter and setter methods. Python provides a similar feature through the `@property` decorator.

:::lang java
```java
// Java has no C#-style property syntax.
// We use getter and setter methods.
class Student {
    private String name;

    public void setName(String value) {
        // validation
        name = value;
    }

    public String getName() {
        return name;
    }
}
```
:::end

:::lang csharp
```csharp
class Student
{
		private string name;
		public void Name
		{
				set
				{
						//validation

						name = value;
				}
				get
				{
						return name;
				}
		}
}
```
:::end

:::lang python
```python
class Student:
    def __init__(self):
        self._name = None

    @property
    def name(self):
        return self._name

    @name.setter
    def name(self, value):
        # validation
        self._name = value
```
:::end

:::lang cpp
```cpp
// C++ has no built-in C#-style property syntax.
class Student {
private:
    std::string name;
public:
    void setName(const std::string& value) {
        // validation
        name = value;
    }
    const std::string& getName() const { return name; }
};
```
:::end


The C# example uses `public void Name`, which is not a valid property declaration. For a string property, the correct syntax is `public string Name`.

The C# `set` block receives an implicit parameter named `value`, whose type matches the property's type. The `get` block must return a compatible value. The main program can use a property much like a field.

:::lang java
```java
class Main {
    public static void main(String[] args) {
        Student alex = new Student();
        alex.setName("Troll Alex");
        System.out.println(alex.getName());
    }
}
```
:::end

:::lang csharp
```csharp
class Program
{
		static void Main(string[] args)
		{
				Student alex = new Student();
				alex.Name = "Troll Alex";
				Console.WriteLine(alex.Name);
		}
}
```
:::end

:::lang python
```python
alex = Student()
alex.name = "Troll Alex"
print(alex.name)
```
:::end

:::lang cpp
```cpp
#include <iostream>
int main() {
    Student alex;
    alex.setName("Troll Alex");
    std::cout << alex.getName();
}
```
:::end


## Exercises {#exercises}

The tasks below specify the type, accessibility and validity of each field, as well as the required behaviour of each operation. The UML diagrams illustrate these requirements, but the textual specifications are complete on their own.

:::exercise
### Rectangles
![Rectangles – UML](content/chapters/03-adatrejtes/media/complete-task-1-en.svg){width=560}
Create the `Rectangle` class with the following fields and operations. Implement the following fields and methods with the specified behaviour.

**Fields and properties**
- `x : double` – x-coordinate of the top-left corner; any real number. Private field with public `getX() : double` and `setX(x : double) : void`. The coordinate may be changed freely.
- `y : double` – y-coordinate of the top-left corner; any real number. Private field with public `getY() : double` and `setY(y : double) : void`. The coordinate may be changed freely.
- `width : double` – the width; strictly positive from the data-hiding chapter onward. Private field with public `getWidth() : double` getter and `setWidth(width : double) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.
- `height : double` – the height; strictly positive from the data-hiding chapter onward. Private field with public `getHeight() : double` getter and `setHeight(height : double) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.

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
![Books – UML](content/chapters/03-adatrejtes/media/complete-task-2-en.svg){width=560}
Create the `Book` class with the following fields and operations. Implement the following fields and methods with the specified behaviour.

**Fields and properties**
- `author : String` – author; at least two characters, containing only letters, spaces, periods or hyphens. Private field with public `getAuthor() : String` getter and `setAuthor(author : String) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.
- `title : String` – book title; at least two characters. Private field with public `getTitle() : String` getter and `setTitle(title : String) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.
- `price : int` – price in whole forints; valid range `[500, 50 000]`. Private field with public `getPrice() : int` getter and `setPrice(price : int) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.
- `genre : Genre` – enumeration; e.g. BIOGRAPHY, HORROR, DRAMA, HISTORY, SCIFI, COMEDY. Private field with public `getGenre() : Genre` getter and `setGenre(genre : Genre) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.
- `printed : boolean` – true for printed books, false for e-books. Private field with public `isPrinted() : boolean` and `setPrinted(printed : boolean) : void`; boolean values need no additional validation.

**Methods**
- `discount(percent : int) : void` – accepts an integer percentage from `1` to `99`; invalid input leaves the price unchanged; round the discounted price down to whole forints and do not allow a price under `899`.
- `toString() : String` – returns a readable text with the book’s key fields.
Provide getters and setters with the accessibility stated for each field. An unsuccessful validation must not damage the previously valid state.

**Main program**
Create five different instances, supply their data and test all required operations. Where validation has been introduced, try both valid and invalid values.
:::endexercise

:::exercise
### Cars
![Cars – UML](content/chapters/03-adatrejtes/media/complete-task-3-en.svg){width=560}
Create the `Car` class with the following fields and operations. Implement the following fields and methods with the specified behaviour.

**Fields and properties**
- `brand : String` – brand; must not be null or empty. Private field with public `getBrand() : String` getter and `setBrand(brand : String) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.
- `model : String` – model; must not be null or empty. Private field with public `getModel() : String` getter and `setModel(model : String) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.
- `year : int` – year of manufacture in `[1886, 2100]`. Private field with public `getYear() : int` getter and `setYear(year : int) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.
- `mileage : int` – odometer in whole kilometres, nonnegative. Private field with public `getMileage() : int` only; changes are permitted through the operation and constructor.

**Methods**
- `drive(distance : int) : void` – accepts only a positive number of whole kilometres and increases `mileage`.
- `toString() : String` – returns a displayable summary of brand, model, year and mileage.
Provide getters and setters with the accessibility stated for each field. An unsuccessful validation must not damage the previously valid state.

**Main program**
Create five different instances, supply their data and test all required operations. Where validation has been introduced, try both valid and invalid values.
:::endexercise

:::exercise
### Bank accounts
![Bank accounts – UML](content/chapters/03-adatrejtes/media/complete-task-4-en.svg){width=560}
Create the `BankAccount` class with the following fields and operations. Implement the following fields and methods with the specified behaviour.

**Fields and properties**
- `owner : String` – account holder name; not null or empty. Private field with public `getOwner() : String` getter and `setOwner(owner : String) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.
- `accountNumber : String` – account number; not null or empty and cannot change after creation. Private field with public `getAccountNumber() : String` and `setAccountNumber(accountNumber : String) : void`. The setter permits only the first valid assignment; later attempts raise an exception.
- `balance : int` – balance in whole forints; nonnegative. Private field with public `getBalance() : int` only; changes are permitted through the operation and constructor.

**Methods**
- `deposit(amount : int) : void` – accepts a positive amount and increases the balance.
- `withdraw(amount : int) : void` – withdraws only a positive amount not exceeding the balance.
- `getBalance() : int` – returns the current balance.
- `toString() : String` – returns a readable string with number, holder and balance.
Provide getters and setters with the accessibility stated for each field. An unsuccessful validation must not damage the previously valid state.

**Main program**
Create five different instances, supply their data and test all required operations. Where validation has been introduced, try both valid and invalid values.

For now, allow a public `setAccountNumber(String)` method to assign the account number exactly once; a later call must be rejected. In the next chapter the constructor will take over initial assignment.
:::endexercise

:::exercise
### Movies
![Movies – UML](content/chapters/03-adatrejtes/media/complete-task-5-en.svg){width=560}
Create the `Movie` class with the following fields and operations. Implement the following fields and methods with the specified behaviour.

**Fields and properties**
- `director : String` – director; not null, at least two characters, only letters, spaces, periods and hyphens. Private field with public `getDirector() : String` getter and `setDirector(director : String) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.
- `title : String` – title; not null and at least two characters. Private field with public `getTitle() : String` getter and `setTitle(title : String) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.
- `duration : int` – length in whole minutes; range `[10, 360]`. Private field with public `getDuration() : int` getter and `setDuration(duration : int) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.
- `language : Language` – language as an enumeration. Private field with public `getLanguage() : Language` getter and `setLanguage(language : Language) : void` setter. Assign only after validation; invalid values must raise `IllegalArgumentException` and leave the old value unchanged.
- `subtitles : boolean` – true if the film has subtitles. Private field with public `hasSubtitles() : boolean` and `setSubtitles(subtitles : boolean) : void`; boolean values need no additional validation.
- `actors : ArrayList<String>` – list of actors; private, external code only receives a copy. Private field; public `getActors() : ArrayList<String>` getter must return a defensive copy; only the dedicated add method may modify the collection.
- `categories : ArrayList<Genre>` – list of genres; private, getter only returns a copy. Private field; public `getCategories() : ArrayList<Genre>` getter must return a defensive copy; only the dedicated add method may modify the collection.

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
