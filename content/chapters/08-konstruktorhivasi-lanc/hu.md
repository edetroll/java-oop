# Konstruktorhívási lánc

A konstruktorok megismerésekor láttuk, hogy egy osztályon belül több, eltérő paraméterlistájú konstruktort is készíthetünk. Az egyik konstruktor a `this(...)` hívással átadhatja a példány inicializálását egy másik konstruktornak, így nem kell ugyanazokat az ellenőrzéseket és értékadásokat több helyen megírnunk. Az öröklődés azonban új helyzetet teremt: amikor egy leszármazott osztályból hozunk létre példányt, az objektum nemcsak a saját mezőit, hanem az ősosztályokhoz tartozó adatokat is tartalmazza. Ezért gondoskodnunk kell arról, hogy az örökölt állapot is megfelelően inicializálódjon.

A példányosítás során tehát nem feltétlenül egyetlen konstruktor fut le. Az egyes konstruktorok egymást hívva **konstruktorhívási láncot** alkotnak, amelynek végrehajtása az ősosztályoktól a leszármazottak felé halad. A lánc kialakulását nem a metódusoknál megismert késői kötés határozza meg: a meghívandó konstruktorokat a megadott paraméterek és az osztályok közötti öröklődési kapcsolat alapján választjuk ki.

## A konstruktorok végrehajtási sorrendje {#execution-order}

Tegyük fel, hogy egy `Person` osztályból származtatjuk a `Student` osztályt, ebből pedig egy `ScholarshipStudent` osztályt, amely az ösztöndíjas hallgatókat reprezentálja. Amikor ösztöndíjas hallgatót példányosítunk, először biztosítani kell a személyekre jellemző adatok kezdőállapotát, majd a hallgatóhoz tartozó mezőket, végül pedig az ösztöndíj összegét. Ezt a Java a konstruktorok egymás utáni meghívásával oldja meg, amit az alábbi, egyszerűsített példában kiírásokkal is szemléltetünk.

:::lang java
```java
class Person {
    public Person() {
        System.out.println("Person constructor");
    }
}

class Student extends Person {
    public Student() {
        System.out.println("Student constructor");
    }
}

class ScholarshipStudent extends Student {
    public ScholarshipStudent() {
        System.out.println("ScholarshipStudent constructor");
    }
}

class Main {
    public static void main(String[] args) {
        ScholarshipStudent student = new ScholarshipStudent();
    }
}
```
:::end

:::lang csharp
```csharp
using System;

class Person {
    public Person() {
        Console.WriteLine("Person constructor");
    }
}

class Student : Person {
    public Student() {
        Console.WriteLine("Student constructor");
    }
}

class ScholarshipStudent : Student {
    public ScholarshipStudent() {
        Console.WriteLine("ScholarshipStudent constructor");
    }
}

class Program {
    static void Main() {
        ScholarshipStudent student = new ScholarshipStudent();
    }
}
```
:::end

:::lang python
```python
class Person:
    def __init__(self):
        print("Person initializer")

class Student(Person):
    def __init__(self):
        super().__init__()
        print("Student initializer")

class ScholarshipStudent(Student):
    def __init__(self):
        super().__init__()
        print("ScholarshipStudent initializer")

student = ScholarshipStudent()
```
:::end

:::lang cpp
```cpp
#include <iostream>

class Person {
public:
    Person() {
        std::cout << "Person constructor\n";
    }
};

class Student : public Person {
public:
    Student() {
        std::cout << "Student constructor\n";
    }
};

class ScholarshipStudent : public Student {
public:
    ScholarshipStudent() {
        std::cout << "ScholarshipStudent constructor\n";
    }
};

int main() {
    ScholarshipStudent student;
}
```
:::end

A program a `Person`, `Student`, majd `ScholarshipStudent` konstruktorának üzenetét jeleníti meg, ebben a sorrendben. Java-ban a hierarchia tetején található `Object` konstruktora is része a láncnak, csak a példában nem ír ki semmit. Fontos megkülönböztetni a konstruktorok hívásának irányát és a konstruktorok törzsének végrehajtását: a legalsó osztály példányosítása indítja el a hívássorozatot, a konstruktorok törzsei viszont az ősosztálytól lefelé haladva hajtódnak végre.

![A Person, Student és ScholarshipStudent konstruktorainak végrehajtási sorrendje](content/chapters/08-konstruktorhivasi-lanc/media/chain-order-hu.svg){width=530}

## Az ősosztály konstruktorának meghívása {#super-constructor}

Az előző példában mindhárom osztálynak volt paraméter nélküli konstruktora. Java-ban, ha a leszármazott konstruktora nem ad meg más konstruktorhívást, a fordító a szokásos esetben automatikusan beilleszti a `super()` hívást. Ez az ősosztály paraméter nélküli konstruktorát kéri meghívni. Ha azonban az ősosztály csak paraméteres konstruktort tartalmaz, akkor a fordító nem tudja helyettünk kitalálni, milyen adatokkal kellene inicializálnia azt, ezért a program hibás lesz.

Ilyenkor a leszármazott konstruktorában a **`super(...)`** hívással választjuk ki az ősosztály megfelelő konstruktorát, és átadjuk neki a szükséges paramétereket. Az alábbi példában a `Person` osztály felel a név ellenőrzéséért és tárolásáért, a `Student` pedig csak a hallgatóazonosító kezelését végzi. Így a leszármazott osztályban nem ismételjük meg az ősosztály inicializálási logikáját, és az ősosztály privát mezőit sem kell közvetlenül elérnünk.

:::lang java
```java
class Person {
    private String name;

    public Person(String name) {
        if (name == null || name.isBlank())
            throw new IllegalArgumentException("Invalid name");
        this.name = name;
    }

    public String getName() { return name; }
}

class Student extends Person {
    private String studentId;

    public Student(String name, String studentId) {
        super(name);
        if (studentId == null || studentId.isBlank())
            throw new IllegalArgumentException("Invalid student ID");
        this.studentId = studentId;
    }

    public String getStudentId() { return studentId; }
}
```
:::end

