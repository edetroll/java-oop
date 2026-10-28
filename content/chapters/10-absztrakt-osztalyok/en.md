# Abstract Classes

When studying inheritance and late binding, we saw that a subclass may override inherited methods and that, at runtime, the implementation to execute is selected according to the object's actual type. Sometimes, however, we are working at a level of the class hierarchy where we can specify what a method must accomplish but cannot yet define how to accomplish it. For example, we know that preparing coffee involves grinding the beans and brewing the drink, but the appropriate grind size and brewing procedure depend on the particular type of coffee.

In such a situation, implementing an empty method and hoping that every subclass overrides it is not a reliable solution. Forgetting to override it might cause an incorrect result without any error. Throwing an exception from a placeholder implementation is not much better, since the missing operation would only become apparent at runtime. **An abstract method lets us prescribe an operation without implementing its body, while requiring concrete subclasses to provide that implementation.**

## Abstract Methods and Classes {#abstract-methods}

In Java, we mark such methods with the `abstract` keyword and terminate their declarations with a semicolon instead of writing a method body. A class containing an abstract method must itself be declared `abstract`. An abstract class may nevertheless contain fields, constructors and completely implemented methods. We may even declare a class abstract without declaring any abstract methods if we want to prevent direct instantiation.

We cannot instantiate an abstract class directly, but we can use its type for references, method parameters and elements of a container. A concrete subclass must implement all abstract methods that have not yet been implemented in its inheritance hierarchy; otherwise it must remain abstract itself. Since the compiler checks this requirement, an abstract method imposes a stronger obligation than a method that can merely be overridden.

In the following example, every payment method must be able to calculate its transaction fee, even though the rules depend on the particular payment type. `PaymentMethod` can already implement the calculation of the total because it can call `calculateFee()`, which concrete subclasses implement later. Each payment method provides its own version of that operation.

:::lang java
```java
abstract class PaymentMethod {
    public abstract int calculateFee(int amount);

    public int calculateTotal(int amount) {
        return amount + calculateFee(amount);
    }
}

class BankTransfer extends PaymentMethod {
    @Override
    public int calculateFee(int amount) {
        return 150;
    }
}

class CardPayment extends PaymentMethod {
    @Override
    public int calculateFee(int amount) {
        return amount / 100;
    }
}

class Main {
    public static void main(String[] args) {
        PaymentMethod payment = new CardPayment();
        System.out.println(payment.calculateTotal(10000));
    }
}
```
:::end
:::lang csharp
```csharp
using System;

abstract class PaymentMethod {
    public abstract int CalculateFee(int amount);

    public int CalculateTotal(int amount) {
        return amount + CalculateFee(amount);
    }
}

class BankTransfer : PaymentMethod {
    public override int CalculateFee(int amount) {
        return 150;
    }
}

class CardPayment : PaymentMethod {
    public override int CalculateFee(int amount) {
        return amount / 100;
    }
}

class Program {
    static void Main() {
        PaymentMethod payment = new CardPayment();
        Console.WriteLine(payment.CalculateTotal(10000));
    }
}
```
:::end
:::lang python
```python
from abc import ABC, abstractmethod

class PaymentMethod(ABC):
    @abstractmethod
    def calculate_fee(self, amount):
        pass

    def calculate_total(self, amount):
        return amount + self.calculate_fee(amount)

class BankTransfer(PaymentMethod):
    def calculate_fee(self, amount):
        return 150

class CardPayment(PaymentMethod):
    def calculate_fee(self, amount):
        return amount // 100

payment = CardPayment()
print(payment.calculate_total(10000))
```
:::end
:::lang cpp
```cpp
#include <iostream>

class PaymentMethod {
public:
    virtual ~PaymentMethod() = default;
    virtual int calculateFee(int amount) const = 0;

    int calculateTotal(int amount) const {
        return amount + calculateFee(amount);
    }
};

class BankTransfer : public PaymentMethod {
public:
    int calculateFee(int amount) const override { return 150; }
};

class CardPayment : public PaymentMethod {
public:
    int calculateFee(int amount) const override { return amount / 100; }
};

int main() {
    CardPayment card;
    PaymentMethod& payment = card;
    std::cout << payment.calculateTotal(10000) << '\n';
}
```
:::end

