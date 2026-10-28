# Beágyazott és final osztályok

Az osztályok megtervezésekor nemcsak arról kell döntenünk, hogy milyen adatokkal és metódusokkal rendelkezzenek, hanem arról is, hogy a többi osztály milyen módon használhatja fel őket. Előfordulhat, hogy egy segédosztály kizárólag egy másik osztály működéséhez szükséges, és semmi értelme önálló, mindenki által elérhető típusként kezelni. Más esetekben az osztály vagy valamely metódusa már teljesen meghatározza a kívánt működést, és kifejezetten meg szeretnénk akadályozni, hogy később öröklődéssel megváltoztassák azt.

A két cél első látásra különböző, de mindkettő a program szerkezetének tudatos korlátozását szolgálja. A **beágyazott osztályok** segítségével a segédtípusokat oda helyezhetjük, ahol szükség van rájuk, és a hozzáférésüket is szabályozhatjuk. A **`final`** jelöléssel pedig Java-ban megakadályozhatjuk egy osztály továbbörökítését vagy egy metódus felülírását; mezőknél ugyanez a kulcsszó az újbóli értékadást korlátozza. A szabályozás így nem pusztán egy későbbi programozói megállapodás, hanem a fordító által ellenőrzött megkötés lesz.

## Beágyazott osztályok {#nested}

Java-ban egy osztály deklarációján belül újabb osztályt is létrehozhatunk. Ezt **beágyazott osztálynak** nevezzük. Használata akkor indokolt, ha az új típus szorosan kötődik a befoglaló osztály feladatához, és más osztályokban önálló jelentése nincs. Egy konténerosztály például tárolhat egy-egy könyv mellett kölcsönzési adatokat. Az ezeket összefogó `LoanRecord` típusra a könyvtár belső működésében szükség van, de a főprogramnak nem kell ismernie azt.

Ha a belső osztályt `private` láthatósággal deklaráljuk, kívülről nem hozhatunk létre és nem nevezhetünk meg ilyen típusú objektumokat. Ettől még a befoglaló osztály tetszés szerint használhatja a saját segédosztályát, és a külső program számára továbbra is a publikus metódusokon keresztül biztosíthatja a szükséges műveleteket. A beágyazás tehát nem helyettesíti az adatrejtést, hanem újabb eszközt ad ahhoz, hogy a belső megvalósítás részleteit ne tegyük a publikus felület részévé.

A következő példában a `Library` privát, statikusan beágyazott `LoanRecord` osztályt használ. A nyilvántartás minden eleméhez egy könyvazonosítót és a kölcsönzés napjainak számát tároljuk, a felhasználó viszont csak a könyv felvételét és a késedelmes kölcsönzések megszámlálását kérheti. A konténer belső elemeit nem adja ki módosítható listaként, így a nyilvántartás feletti kontroll továbbra is a `Library` osztálynál marad.

