# Osztályszintű mezők és metódusok

## Memóriakezelés {#memory}

Az eddigiekben olyan osztályokat készítettünk, melyek mezői és metódusai az egyes példányokhoz kapcsolódtak. Amikor egy osztályból több példányt hozunk létre, minden példány saját mezőkkel rendelkezik, ezért az egyik objektum adatainak módosítása nem változtatja meg a többi objektum azonos nevű mezőit. Ha például létrehozunk két hallgatót, akkor a nevüket és a teljesített kreditjeik számát egymástól függetlenül tároljuk. Ezeket **példányszintű mezőknek** nevezzük.

Java-ban a `new` kulcsszóval létrehozott objektumok a **heap** memóriaterületen helyezkednek el. A főprogramban deklarált `first` és `second` változók nem magukat az objektumokat, hanem az azokra mutató **referenciákat** tárolják. Az ábrán az áttekinthetőség kedvéért egymás mellé rajzoltuk az objektumokat, de a memóriában nem feltétlenül szomszédos helyeken találhatók. Az objektum mezői a példányhoz tartoznak; ha valamelyik mező egy másik objektumra, például egy szövegre hivatkozik, annak tárolása külön is történhet.

:::lang java
```java
class Student {
    private String name;
    private int credits;

    public Student(String name, int credits) {
        this.name = name;
        this.credits = credits;
    }
}

class Main {
    public static void main(String[] args) {
        Student first = new Student("Anna", 30);
        Student second = new Student("Bela", 45);
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Student
{
    private string name;
    private int credits;

    public Student(string name, int credits)
    {
        this.name = name;
        this.credits = credits;
    }
}

class Program
{
    static void Main(string[] args)
    {
        Student first = new Student("Anna", 30);
        Student second = new Student("Bela", 45);
    }
}
```
:::end

:::lang python
```python
class Student:
    def __init__(self, name, credits):
        self.name = name
        self.credits = credits

first = Student("Anna", 30)
second = Student("Bela", 45)
```
:::end

:::lang cpp
```cpp
#include <string>

class Student {
    std::string name;
    int credits;
public:
    Student(const std::string& name, int credits)
        : name(name), credits(credits) {}
};

int main() {
    Student first("Anna", 30);
    Student second("Bela", 45);
}
```
:::end

![A példányok és referenciáik](content/chapters/05-osztalyszintu-elemek/media/memory-instances-hu.svg){width=620}

A példányszintű metódusok működése ettől valamelyest eltér. Bár egy ilyen metódust mindig valamelyik példányon hívunk meg, a metódus programkódjából nem készül külön másolat minden objektumhoz. A metódus ugyanazt a programkódot hajtja végre, de a `this` segítségével mindig annak a példánynak a mezőit éri el, amelyiken meghívtuk. Ezzel magyarázható, hogy ugyanaz a metódus az egyik hallgatónál `30`, a másiknál `45` kredittel dolgozhat.

## Osztályszintű mezők {#static-fields}

Gyakran előfordul, hogy olyan adatot szeretnénk tárolni, amely nem egyetlen példányhoz, hanem az osztály egészéhez tartozik. A hallgatók esetén ilyen lehet például az egyetem neve, ha az alkalmazásunkban minden hallgató ugyanahhoz az egyetemhez tartozik. Fölösleges lenne ezt a szöveget minden egyes hallgatóhoz külön mezőként hozzárendelni, hiszen minden példány esetén ugyanazt az információt szeretnénk elérni. Ilyenkor **osztályszintű mezőt** készítünk, amelyből az adott osztályhoz egy közös érték tartozik, függetlenül a létrehozott példányok számától.

Java-ban az osztályszintű mezőt a `static` kulcsszóval jelöljük meg. Az ilyen mezőt célszerű az osztály nevével elérni, például `Student.UNIVERSITY_NAME` formában, míg a példányszintű mezőkhöz egy konkrét példányon keresztül férünk hozzá. Az osztályszintű mezőknek ugyanúgy lehet `public` vagy `private` láthatósága, mint a korábban megismert mezőknek. Az alábbi példában az egyetem nevét a bemutatás kedvéért közvetlenül elérhetővé tettük, a későbbiekben azonban a módosítható osztályszintű adatok hozzáférését is érdemes metódusokkal szabályoznunk.

