# Interfészek

A programjainkban gyakran előfordul, hogy különböző osztályok példányain ugyanazt a műveletet szeretnénk elvégezni. Egy nyomtatási feladatot például kiadhatunk egyszerű asztali nyomtatónak vagy multifunkciós eszköznek, és a feladatot kiosztó programrésznek nem kell ismernie ezek belső működését. Elegendő tudnia, hogy a kapott eszköz képes egy dokumentum kinyomtatására. Ha később új nyomtató kerül a rendszerbe, azt is használni szeretnénk anélkül, hogy a teljes algoritmust módosítanunk kellene.

Az öröklődés és az absztrakt osztályok megismerése után erre már tudnánk egy közös ősosztályt készíteni, azonban ezzel indokolatlan kapcsolatot hoznánk létre az eszközök között. Ráadásul egy osztálynak Java-ban legfeljebb egy közvetlen ősosztálya lehet. Sok esetben nem az a fontos, hogy két objektum **milyen osztályból származik**, hanem az, hogy **milyen műveletek elvégzésére képes**. Erre a problémára adnak megoldást az interfészek.

## Az interfészek fogalma {#interface-concept}

Az **interfész** nem osztály, hanem olyan szerződés, amely meghatározza, hogy az azt megvalósító osztálynak milyen műveleteket kell biztosítania. A szerződésben a metódusok nevét, paramétereit és visszatérési típusát írjuk elő, magukat az algoritmusokat az egyes osztályok készítik el. Így az interfész segítségével már akkor is meg tudjuk tervezni a program magasabb szintű részeit, amikor még nem tudjuk, milyen konkrét osztályok fogják elvégezni a feladatokat.

Java-ban az interfészt az `interface` kulcsszóval vezetjük be, az osztály pedig az `implements` kulcsszóval jelzi, hogy vállalja a benne meghatározott műveletek megvalósítását. A hagyományos, törzs nélküli interfészmetódusok `public` láthatóságúak, ezért az implementáló osztályban is publikus metódusként kell őket megírnunk. Az interfész önmagában nem példányosítható és nincs konstruktora; ugyanakkor típusként használható, amit hamarosan ki is használunk. Java-ban az interfész konstansokat is tartalmazhat, ezek azonban nem az egyes példányokhoz tartozó mezők, hanem `public static final` osztályszintű értékek.

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

A példában a `Printable` egyetlen műveletet ír elő, míg a `Scannable` a dokumentum beolvasását követeli meg. A `DeskPrinter` csak nyomtatni képes, ezért egyetlen interfészt implementál. A `MultifunctionDevice` ezzel szemben mindkettőt, így ugyanaz az osztály két, egymástól független képességet biztosít. A két interfészben nincs közös állapot, és nem adtuk meg, hogyan kell a nyomtatást vagy a szkennelést elvégezni; ezekről az egyes osztályok döntenek.

![Az interfészek fogalma](content/chapters/12-interfeszek/media/main-office-hu.svg){width=820}

## Interfész mint típus és feladatdelegálás {#delegation}

Ahogyan egy ősosztály típusú referencia hivatkozhat a leszármazott osztály példányára, úgy az interfész típusú referencia is hivatkozhat bármely olyan példányra, amely megvalósítja azt. A `Printable` típusú referencián keresztül azonban csak az interfészben előírt műveleteket érhetjük el, függetlenül attól, hogy valójában melyik nyomtató példányát kaptuk. A megfelelő metódust a késői kötés szabályai szerint a futtatókörnyezet választja ki.

Ennek különösen nagy jelentősége van a **feladatdelegálásnál**. Egy magas szintű programrésznek elég azt előírnunk, hogy nyomtatásra és szkennelésre alkalmas eszközökre van szüksége. Ezeket az eszközöket a konstruktorban megkapja, majd a műveleteket rájuk bízza. A programrész nem hoz létre saját nyomtatót, és nem kell tudnia, milyen hálózati vagy hardveres megoldással készül el a dokumentum. Így ugyanaz a folyamat különféle eszközökkel, akár tesztelésre készített helyettesítő osztályokkal is működik.

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

Az `OfficeWorkflow` konstruktorának két paramétere interfész típusú. A `copyDocument()` először a szkennelési, majd a nyomtatási műveletet hívja meg, tehát az egész folyamatot képes vezérelni anélkül, hogy egyetlen konkrét eszközhöz kötődne. Később az egész rendszert új eszközökre állíthatjuk át csupán azzal, hogy más példányokat adunk át a konstruktorának. Ez a magas szintű tervezés egyik fontos előnye: **a műveletek elvégzésének követelményét elválasztjuk azok megvalósításától**.

