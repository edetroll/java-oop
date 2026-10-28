# Interfaces

In our programs, we often need to perform the same operation on instances of different classes. For example, we may send a print job to a basic desktop printer or a multifunction device, and the part of the program that requests the operation does not need to understand how either machine works internally. It only needs to know that the object it receives can print a document. If a new printer is added to the system later, we should be able to use it without rewriting the entire procedure.

Inheritance and abstract classes could provide a common superclass, but in many cases this would introduce an unnecessary relationship between otherwise independent devices. Moreover, Java classes can have only one direct superclass. Quite often the relevant question is not **which class an object inherits from**, but **which operations it can perform**. Interfaces provide a way to express exactly these requirements.

## The Meaning of an Interface {#interface-concept}

An **interface** is not a class; it is a contract specifying the operations an implementing class must provide. The contract describes method names, parameter lists and return types, while each class is responsible for writing the algorithms. This allows us to design higher-level parts of a program even before we know which particular classes will perform the required tasks.

In Java, an interface is introduced using `interface`, while an implementing class uses `implements`. Ordinary interface methods without bodies are public, so implementations must provide public methods as well. An interface cannot be instantiated and has no constructors, but it can be used as a type, which becomes particularly useful when we delegate work. In Java it may also contain constants, but these are `public static final` values, not per-instance fields.

:::lang java
```java
class Document {
    private final String title;
    public Document(String title) { this.title = title; }
    public String getTitle() { return title; }
}

interface Printable { void printDocument(Document document); }
interface Scannable { Document scanDocument(String sourceTitle); }

class DeskPrinter implements Printable {
    @Override
    public void printDocument(Document document) {
        System.out.println("Printing: " + document.getTitle());
    }
}

class MultifunctionDevice implements Printable, Scannable {
    @Override
    public void printDocument(Document document) {
        System.out.println("Printing: " + document.getTitle());
    }
    @Override
    public Document scanDocument(String sourceTitle) {
        return new Document(sourceTitle);
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Document {
    public string Title { get; }
    public Document(string title) { this.Title = title; }
}
interface IPrintable { void PrintDocument(Document document); }
interface IScannable { Document ScanDocument(string sourceTitle); }
class DeskPrinter : IPrintable {
    public void PrintDocument(Document document) {
        Console.WriteLine("Printing: " + document.Title);
    }
}
class MultifunctionDevice : IPrintable, IScannable {
    public void PrintDocument(Document document) {
        Console.WriteLine("Printing: " + document.Title);
    }
    public Document ScanDocument(string sourceTitle) {
        return new Document(sourceTitle);
    }
}
```
:::end

:::lang python
```python
from abc import ABC, abstractmethod
class Document:
    def __init__(self, title): self.title = title
class Printable(ABC):
    @abstractmethod
    def print_document(self, document): pass
class Scannable(ABC):
    @abstractmethod
    def scan_document(self, source_title): pass
class DeskPrinter(Printable):
    def print_document(self, document):
        print("Printing:", document.title)
class MultifunctionDevice(Printable, Scannable):
    def print_document(self, document):
        print("Printing:", document.title)
    def scan_document(self, source_title):
        return Document(source_title)
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>
class Document {
    std::string title;
public:
    explicit Document(std::string title) : title(title) {}
    std::string getTitle() const { return title; }
};
struct Printable {
    virtual ~Printable() = default;
    virtual void printDocument(const Document& document) = 0;
};
struct Scannable {
    virtual ~Scannable() = default;
    virtual Document scanDocument(const std::string& sourceTitle) = 0;
};
class DeskPrinter : public Printable {
public:
    void printDocument(const Document& document) override {
        std::cout << "Printing: " << document.getTitle() << '\n';
    }
};
class MultifunctionDevice : public Printable, public Scannable {
public:
    void printDocument(const Document& document) override {
        std::cout << "Printing: " << document.getTitle() << '\n';
    }
    Document scanDocument(const std::string& sourceTitle) override {
        return Document(sourceTitle);
    }
};
```
:::end

Here `Printable` prescribes one operation, while `Scannable` requires document scanning. `DeskPrinter` only prints, so it implements just one interface. `MultifunctionDevice` implements both, providing two independent capabilities. Neither interface stores common object state, nor does it prescribe a concrete printing or scanning algorithm. Those details are left to the classes.

![The Meaning of an Interface](content/chapters/12-interfeszek/media/main-office-en.svg){width=820}

