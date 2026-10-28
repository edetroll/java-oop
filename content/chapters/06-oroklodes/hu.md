# Öröklődés

## Az öröklődés elve {#inheritance-principle}

Amennyiben egy új osztályt szeretnénk készíteni, gyakran előfordul, hogy annak mezői és metódusai jelentős részben megegyeznek egy korábban már elkészített osztályéval. Ilyenkor nem célszerű a meglévő forráskódot átmásolni, hiszen ugyanazt a működést több helyen kellene karbantartanunk, és egy későbbi javítás során könnyen előfordulhatna, hogy valamelyik másolatot elfelejtjük módosítani. Az objektumorientált programozás **öröklődés** nevű alapelve lehetővé teszi, hogy egy meglévő osztályból egy új, speciálisabb osztályt származtassunk, és az új osztály felhasználhassa a korábban elkészített elemeket. A korábbi osztályt **ősosztálynak**, az újat **leszármazott osztálynak** nevezzük.

Tegyük fel, hogy az egyetem hallgatóiról és oktatóiról szeretnénk adatokat tárolni. Mindkét csoport tagjai személyek, így mindkettőnek van neve, és a nevük lekérdezését, illetve módosítását is ugyanúgy végezhetjük. Nem lenne szerencsés két külön osztályban egymástól függetlenül megírni a név tárolását és a hozzá tartozó metódusokat, ezért készítsünk egy közös `Person` ősosztályt, amelyből a `Student` és `Teacher` osztályokat származtatjuk. Java-ban az öröklődést az `extends` kulcsszóval jelöljük; a leszármazott osztályban csak azokat a mezőket és metódusokat kell újonnan megírnunk, amelyek a saját feladatához szükségesek.

Az öröklődés használatakor arra is figyelnünk kell, hogy a két osztály között valóban **„egy fajtája” (is-a)** kapcsolat legyen. A hallgató egyfajta személy, az elektromos autó egyfajta autó, tehát mindkét kapcsolat alkalmas az öröklődés bemutatására. Az öröklődést azonban nem azért alkalmazzuk, mert két osztály véletlenül tartalmaz néhány azonos nevű mezőt, hanem azért, mert az új osztály az ősosztály egy speciálisabb típusát reprezentálja. Egy autónak például lehet motorja, de ettől az autó nem lesz egyfajta motor.

:::lang java
```java
class Person {
    private String name;

    public String getName() { return name; }
    public void setName(String value) { name = value; }
}

class Student extends Person {
    private String studentId;

    public void setStudentId(String value) { studentId = value; }
    public String getStudentId() { return studentId; }
    public void enroll(String course) {
        System.out.println(getName() + " enrolled in " + course);
    }
}

class Teacher extends Person {
    public void teach(String course) {
        System.out.println(getName() + " teaches " + course);
    }
}

class Main {
    public static void main(String[] args) {
        Student student = new Student();
        student.setName("Anna");
        student.setStudentId("ABC123");
        student.enroll("OOP");
    }
}
```
:::end

:::lang csharp
```csharp
using System;

class Person {
    private string name;
    public string GetName() { return name; }
    public void SetName(string value) { name = value; }
}

class Student : Person {
    private string studentId;
    public void SetStudentId(string value) { studentId = value; }
    public string GetStudentId() { return studentId; }
    public void Enroll(string course) {
        Console.WriteLine(GetName() + " enrolled in " + course);
    }
}

class Teacher : Person {
    public void Teach(string course) {
        Console.WriteLine(GetName() + " teaches " + course);
    }
}

class Program {
    static void Main() {
        Student student = new Student();
        student.SetName("Anna");
        student.SetStudentId("ABC123");
        student.Enroll("OOP");
    }
}
```
:::end

:::lang python
```python
class Person:
    def set_name(self, value):
        self._name = value

    def get_name(self):
        return self._name

class Student(Person):
    def set_student_id(self, value):
        self._student_id = value

    def get_student_id(self):
        return self._student_id

    def enroll(self, course):
        print(self.get_name() + " enrolled in " + course)

class Teacher(Person):
    def teach(self, course):
        print(self.get_name() + " teaches " + course)

student = Student()
student.set_name("Anna")
student.set_student_id("ABC123")
student.enroll("OOP")
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
    std::string getName() const { return name; }
};

class Student : public Person {
    std::string studentId;
public:
    void setStudentId(const std::string& value) { studentId = value; }
    std::string getStudentId() const { return studentId; }
    void enroll(const std::string& course) const {
        std::cout << getName() << " enrolled in " << course << '\n';
    }
};

class Teacher : public Person {
public:
    void teach(const std::string& course) const {
        std::cout << getName() << " teaches " << course << '\n';
    }
};

int main() {
    Student student;
    student.setName("Anna");
    student.setStudentId("ABC123");
    student.enroll("OOP");
}
```
:::end