## Többszörös interfész-implementáció {#multiple-interfaces}

Java-ban az osztályok között nincs többszörös öröklődés, tehát egy osztály nem származhat egyszerre két különböző ősosztályból. Ezzel szemben tetszőleges számú interfészt implementálhat. Ez nem ugyanaz, mint a többszörös osztályöröklődés, hiszen nem több ősosztály állapotát és megvalósított metódusait örököljük, hanem több különböző szerződés teljesítését vállaljuk. Az így létrehozott példány mindegyik megvalósított interfész típusával kompatibilis lesz.

Az interfészeket osztályok mellett is használhatjuk. Egy nyilvántartási feladatban például minden eszköznek lehet közös gyártási azonosítója, melyet egy ősosztályban tárolunk, miközben a nyomtatási és szkennelési képességét külön interfészek írják elő. Az ősosztályból való öröklődés és az interfészek megvalósítása tehát nem zárja ki egymást.

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

![Többszörös interfész-implementáció](content/chapters/12-interfeszek/media/main-multiple-hu.svg){width=820}

## Interfészek közötti öröklődés {#interface-inheritance}

Nemcsak osztályok, hanem interfészek között is létrehozhatunk öröklődési kapcsolatot. Egy színes nyomtatást támogató interfész például kiterjesztheti az alapvető nyomtatási interfészt egy további metódussal, amellyel a színes üzemmódot állítjuk. Az így létrehozott interfészt implementáló osztálynak az alapinterfész metódusát is biztosítania kell. Egy interfész ráadásul több másik interfészből is származhat, így az egymáshoz kapcsolódó képességeket szükség esetén összevonhatjuk.

Ugyanakkor nem célszerű minden elképzelhető műveletet egyetlen hatalmas interfészbe írni. Ha egy egyszerű nyomtatót arra köteleznénk, hogy faxoljon és szkenneljen is, akkor olyan metódusokat kellene megvalósítania, amelyekhez nincs megfelelő működése. Az interfészek szétválasztásával elérhetjük, hogy minden osztálynak csak azokat a műveleteket kelljen biztosítania, amelyek valóban hozzátartoznak a feladatához.

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

## Fontos beépített interfészek {#standard-interfaces}

### Comparable és Comparator {#comparing}

A Java osztálykönyvtárában számos olyan interfészt találunk, amelyekre a kész algoritmusok épülnek. A `Comparable<T>` segítségével megadhatjuk egy osztály példányainak **természetes sorrendjét**. Ehhez a `compareTo(T other)` metódust kell megvalósítanunk, amely negatív értékkel, nullával vagy pozitív értékkel tér vissza attól függően, hogy az aktuális példány kisebb, egyenértékű vagy nagyobb a paraméterként kapott példánynál. Nem követelmény, hogy az eredmény pontosan `-1`, `0` vagy `1` legyen.

Előfordulhat azonban, hogy ugyanazokat az objektumokat többféle szempont szerint szeretnénk rendezni. Egy terméklista esetén például természetes sorrendnek választhatjuk az ár szerinti növekedést, de néha a termékek neve alapján szeretnénk rendezni. A `Comparator<T>` egy külön összehasonlító objektumot ír le, amelynek `compare(T first, T second)` metódusa dönti el a sorrendet. Ezzel nem kell a termék osztályát módosítanunk, mégis tetszőleges más rendezést alkalmazhatunk.

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

### Iterable és Iterator {#iterators}

Az `Iterable<T>` interfész olyan objektumokat jelöl, amelyek elemein egymás után végig tudunk haladni. A hozzá tartozó `iterator()` metódus egy `Iterator<T>` típusú példányt ad vissza. Az iterátor `hasNext()` metódusával ellenőrizzük, hogy van-e még elem, míg a `next()` metódussal kérjük le a következőt. A Java `for-each` ciklusa ezeket a műveleteket használja, ezért saját konténerosztályainkat is bejárhatóvá tehetjük az interfész megvalósításával.

