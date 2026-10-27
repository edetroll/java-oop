# Kötés – korai és késői kötés

## A kötés fogalma {#binding}

Az eddigi példáinkban, amikor meghívtunk egy metódust, általában egyértelmű volt, hogy a program melyik metódus törzsét fogja végrehajtani. Az öröklődés megismerése után azonban már könnyen előfordulhat, hogy az ősosztályban és a leszármazott osztályban is találunk azonos nevű metódust, ezért nem elegendő csupán a hívás nevére figyelnünk. A programnak minden metódushíváshoz hozzá kell rendelnie azt a konkrét metódust, amelynek az utasításait végre fogja hajtani. Ezt a hozzárendelést nevezzük **kötésnek** (*binding*).

A kötés történhet már a program fordítása során, ezt **korai kötésnek** nevezzük, de bizonyos metódusok esetén csak futási időben dől el, melyik megvalósítást használjuk. Utóbbit **késői kötésnek** nevezzük. A két megoldás közötti különbség különösen akkor válik fontossá, amikor egy ősosztály típusú referencián keresztül valójában valamelyik leszármazott osztály példányával dolgozunk. Korábban már láttuk, hogy a referencia deklarált típusa és a mögötte található objektum tényleges típusa eltérhet; most ennek a metódushívásokra gyakorolt hatását vizsgáljuk meg.

## Metódusok felülírása {#overriding}

Tegyük fel, hogy elkészítettünk egy `Person` osztályt, amely a személyek adatait tárolja, és egy `getRole()` metódussal képes megadni, milyen szerepet tölt be a személy. A belőle származtatott `Student` és `Teacher` osztályok esetén ugyanennek a kérdésnek más lesz a válasza. Nem szeretnénk új néven létrehozni egy-egy metódust, mert a művelet jelentése mindhárom osztályban ugyanaz, csupán a működését kell az adott típushoz igazítanunk. Ilyenkor a leszármazott osztályban **felülírjuk** az ősosztály metódusát, azaz ugyanazzal a metódusnévvel és megfelelő paraméterlistával új törzset adunk meg.

Java-ban a felülírt metódus elé érdemes kiírni az `@Override` annotációt. Ennek segítségével a fordító ellenőrizni tudja, hogy valóban létezik-e a megfelelő, felülírható metódus az ősosztályban, így egy elírásból származó hibát hamarabb észrevehetünk. A felülírás során nem szűkíthetjük az örökölt metódus láthatóságát, és a visszatérési típusra is meghatározott kompatibilitási szabályok érvényesek. A példában mindhárom metódus `String` típusú értékkel tér vissza, ezért ezekkel a részletekkel most nem kell külön foglalkoznunk.

:::lang java
```java
class Person {
    public String getRole() {
        return "person";
    }
}

class Student extends Person {
    @Override
    public String getRole() {
        return "student";
    }
}

class Teacher extends Person {
    @Override
    public String getRole() {
        return "teacher";
    }
}
```
:::end

:::lang csharp
```csharp
class Person {
    public virtual string GetRole() {
        return "person";
    }
}

class Student : Person {
    public override string GetRole() {
        return "student";
    }
}

class Teacher : Person {
    public override string GetRole() {
        return "teacher";
    }
}
```
:::end

:::lang python
```python
class Person:
    def get_role(self):
        return "person"

class Student(Person):
    def get_role(self):
        return "student"

class Teacher(Person):
    def get_role(self):
        return "teacher"
```
:::end

:::lang cpp
```cpp
#include <string>

class Person {
public:
    virtual std::string getRole() const {
        return "person";
    }
};

class Student : public Person {
public:
    std::string getRole() const override {
        return "student";
    }
};

class Teacher : public Person {
public:
    std::string getRole() const override {
        return "teacher";
    }
};
```
:::end

![A Person, Student és Teacher osztályokban megvalósított getRole metódus](content/chapters/07-kotes/media/roles-hu.svg){width=590}