:::lang java
```java
import java.util.ArrayList;

class Library {
    private static class LoanRecord {
        private final String bookId;
        private final int days;

        private LoanRecord(String bookId, int days) {
            this.bookId = bookId;
            this.days = days;
        }
    }

    private final ArrayList<LoanRecord> loans = new ArrayList<>();

    public void addLoan(String bookId, int days) {
        if (bookId == null || bookId.isBlank() || days < 0)
            throw new IllegalArgumentException("Invalid loan");
        loans.add(new LoanRecord(bookId, days));
    }

    public int countOverdue(int allowedDays) {
        if (allowedDays < 0)
            throw new IllegalArgumentException("Invalid day limit");
        int count = 0;
        for (LoanRecord loan : loans)
            if (loan.days > allowedDays) count++;
        return count;
    }
}
```
:::end
:::lang csharp
```csharp
using System;
using System.Collections.Generic;

class Library {
    private class LoanRecord {
        public string BookId { get; }
        public int Days { get; }

        public LoanRecord(string bookId, int days) {
            BookId = bookId;
            Days = days;
        }
    }

    private readonly List<LoanRecord> loans = new();

    public void AddLoan(string bookId, int days) {
        if (string.IsNullOrWhiteSpace(bookId) || days < 0)
            throw new ArgumentException("Invalid loan");
        loans.Add(new LoanRecord(bookId, days));
    }

    public int CountOverdue(int allowedDays) {
        if (allowedDays < 0) throw new ArgumentException("Invalid day limit");
        int count = 0;
        foreach (LoanRecord loan in loans)
            if (loan.Days > allowedDays) count++;
        return count;
    }
}
```
:::end
:::lang python
```python
class Library:
    class _LoanRecord:
        def __init__(self, book_id, days):
            self.book_id = book_id
            self.days = days

    def __init__(self):
        self._loans = []

    def add_loan(self, book_id, days):
        if not book_id or not book_id.strip() or days < 0:
            raise ValueError("Invalid loan")
        self._loans.append(self._LoanRecord(book_id, days))

    def count_overdue(self, allowed_days):
        if allowed_days < 0:
            raise ValueError("Invalid day limit")
        return sum(loan.days > allowed_days for loan in self._loans)
```
:::end
:::lang cpp
```cpp
#include <string>
#include <vector>
#include <stdexcept>

class Library {
    struct LoanRecord {
        std::string bookId;
        int days;
    };

    std::vector<LoanRecord> loans;
public:
    void addLoan(const std::string& bookId, int days) {
        if (bookId.empty() || days < 0)
            throw std::invalid_argument("Invalid loan");
        loans.push_back({bookId, days});
    }

    int countOverdue(int allowedDays) const {
        if (allowedDays < 0)
            throw std::invalid_argument("Invalid day limit");
        int count = 0;
        for (const LoanRecord& loan : loans)
            if (loan.days > allowedDays) ++count;
        return count;
    }
};
```
:::end

![Beágyazott segédosztály – UML](content/chapters/11-final-beagyazott-osztalyok/media/library-hu.svg){width=650}

A Java-kódban a `static` jelölés azt fejezi ki, hogy a `LoanRecord` példányai nem kötődnek automatikusan egy konkrét `Library` példányhoz. A belső osztály külön példány nélkül is létrehozható a befoglaló osztály megfelelő kódjából, és közvetlenül az osztályszintű mezőket érheti el. Ez a megoldás különösen hasznos olyan segédtípusoknál, amelyek egy-egy adatpárt vagy belső rekordot reprezentálnak, de nincs szükségük a befoglaló objektum teljes állapotára.

## Nem statikus belső osztályok {#inner}

Java-ban készíthetünk **nem statikus belső osztályt** is. Ennek minden példánya egy konkrét befoglaló objektumhoz tartozik, ezért közvetlenül elérheti annak példányszintű, akár privát mezőit és metódusait. Egy `Garage` például saját, privát `servicePrice` mezővel rendelkezhet, és minden garázshoz tartozhat egy belső `ServiceTicket`, amely a garázs aktuális díjszabása alapján számítja ki egy szerelés költségét. Ebben az esetben indokolt, hogy a belső objektum kapcsolatban álljon egy meghatározott külső példánnyal.