![A Person, Student és Teacher osztályok öröklődése](content/chapters/06-oroklodes/media/inheritance-hu.svg){width=640}

## Az örökölt elemek és hozzáférésük {#inherited-members}

A leszármazott osztály a korábban megismert mezők és metódusok mellett természetesen saját mezőket és metódusokat is deklarálhat. A példában a `Student` új `studentId` mezővel és `enroll()` metódussal rendelkezik, miközben a `Person` osztályból származó `getName()` és `setName()` metódusokat is használhatja. A konstruktorokra ez az egyszerű szabály nem érvényes, azokat ugyanis Java-ban nem örököljük. Az osztályszintű mezők és metódusok is elérhetők lehetnek a leszármazott osztályból, de az adott osztályhoz tartoznak, nem készül belőlük külön példányonkénti másolat.

Azt is külön kell választanunk, hogy az ősosztály valamely adata része-e a leszármazott példányának, illetve hogy a leszármazott osztály forráskódjából közvetlenül elérhetjük-e. A `public` metódusok a leszármazott osztályból és a főprogramból is használhatók, a `protected` mezők és metódusok pedig Java-ban azonos csomagon belül, illetve az öröklődési szabályok szerint a leszármazott osztályokból érhetők el. Az ősosztály `private` mezői továbbra is részei az objektum belső állapotának, de Java-ban nem öröklődő, közvetlenül elérhető tagok: a leszármazott kódjából csak az ősosztály megfelelő metódusain keresztül férhetünk hozzájuk. Így az adatrejtés akkor is megmarad, ha az osztályt továbbfejlesztjük.

A következő példában a `Student` közvetlenül felhasználhatja az örökölt `age` mezőt, a privát `name` mezőt azonban nem. A név lekérdezéséhez a publikus `getName()` metódust hívjuk meg, amelyet az ősosztályból már megkaptunk. Ezzel ugyanúgy megőrizhetjük a korábban kialakított hozzáférési szabályokat, mintha az objektummal közvetlenül a főprogramban dolgoznánk. Az ábrán az öröklődést folytonos vonal és az ősosztály felé mutató üres háromszög jelzi.

:::lang java
```java
class Person {
    private String name;
    protected int age;

    public String getName() { return name; }
    public void setName(String value) { name = value; }
}

class Student extends Person {
    public String describe() {
        // name is private: it cannot be accessed directly here.
        return getName() + " (" + age + ")";
    }
}
```
:::end

:::lang csharp
```csharp
class Person {
    private string name;
    protected int age;
    public string GetName() { return name; }
    public void SetName(string value) { name = value; }
}

class Student : Person {
    public string Describe() {
        // name is private: use the inherited getter.
        return GetName() + " (" + age + ")";
    }
}
```
:::end

:::lang python
```python
class Person:
    def set_name(self, value):
        self.__name = value

    def get_name(self):
        return self.__name

class Student(Person):
    def describe(self):
        # _age is a naming convention, not protected access control.
        return self.get_name() + " (" + str(self._age) + ")"
```
:::end

:::lang cpp
```cpp
#include <string>

class Person {
    std::string name;
protected:
    int age = 0;
public:
    std::string getName() const { return name; }
    void setName(const std::string& value) { name = value; }
};

class Student : public Person {
public:
    std::string describe() const {
        // name is private: use the inherited getter.
        return getName() + " (" + std::to_string(age) + ")";
    }
};
```
:::end

![Láthatósági szintek öröklődő osztályokban](content/chapters/06-oroklodes/media/visibility-hu.svg){width=430}

## Öröklődési hierarchiák {#inheritance-hierarchies}

Egy osztálynak több különböző leszármazottja is lehet, és a leszármazott osztályból újabb osztályokat származtathatunk. Így egy **öröklődési hierarchiát** kapunk, amelyben az általánosabb osztályok felül, a speciálisabbak pedig alattuk helyezkednek el. A `ScholarshipStudent` például a `Student` leszármazottja, így nemcsak a hallgató saját metódusait használhatja, hanem a `Person` osztályból örökölteket is. Ezt az egymásra épülő kapcsolatot az UML-osztálydiagram különösen jól szemlélteti.

Java-ban és C#-ban egy osztály közvetlenül legfeljebb egy másik osztályból származhat. C++ és Python esetében lehetséges a **többszörös öröklődés** is, amikor egy osztálynak egyszerre több közvetlen ősosztálya van. A következő példában mind a négy nyelven egyszeres öröklődést használunk, hogy a hierarchia működésére koncentrálhassunk. A többszörös öröklődés sajátosságainak részletes vizsgálata egyelőre nem szükséges.