:::lang csharp
```csharp
using System;

class Person {
    private string name;

    public Person(string name) {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Invalid name");
        this.name = name;
    }

    public string GetName() { return name; }
}

class Student : Person {
    private string studentId;

    public Student(string name, string studentId) : base(name) {
        if (string.IsNullOrWhiteSpace(studentId))
            throw new ArgumentException("Invalid student ID");
        this.studentId = studentId;
    }

    public string GetStudentId() { return studentId; }
}
```
:::end

:::lang python
```python
class Person:
    def __init__(self, name):
        if not name or not name.strip():
            raise ValueError("Invalid name")
        self._name = name

    def get_name(self):
        return self._name

class Student(Person):
    def __init__(self, name, student_id):
        super().__init__(name)
        if not student_id or not student_id.strip():
            raise ValueError("Invalid student ID")
        self._student_id = student_id

    def get_student_id(self):
        return self._student_id
```
:::end

:::lang cpp
```cpp
#include <stdexcept>
#include <string>

class Person {
    std::string name;
public:
    explicit Person(const std::string& name) : name(name) {
        if (name.empty())
            throw std::invalid_argument("Invalid name");
    }
    std::string getName() const { return name; }
};

class Student : public Person {
    std::string studentId;
public:
    Student(const std::string& name, const std::string& studentId)
        : Person(name), studentId(studentId) {
        if (studentId.empty())
            throw std::invalid_argument("Invalid student ID");
    }
    std::string getStudentId() const { return studentId; }
};
```
:::end

Az ősosztály konstruktorának paraméterezése a négy nyelven nem teljesen azonos. Java-ban a `super(name)` hívást a konstruktor elején helyezzük el; C#-ban a `: base(name)`, C++-ban pedig a konstruktor utáni inicializálólistában szereplő `: Person(name)` végzi el ezt a feladatot. Pythonban a `super().__init__(name)` meghívása nem történik meg automatikusan, ha a leszármazott saját `__init__()` metódust készít; ezért a szükséges inicializálásról nekünk kell gondoskodnunk. A nyelvek közötti eltéréseket a példák kódfülein lehet összehasonlítani.

## A this és super kapcsolata {#this-super}

Egy osztályhoz továbbra is készíthetünk több konstruktort. Ha egy rövidebb paraméterlistájú konstruktorban nem szeretnénk újra leírni az inicializálást, a `this(...)` hívással átadhatjuk azt az osztály egy másik konstruktorának. Ezután az átadott konstruktor gondoskodik az ősosztály megfelelő konstruktorának meghívásáról. Java-ban egy adott konstruktor a hagyományos szerkezetben vagy egy másik saját konstruktort hív meg a `this(...)` segítségével, vagy közvetlenül az ősosztály konstruktorát a `super(...)` hívással. Nem készíthetünk olyan körkörös konstruktorhívásokat, amelyek egymást végtelenül hívnák.

Az előző osztályokat egy ösztöndíjas hallgatóval egészítjük ki. A kétparaméteres `Student` konstruktor az ősosztályt inicializálja, az egyparaméteres változat pedig ugyanennek a konstruktornak adja át a kezdőértékeket. A `ScholarshipStudent` már ismét a `super(...)` segítségével dolgozik, így a név ellenőrzése, a hallgatóazonosító tárolása és az ösztöndíj kezdőértékének beállítása egymás után, jól meghatározott helyen történik.

:::lang java
```java
class Person {
    private String name;
    public Person(String name) {
        if (name == null || name.isBlank())
            throw new IllegalArgumentException("Invalid name");
        this.name = name;
    }
    public String getName() { return name; }
}
class Student extends Person {
    private String studentId;
    public Student(String name, String studentId) {
        super(name);
        if (studentId == null || studentId.isBlank())
            throw new IllegalArgumentException("Invalid student ID");
        this.studentId = studentId;
    }
    public Student(String name) {
        this(name, "UNASSIGNED");
    }
    public String getStudentId() { return studentId; }
}
class ScholarshipStudent extends Student {
    private int scholarship;
    public ScholarshipStudent(String name, String studentId, int scholarship) {
        super(name, studentId);
        if (scholarship < 0)
            throw new IllegalArgumentException("Invalid scholarship");
        this.scholarship = scholarship;
    }
    public int getScholarship() { return scholarship; }
}
class Main {
    public static void main(String[] args) {
        Student first = new Student("Alex Smith");
        ScholarshipStudent second =
            new ScholarshipStudent("Emma Clark", "ABCD12", 30000);
        System.out.println(first.getStudentId());
        System.out.println(second.getName());
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Person {
    private string name;
    public Person(string name) {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Invalid name");
        this.name = name;
    }
    public string GetName() { return name; }
}
class Student : Person {
    private string studentId;
    public Student(string name, string studentId) : base(name) {
        if (string.IsNullOrWhiteSpace(studentId))
            throw new ArgumentException("Invalid student ID");
        this.studentId = studentId;
    }
    public Student(string name) : this(name, "UNASSIGNED") { }
    public string GetStudentId() { return studentId; }
}
class ScholarshipStudent : Student {
    private int scholarship;
    public ScholarshipStudent(string name, string studentId, int scholarship)
        : base(name, studentId) {
        if (scholarship < 0)
            throw new ArgumentException("Invalid scholarship");
        this.scholarship = scholarship;
    }
    public int GetScholarship() { return scholarship; }
}
class Program {
    static void Main() {
        Student first = new Student("Alex Smith");
        ScholarshipStudent second =
            new ScholarshipStudent("Emma Clark", "ABCD12", 30000);
        Console.WriteLine(first.GetStudentId());
        Console.WriteLine(second.GetName());
    }
}
```
:::end

