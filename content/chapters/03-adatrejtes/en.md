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

### Accessibility of Getters and Setters {#accessor-visibility}

In the previous examples, we declared both getter and setter methods as `public`. This does not mean, however, that we must allow both operations for every field. Sometimes we want the main program to read a value without being able to change it. In this case, it is sufficient to create a public getter, while the setter can be omitted or, if necessary, declared `private`. The important point is that a field should only be modified from places where the rules governing the modification can be checked.

### Generating Getters and Setters in IntelliJ IDEA {#generate-accessors}

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


> The original C# sample contains `public void Nev`. We have retained it unchanged, but **this is a C# syntax error**: a string property must be declared as `public string Nev`.

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

In this chapter, we extend the previous exercises by validating their data. **Keep all methods from the previous chapter!** Setters and data-entry methods must reject invalid values by throwing exceptions. A failed change must leave the previously stored valid value untouched.

:::exercise
### Rectangles

![UML](content/chapters/03-adatrejtes/media/task1-en.svg){width=340}

Extend the `Rectangle` class from the previous chapter. The top-left corner coordinates `x` and `y` may be any real numbers, but **width** and **height** must be positive.

- Make every field `private`.
- Implement getter and setter methods.
- Throw `IllegalArgumentException` for invalid width or height.
- Keep the existing **perimeter**, **area**, **overlap**, and **quadrant** methods working.

In the main program, attempt to set width and height to `0` or negative values. Check that an invalid value is never stored.

:::endexercise

:::exercise
### Books

![UML](content/chapters/03-adatrejtes/media/task2-en.svg){width=380}

Extend the `Book` class from the previous chapter with the following validation rules.

- **Author:** not `null` or empty, at least **2** characters; may contain only letters, spaces, periods (`.`), and hyphens (`-`). Spaces allow multi-part names.
- **Title:** not `null` or empty; at least **2** characters.
- **Price:** an integer in the range **[500, 50,000]**.
- **Genre:** use an `enum` (for example biography, horror, drama, historical, science fiction, comedy).
- **Printed:** a boolean.

Make every field `private` and implement getters and setters. The **discount** method must also respect the price restrictions: if a calculated price falls below HUF `500`, throw an exception without updating the field. The previous chapter’s **HUF 899** minimum discounted price also remains in force, so it is the effective limit.

In the main program, test valid and invalid values, and display the books using `toString()`.

:::endexercise

:::exercise
### Films

![UML](content/chapters/03-adatrejtes/media/task3-en.svg){width=440}

Extend the `Movie` class from the previous chapter. Validate **director** and **title** as in the Books exercise. **Duration** must be an integer in the range **[10, 360]** minutes. Use `enum` types for **language** and **categories**.

- Store the **cast** in a list and provide an `addActor(String name)` method that validates names and rejects duplicates.
- Store **categories** in a list as well, preventing duplicate values.
- Make the lists `private`. The getters must return **copies**, so the main program cannot modify the internal lists directly.
- Keep the existing actor search and `toString()` methods working.

**Hint:** In Java you may use `ArrayList` and its `add` and `contains` methods, and `new ArrayList<>(originalList)` to make copies. Detailed knowledge of collections is not required.

In the main program, try invalid values and repeated actors or categories. Check that modifying a list returned by a getter does not modify the film.

:::endexercise