:::lang java
```java
class Garage {
    private int servicePrice;

    public Garage(int servicePrice) {
        if (servicePrice <= 0) throw new IllegalArgumentException();
        this.servicePrice = servicePrice;
    }

    public class ServiceTicket {
        private int hours;

        public ServiceTicket(int hours) {
            if (hours <= 0) throw new IllegalArgumentException();
            this.hours = hours;
        }

        public int calculateCost() {
            return hours * servicePrice;
        }
    }
}

class Main {
    public static void main(String[] args) {
        Garage garage = new Garage(8000);
        Garage.ServiceTicket ticket = garage.new ServiceTicket(3);
        System.out.println(ticket.calculateCost());
    }
}
```
:::end
:::lang csharp
```csharp
using System;

class Garage {
    private int servicePrice;
    public Garage(int servicePrice) {
        if (servicePrice <= 0) throw new ArgumentException();
        this.servicePrice = servicePrice;
    }

    public class ServiceTicket {
        private Garage garage;
        private int hours;

        public ServiceTicket(Garage garage, int hours) {
            if (garage == null || hours <= 0) throw new ArgumentException();
            this.garage = garage;
            this.hours = hours;
        }

        public int CalculateCost() {
            return hours * garage.servicePrice;
        }
    }
}
```
:::end
:::lang python
```python
class Garage:
    def __init__(self, service_price):
        if service_price <= 0:
            raise ValueError("Invalid price")
        self._service_price = service_price

    class ServiceTicket:
        def __init__(self, garage, hours):
            if garage is None or hours <= 0:
                raise ValueError("Invalid ticket")
            self._garage = garage
            self._hours = hours

        def calculate_cost(self):
            return self._hours * self._garage._service_price

    def new_ticket(self, hours):
        return self.ServiceTicket(self, hours)

Garage(8000).new_ticket(3).calculate_cost()
```
:::end
:::lang cpp
```cpp
#include <stdexcept>

class Garage {
    int servicePrice;
public:
    explicit Garage(int price) : servicePrice(price) {
        if (price <= 0) throw std::invalid_argument("Invalid price");
    }

    class ServiceTicket {
        const Garage& garage;
        int hours;
    public:
        ServiceTicket(const Garage& garage, int hours)
            : garage(garage), hours(hours) {
            if (hours <= 0) throw std::invalid_argument("Invalid hours");
        }
        int calculateCost() const { return hours * garage.servicePrice; }
    };
};
```
:::end

![Nem statikus belső osztály – UML](content/chapters/11-final-beagyazott-osztalyok/media/garage-hu.svg){width=650}

A két megoldás között tehát nem csupán a példányosítás szintaxisában van különbség. A nem statikus Java-belsőosztály egy konkrét külső példányra hivatkozhat, a statikusan beágyazott osztály viszont nem kap ilyen kapcsolatot automatikusan. C#-ban, Pythonban és C++-ban a beágyazott típus létrehozása önmagában szintén nem ad automatikusan ilyen külső példánykapcsolatot, ezért azt szükség esetén külön referenciaként kell átadnunk. A beágyazás ezekben a nyelvekben is használható a típusok logikai csoportosítására és – a nyelv eszközeitől függően – a hozzáférés szabályozására; Pythonban az aláhúzással kezdődő név azonban elsősorban konvenció, nem valódi hozzáférési tiltás.

## Final osztályok {#final-classes}

Öröklődés használatakor korábban azt vizsgáltuk, hogyan bővíthetünk ki egy már meglévő osztályt. Előfordulhat azonban, hogy egy osztály működését lezártnak tekintjük, és nem szeretnénk belőle további osztályokat származtatni. Java-ban ezt a `final` kulcsszóval jelöljük az osztály deklarációjában. Ilyenkor az osztály továbbra is szabadon példányosítható, mezői és metódusai a láthatósági szabályoknak megfelelően használhatók, de más osztály nem nevezheti meg ősosztályaként.

Ez nem ugyanaz, mint amikor egy osztályt `private` konstruktorral látunk el. Utóbbi elsősorban azt szabályozza, hogyan lehet példányt létrehozni, és bizonyos öröklődési lehetőségeket is korlátozhat, de a célját egyértelműen a `final` jelölés fejezi ki. Egy `final` osztály már önmagában garantálja, hogy sem a viselkedését, sem a típusát nem bővíthetjük új leszármazottal. C#-ban az ennek megfelelő jelölés a `sealed`, C++-ban ugyancsak a `final`; Pythonban a `typing.final` dekorátor elsősorban statikus típusellenőrző eszközök számára jelzi ugyanezt az elvárást, és futás közben önmagában nem tiltja meg az öröklődést.

