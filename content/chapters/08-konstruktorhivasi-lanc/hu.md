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



**Követelmények**

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



**Követelmények**

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



**Követelmények**

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



**Követelmények**

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



**Követelmények**

- Készítsen a `MediaItem` ősosztályba `MediaItem(title : String, releaseYear : int)` konstruktort, amely nem üres címet és az `[1895; 2100]` intervallumba tartozó megjelenési évet vár.
- A `Movie(title : String, releaseYear : int, director : String, duration : int)` konstruktor adja át a közös adatokat az ősosztálynak, majd ellenőrizze a nem üres rendezőt és a `[10;360]` intervallumban megadott játékidőt.
- Készítsen rövidített `Movie(title : String, releaseYear : int, director : String)` konstruktort is, amely `90` perces alapértelmezett játékidővel a teljes konstruktort hívja.
- A `Series(title : String, releaseYear : int, seasons : int, episodesPerSeason : int, minutesPerEpisode : int)` konstruktornak mindhárom utolsó paramétere pozitív egész szám legyen.
- Az előző fejezetből megtartott megtekintési időt számító metódusok változtatása nélkül hozza létre a szükséges példányokat, és szemléltesse, hogy az örökölt adatok és a leszármazott saját mezői mikor válnak érvényessé!
:::endexercise