## Interfaces as Types and Task Delegation {#delegation}

Just as a superclass reference can refer to an instance of a subclass, an interface-typed reference can refer to any instance whose class implements that interface. Through a `Printable` reference we can call only those operations declared by `Printable`, regardless of the actual printer class. Late binding selects the implementation according to the actual object at runtime.

This is especially valuable for **delegating tasks**. A higher-level workflow need only require objects capable of printing and scanning. Those objects can be supplied to its constructor, after which the workflow delegates the operations to them. It does not create its own printer and has no reason to know how a particular network or hardware device works. The same workflow can therefore operate with different implementations, including test doubles.

:::lang java
```java
class OfficeWorkflow {
    private final Printable printer;
    private final Scannable scanner;
    public OfficeWorkflow(Printable printer, Scannable scanner) {
        this.printer = printer;
        this.scanner = scanner;
    }
    public void copyDocument(String sourceTitle) {
        Document document = scanner.scanDocument(sourceTitle);
        printer.printDocument(document);
    }
}
// In a separate demo, reuse the previous Document and device definitions.
class Demo {
    public static void main(String[] args) {
        OfficeWorkflow workflow = new OfficeWorkflow(
            new DeskPrinter(), new MultifunctionDevice());
        workflow.copyDocument("Contract");
    }
}
```
:::end

:::lang csharp
```csharp
class OfficeWorkflow {
    private readonly IPrintable printer;
    private readonly IScannable scanner;
    public OfficeWorkflow(IPrintable printer, IScannable scanner) {
        this.printer = printer;
        this.scanner = scanner;
    }
    public void CopyDocument(string sourceTitle) {
        Document document = scanner.ScanDocument(sourceTitle);
        printer.PrintDocument(document);
    }
}
class Program {
    static void Main() {
        var workflow = new OfficeWorkflow(new DeskPrinter(), new MultifunctionDevice());
        workflow.CopyDocument("Contract");
    }
}
```
:::end

:::lang python
```python
class OfficeWorkflow:
    def __init__(self, printer: Printable, scanner: Scannable):
        self._printer = printer
        self._scanner = scanner
    def copy_document(self, source_title):
        document = self._scanner.scan_document(source_title)
        self._printer.print_document(document)
# Use the classes from the preceding example.
workflow = OfficeWorkflow(DeskPrinter(), MultifunctionDevice())
workflow.copy_document("Contract")
```
:::end

:::lang cpp
```cpp
class OfficeWorkflow {
    Printable& printer;
    Scannable& scanner;
public:
    OfficeWorkflow(Printable& printer, Scannable& scanner)
        : printer(printer), scanner(scanner) {}
    void copyDocument(const std::string& sourceTitle) {
        Document document = scanner.scanDocument(sourceTitle);
        printer.printDocument(document);
    }
};
int main() {
    DeskPrinter printer;
    MultifunctionDevice machine;
    OfficeWorkflow workflow(printer, machine);
    workflow.copyDocument("Contract");
}
```
:::end

The `OfficeWorkflow` constructor accepts two interface-typed parameters. Its `copyDocument()` method first requests a scan and then prints the resulting document, so the entire workflow can be controlled without depending on any particular device. Later we can replace the devices merely by passing different instances to the constructor. This is one of the major advantages of higher-level design: **the required operation is separated from its implementation**.

## Implementing Multiple Interfaces {#multiple-interfaces}

Java does not allow a class to extend multiple classes, so a class cannot have two different direct superclasses. It may, however, implement any number of interfaces. This is not the same as multiple class inheritance: rather than inheriting the state and implementations of several superclasses, we agree to satisfy several separate contracts. An instance of the resulting class is compatible with every interface it implements.

Interfaces can also be combined with class inheritance. For example, all office devices might share a serial number stored in a superclass, while printing and scanning capabilities are defined by separate interfaces. Extending a superclass and implementing multiple interfaces are therefore compatible design choices.

:::lang java
```java
abstract class OfficeDevice {
    protected final String serialNumber;
    protected OfficeDevice(String serialNumber) { this.serialNumber = serialNumber; }
}
class NetworkMachine extends OfficeDevice implements Printable, Scannable {
    public NetworkMachine(String serialNumber) { super(serialNumber); }
    @Override public void printDocument(Document document) {
        System.out.println(serialNumber + ": " + document.getTitle());
    }
    @Override public Document scanDocument(String sourceTitle) {
        return new Document(sourceTitle);
    }
}
```
:::end

