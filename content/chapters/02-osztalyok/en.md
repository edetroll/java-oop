# Encapsulation

Encapsulation is the first principle of OOP. It states that when we represent objects from the real world, we enclose the data (fields) that describe an object and the methods that operate on that data in a single unit. We implement encapsulation by creating classes. Classes are introduced using the `class` keyword.

:::lang java
```java
import java.time.LocalDate;

class Student {
    public String name;
    public String studentId;
    public LocalDate dateOfBirth;

    public void register(String course) {
        // Registration will be implemented later.
    }

    public void withdraw(String course) {
        // Withdrawal will be implemented later.
    }

    public boolean canTakeFinalExam() {
        // Eligibility check will be implemented later.
        return false;
    }
}
```
:::end

:::lang csharp
```csharp
class Student
{
		public string name;
		public string studentId;
		public DateTime dateOfBirth;
		//...

		public void Register(string course) { /*...*/ }
		public void Withdraw(string course) { /*...*/ }
		public bool CanTakeFinalExam() { /*...*/ }
		//...
}
```
:::end

:::lang python
```python
from datetime import date

class Student:
    def __init__(self):
        self.name = ""
        self.studentId = ""
        self.dateOfBirth = None

    def register(self, course):
        pass

    def withdraw(self, course):
        pass

    def can_take_final_exam(self):
        return False
```
:::end

:::lang cpp
```cpp
#include <string>
#include <ctime>

class Student {
public:
    std::string name;
    std::string studentId;
    std::tm dateOfBirth{};

    void register(const std::string& course) { /* ... */ }
    void withdraw(const std::string& course) { /* ... */ }
    bool canTakeFinalExam() { return false; }
};
```
:::end

In the example above, every field and method is marked with the `public` keyword. We will discuss this in detail later. For now, the method bodies are placeholders; we will implement their actual behaviour later.

A class therefore clearly defines and describes the structure of the object it represents. We create concrete individual objects, or **instances**, through **instantiation**.

:::lang java
```java
public static void main(String[] args) {
    Student alex = new Student();
    Student ben = new Student();
}
```
:::end

:::lang csharp
```csharp
static void Main(string[] args)
{
		Student alex = new Student();
		Student ben = new Student();
}
```
:::end

:::lang python
```python
alex = Student()
ben = Student()
```
:::end

:::lang cpp
```cpp
int main() {
    Student alex;
    Student ben;
}
```
:::end

We access the fields and methods of each instance through its identifier using the dot (**`.`**) operator.

:::lang java
```java
import java.time.LocalDate;

public static void main(String[] args) {
    Student alex = new Student();
    alex.name = "Troll Alex";
    alex.dateOfBirth = LocalDate.of(1987, 5, 4);
    alex.studentId = "QWER12";

    Student ben = new Student();
    ben.name = "Ben Carter";
    ben.dateOfBirth = LocalDate.of(1977, 5, 10);
    ben.studentId = "AWSD99";

    alex.register("Introduction to Computer Graphics (lecture)");
    ben.withdraw("Computer Graphics (lab)");
    boolean gergoCanTakeFinalExam = ben.canTakeFinalExam();
}
```
:::end

:::lang csharp
```csharp
static void Main(string[] args)
{
		Student alex = new Student();
		alex.name = "Troll Alex";
		alex.dateOfBirth = DateTime.Parse("1987.05.04");
		alex.studentId = "QWER12";

		Student ben = new Student();
		ben.name = "Ben Carter";
		ben.dateOfBirth = DateTime.Parse("1977.05.10");
		ben.studentId = "AWSD99";

		alex.Register("Introduction to Computer Graphics (lecture)");
		ben.Withdraw("Computer Graphics (lab)");
		bool gergoCanTakeFinalExam = ben.CanTakeFinalExam();
}
```
:::end

:::lang python
```python
from datetime import date

alex = Student()
alex.name = "Troll Alex"
alex.dateOfBirth = date(1987, 5, 4)
alex.studentId = "QWER12"

ben = Student()
ben.name = "Ben Carter"
ben.dateOfBirth = date(1977, 5, 10)
ben.studentId = "AWSD99"

alex.register("Introduction to Computer Graphics (lecture)")
ben.withdraw("Computer Graphics (lab)")
gergoCanTakeFinalExam = ben.can_take_final_exam()
```
:::end