Fontos, hogy a metódus felülírását ne keverjük össze a **túlterheléssel** (*overloading*). Amennyiben egy osztályban vagy egy öröklődési hierarchiában azonos névvel, de eltérő paraméterlistával készítünk metódusokat, akkor több, egymástól különböző metódust hozunk létre. A `register()` és a `register(String course)` például nem ugyanannak a metódusnak két felülírt változata, mert a paraméterlistájuk különbözik. Ilyenkor a fordító a megadott argumentumok és azok típusai alapján választja ki a meghívandó metódust. Önmagában a visszatérési típus megváltoztatása Java-ban nem elegendő a túlterheléshez.

:::lang java
```java
class Student extends Person {
    public void register() {
        System.out.println("Registration started");
    }

    public void register(String course) {
        System.out.println("Registered for " + course);
    }
}

class Main {
    public static void main(String[] args) {
        Student student = new Student();
        student.register();
        student.register("OOP");
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Person { }
class Student : Person {
    public void Register() {
        Console.WriteLine("Registration started");
    }
    public void Register(string course) {
        Console.WriteLine("Registered for " + course);
    }
}
class Program {
    static void Main() {
        Student student = new Student();
        student.Register();
        student.Register("OOP");
    }
}
```
:::end

:::lang python
```python
class Student(Person):
    # Python does not overload methods by parameter list.
    def register(self, course=None):
        if course is None:
            print("Registration started")
        else:
            print("Registered for " + course)

student = Student()
student.register()
student.register("OOP")
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>
class Person { };
class Student : public Person {
public:
    void registerCourse() const {
        std::cout << "Registration started\n";
    }
    void registerCourse(const std::string& course) const {
        std::cout << "Registered for " << course << '\n';
    }
};

int main() {
    Student student;
    student.registerCourse();
    student.registerCourse("OOP");
}
```
:::end

## Késői kötés {#late-binding}

A késői kötés megértéséhez egészítsük ki a `Person` osztályunkat egy `introduce()` metódussal, amely a személy nevét és szerepét jeleníti meg. A megvalósítás során a már ismert `getRole()` metódust hívjuk meg, tehát az `introduce()` törzsét elegendő egyszer megírnunk az ősosztályban. A `Student` és `Teacher` osztályok ezt változtatás nélkül öröklik, miközben a `getRole()` metódusukat saját működéssel látják el. A kérdés az, hogy az ősosztályból örökölt `introduce()` melyik `getRole()` metódust használja, amikor egy hallgató vagy egy oktató példányán hívjuk meg.

Java-ban a felülírható példányszintű metódusokra **késői kötés** érvényes. Ez azt jelenti, hogy a program futása során, az objektum tényleges típusának ismeretében választódik ki a végrehajtandó metódustörzs. Hiába a `Person` osztályban írtuk meg az `introduce()` metódust, a belőle indított `getRole()` hívás egy `Student` példánynál a `Student.getRole()` metódust, egy `Teacher` példánynál pedig a `Teacher.getRole()` metódust fogja végrehajtani. A késői kötés segítségével tehát az ősosztályban megírt algoritmus a leszármazott osztályokban megvalósított működéssel is helyesen használható.

:::lang java
```java
class Person {
    private String name;

    public void setName(String value) { name = value; }
    public String getName() { return name; }

    public String getRole() { return "person"; }

    public void introduce() {
        System.out.println(name + " is a " + getRole());
    }
}

class Student extends Person {
    @Override
    public String getRole() { return "student"; }
}

class Teacher extends Person {
    @Override
    public String getRole() { return "teacher"; }
}

class Main {
    public static void main(String[] args) {
        Person[] people = {new Student(), new Teacher()};
        people[0].setName("Anna");
        people[1].setName("Peter");

        for (Person person : people) {
            person.introduce();
        }
        // Anna is a student
        // Peter is a teacher
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Person {
    private string name;
    public void SetName(string value) { name = value; }
    public virtual string GetRole() { return "person"; }
    public void Introduce() {
        Console.WriteLine(name + " is a " + GetRole());
    }
}
class Student : Person {
    public override string GetRole() { return "student"; }
}
class Teacher : Person {
    public override string GetRole() { return "teacher"; }
}
class Program {
    static void Main() {
        Person[] people = {new Student(), new Teacher()};
        people[0].SetName("Anna");
        people[1].SetName("Peter");
        foreach (Person person in people)
            person.Introduce();
    }
}
```
:::end

