# Egységbezárás

Az egységbezárás az OOP első alapelve, mely kimondja, hogy a valós világ objektumainak leképezésekor egyetlen egységbe zárjuk az azt meghatározó adatokat (mezőket) és az adatokat kezelő metódusokat. Az egységbezárást osztályok létrehozásával valósítjuk meg. Az osztályokat a `class` kulcsszóval vezetjük be.

:::lang java
```java
import java.time.LocalDate;

class Hallgato {
    public String nev;
    public String neptunkod;
    public LocalDate szuletesiDatum;

    public void regisztral(String kurzus) {
        // A regisztráció megvalósítása később következik.
    }

    public void lejelentkezik(String kurzus) {
        // A lejelentkezés megvalósítása később következik.
    }

    public boolean zarovizsgaraJelentkezhet() {
        // A feltételvizsgálat megvalósítása később következik.
        return false;
    }
}
```
:::end

:::lang csharp
```csharp
class Hallgato
{
		public string nev;
		public string neptunkod;
		public DateTime szuletesiDatum;
		//...

		public void Regisztral(string kurzus) { /*...*/ }
		public void Lejelentkezik(string kurzus) { /*...*/ }
		public bool ZarovizsgaraJelentkezhet() { /*...*/ }
		//...
}
```
:::end

:::lang python
```python
from datetime import date

class Hallgato:
    def __init__(self):
        self.nev = ""
        self.neptunkod = ""
        self.szuletesiDatum = None

    def regisztral(self, kurzus):
        pass

    def lejelentkezik(self, kurzus):
        pass

    def zarovizsgara_jelentkezhet(self):
        return False
```
:::end

:::lang cpp
```cpp
#include <string>
#include <ctime>

class Hallgato {
public:
    std::string nev;
    std::string neptunkod;
    std::tm szuletesiDatum{};

    void regisztral(const std::string& kurzus) { /* ... */ }
    void lejelentkezik(const std::string& kurzus) { /* ... */ }
    bool zarovizsgaraJelentkezhet() { return false; }
};
```
:::end

A fenti példában láthatjuk, hogy minden mező és metódus meg van jelölve a `public` kulcsszóval. Ezzel a későbbiekben fogunk részletesen foglalkozni. A metódusok törzse egyelőre csak helykitöltő, a tényleges működésüket később valósítjuk meg.

Az osztály tehát egyértelműen meghatározza, leírja annak az objektumnak a szerkezetét, struktúráját, amelyet reprezentál. A konkrét egyedeket, vagy **példányokat** a **példányosítás** során hozzuk létre.

:::lang java
```java
public static void main(String[] args) {
    Hallgato ede = new Hallgato();
    Hallgato gergo = new Hallgato();
}
```
:::end

:::lang csharp
```csharp
static void Main(string[] args)
{
		Hallgato ede = new Hallgato();
		Hallgato gergo = new Hallgato();
}
```
:::end

:::lang python
```python
ede = Hallgato()
gergo = Hallgato()
```
:::end

:::lang cpp
```cpp
int main() {
    Hallgato ede;
    Hallgato gergo;
}
```
:::end

Az egyes példányok mezőit és metódusait a példány azonosítóján keresztül a pont (**`.`**) operátorral érjük el.

:::lang java
```java
import java.time.LocalDate;

public static void main(String[] args) {
    Hallgato ede = new Hallgato();
    ede.nev = "Troll Ede";
    ede.szuletesiDatum = LocalDate.of(1987, 5, 4);
    ede.neptunkod = "QWER12";

    Hallgato gergo = new Hallgato();
    gergo.nev = "Kovásznai Gergely";
    gergo.szuletesiDatum = LocalDate.of(1977, 5, 10);
    gergo.neptunkod = "AWSD99";

    ede.regisztral("Bevezetés a számítógépi grafikába ea.");
    gergo.lejelentkezik("Komputergrafika gy.");
    boolean gergoMehetZVre = gergo.zarovizsgaraJelentkezhet();
}
```
:::end

