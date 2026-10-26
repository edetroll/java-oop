# Konstruktorok

A property metódusok és nyelvi szinten támogatott property-k használatával biztosítottuk, hogy a példányok mezőibe ne kerülhessen érvénytelen adat. Azt viszont nem biztosítja semmi, hogy a példányosítás után minden szükséges adat rendelkezésre álljon. A **konstruktorok** célja éppen az, hogy a példány mezőit megfelelő kezdőértékekkel lássák el, és biztosítsák azoknak az adatoknak a létét, melyek nélkül a példány nem tud megfelelően működni. Természetesen a konstruktorban megadott értékeket is ellenőriznünk kell.

A konstruktor egy speciális metódus, melyet a **példányosítás** során hívunk meg. Java-ban a `new` kulcsszóval hozzuk létre a példányt, ekkor fut le a megfelelő konstruktor.

:::lang java
```java
class Hallgato {
    private String nev;

    public void setNev(String nev) {
        this.nev = nev;
    }
}

class Main {
    public static void main(String[] args) {
        Hallgato ede = new Hallgato();
        Hallgato gergely = new Hallgato();
    }
}
```
:::end

:::lang csharp
```csharp
class Hallgato
{
		public string Nev { get; set; }
		//...
}

class Program
{
		static void Main(string[] args)
		{
				Hallgato ede = new Hallgato();
				Hallgato gergely = new Hallgato();
				//...
		}
}
```
:::end

:::lang python
```python
class Hallgato:
    def __init__(self):
        self.nev = None

ede = Hallgato()
gergely = Hallgato()
```
:::end

:::lang cpp
```cpp
#include <string>

class Hallgato {
public:
    std::string nev;
};

int main() {
    Hallgato ede;
    Hallgato gergely;
}
```
:::end

Hogyan néz ki általános formában a konstruktor? A konstruktor neve megegyezik az osztály nevével, de nincs visszatérési típusa.

:::lang java
```java
class ClassNev {
    // accessModifier ClassNev(parameterList) {
    // }
}
```
:::end

:::lang csharp
```csharp
class OsztalyNeve
{
		[lathatosag] OsztalyNeve([formalis parameterlista])
		{
		}
}
```
:::end

:::lang python
```python
class ClassName:
    def __init__(self, parameters):
        pass
```
:::end

:::lang cpp
```cpp
class ClassName {
public:
    ClassName(/* parameter list */) {
    }
};
```
:::end

Jogosan merül fel a kérdés, hogy az előző példában hogyan hívhattunk meg egy olyan konstruktort, amit meg sem írtunk? A válasz az, hogy amennyiben egy osztályhoz egyetlen konstruktort sem készítünk, akkor a fordító automatikusan létrehoz egy paraméter nélküli, alapértelmezett konstruktort. Java-ban ennek láthatósága az osztály láthatóságához igazodik.

:::lang java
```java
class Hallgato {
    private String nev;

    public Hallgato() {
    }
}
```
:::end

:::lang csharp
```csharp
class Hallgato
{
		public Hallgato()
		{
		}

		public string Nev { get; set; }
		//...
}
```
:::end

:::lang python
```python
class Hallgato:
    def __init__(self):
        self.nev = None
```
:::end

:::lang cpp
```cpp
#include <string>

class Hallgato {
public:
    Hallgato() {}
    std::string nev;
};
```
:::end

Természetesen arra is van lehetőség, hogy a konstruktor paraméterben megkapja azokat az adatokat, amelyek nélkül a példány nem működhet megfelelően. Az adatokat ugyanúgy validálnunk kell, mint a setter metódusok esetén.

Az alábbi példában a konstruktor `nev` nevű paramétert kap, miközben az osztálynak is van egy ugyanilyen nevű mezője. Ilyenkor a `nev` önmagában a paramétert jelöli, a `this.nev` pedig az aktuális példány mezőjét. A `this` kulcsszó ugyanis mindig arra a példányra hivatkozik, amelyen a konstruktor vagy a példánymetódus éppen dolgozik. Ha a paraméternek más nevet adnánk, akkor ebben az esetben nem lenne szükség a `this` használatára.

