# Adatrejtés, property

Az objektum-orientált programozás egyik fontos feladata az osztályok adatainak védelme. Ez magában foglalja azt, hogy az adatokhoz ne férhessenek hozzá illetéktelen személyek (vagy más forráskódrészletek), illetve megfelelő hozzáférés esetén se kerüljenek a mezőkbe érvénytelen adatok.

> **A félév során az adatok védelmét, illetve az illetéktelen személyek által történő hozzáférési kísérleteket úgy fogjuk szimulálni, hogy azt mondjuk, amit a főprogramban meg tudunk csinálni a példányok adataival, azt bárki más is meg tudja csinálni.**

## Láthatóság {#access-levels}

Az osztályok, azok mezői és metódusai mind rendelkeznek valamilyen láthatósági szinttel. Ahhoz, hogy az aktuális problémát és annak megoldását megértsük, az alábbi láthatósági szintek megismerése szükséges.

- **`public`**: tetszőleges helyről hozzáférhető
- **`private`**: csak a definiáló osztályban hozzáférhető
- **`protected`**: a definiáló osztályból, illetve az abból származtatott osztályokból hozzáférhető (Java-ban bizonyos esetekben az azonos csomagban lévő más osztályokból is)
- **csomagszintű láthatóság** (*package-private*): ha Java-ban nem írunk láthatósági módosítót, a tag azonos csomagból hozzáférhető

A C#-ban emellett létezik az **`internal`** láthatóság is, amely az adott assembly-n belüli hozzáférést biztosítja. A két nyelv láthatósági szabályai nem teljesen azonosak.

Az előző fejezetben bemutatott példák esetén az volt a probléma, hogy minden adatunkat a `public` kulcsszóval jelöltük meg, így azt bárki szabadon elérhette, és bármilyen érvénytelen adatot beleírhatott.

:::lang java
```java
class Hallgato {
    public String nev;
}

class Main {
    public static void main(String[] args) {
        Hallgato ede = new Hallgato();
        ede.nev = null;
        ede.nev = "E";
        ede.nev = "TrollEde";
        ede.nev = "Tr0ll 3d3";
    }
}
```
:::end

:::lang csharp
```csharp
class Hallgato
{
		public string nev;
		//...
}

class Program
{
		static void Main(string[] args)
		{
				Hallgato ede = new Hallgato();
				ede.nev = null;
				ede.nev = "E";
				ede.nev = "TrollEde";
				ede.nev = "Tr0ll 3d3";
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
ede.nev = None
ede.nev = "E"
ede.nev = "TrollEde"
ede.nev = "Tr0ll 3d3"
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
    ede.nev = "E";
    ede.nev = "TrollEde";
    ede.nev = "Tr0ll 3d3";
}
```
:::end


## Getter és setter metódusok {#getters-setters}

Annak érdekében, hogy az adatainkat megvédjük, korlátoznunk kell a hozzáférést. Ekkor azonban a főprogramban egyáltalán nem fogják azt elérni, így a hozzáférést publikus metódusokkal biztosítjuk. Az adatot módosító metódust klasszikus módon `setMezo`, míg az adathoz való hozzáférést biztosító metódust `getMezo` azonosítóval látjuk el. Ezeket **setter** és **getter** metódusoknak nevezzük. Java-ban ezeket szokás a JavaBeans elnevezési konvenciója szerint írni.

:::lang java
```java
class Hallgato {
    private String nev;

    public void setNev(String value) {
        nev = value;
    }

    public String getNev() {
        return nev;
    }
}

class Main {
    public static void main(String[] args) {
        Hallgato ede = new Hallgato();
        ede.setNev(null);
        ede.setNev("E");
        System.out.println(ede.getNev());
    }
}
```
:::end