Nem feltétlenül kell saját iterátoralgoritmust írnunk. Ha a konténerosztály belül egy `ArrayList` példányt használ, annak iterátorát is visszaadhatjuk. Amennyiben nem szeretnénk, hogy a külső program az iterátoron keresztül elemeket töröljön, biztosíthatunk módosítást tiltó nézetet. Fontos azonban, hogy ez a lista szerkezetét védi, nem feltétlenül a benne tárolt módosítható objektumok állapotát.

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

### Collection, List és más interfészek {#collections}

Az `Iterable<T>` interfészt a `Collection<T>` bővíti, amely többek között az elemek számának lekérdezését, hozzáadását és keresését írja elő. A `List<T>` erre épülve index alapján történő hozzáférést és elemcserét is biztosít. Az `ArrayList<T>` már nem interfész, hanem egy konkrét osztály, amely ezeket az előírásokat valósítja meg. Ezért a `List<String> names = new ArrayList<>();` deklarációban a referencia típusa `List`, míg a példány tényleges típusa `ArrayList`.

Érdemes még megismernünk az `AutoCloseable` interfész nevét is, amely a használat után lezárandó erőforrások kezelését segíti. Ennek részleteivel a fájlkezelésnél fogunk foglalkozni. A beépített interfészek példái jól mutatják, hogy ugyanarra az interfészre sokféle megvalósítás készülhet, miközben a fölöttük működő algoritmusok változatlanok maradnak.

![Collection, List és más interfészek](content/chapters/12-interfeszek/media/main-collection-hu.svg){width=820}

A modern Java-ban az interfészek már nem kizárólag törzs nélküli metódusokat tartalmazhatnak. A `default` metódus lehetőséget biztosít arra, hogy egy interfész közös, alapértelmezett működést is adjon. Ez különösen hasznos lehet akkor, ha egy korábban megírt interfészt új művelettel szeretnénk kiegészíteni anélkül, hogy minden implementáló osztályt át kellene dolgoznunk. A mostani tananyagban azonban az interfészekre elsősorban **műveleti szerződésként** tekintünk, és a metódusok tényleges algoritmusát az implementáló osztályokban írjuk meg.

## Feladatok {#exercises}

:::exercise

### 1. Irodai eszközök – interfész hozzáadása meglévő osztályokhoz

Készítsen egyszerű dokumentumkezelő alkalmazást, amelyben a nyomtatási és szkennelési képességet két külön interfész írja le! Az eszközök nem közös ősosztályból származnak: az interfészeket a meglévő osztályok mellé vezetjük be.

![Irodai eszközök – UML](content/chapters/12-interfeszek/media/task-office-hu.svg){width=720}

**Interfészek**

- `Printable`: deklarálja a publikus `printDocument(document : Document) : void` metódust. A paraméter a nyomtatandó dokumentum, a működést az implementáló osztály adja meg.
- `Scannable`: deklarálja a publikus `scanDocument(title : String) : Document` metódust, amelynek egy új dokumentumpéldánnyal kell visszatérnie.

**Document osztály**

- `title : String`: privát mező, a dokumentum címe. Kívülről nem módosítható.
- `Document(title : String)`: publikus konstruktor. A kapott cím nem lehet `null`, üres vagy csak szóközökből álló szöveg; hibás bemenetnél `IllegalArgumentException` kivételt dob.
- `getTitle() : String`: publikus getter, amely visszaadja a címet. Setter nem készül.

**SimplePrinter osztály – implements Printable**

- `completedJobs : int`: privát mező, kezdetben `0`.
- `SimplePrinter()`: publikus, paraméter nélküli konstruktor, amely inicializálja a számlálót.
- `printDocument(document : Document) : void`: elutasítja a `null` paramétert, megjeleníti a dokumentum címét, majd eggyel növeli a számlálót.
- `getCompletedJobs() : int`: publikus getter; setter nincs.

**MultifunctionDevice osztály – implements Printable, Scannable**

- `completedJobs : int`: privát mező, kezdetben `0`.
- `MultifunctionDevice()`: publikus, paraméter nélküli konstruktor.
- `printDocument(document : Document) : void`: ugyanúgy ellenőrzi a paramétert és növeli a számlálót, mint az egyszerű nyomtató.
- `scanDocument(title : String) : Document`: új `Document` példányt hoz létre a megadott címmel, és azt visszaadja. A szkennelés nem változtatja meg a nyomtatások számát.
- `getCompletedJobs() : int`: a nyomtatások számát visszaadó, publikus getter.

**CopyService osztály**