:::lang java
```java
class Hallgato {
    private String nev;

    public Hallgato(String nev) {
        this.nev = nev;
    }
}
```
:::end

:::lang csharp
```csharp
class Hallgato
{
		public Hallgato(string nev)
		{
				Nev = nev;
		}

		public string Nev { get; set; }
		//...
}
```
:::end

:::lang python
```python
class Hallgato:
    def __init__(self, nev):
        self.nev = nev
```
:::end

:::lang cpp
```cpp
#include <string>

class Hallgato {
public:
    explicit Hallgato(const std::string& nev) : nev(nev) {}
    std::string nev;
};
```
:::end

![UML](content/chapters/04-konstruktorok/media/constructor-hu.svg){width=330}

Fontos, hogy amennyiben írunk paraméteres konstruktort, de nem írunk paraméter nélkülit, úgy a fordító nem készíti el számunkra automatikusan az utóbbit! Ilyenkor a példányosításhoz a megírt konstruktor valamelyikét kell meghívnunk.

:::lang java
```java
class Hallgato {
    private String nev;

    public Hallgato(String nev) {
        this.nev = nev;
    }
}

class Main {
    public static void main(String[] args) {
        Hallgato ede = new Hallgato("Troll Ede");
        Hallgato gergely = new Hallgato(); // Fordítási hiba: nincs paraméter nélküli konstruktor.
    }
}
```
:::end

:::lang csharp
```csharp
class Hallgato
{
		public Hallgato(string nev)
		{
				Nev = nev;
		}

		public string Nev { get; set; }
		//...
}

class Program
{
		static void Main(string[] args)
		{
				Hallgato ede = new Hallgato("Troll Ede");
				Hallgato gergely = new Hallgato(); //Ez a sor hibát jelez, mivel nincs ilyen konstruktor. A program nem fordítható!
		}
}
```
:::end

:::lang python
```python
class Hallgato:
    def __init__(self, nev):
        self.nev = nev

ede = Hallgato("Troll Ede")
gergely = Hallgato()  # TypeError: hiányzik a kötelező 'nev' argumentum
```
:::end

:::lang cpp
```cpp
#include <string>

class Hallgato {
public:
    explicit Hallgato(const std::string& nev) : nev(nev) {}
    std::string nev;
};

int main() {
    Hallgato ede("Troll Ede");
    Hallgato gergely; // Fordítási hiba: nincs alapértelmezett konstruktor.
}
```
:::end

## Konstruktor-túlterhelés és konstruktorhívás {#constructor-chaining}

Egy osztályhoz természetesen **több konstruktort is készíthetünk**, amennyiben azok paraméterlistája különbözik egymástól. Ezt **konstruktor-túlterhelésnek** nevezzük. Így lehetőségünk van arra, hogy ugyanabból az osztályból eltérő mennyiségű adattal is létrehozzunk példányokat.

Érdemes azonban átgondolnunk, hogy az egyes konstruktorok törzsét külön-külön írjuk-e meg. Ha minden konstruktorban ugyanazokat a mezőket inicializáljuk és ellenőrizzük, akkor fölöslegesen ismételnénk a kódot. Java-ban lehetőségünk van arra, hogy **egy konstruktorból egy másik konstruktort hívjunk meg** a `this(...)` kifejezéssel. A `this.nev` tehát az aktuális példány mezőjét jelöli, a `this(...)` viszont egy másik konstruktort hív meg. A példáinkban ezt a hívást a konstruktor törzsének elejére írjuk. A következő példában a paraméter nélküli konstruktor a másik konstruktorra bízza a név beállítását.