:::lang csharp
```csharp
static void Main(string[] args)
{
		Hallgato ede = new Hallgato();
		ede.nev = "Troll Ede";
		ede.szuletesiDatum = DateTime.Parse("1987.05.04");
		ede.neptunkod = "QWER12";

		Hallgato gergo = new Hallgato();
		gergo.nev = "Kovásznai Gergely";
		gergo.szuletesiDatum = DateTime.Parse("1977.05.10");
		gergo.neptunkod = "AWSD99";

		ede.Regisztral("Bevezetés a számítógépi grafikába ea.");
		gergo.Lejelentkezik("Komputergrafika gy.");
		bool gergoMehetZVre = gergo.ZarovizsgaraJelentkezhet();
}
```
:::end

:::lang python
```python
from datetime import date

ede = Hallgato()
ede.nev = "Troll Ede"
ede.szuletesiDatum = date(1987, 5, 4)
ede.neptunkod = "QWER12"

gergo = Hallgato()
gergo.nev = "Kovásznai Gergely"
gergo.szuletesiDatum = date(1977, 5, 10)
gergo.neptunkod = "AWSD99"

ede.regisztral("Bevezetés a számítógépi grafikába ea.")
gergo.lejelentkezik("Komputergrafika gy.")
gergoMehetZVre = gergo.zarovizsgara_jelentkezhet()
```
:::end

:::lang cpp
```cpp
int main() {
    Hallgato ede;
    ede.nev = "Troll Ede";
    ede.szuletesiDatum = {0, 0, 0, 4, 4, 87}; // 1987.05.04
    ede.neptunkod = "QWER12";

    Hallgato gergo;
    gergo.nev = "Kovásznai Gergely";
    gergo.szuletesiDatum = {0, 0, 0, 10, 4, 77}; // 1977.05.10
    gergo.neptunkod = "AWSD99";

    ede.regisztral("Bevezetés a számítógépi grafikába ea.");
    gergo.lejelentkezik("Komputergrafika gy.");
    bool gergoMehetZVre = gergo.zarovizsgaraJelentkezhet();
}
```
:::end

A Java-ban a születési dátum tárolására a `LocalDate` osztályt használjuk. Ennek részletes működésével egyelőre nem foglalkozunk.

A példányok adatainak megjelenítését sztenderd módon nem úgy oldjuk meg, hogy az osztályba írunk egy metódust, ami közvetlenül a képernyőre ír. Azért nem teszünk így, mert ekkor platformfüggő megjelenítést kellene implementálni az osztályba. A feladat megoldásához tudni kell, hogy minden Java-osztálynak van őse, és ha mi magunk nem jelölünk ki őst, akkor az ősosztályunk automatikusan az `Object` osztály lesz. Az `Object` osztálytól öröklünk bizonyos metódusokat, melyeket felül tudunk írni. Anélkül, hogy megértenénk a működését, az osztályunkban az alábbi módon írjuk meg a `toString()` szöveges értékkel visszatérő metódust! Ebben egy szövegbe összegyűjtjük a fontos információkat, majd visszatérünk azzal.

Az alábbi metódust a `Hallgato` osztályon belül kell elhelyezni. Java-ban a metódus neve `toString()` (kis kezdőbetűvel), a `@Override` pedig jelzi, hogy egy örökölt metódust írunk felül.

:::lang java
```java
@Override
public String toString() {
    String szoveg = "";
    szoveg += "Név: " + nev + "\n";
    szoveg += "Neptunkód: " + neptunkod + "\n";
    szoveg += "Születési dátum: " + szuletesiDatum + "\n";
    return szoveg;
}
```
:::end