![Abstract payment methods – UML](content/chapters/10-absztrakt-osztalyok/media/payment-en.svg){width=620}

In UML, abstract class names and abstract method names are written in italics. The common `calculateTotal()` algorithm works for different payment types because late binding selects the appropriate implementation of `calculateFee()`. A concrete subclass is not inventing a separate fee-calculation interface: it is implementing the very operation already prescribed by the superclass.

## The Coffee Preparation Algorithm {#coffee}

Regardless of the coffee we wish to prepare, there is a recognisable sequence of operations. First we grind the coffee, then brew it, and finally add milk if the particular drink requires it. We can define the order of these operations in the common superclass while leaving the details of grinding and brewing to the subclasses. This illustrates the central idea of the **Template Method** design pattern: the overall algorithm remains fixed, but individual steps may have different implementations.

In the `Coffee` class, the `prepare()` method specifies the sequence. Every concrete coffee type must implement the abstract `grind()` and `brew()` methods. In contrast, `addMilk()` has an empty implementation: it is an optional step which is overridden only by drinks that actually contain milk. This example also shows the difference between an abstract method and an overridable method whose overriding is not compulsory.

:::lang java
```java
abstract class Coffee {
    protected abstract void grind();
    protected abstract void brew();

    protected void addMilk() { }

    public void prepare() {
        grind();
        brew();
        addMilk();
    }
}

class Espresso extends Coffee {
    @Override
    protected void grind() {
        System.out.println("Grind finely");
    }

    @Override
    protected void brew() {
        System.out.println("Brew 30 ml under high pressure");
    }
}

class Cappuccino extends Coffee {
    @Override
    protected void grind() {
        System.out.println("Grind finely");
    }

    @Override
    protected void brew() {
        System.out.println("Brew 30 ml under high pressure");
    }

    @Override
    protected void addMilk() {
        System.out.println("Add steamed milk and milk foam");
    }
}

class Main {
    public static void main(String[] args) {
        Coffee coffee = new Cappuccino();
        coffee.prepare();
    }
}
```
:::end
:::lang csharp
```csharp
using System;

abstract class Coffee {
    protected abstract void Grind();
    protected abstract void Brew();
    protected virtual void AddMilk() { }

    public void Prepare() {
        Grind();
        Brew();
        AddMilk();
    }
}

class Espresso : Coffee {
    protected override void Grind() => Console.WriteLine("Grind finely");
    protected override void Brew() => Console.WriteLine("Brew 30 ml under high pressure");
}

class Cappuccino : Coffee {
    protected override void Grind() => Console.WriteLine("Grind finely");
    protected override void Brew() => Console.WriteLine("Brew 30 ml under high pressure");
    protected override void AddMilk() => Console.WriteLine("Add steamed milk and milk foam");
}

class Program {
    static void Main() {
        Coffee coffee = new Cappuccino();
        coffee.Prepare();
    }
}
```
:::end
:::lang python
```python
from abc import ABC, abstractmethod

class Coffee(ABC):
    @abstractmethod
    def grind(self):
        pass

    @abstractmethod
    def brew(self):
        pass

    def add_milk(self):
        pass

    def prepare(self):
        self.grind()
        self.brew()
        self.add_milk()

class Espresso(Coffee):
    def grind(self):
        print("Grind finely")

    def brew(self):
        print("Brew 30 ml under high pressure")

class Cappuccino(Coffee):
    def grind(self):
        print("Grind finely")

    def brew(self):
        print("Brew 30 ml under high pressure")

    def add_milk(self):
        print("Add steamed milk and milk foam")

coffee = Cappuccino()
coffee.prepare()
```
:::end
:::lang cpp
```cpp
#include <iostream>

class Coffee {
protected:
    virtual void grind() const = 0;
    virtual void brew() const = 0;
    virtual void addMilk() const { }
public:
    virtual ~Coffee() = default;
    void prepare() const {
        grind();
        brew();
        addMilk();
    }
};

class Espresso : public Coffee {
protected:
    void grind() const override { std::cout << "Grind finely\n"; }
    void brew() const override { std::cout << "Brew 30 ml under high pressure\n"; }
};

class Cappuccino : public Coffee {
protected:
    void grind() const override { std::cout << "Grind finely\n"; }
    void brew() const override { std::cout << "Brew 30 ml under high pressure\n"; }
    void addMilk() const override {
        std::cout << "Add steamed milk and milk foam\n";
    }
};

int main() {
    Cappuccino cappuccino;
    Coffee& coffee = cappuccino;
    coffee.prepare();
}
```
:::end