:::lang java
```java
class Hallgato {
    private String nev;

    public Hallgato() {
        this("Ismeretlen Hallgato");
    }

    public Hallgato(String nev) {
        setNev(nev);
    }

    public void setNev(String nev) {
        if (nev == null || nev.isBlank())
            throw new IllegalArgumentException("A nev nem lehet ures!");
        this.nev = nev;
    }
}
```
:::end

:::lang csharp
```csharp
class Hallgato
{
    private string nev;

    public Hallgato() : this("Ismeretlen Hallgato")
    {
    }

    public Hallgato(string nev)
    {
        if (string.IsNullOrWhiteSpace(nev))
            throw new ArgumentException("A nev nem lehet ures!");
        this.nev = nev;
    }
}
```
:::end

:::lang python
```python
class Hallgato:
    def __init__(self, nev="Ismeretlen Hallgato"):
        if not nev or not nev.strip():
            raise ValueError("A nev nem lehet ures!")
        self.nev = nev
```
:::end

:::lang cpp
```cpp
#include <stdexcept>
#include <string>

class Hallgato {
    std::string nev;
public:
    Hallgato() : Hallgato("Ismeretlen Hallgato") {}

    explicit Hallgato(const std::string& nev) : nev(nev) {
        if (nev.empty())
            throw std::invalid_argument("A nev nem lehet ures!");
    }
};
```
:::end

A példában a név beállítását és ellenőrzését elegendő egy helyen megírnunk. Ha később további konstruktort készítünk, az is meghívhatja valamelyik már meglévőt. Az így kialakuló konstruktorhívások sorozatát **konstruktorhívási láncnak** nevezzük. Most még csak az ugyanazon osztályon belüli hívást vizsgáljuk; a teljes konstruktorhívási lánccal az öröklődés tárgyalása után foglalkozunk részletesen.

A C# hasonló lehetőséget biztosít a `: this(...)` használatával, C++-ban pedig delegáló konstruktort írhatunk. Pythonban a `__init__` metódus nem terhelhető túl ugyanilyen módon, de alapértelmezett paraméterértékekkel hasonló használatot érhetünk el.

## Feladatok {#exercises}

Az alábbi feladatokban minden mező típusa, láthatósága, érvényességi feltétele és az egyes műveletek pontos működése a feladatleírás része. A hozzájuk tartozó UML-diagramok ezeket a követelményeket szemléltetik, de a szöveg alapján önállóan is megvalósíthatók.

:::exercise
### Téglalapok
![Téglalapok – UML](content/chapters/04-konstruktorok/media/complete-task-1-hu.svg){width=560}
Hozza létre a `Rectangle` osztályt, és valósítsa meg a következő mezőket és metódusokat a megadott működési feltételekkel!

**Mezők és property-k**
- `x : double` – a bal felső csúcs vízszintes koordinátája; tetszőleges valós szám. Privát mező; a `getX() : double` getter és a `setX(x : double) : void` setter publikus. A koordinátát szabadon módosíthatjuk.
- `y : double` – a bal felső csúcs függőleges koordinátája; tetszőleges valós szám. Privát mező; a `getY() : double` getter és a `setY(y : double) : void` setter publikus. A koordinátát szabadon módosíthatjuk.
- `width : double` – a téglalap szélessége; az adatrejtéstől kezdve szigorúan pozitív. Privát mező, publikus `getWidth() : double` getterrel és `setWidth(width : double) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.
- `height : double` – a téglalap magassága; az adatrejtéstől kezdve szigorúan pozitív. Privát mező, publikus `getHeight() : double` getterrel és `setHeight(height : double) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.

**Konstruktorok**
- `Rectangle()` – A teljes paraméterlistájú konstruktort hívja meg; az elhagyott adat alapértéke a bal felső csúcs `(0,0)`, a méret `1 × 1`.
- `Rectangle(x : double, y : double, width : double, height : double)` – Ellenőrizze az összes megadott adatot! Hibás adat esetén dobjon kivételt, és ne hozzon létre érvénytelen példányt.