:::lang java
```java
class Student {
    public static String UNIVERSITY_NAME = "Example University";
    private String name;

    public Student(String name) {
        this.name = name;
    }
}

class Main {
    public static void main(String[] args) {
        Student first = new Student("Anna");
        Student second = new Student("Bela");
        System.out.println(Student.UNIVERSITY_NAME);
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Student
{
    public static string UNIVERSITY_NAME = "Example University";
    private string name;

    public Student(string name)
    {
        this.name = name;
    }
}

class Program
{
    static void Main(string[] args)
    {
        Student first = new Student("Anna");
        Student second = new Student("Bela");
        Console.WriteLine(Student.UNIVERSITY_NAME);
    }
}
```
:::end

:::lang python
```python
class Student:
    UNIVERSITY_NAME = "Example University"

    def __init__(self, name):
        self.name = name

first = Student("Anna")
second = Student("Bela")
print(Student.UNIVERSITY_NAME)
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>

class Student {
public:
    inline static std::string UNIVERSITY_NAME = "Example University";
private:
    std::string name;
public:
    explicit Student(const std::string& name) : name(name) {}
};

int main() {
    Student first("Anna");
    Student second("Bela");
    std::cout << Student::UNIVERSITY_NAME << '\n';
}
```
:::end

![A közös osztályszintű mező és a példányok](content/chapters/05-osztalyszintu-elemek/media/memory-hu.svg){width=760}

A tananyagban a könnyebb megkülönböztetés érdekében az osztályszintű mezők nevét csupa nagybetűvel írjuk, és az összetett neveket aláhúzással választjuk el, például `UNIVERSITY_NAME` vagy `NEXT_ID`. Ez a módosítható statikus mezőknél saját elnevezési megállapodásunk; a Java általánosan elfogadott névadási szabálya elsősorban a konstansok esetén használja ezt a formát. Az osztályszintű metódusok neveit továbbra is a szokásos módon írjuk.

Az osztályszintű mező nem valamelyik `Student` objektum része, hanem az osztályhoz kapcsolódó, közösen használt adat. Ha megváltoztatjuk az egyetem nevét, akkor az új érték minden példány számára ugyanaz lesz, mert nem külön-külön mezőket módosítottunk. Azt is fontos megértenünk, hogy ez az egyetlen közös mező nem jelenti azt, hogy minden hallgató többi adata is közössé válna: a `name` mező továbbra is minden objektumban önállóan található meg.

### Osztályszintű konstansok {#constants}

Vannak olyan osztályszintű adatok, amelyek értéke az alkalmazás működése közben nem változhat. Ilyen lehet például egy megengedett maximális kreditszám vagy egy olyan intézményi azonosító, amelyet az adott program futása alatt állandónak tekintünk. Java-ban az ilyen mezőket a `static` mellett a `final` kulcsszóval is megjelöljük. Az osztályszintű konstansok azonosítóját a Java elnevezési szokásai szerint is nagybetűkkel, a szavakat aláhúzással elválasztva írjuk.

:::lang java
```java
class Student {
    public static final int MAX_CREDITS = 300;
}

class Main {
    public static void main(String[] args) {
        System.out.println(Student.MAX_CREDITS);
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Student
{
    public const int MAX_CREDITS = 300;
}

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine(Student.MAX_CREDITS);
    }
}
```
:::end

:::lang python
```python
class Student:
    MAX_CREDITS = 300

print(Student.MAX_CREDITS)
```
:::end

:::lang cpp
```cpp
#include <iostream>

class Student {
public:
    static constexpr int MAX_CREDITS = 300;
};

int main() {
    std::cout << Student::MAX_CREDITS << '\n';
}
```
:::end

A `final` megakadályozza, hogy a Java-programban a mezőhöz később új értéket rendeljünk, de ha a mező referenciatípusú objektumra mutat, az objektum belső állapotának módosítását önmagában nem tiltja meg. C#-ban az itt bemutatott egyszerű állandóhoz a `const` kulcsszót használjuk, C++-ban pedig a `constexpr` is rendelkezésünkre áll. Pythonban a csupa nagybetűs név csak elnevezési szokás, önmagában nem akadályozza meg az érték későbbi megváltoztatását.