Java-ban azoknak az osztályoknak, amelyekhez nem jelölünk meg közvetlen ősosztályt, az `Object` lesz az őse; az `Object` maga az öröklődési hierarchia gyökere. Ez azt jelenti, hogy az általunk létrehozott objektumok olyan alapvető műveletekkel is rendelkeznek, amelyeket már korábban használtunk, például a `toString()` metódussal. Az UML-diagramon általában nem rajzoljuk fel minden osztály fölé külön az `Object` osztályt, mert az csak fölöslegesen bonyolítaná az ábrát.

:::lang java
```java
class Person { public void greet() { System.out.println("Hello!"); } }
class Student extends Person { public void enroll() { } }
class ScholarshipStudent extends Student { public void applyForScholarship() { } }
class Teacher extends Person { public void teach() { } }

class Main {
    public static void main(String[] args) {
        ScholarshipStudent student = new ScholarshipStudent();
        student.greet();
        student.enroll();
        student.applyForScholarship();
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Person { public void Greet() { Console.WriteLine("Hello!"); } }
class Student : Person { public void Enroll() { } }
class ScholarshipStudent : Student { public void ApplyForScholarship() { } }
class Teacher : Person { public void Teach() { } }

class Program {
    static void Main() {
        ScholarshipStudent student = new ScholarshipStudent();
        student.Greet();
        student.Enroll();
        student.ApplyForScholarship();
    }
}
```
:::end

:::lang python
```python
class Person:
    def greet(self):
        print("Hello!")

class Student(Person):
    def enroll(self):
        pass

class ScholarshipStudent(Student):
    def apply_for_scholarship(self):
        pass

class Teacher(Person):
    def teach(self):
        pass

student = ScholarshipStudent()
student.greet()
student.enroll()
student.apply_for_scholarship()
```
:::end

:::lang cpp
```cpp
#include <iostream>

class Person {
public:
    void greet() { std::cout << "Hello!\n"; }
};
class Student : public Person { public: void enroll() {} };
class ScholarshipStudent : public Student {
public:
    void applyForScholarship() {}
};
class Teacher : public Person { public: void teach() {} };

int main() {
    ScholarshipStudent student;
    student.greet();
    student.enroll();
    student.applyForScholarship();
}
```
:::end

![Többszintű öröklődési hierarchia](content/chapters/06-oroklodes/media/hierarchy-hu.svg){width=630}

## Típuskompatibilitás {#type-compatibility}

Az öröklődés egyik legfontosabb következménye a **típuskompatibilitás**. Ha a `Student` osztály a `Person` osztályból származik, akkor egy `Student` példányt bárhol felhasználhatunk, ahol egy `Person` típusú objektumot várunk. Ez azért lehetséges, mert minden hallgató egyben személy is, és az ősosztály által biztosított műveletek a leszármazott példányon is rendelkezésre állnak. Az ellenkező irány azonban általában nem igaz: attól, hogy valaki személy, még nem biztos, hogy hallgató.

Java-ban a kompatibilis leszármazottból ősosztály típusába történő hivatkozást a fordító automatikusan elfogadja; ezt **felfelé történő típuskonverziónak** (upcasting) nevezzük. Ilyenkor nem készül új objektum, mindössze ugyanarra a példányra egy általánosabb típusú referencián keresztül hivatkozunk. A példában a `person` változó **deklarált vagy statikus típusa** `Person`, míg a mögötte lévő objektum **tényleges vagy dinamikus típusa** `Student`. A referencián keresztül közvetlenül csak a `Person` típusban ismert tagokat használhatjuk, még akkor is, ha maga az objektum több lehetőséggel rendelkezik.

A típuskompatibilitás **tranzitív**: ha a `ScholarshipStudent` a `Student` leszármazottja, a `Student` pedig a `Person` leszármazottja, akkor egy `ScholarshipStudent` példány a `Person` típussal is kompatibilis. Ennek köszönhetően készíthetünk olyan általános metódusokat, amelyek paraméterként egy ősosztály típusát várják, és így annak minden leszármazottjával használhatók. Ugyanez az elv teszi lehetővé azt is, hogy egy `Person` típusú tömbben hallgatókat és oktatókat egyaránt tároljunk.

:::lang java
```java
class Person { public void greet() { } }
class Student extends Person { public void enroll() { } }

class Main {
    public static void processPerson(Person value) { value.greet(); }
    public static void main(String[] args) {
        Student student = new Student();
        processPerson(student);
        Person person = student;      // Automatic conversion to the base type.
        person.greet();              // Available through Person.
        // person.enroll();           // Not available through Person.
        Student original = (Student) person; // Safe: the object is Student.
        original.enroll();
    }
}
```
:::end