![Coffee preparation – UML](content/chapters/10-absztrakt-osztalyok/media/coffee-en.svg){width=620}

We invoke `prepare()` after constructing the object rather than from the superclass constructor. During construction, subclass state may not yet be ready, and calling an overridable method at that point could lead to unexpected behaviour. This does not change the algorithm: the superclass still defines the steps of coffee preparation, and the concrete classes provide their implementations.

## Using Abstract Classes {#usage}

Abstract classes are especially useful when we want to manage several related kinds of objects through a common type, but some of their shared operations have no generally applicable implementation. We might define an abstract class representing shapes, which requires every concrete shape to calculate its area, or one representing publications whose processing costs follow different rules. We can store instances of different subclasses in a collection declared with the superclass type and still execute their respective implementations.

In Java, an abstract method cannot be `private`, `static` or `final`, since these modifiers are incompatible with the requirement that a subclass implement it. The abstract class itself may still have static methods and concrete methods that are not meant to be overridden. C# uses `abstract` and `override`, C++ uses pure virtual methods written as `virtual ... = 0`, and Python uses `ABC` and `@abstractmethod` from the `abc` module. These provide similar design possibilities, although the language-level details differ.

## Exercises {#tasks}

In these exercises, we will extend familiar class hierarchies with common operations whose actual implementations depend on the concrete subclass. The UML diagrams show the required fields and methods, while the textual requirements specify their validation and behaviour.

:::exercise
### Rectangles and Shapes

![Shapes – UML](content/chapters/10-absztrakt-osztalyok/media/task-shapes-en.svg){width=650}

**Classes and fields**
- Create an abstract `Shape` class containing the `name : String` field. The name must not be `null` or empty. It can be read using `getName()` but cannot be modified from outside the class.
- `Rectangle` stores positive real-valued `width` and `height` fields. `Circle` stores a positive real-valued `radius`.

**Constructors and methods**
- The `Shape(name : String)` constructor must validate and store the name. The `Rectangle(name : String, width : double, height : double)` and `Circle(name : String, radius : double)` constructors must initialise the common data through the superclass constructor and validate their own fields.
- Declare abstract `getArea() : double` and `getPerimeter() : double` methods in `Shape`. Implement both in the subclasses using the appropriate geometric formulas.
- The shared concrete `isLargerThan(other : Shape) : boolean` method must compare the areas and return `true` if this shape is larger. Throw an exception if the parameter is `null`.
- Store different shapes in an `ArrayList<Shape>` in the main program and find the one with the largest area.
:::endexercise

:::exercise
### Books and Publications

![Publications – UML](content/chapters/10-absztrakt-osztalyok/media/task-publications-en.svg){width=650}

**Classes and fields**
- The abstract `Publication` class stores a nonempty `title : String` and a positive `basePrice : int`. Only its constructor may set these fields; provide `getTitle()` and `getBasePrice()` methods for reading them.
- `Textbook` stores a positive `pageCount : int` and `Magazine` stores a positive `issueNumber : int`.