:::lang python
```python
class Person:
    def __init__(self, name):
        if not name or not name.strip():
            raise ValueError("Invalid name")
        self._name = name

    def get_name(self):
        return self._name

class Student(Person):
    def __init__(self, name, student_id="UNASSIGNED"):
        super().__init__(name)
        if not student_id or not student_id.strip():
            raise ValueError("Invalid student ID")
        self._student_id = student_id

    def get_student_id(self):
        return self._student_id

class ScholarshipStudent(Student):
    def __init__(self, name, student_id, scholarship):
        super().__init__(name, student_id)
        if scholarship < 0:
            raise ValueError("Invalid scholarship")
        self._scholarship = scholarship

    def get_scholarship(self):
        return self._scholarship

first = Student("Alex Smith")
second = ScholarshipStudent("Emma Clark", "ABCD12", 30000)
print(first.get_student_id())
print(second.get_name())
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <stdexcept>
#include <string>

class Person {
    std::string name;
public:
    explicit Person(const std::string& name) : name(name) {
        if (name.empty())
            throw std::invalid_argument("Invalid name");
    }
    std::string getName() const { return name; }
};
class Student : public Person {
    std::string studentId;
public:
    Student(const std::string& name, const std::string& studentId)
        : Person(name), studentId(studentId) {
        if (studentId.empty())
            throw std::invalid_argument("Invalid student ID");
    }
    explicit Student(const std::string& name)
        : Student(name, "UNASSIGNED") { }
    std::string getStudentId() const { return studentId; }
};
class ScholarshipStudent : public Student {
    int scholarship;
public:
    ScholarshipStudent(const std::string& name,
                       const std::string& studentId, int scholarship)
        : Student(name, studentId), scholarship(scholarship) {
        if (scholarship < 0)
            throw std::invalid_argument("Invalid scholarship");
    }
    int getScholarship() const { return scholarship; }
};
int main() {
    Student first("Alex Smith");
    ScholarshipStudent second("Emma Clark", "ABCD12", 30000);
    std::cout << first.getStudentId() << '\n';
    std::cout << second.getName() << '\n';
}
```
:::end

![A konstruktorok egymás közötti meghívása](content/chapters/08-konstruktorhivasi-lanc/media/person-student-hu.svg){width=610}

A hívások során először az osztályhierarchia legfelső érintett konstruktorának inicializálása készül el, majd sorban a leszármazottaké. Ez biztosítja, hogy amikor például a `ScholarshipStudent` konstruktorának saját törzse végrehajtódik, a `Person` és a `Student` által kezelt adatok már megfelelő kezdőállapotban legyenek. A `this(...)` és `super(...)` tehát nem ugyanazt a konstruktort választja ki, de közösen alakítják ki a példányosítás során végrehajtandó hívási láncot.


## Feladatok {#exercises}

A következő feladatokban az előző fejezetben létrehozott osztályhierarchiák példányosítását alakítjuk át. Most elsősorban az a cél, hogy az ősosztály adataihoz tartozó ellenőrzéseket ne ismételjük meg a leszármazottakban, és a különböző konstruktorok ne hozzanak létre egymástól eltérő inicializálási szabályokat. Az UML minden olyan mezőt és műveletet feltüntet, amellyel az adott osztály ebben a változatban rendelkezik.

:::exercise
### Téglalapok

![Téglalapok – UML](content/chapters/08-konstruktorhivasi-lanc/media/chain-task-1-hu.svg){width=640}

A feladat megoldásához az alábbi osztályokat és azok tagjait kell megvalósítani. Minden adatnál vizsgálja meg a hozzáférést és a megadott érvényességi feltételeket. Az UML az osztályok kapcsolatait szemlélteti; a szöveg önmagában is meghatározza a feladatot.

**Osztály: `Shape`**

**Mezők és property-k**
- **`color : String`** – privát szöveges mező, amely az alakzat színét tárolja. A publikus `getColor() : String` a mező pillanatnyi értékével tér vissza. A `setColor(color : String) : void` csak nem `null` és nem üres vagy csupa szóközből álló szöveget fogadhat el.

**Konstruktorok**
- `Shape(color : String)` – Az előző fejezet `Shape`–`Rectangle`–`Circle` hierarchiájában a `Shape` rendelkezzen egy publikus `Shape(color : String)` konstruktorral, amely a színt a korábban megírt validáló setter segítségével állítja be.

**Metódusok és hozzáférések**
- `canFitInside(screenWidth : double, screenHeight : double) : boolean` – A `Shape` ősosztályban készítse el a `canFitInside(screenWidth : double, screenHeight : double) : boolean` metódust, mely azt vizsgálja, hogy egy alakzat elhelyezhető-e adott méretű, téglalap alakú kijelzőn.
- `isDisplayable(screenWidth : double, screenHeight : double) : boolean` – A `Shape` osztályban egy másik, nem felülírandó `isDisplayable(screenWidth : double, screenHeight : double) : boolean` metódus egyszerűen a `canFitInside()` eredményével térjen vissza.

**Osztály: `Rectangle`**

**Mezők és property-k**
- **`x : double`** – a bal felső csúcs vízszintes koordinátája, tetszőleges valós szám. A privát mezőhöz publikus `getX() : double` és `setX(x : double) : void` tartozik. A getter visszaadja a tárolt koordinátát, a setter átállítja azt.
- **`y : double`** – a bal felső csúcs függőleges koordinátája, tetszőleges valós szám. A publikus `getY() : double` a tárolt értékkel tér vissza, a `setY(y : double) : void` pedig módosítja a privát mezőt. A pozitív függőleges irányt felfelé értelmezzük.
- **`width : double`** – a téglalap szélessége, amelynek szigorúan pozitívnak kell lennie. A `getWidth() : double` az aktuális szélességet adja vissza, a `setWidth(width : double) : void` pedig csak pozitív értéket menthet el.
- **`height : double`** – a téglalap magassága, amely szintén csak pozitív lehet. A `getHeight() : double` a tárolt magasságot adja vissza, a `setHeight(height : double) : void` elutasítja a nullát és a negatív értékeket.
- **`CREATED_COUNT : int`** – privát statikus számláló, amely kezdetben `0`, és minden sikeresen létrehozott téglalap után pontosan eggyel növekszik. A publikus statikus `getCreatedCount() : int` az összes eddig létrehozott téglalap számát adja vissza; a mezőhöz setter nem készül.

**Konstruktorok**
- `Rectangle(color : String, x : double, y : double, width : double, height : double)` – A `Rectangle` teljes paraméterlistájú konstruktora a színt, a bal felső csúcs két koordinátáját és a pozitív szélességet, magasságot várja; a színt az ősosztály konstruktorának adja át, a többi adatot a saját ellenőrzött settereit használva állítsa be.
- `Rectangle(color : String, width : double, height : double)` – Készítsen egy második `Rectangle(color : String, width : double, height : double)` konstruktort is, amely a teljes változatnak adja át a paramétereket, miközben a két koordinátát `0` értékre állítja.