## Osztályszintű metódusok {#static-methods}

Nemcsak mezőkből, hanem metódusokból is készíthetünk osztályszintűeket. Ezeknek a metódusoknak a meghívásához nincs szükségünk példányra, ezért különösen alkalmasak olyan műveletekre, amelyek az osztály közös adataival dolgoznak, vagy amelyekhez egyáltalán nem kell objektumállapotot felhasználnunk. Jó példa erre az egyetem nevének lekérdezése, illetve módosítása. A következő megoldásban a korábban publikus mezőt `private` láthatóságúvá tesszük, és a hozzáférést osztályszintű metódusok segítségével biztosítjuk.

:::lang java
```java
class Student {
    private static String UNIVERSITY_NAME = "Example University";

    public static String getUniversityName() {
        return UNIVERSITY_NAME;
    }

    public static void setUniversityName(String value) {
        if (value == null || value.isBlank())
            throw new IllegalArgumentException("Invalid university name.");
        UNIVERSITY_NAME = value;
    }
}

class Main {
    public static void main(String[] args) {
        Student.setUniversityName("New University");
        System.out.println(Student.getUniversityName());
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Student
{
    private static string UNIVERSITY_NAME = "Example University";

    public static string GetUniversityName()
    {
        return UNIVERSITY_NAME;
    }

    public static void SetUniversityName(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Invalid university name.");
        UNIVERSITY_NAME = value;
    }
}

class Program
{
    static void Main(string[] args)
    {
        Student.SetUniversityName("New University");
        Console.WriteLine(Student.GetUniversityName());
    }
}
```
:::end

:::lang python
```python
class Student:
    _UNIVERSITY_NAME = "Example University"

    @classmethod
    def get_university_name(cls):
        return cls._UNIVERSITY_NAME

    @classmethod
    def set_university_name(cls, value):
        if not value or not value.strip():
            raise ValueError("Invalid university name.")
        cls._UNIVERSITY_NAME = value

Student.set_university_name("New University")
print(Student.get_university_name())
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <stdexcept>
#include <string>

class Student {
    inline static std::string UNIVERSITY_NAME = "Example University";
public:
    static std::string getUniversityName() {
        return UNIVERSITY_NAME;
    }

    static void setUniversityName(const std::string& value) {
        if (value.empty())
            throw std::invalid_argument("Invalid university name.");
        UNIVERSITY_NAME = value;
    }
};

int main() {
    Student::setUniversityName("New University");
    std::cout << Student::getUniversityName() << '\n';
}
```
:::end

A Java és a C# a `static` kulcsszóval jelöli az osztályszintű metódusokat, és C++-ban is hasonló megoldást alkalmazunk. Pythonban az `@classmethod` dekorátorral olyan metódust készíthetünk, amely automatikusan megkapja az osztályt a `cls` paraméterben, míg az `@staticmethod` segítségével olyan metódust írhatunk, amely sem példányt, sem osztályt nem kap automatikusan. A két Python-megoldás tehát nem teljesen azonos, és mindig azt választjuk közülük, amelyik jobban illik az elvégzendő feladathoz.

### Hozzáférési szabályok {#access}

A példányszintű metódusok közvetlenül elérik az aktuális példány mezőit és metódusait, valamint az osztályszintűeket is. Az osztályszintű metódusok esetén viszont nincs aktuális példány, ezért azok közvetlenül csak az osztályszintű mezőket és metódusokat használhatják. Ez nem jelenti azt, hogy egy statikus metódus egyáltalán ne érhetné el a példányszintű adatokat: ha rendelkezik egy konkrét példány referenciájával, akkor azon keresztül azokat is elérheti. Mivel az osztályon belül vagyunk, ez a hozzáférés a `private` mezőkre is érvényes.

:::lang java
```java
class Student {
    private String name;
    private static String UNIVERSITY_NAME = "Example University";

    public Student(String name) {
        this.name = name;
    }

    public String getDescription() {
        return name + " - " + UNIVERSITY_NAME;
    }

    public static String describe(Student student) {
        return student.name + " - " + UNIVERSITY_NAME;
        // return name; // Invalid: no current instance.
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Student
{
    private string name;
    private static string UNIVERSITY_NAME = "Example University";

    public Student(string name) { this.name = name; }

    public string GetDescription()
    {
        return name + " - " + UNIVERSITY_NAME;
    }

    public static string Describe(Student student)
    {
        return student.name + " - " + UNIVERSITY_NAME;
        // return name; // Invalid: no current instance.
    }
}
```
:::end