**Constructors and methods**
- The `Publication(title : String, basePrice : int)` constructor must validate the shared data. The subclass constructors must receive and validate both the shared data and their additional field.
- Declare an abstract `calculateShippingCost() : int` in `Publication`. The shipping cost for a textbook is `600 + 2 * pageCount`, while the cost for a magazine is `400` forints.
- The concrete `getTotalPrice() : int` method must add the shipping cost to the base price. Do not create separate total-price methods in the subclasses.
- Construct an `ArrayList<Publication>` and find the publication with the highest total price.
:::endexercise

:::exercise
### Vehicles

![Vehicles – UML](content/chapters/10-absztrakt-osztalyok/media/task-vehicles-en.svg){width=650}

**Classes and fields**
- The abstract `Vehicle` class stores a nonempty `brand : String` and nonnegative `mileage : int`. Only the constructor may set these fields; create `getBrand()` and `getMileage()` methods to read them.
- `Car` adds a positive `engineCapacity : int` field and `Motorcycle` adds a `sidecar : boolean` field.

**Constructors and methods**
- The `Vehicle(brand : String, mileage : int)` constructor must validate the shared fields. Subclass constructors must call it and then initialise their additional field.
- Declare an abstract `getServiceInterval() : int` in `Vehicle`. For cars, the interval is `15000` km when engine capacity is at least `1600`, and `10000` km otherwise. For motorcycles, it is `5000` km with a sidecar and `7000` km without one.
- The concrete `needsService(kmSinceService : int) : boolean` method must compare a nonnegative distance with the applicable service interval and return `true` once the interval is reached. Negative input must cause an exception.
- Store different vehicles in an `ArrayList<Vehicle>` and select those requiring a service after a specified distance.
:::endexercise

:::exercise
### Bank Accounts

![Bank accounts – UML](content/chapters/10-absztrakt-osztalyok/media/task-bank-en.svg){width=650}

**Classes and fields**
- The abstract `BankAccount` stores a nonempty `accountNumber : String` and nonnegative `balance : int`. The account number must be read-only; the balance may change only through the previously implemented deposit and withdrawal methods.
- `SavingsAccount` stores a nonnegative `monthlyFreeTransfers : int`, while `BusinessAccount` stores a positive `feePercent : double` fee percentage.

**Constructors and methods**
- The `BankAccount(accountNumber : String, balance : int)` constructor must validate its fields. The subclass constructors must also validate their own parameters.
- Declare abstract `calculateTransferFee(amount : int) : int` in `BankAccount`. The amount must be positive. For a savings account, the fee is `0` when free transfers remain, otherwise `300` forints. For a business account, round the product of the amount and the fee percentage upwards to an integer.
- The shared `canTransfer(amount : int) : boolean` method must check whether the balance covers both the transfer amount and its fee. Calling this method must neither withdraw any money nor decrease the remaining number of free transfers.
- From an `ArrayList<BankAccount>`, select accounts that can make a transfer of `25000` forints.
:::endexercise

:::exercise
### Movies and Series

![Movies and series – UML](content/chapters/10-absztrakt-osztalyok/media/task-media-en.svg){width=650}

**Classes and fields**
- The abstract `MediaItem` class stores a nonempty `title : String` and positive `releaseYear : int`. Expose these through `getTitle()` and `getReleaseYear()`, but do not allow external modification.
- `Movie` stores a positive `duration : int` in minutes, while `Series` stores a positive `episodeCount : int` and positive `episodeDuration : int` representing the average episode length.

**Constructors and methods**
- The `MediaItem(title : String, releaseYear : int)` constructor must validate and initialise the shared data. The `Movie` and `Series` constructors must also validate their additional fields.
- Declare abstract `getTotalDuration() : int` in `MediaItem`. For a movie, this is its duration. For a series, it is the number of episodes multiplied by the average episode duration.
- The shared `fitsInto(availableMinutes : int) : boolean` method must return whether the nonnegative time allowance is at least the full duration. Throw an exception for negative input.
- From an `ArrayList<MediaItem>`, select the movies and series that can be watched in full within four hours.
:::endexercise
