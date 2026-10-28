# Absztrakt osztályok

Az öröklődés és a késői kötés megismerésekor láttuk, hogy a leszármazott osztályok a már megírt metódusokat felülírhatják, és a program futásakor az objektum tényleges típusa alapján választjuk ki a végrehajtandó változatot. Előfordulhat azonban, hogy egy osztályhierarchiában olyan magas szinten dolgozunk, ahol egy metódus feladatát már pontosan meg tudjuk fogalmazni, a megvalósítását viszont még nem. Tudjuk például, hogy minden kávéfajtához meg kell őrölni a kávét és át kell főzni a vizet, de azt nem tudjuk egyetlen közös algoritmussal megadni, hogy az egyes kávéfajták esetében milyen finomságú őrleményre és milyen főzési módra van szükség.

Ilyenkor nem célszerű egy olyan metódust készítenünk, amely semmit sem csinál, és arra számítanunk, hogy a leszármazottak majd felülírják. Ha erről megfeledkezünk, a program akár hibajelzés nélkül is helytelenül működhet. Az sem megfelelő megoldás, ha a metódus törzsében egyszerűen kivételt dobunk, mert a hiányzó megvalósítás csak futás közben derül ki. **Az absztrakt metódus lehetővé teszi, hogy egy műveletet előírjunk anélkül, hogy a törzsét megírnánk, és a konkrét leszármazott osztályokat kötelezzük annak megvalósítására.**

## Az absztrakt metódusok és osztályok {#abstract-methods}

Java-ban az ilyen metódusokat az `abstract` kulcsszóval jelöljük, és a deklaráció végére pontosvesszőt teszünk, vagyis nem írunk metódustörzset. Ha egy osztály tartalmaz absztrakt metódust, akkor magát az osztályt is `abstract` jelöléssel kell ellátnunk. Az absztrakt osztály ugyanakkor nem feltétlenül csak absztrakt metódusokból áll: tartalmazhat mezőket, konstruktorokat és teljes egészében implementált metódusokat is. Sőt, akkor is kijelölhetjük absztraktnak, ha egyetlen absztrakt metódusa sincs, amennyiben nem szeretnénk, hogy közvetlenül példányosítható legyen.

Az absztrakt osztályból önmagában nem hozhatunk létre példányt, de a típusa természetesen használható referenciaként, metódusparaméterként és konténerosztályok elemtípusaként. Egy konkrét leszármazott osztály köteles valamennyi még meg nem valósított absztrakt metódust implementálni, különben maga is absztrakt marad. Ez a követelmény fordításkor ellenőrizhető, ezért az absztrakt metódus a puszta felülírhatóságnál erősebb szerződést jelent a leszármazott osztályok számára.

Az alábbi példában minden fizetési módnak ki kell tudnia számítani a tranzakció díját, de a díjszámítás szabálya a fizetési mód típusától függ. A `PaymentMethod` már meg tudja valósítani a végösszeg meghatározását, mert abban elegendő meghívnia a később implementálandó `calculateFee()` metódust. A konkrét fizetési módok saját maguk adják meg ennek a metódusnak a működését.