:::lang python
```python
class Student:
    UNIVERSITY_NAME = "Example University"

    def __init__(self, name):
        self.name = name

    def get_description(self):
        return self.name + " - " + Student.UNIVERSITY_NAME

    @staticmethod
    def describe(student):
        return student.name + " - " + Student.UNIVERSITY_NAME
```
:::end

:::lang cpp
```cpp
#include <string>

class Student {
    std::string name;
    inline static std::string UNIVERSITY_NAME = "Example University";
public:
    explicit Student(const std::string& name) : name(name) {}

    std::string getDescription() const {
        return name + " - " + UNIVERSITY_NAME;
    }

    static std::string describe(const Student& student) {
        return student.name + " - " + UNIVERSITY_NAME;
        // return name; // Invalid: no current instance.
    }
};
```
:::end

Az UML-osztálydiagramon az osztályszintű mezőket és metódusokat **aláhúzással** jelöljük, így azok jól megkülönböztethetők a példányszintű elemektől. A jelölés független attól, hogy az adott mező vagy metódus milyen láthatósági szinttel rendelkezik, ezért az aláhúzás mellett továbbra is megjelenhet a `+` vagy `-` jel. Az alábbi diagramon a `name` példányszintű mező, míg a `UNIVERSITY_NAME` és a `getUniversityName()` osztályszintű elem.

![A Student osztály UML-diagramja](content/chapters/05-osztalyszintu-elemek/media/student-static-hu.svg){width=420}

## Statikus konstruktor {#static-initialization}

A példányszintű mezők kezdőértékeit konstruktorok segítségével állítottuk be, de az osztályszintű mezőket nem inicializálhatjuk minden példány létrehozásakor, hiszen azok közös adatok. A legtöbb esetben elegendő, ha az osztályszintű mezőnek már a deklarálásakor kezdőértéket adunk. Előfordulhat azonban, hogy ehhez összetettebb műveletekre van szükségünk, például több érték kiszámítására vagy valamilyen beállítás ellenőrzésére. Java-ban erre a célra **statikus inicializáló blokkot** írhatunk a `static { ... }` szerkezettel; a nyelvben külön statikus konstruktor nem létezik.

:::lang java
```java
class Student {
    private static int NEXT_ID;

    static {
        NEXT_ID = 1000;
        System.out.println("Student class initialized.");
    }

    public static int getNextId() {
        return NEXT_ID;
    }
}

class Main {
    public static void main(String[] args) {
        System.out.println(Student.getNextId());
        System.out.println(Student.getNextId());
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Student
{
    private static int NEXT_ID;

    static Student()
    {
        NEXT_ID = 1000;
        Console.WriteLine("Student class initialized.");
    }

    public static int GetNextId() { return NEXT_ID; }
}

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine(Student.GetNextId());
        Console.WriteLine(Student.GetNextId());
    }
}
```
:::end

:::lang python
```python
class Student:
    NEXT_ID = 1000
    print("Student class initialized.")

    @classmethod
    def get_next_id(cls):
        return cls.NEXT_ID

print(Student.get_next_id())
print(Student.get_next_id())
```
:::end

:::lang cpp
```cpp
#include <iostream>

class Student {
    static int initializeNextId() {
        std::cout << "Student class initialized.\n";
        return 1000;
    }

    inline static int NEXT_ID = initializeNextId();
public:
    static int getNextId() { return NEXT_ID; }
};

int main() {
    std::cout << Student::getNextId() << '\n';
    std::cout << Student::getNextId() << '\n';
}
```
:::end

A Java statikus inicializáló blokkját nem hívhatjuk meg közvetlenül, mert azt a futtatókörnyezet az osztály inicializálásakor automatikusan végrehajtja. Ez az inicializálás nem minden példány létrehozásakor történik meg, így a példában a kiírt üzenet is csak egyszer jelenik meg. C#-ban ugyanehhez hasonló feladatot lát el a paraméter nélküli **statikus konstruktor**, míg C++-ban és Pythonban más nyelvi eszközökkel biztosíthatjuk az osztályhoz tartozó adatok kezdőértékét. Ezeknél a nyelveknél a végrehajtás pontos időzítése eltérhet a Java megoldásától.

