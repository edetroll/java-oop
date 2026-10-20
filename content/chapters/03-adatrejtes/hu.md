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

### A getter és setter metódusok láthatósága {#accessor-visibility}

Az előző példákban mind a getter, mind a setter metódusokat `public` láthatósággal hoztuk létre. Ez azonban nem jelenti azt, hogy minden mező esetén mindkét műveletet engedélyeznünk kell. Előfordulhat, hogy egy adatot a főprogramból szeretnénk lekérdezni, de annak módosítását már nem kívánjuk megengedni. Ilyenkor elegendő egy publikus getter metódust készítenünk, a setter metódust pedig elhagyhatjuk, vagy szükség esetén `private` láthatósággal jelölhetjük meg. Fontos, hogy a mező értékét csak olyan helyről lehessen megváltoztatni, ahol a módosítás szabályait ellenőrizni tudjuk.

### Getterek és setterek generálása IntelliJ IDEA-ban {#generate-accessors}

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


> Az eredeti C#-példában a `public void Nev` sor szerepel. Ezt változatlanul megőriztük, de **C#-ban ez szintaktikai hiba**: egy szöveges property helyes deklarációja `public string Nev`.

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

Ebben a fejezetben a feladatunk az, hogy a korábbi példákat kiegészítsük az adatok validációjával. **Minden korábban elkészített metódus maradjon meg!** Az érvénytelen adatokat a setterek és az adatfelvételi metódusok utasítsák el kivétellel; a hibás próbálkozás után a korábban tárolt érvényes adat ne változzon meg.

:::exercise
### Téglalapok

![UML](content/chapters/03-adatrejtes/media/task1-hu.svg){width=340}

Az előző fejezet `Teglalap` osztályát egészítse ki! A bal felső csúcs `x` és `y` koordinátája tetszőleges valós szám lehet, a **szélesség** és a **magasság** azonban csak pozitív valós szám lehet.

- Minden mező legyen `private`.
- Valósítsa meg a getter és setter metódusokat!
- Érvénytelen szélesség vagy magasság esetén dobjon `IllegalArgumentException` kivételt!
- A **kerület**, **terület**, **átfedés** és **síknegyed** metódusok működjenek továbbra is!

A főprogramban próbáljon meg `0`, illetve negatív szélességet és magasságot beállítani. Ellenőrizze, hogy a hibás érték nem kerül a téglalapba!

:::endexercise

:::exercise
### Könyvek

![UML](content/chapters/03-adatrejtes/media/task2-hu.svg){width=380}

Az előző fejezet `Konyv` osztályát egészítse ki az alábbi validációkkal!

- **Szerző:** nem lehet `null` vagy üres, legalább **2** karakteres; csak betűket, szóközt, pontot (`.`) és kötőjelet (`-`) tartalmazhat. A szóközre a többtagú nevek miatt van szükség.
- **Cím:** nem lehet `null` vagy üres, legalább **2** karakteres.
- **Ár:** egész szám az **[500; 50 000]** intervallumban.
- **Műfaj:** használjon `enum` típust (pl. életrajzi, horror, dráma, történelmi, sci-fi, komédia).
- **Nyomtatott:** logikai típus.

Minden mező legyen `private`. Valósítsa meg a getter és setter metódusokat! A **leárazás** metódusnak is be kell tartania az ár új korlátait: ha a számított ár `500` Ft alá kerülne, dobjon kivételt és ne változtasson a tárolt áron. A korábbi **899 Ft-os** alsó kedvezményes határ továbbra is érvényes, tehát ténylegesen azt kell betartani.

A főprogramban teszteljen érvényes és érvénytelen bemeneteket, majd jelenítse meg a könyveket a `toString()` metódussal!

:::endexercise

:::exercise
### Filmek

![UML](content/chapters/03-adatrejtes/media/task3-hu.svg){width=440}

Az előző fejezet `Film` osztályát egészítse ki! A **rendező** és a **cím** mezőkre a Könyvek feladatban megadott szöveges ellenőrzéseket alkalmazza. A film **hossza** egész szám az **[10; 360]** intervallumban; a **nyelv** és a **kategóriák** tárolására `enum` típusokat használjon.

- A **szereplőket** most listában tárolja, és biztosítson `szereploHozzaadasa(String nev)` metódust, mely validálja a nevet, és megakadályozza a duplikációt.
- A **kategóriákat** szintén listában tárolja; egy kategóriát csak egyszer lehessen hozzáadni.
- A listák legyenek `private` mezők. A getterek **másolatot** adjanak vissza, hogy a főprogram ne tudja a belső listát közvetlenül módosítani.
- A korábban megírt szereplőkeresés és `toString()` továbbra is működjön!

**Segítség:** Java-ban használhatja az `ArrayList` típust és annak `add`, `contains` metódusait, valamint a `new ArrayList<>(eredetiLista)` másolatkészítést. Ezekhez nem szükséges a gyűjtemények részletes ismerete.

A főprogramból próbáljon meg érvénytelen adatot, illetve ismétlődő szereplőt és kategóriát hozzáadni! Ellenőrizze azt is, hogy a getter által visszaadott lista módosítása nem változtatja meg a film adatait.

:::endexercise