:::lang java
```java
abstract class PaymentMethod {
    public abstract int calculateFee(int amount);

    public int calculateTotal(int amount) {
        return amount + calculateFee(amount);
    }
}

class BankTransfer extends PaymentMethod {
    @Override
    public int calculateFee(int amount) {
        return 150;
    }
}

class CardPayment extends PaymentMethod {
    @Override
    public int calculateFee(int amount) {
        return amount / 100;
    }
}

class Main {
    public static void main(String[] args) {
        PaymentMethod payment = new CardPayment();
        System.out.println(payment.calculateTotal(10000));
    }
}
```
:::end
:::lang csharp
```csharp
using System;

abstract class PaymentMethod {
    public abstract int CalculateFee(int amount);

    public int CalculateTotal(int amount) {
        return amount + CalculateFee(amount);
    }
}

class BankTransfer : PaymentMethod {
    public override int CalculateFee(int amount) {
        return 150;
    }
}

class CardPayment : PaymentMethod {
    public override int CalculateFee(int amount) {
        return amount / 100;
    }
}

class Program {
    static void Main() {
        PaymentMethod payment = new CardPayment();
        Console.WriteLine(payment.CalculateTotal(10000));
    }
}
```
:::end
:::lang python
```python
from abc import ABC, abstractmethod

class PaymentMethod(ABC):
    @abstractmethod
    def calculate_fee(self, amount):
        pass

    def calculate_total(self, amount):
        return amount + self.calculate_fee(amount)

class BankTransfer(PaymentMethod):
    def calculate_fee(self, amount):
        return 150

class CardPayment(PaymentMethod):
    def calculate_fee(self, amount):
        return amount // 100

payment = CardPayment()
print(payment.calculate_total(10000))
```
:::end
:::lang cpp
```cpp
#include <iostream>

class PaymentMethod {
public:
    virtual ~PaymentMethod() = default;
    virtual int calculateFee(int amount) const = 0;

    int calculateTotal(int amount) const {
        return amount + calculateFee(amount);
    }
};

class BankTransfer : public PaymentMethod {
public:
    int calculateFee(int amount) const override { return 150; }
};

class CardPayment : public PaymentMethod {
public:
    int calculateFee(int amount) const override { return amount / 100; }
};

int main() {
    CardPayment card;
    PaymentMethod& payment = card;
    std::cout << payment.calculateTotal(10000) << '\n';
}
```
:::end

![Absztrakt fizetési módok – UML](content/chapters/10-absztrakt-osztalyok/media/payment-hu.svg){width=620}

Az UML-diagramon az absztrakt osztály és az absztrakt metódus nevét dőlt betűvel jelöljük. A példában a `calculateTotal()` közös algoritmusa a különböző fizetési módok esetén is működik, hiszen a meghívott `calculateFee()` metódus a késői kötés szabályai szerint választódik ki. Fontos, hogy a konkrét leszármazott nem egy új, önálló díjszámítási felületet kap: ugyanazt a műveletet valósítja meg, amelyet az ősosztály már előírt.

## A kávékészítés algoritmusa {#coffee}

A kávékészítésnél az elkészítendő ital fajtájától függetlenül létezik egy jól meghatározott műveleti sorrend. Először megőröljük a kávét, majd átfőzzük, végül pedig – ha az adott italhoz szükséges – tejet adunk hozzá. A műveletek sorrendjét már a közös ősosztályban rögzíthetjük, miközben az őrlés és az átfőzés konkrét megvalósítását a leszármazottakra bízzuk. Az így kialakított megoldás a **Template Method** tervezési minta alapgondolatát szemlélteti: a közös algoritmus változatlan, annak egyes lépései viszont különbözőképpen valósulhatnak meg.

A `Coffee` osztályban a `prepare()` metódus határozza meg a műveletek sorrendjét. A `grind()` és `brew()` absztrakt metódusokat minden konkrét kávéfajtának implementálnia kell. Az `addMilk()` metódus ezzel szemben rendelkezik egy üres törzzsel: ez egy opcionális lépés, amelyet csak azok az italok írnak felül, amelyekhez valóban tejet adunk. Így a hallgatók egyetlen példán belül láthatják az absztrakt metódus és a felülírható, de nem kötelezően felülírandó metódus közötti különbséget.