:::lang csharp
```csharp
class Person { public void Greet() {} }
class Student : Person { public void Enroll() {} }

class Program {
    static void ProcessPerson(Person value) { value.Greet(); }
    static void Main() {
        Student student = new Student();
        ProcessPerson(student);
        Person person = student;        // Upcast.
        person.Greet();
        // person.Enroll();             // Not available through Person.
        Student original = (Student)person;
        original.Enroll();
    }
}
```
:::end

:::lang python
```python
class Person:
    def greet(self):
        pass

class Student(Person):
    def enroll(self):
        pass

def process_person(person):
    person.greet()

student = Student()
process_person(student)
person = student       # Both names reference the same object.
person.greet()
person.enroll()       # Python checks the object at runtime.
```
:::end

:::lang cpp
```cpp
class Person { public: void greet() {} };
class Student : public Person { public: void enroll() {} };

void processPerson(Person& value) { value.greet(); }

int main() {
    Student student;
    processPerson(student);
    Person& person = student;     // Base-class reference to Student.
    person.greet();
    // person.enroll();           // Not available through Person.
    Student& original = static_cast<Student&>(person);
    original.enroll();           // Safe here: the object is Student.
}
```
:::end

### Típuskonverzió és típusellenőrzés {#type-casting}

Előfordulhat, hogy egy általánosabb típusú referenciáról tudjuk, hogy valójában egy speciálisabb típusú objektumra mutat, és szeretnénk használni a leszármazott saját metódusait is. Ilyenkor **lefelé történő típuskonverziót** (downcasting) végzünk. Java-ban ezt a célként megadott típus zárójelezésével írjuk le, például `(Student) person` formában. A konverzió önmagában továbbra sem hoz létre új objektumot, csak lehetővé teszi, hogy a meglévő objektumot más típusú referencián keresztül használjuk.

A lefelé történő típuskonverzió azonban csak akkor helyes, ha a tényleges objektum valóban megfelel a megadott leszármazott típusnak. Ellenkező esetben Java-ban futás közben `ClassCastException` keletkezik, ezért ismeretlen típusú objektumok esetén előbb ellenőriznünk kell a típust. Erre az `instanceof` operátort használjuk, amely logikai értékkel jelzi, hogy a vizsgált objektum kompatibilis-e a megadott típussal. A modern Java-ban az `instanceof Student student` alak az ellenőrzés mellett egy megfelelő típusú új változót is bevezet, ezért ilyenkor nem kell külön konverziót írnunk.

A nyelvek között itt már lényeges különbségeket találunk. C#-ban az `is` operátorral végezhetjük el az ellenőrzést, míg Pythonban az `isinstance()` függvényt használjuk, és nem szükséges külön típuskonverziót végeznünk a metódusok meghívásához. C++-ban futásidejű típusellenőrzésre polimorf ősosztály esetén a `dynamic_cast` használható; a példában ezért az ősosztálynak virtuális destruktora van. Ennek a részletes működésével később foglalkozunk, most elegendő annyit megértenünk, hogy a konverzió sikertelen is lehet, és ezt ellenőriznünk kell.

:::lang java
```java
class Person { }
class Student extends Person {
    public String getStudentId() { return "ABC123"; }
}

class Main {
    public static void main(String[] args) {
        Person person = new Student();
        if (person instanceof Student student) {
            System.out.println(student.getStudentId());
        }
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Person { }
class Student : Person {
    public string GetStudentId() { return "ABC123"; }
}

class Program {
    static void Main() {
        Person person = new Student();
        if (person is Student student) {
            Console.WriteLine(student.GetStudentId());
        }
    }
}
```
:::end

:::lang python
```python
class Person:
    pass

class Student(Person):
    def get_student_id(self):
        return "ABC123"

person = Student()
if isinstance(person, Student):
    print(person.get_student_id())
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>

class Person {
public:
    virtual ~Person() = default; // Enables runtime type checking.
};
class Student : public Person {
public:
    std::string getStudentId() const { return "ABC123"; }
};

int main() {
    Student student;
    Person* person = &student;
    if (Student* result = dynamic_cast<Student*>(person)) {
        std::cout << result->getStudentId() << '\n';
    }
}
```
:::end

### Kiválogatás típus alapján {#type-selection}

A típuskompatibilitás a gyakorlatban akkor válik különösen hasznossá, amikor különböző leszármazott osztályok példányait szeretnénk egyetlen gyűjteményben kezelni. Készíthetünk például egy `Person` típusú tömböt, amelyben hallgatók és oktatók is szerepelnek, mert mindegyikük kompatibilis a közös ősosztállyal. A tömb bejárása során valamennyi elemre meghívhatjuk a `Person` metódusait, és ha valamilyen feladatot csak a hallgatókkal szeretnénk elvégezni, típusellenőrzéssel kiválaszthatjuk a megfelelő objektumokat.