:::lang python
```python
class Person:
    def set_name(self, value):
        self._name = value

    def get_role(self):
        return "person"

    def introduce(self):
        print(self._name + " is a " + self.get_role())

class Student(Person):
    def get_role(self):
        return "student"

class Teacher(Person):
    def get_role(self):
        return "teacher"

people = [Student(), Teacher()]
people[0].set_name("Anna")
people[1].set_name("Peter")
for person in people:
    person.introduce()
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>

class Person {
    std::string name;
public:
    void setName(const std::string& value) { name = value; }
    virtual std::string getRole() const { return "person"; }
    void introduce() const {
        std::cout << name << " is a " << getRole() << '\n';
    }
};
class Student : public Person {
public:
    std::string getRole() const override { return "student"; }
};
class Teacher : public Person {
public:
    std::string getRole() const override { return "teacher"; }
};

int main() {
    Student student;
    Teacher teacher;
    student.setName("Anna");
    teacher.setName("Peter");
    Person* people[] = {&student, &teacher};
    for (Person* person : people)
        person->introduce();
}
```
:::end

![Az introduce és getRole metódusok hívási kapcsolata](content/chapters/07-kotes/media/dispatch-hu.svg){width=620}

A példában az is jól látható, hogy a `Person` típusú tömbben különböző leszármazott osztályok példányaira mutató referenciákat tárolunk. A `person` változó deklarált típusa a ciklusban mindig `Person`, az objektum tényleges típusa azonban lehet `Student` vagy `Teacher`. A fordító a deklarált típus alapján ellenőrzi, hogy a `person.introduce()` hívás egyáltalán megengedett-e, a `getRole()` megfelelő felülírt változata viszont futási időben választódik ki. Ezt a működést később a **többalakúság** egyik legfontosabb eszközeként fogjuk használni: különböző típusú objektumokat tudunk ugyanazzal az algoritmussal kezelni anélkül, hogy minden típushoz külön feltételeket írnánk.

## Az ősosztály metódusának felhasználása {#super-call}

Felülíráskor nem feltétlenül szeretnénk eldobni az ősosztályban korábban megírt algoritmust. Gyakori eset, hogy az eredeti működés jó alapot biztosít, és a leszármazott osztályban csupán ki kell egészítenünk néhány további utasítással. Tegyük fel, hogy a `Person` osztály `getDescription()` metódusa visszatér a személy nevével, a `Student` osztályban pedig a Neptun-kódot is szeretnénk megjeleníteni. A név lekérdezését nem szükséges ismét megírnunk, mert Java-ban a `super` kulcsszó segítségével meghívhatjuk az ősosztály metódusát, és annak eredményét kiegészíthetjük.

A `super.getDescription()` kifejezés tehát kifejezetten az ősosztály megvalósítását hívja meg, míg a `getDescription()` vagy `this.getDescription()` a megszokott, késői kötésű hívás lehet. Fontos, hogy ezt a két kifejezést ne keverjük össze, mert ha a felülírt metóduson belül ismét saját magát hívnánk meg, az könnyen végtelen rekurzióhoz vezethetne. C# nyelvben erre a célra a `base`, C++-ban az ősosztály neve és a `::` operátor, Pythonban pedig a `super()` használható.

:::lang java
```java
class Person {
    private String name;
    public void setName(String value) { name = value; }
    public String getDescription() { return name; }
}

class Student extends Person {
    private String studentId;
    public void setStudentId(String value) { studentId = value; }

    @Override
    public String getDescription() {
        return super.getDescription() + " (" + studentId + ")";
    }
}
```
:::end

:::lang csharp
```csharp
class Person {
    private string name;
    public void SetName(string value) { name = value; }
    public virtual string GetDescription() { return name; }
}
class Student : Person {
    private string studentId;
    public void SetStudentId(string value) { studentId = value; }
    public override string GetDescription() {
        return base.GetDescription() + " (" + studentId + ")";
    }
}
```
:::end

