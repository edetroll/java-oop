# Konténerosztályok

## A konténerosztály fogalma {#container-intro}

Az eddigiekben olyan osztályokat készítettünk, amelyek egy-egy személyt, könyvet, járművet vagy más önálló objektumot írnak le. Egy nagyobb programban azonban rendszerint nem egyetlen példánnyal dolgozunk, hanem ezeknek a példányoknak egy gyűjteményét kell kezelnünk. A hallgatók adatait például tárolhatjuk egy listában, melybe új hallgatókat veszünk fel, megkeresünk egy adott személyt, vagy összegyűjtjük azokat, akik teljesítenek valamilyen feltételt. Ha az ilyen műveleteket minden alkalommal a főprogramban végeznénk, akkor ugyanazokat az ellenőrzéseket és algoritmusokat több helyen kellene megírnunk, ráadásul a lista tartalmát bárki tetszőlegesen módosíthatná.

A **konténerosztály** olyan osztály, amely egy másik osztály példányainak gyűjteményét kezeli, és szabályozza, hogy a külvilág milyen műveleteket végezhet ezen a gyűjteményen. Egy `Family` osztály például `Person` típusú példányokat tárolhat, miközben a családtagok felvételét, keresését és eltávolítását saját metódusaival valósítja meg. A konténerosztály feladata tehát nem egyszerűen a lista tárolása, hanem **a gyűjtemény állapotának ellenőrzött fenntartása**. A `Family` és a `Person` között nem öröklődési kapcsolat van: a család személyeket *tartalmaz*, nem pedig egy személy speciális változata.

![A Family konténerosztály és a Person kapcsolata](content/chapters/05-kontenerosztalyok/media/family-hu.svg){width=550}

## A gyűjtemény védelme {#collection-protection}

Tegyük fel, hogy a családtagokat egy `ArrayList<Person>` típusú mezőben tároljuk. Ha ezt a mezőt `public` láthatósággal hozzuk létre, akkor a főprogram közvetlenül is elérheti, ezért a teljes listát törölheti, vagy az ellenőrzések megkerülésével új elemeket helyezhet el benne. Az adatrejtés megvalósításához természetesen `private` mezőt szeretnénk használni, és a listát a konstruktorban hozzuk létre. Ezzel azonban még nem oldottuk meg teljesen a problémát.

:::lang java
```java
class Family {
    public ArrayList<Person> members = new ArrayList<>();
}

Family family = new Family();
family.members.clear(); // az összes családtag eltávolítható
```
:::end

:::lang csharp
```csharp
class Family {
    public List<Person> Members = new();
}

var family = new Family();
family.Members.Clear();
```
:::end

:::lang python
```python
class Family:
    def __init__(self):
        self.members = []

family = Family()
family.members.clear()
```
:::end

:::lang cpp
```cpp
class Family {
public:
    std::vector<Person> members;
};

Family family;
family.members.clear();
```
:::end

Az sem elegendő, ha a listát priváttá tesszük, de egy publikus getter metódussal visszaadjuk annak referenciáját. A hívó ugyanis ekkor ugyanazt a módosítható gyűjteményt kapja meg, és a kapott referencián keresztül az összes korlátozás megkerülhető. A következő megoldás ezért ugyanúgy nem biztosít megfelelő védelmet.

:::lang java
```java
class Family {
    private final ArrayList<Person> members = new ArrayList<>();

    public ArrayList<Person> getMembers() {
        return members; // ugyanazt a módosítható listát adja vissza
    }
}
```
:::end

:::lang csharp
```csharp
class Family {
    private readonly List<Person> members = new();
    public List<Person> GetMembers() => members; // közvetlen lista-hozzáférés
}
```
:::end

:::lang python
```python
class Family:
    def __init__(self):
        self._members = []

    def get_members(self):
        return self._members  # a belső lista szivárog ki
```
:::end

:::lang cpp
```cpp
class Family {
private:
    std::vector<Person> members;
public:
    std::vector<Person>& getMembers() {
        return members; // a belső gyűjtemény referenciája
    }
};
```
:::end