Az alábbi példában végigmegyünk egy személyeket tartalmazó tömbön, és csak a `Student` típusú elemeknél hívjuk meg az `enroll()` metódust. Ugyanekkor meg is számolhatjuk a hallgatókat anélkül, hogy külön tömbbe kellene másolnunk őket. A példa fontos tulajdonsága, hogy a közös ősosztály segítségével egységesen tárolhatjuk az objektumokat, miközben szükség esetén megkülönböztethetjük a konkrét típusaikat. A metódusok később tárgyalt felülírására ehhez még nincs szükség.

:::lang java
```java
class Person { }
class Student extends Person {
    public void enroll() { System.out.println("Student"); }
}
class Teacher extends Person { }

class Main {
    public static void main(String[] args) {
        Person[] people = {new Student(), new Teacher(), new Student()};
        int studentCount = 0;
        for (Person person : people) {
            if (person instanceof Student student) {
                student.enroll();
                studentCount++;
            }
        }
        System.out.println(studentCount);
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class Person { }
class Student : Person {
    public void Enroll() { Console.WriteLine("Student"); }
}
class Teacher : Person { }

class Program {
    static void Main() {
        Person[] people = {new Student(), new Teacher(), new Student()};
        int studentCount = 0;
        foreach (Person person in people) {
            if (person is Student student) {
                student.Enroll();
                studentCount++;
            }
        }
        Console.WriteLine(studentCount);
    }
}
```
:::end

:::lang python
```python
class Person:
    pass

class Student(Person):
    def enroll(self):
        print("Student")

class Teacher(Person):
    pass

people = [Student(), Teacher(), Student()]
student_count = 0
for person in people:
    if isinstance(person, Student):
        person.enroll()
        student_count += 1
print(student_count)
```
:::end

:::lang cpp
```cpp
#include <iostream>
class Person {
public:
    virtual ~Person() = default;
};
class Student : public Person {
public:
    void enroll() { std::cout << "Student\n"; }
};
class Teacher : public Person { };

int main() {
    Student first, second;
    Teacher teacher;
    Person* people[] = {&first, &teacher, &second};
    int studentCount = 0;
    for (Person* person : people) {
        if (Student* student = dynamic_cast<Student*>(person)) {
            student->enroll();
            studentCount++;
        }
    }
    std::cout << studentCount << '\n';
}
```
:::end

## Feladatok {#exercises}

Az alábbi feladatokban elsősorban az osztályok közös adatainak kiemelését, az öröklődést és a különböző típusú példányok együttes kezelését gyakoroljuk. A mezők leírása tartalmazza a hozzájuk tartozó lekérdező és módosító metódusok működését is. Hibás adat esetén a setter `IllegalArgumentException` kivételt dobjon, és a mező korábbi értéke ne változzon meg, kivéve, ha a feladat másként rendelkezik.

:::exercise
### Téglalapok

![Téglalapok – UML](content/chapters/06-oroklodes/media/complete-task-1-hu.svg){width=620}

A korábbi `Rectangle` osztály mellé készítsen `Shape` ősosztályt, és ebből származtasson egy új `Circle` osztályt is! A két leszármazott közös adata a szín, amelyet kizárólag az ősosztály tároljon.

**`Shape` – adatok**

- **`color : String`** – privát szöveges mező, amely az alakzat színét tárolja. A publikus `getColor() : String` a mező pillanatnyi értékével tér vissza. A `setColor(color : String) : void` csak nem `null` és nem üres vagy csupa szóközből álló szöveget fogadhat el.

**`Rectangle` – adatok**

- **`x : double`** – a bal felső csúcs vízszintes koordinátája, tetszőleges valós szám. A privát mezőhöz publikus `getX() : double` és `setX(x : double) : void` tartozik. A getter visszaadja a tárolt koordinátát, a setter átállítja azt.
- **`y : double`** – a bal felső csúcs függőleges koordinátája, tetszőleges valós szám. A publikus `getY() : double` a tárolt értékkel tér vissza, a `setY(y : double) : void` pedig módosítja a privát mezőt. A pozitív függőleges irányt felfelé értelmezzük.
- **`width : double`** – a téglalap szélessége, amelynek szigorúan pozitívnak kell lennie. A `getWidth() : double` az aktuális szélességet adja vissza, a `setWidth(width : double) : void` pedig csak pozitív értéket menthet el.
- **`height : double`** – a téglalap magassága, amely szintén csak pozitív lehet. A `getHeight() : double` a tárolt magasságot adja vissza, a `setHeight(height : double) : void` elutasítja a nullát és a negatív értékeket.
- **`CREATED_COUNT : int`** – privát statikus számláló, amely kezdetben `0`, és minden sikeresen létrehozott téglalap után pontosan eggyel növekszik. A publikus statikus `getCreatedCount() : int` az összes eddig létrehozott téglalap számát adja vissza; a mezőhöz setter nem készül.