:::lang csharp
```csharp
abstract class OfficeDevice {
    protected string SerialNumber { get; }
    protected OfficeDevice(string serialNumber) { this.SerialNumber = serialNumber; }
}
class NetworkMachine : OfficeDevice, IPrintable, IScannable {
    public NetworkMachine(string serialNumber) : base(serialNumber) { }
    public void PrintDocument(Document document) {
        Console.WriteLine(SerialNumber + ": " + document.Title);
    }
    public Document ScanDocument(string sourceTitle) {
        return new Document(sourceTitle);
    }
}
```
:::end

:::lang python
```python
class OfficeDevice(ABC):
    def __init__(self, serial_number): self.serial_number = serial_number
class NetworkMachine(OfficeDevice, Printable, Scannable):
    def print_document(self, document):
        print(self.serial_number, document.title)
    def scan_document(self, source_title):
        return Document(source_title)
```
:::end

:::lang cpp
```cpp
class OfficeDevice {
protected:
    std::string serialNumber;
public:
    explicit OfficeDevice(std::string serialNumber) : serialNumber(serialNumber) {}
    virtual ~OfficeDevice() = default;
};
class NetworkMachine : public OfficeDevice, public Printable, public Scannable {
public:
    explicit NetworkMachine(std::string serialNumber) : OfficeDevice(serialNumber) {}
    void printDocument(const Document& document) override {
        std::cout << serialNumber << ": " << document.getTitle() << '\n';
    }
    Document scanDocument(const std::string& sourceTitle) override {
        return Document(sourceTitle);
    }
};
```
:::end

![Implementing Multiple Interfaces](content/chapters/12-interfeszek/media/main-multiple-en.svg){width=820}

## Inheritance Between Interfaces {#interface-inheritance}

Interfaces themselves can extend other interfaces. For example, a color-printing interface may extend a basic printing interface and introduce an additional operation for selecting color mode. A class implementing the extended interface must also implement the operations inherited from the original interface. Java even allows an interface to extend several interfaces, so related capabilities can be combined when that is useful.

At the same time, we should not place every imaginable operation into one enormous interface. If a basic printer were required to fax and scan, it would have to implement operations it cannot meaningfully provide. Smaller, focused interfaces let each class promise only the capabilities that actually belong to its role.

:::lang java
```java
interface Printable { void printDocument(Document document); }
interface ColorPrintable extends Printable { void setColorMode(boolean enabled); }
// ColorPrintable inherits printDocument() as well.
class ColorPrinter implements ColorPrintable {
    private boolean colorMode;
    @Override public void setColorMode(boolean enabled) { colorMode = enabled; }
    @Override public void printDocument(Document document) {
        System.out.println(document.getTitle() + " color=" + colorMode);
    }
}
```
:::end

:::lang csharp
```csharp
interface IPrintable { void PrintDocument(Document document); }
interface IColorPrintable : IPrintable { void SetColorMode(bool enabled); }
class ColorPrinter : IColorPrintable {
    private bool colorMode;
    public void SetColorMode(bool enabled) { colorMode = enabled; }
    public void PrintDocument(Document document) {
        Console.WriteLine(document.Title + " color=" + colorMode);
    }
}
```
:::end

:::lang python
```python
class ColorPrintable(Printable, ABC):
    @abstractmethod
    def set_color_mode(self, enabled): pass
class ColorPrinter(ColorPrintable):
    def __init__(self): self.color_mode = False
    def set_color_mode(self, enabled): self.color_mode = enabled
    def print_document(self, document):
        print(document.title, self.color_mode)
```
:::end

:::lang cpp
```cpp
struct ColorPrintable : public Printable {
    virtual void setColorMode(bool enabled) = 0;
};
class ColorPrinter : public ColorPrintable {
    bool colorMode = false;
public:
    void setColorMode(bool enabled) override { colorMode = enabled; }
    void printDocument(const Document& document) override {
        std::cout << document.getTitle() << " color=" << colorMode << '\n';
    }
};
```
:::end

## Important Built-in Interfaces {#standard-interfaces}

### Comparable and Comparator {#comparing}