:::lang csharp
```csharp
class Hallgato
{
		private string nev;
		public void SetNev(string value)
		{
				nev = value;
		}
		public string GetNev()
		{
				return nev;
		}
}

class Program
{
		static void Main(string[] args)
		{
				Hallgato ede = new Hallgato();
				ede.SetNev(null);
				ede.SetNev("E");				
				//...

				Console.WriteLine(ede.GetNev());
		}
}
```
:::end

:::lang python
```python
class Hallgato:
    def __init__(self):
        self._nev = None

    def set_nev(self, value):
        self._nev = value

    def get_nev(self):
        return self._nev

ede = Hallgato()
ede.set_nev(None)
ede.set_nev("E")
print(ede.get_nev())
```
:::end

:::lang cpp
```cpp
#include <string>
#include <iostream>
class Hallgato {
private:
    std::string nev;
public:
    void setNev(const std::string& value) { nev = value; }
    const std::string& getNev() const { return nev; }
};

int main() {
    Hallgato ede;
    ede.setNev("E");
    std::cout << ede.getNev();
}
```
:::end


Látszólag az egyik oldalon korlátoztuk a hozzáférést, a másik oldalon pedig biztosítottuk azt. Ugyanakkor, mivel a hozzáférést már metódusok biztosítják, lehetőségünk van arra, hogy a paraméterben kapott adatot validáljuk.

Az előző példákban mind a getter, mind a setter metódusokat `public` láthatósággal hoztuk létre. Ez azonban nem jelenti azt, hogy minden mező esetén mindkét műveletet engedélyeznünk kell. Előfordulhat, hogy egy adatot a főprogramból szeretnénk lekérdezni, de annak módosítását már nem kívánjuk megengedni. Ilyenkor elegendő egy publikus getter metódust készítenünk, a setter metódust pedig elhagyhatjuk, vagy szükség esetén `private` láthatósággal jelölhetjük meg. Fontos, hogy a mező értékét csak olyan helyről lehessen megváltoztatni, ahol a módosítás szabályait ellenőrizni tudjuk.

Mivel a getter és setter metódusok szerkezete gyakran nagyon hasonló, az IntelliJ IDEA lehetőséget biztosít arra, hogy ezeket automatikusan elkészítsük. Ehhez az osztály szerkesztése közben válasszuk a **Code → Generate… → Getter and Setter** menüpontot, majd jelöljük ki azokat a mezőket, amelyekhez metódusokat szeretnénk létrehozni. Ugyanez a művelet a **Generate…** helyi menüből is elérhető. Ügyeljünk arra, hogy a generált setter alapértelmezés szerint nem ellenőrzi a kapott adat helyességét, így a szükséges validációt nekünk kell megírnunk.

## Validáció és kivételek {#validation}

A validáció során a hibát sztenderd módon nem a konzolra való hibaüzenet írásával, vagy a gép sípoltatásával stb. jelezzük, hanem kivételt dobunk. A kivételkezeléssel egy későbbi fejezetben részletesen foglalkozunk majd, most elég annyit tudnunk, hogy a kivételek a `Throwable` osztály leszármazottai, és a `throw` kulcsszóval tudjuk őket feldobni. Érvénytelen paraméter esetén Java-ban gyakran `IllegalArgumentException`-t használunk.

:::lang java
```java
throw new IllegalArgumentException("Hibaüzenet");
```
:::end

:::lang csharp
```csharp
throw new Exception("Hibaüzenet");
```
:::end

:::lang python
```python
raise ValueError("Hibaüzenet")
```
:::end

:::lang cpp
```cpp
throw std::invalid_argument("Hibaüzenet");
```
:::end


Ha a kivételt a program nem kezeli, az aktuális művelet megszakad, és a kivétel továbbterjed a hívási láncon. A program futása csak akkor ér véget, ha a kivétel megfelelő kezelés nélkül eljut a szál legfelső szintjéig.

Tegyük fel, hogy a hallgatók nevére a következő kikötéseket szeretnénk tenni.