**`Rectangle` – konstruktorok és műveletek**

A `Rectangle()` konstruktor az `(0, 0)` bal felső csúcshoz `1 × 1` méretű téglalapot készítsen. A `Rectangle(x : double, y : double, width : double, height : double)` a megadott adatokkal dolgozzon, a szélesség és magasság ellenőrzésével. A konstruktorok közötti hívás ne okozzon kétszeres példányszámlálást.

- **`getArea() : double`** – a szélesség és a magasság szorzatát adja vissza.
- **`getPerimeter() : double`** – a `2 × (width + height)` értékkel tér vissza.
- **`overlaps(other : Rectangle) : boolean`** – akkor tér vissza igazzal, ha a két téglalap közös részének pozitív a területe. A kizárólag oldalban vagy csúcsban érintkező téglalapok nem fedik át egymást.
- **`getQuadrant() : int`** – az `1`–`4` érték valamelyikét adja vissza, ha a teljes téglalap egyetlen síknegyed belsejében található. Ha tengelyt érint, vagy több síknegyedre terjed ki, az eredmény `-1`.

**`Circle` – adatok és műveletek**

- **`radius : double`** – a kör privát sugara, amely csak pozitív értéket vehet fel. A `getRadius() : double` a tárolt sugarat adja vissza, a `setRadius(radius : double) : void` a hibás értékeket elutasítja.

A kör `getArea() : double` metódusa `π × radius²`, a `getPerimeter() : double` metódusa `2 × π × radius` értéket adjon vissza. Ezek a `Circle` új metódusai; a `Shape` osztályban most még nem szerepelnek.

**Főprogram**

Tároljon téglalapokat és köröket közös `ArrayList<Shape>` gyűjteményben! `instanceof` segítségével válogassa ki egy új listába a köröket, majd számítsa ki a kiválasztott körök területének összegét! Figyelje meg, hogy a színt mindkét leszármazottnál az ősosztály metódusain keresztül érjük el.
:::endexercise

:::exercise
### Könyvek

![Könyvek – UML](content/chapters/06-oroklodes/media/complete-task-2-hu.svg){width=620}

Hozzon létre `Publication` ősosztályt, majd ebből származtassa a korábbi `Book` osztályt és egy új `Magazine` osztályt! A kiadó és a megjelenési ország közös adat, ezért egyik leszármazottban se tárolja még egyszer.

**`Publication` – adatok**

- **`publisher : String`** – privát mező a kiadó nevének tárolására. A `getPublisher() : String` a kiadó nevét adja vissza, a `setPublisher(publisher : String) : void` pedig csak nem `null` és nem üres szöveget fogad el.
- **`country : String`** – privát mező a megjelenési ország nevével. A `getCountry() : String` a tárolt országot adja vissza, a `setCountry(country : String) : void` pedig elutasítja a `null`, üres vagy kizárólag szóközöket tartalmazó szöveget.

**`Book` – adatok**

- **`author : String`** – a könyv szerzőjének neve. A `getAuthor() : String` a tárolt nevet adja vissza, a `setAuthor(author : String) : void` pedig legalább két karaktert és kizárólag betűket, szóközt, pontot és kötőjelet enged meg.
- **`title : String`** – a könyv címe. A `getTitle() : String` a tárolt címet adja vissza, a `setTitle(title : String) : void` csak nem `null`, legalább két karakter hosszú címet fogad el.
- **`price : int`** – a könyv egész forintban megadott ára. A `getPrice() : int` az aktuális árral tér vissza, a `setPrice(price : int) : void` csak az `[500; 50 000]` intervallumba eső értéket mentheti el.
- **`genre : Genre`** – a könyv műfaja felsorolás típusban, például `BIOGRAPHY`, `HORROR`, `DRAMA`, `HISTORY`, `SCIFI` vagy `COMEDY`. A `getGenre() : Genre` a tárolt műfajt adja vissza, a `setGenre(genre : Genre) : void` nem fogadhat el `null` értéket.
- **`printed : boolean`** – igaz, ha nyomtatott könyvről, hamis, ha e-könyvről van szó. Az `isPrinted() : boolean` a tárolt logikai értéket adja vissza, a `setPrinted(printed : boolean) : void` pedig külön ellenőrzés nélkül módosítja.
- **`MIN_PRICE : int` és `MAX_PRICE : int`** – a `Book` nyilvános, `static final` konstansai, rendre `500` és `50 000` értékkel. A publikus statikus `isValidPrice(price : int) : boolean` azt állapítja meg, hogy a paraméter a megengedett tartományba esik-e.

**`Book` – konstruktorok és műveletek**