:::lang python
```python
class Person:
    def set_name(self, value):
        self._name = value

    def get_description(self):
        return self._name

class Student(Person):
    def set_student_id(self, value):
        self._student_id = value

    def get_description(self):
        return super().get_description() + " (" + self._student_id + ")"
```
:::end

:::lang cpp
```cpp
#include <string>
class Person {
    std::string name;
public:
    void setName(const std::string& value) { name = value; }
    virtual std::string getDescription() const { return name; }
};
class Student : public Person {
    std::string studentId;
public:
    void setStudentId(const std::string& value) { studentId = value; }
    std::string getDescription() const override {
        return Person::getDescription() + " (" + studentId + ")";
    }
};
```
:::end

## Korai kötés {#early-binding}

A késői kötés nagyon hasznos, ugyanakkor nem minden metódushívásnál szükséges megvárni, hogy a program futása során derüljön ki a megfelelő megvalósítás. Amikor a híváshoz tartozó metódus már a fordítás során egyértelműen meghatározható, **korai kötésről** beszélünk. Ilyen eset például a Java osztályszintű metódusainak hívása, hiszen ezek nem valamelyik konkrét példányhoz, hanem magához az osztályhoz tartoznak. A `private` és a `final` metódusoknál sincs hagyományos felülírásra épülő késői kötés, bár ezek pontos szabályait majd más összefüggésben is látni fogjuk.

A következő példában a `Student` osztály ugyanazzal a névvel saját osztályszintű metódust deklarál, mint a `Person`. Java-ban ez nem felülírás, hanem az ősosztály metódusának **elfedése** (*method hiding*). A `Person.getCategory()` és a `Student.getCategory()` hívások közvetlenül megmutatják, hogy melyik osztály metódusát szeretnénk használni. Ugyanez az elv teszi indokolttá, hogy osztályszintű metódusokat mindig az osztály nevén keresztül hívjunk meg, és ne egy példány referenciájával.

:::lang java
```java
class Person {
    public static String getCategory() {
        return "person";
    }
}
class Student extends Person {
    public static String getCategory() {
        return "student";
    }
}
class Main {
    public static void main(String[] args) {
        System.out.println(Person.getCategory());  // person
        System.out.println(Student.getCategory()); // student
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Person {
    public static string GetCategory() { return "person"; }
}
class Student : Person {
    public new static string GetCategory() { return "student"; }
}
class Program {
    static void Main() {
        Console.WriteLine(Person.GetCategory());  // person
        Console.WriteLine(Student.GetCategory()); // student
    }
}
```
:::end

:::lang python
```python
class Person:
    @staticmethod
    def get_category():
        return "person"

class Student(Person):
    @staticmethod
    def get_category():
        return "student"

print(Person.get_category())   # person
print(Student.get_category())  # student
# Python resolves attributes dynamically; this is not Java-style static binding.
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>
class Person {
public:
    static std::string getCategory() { return "person"; }
};
class Student : public Person {
public:
    static std::string getCategory() { return "student"; }
};
int main() {
    std::cout << Person::getCategory() << '\n';  // person
    std::cout << Student::getCategory() << '\n'; // student
}
```
:::end

A különböző programozási nyelvek között ezen a ponton jelentős eltérések vannak. Java-ban a felülírható példányszintű metódusoknál alapértelmezett a késői kötés, C#-ban ehhez az ősosztályban `virtual`, a leszármazott osztályban `override` szükséges. C++-ban szintén a `virtual` kulcsszó teszi lehetővé a virtuális hívást, Pythonban pedig a metódusok keresése a nyelv dinamikus attribútumkezelésére épül. A Pythonban írt `@staticmethod` ezért nem teljesen ugyanúgy viselkedik, mint a Java statikus metódusa. A fenti kódok az adott nyelv természetes megoldását mutatják, nem minden részletükben azonos működést.

Nemcsak a metódusok, hanem a mezők neve is elfedhető az öröklődési hierarchiában, ám **a Java példányszintű mezőinek elérése nem késői kötésű**. Ha a leszármazott osztály azonos nevű mezőt deklarál, akkor az ős mezője továbbra is létezik, de a hivatkozás feloldását a deklarált típus és az elérhetőségi szabályok határozzák meg. Emiatt ugyanazt a mezőnevet az ős- és a leszármazott osztályban általában érdemes elkerülni, mert a különbség nehezen követhető programokhoz vezethet. A késői kötés előnyeit ezért elsősorban a felülírt metódusokon keresztül használjuk ki.