- nem lehet `null` vagy üres szöveg
- legalább egy szóközt kell tartalmaznia
- a név minden tagja legalább **2** karakter hosszú szöveg

Ebben az esetben a validáció az alábbi módon történhet. A Java-példa a `split(" ", -1)` hívással az esetleges üres névrészeket is megtartja, így a dupla szóköz sem kerülheti meg az ellenőrzést.

:::lang java
```java
class Hallgato {
    private String nev;

    public void setNev(String value) {
        if (value == null || value.isEmpty())
            throw new IllegalArgumentException("A név nem lehet üres szöveg!");

        if (!value.contains(" "))
            throw new IllegalArgumentException("A névnek legalább egy szóközt kell tartalmaznia!");

        String[] tagok = value.split(" ", -1);
        for (String tag : tagok) {
            if (tag.length() < 2)
                throw new IllegalArgumentException("A név minden tagja legyen legalább 2 karakter!");
        }
        nev = value;
    }

    public String getNev() {
        return nev;
    }
}
```
:::end

:::lang csharp
```csharp
class Hallgato
{
		private string nev;
		public void SetNev(string value)
		{
				if (string.IsNullOrEmpty(value))
						throw new Exception("A név nem lehet üres szöveg!");

				if (!value.Contains(' '))
						throw new Exception("A névnek legalább egy ' ' karaktert tartalmaznia kell!");				

				string[] tagok = value.Split(' ');
				foreach (string tag in tagok)
				{
						if (tag.Length < 2)
								throw new Exception("A név minden tagjának legalább 2 karaktert kell tartalmaznia!");
				}

				nev = value;
		}
		public string GetNev()
		{
				return nev;
		}
}
```
:::end

:::lang python
```python
class Hallgato:
    def __init__(self):
        self._nev = None

    def set_nev(self, value):
        if not value:
            raise ValueError("A név nem lehet üres szöveg!")
        if " " not in value:
            raise ValueError("A névnek szóközt kell tartalmaznia!")
        if any(len(tag) < 2 for tag in value.split(" ")):
            raise ValueError("A név minden tagja legyen legalább 2 karakter!")
        self._nev = value

    def get_nev(self):
        return self._nev
```
:::end

:::lang cpp
```cpp
#include <string>
#include <stdexcept>
#include <sstream>
class Hallgato {
private:
    std::string nev;
public:
    void setNev(const std::string& value) {
        if (value.empty())
            throw std::invalid_argument("A nev nem lehet ures!");
        if (value.find(' ') == std::string::npos)
            throw std::invalid_argument("A nevnek szokoz kell!");
        std::istringstream parts(value);
        std::string part;
        while (std::getline(parts, part, ' ')) {
            if (part.size() < 2)
                throw std::invalid_argument("A nev minden tagja legalabb 2 karakter!");
        }
        nev = value;
    }
    const std::string& getNev() const { return nev; }
};
```
:::end


## Láthatóság az UML-ben {#uml-access}

A hozzáférés szabályozásának UML-jelölései közül a `+` publikus, a `-` privát, a `#` pedig védett láthatóságot jelöl. Az UML-ben a láthatóságot mindig az adott mező vagy metódus előtt tüntetjük fel.

![UML](content/chapters/03-adatrejtes/media/hallgato-hu.svg){width=370}

## Nyelvi szinten támogatott property {#properties}

A C# nyelvi szinten támogatja a property-ket, ezért ott a `get` és `set` segítségével a hozzáférés mezőszerű szintaxissal is megvalósítható. Java-ban nincs ennek megfelelő beépített property-szintaxis: klasszikus getter és setter metódusokat használunk. Pythonban a `@property` dekorátor nyújt hasonló lehetőséget.

:::lang java
```java
// Java-ban nincs C#-hoz hasonló property szintaxis.
// Getter és setter metódusokkal dolgozunk.
class Hallgato {
    private String nev;

    public void setNev(String value) {
        // validáció
        nev = value;
    }

    public String getNev() {
        return nev;
    }
}
```
:::end