:::lang java
```java
final class InvoiceNumber {
    private final int value;

    public InvoiceNumber(int value) {
        if (value <= 0) throw new IllegalArgumentException();
        this.value = value;
    }

    public int getValue() { return value; }
}

// class SpecialInvoiceNumber extends InvoiceNumber { } // Fordítási hiba
```
:::end
:::lang csharp
```csharp
using System;

sealed class InvoiceNumber {
    private readonly int value;

    public InvoiceNumber(int value) {
        if (value <= 0) throw new ArgumentException();
        this.value = value;
    }

    public int GetValue() { return value; }
}

// class SpecialInvoiceNumber : InvoiceNumber { } // Fordítási hiba
```
:::end
:::lang python
```python
from typing import final

@final
class InvoiceNumber:
    def __init__(self, value):
        if value <= 0:
            raise ValueError("Invalid value")
        self._value = value

    def get_value(self):
        return self._value

# A típusellenőrző jelzi a hibás öröklődést,
# de a Python futtatókörnyezet önmagában nem tiltja meg.
```
:::end
:::lang cpp
```cpp
#include <stdexcept>

class InvoiceNumber final {
    const int value;
public:
    explicit InvoiceNumber(int value) : value(value) {
        if (value <= 0) throw std::invalid_argument("Invalid value");
    }
    int getValue() const { return value; }
};

// class SpecialInvoiceNumber : public InvoiceNumber { }; // Fordítási hiba
```
:::end

## Final metódusok és mezők {#final-members}

A `final` kulcsszóval nemcsak teljes osztályt zárhatunk le, hanem egy-egy metódust is. Egy ilyen metódus továbbra is öröklődik, a leszármazottak azonban nem írhatják felül. Ennek különösen akkor van értelme, ha egy művelet fontos ellenőrzéseket végez, és azt szeretnénk, hogy valamennyi leszármazott osztály ugyanazokat a szabályokat alkalmazza. Például a számláról történő pénzfelvétel általános ellenőrzése lehet `final`, miközben a különböző számlatípusok más műveletekkel továbbra is kiegészíthetők.

A `final` mező jelentése ettől eltér: egy Java-mezőhöz az inicializálás után nem rendelhetünk új értéket. Fontos azonban, hogy ha a mező egy objektumra hivatkozik, akkor a hivatkozás változatlansága nem teszi automatikusan változtathatatlanná a hivatkozott objektumot. Az `ArrayList` például `final` referencia mögött is bővíthető. Ugyanígy a `static final` mezők gyakran konstansokat jelölnek, de a módosítható objektumra hivatkozó `static final` mező önmagában még nem garantál teljes változtathatatlanságot.

:::lang java
```java
import java.util.ArrayList;

class BankAccount {
    private int balance;
    private final ArrayList<String> history = new ArrayList<>();

    public BankAccount(int balance) {
        if (balance < 0) throw new IllegalArgumentException();
        this.balance = balance;
    }

    public final void withdraw(int amount) {
        if (amount <= 0 || amount > balance)
            throw new IllegalArgumentException();
        balance -= amount;
        history.add("Withdrawal: " + amount);
    }

    public int getBalance() { return balance; }
}

class SavingsAccount extends BankAccount {
    public SavingsAccount(int balance) { super(balance); }
    // public void withdraw(int amount) { } // Fordítási hiba
}
```
:::end
:::lang csharp
```csharp
using System;
using System.Collections.Generic;

class BankAccount {
    private int balance;
    private readonly List<string> history = new();

    public BankAccount(int balance) {
        if (balance < 0) throw new ArgumentException();
        this.balance = balance;
    }

    public virtual void Withdraw(int amount) {
        if (amount <= 0 || amount > balance)
            throw new ArgumentException();
        balance -= amount;
        history.Add("Withdrawal: " + amount);
    }
    public int GetBalance() { return balance; }
}

class SavingsAccount : BankAccount {
    public SavingsAccount(int balance) : base(balance) { }
    public sealed override void Withdraw(int amount) {
        base.Withdraw(amount);
    }
}
```
:::end
:::lang python
```python
from typing import final

class BankAccount:
    def __init__(self, balance):
        if balance < 0:
            raise ValueError("Invalid balance")
        self._balance = balance
        self._history = []

    @final
    def withdraw(self, amount):
        if amount <= 0 or amount > self._balance:
            raise ValueError("Invalid amount")
        self._balance -= amount
        self._history.append(f"Withdrawal: {amount}")

    def get_balance(self):
        return self._balance

# @final: típusellenőrzési jelzés, nem futásidejű védelem
```
:::end
:::lang cpp
```cpp
#include <stdexcept>
#include <vector>
#include <string>

class BankAccount {
    int balance;
    const int accountId;
public:
    BankAccount(int balance, int accountId)
        : balance(balance), accountId(accountId) {
        if (balance < 0 || accountId <= 0)
            throw std::invalid_argument("Invalid account");
    }
    virtual ~BankAccount() = default;
    virtual void withdraw(int amount) final {
        if (amount <= 0 || amount > balance)
            throw std::invalid_argument("Invalid amount");
        balance -= amount;
    }
    int getBalance() const { return balance; }
};
```
:::end