## Felhasználási területek {#applications}

### Automatikusan növekvő azonosítók {#automatic-ids}

Gyakori feladat, hogy az új példányoknak automatikusan egyedi azonosítót szeretnénk kiosztani. Ehhez készíthetünk egy `NEXT_ID` nevű osztályszintű mezőt, amely kezdetben az `1` értéket tárolja. Valahányszor létrehozunk egy új hallgatót, a konstruktor ebből a közös mezőből kiolvassa a következő azonosítót, eltárolja a példány saját `id` mezőjében, majd megnöveli a közös értéket. Így minden hallgató külön azonosítót kap, miközben a következő kiosztható értéket csak egyetlen helyen tároljuk.

:::lang java
```java
class Student {
    private static int NEXT_ID = 1;
    private final int id;
    private final String name;

    public Student(String name) {
        this.name = name;
        this.id = NEXT_ID;
        NEXT_ID++;
    }

    public int getId() { return id; }
}

class Main {
    public static void main(String[] args) {
        Student first = new Student("Anna");
        Student second = new Student("Bela");
        System.out.println(first.getId());  // 1
        System.out.println(second.getId()); // 2
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Student
{
    private static int NEXT_ID = 1;
    public int Id { get; }
    public string Name { get; }

    public Student(string name)
    {
        Name = name;
        Id = NEXT_ID;
        NEXT_ID++;
    }
}

class Program
{
    static void Main(string[] args)
    {
        Student first = new Student("Anna");
        Student second = new Student("Bela");
        Console.WriteLine(first.Id);  // 1
        Console.WriteLine(second.Id); // 2
    }
}
```
:::end

:::lang python
```python
class Student:
    NEXT_ID = 1

    def __init__(self, name):
        self.name = name
        self.id = Student.NEXT_ID
        Student.NEXT_ID += 1

first = Student("Anna")
second = Student("Bela")
print(first.id)   # 1
print(second.id)  # 2
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>

class Student {
    inline static int NEXT_ID = 1;
    const int id;
    std::string name;
public:
    explicit Student(const std::string& name)
        : id(NEXT_ID++), name(name) {}

    int getId() const { return id; }
};

int main() {
    Student first("Anna");
    Student second("Bela");
    std::cout << first.getId() << '\n';   // 1
    std::cout << second.getId() << '\n';  // 2
}
```
:::end

Az azonosítókat kiosztó mező értéke nem azonos a jelenleg létező objektumok számával. Ha például egy korábbi példány már nem érhető el, attól a következő azonosító nem csökkenhet, hiszen különben könnyen ugyanazt az értéket oszthatnánk ki ismét. Fontos tehát különbséget tenni a **következő azonosító** és a **létrehozott példányok száma** között, még akkor is, ha egy egyszerű program elején a két érték szorosan összefügg.

### Object factory {#object-factory}

Az eddigiekben a példányokat közvetlenül a `new` kulcsszóval hoztuk létre, miután meghívtuk a megfelelő konstruktort. Előfordulhat azonban, hogy a példányosítást valamilyen feltételhez szeretnénk kötni, vagy ellenőrizni szeretnénk, hogy létrejöhet-e még új objektum az adott osztályból. Ilyenkor a konstruktort `private` láthatóságúvá tehetjük, és készíthetünk egy publikus osztályszintű metódust, amely elvégzi az ellenőrzéseket, majd szükség esetén létrehozza az új példányt. Ezt a megoldást **object factory**, vagyis objektumgyár néven ismerjük.

A következő példában legfeljebb három hallgatót hozhatunk létre az alkalmazás egy futása alatt. A `create` metódus nyilvántartja, hány hallgató készült eddig, és ha elértük a korlátot, új példány helyett `null` értékkel tér vissza. Mivel a konstruktor privát, a főprogram nem kerülheti meg a korlátozást egy közvetlen konstruktorhívással. A példányt kérő programrésznek természetesen ellenőriznie kell, hogy valóban sikerült-e az objektum létrehozása.