**Metódusok és hozzáférések**
- `getArea() : double` – A téglalap területe a szélesség és a magasság szorzata.
- `getPerimeter() : double` – a `2 × (width + height)` értékkel tér vissza.
- `overlaps(other : Rectangle) : boolean` – akkor tér vissza igazzal, ha a két téglalap közös részének pozitív a területe. A kizárólag oldalban vagy csúcsban érintkező téglalapok nem fedik át egymást.
- `getQuadrant() : int` – az `1`–`4` érték valamelyikét adja vissza, ha a teljes téglalap egyetlen síknegyed belsejében található. Ha tengelyt érint, vagy több síknegyedre terjed ki, az eredmény `-1`.
- `canFitInside(screenWidth : double, screenHeight : double) : boolean` – A `Shape` ősosztályban készítse el a `canFitInside(screenWidth : double, screenHeight : double) : boolean` metódust, mely azt vizsgálja, hogy egy alakzat elhelyezhető-e adott méretű, téglalap alakú kijelzőn.

**Osztály: `Circle`**

**Mezők és property-k**
- **`radius : double`** – a kör privát sugara, amely csak pozitív értéket vehet fel. A `getRadius() : double` a tárolt sugarat adja vissza, a `setRadius(radius : double) : void` a hibás értékeket elutasítja.

**Konstruktorok**
- `Circle(color : String, radius : double)` – A `Circle(color : String, radius : double)` konstruktor ugyanígy a `Shape` konstruktorát hívja a színhez, és ellenőrzi, hogy a sugár pozitív legyen.

**Metódusok és hozzáférések**
- `getArea() : double` – A téglalap területe a szélesség és a magasság szorzata.
- `getPerimeter() : double` – A kerület a két oldalméret összegének kétszerese.
- `canFitInside(screenWidth : double, screenHeight : double) : boolean` – A `Shape` ősosztályban készítse el a `canFitInside(screenWidth : double, screenHeight : double) : boolean` metódust, mely azt vizsgálja, hogy egy alakzat elhelyezhető-e adott méretű, téglalap alakú kijelzőn.

**A működés részletes feltételei**

- Az előző fejezet `Shape`–`Rectangle`–`Circle` hierarchiájában a `Shape` rendelkezzen egy publikus `Shape(color : String)` konstruktorral, amely a színt a korábban megírt validáló setter segítségével állítja be.
- A `Rectangle` teljes paraméterlistájú konstruktora a színt, a bal felső csúcs két koordinátáját és a pozitív szélességet, magasságot várja; a színt az ősosztály konstruktorának adja át, a többi adatot a saját ellenőrzött settereit használva állítsa be.
- Készítsen egy második `Rectangle(color : String, width : double, height : double)` konstruktort is, amely a teljes változatnak adja át a paramétereket, miközben a két koordinátát `0` értékre állítja.
- A `Circle(color : String, radius : double)` konstruktor ugyanígy a `Shape` konstruktorát hívja a színhez, és ellenőrzi, hogy a sugár pozitív legyen.
- Gondoskodjon arról, hogy hibás értékből egyik osztály esetén se jöhessen létre példány.
- Az előzőekben megírt terület-, kerület- és illeszkedésvizsgáló metódusok működése maradjon változatlan; a főprogramban mutasson be mindkét téglalap-konstruktort és egy kör példányosítását!

:::endexercise

:::exercise
### Könyvek

![Könyvek – UML](content/chapters/08-konstruktorhivasi-lanc/media/chain-task-2-hu.svg){width=640}

A feladat megoldásához az alábbi osztályokat és azok tagjait kell megvalósítani. Minden adatnál vizsgálja meg a hozzáférést és a megadott érvényességi feltételeket. Az UML az osztályok kapcsolatait szemlélteti; a szöveg önmagában is meghatározza a feladatot.

**Osztály: `Publication`**

**Mezők és property-k**
- **`publisher : String`** – privát mező a kiadó nevének tárolására. A `getPublisher() : String` a kiadó nevét adja vissza, a `setPublisher(publisher : String) : void` pedig csak nem `null` és nem üres szöveget fogad el.
- **`country : String`** – privát mező a megjelenési ország nevével. A `getCountry() : String` a tárolt országot adja vissza, a `setCountry(country : String) : void` pedig elutasítja a `null`, üres vagy kizárólag szóközöket tartalmazó szöveget.

**Konstruktorok**
- `Publication(publisher : String, country : String)` – A `Publication` osztályba készítsen `Publication(publisher : String, country : String)` konstruktort, mely csak nem üres kiadó- és országnévvel hozhat létre példányt.

**Metódusok és hozzáférések**
- `calculateLateFee(daysLate : int) : int` – Az ősosztály `calculateTotalLateFee(daysLate : int, copies : int) : int` metódusa számítsa ki a díjat több azonos példányra, vagyis szorozza meg a `calculateLateFee()` eredményét a pozitív `copies` paraméterrel.
- `calculateTotalLateFee(daysLate : int, copies : int) : int` – A metódus működését a következő részletes követelmények rögzítik.

**Osztály: `Book`**