**Metódusok**
- `getPerimeter() : double` – paraméter nélküli függvény, a `2 × (width + height)` értékkel tér vissza.
- `getArea() : double` – paraméter nélküli függvény, a `width × height` értékkel tér vissza.
- `overlaps(other : Rectangle) : boolean` – a paraméterként kapott téglalappal való, pozitív területű metszetet vizsgálja; az érintkező oldalak önmagukban nem jelentenek átfedést.
- `getQuadrant() : int` – az `1`–`4` értékek egyikével tér vissza, ha a teljes téglalap szigorúan egy síknegyedben van; más esetben `-1`.
A fenti mezőkhöz tartozó getterek és setterek láthatóságát az egyes mezők leírása határozza meg. A validáció eredményétől függetlenül a hibás módosítás nem ronthatja el a korábban érvényes állapotot.

**Főprogram**
Hozzon létre öt különböző példányt, töltse fel az adataikat, majd próbálja ki a mezők lekérdezését és az elkészített metódusokat! Az új fejezetben bevezetett ellenőrzéseknél próbáljon ki helyes és hibás paramétereket is.
:::endexercise

:::exercise
### Könyvek
![Könyvek – UML](content/chapters/04-konstruktorok/media/complete-task-2-hu.svg){width=560}
Hozza létre a `Book` osztályt, és valósítsa meg a következő mezőket és metódusokat a megadott működési feltételekkel!

**Mezők és property-k**
- `author : String` – szerző; legalább két karakter, csak betű, szóköz, pont és kötőjel használható. Privát mező, publikus `getAuthor() : String` getterrel és `setAuthor(author : String) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.
- `title : String` – a könyv címe; legalább két karakter. Privát mező, publikus `getTitle() : String` getterrel és `setTitle(title : String) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.
- `price : int` – a könyv ára egész forintban; érvényes tartomány `[500; 50 000]`. Privát mező, publikus `getPrice() : int` getterrel és `setPrice(price : int) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.
- `genre : Genre` – felsorolás típus; pl. BIOGRAPHY, HORROR, DRAMA, HISTORY, SCIFI, COMEDY. Privát mező, publikus `getGenre() : Genre` getterrel és `setGenre(genre : Genre) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.
- `printed : boolean` – igaz, ha nyomtatott könyv; hamis, ha e-könyv. Privát mező; a `isPrinted() : boolean` getter és a `setPrinted(printed : boolean) : void` setter publikus. A logikai érték nem igényel további validációt.

**Konstruktorok**
- `Book(author : String, title : String, price : int, genre : Genre, printed : boolean)` – Ellenőrizze az összes megadott adatot! Hibás adat esetén dobjon kivételt, és ne hozzon létre érvénytelen példányt.
- `Book(author : String, title : String, price : int)` – A teljes paraméterlistájú konstruktort hívja meg; az elhagyott adat alapértéke `Genre.DRAMA` és nyomtatott könyv.

**Metódusok**
- `discount(percent : int) : void` – `1` és `99` közötti egész százalékot vár; érvénytelen paraméternél nem változtat árat; a kerekítés egész forintra lefelé történik, és `899` forint alá nem enged árat csökkenteni.
- `toString() : String` – a könyv fontos adatait olvasható, többmezős szövegként adja vissza.
A fenti mezőkhöz tartozó getterek és setterek láthatóságát az egyes mezők leírása határozza meg. A validáció eredményétől függetlenül a hibás módosítás nem ronthatja el a korábban érvényes állapotot.

**Főprogram**
Hozzon létre öt különböző példányt, töltse fel az adataikat, majd próbálja ki a mezők lekérdezését és az elkészített metódusokat! Az új fejezetben bevezetett ellenőrzéseknél próbáljon ki helyes és hibás paramétereket is.
:::endexercise

:::exercise
### Autók
![Autók – UML](content/chapters/04-konstruktorok/media/complete-task-3-hu.svg){width=560}
Hozza létre a `Car` osztályt, és valósítsa meg a következő mezőket és metódusokat a megadott működési feltételekkel!