:::lang java
```java
abstract class Coffee {
    protected abstract void grind();
    protected abstract void brew();

    protected void addMilk() { }

    public void prepare() {
        grind();
        brew();
        addMilk();
    }
}

class Espresso extends Coffee {
    @Override
    protected void grind() {
        System.out.println("Grind finely");
    }

    @Override
    protected void brew() {
        System.out.println("Brew 30 ml under high pressure");
    }
}

class Cappuccino extends Coffee {
    @Override
    protected void grind() {
        System.out.println("Grind finely");
    }

    @Override
    protected void brew() {
        System.out.println("Brew 30 ml under high pressure");
    }

    @Override
    protected void addMilk() {
        System.out.println("Add steamed milk and milk foam");
    }
}

class Main {
    public static void main(String[] args) {
        Coffee coffee = new Cappuccino();
        coffee.prepare();
    }
}
```
:::end
:::lang csharp
```csharp
using System;

abstract class Coffee {
    protected abstract void Grind();
    protected abstract void Brew();
    protected virtual void AddMilk() { }

    public void Prepare() {
        Grind();
        Brew();
        AddMilk();
    }
}

class Espresso : Coffee {
    protected override void Grind() => Console.WriteLine("Grind finely");
    protected override void Brew() => Console.WriteLine("Brew 30 ml under high pressure");
}

class Cappuccino : Coffee {
    protected override void Grind() => Console.WriteLine("Grind finely");
    protected override void Brew() => Console.WriteLine("Brew 30 ml under high pressure");
    protected override void AddMilk() => Console.WriteLine("Add steamed milk and milk foam");
}

class Program {
    static void Main() {
        Coffee coffee = new Cappuccino();
        coffee.Prepare();
    }
}
```
:::end
:::lang python
```python
from abc import ABC, abstractmethod

class Coffee(ABC):
    @abstractmethod
    def grind(self):
        pass

    @abstractmethod
    def brew(self):
        pass

    def add_milk(self):
        pass

    def prepare(self):
        self.grind()
        self.brew()
        self.add_milk()

class Espresso(Coffee):
    def grind(self):
        print("Grind finely")

    def brew(self):
        print("Brew 30 ml under high pressure")

class Cappuccino(Coffee):
    def grind(self):
        print("Grind finely")

    def brew(self):
        print("Brew 30 ml under high pressure")

    def add_milk(self):
        print("Add steamed milk and milk foam")

coffee = Cappuccino()
coffee.prepare()
```
:::end
:::lang cpp
```cpp
#include <iostream>

class Coffee {
protected:
    virtual void grind() const = 0;
    virtual void brew() const = 0;
    virtual void addMilk() const { }
public:
    virtual ~Coffee() = default;
    void prepare() const {
        grind();
        brew();
        addMilk();
    }
};

class Espresso : public Coffee {
protected:
    void grind() const override { std::cout << "Grind finely\n"; }
    void brew() const override { std::cout << "Brew 30 ml under high pressure\n"; }
};

class Cappuccino : public Coffee {
protected:
    void grind() const override { std::cout << "Grind finely\n"; }
    void brew() const override { std::cout << "Brew 30 ml under high pressure\n"; }
    void addMilk() const override {
        std::cout << "Add steamed milk and milk foam\n";
    }
};

int main() {
    Cappuccino cappuccino;
    Coffee& coffee = cappuccino;
    coffee.prepare();
}
```
:::end

![Kávékészítés – UML](content/chapters/10-absztrakt-osztalyok/media/coffee-hu.svg){width=620}

A kávét a példány létrehozása után készítjük el, ezért a `prepare()` metódust a főprogramból hívjuk meg, nem pedig az ősosztály konstruktorából. A konstruktor futásakor ugyanis a leszármazott osztály állapota még nem feltétlenül áll készen, ezért egy felülírható metódus meghívása ilyenkor váratlan eredményt okozhat. Az algoritmus ettől nem változik: továbbra is az ősosztály határozza meg, milyen lépésekből áll a kávékészítés, és a konkrét osztályok felelnek az egyes lépések megvalósításáért.

## Absztrakt osztályok használata {#usage}

Az absztrakt osztályok akkor különösen hasznosak, amikor több, közös tulajdonságokkal rendelkező objektumot szeretnénk egységesen kezelni, de a közös műveletek egy részének nincs minden objektumra érvényes algoritmusa. Készíthetünk például alakzatokat reprezentáló absztrakt osztályt, amely előírja a terület kiszámítását, vagy olyan dokumentumok közös ősét, amelyek eltérő szabályok alapján határozzák meg a feldolgozásuk költségét. A különböző leszármazott példányokat ilyenkor az ősosztály típusán keresztül tárolhatjuk egy listában, miközben a műveleteket saját megvalósításuk szerint végzik el.

Java-ban az absztrakt metódus nem lehet `private`, `static` vagy `final`, mert ezek a jelölések ellentmondanának annak, hogy a leszármazottaknak felül kell írniuk. Az osztály maga ugyanakkor tartalmazhat statikus metódusokat és olyan konkrét metódusokat is, amelyeket nem szeretnénk felülírhatóvá tenni. C#-ban az `abstract` és `override` kulcsszavakat, C++-ban a `virtual ... = 0` tisztán virtuális metódusokat, Pythonban pedig az `abc` modul `ABC` és `@abstractmethod` elemeit használjuk. A Pythonból és a C++-ból bemutatott példák működése megfelelően követi a Java alapelvét, a pontos nyelvi megvalósítás azonban eltér.