**Mezők és property-k**
- **`author : String`** – a könyv szerzőjének neve. A `getAuthor() : String` a tárolt nevet adja vissza, a `setAuthor(author : String) : void` pedig legalább két karaktert és kizárólag betűket, szóközt, pontot és kötőjelet enged meg.
- **`title : String`** – a könyv címe. A `getTitle() : String` a tárolt címet adja vissza, a `setTitle(title : String) : void` csak nem `null`, legalább két karakter hosszú címet fogad el. A cím elején és végén nem állhat szóköz, és tartalmaznia kell legalább egy betűt. A getter pontosan a tárolt címet adja vissza; a setter nem módosíthatja a mezőt, ha a feltétel nem teljesül.
- **`price : int`** – a könyv egész forintban megadott ára. A `getPrice() : int` az aktuális árral tér vissza, a `setPrice(price : int) : void` csak az `[500; 50 000]` intervallumba eső értéket mentheti el.
- **`genre : Genre`** – a könyv műfaja felsorolás típusban, például `BIOGRAPHY`, `HORROR`, `DRAMA`, `HISTORY`, `SCIFI` vagy `COMEDY`. A `getGenre() : Genre` a tárolt műfajt adja vissza, a `setGenre(genre : Genre) : void` nem fogadhat el `null` értéket.
- **`printed : boolean`** – igaz, ha nyomtatott könyvről, hamis, ha e-könyvről van szó. Az `isPrinted() : boolean` a tárolt logikai értéket adja vissza, a `setPrinted(printed : boolean) : void` pedig külön ellenőrzés nélkül módosítja.
- `isValidPrice(price : int) : boolean` – **`MIN_PRICE : int` és `MAX_PRICE : int`** – a `Book` nyilvános, `static final` konstansai, rendre `500` és `50 000` értékkel. A publikus statikus `isValidPrice(price : int) : boolean` azt állapítja meg, hogy a paraméter a megengedett tartományba esik-e.

**Konstruktorok**
- `Book(publisher : String, country : String, author : String, title : String, price : int, genre : Genre, printed : boolean)` – A `Book` teljes konstruktora paraméterben kapja a kiadó és az ország mellett a szerzőt, címet, árat, műfajt és a nyomtatott állapotot; a két közös mezőt az ősosztály konstruktorával inicializálja.
- `Book(publisher : String, country : String, author : String, title : String, price : int)` – A `Book(publisher : String, country : String, author : String, title : String, price : int)` rövidített konstruktor a teljes változatot hívja `DRAMA` műfajjal és nyomtatott formátummal.

**Metódusok és hozzáférések**
- `discount(percent : int) : void` – `1` és `99` közötti százalékkal csökkenti az árat, egész forintra lefelé kerekítve. Hibás százalék vagy `899` forint alá csökkenő új ár esetén a tárolt ár ne változzon meg.
- `isValidPrice(price : int) : boolean` – **`MIN_PRICE : int` és `MAX_PRICE : int`** – a `Book` nyilvános, `static final` konstansai, rendre `500` és `50 000` értékkel. A publikus statikus `isValidPrice(price : int) : boolean` azt állapítja meg, hogy a paraméter a megengedett tartományba esik-e.
- `toString() : String` – a könyv adatait olvasható, többmezős szövegként adja vissza.
- `calculateLateFee(daysLate : int) : int` – Az ősosztály `calculateTotalLateFee(daysLate : int, copies : int) : int` metódusa számítsa ki a díjat több azonos példányra, vagyis szorozza meg a `calculateLateFee()` eredményét a pozitív `copies` paraméterrel.

**Osztály: `Magazine`**

**Mezők és property-k**
- **`title : String`** – a könyv címe. A `getTitle() : String` a tárolt címet adja vissza, a `setTitle(title : String) : void` csak nem `null`, legalább két karakter hosszú címet fogad el.
- **`issueNumber : int`** – a folyóirat sorszáma, amely pozitív egész. A `getIssueNumber() : int` a tárolt sorszámmal tér vissza, a `setIssueNumber(issueNumber : int) : void` a nullát és a negatív értékeket elutasítja. A lapszám az [1; 9999] intervallumban legyen; a setter a határon kívüli értéket utasítsa el.

**Konstruktorok**
- `Magazine(publisher : String, country : String, title : String, issueNumber : int)` – A `Magazine(publisher : String, country : String, title : String, issueNumber : int)` konstruktor a közös adatok után eltárolja a nem üres címet és a pozitív lapszámot.

**Metódusok és hozzáférések**
- `calculateLateFee(daysLate : int) : int` – Az ősosztály `calculateTotalLateFee(daysLate : int, copies : int) : int` metódusa számítsa ki a díjat több azonos példányra, vagyis szorozza meg a `calculateLateFee()` eredményét a pozitív `copies` paraméterrel.

**A működés részletes feltételei**

- A `Publication` osztályba készítsen `Publication(publisher : String, country : String)` konstruktort, mely csak nem üres kiadó- és országnévvel hozhat létre példányt.
- A `Book` teljes konstruktora paraméterben kapja a kiadó és az ország mellett a szerzőt, címet, árat, műfajt és a nyomtatott állapotot; a két közös mezőt az ősosztály konstruktorával inicializálja.
- Az árra a korábbi `[500; 50000]` értéktartomány érvényes, a szöveges mezők nem lehetnek üresek.
- A `Book(publisher : String, country : String, author : String, title : String, price : int)` rövidített konstruktor a teljes változatot hívja `DRAMA` műfajjal és nyomtatott formátummal.
- A `Magazine(publisher : String, country : String, title : String, issueNumber : int)` konstruktor a közös adatok után eltárolja a nem üres címet és a pozitív lapszámot.
- A főprogramban hozza létre a kétféle kiadványt, és próbáljon ki egy hibás kiadónevet is, hogy ellenőrizze, melyik konstruktor felel az adat érvényességéért!

:::endexercise

:::exercise
### Autók

![Autók – UML](content/chapters/08-konstruktorhivasi-lanc/media/chain-task-3-hu.svg){width=640}

A feladat megoldásához az alábbi osztályokat és azok tagjait kell megvalósítani. Minden adatnál vizsgálja meg a hozzáférést és a megadott érvényességi feltételeket. Az UML az osztályok kapcsolatait szemlélteti; a szöveg önmagában is meghatározza a feladatot.

**Osztály: `Vehicle`**

**Mezők és property-k**
- **`brand : String`** – a jármű márkája, privát szöveges mező. A `getBrand() : String` az aktuális márkával tér vissza, a `setBrand(brand : String) : void` nem enged `null` vagy üres értéket elmenteni.
- **`maxSpeed : int`** – a jármű maximális sebessége km/h-ban, pozitív egész szám. A `getMaxSpeed() : int` a tárolt sebességet adja vissza, a `setMaxSpeed(maxSpeed : int) : void` elutasítja a nem pozitív értékeket.

