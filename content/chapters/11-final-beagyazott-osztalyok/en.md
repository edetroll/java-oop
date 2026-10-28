# Nested and Final Classes

When designing classes, we must decide not only which fields and methods they contain but also how other classes are allowed to use them. Sometimes a helper class exists solely to support another class, and exposing it as an independent, publicly available type would serve no purpose. At other times, a class or method already defines the required behaviour completely, and we deliberately want to prevent subclasses from altering it through inheritance.

These goals may appear different, but both involve controlling the structure of our program. **Nested classes** allow us to place helper types close to the code that needs them and restrict their accessibility. In Java, **`final`** prevents a class from being extended or a method from being overridden; when applied to fields, it prevents assigning a new value. These restrictions are enforced by the compiler rather than relying solely on a programmer's agreement.

## Nested Classes {#nested}

In Java, we can declare a class inside another class. This is called a **nested class**. It is useful when the inner type is closely related to the responsibility of the enclosing class and has no independent meaning elsewhere. A container class, for example, may store loan information alongside each book. Such data can be represented by a `LoanRecord` class which the library needs internally, but which the main program need not know about.

Declaring the nested class `private` prevents other classes from naming its type or constructing its objects directly. The enclosing class may still use it freely and expose the necessary operations through public methods. Nesting therefore does not replace data hiding; it provides another way to keep implementation details out of a class's public interface.

In the following example, `Library` uses a private, statically nested `LoanRecord`. Each record stores a book identifier and a number of loan days, while users may only add loans and count overdue loans. The container never exposes its internal collection as a modifiable list, so control of the records remains with `Library`.

:::lang java
```java
import java.util.ArrayList;

class Library {
    private static class LoanRecord {
        private final String bookId;
        private final int days;

        private LoanRecord(String bookId, int days) {
            this.bookId = bookId;
            this.days = days;
        }
    }

    private final ArrayList<LoanRecord> loans = new ArrayList<>();

    public void addLoan(String bookId, int days) {
        if (bookId == null || bookId.isBlank() || days < 0)
            throw new IllegalArgumentException("Invalid loan");
        loans.add(new LoanRecord(bookId, days));
    }

    public int countOverdue(int allowedDays) {
        if (allowedDays < 0)
            throw new IllegalArgumentException("Invalid day limit");
        int count = 0;
        for (LoanRecord loan : loans)
            if (loan.days > allowedDays) count++;
        return count;
    }
}
```
:::end
:::lang csharp
```csharp
using System;
using System.Collections.Generic;

class Library {
    private class LoanRecord {
        public string BookId { get; }
        public int Days { get; }

        public LoanRecord(string bookId, int days) {
            BookId = bookId;
            Days = days;
        }
    }

    private readonly List<LoanRecord> loans = new();

    public void AddLoan(string bookId, int days) {
        if (string.IsNullOrWhiteSpace(bookId) || days < 0)
            throw new ArgumentException("Invalid loan");
        loans.Add(new LoanRecord(bookId, days));
    }

    public int CountOverdue(int allowedDays) {
        if (allowedDays < 0) throw new ArgumentException("Invalid day limit");
        int count = 0;
        foreach (LoanRecord loan in loans)
            if (loan.Days > allowedDays) count++;
        return count;
    }
}
```
:::end
:::lang python
```python
class Library:
    class _LoanRecord:
        def __init__(self, book_id, days):
            self.book_id = book_id
            self.days = days

    def __init__(self):
        self._loans = []

    def add_loan(self, book_id, days):
        if not book_id or not book_id.strip() or days < 0:
            raise ValueError("Invalid loan")
        self._loans.append(self._LoanRecord(book_id, days))

    def count_overdue(self, allowed_days):
        if allowed_days < 0:
            raise ValueError("Invalid day limit")
        return sum(loan.days > allowed_days for loan in self._loans)
```
:::end
:::lang cpp
```cpp
#include <string>
#include <vector>
#include <stdexcept>

class Library {
    struct LoanRecord {
        std::string bookId;
        int days;
    };

    std::vector<LoanRecord> loans;
public:
    void addLoan(const std::string& bookId, int days) {
        if (bookId.empty() || days < 0)
            throw std::invalid_argument("Invalid loan");
        loans.push_back({bookId, days});
    }

    int countOverdue(int allowedDays) const {
        if (allowedDays < 0)
            throw std::invalid_argument("Invalid day limit");
        int count = 0;
        for (const LoanRecord& loan : loans)
            if (loan.days > allowedDays) ++count;
        return count;
    }
};
```
:::end