:::lang csharp
```csharp
class Hallgato
{
		private string nev;
		public void Nev
		{
				set
				{
						//validáció

						nev = value;
				}
				get
				{
						return nev;
				}
		}
}
```
:::end

:::lang python
```python
class Hallgato:
    def __init__(self):
        self._nev = None

    @property
    def nev(self):
        return self._nev

    @nev.setter
    def nev(self, value):
        # validáció
        self._nev = value
```
:::end

:::lang cpp
```cpp
// C++-ban nincs beépített C# property szintaxis.
class Hallgato {
private:
    std::string nev;
public:
    void setNev(const std::string& value) {
        // validáció
        nev = value;
    }
    const std::string& getNev() const { return nev; }
};
```
:::end


A C#-példában szereplő `public void Nev` deklaráció hibás: egy szöveges property esetén helyesen `public string Nev`-et kell írnunk.

Láthatjuk, hogy a C# `set` részében van egy `value` nevű implicit paraméterünk, melynek típusa megegyezik a property típusával. A `get` résznek pedig kompatibilis típusú adatot kell visszaadnia. A property-t a főprogramból hasonlóan használhatjuk, mint egy mezőt.

:::lang java
```java
class Main {
    public static void main(String[] args) {
        Hallgato ede = new Hallgato();
        ede.setNev("Troll Ede");
        System.out.println(ede.getNev());
    }
}
```
:::end

:::lang csharp
```csharp
class Program
{
		static void Main(string[] args)
		{
				Hallgato ede = new Hallgato();
				ede.Nev = "Troll Ede";
				Console.WriteLine(ede.Nev);
		}
}
```
:::end

:::lang python
```python
ede = Hallgato()
ede.nev = "Troll Ede"
print(ede.nev)
```
:::end

:::lang cpp
```cpp
#include <iostream>
int main() {
    Hallgato ede;
    ede.setNev("Troll Ede");
    std::cout << ede.getNev();
}
```
:::end


## Feladatok {#exercises}

Az alábbi feladatokban minden mező típusa, láthatósága, érvényességi feltétele és az egyes műveletek pontos működése a feladatleírás része. A hozzájuk tartozó UML-diagramok ezeket a követelményeket szemléltetik, de a szöveg alapján önállóan is megvalósíthatók.

:::exercise
### Téglalapok
![Téglalapok – UML](content/chapters/03-adatrejtes/media/complete-task-1-hu.svg){width=560}
Hozza létre a `Rectangle` osztályt, és valósítsa meg a következő mezőket és metódusokat a megadott működési feltételekkel!

**Mezők és property-k**
- `x : double` – a bal felső csúcs vízszintes koordinátája; tetszőleges valós szám. Privát mező; a `getX() : double` getter és a `setX(x : double) : void` setter publikus. A koordinátát szabadon módosíthatjuk.
- `y : double` – a bal felső csúcs függőleges koordinátája; tetszőleges valós szám. Privát mező; a `getY() : double` getter és a `setY(y : double) : void` setter publikus. A koordinátát szabadon módosíthatjuk.
- `width : double` – a téglalap szélessége; az adatrejtéstől kezdve szigorúan pozitív. Privát mező, publikus `getWidth() : double` getterrel és `setWidth(width : double) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.
- `height : double` – a téglalap magassága; az adatrejtéstől kezdve szigorúan pozitív. Privát mező, publikus `getHeight() : double` getterrel és `setHeight(height : double) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.

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
![Könyvek – UML](content/chapters/03-adatrejtes/media/complete-task-2-hu.svg){width=560}
Hozza létre a `Book` osztályt, és valósítsa meg a következő mezőket és metódusokat a megadott működési feltételekkel!