:::lang java
```java
class Student {
    private static final int MAX_STUDENTS = 3;
    private static int CREATED_COUNT = 0;
    private final String name;

    private Student(String name) {
        this.name = name;
    }

    public static Student create(String name) {
        if (name == null || name.isBlank())
            throw new IllegalArgumentException("Invalid name.");
        if (CREATED_COUNT >= MAX_STUDENTS)
            return null;

        Student student = new Student(name);
        CREATED_COUNT++;
        return student;
    }
}

class Main {
    public static void main(String[] args) {
        Student first = Student.create("Anna");
        Student second = Student.create("Bela");
        Student third = Student.create("Cecilia");
        Student fourth = Student.create("David"); // null
    }
}
```
:::end

:::lang csharp
```csharp
#nullable enable
using System;
class Student
{
    private const int MAX_STUDENTS = 3;
    private static int CREATED_COUNT = 0;
    private readonly string name;

    private Student(string name) { this.name = name; }

    public static Student? Create(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Invalid name.");
        if (CREATED_COUNT >= MAX_STUDENTS)
            return null;

        Student student = new Student(name);
        CREATED_COUNT++;
        return student;
    }
}

class Program
{
    static void Main(string[] args)
    {
        Student? first = Student.Create("Anna");
        Student? second = Student.Create("Bela");
        Student? third = Student.Create("Cecilia");
        Student? fourth = Student.Create("David"); // null
    }
}
```
:::end

:::lang python
```python
class Student:
    MAX_STUDENTS = 3
    CREATED_COUNT = 0

    def __init__(self, name):
        self.name = name

    @classmethod
    def create(cls, name):
        if not name or not name.strip():
            raise ValueError("Invalid name.")
        if cls.CREATED_COUNT >= cls.MAX_STUDENTS:
            return None

        student = cls(name)
        cls.CREATED_COUNT += 1
        return student

first = Student.create("Anna")
second = Student.create("Bela")
third = Student.create("Cecilia")
fourth = Student.create("David")  # None
```
:::end

:::lang cpp
```cpp
#include <memory>
#include <stdexcept>
#include <string>

class Student {
    inline static constexpr int MAX_STUDENTS = 3;
    inline static int CREATED_COUNT = 0;
    std::string name;

    explicit Student(const std::string& name) : name(name) {}
public:
    static std::unique_ptr<Student> create(const std::string& name) {
        if (name.empty())
            throw std::invalid_argument("Invalid name.");
        if (CREATED_COUNT >= MAX_STUDENTS)
            return nullptr;

        std::unique_ptr<Student> student(new Student(name));
        CREATED_COUNT++;
        return student;
    }
};

int main() {
    auto first = Student::create("Anna");
    auto second = Student::create("Bela");
    auto third = Student::create("Cecilia");
    auto fourth = Student::create("David"); // nullptr
}
```
:::end

Az objektumgyár nem feltétlenül csak a példányok számát korlátozhatja: eldöntheti azt is, hogy a megadott adatok alapján milyen példányt hozzon létre. A konstruktorban és a setterekben megismert validáció továbbra is fontos, mert a létrehozott objektum nem kerülhet érvénytelen állapotba. Pythonban a privát konstruktor Java-ban megszokott korlátozása nyelvi szinten nem valósítható meg ugyanígy, ezért ott az osztályszintű `create` metódus használata elsősorban megállapodás kérdése.

### Singleton {#singleton}

Az object factory segítségével már szabályozni tudjuk, hogy hány példány jöhessen létre egy osztályból. Ennek speciális esete, amikor azt szeretnénk biztosítani, hogy **az osztálynak összesen egyetlen példánya legyen**. Erre lehet szükség például egy alkalmazás közös beállításainak kezelésénél, ha azokat egyetlen objektumban szeretnénk tárolni, és minden programrész ugyanazt az objektumot használja. Ezt a megoldást **Singleton** tervezési mintának nevezzük.

Java-ban az egyik legegyszerűbb megvalósítás az, hogy a konstruktort priváttá tesszük, az egyetlen példányt egy osztályszintű mezőben előre létrehozzuk, majd egy publikus osztályszintű metódussal biztosítjuk annak elérését. Ha többször hívjuk meg a `getInstance()` metódust, mindig ugyanahhoz az objektumhoz jutunk. C#-ban, Pythonban és C++-ban is megvalósítható hasonló működés, bár az egyes nyelvek eltérő eszközöket biztosítanak hozzá.