![Nested helper class – UML](content/chapters/11-final-beagyazott-osztalyok/media/library-en.svg){width=650}

The `static` modifier in Java means that a `LoanRecord` object is not automatically bound to a particular `Library` instance. The nested class can be instantiated by the appropriate enclosing-class code without an enclosing object reference, and it can access the enclosing class's static members directly. This is useful for small internal data types that do not need the state of a particular enclosing object.

## Non-static Inner Classes {#inner}

Java also allows **non-static inner classes**. Every instance of such a class belongs to a specific enclosing object and can access that object's instance fields and methods, including private ones. For example, a `Garage` may store a private `servicePrice`, while each `ServiceTicket` associated with that garage calculates the price of a repair using the garage's current rate. In this case, an explicit connection between the inner and outer instance is meaningful.

:::lang java
```java
class Garage {
    private int servicePrice;

    public Garage(int servicePrice) {
        if (servicePrice <= 0) throw new IllegalArgumentException();
        this.servicePrice = servicePrice;
    }

    public class ServiceTicket {
        private int hours;

        public ServiceTicket(int hours) {
            if (hours <= 0) throw new IllegalArgumentException();
            this.hours = hours;
        }

        public int calculateCost() {
            return hours * servicePrice;
        }
    }
}

class Main {
    public static void main(String[] args) {
        Garage garage = new Garage(8000);
        Garage.ServiceTicket ticket = garage.new ServiceTicket(3);
        System.out.println(ticket.calculateCost());
    }
}
```
:::end
:::lang csharp
```csharp
using System;

class Garage {
    private int servicePrice;
    public Garage(int servicePrice) {
        if (servicePrice <= 0) throw new ArgumentException();
        this.servicePrice = servicePrice;
    }

    public class ServiceTicket {
        private Garage garage;
        private int hours;

        public ServiceTicket(Garage garage, int hours) {
            if (garage == null || hours <= 0) throw new ArgumentException();
            this.garage = garage;
            this.hours = hours;
        }

        public int CalculateCost() {
            return hours * garage.servicePrice;
        }
    }
}
```
:::end
:::lang python
```python
class Garage:
    def __init__(self, service_price):
        if service_price <= 0:
            raise ValueError("Invalid price")
        self._service_price = service_price

    class ServiceTicket:
        def __init__(self, garage, hours):
            if garage is None or hours <= 0:
                raise ValueError("Invalid ticket")
            self._garage = garage
            self._hours = hours

        def calculate_cost(self):
            return self._hours * self._garage._service_price

    def new_ticket(self, hours):
        return self.ServiceTicket(self, hours)

Garage(8000).new_ticket(3).calculate_cost()
```
:::end
:::lang cpp
```cpp
#include <stdexcept>

class Garage {
    int servicePrice;
public:
    explicit Garage(int price) : servicePrice(price) {
        if (price <= 0) throw std::invalid_argument("Invalid price");
    }

    class ServiceTicket {
        const Garage& garage;
        int hours;
    public:
        ServiceTicket(const Garage& garage, int hours)
            : garage(garage), hours(hours) {
            if (hours <= 0) throw std::invalid_argument("Invalid hours");
        }
        int calculateCost() const { return hours * garage.servicePrice; }
    };
};
```
:::end

![Non-static inner class – UML](content/chapters/11-final-beagyazott-osztalyok/media/garage-en.svg){width=650}

These two approaches differ in more than their instantiation syntax. A non-static Java inner class can refer to its associated outer instance, whereas a statically nested class receives no such reference automatically. Nested types in C#, Python and C++ do not automatically receive an outer instance reference either, so we must pass one explicitly where needed. Nesting is still useful for grouping related types and, depending on the language, restricting access. In Python, however, an underscore prefix is a naming convention rather than a true access restriction.