**Mezők és property-k**
- `author : String` – szerző; legalább két karakter, csak betű, szóköz, pont és kötőjel használható. Privát mező, publikus `getAuthor() : String` getterrel és `setAuthor(author : String) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.
- `title : String` – a könyv címe; legalább két karakter. Privát mező, publikus `getTitle() : String` getterrel és `setTitle(title : String) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.
- `price : int` – a könyv ára egész forintban; érvényes tartomány `[500; 50 000]`. Privát mező, publikus `getPrice() : int` getterrel és `setPrice(price : int) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.
- `genre : Genre` – felsorolás típus; pl. BIOGRAPHY, HORROR, DRAMA, HISTORY, SCIFI, COMEDY. Privát mező, publikus `getGenre() : Genre` getterrel és `setGenre(genre : Genre) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.
- `printed : boolean` – igaz, ha nyomtatott könyv; hamis, ha e-könyv. Privát mező; a `isPrinted() : boolean` getter és a `setPrinted(printed : boolean) : void` setter publikus. A logikai érték nem igényel további validációt.

**Metódusok**
- `discount(percent : int) : void` – `1` és `99` közötti egész százalékot vár; érvénytelen paraméternél nem változtat árat; a kerekítés egész forintra lefelé történik, és `899` forint alá nem enged árat csökkenteni.
- `toString() : String` – a könyv fontos adatait olvasható, többmezős szövegként adja vissza.
A fenti mezőkhöz tartozó getterek és setterek láthatóságát az egyes mezők leírása határozza meg. A validáció eredményétől függetlenül a hibás módosítás nem ronthatja el a korábban érvényes állapotot.

**Főprogram**
Hozzon létre öt különböző példányt, töltse fel az adataikat, majd próbálja ki a mezők lekérdezését és az elkészített metódusokat! Az új fejezetben bevezetett ellenőrzéseknél próbáljon ki helyes és hibás paramétereket is.
:::endexercise

:::exercise
### Autók
![Autók – UML](content/chapters/03-adatrejtes/media/complete-task-3-hu.svg){width=560}
Hozza létre a `Car` osztályt, és valósítsa meg a következő mezőket és metódusokat a megadott működési feltételekkel!

**Mezők és property-k**
- `brand : String` – márka; nem lehet `null` vagy üres. Privát mező, publikus `getBrand() : String` getterrel és `setBrand(brand : String) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.
- `model : String` – modell; nem lehet `null` vagy üres. Privát mező, publikus `getModel() : String` getterrel és `setModel(model : String) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.
- `year : int` – gyártási év, `[1886; 2100]` intervallumban. Privát mező, publikus `getYear() : int` getterrel és `setYear(year : int) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.
- `mileage : int` – kilométeróra-állás egész kilométerben, nemnegatív. Privát mező; csak a `getMileage() : int` publikus getter szükséges; az érték kizárólag a megfelelő műveleten és a konstruktoron keresztül változhat.

**Metódusok**
- `drive(distance : int) : void` – csak pozitív egész kilométert fogad, és a `mileage` mező értékét ennyivel növeli.
- `toString() : String` – megjeleníthető szövegként adja vissza a márkát, modellt, évjáratot és kilométeróra-állást.
A fenti mezőkhöz tartozó getterek és setterek láthatóságát az egyes mezők leírása határozza meg. A validáció eredményétől függetlenül a hibás módosítás nem ronthatja el a korábban érvényes állapotot.

**Főprogram**
Hozzon létre öt különböző példányt, töltse fel az adataikat, majd próbálja ki a mezők lekérdezését és az elkészített metódusokat! Az új fejezetben bevezetett ellenőrzéseknél próbáljon ki helyes és hibás paramétereket is.
:::endexercise

:::exercise
### Bankszámlák
![Bankszámlák – UML](content/chapters/03-adatrejtes/media/complete-task-4-hu.svg){width=560}
Hozza létre a `BankAccount` osztályt, és valósítsa meg a következő mezőket és metódusokat a megadott működési feltételekkel!

**Mezők és property-k**
- `owner : String` – a tulajdonos neve; nem lehet `null` vagy üres. Privát mező, publikus `getOwner() : String` getterrel és `setOwner(owner : String) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.
- `accountNumber : String` – számlaszám; nem lehet `null` vagy üres, létrehozás után nem változtatható. Privát mező: `getAccountNumber() : String` publikus getterrel és `setAccountNumber(accountNumber : String) : void` publikus setterrel. Csak az első érvényes érték adható meg; a későbbi módosítás dobjon kivételt.
- `balance : int` – egyenleg egész forintban; nemnegatív. Privát mező; csak a `getBalance() : int` publikus getter szükséges; az érték kizárólag a megfelelő műveleten és a konstruktoron keresztül változhat.