A gyűjtemény kezeléséhez azokat a műveleteket kell publikus metódusok formájában megvalósítanunk, amelyeket valóban engedélyezni szeretnénk. Ha a külvilág számára szükséges egy lista, akkor bizonyos esetekben annak másolatát vagy csak olvasható nézetét is visszaadhatjuk. Ilyenkor azonban érdemes figyelembe venni, hogy a másolat készítése csak a lista szerkezetét védi: ha a lista módosítható objektumok referenciáit tartalmazza, akkor az egyes objektumok állapota a visszakapott referenciákon keresztül továbbra is módosítható lehet.

## Adatfelvétel és lekérdezés {#operations}

A `Family` osztályban elsőként egy paraméter nélküli konstruktort készítünk, amely inicializálja a privát listát. Ezt követően írunk egy metódust a családtagok számának lekérdezésére, egyet egy adott indexű példány visszaadására, továbbá külön metódust a felvételre és az eltávolításra. Az index ellenőrzése az adott metódus feladata, ezért érvénytelen index esetén kivételt dobunk. A családtag hozzáadásakor megvizsgáljuk azt is, hogy kaptunk-e egyáltalán példányt, és a példában nem engedjük meg, hogy két azonos nevű személy szerepeljen a listában. Ez a feltétel természetesen az aktuális feladat követelménye; más konténerosztály esetén egészen más szabályokra lehet szükség.

A következő példában a keresést egyszerű ciklussal valósítjuk meg. A név szerinti törlés logikai értékkel jelzi, hogy sikerült-e megtalálni a keresett személyt, míg az `findByPrefix()` egy **új listába** gyűjti azokat a családtagokat, akiknek a neve a megadott szöveggel kezdődik. Így a visszaadott lista bővítése vagy ürítése nem változtatja meg a konténerosztályban tárolt gyűjteményt. A kódokat elsődlegesen Java nyelven használjuk, a többi nyelv sajátosságait a nyelvi füleken lehet megvizsgálni.

:::lang java
```java
import java.util.ArrayList;

class Person {
    private final String name;

    public Person(String name) {
        if (name == null || name.isBlank())
            throw new IllegalArgumentException("Invalid name");
        this.name = name;
    }

    public String getName() { return name; }
}

class Family {
    private final ArrayList<Person> members;

    public Family() { members = new ArrayList<>(); }

    public int getMemberCount() { return members.size(); }

    public Person getMember(int index) {
        if (index < 0 || index >= members.size())
            throw new IndexOutOfBoundsException("Invalid index");
        return members.get(index);
    }

    public void addMember(Person person) {
        if (person == null)
            throw new IllegalArgumentException("Missing person");
        for (Person current : members) {
            if (current.getName().equals(person.getName()))
                throw new IllegalArgumentException("Already registered");
        }
        members.add(person);
    }

    public boolean removeMember(String name) {
        for (int i = 0; i < members.size(); i++) {
            if (members.get(i).getName().equals(name)) {
                members.remove(i);
                return true;
            }
        }
        return false;
    }

    public ArrayList<Person> findByPrefix(String prefix) {
        if (prefix == null) throw new IllegalArgumentException("Missing prefix");
        ArrayList<Person> result = new ArrayList<>();
        for (Person person : members) {
            if (person.getName().startsWith(prefix)) result.add(person);
        }
        return result;
    }
}
```
:::end