**Mezők és property-k**
- `brand : String` – márka; nem lehet `null` vagy üres. Privát mező, publikus `getBrand() : String` getterrel és `setBrand(brand : String) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.
- `model : String` – modell; nem lehet `null` vagy üres. Privát mező, publikus `getModel() : String` getterrel és `setModel(model : String) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.
- `year : int` – gyártási év, `[1886; 2100]` intervallumban. Privát mező, publikus `getYear() : int` getterrel és `setYear(year : int) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.
- `mileage : int` – kilométeróra-állás egész kilométerben, nemnegatív. Privát mező; csak a `getMileage() : int` publikus getter szükséges; az érték kizárólag a megfelelő műveleten és a konstruktoron keresztül változhat.

**Konstruktorok**
- `Car(brand : String, model : String, year : int, mileage : int)` – Ellenőrizze az összes megadott adatot! Hibás adat esetén dobjon kivételt, és ne hozzon létre érvénytelen példányt.
- `Car(brand : String, model : String, year : int)` – A teljes paraméterlistájú konstruktort hívja meg; az elhagyott adat alapértéke `0` kilométeres futásteljesítmény.

**Metódusok**
- `drive(distance : int) : void` – csak pozitív egész kilométert fogad, és a `mileage` mező értékét ennyivel növeli.
- `toString() : String` – megjeleníthető szövegként adja vissza a márkát, modellt, évjáratot és kilométeróra-állást.
A fenti mezőkhöz tartozó getterek és setterek láthatóságát az egyes mezők leírása határozza meg. A validáció eredményétől függetlenül a hibás módosítás nem ronthatja el a korábban érvényes állapotot.

**Főprogram**
Hozzon létre öt különböző példányt, töltse fel az adataikat, majd próbálja ki a mezők lekérdezését és az elkészített metódusokat! Az új fejezetben bevezetett ellenőrzéseknél próbáljon ki helyes és hibás paramétereket is.
:::endexercise

:::exercise
### Bankszámlák
![Bankszámlák – UML](content/chapters/04-konstruktorok/media/complete-task-4-hu.svg){width=560}
Hozza létre a `BankAccount` osztályt, és valósítsa meg a következő mezőket és metódusokat a megadott működési feltételekkel!

**Mezők és property-k**
- `owner : String` – a tulajdonos neve; nem lehet `null` vagy üres. Privát mező, publikus `getOwner() : String` getterrel és `setOwner(owner : String) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.
- `accountNumber : String` – számlaszám; nem lehet `null` vagy üres, létrehozás után nem változtatható. Privát mező; csak publikus `getAccountNumber() : String` getter készüljön; publikus setter nincs, az értéket a konstruktor állítja be.
- `balance : int` – egyenleg egész forintban; nemnegatív. Privát mező; csak a `getBalance() : int` publikus getter szükséges; az érték kizárólag a megfelelő műveleten és a konstruktoron keresztül változhat.

**Konstruktorok**
- `BankAccount(owner : String, accountNumber : String, balance : int)` – Ellenőrizze az összes megadott adatot! Hibás adat esetén dobjon kivételt, és ne hozzon létre érvénytelen példányt.
- `BankAccount(owner : String, accountNumber : String)` – A teljes paraméterlistájú konstruktort hívja meg; az elhagyott adat alapértéke `0` forintos kezdőegyenleg.

**Metódusok**
- `deposit(amount : int) : void` – csak pozitív összeget fogad, és azt hozzáadja az egyenleghez.
- `withdraw(amount : int) : void` – csak pozitív, az egyenlegnél nem nagyobb összeget enged levonni.
- `getBalance() : int` – a pillanatnyi egyenleget adja vissza.
- `toString() : String` – visszaadja a számlaszámot, tulajdonost és az egyenleget tartalmazó szöveget.
A fenti mezőkhöz tartozó getterek és setterek láthatóságát az egyes mezők leírása határozza meg. A validáció eredményétől függetlenül a hibás módosítás nem ronthatja el a korábban érvényes állapotot.