Java's standard library contains many interfaces on which ready-made algorithms depend. `Comparable<T>` lets a class define the **natural ordering** of its instances. Its `compareTo(T other)` method returns a negative value, zero or a positive value according to whether the current instance comes before, is equivalent to or comes after the argument. The results do not need to be exactly `-1`, `0` and `1`.

Sometimes the same objects must be ordered in different ways. For products, we might choose increasing price as the natural order, but on another screen we want alphabetical order by name. A `Comparator<T>` defines a separate comparison object with a `compare(T first, T second)` method. This provides alternative orderings without requiring any changes to the product class.

:::lang java
```java
import java.util.*;
class Product implements Comparable<Product> {
    private final String name;
    private final int price;
    public Product(String name, int price) { this.name=name; this.price=price; }
    public String getName() { return name; }
    public int getPrice() { return price; }
    @Override public int compareTo(Product other) {
        return Integer.compare(price, other.price);
    }
}
class ProductNameComparator implements Comparator<Product> {
    @Override public int compare(Product first, Product second) {
        return first.getName().compareTo(second.getName());
    }
}
class Demo {
    public static void main(String[] args) {
        ArrayList<Product> products = new ArrayList<>();
        products.add(new Product("Paper", 800));
        products.add(new Product("Ink", 2500));
        Collections.sort(products);                             // by price
        Collections.sort(products, new ProductNameComparator()); // by name
    }
}
```
:::end

:::lang csharp
```csharp
using System;
using System.Collections.Generic;
class Product : IComparable<Product> {
    public string Name { get; }
    public int Price { get; }
    public Product(string name, int price) { this.Name=name; this.Price=price; }
    public int CompareTo(Product other) {
        return Price.CompareTo(other.Price);
    }
}
class ProductNameComparator : IComparer<Product> {
    public int Compare(Product first, Product second) {
        return string.CompareOrdinal(first.Name, second.Name);
    }
}
class Program {
    static void Main() {
        var products = new List<Product> { new Product("Paper",800), new Product("Ink",2500) };
        products.Sort();                            // by price
        products.Sort(new ProductNameComparator()); // by name
    }
}
```
:::end

:::lang python
```python
class Product:
    def __init__(self, name, price):
        self.name, self.price = name, price
    def __lt__(self, other):
        return self.price < other.price
products = [Product("Paper", 800), Product("Ink", 2500)]
products.sort()                        # by price (__lt__)
products.sort(key=lambda item: item.name)  # by name
```
:::end

:::lang cpp
```cpp
#include <algorithm>
#include <string>
#include <vector>
class Product {
public:
    std::string name;
    int price;
    Product(std::string name, int price) : name(name), price(price) {}
    bool operator<(const Product& other) const { return price < other.price; }
};
int main() {
    std::vector<Product> products = {{"Paper",800},{"Ink",2500}};
    std::sort(products.begin(), products.end()); // by price
    std::sort(products.begin(), products.end(),
        [](const Product& first, const Product& second) { return first.name < second.name; });
}
```
:::end

### Iterable and Iterator {#iterators}

The `Iterable<T>` interface marks objects whose elements can be traversed one after another. Its `iterator()` method returns an `Iterator<T>`. The iterator's `hasNext()` method checks whether another element exists, while `next()` returns that element. Java's enhanced `for` loop uses these operations, so implementing `Iterable` makes our own containers work with the familiar loop syntax.

We do not necessarily need to develop a separate iterator algorithm. If a container internally uses an `ArrayList`, we can delegate traversal to that list's iterator. If we want to prevent external callers from removing elements through the iterator, we can return an iterator of an unmodifiable view. This protects the collection structure, but not necessarily the state of mutable objects stored in it.

:::lang java
```java
import java.util.*;
class Book { private final String title;
    Book(String title) { this.title = title; }
    String getTitle() { return title; }
}
class BookCollection implements Iterable<Book> {
    private final ArrayList<Book> books = new ArrayList<>();
    public void addBook(Book book) { if(book==null) throw new IllegalArgumentException(); books.add(book); }
    @Override public Iterator<Book> iterator() {
        return Collections.unmodifiableList(books).iterator();
    }
}
class Demo {
    public static void main(String[] args) {
        BookCollection catalog = new BookCollection();
        catalog.addBook(new Book("OOP"));
        for (Book book : catalog) System.out.println(book.getTitle());
    }
}
```
:::end

