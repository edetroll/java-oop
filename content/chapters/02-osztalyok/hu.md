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

:::exercise
### Téglalapok

![UML: Teglalap](content/chapters/02-osztalyok/media/teglalap.svg){width=330}

Hozzon létre `Teglalap` osztályt, mely olyan téglalapok tárolására alkalmas, melyek oldalélei párhuzamosak a koordinátatengelyekkel. Minden téglalap esetén tároljuk az alábbi **adatokat**.

- bal felső csúcs **x** koordinátája: valós szám
- bal felső csúcs **y** koordinátája: valós szám
- téglalap **szélessége**: valós szám
- téglalap **magassága**: valós szám

Az osztályon belül implementálja az alábbi metódusokat!

- téglalap **kerületének** kiszámítása: valós értékkel visszatérő, paraméter nélküli függvény
- téglalap **területének** kiszámítása: valós értékkel visszatérő, paraméter nélküli függvény
- **átfedés** megállapítása: logikai értékkel visszatérő függvény, mely paraméterben vár egy másik téglalapot. A metódus állapítsa meg, van-e a két téglalapnak pozitív területű közös része. A csupán egy oldal vagy csúcs mentén érintkező téglalapokat ne tekintse átfedőnek!
- tartalmazó **síknegyed** meghatározása: egész értékkel visszatérő, paraméter nélküli függvény. Határozza meg annak a síknegyednek a számát, melynek belsejében a téglalap teljes egészében elhelyezkedik. Amennyiben ez nem teljesül, úgy térjen vissza `-1` értékkel!

A koordináta-rendszerben az **y tengely felfelé pozitív**, a szélesség és a magasság pedig pozitív érték. A főprogramban hozzon létre **5** téglalap példányt, töltse föl adatokkal, majd hívja meg az implementált metódusaikat és jelenítse meg az eredményüket! A téglalapok között legyen átfedő, érintkező és különálló pár is.

:::endexercise

:::exercise
### Könyvek

![UML: Konyv](content/chapters/02-osztalyok/media/konyv.svg){width=340}

Hozzon létre `Konyv` osztályt, mely az alábbi adatok tárolására alkalmas.

- **szerző**: szöveges típus
- **cím**: szöveges típus
- a könyv **ára**: egész érték, forintban
- a könyv **műfaja**: szöveges típus (pl. életrajzi, horror, dráma, történelmi, sci-fi, komédia)
- **nyomtatott** könyv: logikai típus. Értéke igaz, ha a könyv nyomtatott, és hamis, ha e-könyv

Az osztályon belül implementálja az alábbi metódusokat!

- könyv **leárazása**: eljárás, mely paraméterben vár egy egész számot az **1–99** intervallumból. Amennyiben a paraméter értéke ennek az intervallumnak nem eleme, úgy ne változtassa meg az árat, és a metódus fejezze be a működését. Helyes paraméter esetén tekintsünk erre az értékre úgy, mint a leárazás százalékos mértékére és eszerint módosítsuk a könyv tárolt árát! A kedvezmény utáni árat egész forintra kerekítsük. **Kiegészítés:** a leárazás csak akkor történhessen meg, ha az új ár legalább **899 Ft** lenne!
- Írja felül a `toString()` metódust, hogy az a könyv adatait esztétikus formában adja vissza!

A főprogramban hozzon létre **5** könyv típusú példányt és töltse föl kedvenc könyveinek adataival, végül jelenítse meg azokat a képernyőn. Ezután hívja meg különböző, köztük érvénytelen leárazási értékekkel a metódust, és ismét jelenítse meg a példányokat!

:::endexercise

:::exercise
### Autók

![UML: Auto](content/chapters/02-osztalyok/media/car-hu.svg){width=320}

Hozzon létre `Auto` osztályt, mely az alábbi adatokat tárolja!

- **márka** és **típus**: szöveges típus
- **gyártási év**: egész szám
- **megtett kilométerek száma**: valós szám

Készítsen `Vezet` metódust, mely paraméterben megkapja a megtett távolságot, majd ennek megfelelően növeli a kilométeróra állását! A `toString()` metódus adja vissza az autó adatait esztétikus formában!

A főprogramban hozzon létre **5** autót, töltse föl adatokkal, majd több alkalommal hívja meg a `Vezet` metódust! Jelenítse meg az autók adatait az egyes műveletek előtt és után!
:::endexercise

:::exercise
### Bankszámlák

![UML: Bankszamla](content/chapters/02-osztalyok/media/bank-hu.svg){width=350}

Hozzon létre `Bankszamla` osztályt, mely a **tulajdonos nevét**, a **számlaszámot** és az **egyenleget** tárolja! Az egyenleget egyelőre egész forintban kezeljük.

Az osztályon belül implementáljon `Befizet` és `Kivesz` metódusokat! Az első paraméterben kapott összeggel növelje, a második csökkentse az egyenleget. Készítsen metódust az aktuális egyenleg lekérdezésére is!

A főprogramban hozzon létre **3** bankszámlát! Kezdeményezzen több befizetést és pénzfelvételt, majd jelenítse meg az egyenlegeket! Egyelőre nem kell ellenőriznie, hogy helyesek-e a megadott összegek; ezzel a következő fejezetben foglalkozunk.
:::endexercise

:::exercise
### Filmek

![UML: Film](content/chapters/02-osztalyok/media/film.svg){width=360}

Hozzon létre `Film` osztályt, mely az alábbi adatok tárolására alkalmas.

- **rendező**: szöveges típus
- **cím**: szöveges típus
- **szereplők**: három külön szöveges mező, melyekben legfeljebb három színész nevét tároljuk
- film **hossza**: egész szám, percben
- **kategória**: szöveges típus (pl. vígjáték, életrajzi, sci-fi, horror, thriller, dráma)
- **nyelv**: szöveges típus (pl. magyar, angol, német, francia, kínai)
- **feliratos** film: logikai típus

Az osztályon belül implementálja az alábbi metódusokat!

- **szerepel a filmben**: logikai értékkel visszatérő függvény, mely paraméterben fogadja egy keresett színész nevét. Vizsgálja meg a három szereplőmezőt, és döntse el, hogy valamelyikben szerepel-e a keresett név. Üres mező esetén az adott mezőt hagyja figyelmen kívül!
- Írja felül a `toString()` metódust és jelenítse meg a film adatait esztétikus módon! A film hosszát `óra:perc:00` formátumban adja vissza, és azt, hogy feliratos-e, csak akkor jelenítse meg, ha a film nyelve nem magyar!

A főprogramban hozzon létre **5** filmtípusú példányt és töltse föl kedvenc filmjeinek adataival, végül jelenítse meg azokat a képernyőn. Ezután kérje be a felhasználótól egy színész nevét, és jelenítse meg azon filmek címeit, melyekben az szerepel!

:::endexercise