## A késői kötés használata {#applications}

A korábbi fejezetben megtanultuk, hogy különböző leszármazott osztályok példányait egy közös ősosztály típusú tömbben is tárolhatjuk, és a konkrét típusukat szükség esetén ellenőrizhetjük. A késői kötés segítségével azonban sok esetben nincs is szükség típusonként külön elágazásra. Elég, ha minden leszármazott ugyanazt a műveletet biztosítja, és azt a saját feladatának megfelelően valósítja meg. Így például egy `Person` tömb bejárásakor minden elemre meghívhatjuk az `introduce()` metódust, miközben az eredmény a ténylegesen tárolt példány típusától függ.

A késői kötést nemcsak a saját metódusainknál használhatjuk ki, hanem a Java minden osztályának közös ősétől, az `Object` osztálytól örökölt metódusoknál is. Ezekkel már korábban is találkoztunk, most azonban azt is megvizsgáljuk, miért érdemes felülírnunk őket, és hogyan alkalmazhatók az objektumok szöveges megjelenítésére, összehasonlítására és gyűjteményekben történő keresésére.

## Az Object osztálytól örökölt metódusok {#object-methods}

Korábban már láttuk, hogy Java-ban minden osztályunk őse az `Object` osztály, még akkor is, ha ezt külön nem írjuk ki az osztály deklarációjában. Így minden példányunk rendelkezik az `Object` által biztosított metódusokkal, amelyek közül a `toString()`, az `equals()` és a `hashCode()` különösen gyakran használatos. Ezeket a metódusokat felülírhatjuk, hogy ne az általános, hanem a saját osztályunknak megfelelő működést kapjuk. A `toString()` felülírásával már korábban is foglalkoztunk, most az egyenlőségvizsgálattal és a hashkód előállításával is összekapcsoljuk.

A `toString()` feladata, hogy az objektumról szöveges reprezentációt adjon vissza. Amennyiben nem írjuk felül, az `Object` alapértelmezett megvalósítása az osztály nevét és egy hexadecimális számból álló azonosító jellegű részletet ad vissza, ami általában nem megfelelő az adatok emberi olvasására. Célszerű ezért az osztály fontosabb mezőiből összeállítani a visszaadott szöveget. Amikor egy objektumot a `System.out.println()` metódussal jelenítünk meg, a Java szükség esetén automatikusan meghívja annak `toString()` metódusát, és a tényleges objektumtípusnak megfelelő felülírt változat fut le.

:::lang java
```java
class Course {
    private String code;
    private String title;

    public Course(String code, String title) {
        this.code = code;
        this.title = title;
    }

    @Override
    public String toString() {
        return code + ": " + title;
    }
}

class Main {
    public static void main(String[] args) {
        Course course = new Course("OOP101", "Object-oriented programming");
        System.out.println(course);
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Course {
    private string code, title;
    public Course(string code, string title) {
        this.code = code;
        this.title = title;
    }
    public override string ToString() {
        return code + ": " + title;
    }
}
class Program {
    static void Main() {
        Course course = new Course("OOP101", "Object-oriented programming");
        Console.WriteLine(course);
    }
}
```
:::end

:::lang python
```python
class Course:
    def __init__(self, code, title):
        self.code = code
        self.title = title

    def __str__(self):
        return self.code + ": " + self.title

course = Course("OOP101", "Object-oriented programming")
print(course)
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>
class Course {
    std::string code, title;
public:
    Course(std::string code, std::string title)
        : code(code), title(title) { }
    std::string toString() const {
        return code + ": " + title;
    }
};
int main() {
    Course course("OOP101", "Object-oriented programming");
    std::cout << course.toString() << '\n';
}
```
:::end