**Konstruktorok**
- `Vehicle(brand : String, maxSpeed : int)` – A `Vehicle` ősosztály konstruktorának legyen két paramétere: `brand : String` és `maxSpeed : int`.

**Metódusok és hozzáférések**
- `getServiceIntervalKm() : int` – A `Vehicle` osztályhoz írjon `getServiceIntervalKm() : int` metódust, amely alapértelmezetten `0`-t ad vissza, ha nem ismerjük az ajánlott szervizperiódust.
- `needsService(kmSinceService : int) : boolean` – A `Vehicle` ősosztály `needsService(kmSinceService : int) : boolean` metódusa azt vizsgálja, hogy az utolsó szerviz óta megtett kilométerek száma elérte-e a tényleges járműtípus szervizperiódusát.

**Osztály: `Car`**

**Mezők és property-k**
- **`model : String`** – a modell neve. A `getModel() : String` a tárolt modellnevet adja vissza, a `setModel(model : String) : void` csak nem üres szöveget enged meg. A modellnév legalább két, legfeljebb harminc karakter hosszú lehet, és nem kezdődhet vagy végződhet szóközzel. A getter a teljes, változatlan modellnevet adja vissza.
- **`year : int`** – a gyártási év, az `[1886; 2100]` intervallumban. A `getYear() : int` az évszámot adja vissza, a `setYear(year : int) : void` a tartományon kívüli értékeket elutasítja.
- **`mileage : int`** – a kilométeróra állása egész kilométerben, nemnegatív szám. A `getMileage() : int` a tárolt értéket adja vissza; publikus setter nincs, a futásteljesítmény kizárólag a konstruktorban és a `drive()` metódussal módosítható.
- **`id : int`** – automatikusan kiosztott, pozitív példányazonosító. A `getId() : int` az azonosítót adja vissza, amely a példány teljes életében változatlan; setter nincs.
- **`NEXT_ID : int`** – privát statikus mező, `1` kezdeti értékkel. Minden új `Car` példány az aktuális értéket kapja azonosítóként, majd a számláló eggyel növekszik.

**Konstruktorok**
- `Car(brand : String, maxSpeed : int, model : String, year : int, mileage : int)` – A `Car` osztály teljes konstruktora ezek mellett kapja meg a `model : String`, `year : int`, `mileage : int` értékeket; a modellt ne engedje üresen, az év legyen az `[1886; 2100]` intervallumban, a kilométeróra-állás pedig nemnegatív egész.
- `Car(brand : String, maxSpeed : int, model : String, year : int)` – A `Car(brand : String, maxSpeed : int, model : String, year : int)` rövidített konstruktor az előző változatot hívja `0` kilométerrel.

**Metódusok és hozzáférések**
- `drive(distance : int) : void` – kizárólag pozitív egész távolsággal növelheti a kilométeróra-állást.
- `toString() : String` – a márkát, a modellt, az évjáratot és az aktuális futásteljesítményt tartalmazó szöveget adja vissza.
- `getServiceIntervalKm() : int` – A `Vehicle` osztályhoz írjon `getServiceIntervalKm() : int` metódust, amely alapértelmezetten `0`-t ad vissza, ha nem ismerjük az ajánlott szervizperiódust.

**Osztály: `Motorcycle`**

**Mezők és property-k**
- **`engineCapacity : int`** – a motorkerékpár hengerűrtartalma cm³-ben, pozitív egész. A `getEngineCapacity() : int` a tárolt értéket adja vissza, a `setEngineCapacity(engineCapacity : int) : void` csak pozitív értéket fogad el. A hengerűrtartalom 50 és 2500 cm³ közé essen; a getter az eredeti egész értéket adja vissza.
- **`sidecar : boolean`** – azt jelzi, van-e a motorkerékpárnak oldalkocsija. A `hasSidecar() : boolean` a tárolt logikai értéket adja vissza, a `setSidecar(sidecar : boolean) : void` pedig tetszőleges logikai értékkel módosíthatja azt.

**Konstruktorok**
- `Motorcycle(brand : String, maxSpeed : int, engineCapacity : int, sidecar : boolean)` – A `Motorcycle(brand : String, maxSpeed : int, engineCapacity : int, sidecar : boolean)` konstruktor a megfelelő ősosztály-konstruktor után ellenőrzi, hogy a hengerűrtartalom pozitív legyen.

**Metódusok és hozzáférések**
- `getServiceIntervalKm() : int` – A `Vehicle` osztályhoz írjon `getServiceIntervalKm() : int` metódust, amely alapértelmezetten `0`-t ad vissza, ha nem ismerjük az ajánlott szervizperiódust.


**`Motorcycle` – a setter felülírása**

- **`setMaxSpeed(maxSpeed : int) : void`** – írja felül a `Vehicle` osztály azonos nevű setterét. A motorkerékpár maximális sebessége az ősosztály által megengedett tartományba essen, de oldalkocsi esetén legfeljebb 100 km/h lehet. Először ellenőrizze a saját korlátozást, majd a tényleges értékadást az ős setterével végezze el (`super.setMaxSpeed(maxSpeed)`). Hibás értéknél az előző sebesség maradjon meg. A `setSidecar(true)` metódus csak akkor kapcsolhassa be az oldalkocsit, ha a tárolt maximális sebesség legfeljebb 100 km/h; különben dobjon `IllegalArgumentException` kivételt, és a korábbi állapot maradjon meg.

**A működés részletes feltételei**

- A `Vehicle` ősosztály konstruktorának legyen két paramétere: `brand : String` és `maxSpeed : int`.
- A márka nem lehet üres, a maximális sebesség pozitív egész szám legyen.
- A `Car` osztály teljes konstruktora ezek mellett kapja meg a `model : String`, `year : int`, `mileage : int` értékeket; a modellt ne engedje üresen, az év legyen az `[1886; 2100]` intervallumban, a kilométeróra-állás pedig nemnegatív egész.
- A `Car(brand : String, maxSpeed : int, model : String, year : int)` rövidített konstruktor az előző változatot hívja `0` kilométerrel.
- A `Motorcycle(brand : String, maxSpeed : int, engineCapacity : int, sidecar : boolean)` konstruktor a megfelelő ősosztály-konstruktor után ellenőrzi, hogy a hengerűrtartalom pozitív legyen.
- A korábbi automatikus autóazonosítót a sikeresen elvégzett ellenőrzések után ossza ki, és gondoskodjon arról, hogy egyetlen példány se kapjon két azonosítót! Hozzon létre mindhárom konstruktorral járműveket, és mutassa meg a szervizigény-vizsgálatukat!