## Final Classes {#final-classes}

When studying inheritance, we learned how to extend an existing class. Sometimes, however, we consider a class complete and do not want to permit further subclasses. In Java, we declare such a class `final`. Its objects can still be instantiated, and its fields and methods remain usable according to their access modifiers, but no class may extend it.

This is different from providing only `private` constructors. Private constructors primarily restrict instantiation and may also limit certain forms of inheritance, but `final` expresses the intention directly. A `final` class guarantees that no subclass will extend its behaviour or type. C# uses `sealed` for this purpose, while C++ also uses `final`. In Python, the `typing.final` decorator communicates the intention mainly to static type checkers; by itself it does not prevent inheritance at runtime.

:::lang java
```java
final class InvoiceNumber {
    private final int value;

    public InvoiceNumber(int value) {
        if (value <= 0) throw new IllegalArgumentException();
        this.value = value;
    }

    public int getValue() { return value; }
}

// class SpecialInvoiceNumber extends InvoiceNumber { } // Compilation error
```
:::end
:::lang csharp
```csharp
using System;

sealed class InvoiceNumber {
    private readonly int value;

    public InvoiceNumber(int value) {
        if (value <= 0) throw new ArgumentException();
        this.value = value;
    }

    public int GetValue() { return value; }
}

// class SpecialInvoiceNumber : InvoiceNumber { } // Compilation error
```
:::end
:::lang python
```python
from typing import final

@final
class InvoiceNumber:
    def __init__(self, value):
        if value <= 0:
            raise ValueError("Invalid value")
        self._value = value

    def get_value(self):
        return self._value

# The type checker reports invalid inheritance,
# but Python does not prohibit it at runtime.
```
:::end
:::lang cpp
```cpp
#include <stdexcept>

class InvoiceNumber final {
    const int value;
public:
    explicit InvoiceNumber(int value) : value(value) {
        if (value <= 0) throw std::invalid_argument("Invalid value");
    }
    int getValue() const { return value; }
};

// class SpecialInvoiceNumber : public InvoiceNumber { }; // Compilation error
```
:::end

## Final Methods and Fields {#final-members}

The `final` keyword also applies to individual methods. A final method is inherited but cannot be overridden by subclasses. This is particularly valuable for operations containing important checks that must be enforced uniformly across all subclasses. For example, the validation performed before withdrawing money from an account may be final, while different account types are still free to implement additional operations.

For fields, `final` has a different meaning: a Java field cannot be assigned another value after it has been initialised. If the field is a reference to an object, however, preventing reassignment does not automatically make that object immutable. We can still add elements to an `ArrayList` through a `final` reference. Similarly, `static final` fields often represent constants, but a `static final` reference to a mutable object does not make the referenced object entirely immutable.