## Feladatok {#tasks}

Az alábbi feladatokban az eddig megismert osztályhierarchiákat olyan közös műveletekkel egészítjük ki, amelyeknek a megvalósítása a konkrét leszármazott típusától függ. Az osztályok mezőit és metódusait az UML-ábrák is tartalmazzák, a szükséges ellenőrzéseket és az algoritmusok működését azonban a szöveges leírás alapján kell megvalósítani.

:::exercise
### Téglalapok és alakzatok

![Alakzatok – UML](content/chapters/10-absztrakt-osztalyok/media/task-shapes-hu.svg){width=650}

**Osztályok és mezők**
- Az absztrakt `Shape` osztály tárolja a `name : String` mezőt. A név nem lehet `null` vagy üres; a `getName()` metódussal lekérdezhető, módosítását kívülről ne engedje.
- A `Rectangle` a pozitív valós `width` és `height` mezőt tárolja. A `Circle` a pozitív valós `radius` mezőt tartalmazza.

**Konstruktorok és metódusok**
- A `Shape(name : String)` konstruktor ellenőrizze és mentse el a nevet. A `Rectangle(name : String, width : double, height : double)` és `Circle(name : String, radius : double)` konstruktor a közös adatot az ősosztály konstruktorával inicializálja, majd ellenőrizze a saját adatait.
- A `Shape` deklarálja az absztrakt `getArea() : double` és `getPerimeter() : double` metódusokat. Mindkét leszármazott valósítsa meg azokat a geometriai képletek szerint.
- A közös, konkrét `isLargerThan(other : Shape) : boolean` metódus a két alakzat területét hasonlítsa össze, és igaz értékkel térjen vissza, ha az aktuális alakzat területe nagyobb. `null` paraméter esetén dobjon kivételt.
- A főprogramban helyezzen különböző alakzatokat egy `ArrayList<Shape>` listába, majd keresse meg a legnagyobb területűt!
:::endexercise

:::exercise
### Könyvek és kiadványok

![Kiadványok – UML](content/chapters/10-absztrakt-osztalyok/media/task-publications-hu.svg){width=650}

**Osztályok és mezők**
- Az absztrakt `Publication` osztály a nem üres `title : String` címet és a pozitív `basePrice : int` alapárat tárolja; az adatokat csak a konstruktor állíthatja be, és `getTitle()`, illetve `getBasePrice()` metódusokkal lehessen lekérdezni.
- A `Textbook` tartalmazza a pozitív `pageCount : int` oldalszámot. A `Magazine` tartalmazza a pozitív `issueNumber : int` lapszámot.

**Konstruktorok és metódusok**
- A `Publication(title : String, basePrice : int)` konstruktor validálja a közös adatokat. A leszármazottak konstruktora kapja meg a közös adatokat és a saját mezőjüket, majd mindegyiket ellenőrizze.
- A `Publication` írja elő az absztrakt `calculateShippingCost() : int` metódust. A tankönyv szállítási díja `600 + 2 * pageCount`, a magaziné pedig `400` forint.
- A `getTotalPrice() : int` konkrét metódus az alapárhoz adja hozzá a szállítási díjat. Ne készítsen külön végösszegszámító metódust a leszármazottakban.
- Készítsen `ArrayList<Publication>` listát, és keresse meg azt a kiadványt, amelynek a teljes ára a legnagyobb!
:::endexercise

:::exercise
### Járművek

![Járművek – UML](content/chapters/10-absztrakt-osztalyok/media/task-vehicles-hu.svg){width=650}

**Osztályok és mezők**
- Az absztrakt `Vehicle` osztály a nem üres `brand : String` márkanevet és a nemnegatív `mileage : int` kilométeróra-állást tárolja. Ezeket csak a konstruktor módosíthassa; lekérdezésükre készüljön `getBrand()` és `getMileage()` metódus.
- A `Car` egy pozitív `engineCapacity : int`, a `Motorcycle` pedig egy `sidecar : boolean` mezővel egészíti ki a közös adatokat.