:::lang csharp
```csharp
class Hallgato
{
		public string nev;
		public string neptunkod;
		public DateTime szuletesiDatum;
		//...

		public override string ToString()
		{
				string szoveg = string.Empty;
				szoveg += "Név: " + nev + "\n";
				szoveg += "Neptunkód: " + neptunkod + "\n";
				szoveg += "Születési dátum: " + szuletesiDatum.ToString("yyyy.MM.dd (dddd)") + "\n";
				return szoveg;
		}
}
```
:::end

:::lang python
```python
def __str__(self):
    szoveg = "Név: " + self.nev + "\n"
    szoveg += "Neptunkód: " + self.neptunkod + "\n"
    szoveg += "Születési dátum: " + self.szuletesiDatum.strftime("%Y.%m.%d (%A)") + "\n"
    return szoveg
```
:::end

:::lang cpp
```cpp
// A Hallgato osztályon belül:
std::string toString() const {
    char datum[40];
    std::strftime(datum, sizeof(datum), "%Y.%m.%d (%A)", &szuletesiDatum);
    std::string szoveg = "Név: " + nev + "\n";
    szoveg += "Neptunkód: " + neptunkod + "\n";
    szoveg += "Születési dátum: " + std::string(datum) + "\n";
    return szoveg;
}
```
:::end

Amennyiben a fenti módon felüldefiniáltuk a `toString()` metódust, úgy a főprogramban a példányok adatainak megjelenítését az alábbi módon tudjuk megvalósítani.

:::lang java
```java
public static void main(String[] args) {
    Hallgato ede = new Hallgato();
    ede.nev = "Troll Ede";
    ede.szuletesiDatum = LocalDate.of(1987, 5, 4);
    ede.neptunkod = "QWER12";

    Hallgato gergo = new Hallgato();
    gergo.nev = "Kovásznai Gergely";
    gergo.szuletesiDatum = LocalDate.of(1977, 5, 10);
    gergo.neptunkod = "AWSD99";

    System.out.println(ede);
    System.out.println(gergo);
}
```
:::end

:::lang csharp
```csharp
static void Main(string[] args)
{
		Hallgato ede = new Hallgato();
		ede.nev = "Troll Ede";
		ede.szuletesiDatum = DateTime.Parse("1987.05.04");
		ede.neptunkod = "QWER12";

		Hallgato gergo = new Hallgato();
		gergo.nev = "Kovásznai Gergely";
		gergo.szuletesiDatum = DateTime.Parse("1977.05.10");
		gergo.neptunkod = "AWSD99";

		Console.WriteLine(ede);
		Console.WriteLine(gergo);
}
```
:::end

:::lang python
```python
from datetime import date

ede = Hallgato()
ede.nev = "Troll Ede"
ede.szuletesiDatum = date(1987, 5, 4)
ede.neptunkod = "QWER12"

gergo = Hallgato()
gergo.nev = "Kovásznai Gergely"
gergo.szuletesiDatum = date(1977, 5, 10)
gergo.neptunkod = "AWSD99"

print(ede)
print(gergo)
```
:::end

:::lang cpp
```cpp
#include <iostream>

int main() {
    Hallgato ede;
    ede.nev = "Troll Ede";
    ede.szuletesiDatum = {0, 0, 0, 4, 4, 87};
    ede.neptunkod = "QWER12";

    Hallgato gergo;
    gergo.nev = "Kovásznai Gergely";
    gergo.szuletesiDatum = {0, 0, 0, 10, 4, 77};
    gergo.neptunkod = "AWSD99";

    std::cout << ede.toString() << gergo.toString();
}
```
:::end

Az osztály szerkezetét UML-osztálydiagramon is ábrázolhatjuk. A téglalap felső része az osztály nevét, a középső a mezőket, az alsó pedig a metódusokat tartalmazza. A `+` jelölés jelentésével később foglalkozunk.

![UML: Hallgato](content/chapters/02-osztalyok/media/hallgato.svg){width=310}

## Feladatok {#exercises}

