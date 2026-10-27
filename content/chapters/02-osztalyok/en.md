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

![UML: Student](content/chapters/02-osztalyok/media/hallgato-en.svg){width=310}

## Exercises {#exercises}

The tasks below specify the type, accessibility and validity of each field, as well as the required behaviour of each operation. The UML diagrams illustrate these requirements, but the textual specifications are complete on their own.

:::exercise
### Rectangles
![Rectangles – UML](content/chapters/02-osztalyok/media/complete-task-1-en.svg){width=560}
Create the `Rectangle` class with the following fields and operations. Implement the following fields and methods with the specified behaviour.

**Fields and properties**
- `x : double` – x. For now, a public field that the main program may access directly.
- `y : double` – y. For now, a public field that the main program may access directly.
- `width : double` – width. For now, a public field that the main program may access directly.
- `height : double` – height. For now, a public field that the main program may access directly.

**Methods**
- `getPerimeter() : double` – parameterless function returning `2 × (width + height)`.
- `getArea() : double` – parameterless function returning `width × height`.
- `overlaps(other : Rectangle) : boolean` – checks whether the two rectangles have a common area of positive size; touching edges alone do not count.
- `getQuadrant() : int` – returns `1`–`4` if the entire rectangle lies strictly in one quadrant, otherwise `-1`.

**Main program**
Create five different instances, supply their data and test all required operations. Where validation has been introduced, try both valid and invalid values.
:::endexercise

:::exercise
### Books
![Books – UML](content/chapters/02-osztalyok/media/complete-task-2-en.svg){width=560}
Create the `Book` class with the following fields and operations. Implement the following fields and methods with the specified behaviour.

**Fields and properties**
- `author : String` – author. For now, a public field that the main program may access directly.
- `title : String` – title. For now, a public field that the main program may access directly.
- `price : int` – price. For now, a public field that the main program may access directly.
- `genre : String` – genre, for now use a String.
- `printed : boolean` – printed. For now, a public field that the main program may access directly.

**Methods**
- `discount(percent : int) : void` – accepts an integer percentage from `1` to `99`; invalid input leaves the price unchanged; round the discounted price down to whole forints and do not allow a price under `899`.
- `toString() : String` – returns a readable text with the book’s key fields.

**Main program**
Create five different instances, supply their data and test all required operations. Where validation has been introduced, try both valid and invalid values.
:::endexercise

:::exercise
### Cars
![Cars – UML](content/chapters/02-osztalyok/media/complete-task-3-en.svg){width=560}
Create the `Car` class with the following fields and operations. Implement the following fields and methods with the specified behaviour.

**Fields and properties**
- `brand : String` – brand. For now, a public field that the main program may access directly.
- `model : String` – model. For now, a public field that the main program may access directly.
- `year : int` – year. For now, a public field that the main program may access directly.
- `mileage : int` – mileage (integer km). For now, a public field that the main program may access directly.

**Methods**
- `drive(distance : int) : void` – accepts only a positive number of whole kilometres and increases `mileage`.
- `toString() : String` – returns a displayable summary of brand, model, year and mileage.

**Main program**
Create five different instances, supply their data and test all required operations. Where validation has been introduced, try both valid and invalid values.
:::endexercise

:::exercise
### Bank accounts
![Bank accounts – UML](content/chapters/02-osztalyok/media/complete-task-4-en.svg){width=560}
Create the `BankAccount` class with the following fields and operations. Implement the following fields and methods with the specified behaviour.

**Fields and properties**
- `owner : String` – owner. For now, a public field that the main program may access directly.
- `accountNumber : String` – account number. For now, a public field that the main program may access directly.
- `balance : int` – balance. For now, a public field that the main program may access directly.

**Methods**
- `deposit(amount : int) : void` – accepts a positive amount and increases the balance.
- `withdraw(amount : int) : void` – withdraws only a positive amount not exceeding the balance.
- `getBalance() : int` – returns the current balance.
- `toString() : String` – returns a readable string with number, holder and balance.

**Main program**
Create five different instances, supply their data and test all required operations. Where validation has been introduced, try both valid and invalid values.
:::endexercise

:::exercise
### Movies
![Movies – UML](content/chapters/02-osztalyok/media/complete-task-5-en.svg){width=560}
Create the `Movie` class with the following fields and operations. Implement the following fields and methods with the specified behaviour.

**Fields and properties**
- `director : String` – director. For now, a public field that the main program may access directly.
- `title : String` – title. For now, a public field that the main program may access directly.
- `duration : int` – duration. For now, a public field that the main program may access directly.
- `language : Language` – language. For now, a public field that the main program may access directly.
- `subtitles : boolean` – subtitles. For now, a public field that the main program may access directly.
- `actor1 : String` – the name of one actor; use `null` if no actor occupies this position.
- `actor2 : String` – the name of one actor; use `null` if no actor occupies this position.
- `actor3 : String` – the name of one actor; use `null` if no actor occupies this position.
- `category : String` – movie genre, stored as text.

**Methods**
- `hasActor(name : String) : boolean` – returns whether the named actor appears in the film.
- `toString() : String` – readable text with time formatted as `hours:minutes:00`; show subtitle info only for non-Hungarian films.

**Main program**
Create five different instances, supply their data and test all required operations. Where validation has been introduced, try both valid and invalid values.
:::endexercise