**Metódusok**
- `deposit(amount : int) : void` – csak pozitív összeget fogad, és azt hozzáadja az egyenleghez.
- `withdraw(amount : int) : void` – csak pozitív, az egyenlegnél nem nagyobb összeget enged levonni.
- `getBalance() : int` – a pillanatnyi egyenleget adja vissza.
- `toString() : String` – visszaadja a számlaszámot, tulajdonost és az egyenleget tartalmazó szöveget.
A fenti mezőkhöz tartozó getterek és setterek láthatóságát az egyes mezők leírása határozza meg. A validáció eredményétől függetlenül a hibás módosítás nem ronthatja el a korábban érvényes állapotot.

**Főprogram**
Hozzon létre öt különböző példányt, töltse fel az adataikat, majd próbálja ki a mezők lekérdezését és az elkészített metódusokat! Az új fejezetben bevezetett ellenőrzéseknél próbáljon ki helyes és hibás paramétereket is.

Ebben a fejezetben a számlaszám egyszer adható meg egy publikus `setAccountNumber(String)` metódussal; új értékre utána már nem változtatható. A következő fejezetben ezt a kezdeti értékadást a konstruktor fogja átvenni.
:::endexercise

:::exercise
### Filmek
![Filmek – UML](content/chapters/03-adatrejtes/media/complete-task-5-hu.svg){width=560}
Hozza létre a `Movie` osztályt, és valósítsa meg a következő mezőket és metódusokat a megadott működési feltételekkel!

**Mezők és property-k**
- `director : String` – rendező; nem `null`, legalább két karakter, csak betű, szóköz, pont és kötőjel. Privát mező, publikus `getDirector() : String` getterrel és `setDirector(director : String) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.
- `title : String` – cím; nem `null` és legalább két karakter. Privát mező, publikus `getTitle() : String` getterrel és `setTitle(title : String) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.
- `duration : int` – játékidő egész percben; `[10; 360]` intervallumban. Privát mező, publikus `getDuration() : int` getterrel és `setDuration(duration : int) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.
- `language : Language` – a film nyelve felsorolás típusként. Privát mező, publikus `getLanguage() : Language` getterrel és `setLanguage(language : Language) : void` setterrel. Értékadást csak sikeres ellenőrzés után végezhet; hibás értéknél `IllegalArgumentException` kivételt dobjon, és a korábbi mezőértéket ne módosítsa.
- `subtitles : boolean` – igaz, ha a film feliratos. Privát mező; a `hasSubtitles() : boolean` getter és a `setSubtitles(subtitles : boolean) : void` setter publikus. A logikai érték nem igényel további validációt.
- `actors : ArrayList<String>` – szereplők listája; a mező privát, a külső kód csak másolatot kaphat. Privát mező; a `getActors() : ArrayList<String>` publikus getter védelmi másolatot adjon vissza; a módosítást csak a megfelelő hozzáadó metódus biztosítsa.
- `categories : ArrayList<Genre>` – műfajok listája; privát, a getter csak másolatot adhat. Privát mező; a `getCategories() : ArrayList<Genre>` publikus getter védelmi másolatot adjon vissza; a módosítást csak a megfelelő hozzáadó metódus biztosítsa.

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