- `printer : Printable` és `scanner : Scannable`: privát mezők. Nem konkrét eszköztípusokat tárolnak.
- `CopyService(printer : Printable, scanner : Scannable)`: publikus konstruktor. Egyik referencia sem lehet `null`; ellenkező esetben kivételt dob.
- `copy(title : String) : void`: meghívja a szkenner `scanDocument()` metódusát, majd az elkészült dokumentumot átadja a nyomtató `printDocument()` metódusának.

**Főprogram**

Hozzon létre egy `SimplePrinter` és egy `MultifunctionDevice` példányt! Készítsen két `CopyService` példányt úgy, hogy az egyik az egyszerű nyomtatót, a másik a multifunkciós eszközt használja nyomtatásra. Mindkét szolgáltatással végezzen másolást, majd ellenőrizze a két számláló értékét!

:::endexercise

:::exercise

### 2. Könyvtár – több független képesség

Fejlessze tovább a korábbi `Book` és `Library` osztályokat! A könyv azonosíthatóságát és kölcsönözhetőségét külön interfészek határozzák meg, a konténerosztály pedig továbbra is kizárólag ellenőrzött műveleteken keresztül enged hozzáférést a gyűjteményhez.

![Könyvtár – UML](content/chapters/12-interfeszek/media/task-books-hu.svg){width=720}

**Interfészek**

- `Identifiable`: `getIdentifier() : String` – az objektum egyedi azonosítóját lekérdező metódus.
- `Loanable`: `borrowBook() : void` és `returnBook() : void` – a kölcsönzés és visszavétel műveletei.

**Book osztály – implements Identifiable, Loanable**

- `isbn : String`: privát, a példány létrehozása után kívülről nem módosítható azonosító.
- `title : String`: privát, kívülről nem módosítható könyvcím.
- `borrowed : boolean`: privát állapotjelző; `true`, ha a könyv ki van kölcsönözve.
- `Book(isbn : String, title : String)`: mindkét szövegnek tartalmaznia kell legalább egy nem szóköz karaktert. A kezdeti kölcsönzési állapot `false`.
- `getIdentifier() : String`: visszaadja az ISBN-t.
- `getTitle() : String`: visszaadja a címet.
- `isBorrowed() : boolean`: visszaadja az aktuális kölcsönzési állapotot. A három getterhez setter nem készül.
- `borrowBook() : void`: ha a könyv már kölcsön van, `IllegalStateException` kivételt dob; egyébként igazra állítja a `borrowed` mezőt.
- `returnBook() : void`: ha a könyv nincs kölcsön, `IllegalStateException` kivételt dob; egyébként hamisra állítja a mezőt.

**Library konténerosztály**

- `books : ArrayList<Book>`: privát lista, amelynek referenciáját nem adjuk vissza a külvilágnak.
- `Library()`: üres listát hoz létre.
- `addBook(book : Book) : void`: elutasítja a `null` értéket és az olyan könyvet, amelynek ISBN-je már szerepel a listában. Hibánál `IllegalArgumentException` kivételt dob.
- `findBook(isbn : String) : Book`: ISBN alapján megkeresi a könyvet, hiány esetén `null` értékkel tér vissza.
- `getAvailableBooks() : ArrayList<Book>`: új listába gyűjti a jelenleg nem kölcsönzött könyveket. Az eredeti belső listát nem adja vissza.

**Főprogram**

Vegyen fel legalább öt könyvet, majd kettőt kölcsönözzön ki! Jelenítse meg a kölcsönözhető könyvek címeit, és ellenőrizze, hogy az azonos ISBN, valamint a már kikölcsönzött könyv ismételt kölcsönzése nem megengedett.

:::endexercise

:::exercise

### 3. Járműkölcsönző – interfész és absztrakt ősosztály

Készítsen egyszerű járműkölcsönzőt! Az interfész csak a bérleti díj kiszámítását írja elő. A járművek közös adatait és a futásteljesítmény kezelését egy absztrakt ősosztályba helyezzük, a díjszámítást viszont két különböző módon valósítjuk meg a leszármazottakban.

![Járműkölcsönző – UML](content/chapters/12-interfeszek/media/task-vehicles-hu.svg){width=760}

**Rentable interfész**

- `calculateRentalFee(days : int) : int`: publikus metódus; a teljes bérleti díjjal tér vissza. A napok száma csak pozitív lehet.

**Vehicle absztrakt osztály – implements Rentable**