![A final metódus szerepe – UML](content/chapters/11-final-beagyazott-osztalyok/media/final-method-hu.svg){width=570}

A C#-példában a `sealed override` kifejezés lezár egy már felülírt virtuális metódust. Ez eltér a Java megoldásától, ahol a `final` jelölés közvetlenül a metódus deklarációján is megjelenhet. C++-ban a `final` a virtuális metódusok további felülírását tiltja; Pythonban a `@final` szintén a típusellenőrző számára jelzi a szándékot. A közös gondolat mindegyik esetben az, hogy pontosan meg kell határoznunk, a hierarchia mely pontjáig engedjük megváltoztatni egy művelet működését.

## Feladatok {#tasks}

A feladatok célja, hogy a belső megvalósítás elrejtését és a továbbörökítés tudatos korlátozását gyakoroljuk. A beágyazott osztályok nem helyettesítik a konténerosztály nyilvános metódusait, ezért az adatokon végzett műveleteket továbbra is a befoglaló osztálynak kell felügyelnie. A korábban megírt osztályokból annyit használjon fel, amennyi a megadott követelményekhez szükséges.

:::exercise
### Téglalapok – rögzített méret

![Téglalapok – UML](content/chapters/11-final-beagyazott-osztalyok/media/task-rectangle-hu.svg){width=590}

**Osztályok és mezők**
- Készítsen `final` `RectangleSize` osztályt a `width : double` és `height : double` mezőkkel. Mindkét mező legyen `private final`, értékük pozitív valós szám.

**Konstruktorok és metódusok**
- A `RectangleSize(width : double, height : double)` konstruktor ellenőrizze a paramétereket. A `getWidth()` és `getHeight()` metódusok csak lekérdezést biztosítsanak.
- A `getArea() : double` metódus számítsa ki a területet; a példány mérete a létrehozása után már ne legyen módosítható.
- Próbáljon olyan osztályt származtatni a `RectangleSize` osztályból, amely más területszámítást használna, és vizsgálja meg a fordító jelzését!
:::endexercise

:::exercise
### Könyvtár – belső kölcsönzési rekord

![Könyvtár – UML](content/chapters/11-final-beagyazott-osztalyok/media/task-library-hu.svg){width=640}

**Osztályok és mezők**
- A `Library` osztályban készítsen privát, statikusan beágyazott `LoanRecord` osztályt, amely a nem üres `bookId : String` könyvazonosítót és a nemnegatív `days : int` kölcsönzési időt tárolja.
- A `Library` tároljon privát `loans : ArrayList<LoanRecord>` listát, amelyet létrehozásakor inicializál.

**Konstruktorok és metódusok**
- A `LoanRecord(bookId : String, days : int)` konstruktor ellenőrizze a két adatot. A külső program ne férjen hozzá közvetlenül a belső osztályhoz vagy a listához.
- Az `addLoan(bookId : String, days : int) : void` hozzon létre új rekordot, és mentse a listába. Egy könyvazonosító legfeljebb egyszer szerepelhessen a nyilvántartásban; ismétlődés esetén dobjon kivételt.
- A `countOverdue(allowedDays : int) : int` adja vissza a megengedett, nemnegatív határnál hosszabb kölcsönzések számát. A `getLoanCount() : int` adja vissza a rekordok számát.
- Ellenőrizze, hogy a főprogram kizárólag a publikus metódusokon keresztül képes-e módosítani a nyilvántartást!
:::endexercise