Az alábbi feladatokban minden mező típusa, láthatósága, érvényességi feltétele és az egyes műveletek pontos működése a feladatleírás része. A hozzájuk tartozó UML-diagramok ezeket a követelményeket szemléltetik, de a szöveg alapján önállóan is megvalósíthatók.

:::exercise
### Téglalapok
![Téglalapok – UML](content/chapters/02-osztalyok/media/complete-task-1-hu.svg){width=560}
Hozza létre a `Rectangle` osztályt, és valósítsa meg a következő mezőket és metódusokat a megadott működési feltételekkel!

**Mezők és property-k**
- `x : double` – bal felső csúcs x-koordinátája. Egyelőre publikus mező, amelyhez a főprogram közvetlenül hozzáférhet.
- `y : double` – bal felső csúcs y-koordinátája. Egyelőre publikus mező, amelyhez a főprogram közvetlenül hozzáférhet.
- `width : double` – a téglalap szélessége. Egyelőre publikus mező, amelyhez a főprogram közvetlenül hozzáférhet.
- `height : double` – a téglalap magassága. Egyelőre publikus mező, amelyhez a főprogram közvetlenül hozzáférhet.

**Metódusok**
- `getPerimeter() : double` – paraméter nélküli függvény, a `2 × (width + height)` értékkel tér vissza.
- `getArea() : double` – paraméter nélküli függvény, a `width × height` értékkel tér vissza.
- `overlaps(other : Rectangle) : boolean` – a paraméterként kapott téglalappal való, pozitív területű metszetet vizsgálja; az érintkező oldalak önmagukban nem jelentenek átfedést.
- `getQuadrant() : int` – az `1`–`4` értékek egyikével tér vissza, ha a teljes téglalap szigorúan egy síknegyedben van; más esetben `-1`.

**Főprogram**
Hozzon létre öt különböző példányt, töltse fel az adataikat, majd próbálja ki a mezők lekérdezését és az elkészített metódusokat!
:::endexercise

:::exercise
### Könyvek
![Könyvek – UML](content/chapters/02-osztalyok/media/complete-task-2-hu.svg){width=560}
Hozza létre a `Book` osztályt, és valósítsa meg a következő mezőket és metódusokat a megadott működési feltételekkel!

**Mezők és property-k**
- `author : String` – a szerző neve. Egyelőre publikus mező, amelyhez a főprogram közvetlenül hozzáférhet.
- `title : String` – a könyv címe. Egyelőre publikus mező, amelyhez a főprogram közvetlenül hozzáférhet.
- `price : int` – a könyv ára forintban. Egyelőre publikus mező, amelyhez a főprogram közvetlenül hozzáférhet.
- `genre : String` – műfaj, egyelőre szöveges típusként.
- `printed : boolean` – nyomtatott-e. Egyelőre publikus mező, amelyhez a főprogram közvetlenül hozzáférhet.

**Metódusok**
- `discount(percent : int) : void` – `1` és `99` közötti egész százalékot vár; érvénytelen paraméternél nem változtat árat; a kerekítés egész forintra lefelé történik, és `899` forint alá nem enged árat csökkenteni.
- `toString() : String` – a könyv fontos adatait olvasható, többmezős szövegként adja vissza.

**Főprogram**
Hozzon létre öt különböző példányt, töltse fel az adataikat, majd próbálja ki a mezők lekérdezését és az elkészített metódusokat!
:::endexercise

:::exercise
### Autók
![Autók – UML](content/chapters/02-osztalyok/media/complete-task-3-hu.svg){width=560}
Hozza létre a `Car` osztályt, és valósítsa meg a következő mezőket és metódusokat a megadott működési feltételekkel!

**Mezők és property-k**
- `brand : String` – márka. Egyelőre publikus mező, amelyhez a főprogram közvetlenül hozzáférhet.
- `model : String` – modell. Egyelőre publikus mező, amelyhez a főprogram közvetlenül hozzáférhet.
- `year : int` – gyártási év. Egyelőre publikus mező, amelyhez a főprogram közvetlenül hozzáférhet.
- `mileage : int` – kilométeróra-állás egész kilométerben. Egyelőre publikus mező, amelyhez a főprogram közvetlenül hozzáférhet.