- `registration : String`: privát rendszám; kívülről nem módosítható.
- `kilometers : int`: privát kilométeróra-állás; kívülről közvetlenül nem módosítható.
- `Vehicle(registration : String, kilometers : int)`: a rendszám nem lehet üres vagy csak szóköz, a kilométeróra-állás nem lehet negatív.
- `getRegistration() : String` és `getKilometers() : int`: publikus getterek, setter nélkül.
- `drive(distance : int) : void`: pozitív távolságot fogad, és ennyivel növeli a kilométeróra-állást; hibás értéknél kivételt dob.
- `calculateRentalFee(days : int) : int`: **publikus absztrakt metódus**. Az ősosztály nem készít hozzá algoritmust, megvalósítását a konkrét leszármazottaktól követeli meg.

**Car osztály – extends Vehicle**

- `Car(registration : String, kilometers : int)`: meghívja az ősosztály konstruktorát.
- `calculateRentalFee(days : int) : int`: **felülírja az absztrakt metódust**. A díj `9000 × days` forint, de legalább hét nap esetén az eredményből `10%` kedvezményt ad. A napok száma csak pozitív lehet; egész számokkal számoljon.

**DeliveryVan osztály – extends Vehicle**

- `cargoCapacity : int`: privát teherbírás, kilogrammban; értéke pozitív.
- `DeliveryVan(registration : String, kilometers : int, cargoCapacity : int)`: az örökölt adatokat az ős konstruktorának adja át, majd ellenőrzi a teherbírást.
- `getCargoCapacity() : int`: publikus, csak olvasható getter.
- `calculateRentalFee(days : int) : int`: **felülírja ugyanazt az absztrakt metódust, de más algoritmussal**. A díj `14000 × days + 6000` forint; a `6000` forintos előkészítési díjat bérlésenként egyszer számítja fel.

**RentalOffice konténerosztály**

- `vehicles : ArrayList<Vehicle>`: privát lista, amely különböző járművek példányait is tárolhatja.
- `RentalOffice()`: üres listát készít.
- `addVehicle(vehicle : Vehicle) : void`: elutasítja a `null` példányt, továbbá a már nyilvántartott rendszámot.
- `calculateTotalFee(days : int) : int`: minden tárolt jármű `calculateRentalFee()` metódusát meghívja a megadott napokra, és visszaadja a díjak összegét.

**Főprogram**

Készítsen legalább két autót és két teherautót, majd adja őket a konténerhez! Számítsa ki a hét napra eső díjakat. Ellenőrizze, hogy ugyanaz az interfészben előírt művelet a két konkrét osztályban eltérő számítást végez!

:::endexercise

:::exercise

### 4. Fizetési rendszer – absztrakt megvalósítás és külön képesség

Készítsen olyan pénzügyi rendszert, amelyben a fizetési műveletet egy interfész írja elő, az egyenleg kezelését pedig absztrakt ősosztály biztosítja. A banki átutalás és a kártyás fizetés eltérően valósítja meg a fizetést, miközben a visszatérítés csak a kártyás fizetés képessége lesz.

![Fizetési rendszer – UML](content/chapters/12-interfeszek/media/task-banking-hu.svg){width=760}

**Interfészek**

- `Payable`: `pay(amount : int) : boolean` – a fizetés sikerességét adja vissza.
- `Refundable`: `refund(amount : int) : boolean` – a visszatérítés sikerességét adja vissza.

**PaymentMethod absztrakt osztály – implements Payable**

- `balance : int`: privát egyenleg, egész forintban; kívülről közvetlenül nem módosítható.
- `PaymentMethod(balance : int)`: a kezdőegyenleg nem lehet negatív.
- `getBalance() : int`: publikus getter, setter nincs.
- `withdraw(amount : int) : boolean`: **protected konkrét metódus**. Csak pozitív összeget fogad. Ha van fedezet, levonja az összeget és `true` értékkel tér vissza; különben nem módosítja az egyenleget és `false` értékkel tér vissza.
- `deposit(amount : int) : void`: **protected konkrét metódus**, amely pozitív összeget ad az egyenleghez; hibás értéknél kivételt dob.
- `pay(amount : int) : boolean`: **publikus absztrakt metódus**, amelyet a két leszármazott eltérően valósít meg.

**BankTransfer osztály – extends PaymentMethod**