:::lang csharp
```csharp
using System;
using System.Collections.Generic;

class Person {
    public string Name { get; }
    public Person(string name) {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Invalid name");
        Name = name;
    }
}

class Family {
    private readonly List<Person> members = new();
    public int GetMemberCount() => members.Count;

    public Person GetMember(int index) {
        if (index < 0 || index >= members.Count)
            throw new ArgumentOutOfRangeException(nameof(index));
        return members[index];
    }

    public void AddMember(Person person) {
        if (person == null) throw new ArgumentNullException(nameof(person));
        foreach (var current in members)
            if (string.Equals(current.Name, person.Name,
                    StringComparison.Ordinal))
                throw new ArgumentException("Already registered");
        members.Add(person);
    }

    public bool RemoveMember(string name) {
        for (int i = 0; i < members.Count; i++)
            if (string.Equals(members[i].Name, name,
                    StringComparison.Ordinal)) {
                members.RemoveAt(i);
                return true;
            }
        return false;
    }

    public List<Person> FindByPrefix(string prefix) {
        if (prefix == null) throw new ArgumentNullException(nameof(prefix));
        var result = new List<Person>();
        foreach (var person in members)
            if (person.Name.StartsWith(prefix, StringComparison.Ordinal))
                result.Add(person);
        return result;
    }
}
```
:::end

:::lang python
```python
class Person:
    def __init__(self, name):
        if not isinstance(name, str) or not name.strip():
            raise ValueError("Invalid name")
        self._name = name

    def get_name(self):
        return self._name

class Family:
    def __init__(self):
        self._members = []

    def get_member_count(self):
        return len(self._members)

    def get_member(self, index):
        if index < 0 or index >= len(self._members):
            raise IndexError("Invalid index")
        return self._members[index]

    def add_member(self, person):
        if person is None:
            raise ValueError("Missing person")
        if any(p.get_name() == person.get_name()
               for p in self._members):
            raise ValueError("Already registered")
        self._members.append(person)

    def remove_member(self, name):
        for i, person in enumerate(self._members):
            if person.get_name() == name:
                del self._members[i]
                return True
        return False

    def find_by_prefix(self, prefix):
        if prefix is None:
            raise ValueError("Missing prefix")
        return [p for p in self._members
                if p.get_name().startswith(prefix)]
```
:::end

:::lang cpp
```cpp
#include <string>
#include <vector>
#include <stdexcept>
#include <algorithm>
#include <utility>

class Person {
    std::string name;
public:
    explicit Person(std::string name) : name(std::move(name)) {
        if (this->name.empty()) throw std::invalid_argument("Invalid name");
    }
    const std::string& getName() const { return name; }
};

class Family {
    std::vector<Person> members;
public:
    Family() = default;
    int getMemberCount() const { return static_cast<int>(members.size()); }
    const Person& getMember(std::size_t index) const { return members.at(index); }

    void addMember(const Person& person) {
        for (const auto& current : members)
            if (current.getName() == person.getName())
                throw std::invalid_argument("Already registered");
        members.push_back(person);
    }

    bool removeMember(const std::string& name) {
        auto it = std::find_if(members.begin(), members.end(),
            [&](const Person& p) { return p.getName() == name; });
        if (it == members.end()) return false;
        members.erase(it);
        return true;
    }

    std::vector<Person> findByPrefix(const std::string& prefix) const {
        std::vector<Person> result;
        for (const auto& p : members)
            if (p.getName().rfind(prefix, 0) == 0) result.push_back(p);
        return result;
    }
};
```
:::end

A bemutatott megoldásban a `Person` osztály csak a nevet tárolja, ezért a példányszintű adatok kezelését nem terheljük további részletekkel. A konténerosztály már önálló feladatot lát el: eldönti, mely példányokat engedi a nyilvántartásába, és biztosítja a szükséges lekérdezéseket. Nem célunk, hogy az `ArrayList` minden metódusát lemásoljuk. Ellenkezőleg: általában éppen azokat a műveleteket nem szeretnénk közvetlenül elérhetővé tenni, amelyekkel a program megkerülhetné a saját szabályainkat. Figyeljük meg azt is, hogy C++-ban a példaként használt `std::vector<Person>` az objektumok értékét tárolja, míg Java-ban az `ArrayList<Person>` objektumreferenciákat tartalmaz. Ez a különbség az adatok módosításánál és az egyes példányok azonosságának vizsgálatánál is jelentős lehet.

## Indexelés és nyelvi sajátosságok {#indexing}