:::lang csharp
```csharp
using System;
using System.Collections;
using System.Collections.Generic;
class Book {
    public string Title { get; }
    public Book(string title) { Title = title; }
}
class BookCollection : IEnumerable<Book> {
    private readonly List<Book> books = new();
    public void AddBook(Book book) { if(book == null) throw new ArgumentNullException(); books.Add(book); }
    public IEnumerator<Book> GetEnumerator() { return books.GetEnumerator(); }
    IEnumerator IEnumerable.GetEnumerator() { return GetEnumerator(); }
}
class Program {
    static void Main() {
        var catalog = new BookCollection();
        catalog.AddBook(new Book("OOP"));
        foreach (var book in catalog) Console.WriteLine(book.Title);
    }
}
```
:::end

:::lang python
```python
class Book:
    def __init__(self, title): self.title = title
class BookCollection:
    def __init__(self): self._books = []
    def add_book(self, book):
        if book is None: raise ValueError("Missing book")
        self._books.append(book)
    def __iter__(self): return iter(tuple(self._books))
catalog = BookCollection()
catalog.add_book(Book("OOP"))
for book in catalog: print(book.title)
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>
#include <vector>
class Book {
public:
    std::string title;
    explicit Book(std::string title) : title(title) {}
};
class BookCollection {
    std::vector<Book> books;
public:
    void addBook(Book book) { books.push_back(book); }
    auto begin() const { return books.cbegin(); }
    auto end() const { return books.cend(); }
};
int main() {
    BookCollection catalog;
    catalog.addBook(Book("OOP"));
    for (const auto& book : catalog) std::cout << book.title << '\n';
}
```
:::end

### Collection, List and Other Interfaces {#collections}

`Collection<T>` extends `Iterable<T>` and specifies operations such as counting, adding and checking for elements. `List<T>` extends this contract further by adding indexed access and replacement. `ArrayList<T>` is not an interface; it is a concrete class implementing these interfaces. Accordingly, in `List<String> names = new ArrayList<>();`, the reference type is `List`, while the actual object type is `ArrayList`.

Another useful interface to recognize is `AutoCloseable`, which helps manage resources that must be closed after use. We will discuss the details when working with files. These library interfaces demonstrate that many different implementations can satisfy the same contract while the higher-level algorithms remain unchanged.

![Collection, List and Other Interfaces](content/chapters/12-interfeszek/media/main-collection-en.svg){width=820}

Modern Java interfaces can also declare certain methods with bodies. A `default` method provides common behavior and is particularly useful when an existing interface must be extended without forcing every implementing class to be rewritten. In this chapter, however, we primarily treat interfaces as **contracts for operations** and place the actual algorithms in the implementing classes.

## Exercises {#exercises}

:::exercise

### 1. Office Devices – Adding Interfaces to Existing Classes

Build a simple document-handling application. Define printing and scanning as separate capabilities. The devices do not share a common superclass; interfaces are added alongside the existing classes.

![Office devices – UML](content/chapters/12-interfeszek/media/task-office-en.svg){width=720}

**Interfaces**

- `Printable`: declares `printDocument(document : Document) : void`. The implementing class decides how printing is performed.
- `Scannable`: declares `scanDocument(title : String) : Document`, which must return a new document instance.

**Document class**

- `title : String`: private field; cannot be modified from outside the class.
- `Document(title : String)`: public constructor. Rejects `null`, empty, or whitespace-only titles with `IllegalArgumentException`.
- `getTitle() : String`: public getter; no setter is provided.

**SimplePrinter class – implements Printable**

- `completedJobs : int`: private counter, initially `0`.
- `SimplePrinter()`: public parameterless constructor; initializes the counter.
- `printDocument(document : Document) : void`: rejects `null`, displays the document title, then increments the counter by one.
- `getCompletedJobs() : int`: public read-only getter.

**MultifunctionDevice class – implements Printable, Scannable**

- `completedJobs : int`: private counter, initially `0`.
- `MultifunctionDevice()`: public parameterless constructor.
- `printDocument(document : Document) : void`: validates the parameter, displays the title and increments the counter, just like `SimplePrinter`.
- `scanDocument(title : String) : Document`: creates and returns a new `Document` with that title; scanning does not increment the printing counter.
- `getCompletedJobs() : int`: public getter; there is no setter.

**CopyService class**

- `printer : Printable` and `scanner : Scannable`: private fields whose types are interfaces, not concrete device classes.
- `CopyService(printer : Printable, scanner : Scannable)`: public constructor; neither reference may be `null`.
- `copy(title : String) : void`: requests a document from the scanner and passes the returned instance to the printer.