**Főprogram**
Hozzon létre öt különböző példányt, töltse fel az adataikat, majd próbálja ki a mezők lekérdezését és az elkészített metódusokat! Az új fejezetben bevezetett ellenőrzéseknél próbáljon ki helyes és hibás paramétereket is.
:::endexercise

:::exercise
### Filmek
![Filmek – UML](content/chapters/04-konstruktorok/media/complete-task-5-hu.svg){width=560}
Hozza létre a `Movie` osztályt, és valósítsa meg a következő mezőket és metódusokat a megadott működési feltételekkel!

**Mezők és property-k**
- `director : String` – rendező; nem `null`, legalább két karakter, csak betű, szóköz, pont és kötőjel. Privát mező, publikus `getDirector() : String` getterrel és `setDirector(director : String) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.
- `title : String` – cím; nem `null` és legalább két karakter. Privát mező, publikus `getTitle() : String` getterrel és `setTitle(title : String) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.
- `duration : int` – játékidő egész percben; `[10; 360]` intervallumban. Privát mező, publikus `getDuration() : int` getterrel és `setDuration(duration : int) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.
- `language : Language` – a film nyelve felsorolás típusként. Privát mező, publikus `getLanguage() : Language` getterrel és `setLanguage(language : Language) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.
- `subtitles : boolean` – igaz, ha a film feliratos. Privát mező; a `hasSubtitles() : boolean` getter és a `setSubtitles(subtitles : boolean) : void` setter publikus. A logikai érték nem igényel további validációt.
- `actors : ArrayList<String>` – szereplők listája; a mező privát, a külső kód csak másolatot kaphat. Privát mező; a `getActors() : ArrayList<String>` publikus getter védelmi másolatot adjon vissza; a módosítást csak a megfelelő hozzáadó metódus biztosítsa.
- `categories : ArrayList<Genre>` – műfajok listája; privát, a getter csak másolatot adhat. Privát mező; a `getCategories() : ArrayList<Genre>` publikus getter védelmi másolatot adjon vissza; a módosítást csak a megfelelő hozzáadó metódus biztosítsa.

**Konstruktorok**
- `Movie(director : String, title : String, duration : int, language : Language, subtitles : boolean)` – Ellenőrizze az összes megadott adatot! Hibás adat esetén dobjon kivételt, és ne hozzon létre érvénytelen példányt.
- `Movie(director : String, title : String, duration : int, language : Language)` – A teljes paraméterlistájú konstruktort hívja meg; az elhagyott adat alapértéke nem feliratos film.

**Metódusok**
- `hasActor(name : String) : boolean` – megállapítja, hogy a keresett színész szerepel-e a filmben.
- `addActor(name : String) : void` – a rendezőéhez hasonló névellenőrzés után felveszi a színészt, de duplikációt nem enged.
- `addCategory(genre : Genre) : void` – nem `null` műfajt vesz fel, ismétlés nélkül.
- `getActors() : ArrayList<String>` – új listában adja vissza a szereplőket.
- `getCategories() : ArrayList<Genre>` – új listában adja vissza a műfajokat.
- `toString() : String` – olvasható szöveg, `óra:perc:00` időformátummal; a feliratozást csak nem magyar filmnél említi.
A fenti mezőkhöz tartozó getterek és setterek láthatóságát az egyes mezők leírása határozza meg. A validáció eredményétől függetlenül a hibás módosítás nem ronthatja el a korábban érvényes állapotot.

**Főprogram**
Hozzon létre öt különböző példányt, töltse fel az adataikat, majd próbálja ki a mezők lekérdezését és az elkészített metódusokat! Az új fejezetben bevezetett ellenőrzéseknél próbáljon ki helyes és hibás paramétereket is.
:::endexercise