:::exercise
### Autószerviz – belső munkalap

![Autószerviz – UML](content/chapters/11-final-beagyazott-osztalyok/media/task-garage-hu.svg){width=660}

**Osztályok és mezők**
- A `Garage` osztály tárolja a `name : String` nem üres nevet és a pozitív `hourlyRate : int` óradíjat, mindkettőt privát mezőben.
- A `Garage` osztályon belül készítsen publikus, nem statikus `ServiceTicket` belső osztályt, amely a pozitív `hours : int` munkaórát tárolja privát mezőben.

**Konstruktorok és metódusok**
- A `Garage(name : String, hourlyRate : int)` konstruktor ellenőrizze a közös adatokat. A `ServiceTicket(hours : int)` konstruktor a pozitív munkaórát állítsa be.
- A `ServiceTicket` `calculateCost() : int` metódusa a befoglaló `Garage` példány óradíja alapján számítsa ki a költséget.
- A külső `Garage` biztosítson `getName() : String` és `getHourlyRate() : int` lekérdezést, és egyik mezőt se lehessen kívülről módosítani.
- Hozzon létre két garázst eltérő óradíjjal, mindkettőhöz egy-egy munkalapot, majd mutassa meg, hogy azonos munkaidő mellett eltérő költség keletkezik!
:::endexercise

:::exercise
### Bankszámlák – nem felülírható terhelés

![Bankszámlák – UML](content/chapters/11-final-beagyazott-osztalyok/media/task-bank-hu.svg){width=660}

**Osztályok és mezők**
- A `BankAccount` privát `accountNumber : String` és `balance : int` mezőt tárol. A számlaszám nem lehet üres, az egyenleg nemnegatív egész szám.
- A `SavingsAccount` a pozitív vagy nulla `interestRate : double` kamatlábbal egészíti ki az ősosztályt.

**Konstruktorok és metódusok**
- A `BankAccount(accountNumber : String, balance : int)` és `SavingsAccount(accountNumber : String, balance : int, interestRate : double)` konstruktorok validálják és inicializálják az adataikat.
- A `BankAccount` `withdraw(amount : int) : void` metódusa legyen `final`: csak pozitív összeget engedjen levonni, és ne engedje, hogy az egyenleg negatívvá váljon.
- A `getBalance() : int` és `getAccountNumber() : String` metódusok csak lekérdezzék az adatokat. A `SavingsAccount` `calculateMonthlyInterest() : int` metódusa adja vissza az egyenleg és a kamatláb szorzatának lefelé kerekített egész részét.
- Ellenőrizze, hogy az örökölt `withdraw()` használható, de a `SavingsAccount` osztályban nem írható felül!
:::endexercise

:::exercise
### Filmtár – privát vetítési adatok

![Filmtár – UML](content/chapters/11-final-beagyazott-osztalyok/media/task-movies-hu.svg){width=660}

**Osztályok és mezők**
- A `MovieCatalog` osztályon belül készítsen privát, statikusan beágyazott `Screening` osztályt. Egy vetítés a nem üres `movieTitle : String` címet és a nemnegatív `seatsSold : int` eladott jegyszámot tárolja.
- A `MovieCatalog` rendelkezzen privát `screenings : ArrayList<Screening>` listával.

**Konstruktorok és metódusok**
- A `Screening(movieTitle : String, seatsSold : int)` konstruktor ellenőrizze az adatokat, és a `MovieCatalog()` konstruktor inicializálja a listát.
- Az `addScreening(movieTitle : String, seatsSold : int) : void` adjon hozzá új vetítést. A `getTotalTickets() : int` adja vissza az összes vetítésre eladott jegyek számát.
- A `countPopular(minimumTickets : int) : int` adja meg, hány vetítésre adtak el legalább a kapott, nemnegatív számú jegyet. Negatív paraméter esetén dobjon kivételt.
- A konténer se a belső listát, se a `Screening` példányokat ne tegye közvetlenül elérhetővé. Több vetítés felvételével próbálja ki az összesítő metódusokat!
:::endexercise