**Main program**

Create one `SimplePrinter` and one `MultifunctionDevice`. Create two `CopyService` instances, one printing through each device. Perform copying operations with both services and verify the counters.

:::endexercise

:::exercise

### 2. Library – Independent Capabilities

Extend the earlier `Book` and `Library` classes. Separate identification and borrowing into two interfaces, while keeping control of the collection inside the container class.

![Library – UML](content/chapters/12-interfeszek/media/task-books-en.svg){width=720}

**Interfaces**

- `Identifiable`: `getIdentifier() : String` returns the unique identifier.
- `Loanable`: `borrowBook() : void` and `returnBook() : void` describe borrowing and returning.

**Book class – implements Identifiable, Loanable**

- `isbn : String`: private identifier, externally read-only after construction.
- `title : String`: private book title, externally read-only.
- `borrowed : boolean`: private status flag indicating whether the book is currently borrowed.
- `Book(isbn : String, title : String)`: both strings must have at least one non-whitespace character. The initial borrowed status is `false`.
- `getIdentifier() : String`: returns the ISBN.
- `getTitle() : String`: returns the title.
- `isBorrowed() : boolean`: returns the borrowed status. None of these getters has a setter.
- `borrowBook() : void`: sets `borrowed` to `true` if available; otherwise throws `IllegalStateException`.
- `returnBook() : void`: sets `borrowed` to `false` if currently borrowed; otherwise throws `IllegalStateException`.

**Library container class**

- `books : ArrayList<Book>`: private list; its reference must not be exposed.
- `Library()`: creates an empty list.
- `addBook(book : Book) : void`: rejects `null` and books with an ISBN already present, throwing `IllegalArgumentException`.
- `findBook(isbn : String) : Book`: searches by ISBN, returning `null` when no match exists.
- `getAvailableBooks() : ArrayList<Book>`: returns a new list containing the books that are not borrowed; never returns the internal list itself.

**Main program**

Add at least five books, borrow two, and display the titles still available. Test duplicate ISBN values and an attempt to borrow the same book twice.

:::endexercise

:::exercise

### 3. Vehicle Rental – Interface and Abstract Superclass

Create a vehicle-rental system. An interface specifies rental-fee calculation, while an abstract class manages common vehicle data. Two concrete subclasses calculate the fee differently.

![Vehicle rental – UML](content/chapters/12-interfeszek/media/task-vehicles-en.svg){width=760}

**Rentable interface**

- `calculateRentalFee(days : int) : int`: public method returning the total rental fee; the number of days must be positive.

**Abstract Vehicle class – implements Rentable**

- `registration : String`: private registration number, externally read-only.
- `kilometers : int`: private mileage, not directly modifiable from outside.
- `Vehicle(registration : String, kilometers : int)`: rejects blank registration numbers and negative mileage.
- `getRegistration() : String` and `getKilometers() : int`: public getters without setters.
- `drive(distance : int) : void`: adds a positive distance to the mileage; invalid input causes an exception.
- `calculateRentalFee(days : int) : int`: **public abstract method**. Its implementation is deliberately left to concrete subclasses.

**Car class – extends Vehicle**

- `Car(registration : String, kilometers : int)`: calls the superclass constructor.
- `calculateRentalFee(days : int) : int`: **implements the inherited abstract method**. The base charge is `9000 × days`; for seven or more days, apply a `10%` discount using integer arithmetic. Days must be positive.

**DeliveryVan class – extends Vehicle**

- `cargoCapacity : int`: private loading capacity in kilograms; must be positive.
- `DeliveryVan(registration : String, kilometers : int, cargoCapacity : int)`: forwards inherited data to the superclass and validates capacity.
- `getCargoCapacity() : int`: public getter without a setter.
- `calculateRentalFee(days : int) : int`: **implements the same abstract method using a different algorithm**. The charge is `14000 × days + 6000`, where `6000` is a one-time preparation fee.

**RentalOffice container class**

- `vehicles : ArrayList<Vehicle>`: private list holding both concrete vehicle types.
- `RentalOffice()`: creates the empty list.
- `addVehicle(vehicle : Vehicle) : void`: rejects `null` and registration numbers already present in the list.
- `calculateTotalFee(days : int) : int`: calls `calculateRentalFee()` for each vehicle and returns the sum.