:::lang cpp
```cpp
int main() {
    Student alex;
    alex.name = "Troll Alex";
    alex.dateOfBirth = {0, 0, 0, 4, 4, 87}; // 1987.05.04
    alex.studentId = "QWER12";

    Student ben;
    ben.name = "Ben Carter";
    ben.dateOfBirth = {0, 0, 0, 10, 4, 77}; // 1977.05.10
    ben.studentId = "AWSD99";

    alex.register("Introduction to Computer Graphics (lecture)");
    ben.withdraw("Computer Graphics (lab)");
    bool gergoCanTakeFinalExam = ben.canTakeFinalExam();
}
```
:::end

In Java, we use the `LocalDate` class to store a date of birth. We will not discuss its implementation in detail yet.

As a standard practice, we do not display instance data by writing a method in the class that directly prints it to the screen. Doing so would require us to implement platform-dependent output in the class. To solve this, we need to know that every Java class has a superclass. If we do not specify one, the superclass is automatically `Object`. We inherit certain methods from `Object`, and we can override some of them. Without going into the details of how overriding works, let us write the `toString()` method, which returns a string, as follows. We collect the important information in a single string and return it.

Place the following method inside the `Student` class. In Java, the name is `toString()` (with a lowercase initial letter), while `@Override` indicates that we override an inherited method.

:::lang java
```java
@Override
public String toString() {
    String text = "";
    text += "Name: " + name + "\n";
    text += "Student ID: " + studentId + "\n";
    text += "Date of birth: " + dateOfBirth + "\n";
    return text;
}
```
:::end

:::lang csharp
```csharp
class Student
{
		public string name;
		public string studentId;
		public DateTime dateOfBirth;
		//...

		public override string ToString()
		{
				string text = string.Empty;
				text += "Name: " + name + "\n";
				text += "Student ID: " + studentId + "\n";
				text += "Date of birth: " + dateOfBirth.ToString("yyyy.MM.dd (dddd)") + "\n";
				return text;
		}
}
```
:::end

:::lang python
```python
def __str__(self):
    text = "Name: " + self.name + "\n"
    text += "Student ID: " + self.studentId + "\n"
    text += "Date of birth: " + self.dateOfBirth.strftime("%Y.%m.%d (%A)") + "\n"
    return text
```
:::end

:::lang cpp
```cpp
// Inside the Student class:
std::string toString() const {
    char dateBuffer[40];
    std::strftime(dateBuffer, sizeof(dateBuffer), "%Y.%m.%d (%A)", &dateOfBirth);
    std::string text = "Name: " + name + "\n";
    text += "Student ID: " + studentId + "\n";
    text += "Date of birth: " + std::string(dateBuffer) + "\n";
    return text;
}
```
:::end

After overriding `toString()` as shown above, we can display the data of the instances in the main program as follows.

:::lang java
```java
public static void main(String[] args) {
    Student alex = new Student();
    alex.name = "Troll Alex";
    alex.dateOfBirth = LocalDate.of(1987, 5, 4);
    alex.studentId = "QWER12";

    Student ben = new Student();
    ben.name = "Ben Carter";
    ben.dateOfBirth = LocalDate.of(1977, 5, 10);
    ben.studentId = "AWSD99";

    System.out.println(alex);
    System.out.println(ben);
}
```
:::end

:::lang csharp
```csharp
static void Main(string[] args)
{
		Student alex = new Student();
		alex.name = "Troll Alex";
		alex.dateOfBirth = DateTime.Parse("1987.05.04");
		alex.studentId = "QWER12";

		Student ben = new Student();
		ben.name = "Ben Carter";
		ben.dateOfBirth = DateTime.Parse("1977.05.10");
		ben.studentId = "AWSD99";

		Console.WriteLine(alex);
		Console.WriteLine(ben);
}
```
:::end