A `Book(author : String, title : String, price : int, genre : Genre, printed : boolean)` konstruktor a könyv saját adatait a fenti ellenőrzésekkel állítsa be. A háromparaméteres `Book(author : String, title : String, price : int)` a teljes konstruktorra támaszkodjon, `Genre.DRAMA` műfajjal és nyomtatott állapottal. A közös kiadói adatokat az örökölt setterekkel lehet beállítani.

- **`discount(percent : int) : void`** – `1` és `99` közötti százalékkal csökkenti az árat, egész forintra lefelé kerekítve. Hibás százalék vagy `899` forint alá csökkenő új ár esetén a tárolt ár ne változzon meg.
- **`toString() : String`** – a könyv adatait olvasható, többmezős szövegként adja vissza.

**`Magazine` – adatok**

- **`title : String`** – a folyóirat címe, privát mező. A `getTitle() : String` a címét adja vissza, a `setTitle(title : String) : void` nem enged `null` vagy üres szöveget elmenteni.
- **`issueNumber : int`** – a folyóirat sorszáma, amely pozitív egész. A `getIssueNumber() : int` a tárolt sorszámmal tér vissza, a `setIssueNumber(issueNumber : int) : void` a nullát és a negatív értékeket elutasítja.

**Főprogram**

Hozzon létre könyveket és folyóiratokat, állítsa be a közös kiadói adatokat, majd tárolja a példányokat `ArrayList<Publication>` listában! Típusellenőrzéssel gyűjtse ki a folyóiratokat, és jelenítse meg a címüket, sorszámukat és kiadójukat!
:::endexercise

:::exercise
### Autók

![Autók – UML](content/chapters/06-oroklodes/media/complete-task-3-hu.svg){width=620}

A korábbi `Car` osztályból emelje ki a márkát az új `Vehicle` ősosztályba, amely a maximális sebességet is tárolja! Készítsen egy új `Motorcycle` leszármazottat is. Az ősosztályba került mezőket egyik leszármazottban se ismételje meg.

**`Vehicle` – adatok**

- **`brand : String`** – a jármű márkája, privát szöveges mező. A `getBrand() : String` az aktuális márkával tér vissza, a `setBrand(brand : String) : void` nem enged `null` vagy üres értéket elmenteni.
- **`maxSpeed : int`** – a jármű maximális sebessége km/h-ban, pozitív egész szám. A `getMaxSpeed() : int` a tárolt sebességet adja vissza, a `setMaxSpeed(maxSpeed : int) : void` elutasítja a nem pozitív értékeket.

**`Car` – adatok**

- **`model : String`** – a modell neve. A `getModel() : String` a tárolt modellnevet adja vissza, a `setModel(model : String) : void` csak nem üres szöveget enged meg.
- **`year : int`** – a gyártási év, az `[1886; 2100]` intervallumban. A `getYear() : int` az évszámot adja vissza, a `setYear(year : int) : void` a tartományon kívüli értékeket elutasítja.
- **`mileage : int`** – a kilométeróra állása egész kilométerben, nemnegatív szám. A `getMileage() : int` a tárolt értéket adja vissza; publikus setter nincs, a futásteljesítmény kizárólag a konstruktorban és a `drive()` metódussal módosítható.
- **`id : int`** – automatikusan kiosztott, pozitív példányazonosító. A `getId() : int` az azonosítót adja vissza, amely a példány teljes életében változatlan; setter nincs.
- **`NEXT_ID : int`** – privát statikus mező, `1` kezdeti értékkel. Minden új `Car` példány az aktuális értéket kapja azonosítóként, majd a számláló eggyel növekszik.

**`Car` – konstruktorok és műveletek**

A `Car(brand : String, model : String, year : int, mileage : int)` konstruktor érvényesítse a fent megadott feltételeket. A `Car(brand : String, model : String, year : int)` a másik konstruktor segítségével `0` kilométeres futásteljesítményt állítson be. A márkát az ősosztály setterével kezelje.

- **`drive(distance : int) : void`** – kizárólag pozitív egész távolsággal növelheti a kilométeróra-állást.
- **`toString() : String`** – a márkát, a modellt, az évjáratot és az aktuális futásteljesítményt tartalmazó szöveget adja vissza.

**`Motorcycle` – adatok**

- **`engineCapacity : int`** – a motorkerékpár hengerűrtartalma cm³-ben, pozitív egész. A `getEngineCapacity() : int` a tárolt értéket adja vissza, a `setEngineCapacity(engineCapacity : int) : void` csak pozitív értéket fogad el.
- **`sidecar : boolean`** – azt jelzi, van-e a motorkerékpárnak oldalkocsija. A `hasSidecar() : boolean` a tárolt logikai értéket adja vissza, a `setSidecar(sidecar : boolean) : void` pedig tetszőleges logikai értékkel módosíthatja azt.

**Főprogram**