- `BankTransfer(balance : int)`: továbbadja a kezdőegyenleget az ős konstruktorának.
- `pay(amount : int) : boolean`: pozitív összeg esetén az átutalandó összegen felül egyszeri `500` forintos átutalási költséget is megpróbál levonni. Siker esetén `true`, fedezethiánynál `false` az eredmény; hibás összegnél kivételt dob.

**CardPayment osztály – extends PaymentMethod, implements Refundable**

- `lastPaidAmount : int`: privát mező, kezdeti értéke `0`. A még vissza nem térített utolsó sikeres fizetés összegét tárolja.
- `CardPayment(balance : int)`: meghívja az ős konstruktorát és nullázza a `lastPaidAmount` mezőt.
- `pay(amount : int) : boolean`: díj nélkül próbálja levonni az összeget; sikeres fizetésnél felülírja a `lastPaidAmount` értékét. Sikertelen fizetésnél a mező nem változik.
- `refund(amount : int) : boolean`: csak pozitív és a tárolt, még vissza nem térített összeggel pontosan megegyező visszatérítést enged. Siker esetén `deposit()` segítségével visszaírja az összeget, majd `0`-ra állítja a `lastPaidAmount` mezőt; egyébként `false` értékkel tér vissza.

**CheckoutService osztály**

- `CheckoutService()`: publikus, paraméter nélküli konstruktor.
- `checkout(method : Payable, amount : int) : boolean`: a kapott interfészreferencia `pay()` metódusát hívja meg. `null` referencia esetén kivételt dob.

**Főprogram**

Hozzon létre banki átutalást és kártyás fizetést megvalósító példányokat! Ugyanazzal a `CheckoutService`-szel fizessen mindkettővel, vizsgálja meg a különböző díjszámítást, a fedezethiányt és egy sikeres kártyás visszatérítést!

:::endexercise

:::exercise

### 5. Rendelések – beépített interfészek és konténerosztály

Készítsen rendelések kezelésére alkalmas osztályokat! A természetes rendezés szabályát a `Comparable`, az ettől eltérő sorrendet a `Comparator`, a gyűjtemény bejárhatóságát pedig az `Iterable` interfész segítségével biztosítsa.

![Rendelések – UML](content/chapters/12-interfeszek/media/task-orders-hu.svg){width=760}

**Order osztály – implements Comparable<Order>**

- `id : int`: privát azonosító, pozitív egész szám.
- `amount : int`: privát összeg forintban, nem lehet negatív.
- `Order(id : int, amount : int)`: publikus konstruktor, amely mindkét adatot ellenőrzi. Hibás értéknél `IllegalArgumentException` kivételt dob.
- `getId() : int` és `getAmount() : int`: publikus getterek; setter egyikhez sem készül.
- `compareTo(other : Order) : int`: növekvően hasonlítja össze az összegeket; azonos összeg esetén az azonosító dönt. `null` paraméter nem megengedett. Az eredmény negatív, nulla vagy pozitív előjelű legyen a megfelelő sorrend szerint.

**OrderIdComparator osztály – implements Comparator<Order>**

- `OrderIdComparator()`: publikus, paraméter nélküli konstruktor.
- `compare(first : Order, second : Order) : int`: kizárólag az azonosítók szerint hasonlít, növekvő sorrendben. `null` paraméter nem megengedett.

**OrderRegister konténerosztály – implements Iterable<Order>**

- `orders : ArrayList<Order>`: privát lista. A listához nem készül közvetlen hozzáférést biztosító getter.
- `OrderRegister()`: üres listát készít.
- `addOrder(order : Order) : void`: elutasítja a `null` értéket és a már szereplő azonosítót; hibánál `IllegalArgumentException` kivételt dob.
- `iterator() : Iterator<Order>`: a felvétel sorrendjében járja be az elemeket. Olyan iterátort ad vissza, amelynek `remove()` műveletével nem lehet módosítani a belső listát.
- `getOrderedByAmount() : ArrayList<Order>`: új listát ad vissza a természetes sorrend szerint rendezve.
- `getOrderedById() : ArrayList<Order>`: új listát ad vissza az `OrderIdComparator` szerinti sorrendben. Egyik rendezés sem változtathatja meg a belső lista sorrendjét.

**Főprogram**

Hozzon létre legalább öt rendelést, közöttük azonos összegűeket is. Rendezze őket mindkét szempont szerint, majd `for-each` ciklussal járja be a konténert! Ellenőrizze, hogy a belső felvételi sorrend megmaradt.

:::endexercise