**Konstruktorok és metódusok**
- A `Vehicle(brand : String, mileage : int)` konstruktor ellenőrizze a közös adatokat. A leszármazottak konstruktora hívja meg ezt, majd inicializálja a saját mezőjét.
- A `Vehicle` írja elő az absztrakt `getServiceInterval() : int` metódust. Az autó szervizintervalluma `15000` km, ha a hengerűrtartalma legalább `1600`, egyébként `10000` km. Motorkerékpár esetén oldalkocsival `5000`, oldalkocsi nélkül `7000` km.
- A `needsService(kmSinceService : int) : boolean` metódus a kapott nemnegatív értéket hasonlítsa össze az adott jármű szervizintervallumával, és annak elérésekor térjen vissza igaz értékkel; negatív bemenet esetén dobjon kivételt.
- Tároljon különböző járműveket `ArrayList<Vehicle>` listában, majd válogassa ki azokat, amelyeknél egy megadott megtett kilométerérték már szervizt indokol!
:::endexercise

:::exercise
### Bankszámlák

![Bankszámlák – UML](content/chapters/10-absztrakt-osztalyok/media/task-bank-hu.svg){width=650}

**Osztályok és mezők**
- Az absztrakt `BankAccount` osztály tárolja a nem üres `accountNumber : String` számlaszámot és a nemnegatív `balance : int` egyenleget. A számlaszám csak lekérdezhető legyen, az egyenleg pedig a korábban megírt jóváíró és terhelő metódusokon keresztül változhasson.
- A `SavingsAccount` pozitív vagy nulla `monthlyFreeTransfers : int` mezőt, a `BusinessAccount` pozitív `feePercent : double` százalékos díjtényezőt tároljon.

**Konstruktorok és metódusok**
- A `BankAccount(accountNumber : String, balance : int)` konstruktor validálja az adatokat, a leszármazottak konstruktora pedig a saját paramétereiket is ellenőrizzék.
- A `BankAccount` deklarálja az absztrakt `calculateTransferFee(amount : int) : int` metódust. Az összegnek pozitívnak kell lennie. Megtakarítási számlán a díj `0`, ha a még elérhető ingyenes átutalások száma pozitív, különben `300` forint. Üzleti számlán a díj az összeg és a díjtényező szorzatának felfelé kerekített értéke.
- A közös `canTransfer(amount : int) : boolean` metódus ellenőrizze, hogy az egyenleg fedezi-e az átutalandó összeget és a hozzá tartozó díjat. A metódus önmagában ne vonjon le pénzt és ne fogyassza az ingyenes átutalások számát.
- Egy `ArrayList<BankAccount>` listában gyűjtse ki azokat a számlákat, amelyekről egy `25000` forintos átutalás végrehajtható!
:::endexercise

:::exercise
### Filmek és sorozatok

![Filmek és sorozatok – UML](content/chapters/10-absztrakt-osztalyok/media/task-media-hu.svg){width=650}

**Osztályok és mezők**
- Az absztrakt `MediaItem` osztály tárolja a nem üres `title : String` címet és a pozitív `releaseYear : int` megjelenési évet. Ezeket a `getTitle()` és `getReleaseYear()` metódusokkal lehessen lekérdezni, de kívülről ne lehessen átírni.
- A `Movie` pozitív `duration : int` játékidőt tárol percben, a `Series` pedig pozitív `episodeCount : int` epizódszámot és `episodeDuration : int` átlagos epizódhosszt.

**Konstruktorok és metódusok**
- A `MediaItem(title : String, releaseYear : int)` konstruktor ellenőrizze és inicializálja a közös adatokat. A `Movie` és `Series` konstruktora a saját adataikat is validálja.
- A `MediaItem` írja elő az absztrakt `getTotalDuration() : int` metódust. Film esetén ez a játékidő, sorozat esetén az epizódok számának és átlagos hosszának szorzata.
- A közös `fitsInto(availableMinutes : int) : boolean` metódus ellenőrizze, hogy a nemnegatív időkeret legalább a teljes játékidővel egyenlő-e; negatív paraméter esetén dobjon kivételt.
- Egy `ArrayList<MediaItem>` listából válogassa ki azokat a filmeket és sorozatokat, amelyek teljes egészében megnézhetők egy négyórás időkereten belül!
:::endexercise