**Metódusok**
- `drive(distance : int) : void` – csak pozitív egész kilométert fogad, és a `mileage` mező értékét ennyivel növeli.
- `toString() : String` – megjeleníthető szövegként adja vissza a márkát, modellt, évjáratot és kilométeróra-állást.

**Főprogram**
Hozzon létre öt különböző példányt, töltse fel az adataikat, majd próbálja ki a mezők lekérdezését és az elkészített metódusokat!
:::endexercise

:::exercise
### Bankszámlák
![Bankszámlák – UML](content/chapters/02-osztalyok/media/complete-task-4-hu.svg){width=560}
Hozza létre a `BankAccount` osztályt, és valósítsa meg a következő mezőket és metódusokat a megadott működési feltételekkel!

**Mezők és property-k**
- `owner : String` – a számlatulajdonos neve. Egyelőre publikus mező, amelyhez a főprogram közvetlenül hozzáférhet.
- `accountNumber : String` – számlaszám. Egyelőre publikus mező, amelyhez a főprogram közvetlenül hozzáférhet.
- `balance : int` – az egyenleg egész forintban. Egyelőre publikus mező, amelyhez a főprogram közvetlenül hozzáférhet.

**Metódusok**
- `deposit(amount : int) : void` – csak pozitív összeget fogad, és azt hozzáadja az egyenleghez.
- `withdraw(amount : int) : void` – csak pozitív, az egyenlegnél nem nagyobb összeget enged levonni.
- `getBalance() : int` – a pillanatnyi egyenleget adja vissza.
- `toString() : String` – visszaadja a számlaszámot, tulajdonost és az egyenleget tartalmazó szöveget.

**Főprogram**
Hozzon létre öt különböző példányt, töltse fel az adataikat, majd próbálja ki a mezők lekérdezését és az elkészített metódusokat!
:::endexercise

:::exercise
### Filmek
![Filmek – UML](content/chapters/02-osztalyok/media/complete-task-5-hu.svg){width=560}
Hozza létre a `Movie` osztályt, és valósítsa meg a következő mezőket és metódusokat a megadott működési feltételekkel!

**Mezők és property-k**
- `director : String` – rendező. Egyelőre publikus mező, amelyhez a főprogram közvetlenül hozzáférhet.
- `title : String` – film címe. Egyelőre publikus mező, amelyhez a főprogram közvetlenül hozzáférhet.
- `duration : int` – a film hossza percben. Egyelőre publikus mező, amelyhez a főprogram közvetlenül hozzáférhet.
- `language : Language` – nyelve. Egyelőre publikus mező, amelyhez a főprogram közvetlenül hozzáférhet.
- `subtitles : boolean` – feliratos-e. Egyelőre publikus mező, amelyhez a főprogram közvetlenül hozzáférhet.
- `actor1 : String` – a film egyik szereplőjének neve; ha nincs ennyi szereplő, az érték lehet `null`.
- `actor2 : String` – a film egyik szereplőjének neve; ha nincs ennyi szereplő, az érték lehet `null`.
- `actor3 : String` – a film egyik szereplőjének neve; ha nincs ennyi szereplő, az érték lehet `null`.
- `category : String` – a film műfaja, szövegként tárolva.

**Metódusok**
- `hasActor(name : String) : boolean` – megállapítja, hogy a keresett színész szerepel-e a filmben.
- `toString() : String` – olvasható szöveg, `óra:perc:00` időformátummal; a feliratozást csak nem magyar filmnél említi.

**Főprogram**
Hozzon létre öt különböző példányt, töltse fel az adataikat, majd próbálja ki a mezők lekérdezését és az elkészített metódusokat!
:::endexercise
