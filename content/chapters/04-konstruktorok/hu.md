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

Az előző fejezetekben elkészített öt osztályt most konstruktorokkal egészítjük ki. Ahol több konstruktort készítünk, lehetőleg egyik konstruktor hívja meg a másikat, hogy az inicializálást és az adatok ellenőrzését ne kelljen többször megírnunk.

:::exercise
### Téglalapok

![UML](content/chapters/04-konstruktorok/media/rect-hu.svg){width=355}

Az előző fejezet `Teglalap` osztályát egészítse ki paraméteres konstruktorral, amely megkapja a bal felső csúcs koordinátáit, valamint a téglalap szélességét és magasságát! A konstruktor végezze el a két oldalhossz ellenőrzését a már megírt setterek segítségével!

Készítsen paraméter nélküli konstruktort is, amely a `(0, 0)` pontból induló, `1 × 1` méretű téglalapot hozza létre! **Az új konstruktor hívja meg a paraméteres konstruktort**, ne írja meg újra az inicializálást! A főprogramban mindkét módon hozzon létre példányokat, majd jelenítse meg azok kerületét és területét!
:::endexercise

:::exercise
### Könyvek

![UML](content/chapters/04-konstruktorok/media/book-hu.svg){width=400}

A `Konyv` osztályhoz készítsen konstruktort, amely megkapja a szerzőt, a címet, az árat, a műfajt és azt, hogy a könyv nyomtatott-e! Az adatok ellenőrzését a korábban megírt metódusok végezzék el!

Készítsen második konstruktort is, amely csak a szerzőt, a címet és az árat várja. Ez a konstruktor **hívja meg az előző konstruktort**, és a hiányzó két adathoz használjon egy választott alapértelmezett műfajt és a nyomtatott könyv értéket! Hozzon létre legalább négy könyvet a két konstruktor segítségével, majd próbáljon meg érvénytelen árat átadni!
:::endexercise

:::exercise
### Autók

![UML](content/chapters/04-konstruktorok/media/car-hu.svg){width=355}

Az `Auto` osztályhoz készítsen olyan konstruktort, amely paraméterben várja a márkát, a típust, a gyártási évet és a kilométeróra kezdeti állását! A konstruktor biztosítsa, hogy minden adat megfeleljen az előző fejezetben megadott feltételeknek!

Készítsen egy második konstruktort is, amely csak a márkát, a típust és a gyártási évet kapja meg, a kilométeróra állását pedig nullának veszi. **A második konstruktor hívja meg az elsőt!** Hozzon létre három autót, majd a `Vezet` metódussal növelje az egyes példányok kilométeróra-állását!
:::endexercise

:::exercise
### Bankszámlák

![UML](content/chapters/04-konstruktorok/media/bank-hu.svg){width=400}

A `Bankszamla` osztályhoz készítsen konstruktort, mely megkapja a tulajdonos nevét, a számlaszámot és a kezdőegyenleget. A konstruktor csak érvényes adatokkal hozhasson létre példányt!

Írjon egy másik konstruktort is, amely csak a tulajdonos nevét és a számlaszámot várja, és **az előző konstruktort meghívva** nulla kezdőegyenlegű számlát készít! Az egyenleghez ne készítsen publikus setter metódust. A főprogramban hozzon létre több bankszámlát, majd tesztelje a befizetést és a pénzfelvételt!
:::endexercise

:::exercise
### Filmek

![UML](content/chapters/04-konstruktorok/media/movie-hu.svg){width=450}

Egészítse ki a `Film` osztályt olyan konstruktorral, amely megkapja a rendezőt, a címet, a film hosszát, a nyelvét és a feliratozásra vonatkozó logikai értéket! Az adatokat validálja, a szereplők és a kategóriák listáját pedig inicializálja üres listára!

Készítsen második konstruktort is, amely nem kap feliratozásra vonatkozó paramétert. Ez **hívja meg az előző konstruktort**, és alapértelmezetten felirat nélküli filmet hozzon létre! A főprogramban hozzon létre három filmet, adjon hozzájuk szereplőket és kategóriákat, végül jelenítse meg az adatokat! Ellenőrizze azt is, hogy a getterek által visszaadott listák módosítása nem változtatja meg a film belső adatait!
:::endexercise