:::lang java
```java
class Settings {
    private static final Settings INSTANCE = new Settings();
    private String language = "en";

    private Settings() {}

    public static Settings getInstance() {
        return INSTANCE;
    }

    public String getLanguage() { return language; }
    public void setLanguage(String value) { language = value; }
}

class Main {
    public static void main(String[] args) {
        Settings first = Settings.getInstance();
        Settings second = Settings.getInstance();
        first.setLanguage("hu");
        System.out.println(second.getLanguage()); // hu
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Settings
{
    public static Settings Instance { get; } = new Settings();
    public string Language { get; set; } = "en";

    private Settings() {}
}

class Program
{
    static void Main(string[] args)
    {
        Settings first = Settings.Instance;
        Settings second = Settings.Instance;
        first.Language = "hu";
        Console.WriteLine(second.Language); // hu
    }
}
```
:::end

:::lang python
```python
class Settings:
    _instance = None

    def __init__(self):
        self.language = "en"

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

first = Settings.get_instance()
second = Settings.get_instance()
first.language = "hu"
print(second.language)  # hu
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>

class Settings {
    std::string language = "en";
    Settings() = default;
public:
    Settings(const Settings&) = delete;
    Settings& operator=(const Settings&) = delete;

    static Settings& getInstance() {
        static Settings instance;
        return instance;
    }

    void setLanguage(const std::string& value) { language = value; }
    const std::string& getLanguage() const { return language; }
};

int main() {
    Settings& first = Settings::getInstance();
    Settings& second = Settings::getInstance();
    first.setLanguage("hu");
    std::cout << second.getLanguage() << '\n'; // hu
}
```
:::end

Fontos, hogy a Singleton nem egyszerűen egy statikus mező használatát jelenti, hanem azt, hogy az osztályhoz tartozó egyetlen példány létrehozását és elérését is szabályozzuk. A bemutatott Java- és C#-megoldás megakadályozza, hogy a főprogram közvetlenül új példányt készítsen, a C++-példa pedig a másolás lehetőségét is letiltja. Pythonban nincs a Java `private` konstruktorához teljesen hasonló védelem, ezért az ottani példa a közös példány használatát mutatja be, de a közvetlen példányosítást nem akadályozza meg.

## Feladatok {#exercises}

Az előző fejezetekben elkészített öt osztályt most osztályszintű mezőkkel és metódusokkal egészítjük ki. Az új megoldásokban ügyeljünk arra, hogy a közös adatokat ne tároljuk el külön minden példányban, és a korábban megvalósított adatrejtés is megmaradjon. A feladatok az egyszerű példányszámlálástól az objektumgyáron át egy olyan osztály elkészítéséig vezetnek, amelyből csak egyetlen példányt szeretnénk használni.

:::exercise
### Téglalapok

![A Téglalap osztály kiegészítése](content/chapters/05-osztalyszintu-elemek/media/task-rectangle-hu.svg){width=400}

Az előző fejezet `Rectangle` osztályát egészítse ki egy privát, osztályszintű mezővel, melyben nyilvántartjuk, hogy a program futása során összesen hány téglalapot hoztunk létre! A mező kezdetben `0` értékű legyen, és minden új példány létrehozásakor növeljük meg eggyel. Ügyeljen arra, hogy ha az egyik konstruktor meghívja a másikat, akkor a számlálót csak egyszer növeljük meg! A létrehozott példányok száma egy publikus osztályszintű metódussal legyen lekérdezhető.

A főprogramban hozzon létre különböző konstruktorokkal legalább öt téglalapot, és minden példányosítás után jelenítse meg a számláló értékét! Ellenőrizze azt is, hogy a területet és kerületet számító metódusok továbbra is az adott példány adataival dolgoznak, nem pedig az osztály valamely közös értékével!
:::endexercise

:::exercise
### Könyvek

![A Könyv osztály kiegészítése](content/chapters/05-osztalyszintu-elemek/media/task-book-hu.svg){width=410}