Az `equals(Object obj)` metódus segítségével azt vizsgáljuk meg, hogy két objektumot egyenlőnek tekintünk-e. Az `Object` osztályból örökölt megvalósítás alapértelmezés szerint a referenciák azonosságát ellenőrzi, vagyis csak akkor tér vissza igaz értékkel, ha a két referencia ugyanarra a példányra mutat. Gyakran azonban azt szeretnénk, hogy két különböző példányt is egyenlőnek tekintsünk, ha valamely lényeges adatuk megegyezik. A `Course` osztály esetén például dönthetünk úgy, hogy két kurzus azonos, ha a kurzuskódjuk megegyezik, függetlenül attól, hogy két külön példányban tároltuk-e őket.

Az `equals()` metódus felülírásánál ügyelnünk kell arra, hogy az összehasonlítás saját magunkkal mindig igaz legyen, az eredmény ne függjön az összehasonlítás irányától, valamint három objektum esetén is következetes maradjon. A metódus `null` értékre hamisat adjon vissza, és az eredménye ne változzon, amíg az összehasonlítás alapjául szolgáló adatok nem változnak. A példánkban a kurzuskódot a konstruktorban állítjuk be, később nem módosítjuk, így az egyenlőség alapja állandó marad.

Az `Object` egy másik fontos metódusa a `hashCode()`, amely egy egész számot állít elő az objektumhoz. A hashkódot elsősorban bizonyos gyűjtemények használják arra, hogy gyorsan megtalálják az adatokat. Nagyon fontos szabály, hogy **ha két objektumot az `equals()` szerint egyenlőnek tekintünk, akkor a `hashCode()` metódusuknak is ugyanazt az értéket kell visszaadnia**. A fordított állítás viszont nem igaz: két különböző objektum hashkódja véletlenül megegyezhet. Emiatt az `equals()` felülírásakor általában a `hashCode()` metódust is felülírjuk, és mindkettőben ugyanazokat az adatokat vesszük alapul.

:::lang java
```java
import java.util.ArrayList;
import java.util.HashSet;

class Course {
    private final String code;
    private String title;

    public Course(String code, String title) {
        if (code == null || code.isEmpty())
            throw new IllegalArgumentException("Invalid course code");
        this.code = code;
        this.title = title;
    }

    @Override
    public String toString() {
        return code + ": " + title;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Course other = (Course) obj;
        return code.equals(other.code);
    }

    @Override
    public int hashCode() {
        return code.hashCode();
    }
}

class Main {
    public static void main(String[] args) {
        Course first = new Course("OOP101", "OOP");
        Course second = new Course("OOP101", "Object-oriented programming");
        System.out.println(first.equals(second)); // true

        ArrayList<Course> list = new ArrayList<>();
        list.add(first);
        System.out.println(list.contains(second)); // true

        HashSet<Course> set = new HashSet<>();
        set.add(first);
        System.out.println(set.contains(second)); // true
    }
}
```
:::end

:::lang csharp
```csharp
using System;
using System.Collections.Generic;
class Course {
    private readonly string code;
    private string title;
    public Course(string code, string title) {
        if (string.IsNullOrEmpty(code))
            throw new ArgumentException("Invalid course code");
        this.code = code;
        this.title = title;
    }
    public override string ToString() { return code + ": " + title; }
    public override bool Equals(object obj) {
        Course other = obj as Course;
        return other != null && GetType() == other.GetType()
            && code == other.code;
    }
    public override int GetHashCode() { return code.GetHashCode(); }
}
class Program {
    static void Main() {
        Course first = new Course("OOP101", "OOP");
        Course second = new Course("OOP101", "Object-oriented programming");
        Console.WriteLine(first.Equals(second)); // True
        var list = new List<Course> { first };
        Console.WriteLine(list.Contains(second)); // True
        var set = new HashSet<Course> { first };
        Console.WriteLine(set.Contains(second)); // True
    }
}
```
:::end