A gyűjtemény egy adott elemének lekérdezéséhez Java-ban a `getMember(index)` jellegű metódust használjuk. C#-ban **indexelő property** is készíthető, így a konténerosztály egy példányán a `family[0]` jelölés alkalmazható. Pythonban ugyanehhez a `__getitem__()` speciális metódust kell megírnunk, míg C++-ban az `operator[]` túlterhelésével érhető el hasonló működés. Ezek a nyelvi lehetőségek ugyanazt a célt szolgálják, de önmagukban nem helyettesítik az index érvényességének ellenőrzését, illetve a gyűjtemény hozzáférésének szabályozását.

:::lang java
```java
Family family = new Family();
family.addMember(new Person("Anna Kovacs"));
Person first = family.getMember(0); // ellenőrzött, metódusos elérés
```
:::end

:::lang csharp
```csharp
// A Family osztályba kerülhet ez a property:
public Person this[int index] {
    get { return GetMember(index); }
}
// Ekkor a használat: Person first = family[0];
```
:::end

:::lang python
```python
# A Family osztályba kerülhet:
def __getitem__(self, index):
    return self.get_member(index)
# Ekkor a használat: first = family[0]
```
:::end

:::lang cpp
```cpp
// A Family osztályba kerülhet:
const Person& operator[](std::size_t index) const {
    return members.at(index);
}
// Ekkor a használat: const Person& first = family[0];
```
:::end

A gyűjtemény egy elemének visszaadása és egy elem lecserélése két külön művelet. Utóbbit csak akkor tegyük lehetővé, ha az osztály feladata valóban megengedi a korábban felvett példányok szabad cseréjét. A mi `Family` osztályunkban a cserét egyelőre nem biztosítjuk, mert a felvételhez kötött szabályokat minden módosításkor újra ellenőriznünk kellene.

## Feladatok {#exercises}

Az alábbi feladatokban minden mező típusa, láthatósága, érvényességi feltétele és az egyes műveletek pontos működése a feladatleírás része. A hozzájuk tartozó UML-diagramok ezeket a követelményeket szemléltetik, de a szöveg alapján önállóan is megvalósíthatók.

:::exercise
### Téglalapok

![Téglalapok – UML](content/chapters/05-kontenerosztalyok/media/task-1-hu.svg){width=580}

Az előző fejezetben elkészített `Rectangle` osztály példányainak tárolására hozzon létre `RectangleCollection` konténerosztályt. A konténer feladata nem csupán a tárolás, hanem annak biztosítása, hogy a nyilvántartás állapota kizárólag ellenőrzött műveletekkel változhasson.

**Mezők és property-k**

- `- rectangles : ArrayList<Rectangle>` – a konténer privát belső listája; a külvilág számára sem a mező, sem a belső lista referenciája nem adható ki.

**Konstruktorok**

- `+ RectangleCollection()` – a belső listát üres állapotban inicializálja.

**Metódusok**

- `getCount() : int` – visszaadja az eltárolt téglalapok számát.
- `getRectangle(index : int) : Rectangle` – visszaadja a megadott indexű példányt; érvénytelen index esetén `IndexOutOfBoundsException` kivételt dob.
- `addRectangle(rectangle : Rectangle) : void` – `null` példányt nem vesz fel, és azonos referenciát kétszer nem tárol; ilyen esetben `IllegalArgumentException` kivételt dob.
- `getLargeRectangles(minArea : double) : ArrayList<Rectangle>` – új listában adja vissza azokat, melyek területe szigorúan nagyobb `minArea` értékénél; nem adhatja vissza a belső listát.

A `get…(index)` metódus a kiválasztott objektumot adja vissza, tehát annak saját állapota továbbra is módosítható lehet; a lista összetételét azonban a hívó közvetlenül nem változtathatja meg. A duplikáció és a kiválogatás feltételeit a metódusok leírása határozza meg.

**Főprogram**

Vegyen fel legalább öt példányt, ellenőrizze a duplikációk tiltását, kérdezzen le érvényes és érvénytelen indexeket, végül próbálja ki a kiválogatást vagy összesítést. A belső lista sehol ne jelenjen meg publikus mezőként vagy közvetlenül visszaadott referenciaként.
:::endexercise