**Main program**

Add at least two cars and two delivery vans. Calculate seven-day rental prices and check that the same interface method uses different formulas in the concrete subclasses.

:::endexercise

:::exercise

### 4. Payment System – Abstract Implementation and Optional Capability

Build a payment system where an interface specifies payment, an abstract superclass manages balances, and two subclasses perform payment differently. Only card payments offer refunds.

![Payment system – UML](content/chapters/12-interfeszek/media/task-banking-en.svg){width=760}

**Interfaces**

- `Payable`: `pay(amount : int) : boolean` reports whether the payment succeeded.
- `Refundable`: `refund(amount : int) : boolean` reports whether a refund succeeded.

**Abstract PaymentMethod class – implements Payable**

- `balance : int`: private balance, in whole currency units; not directly mutable from outside.
- `PaymentMethod(balance : int)`: rejects negative starting balances.
- `getBalance() : int`: public getter without a setter.
- `withdraw(amount : int) : boolean`: **protected concrete method**. Requires a positive amount. Deducts it and returns `true` if funds suffice; otherwise leaves the balance unchanged and returns `false`.
- `deposit(amount : int) : void`: **protected concrete method** adding a positive amount; rejects invalid values.
- `pay(amount : int) : boolean`: **public abstract method**, implemented differently in the two subclasses.

**BankTransfer class – extends PaymentMethod**

- `BankTransfer(balance : int)`: forwards the initial balance to the superclass.
- `pay(amount : int) : boolean`: attempts to deduct the positive payment amount plus a one-time `500` transfer fee. Returns `true` on success, `false` if funds are insufficient, and throws on invalid amounts.

**CardPayment class – extends PaymentMethod, implements Refundable**

- `lastPaidAmount : int`: private field, initially `0`, storing the latest successful payment not yet refunded.
- `CardPayment(balance : int)`: calls the superclass constructor and initializes the field.
- `pay(amount : int) : boolean`: charges without a fee. Updates `lastPaidAmount` on success, but leaves it unchanged on failure.
- `refund(amount : int) : boolean`: succeeds only for a positive amount equal to the stored, not-yet-refunded payment. Calls `deposit()` and resets the stored amount to `0`; returns `false` otherwise.

**CheckoutService class**

- `CheckoutService()`: public parameterless constructor.
- `checkout(method : Payable, amount : int) : boolean`: calls `pay()` through the interface reference; rejects `null`.

**Main program**

Pay through both types using the same `CheckoutService`. Check the difference in fees, insufficient funds and a successful card refund.

:::endexercise

:::exercise

### 5. Orders – Standard Interfaces and Container Class

Create a register of orders. Use `Comparable` for natural order, `Comparator` for an alternative order and `Iterable` to make the container traversable.

![Orders – UML](content/chapters/12-interfeszek/media/task-orders-en.svg){width=760}

**Order class – implements Comparable<Order>**

- `id : int`: private positive identifier.
- `amount : int`: private nonnegative amount.
- `Order(id : int, amount : int)`: public constructor validating both values and throwing `IllegalArgumentException` on invalid input.
- `getId() : int` and `getAmount() : int`: public getters; no setters.
- `compareTo(other : Order) : int`: compares amounts in ascending order and uses IDs to break ties. Rejects `null`; the result must be negative, zero, or positive as appropriate.

**OrderIdComparator class – implements Comparator<Order>**

- `OrderIdComparator()`: public parameterless constructor.
- `compare(first : Order, second : Order) : int`: compares IDs only, in ascending order; rejects `null` arguments.

**OrderRegister container class – implements Iterable<Order>**

- `orders : ArrayList<Order>`: private list; no getter returns the internal list directly.
- `OrderRegister()`: initializes an empty list.
- `addOrder(order : Order) : void`: rejects `null` and duplicate IDs, throwing `IllegalArgumentException`.
- `iterator() : Iterator<Order>`: traverses entries in insertion order and does not permit deleting entries through `remove()`.
- `getOrderedByAmount() : ArrayList<Order>`: returns a new list in natural order.
- `getOrderedById() : ArrayList<Order>`: returns a new list sorted using `OrderIdComparator`. Neither sorting method changes the internal insertion order.

**Main program**

Add at least five orders, including equal amounts. Display both sorts and use `for-each` to traverse the original container. Verify that the stored order is unchanged.

:::endexercise