:::lang python
```python
class Course:
    def __init__(self, code, title):
        if not code:
            raise ValueError("Invalid course code")
        self._code = code
        self.title = title

    def __str__(self):
        return self._code + ": " + self.title

    def __eq__(self, other):
        return type(self) is type(other) and self._code == other._code

    def __hash__(self):
        return hash(self._code)

first = Course("OOP101", "OOP")
second = Course("OOP101", "Object-oriented programming")
print(first == second)     # True
print(second in [first])   # True
print(second in {first})   # True
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>
#include <unordered_set>
#include <functional>
class Course {
    const std::string code;
    std::string title;
public:
    Course(std::string code, std::string title)
        : code(code), title(title) { }
    std::string toString() const { return code + ": " + title; }
    bool operator==(const Course& other) const { return code == other.code; }
    const std::string& getCode() const { return code; }
};
struct CourseHash {
    std::size_t operator()(const Course& course) const {
        return std::hash<std::string>{}(course.getCode());
    }
};
int main() {
    Course first("OOP101", "OOP");
    Course second("OOP101", "Object-oriented programming");
    std::cout << (first == second) << '\n';
    std::unordered_set<Course, CourseHash> courses;
    courses.insert(first);
    std::cout << (courses.find(second) != courses.end()) << '\n';
}
```
:::end

![Az Object osztály örökölt és felülírt metódusai](content/chapters/07-kotes/media/object-methods-hu.svg){width=510}

A korábban tanult konténer osztályokban gyakran meg kell vizsgálnunk, hogy egy adott objektum szerepel-e már a tárolt elemek között. A Java `ArrayList.contains()` metódusa az elemeket az `equals()` segítségével hasonlítja össze, míg a `HashSet.contains()` a `hashCode()` értékét is felhasználja a kereséshez, és az esetleges egyezést az `equals()` segítségével ellenőrzi. A fenti példában két különböző `Course` példányunk van, amelyeknek azonos a kurzuskódjuk, ezért a két konténer egyaránt megtalálja a keresett elemet. Amennyiben a `hashCode()` és az `equals()` működése nem lenne összhangban, a hashkódot használó gyűjtemények hibás eredményre juthatnának.

A Java metódusának pontos neve `hashCode()`, míg a hasonló szerepű C# metódust `GetHashCode()` néven találjuk meg. Pythonban a `__str__()`, `__eq__()` és `__hash__()` speciális metódusok, C++-ban pedig a szöveges megjelenítést és az egyenlőségvizsgálatot saját metódusokkal vagy operátorokkal valósíthatjuk meg. A megoldások szintaxisa eltérő, de az a követelmény mindenhol fontos, hogy az egyenlő objektumokhoz azonos hashkód tartozzon, ha a tároláshoz hash alapú konténert használunk.

## Feladatok {#exercises}

Az alábbi feladatokban a metódusok felülírásának célja nem újabb szövegek előállítása, hanem az objektumok típusától függő számítások és döntések megvalósítása. A meglévő osztályhierarchiákat a megadott metódusokkal egészítse ki; a módosított tagokat az UML-ábrák is tartalmazzák.

:::exercise
### Téglalapok

![Téglalapok – UML](content/chapters/07-kotes/media/complete-task-1-hu.svg){width=620}



**Követelmények**

- A `Shape` ősosztályban készítse el a `canFitInside(screenWidth : double, screenHeight : double) : boolean` metódust, mely azt vizsgálja, hogy egy alakzat elhelyezhető-e adott méretű, téglalap alakú kijelzőn.
- Az ősosztály megvalósítása – amíg nem ismeri az alakzat méreteit – `false` értékkel térjen vissza.
- A `Rectangle` ezt a metódust úgy írja felül, hogy a saját szélességét és magasságát hasonlítja a megadott méretekhez; a `Circle` akkor fér el, ha az átmérője mindkét irányban elegendően kicsi.
- Forgatással egyik osztályban sem számolunk.
- Nem pozitív kijelzőméret esetén `IllegalArgumentException` kivételt kell dobni.
- A `Shape` osztályban egy másik, nem felülírandó `isDisplayable(screenWidth : double, screenHeight : double) : boolean` metódus egyszerűen a `canFitInside()` eredményével térjen vissza.
- Ezen a metóduson keresztül mutassa be a késői kötést különböző alakzatokat tartalmazó `Shape` típusú listán!
:::endexercise

:::exercise
### Könyvek

![Könyvek – UML](content/chapters/07-kotes/media/complete-task-2-hu.svg){width=620}



**Követelmények**