:::exercise
### Könyvek

![Könyvek – UML](content/chapters/05-kontenerosztalyok/media/task-2-hu.svg){width=580}

Az előző fejezetben elkészített `Book` osztály példányainak tárolására hozzon létre `Library` konténerosztályt. A konténer feladata nem csupán a tárolás, hanem annak biztosítása, hogy a nyilvántartás állapota kizárólag ellenőrzött műveletekkel változhasson.

**Mezők és property-k**

- `- books : ArrayList<Book>` – a konténer privát belső listája; a külvilág számára sem a mező, sem a belső lista referenciája nem adható ki.

**Konstruktorok**

- `+ Library()` – a belső listát üres állapotban inicializálja.

**Metódusok**

- `getCount() : int` – a könyvek számával tér vissza.
- `getBook(index : int) : Book` – a megfelelő könyvet adja vissza; hibás indexnél `IndexOutOfBoundsException` kivételt dob.
- `addBook(book : Book) : void` – nem enged `null` értéket, sem két olyan könyvet, amelyek szerzője és címe egyaránt azonos; hibánál `IllegalArgumentException` kivételt dob.
- `findBooksByAuthor(author : String) : ArrayList<Book>` – új listába gyűjti az adott szerző könyveit; ha nincs találat, üres listát ad.
- `getTotalPrice() : int` – összeadja a nyilvántartott könyvek aktuális árait; üres listánál `0`.

A `get…(index)` metódus a kiválasztott objektumot adja vissza, tehát annak saját állapota továbbra is módosítható lehet; a lista összetételét azonban a hívó közvetlenül nem változtathatja meg. A duplikáció és a kiválogatás feltételeit a metódusok leírása határozza meg.

**Főprogram**

Vegyen fel legalább öt példányt, ellenőrizze a duplikációk tiltását, kérdezzen le érvényes és érvénytelen indexeket, végül próbálja ki a kiválogatást vagy összesítést. A belső lista sehol ne jelenjen meg publikus mezőként vagy közvetlenül visszaadott referenciaként.
:::endexercise

:::exercise
### Autók

![Autók – UML](content/chapters/05-kontenerosztalyok/media/task-3-hu.svg){width=580}

Az előző fejezetben elkészített `Car` osztály példányainak tárolására hozzon létre `Garage` konténerosztályt. A konténer feladata nem csupán a tárolás, hanem annak biztosítása, hogy a nyilvántartás állapota kizárólag ellenőrzött műveletekkel változhasson.

**Mezők és property-k**

- `- cars : ArrayList<Car>` – a konténer privát belső listája; a külvilág számára sem a mező, sem a belső lista referenciája nem adható ki.

**Konstruktorok**

- `+ Garage()` – a belső listát üres állapotban inicializálja.

**Metódusok**

- `getCount() : int` – visszaadja az autók számát.
- `getCar(index : int) : Car` – érvényes indexű autót ad vissza, különben `IndexOutOfBoundsException` kivételt dob.
- `addCar(car : Car) : void` – a `null` értéket és ugyanannak a példánynak a kétszeri felvételét visszautasítja `IllegalArgumentException` kivétellel.
- `getCarsWithHighMileage(limit : int) : ArrayList<Car>` – új listába gyűjti azokat az autókat, amelyek kilométeróra-állása nagyobb a megadott határnál.

A `get…(index)` metódus a kiválasztott objektumot adja vissza, tehát annak saját állapota továbbra is módosítható lehet; a lista összetételét azonban a hívó közvetlenül nem változtathatja meg. A duplikáció és a kiválogatás feltételeit a metódusok leírása határozza meg.

**Főprogram**

Vegyen fel legalább öt példányt, ellenőrizze a duplikációk tiltását, kérdezzen le érvényes és érvénytelen indexeket, végül próbálja ki a kiválogatást vagy összesítést. A belső lista sehol ne jelenjen meg publikus mezőként vagy közvetlenül visszaadott referenciaként.
:::endexercise

:::exercise
### Bankszámlák

