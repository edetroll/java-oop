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

A következő feladatokban az öröklődés segítségével alakítsunk ki olyan osztályhierarchiákat, amelyekben a közös tulajdonságokat és műveleteket nem kell több külön osztályban megismételnünk. Egyes esetekben a korábban elkészített osztályainkat egészítjük ki egy új ősosztállyal, más esetekben egy egyszerűbb osztályhierarchiát építünk fel újra. A feladatok megoldásakor különösen figyeljünk a mezők láthatóságára, az öröklődés irányára és arra, hogy a különböző típusú példányokat mikor használhatjuk közösen. A diagramok a megvalósítandó kapcsolatokat szemléltetik, nem minden korábban elkészített mezőt és metódust sorolnak fel.

:::exercise
### Téglalapok

![A Shape, Rectangle és Circle osztályok hierarchiája](content/chapters/06-oroklodes/media/task-rectangle-hu.svg){width=560}

A korábban elkészített `Rectangle` osztályt egészítse ki egy új `Shape` ősosztállyal! Az ősosztály tárolja az alakzat színét, és biztosítsa annak lekérdezését, illetve módosítását. A téglalap örökölje ezt a tulajdonságot, miközben a terület és a kerület számítása továbbra is a korábban megírt `Rectangle` osztályban marad. Készítsen egy új `Circle` osztályt is, amely szintén a `Shape` leszármazottja, és a sugarát tárolja, illetve képes meghatározni a területét!

A főprogramban hozzon létre téglalapokat és köröket, állítsa be a színüket, majd tárolja őket közösen egy `Shape` típusú tömbben! A tömb bejárásakor jelenítse meg minden alakzat színét, és az `instanceof` segítségével számolja meg, hány téglalap szerepel a tömbben! Ellenőrizze, hogy a színt kezelő metódusokat mindkét leszármazott osztályon használhatja-e.
:::endexercise

:::exercise
### Könyvek

![A Publication, Book és Magazine osztályok hierarchiája](content/chapters/06-oroklodes/media/task-book-hu.svg){width=580}

A `Book` osztály mellé hozzon létre egy `Magazine` osztályt, és készítsen számukra egy közös `Publication` ősosztályt! Az ősosztály tárolja a kiadó nevét és az országot, ahol a kiadvány megjelent, a megfelelő hozzáférési metódusokkal együtt. A könyv továbbra is tárolja saját szerzőjét, címét és árát, míg a folyóiratban tárolja az évfolyamot és a lapszámot. A korábbi könyvkezelő metódusok működését tartsa meg, az új közös adatokat azonban ne írja meg külön a két leszármazott osztályban!

Hozzon létre néhány könyvet és folyóiratot, majd egy `Publication` típusú tömbben tárolja őket közösen! Készítsen egy osztályszintű metódust, amely paraméterben egy `Publication` példányt vár, és megjeleníti a kiadó nevét! A főprogramban hívja meg ezt a metódust mindkét leszármazott osztály példányaival, végül számolja meg, hány könyvet tartalmaz a tömb!
:::endexercise

:::exercise
### Autók

![A Vehicle, Car és Motorcycle osztályok hierarchiája](content/chapters/06-oroklodes/media/task-car-hu.svg){width=590}

Készítsen egy általános `Vehicle` ősosztályt, amely a gyártó nevét és a jármű maximális sebességét tárolja. A korábban elkészített `Car` osztály örököljön ebből az osztályból, és tartsa meg a saját, autókra jellemző adatait és metódusait! Hozzon létre egy új `Motorcycle` osztályt is, amelynek van egy logikai mezője annak jelzésére, hogy rendelkezik-e oldalkocsival. Mindkét leszármazott osztály a `Vehicle` által biztosított metódusokon keresztül érje el a gyártó nevét és a maximális sebességet.

A főprogramban hozzon létre autókat és motorkerékpárokat, majd tárolja őket közösen egy `Vehicle` típusú tömbben! Készítsen olyan osztályszintű metódust, amely paraméterként egy `Vehicle` példányt vár, és visszatér a jármű maximális sebességével. Ellenőrizze, hogy a metódus a `Car` és a `Motorcycle` példányokkal is használható, majd kiválogatás segítségével jelenítse meg csak a motorkerékpárokat!
:::endexercise

:::exercise
### Bankszámlák

![A BankAccount, SavingsAccount és BusinessAccount osztályok hierarchiája](content/chapters/06-oroklodes/media/task-bank-hu.svg){width=620}

Készítsen egy egyszerű, új `BankAccount` ősosztályt, amely tárolja a számlaszámot és az aktuális egyenleget, valamint metódusokat biztosít az egyenleg lekérdezésére, a befizetésre és a pénzfelvételre! Ebből származtasson `SavingsAccount` és `BusinessAccount` osztályokat. A megtakarítási számlához tartozzon egy kamatláb, az üzleti számlához pedig a cég neve. Ezeket az új adatokat a megfelelő leszármazott osztályban tárolja, és a hozzájuk tartozó új metódusokat is ott készítse el!

A főprogramban hozzon létre legalább két megtakarítási és két üzleti számlát, majd tárolja őket egy `BankAccount` típusú tömbben! Készítsen olyan metódust, amely a tömb valamennyi elemére képes meghívni az egyenleg lekérdezését. A típusellenőrzés segítségével számolja meg a megtakarítási számlákat, és ezeknél külön jelenítse meg a kamatlábat!
:::endexercise

:::exercise
### Filmek

![A MediaItem, Movie és Series osztályok hierarchiája](content/chapters/06-oroklodes/media/task-film-hu.svg){width=590}

Készítsen egy új `MediaItem` ősosztályt, amely minden médiatartalom címét és megjelenési évét tárolja, a hozzájuk tartozó getter és setter metódusokkal együtt! Ebből származtasson `Movie` és `Series` osztályokat. A filmhez tartozzon a játékidő percben, a sorozathoz pedig az évadok száma. Az új feladatban használjon egyszerűsített osztályokat, és figyeljen arra, hogy a cím és a megjelenési év adatai ne szerepeljenek külön a két leszármazott osztályban!

A főprogramban készítsen olyan `MediaItem` típusú tömböt, amely filmeket és sorozatokat egyaránt tartalmaz. Írjon osztályszintű metódust, amely egy `MediaItem` paramétert vár, és megjeleníti a tartalom címét és évét! A tömb bejárásakor típusellenőrzés segítségével külön számolja meg a filmeket és a sorozatokat, és a sorozatoknál jelenítse meg az évadok számát is!
:::endexercise