- A `Publication` ősosztályhoz adja hozzá a `calculateLateFee(daysLate : int) : int` metódust, mely a kölcsönzési határidő túllépése esetén fizetendő díjat adja vissza.
- Az ősosztály alapértelmezetten `0` forinttal tér vissza, míg a `Book` minden késedelmes nap után `50`, a `Magazine` pedig `20` forintot számoljon fel.
- Negatív napok száma esetén kivételt kell dobni.
- Az ősosztály `calculateTotalLateFee(daysLate : int, copies : int) : int` metódusa számítsa ki a díjat több azonos példányra, vagyis szorozza meg a `calculateLateFee()` eredményét a pozitív `copies` paraméterrel.
- Nem pozitív példányszám esetén dobjon kivételt.
- Vizsgálja meg, hogyan használja a közös, örökölt metódus a leszármazottak felülírt díjszámítását!
:::endexercise

:::exercise
### Autók

![Autók – UML](content/chapters/07-kotes/media/complete-task-3-hu.svg){width=620}



**Követelmények**

- A `Vehicle` osztályhoz írjon `getServiceIntervalKm() : int` metódust, amely alapértelmezetten `0`-t ad vissza, ha nem ismerjük az ajánlott szervizperiódust.
- A `Car` osztályban ennek értéke `15000`, a `Motorcycle` esetében `6000` kilométer legyen.
- A `Vehicle` ősosztály `needsService(kmSinceService : int) : boolean` metódusa azt vizsgálja, hogy az utolsó szerviz óta megtett kilométerek száma elérte-e a tényleges járműtípus szervizperiódusát.
- Ha a periódus `0`, térjen vissza `false` értékkel; negatív kilométerszám esetén dobjon kivételt.
- Tároljon `Car` és `Motorcycle` példányokat közös `Vehicle` típusú listában, és állapítsa meg, mely járművek esedékesek szervizre.
- A kiválasztás során ne használjon járműtípusonként külön számítási elágazást.
:::endexercise

:::exercise
### Bankszámlák

![Bankszámlák – UML](content/chapters/07-kotes/media/complete-task-4-hu.svg){width=620}



**Követelmények**

- A `BankAccount` ősosztályban vezesse be a `calculateTransferFee(amount : int) : int` metódust, amely egy átutalás díját adja meg.
- Az ősosztály és a `SavingsAccount` esetében a díj `0` forint; a `BusinessAccount` osztályban az átutalás díja az összeg egészértékű `1` százaléka, de legalább `100` forint.
- Minden változat csak pozitív összeget fogadhat el.
- Az ősosztályhoz írjon `canAffordTransfer(amount : int) : boolean` metódust, amely eldönti, hogy az egyenlegből a teljes összeg és a megfelelő díj együttesen kifizethető-e.
- Ez a metódus ne változtassa meg az egyenleget.
- A számításhoz használja a felülírható `calculateTransferFee()` metódust, majd `BankAccount` típusú referenciákon ellenőrizze a különböző számlatípusok működését!
:::endexercise

:::exercise
### Filmek

![Filmek – UML](content/chapters/07-kotes/media/complete-task-5-hu.svg){width=620}



**Követelmények**

- A `MediaItem` osztályhoz készítsen `getViewingMinutes() : int` metódust, mely az adott tartalom teljes megtekintéséhez szükséges időt adja vissza; az ősosztály alapértelmezett értéke `0`.
- A `Movie` a tárolt `duration` értékkel térjen vissza.
- A `Series` osztályban a meglévő pozitív `seasons` mező mellett vezesse be az egy évadhoz tartozó epizódok számát (`episodesPerSeason : int`) és egy epizód átlagos hosszát (`minutesPerEpisode : int`), mindkettő pozitív egész szám.
- A sorozat teljes játékideje e három érték szorzata.
- Az ősosztály `canWatchWithin(maxMinutes : int) : boolean` metódusa akkor adjon `true` értéket, ha a játékidő pozitív, és nem hosszabb a megadott időkeretnél; nem pozitív időkeretre dobjon kivételt.
- Vegyes `MediaItem` listán vizsgálja meg, melyik tartalom fér bele például egy `180` perces szabadidőbe!
:::endexercise