:::lang java
```java
import java.util.ArrayList;

class BankAccount {
    private int balance;
    private final ArrayList<String> history = new ArrayList<>();

    public BankAccount(int balance) {
        if (balance < 0) throw new IllegalArgumentException();
        this.balance = balance;
    }

    public final void withdraw(int amount) {
        if (amount <= 0 || amount > balance)
            throw new IllegalArgumentException();
        balance -= amount;
        history.add("Withdrawal: " + amount);
    }

    public int getBalance() { return balance; }
}

class SavingsAccount extends BankAccount {
    public SavingsAccount(int balance) { super(balance); }
    // public void withdraw(int amount) { } // Compilation error
}
```
:::end
:::lang csharp
```csharp
using System;
using System.Collections.Generic;

class BankAccount {
    private int balance;
    private readonly List<string> history = new();

    public BankAccount(int balance) {
        if (balance < 0) throw new ArgumentException();
        this.balance = balance;
    }

    public virtual void Withdraw(int amount) {
        if (amount <= 0 || amount > balance)
            throw new ArgumentException();
        balance -= amount;
        history.Add("Withdrawal: " + amount);
    }
    public int GetBalance() { return balance; }
}

class SavingsAccount : BankAccount {
    public SavingsAccount(int balance) : base(balance) { }
    public sealed override void Withdraw(int amount) {
        base.Withdraw(amount);
    }
}
```
:::end
:::lang python
```python
from typing import final

class BankAccount:
    def __init__(self, balance):
        if balance < 0:
            raise ValueError("Invalid balance")
        self._balance = balance
        self._history = []

    @final
    def withdraw(self, amount):
        if amount <= 0 or amount > self._balance:
            raise ValueError("Invalid amount")
        self._balance -= amount
        self._history.append(f"Withdrawal: {amount}")

    def get_balance(self):
        return self._balance

# @final: type-checker hint, not runtime protection
```
:::end
:::lang cpp
```cpp
#include <stdexcept>
#include <vector>
#include <string>

class BankAccount {
    int balance;
    const int accountId;
public:
    BankAccount(int balance, int accountId)
        : balance(balance), accountId(accountId) {
        if (balance < 0 || accountId <= 0)
            throw std::invalid_argument("Invalid account");
    }
    virtual ~BankAccount() = default;
    virtual void withdraw(int amount) final {
        if (amount <= 0 || amount > balance)
            throw std::invalid_argument("Invalid amount");
        balance -= amount;
    }
    int getBalance() const { return balance; }
};
```
:::end

![Purpose of a final method – UML](content/chapters/11-final-beagyazott-osztalyok/media/final-method-en.svg){width=570}

In C#, `sealed override` prevents any further overriding of a method that was previously overridden. Java allows `final` directly in a method declaration, while C++ uses it to prevent further overriding of virtual functions. Python's `@final` expresses the intention to a type checker. All these mechanisms reflect the same design decision: we must decide at which point in the hierarchy a method's behaviour should cease to be replaceable.

Nesting and the relationship to an enclosing instance are distinct concepts. In Java, a `static` nested class can access the private static members of its enclosing class, but needs an explicit object reference to access instance data. A non-static inner class automatically retains a reference to its enclosing object. A `private` nested type is an implementation detail, while a `public` inner class can be used from outside. Choose the narrowest suitable access level.

A `final` field does not make every part of its referenced object immutable. A `final` list reference cannot be assigned a different list, but elements may still be added and removed. The encapsulation rules discussed earlier continue to apply.

In C#, `sealed` can be applied to a method only together with `override`, to close an inherited virtual method after overriding it. To prevent overriding from the start, define an ordinary non-`virtual` method in the base class. This achieves a similar design goal using different syntax from Java `final`.

## Exercises {#tasks}

For each exercise, the nested helper class must have explicitly specified accessibility and a clearly chosen static or instance relationship. A `final` class, method and field impose different restrictions: they prevent inheritance, overriding and reassignment, respectively. Verify not only the correct result but also that access which should be forbidden is actually rejected.

These exercises practise restricting access to internal implementation details and deliberately limiting further inheritance. A nested class does not replace the public methods of its container, so the enclosing class must still control operations on its data. Reuse the previously developed classes wherever appropriate.

:::exercise
### Rectangles – Fixed Dimensions

**Main mechanism:** a `final` class and `final` fields. Assign the data exactly once in the constructor; do not provide setters.

![Rectangles – UML](content/chapters/11-final-beagyazott-osztalyok/media/task-rectangle-en.svg){width=590}

**Classes and fields**
- Create a `final` `RectangleSize` class with `width : double` and `height : double` fields. Both must be `private final` and store positive real values.

**Constructors and methods**
- The `RectangleSize(width : double, height : double)` constructor must validate both arguments. `getWidth()` and `getHeight()` provide read-only access.
- `getArea() : double` must calculate the area. Dimensions must not be modifiable after construction.
- Try to derive a class from `RectangleSize` that calculates area differently, and examine the compiler error.
:::endexercise

:::exercise
### Library – Internal Loan Records

**Main mechanism:** a private `static` nested class. Outside code must not access the records or obtain a mutable reference to the stored list.

![Library – UML](content/chapters/11-final-beagyazott-osztalyok/media/task-library-en.svg){width=640}