:::lang python
```python
from datetime import date

alex = Student()
alex.name = "Troll Alex"
alex.dateOfBirth = date(1987, 5, 4)
alex.studentId = "QWER12"

ben = Student()
ben.name = "Ben Carter"
ben.dateOfBirth = date(1977, 5, 10)
ben.studentId = "AWSD99"

print(alex)
print(ben)
```
:::end

:::lang cpp
```cpp
#include <iostream>

int main() {
    Student alex;
    alex.name = "Troll Alex";
    alex.dateOfBirth = {0, 0, 0, 4, 4, 87};
    alex.studentId = "QWER12";

    Student ben;
    ben.name = "Ben Carter";
    ben.dateOfBirth = {0, 0, 0, 10, 4, 77};
    ben.studentId = "AWSD99";

    std::cout << alex.toString() << ben.toString();
}
```
:::end

We can also represent the structure of the class with a UML class diagram. The top compartment contains the class name, the middle one contains its fields, and the bottom one contains its methods. We will discuss the `+` symbol later.

![UML: Hallgato](content/chapters/02-osztalyok/media/hallgato-en.svg){width=310}

## Exercises {#exercises}

:::exercise
### Rectangles

![UML: Teglalap](content/chapters/02-osztalyok/media/teglalap-en.svg){width=330}

Create a `Rectangle` class that represents rectangles whose sides are parallel to the coordinate axes. Store the following **data** for each rectangle.

- **x** coordinate of the top-left vertex: real number
- **y** coordinate of the top-left vertex: real number
- rectangle **width**: real number
- rectangle **height**: real number

Implement the following methods in the class!

- calculate the **perimeter**: a parameterless function returning a real number
- calculate the **area**: a parameterless function returning a real number
- determine **overlap**: a function returning a boolean and accepting another rectangle as a parameter. Check whether the rectangles have a common region with positive area. Rectangles touching only along an edge or at a vertex do not count as overlapping!
- determine the containing **quadrant**: a parameterless function returning an integer. Return the number of the quadrant in whose interior the entire rectangle lies. Otherwise, return `-1`!

Assume that the **positive y direction points upward**, and width and height are positive. In the main program, create **5** rectangle instances, assign their fields, call the implemented methods, and display the results! Include an overlapping pair, a touching pair, and a separate pair.

:::endexercise

:::exercise
### Books

![UML: Konyv](content/chapters/02-osztalyok/media/konyv-en.svg){width=340}

Create a `Book` class that stores the following information about books.

- **author**: string
- **title**: string
- **price**: integer, in Hungarian forints
- **genre**: string (e.g. biography, horror, drama, historical, sci-fi, comedy)
- **printed**: boolean. True for a printed book and false for an e-book

Implement the following methods in the class!

- **apply a discount**: a procedure that accepts an integer between **1 and 99**. If the input is outside this range, leave the price unchanged and terminate the method. Otherwise, interpret the parameter as a percentage and update the stored price accordingly. Round the discounted price to a whole forint. **Extension:** apply the discount only if the new price is at least **899 HUF**!
- Override `toString()` to return the book data in a readable format!

In the main program, create **5** book instances, fill in the details of your favourite books, and display them. Then call the discount method with different values, including invalid ones, and display the instances again!

:::endexercise

:::exercise
### Films

![UML: Film](content/chapters/02-osztalyok/media/film-en.svg){width=360}

Create a `Movie` class that stores the following information.

- **director**: string
- **title**: string
- **cast**: three separate string fields storing at most three actor names
- **duration**: integer, in minutes
- **genre**: string (e.g. comedy, biography, sci-fi, horror, thriller, drama)
- **language**: string (e.g. Hungarian, English, German, French, Chinese)
- **subtitled**: boolean

Implement the following methods in the class!

- **appears in the film**: a function that accepts an actor’s name and returns a boolean. Check the three actor fields for the name, ignoring empty fields. Return false if no field matches!
- Override `toString()` to return the film details in a readable format. Express the duration as `hours:minutes:00`, and show whether the film is subtitled only if its language is not Hungarian!

In the main program, create **5** film instances with the data of your favourite films and display them. Then ask the user for an actor’s name and display the titles of the films featuring that actor!

:::endexercise