:::endexercise

:::exercise
### Bankszámlák

![Bankszámlák – UML](content/chapters/08-konstruktorhivasi-lanc/media/chain-task-4-hu.svg){width=640}

A feladat megoldásához az alábbi osztályokat és azok tagjait kell megvalósítani. Minden adatnál vizsgálja meg a hozzáférést és a megadott érvényességi feltételeket. Az UML az osztályok kapcsolatait szemlélteti; a szöveg önmagában is meghatározza a feladatot.

**Osztály: `BankAccount`**

**Mezők és property-k**
- **`owner : String`** – a számlatulajdonos neve. A `getOwner() : String` a tárolt nevet adja vissza, a `setOwner(owner : String) : void` pedig nem fogad el `null` vagy üres szöveget.
- **`accountNumber : String`** – a számla azonosítója. A `getAccountNumber() : String` a tárolt számlaszámot adja vissza. A `setAccountNumber(accountNumber : String) : void` csak az első, érvényes érték beállítását engedi meg; ezt követően az azonosító nem változtatható meg. Üres vagy `null` számlaszámot el kell utasítania. A feladatban a számlaszám pontosan nyolc karakteres legyen: az első kettő az angol ábécé nagybetűje, a következő hat pedig számjegy. Az első érvényes érték után a setter nem engedheti meg a cserét.
- **`balance : int`** – az egyenleg egész forintban, kezdetben `0`. A `getBalance() : int` a pillanatnyi összeget adja vissza. Publikus setter nem készül, az érték csak a befizetés és a pénzfelvétel során változhat, és soha nem lehet negatív.

**Konstruktorok**
- `BankAccount(owner : String, accountNumber : String, balance : int)` – A `BankAccount(owner : String, accountNumber : String, balance : int)` konstruktor csak nem üres tulajdonost és számlaszámot, valamint nemnegatív egész egyenleget fogadhat el.

**Metódusok és hozzáférések**
- `deposit(amount : int) : void` – csak pozitív egész összeget fogad, amelyet hozzáad az egyenleghez.
- `withdraw(amount : int) : void` – csak pozitív, a rendelkezésre álló egyenlegnél nem nagyobb összeget vonhat le. Hibás összeg esetén az egyenleg ne változzon meg.
- `calculateTransferFee(amount : int) : int` – A számításhoz használja a felülírható `calculateTransferFee()` metódust, majd `BankAccount` típusú referenciákon ellenőrizze a különböző számlatípusok működését!
- `canAffordTransfer(amount : int) : boolean` – Az ősosztályhoz írjon `canAffordTransfer(amount : int) : boolean` metódust, amely eldönti, hogy az egyenlegből a teljes összeg és a megfelelő díj együttesen kifizethető-e.

**Osztály: `SavingsAccount`**

**Mezők és property-k**
- A `SavingsAccount` konstruktora ugyanezeket az értékeket és egy `interestRate : double` kamatlábat vár a `[0;1]` intervallumból. `+ getInterestRate() : double` `+ setInterestRate(interestRate : double) : void`. A setter az ellenőrzést követően mentheti el az új értéket; hibás adat nem módosíthatja a régi állapotot.

**Konstruktorok**
- `SavingsAccount(owner : String, accountNumber : String, balance : int, interestRate : double)` – A `SavingsAccount` konstruktora ugyanezeket az értékeket és egy `interestRate : double` kamatlábat vár a `[0;1]` intervallumból.

**Metódusok és hozzáférések**
- `calculateTransferFee(amount : int) : int` – A számításhoz használja a felülírható `calculateTransferFee()` metódust, majd `BankAccount` típusú referenciákon ellenőrizze a különböző számlatípusok működését!

**Osztály: `BusinessAccount`**

**Mezők és property-k**
- **`companyName : String`** – a vállalkozás neve. A `getCompanyName() : String` a tárolt szöveggel tér vissza, a `setCompanyName(companyName : String) : void` csak nem üres, nem `null` szöveget fogad el.

**Konstruktorok**
- `BusinessAccount(owner : String, accountNumber : String, balance : int, companyName : String)` – A `BusinessAccount` konstruktora a közös adatokon kívül a nem üres `companyName : String` értéket kapja meg.

**Metódusok és hozzáférések**
- `calculateTransferFee(amount : int) : int` – A számításhoz használja a felülírható `calculateTransferFee()` metódust, majd `BankAccount` típusú referenciákon ellenőrizze a különböző számlatípusok működését!

**A működés részletes feltételei**

- Az előző fejezet `BankAccount`–`SavingsAccount`–`BusinessAccount` hierarchiáját egészítse ki konstruktorokkal.
- A `BankAccount(owner : String, accountNumber : String, balance : int)` konstruktor csak nem üres tulajdonost és számlaszámot, valamint nemnegatív egész egyenleget fogadhat el.
- A `SavingsAccount` konstruktora ugyanezeket az értékeket és egy `interestRate : double` kamatlábat vár a `[0;1]` intervallumból.
- A `BusinessAccount` konstruktora a közös adatokon kívül a nem üres `companyName : String` értéket kapja meg.
- Mindkét leszármazott kizárólag az ősosztály konstruktorán keresztül állítsa be a közös adatokat.
- Az átutalási díj számítását és az átutalás fedezetének vizsgálatát ne helyezze a konstruktorokba, mert azok a példány későbbi működéséhez tartoznak.
- A főprogramban hozzon létre mindkét számlatípusból példányokat, majd ellenőrizze, hogy hibás számlaszámmal, illetve kamatlábbal nem hozható létre új számla!

:::endexercise

:::exercise
### Filmek

![Filmek – UML](content/chapters/08-konstruktorhivasi-lanc/media/chain-task-5-hu.svg){width=640}