![Bankszámlák – UML](content/chapters/05-kontenerosztalyok/media/task-4-hu.svg){width=580}

Az előző fejezetben elkészített `BankAccount` osztály példányainak tárolására hozzon létre `Bank` konténerosztályt. A konténer feladata nem csupán a tárolás, hanem annak biztosítása, hogy a nyilvántartás állapota kizárólag ellenőrzött műveletekkel változhasson.

**Mezők és property-k**

- `- accounts : ArrayList<BankAccount>` – a konténer privát belső listája; a külvilág számára sem a mező, sem a belső lista referenciája nem adható ki.

**Konstruktorok**

- `+ Bank()` – a belső listát üres állapotban inicializálja.

**Metódusok**

- `getCount() : int` – a számlák számával tér vissza.
- `getAccount(index : int) : BankAccount` – a kiválasztott számlát adja vissza; hibás indexre `IndexOutOfBoundsException` kivételt dob.
- `addAccount(account : BankAccount) : void` – nem engedi a `null` értéket és az azonos számlaszámú példányok együttes tárolását; hibánál `IllegalArgumentException` kivételt dob.
- `findAccountsAbove(amount : int) : ArrayList<BankAccount>` – új listában adja vissza azokat a számlákat, amelyek egyenlege szigorúan nagyobb az összegnél.
- `getTotalBalance() : int` – összeadja a számlák egyenlegét; üres konténernél `0`.

A `get…(index)` metódus a kiválasztott objektumot adja vissza, tehát annak saját állapota továbbra is módosítható lehet; a lista összetételét azonban a hívó közvetlenül nem változtathatja meg. A duplikáció és a kiválogatás feltételeit a metódusok leírása határozza meg.

**Főprogram**

Vegyen fel legalább öt példányt, ellenőrizze a duplikációk tiltását, kérdezzen le érvényes és érvénytelen indexeket, végül próbálja ki a kiválogatást vagy összesítést. A belső lista sehol ne jelenjen meg publikus mezőként vagy közvetlenül visszaadott referenciaként.
:::endexercise

:::exercise
### Filmek

![Filmek – UML](content/chapters/05-kontenerosztalyok/media/task-5-hu.svg){width=580}

Az előző fejezetben elkészített `Movie` osztály példányainak tárolására hozzon létre `MovieCollection` konténerosztályt. A konténer feladata nem csupán a tárolás, hanem annak biztosítása, hogy a nyilvántartás állapota kizárólag ellenőrzött műveletekkel változhasson.

**Mezők és property-k**

- `- movies : ArrayList<Movie>` – a konténer privát belső listája; a külvilág számára sem a mező, sem a belső lista referenciája nem adható ki.

**Konstruktorok**

- `+ MovieCollection()` – a belső listát üres állapotban inicializálja.

**Metódusok**

- `getCount() : int` – visszaadja a filmek számát.
- `getMovie(index : int) : Movie` – a megadott indexű filmet adja vissza, vagy `IndexOutOfBoundsException` kivételt dob.
- `addMovie(movie : Movie) : void` – `null` példányt és azonos című, azonos rendezőjű duplikációt nem fogad el; hibánál `IllegalArgumentException` kivételt dob.
- `findLongMovies(minMinutes : int) : ArrayList<Movie>` – új listában adja vissza a paraméternél hosszabb filmeket.
- `getAverageDuration() : double` – a filmek átlagos hosszát adja vissza valós számként; üres listánál `0`.

A `get…(index)` metódus a kiválasztott objektumot adja vissza, tehát annak saját állapota továbbra is módosítható lehet; a lista összetételét azonban a hívó közvetlenül nem változtathatja meg. A duplikáció és a kiválogatás feltételeit a metódusok leírása határozza meg.

**Főprogram**

Vegyen fel legalább öt példányt, ellenőrizze a duplikációk tiltását, kérdezzen le érvényes és érvénytelen indexeket, végül próbálja ki a kiválogatást vagy összesítést. A belső lista sehol ne jelenjen meg publikus mezőként vagy közvetlenül visszaadott referenciaként.
:::endexercise