A `Book` osztályban jelenítse meg osztályszintű konstansként a könyvek megengedett minimális és maximális árát, azaz az `500` és `50 000` forintos határokat! Készítsen publikus osztályszintű metódust, amely paraméterben vár egy egész árat, majd logikai értékkel visszatérve megállapítja, hogy az megfelel-e ezeknek a feltételeknek. A már megírt validáció során is ezt a metódust használja, hogy az ellenőrzés feltételeit ne kelljen több helyen megismételni! A leárazásnál változatlanul ügyeljen a `899` forintos alsó korlátra.

A főprogramban példányosítás nélkül is hívja meg az árat ellenőrző osztályszintű metódust több különböző értékkel! Ezután hozzon létre könyveket, végezzen rajtuk leárazást, és ellenőrizze, hogy a konstansok használata mellett is változatlanul működik az adatrejtés és a korábban megvalósított validáció!
:::endexercise

:::exercise
### Autók

![Az Autó osztály kiegészítése](content/chapters/05-osztalyszintu-elemek/media/task-car-hu.svg){width=420}

A `Car` osztály minden példánya rendelkezzen egy automatikusan kiosztott, egyedi, egész szám típusú azonosítóval! Az első autó azonosítója legyen `1`, a következőé `2`, és minden új példány kapja meg a soron következő értéket. Ehhez tároljon osztályszintű mezőben egy közös számlálót, amelyet a példányok a konstruktorukban használnak fel! A kiosztott azonosítót a főprogram csak lekérdezhesse, módosítani ne lehessen.

Az osztályban továbbra is működjön a `drive` metódus, valamint a kilométeróra állásának ellenőrzése! Hozzon létre legalább öt autót a korábban elkészített konstruktorokkal, majd jelenítse meg az egyes autók adatait az új azonosítóval együtt! Külön figyeljen arra, hogy a konstruktorok közötti hívás ne eredményezhesse azonosítók kihagyását!
:::endexercise

:::exercise
### Bankszámlák

![A Bankszámla osztály kiegészítése](content/chapters/05-osztalyszintu-elemek/media/task-bank-hu.svg){width=430}

A `BankAccount` osztályban korlátozzuk az új bankszámlák létrehozását úgy, hogy a program futása során legfeljebb `3` számla nyitható! Ehhez készítsen privát osztályszintű számlálót, és tegye priváttá az osztály korábban megírt konstruktorait! Az új számlák létrehozását egy publikus osztályszintű `create` metódus biztosítsa, amely átveszi a tulajdonos nevét, a számlaszámot és a kezdőegyenleget. A metódus érvényes adatok esetén készítse el és adja vissza a bankszámlát, a megengedett mennyiség elérése után pedig térjen vissza `null` értékkel!

A számlaszám, a tulajdonos és az egyenleg ellenőrzése továbbra is történjen meg, az egyenleg módosítása pedig csak a korábban elkészített befizetési és pénzfelvételi metódusokon keresztül legyen lehetséges. A főprogramban kíséreljen meg `4` számlát létrehozni, és ellenőrizze, hogy az utolsó esetben már nem kap példányt! A sikeresen létrehozott számlákon hajtson végre néhány befizetést és pénzfelvételt is!
:::endexercise

:::exercise
### Filmek

![A Filmtár és a Film kapcsolata](content/chapters/05-osztalyszintu-elemek/media/task-movie-hu.svg){width=500}

A korábban megírt `Movie` osztályt most nem kell alapjaiban módosítania. Készítsen mellé egy `MovieLibrary` osztályt, amely az alkalmazásban nyilvántartott filmek közös gyűjteményét kezeli! A `MovieLibrary` osztályból csak egyetlen példányt szeretnénk használni, ezért a konstruktora legyen privát, és egy osztályszintű `getInstance` metódus mindig ugyanazt a példányt adja vissza. A gyűjtemény az osztály példányszintű mezője legyen, hiszen a Singleton is valódi objektum, saját állapottal.

A filmtárhoz lehessen új filmet hozzáadni, és legyen lekérdezhető a tárolt filmek száma! A főprogramban két különböző változón keresztül kérje le a filmtárat, majd az egyiken keresztül adjon hozzá két filmet! A másik változón keresztül kérdezze le a filmek számát, és ellenőrizze, hogy valóban ugyanazzal a filmtárral dolgozott!
:::endexercise