Vegyen fel autókat és motorkerékpárokat `ArrayList<Vehicle>` listába! Válogassa ki a motorkerékpárokat, majd számolja meg, hány közülük oldalkocsis! Mutassa meg azt is, hogy a járművek márkája a közös ősosztályon keresztül kérdezhető le.
:::endexercise

:::exercise
### Bankszámlák

![Bankszámlák – UML](content/chapters/06-oroklodes/media/complete-task-4-hu.svg){width=620}

Készítsen egyszerű `BankAccount` ősosztályt, és származtassa belőle a `SavingsAccount`, valamint a `BusinessAccount` osztályt! Az örökölt mezőket a leszármazottakban ne deklarálja újra.

**`BankAccount` – adatok**

- **`owner : String`** – a számlatulajdonos neve. A `getOwner() : String` a tárolt nevet adja vissza, a `setOwner(owner : String) : void` pedig nem fogad el `null` vagy üres szöveget.
- **`accountNumber : String`** – a számla azonosítója. A `getAccountNumber() : String` a tárolt számlaszámot adja vissza. A `setAccountNumber(accountNumber : String) : void` csak az első, érvényes érték beállítását engedi meg; ezt követően az azonosító nem változtatható meg. Üres vagy `null` számlaszámot el kell utasítania.
- **`balance : int`** – az egyenleg egész forintban, kezdetben `0`. A `getBalance() : int` a pillanatnyi összeget adja vissza. Publikus setter nem készül, az érték csak a befizetés és a pénzfelvétel során változhat, és soha nem lehet negatív.

**`BankAccount` – műveletek**

- **`deposit(amount : int) : void`** – csak pozitív egész összeget fogad, amelyet hozzáad az egyenleghez.
- **`withdraw(amount : int) : void`** – csak pozitív, a rendelkezésre álló egyenlegnél nem nagyobb összeget vonhat le. Hibás összeg esetén az egyenleg ne változzon meg.

**`SavingsAccount` – adatok**

- **`interestRate : double`** – éves kamatláb, a `[0; 1]` intervallumban. A `getInterestRate() : double` az aktuális kamatlábat adja vissza, a `setInterestRate(interestRate : double) : void` a tartományon kívüli értékeket elutasítja.

**`BusinessAccount` – adatok**

- **`companyName : String`** – a vállalkozás neve. A `getCompanyName() : String` a tárolt szöveggel tér vissza, a `setCompanyName(companyName : String) : void` csak nem üres, nem `null` szöveget fogad el.

**Főprogram**

Hozzon létre mindkét számlatípusból példányokat, állítsa be az adataikat, és végezzen befizetéseket, valamint pénzfelvételeket! Ezután tárolja a számlákat `ArrayList<BankAccount>` listában, és típusellenőrzéssel gyűjtse ki az üzleti számlákat! Jelenítse meg a kiválasztott számlák tulajdonosát, cégnevét és egyenlegét.
:::endexercise

:::exercise
### Filmek

![Filmek – UML](content/chapters/06-oroklodes/media/complete-task-5-hu.svg){width=620}

Készítsen `MediaItem` ősosztályt, amelyből egy `Movie` és egy `Series` osztály származik! A közös cím és megjelenési év kizárólag az ősosztályban szerepeljen.

**`MediaItem` – adatok**

- **`title : String`** – a mű címe, privát szöveges mező. A `getTitle() : String` a tárolt címet adja vissza, a `setTitle(title : String) : void` csak nem `null`, legalább két karakter hosszú címet fogad el.
- **`releaseYear : int`** – a megjelenési év, pozitív egész szám. A `getReleaseYear() : int` az évszámot adja vissza, a `setReleaseYear(releaseYear : int) : void` a nullát és a negatív értékeket elutasítja.

**`Movie` – adatok**

- **`director : String`** – a film rendezője. A `getDirector() : String` a tárolt nevet adja vissza, a `setDirector(director : String) : void` nem `null`, legalább két karakteres szöveget fogad el, amely csak betűket, szóközt, pontot és kötőjelet tartalmazhat.
- **`duration : int`** – a film hossza percben, az `[10; 360]` intervallumban. A `getDuration() : int` a tárolt játékidővel tér vissza, a `setDuration(duration : int) : void` az ezen kívüli értékeket elutasítja.

**`Series` – adatok**

- **`seasons : int`** – az elkészült évadok száma, pozitív egész szám. A `getSeasons() : int` a tárolt évadszámot adja vissza, a `setSeasons(seasons : int) : void` csak pozitív értéket fogad el.

**Főprogram**

Készítsen több film- és sorozatpéldányt, tárolja őket `ArrayList<MediaItem>` listában, majd típusellenőrzéssel válogassa ki a sorozatokat! A kiválasztott sorozatoknál jelenítse meg a címet, a megjelenési évet és az évadok számát.
:::endexercise