**Classes and fields**
- Within `Library`, create a private, statically nested `LoanRecord` class storing a nonempty `bookId : String` and nonnegative `days : int`.
- `Library` must have a private `loans : ArrayList<LoanRecord>` collection initialised when the library is created.

**Constructors and methods**
- `LoanRecord(bookId : String, days : int)` must validate both fields. External code must not access the nested class or the collection directly.
- `addLoan(bookId : String, days : int) : void` must construct and store a record. A book identifier may occur at most once; throw an exception for a duplicate.
- `countOverdue(allowedDays : int) : int` must count loans whose duration exceeds the nonnegative limit. `getLoanCount() : int` must return the number of records.
- Verify that the main program can modify records only through the public interface.
:::endexercise

:::exercise
### Garage – Internal Service Ticket

**Main mechanism:** a non-static inner class. Each service ticket must use the hourly rate of the particular garage to which it belongs.

![Garage – UML](content/chapters/11-final-beagyazott-osztalyok/media/task-garage-en.svg){width=660}

**Classes and fields**
- The `Garage` class stores a nonempty `name : String` and positive `hourlyRate : int`, both private.
- Define a public, non-static `ServiceTicket` inner class inside `Garage`. It stores positive `hours : int` in a private field.

**Constructors and methods**
- The `Garage(name : String, hourlyRate : int)` constructor must validate both fields. The `ServiceTicket(hours : int)` constructor must validate and save the hours.
- `ServiceTicket.calculateCost() : int` must calculate the cost using the hourly rate of its enclosing `Garage` instance.
- Provide `getName() : String` and `getHourlyRate() : int` in `Garage`; neither field may be modified externally.
- Create two garages with different hourly rates and one service ticket for each. Demonstrate that the same duration produces different costs.
:::endexercise

:::exercise
### Bank Accounts – Non-overridable Withdrawal

**Main mechanism:** a `final` instance method. `withdraw()` remains callable in a subclass but cannot be redefined with the same parameter signature.

![Bank accounts – UML](content/chapters/11-final-beagyazott-osztalyok/media/task-bank-en.svg){width=660}

**Classes and fields**
- `BankAccount` stores private `accountNumber : String` and `balance : int` fields. The account number cannot be empty, and the balance must be nonnegative.
- `SavingsAccount` extends it with a nonnegative `interestRate : double` field.

**Constructors and methods**
- The `BankAccount(accountNumber : String, balance : int)` and `SavingsAccount(accountNumber : String, balance : int, interestRate : double)` constructors must validate and initialise all their data.
- Declare `BankAccount.withdraw(amount : int) : void` as `final`. It must reject nonpositive amounts and withdrawals that would make the balance negative.
- `getBalance() : int` and `getAccountNumber() : String` provide read-only access. `SavingsAccount.calculateMonthlyInterest() : int` returns the integer obtained by rounding the product of the balance and interest rate downwards.
- Demonstrate that the inherited `withdraw()` can be used but cannot be overridden in `SavingsAccount`.
:::endexercise

:::exercise
### Movie Catalogue – Private Screening Data

**Main mechanism:** a private `static` nested helper class in a container. Only public methods of the containing class may manage the records.

![Movie catalogue – UML](content/chapters/11-final-beagyazott-osztalyok/media/task-movies-en.svg){width=660}

**Classes and fields**
- Define a private, statically nested `Screening` class inside `MovieCatalog`. Each screening stores a nonempty `movieTitle : String` and a nonnegative `seatsSold : int`.
- `MovieCatalog` contains a private `screenings : ArrayList<Screening>` collection.

**Constructors and methods**
- `Screening(movieTitle : String, seatsSold : int)` must validate its parameters, and `MovieCatalog()` must initialise the list.
- `addScreening(movieTitle : String, seatsSold : int) : void` must add a screening. `getTotalTickets() : int` must return the total number of tickets sold.
- `countPopular(minimumTickets : int) : int` must count screenings with at least the given nonnegative ticket count. Throw an exception for negative input.
- Neither the collection nor the `Screening` instances may be exposed directly. Test the summary methods after adding several screenings.
:::endexercise