A feladat megoldásához az alábbi osztályokat és azok tagjait kell megvalósítani. Minden adatnál vizsgálja meg a hozzáférést és a megadott érvényességi feltételeket. Az UML az osztályok kapcsolatait szemlélteti; a szöveg önmagában is meghatározza a feladatot.

**Osztály: `MediaItem`**

**Mezők és property-k**
- **`title : String`** – a mű címe, privát szöveges mező. A `getTitle() : String` a tárolt címet adja vissza, a `setTitle(title : String) : void` csak nem `null`, legalább két karakter hosszú címet fogad el. A cím elején és végén nem lehet szóköz, és legalább egy betűt tartalmaznia kell. A getter az eltárolt teljes címet adja vissza.
- **`releaseYear : int`** – a megjelenési év, pozitív egész szám. A `getReleaseYear() : int` az évszámot adja vissza, a `setReleaseYear(releaseYear : int) : void` a nullát és a negatív értékeket elutasítja.

**Konstruktorok**
- `MediaItem(title : String, releaseYear : int)` – Készítsen a `MediaItem` ősosztályba `MediaItem(title : String, releaseYear : int)` konstruktort, amely nem üres címet és az `[1895; 2100]` intervallumba tartozó megjelenési évet vár.

**Metódusok és hozzáférések**
- `getViewingMinutes() : int` – A `MediaItem` osztályhoz készítsen `getViewingMinutes() : int` metódust, mely az adott tartalom teljes megtekintéséhez szükséges időt adja vissza; az ősosztály alapértelmezett értéke `0`.
- `canWatchWithin(maxMinutes : int) : boolean` – Az ősosztály `canWatchWithin(maxMinutes : int) : boolean` metódusa akkor adjon `true` értéket, ha a játékidő pozitív, és nem hosszabb a megadott időkeretnél; nem pozitív időkeretre dobjon kivételt.

**Osztály: `Movie`**

**Mezők és property-k**
- **`director : String`** – a film rendezője. A `getDirector() : String` a tárolt nevet adja vissza, a `setDirector(director : String) : void` nem `null`, legalább két karakteres szöveget fogad el, amely csak betűket, szóközt, pontot és kötőjelet tartalmazhat.
- **`duration : int`** – a film hossza percben, az `[10; 360]` intervallumban. A `getDuration() : int` a tárolt játékidővel tér vissza, a `setDuration(duration : int) : void` az ezen kívüli értékeket elutasítja.

**Konstruktorok**
- `Movie(title : String, releaseYear : int, director : String, duration : int)` – A `Movie(title : String, releaseYear : int, director : String, duration : int)` konstruktor adja át a közös adatokat az ősosztálynak, majd ellenőrizze a nem üres rendezőt és a `[10;360]` intervallumban megadott játékidőt.
- `Movie(title : String, releaseYear : int, director : String)` – Készítsen rövidített `Movie(title : String, releaseYear : int, director : String)` konstruktort is, amely `90` perces alapértelmezett játékidővel a teljes konstruktort hívja.

**Metódusok és hozzáférések**
- `getViewingMinutes() : int` – A `MediaItem` osztályhoz készítsen `getViewingMinutes() : int` metódust, mely az adott tartalom teljes megtekintéséhez szükséges időt adja vissza; az ősosztály alapértelmezett értéke `0`.

**Osztály: `Series`**

**Mezők és property-k**
- **`seasons : int`** – az elkészült évadok száma, pozitív egész szám. A `getSeasons() : int` a tárolt évadszámot adja vissza, a `setSeasons(seasons : int) : void` csak pozitív értéket fogad el.
- A `Series` osztályban a meglévő pozitív `seasons` mező mellett vezesse be az egy évadhoz tartozó epizódok számát (`episodesPerSeason : int`) és egy epizód átlagos hosszát (`minutesPerEpisode : int`), mindkettő pozitív egész szám. `+ getEpisodesPerSeason() : int`. A getter a mező aktuális értékét adja vissza. `+ getEpisodesPerSeason() : int`. A getter a mező aktuális értékét adja vissza.
- A `Series` osztályban a meglévő pozitív `seasons` mező mellett vezesse be az egy évadhoz tartozó epizódok számát (`episodesPerSeason : int`) és egy epizód átlagos hosszát (`minutesPerEpisode : int`), mindkettő pozitív egész szám. `+ getEpisodesPerSeason() : int`. A getter a mező aktuális értékét adja vissza. `+ getMinutesPerEpisode() : int`. A getter a mező aktuális értékét adja vissza.

**Konstruktorok**
- `Series(title : String, releaseYear : int, seasons : int, episodesPerSeason : int, minutesPerEpisode : int)` – A `Series(title : String, releaseYear : int, seasons : int, episodesPerSeason : int, minutesPerEpisode : int)` konstruktornak mindhárom utolsó paramétere pozitív egész szám legyen.

**Metódusok és hozzáférések**
- `getViewingMinutes() : int` – A `MediaItem` osztályhoz készítsen `getViewingMinutes() : int` metódust, mely az adott tartalom teljes megtekintéséhez szükséges időt adja vissza; az ősosztály alapértelmezett értéke `0`.

**A működés részletes feltételei**

- Készítsen a `MediaItem` ősosztályba `MediaItem(title : String, releaseYear : int)` konstruktort, amely nem üres címet és az `[1895; 2100]` intervallumba tartozó megjelenési évet vár.
- A `Movie(title : String, releaseYear : int, director : String, duration : int)` konstruktor adja át a közös adatokat az ősosztálynak, majd ellenőrizze a nem üres rendezőt és a `[10;360]` intervallumban megadott játékidőt.
- Készítsen rövidített `Movie(title : String, releaseYear : int, director : String)` konstruktort is, amely `90` perces alapértelmezett játékidővel a teljes konstruktort hívja.
- A `Series(title : String, releaseYear : int, seasons : int, episodesPerSeason : int, minutesPerEpisode : int)` konstruktornak mindhárom utolsó paramétere pozitív egész szám legyen.
- Az előző fejezetből megtartott megtekintési időt számító metódusok változtatása nélkül hozza létre a szükséges példányokat, és szemléltesse, hogy az örökölt adatok és a leszármazott saját mezői mikor válnak érvényessé!

:::endexercise

