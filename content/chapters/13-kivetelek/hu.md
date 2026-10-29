# Kivételek

Amikor egy osztályt megtervezünk, általában abból indulunk ki, hogy a metódusok helyes paramétereket kapnak, és el tudják végezni a feladatukat. A gyakorlatban azonban könnyen előfordulhat, hogy a felhasználó érvénytelen adatot ad meg, hiányzik egy szükséges állomány, vagy egy művelet az objektum aktuális állapota miatt nem hajtható végre. Ezeket a helyzeteket fel kell ismernünk, de nem feltétlenül annak a metódusnak kell megoldania a problémát, amelyik észlelte azt.

Tegyük fel, hogy egy termosztát célhőmérsékletét csak a $[18;28]$ intervallumban engedjük beállítani. A termosztát osztálya pontosan el tudja dönteni, hogy egy kért érték elfogadható-e, azt viszont nem tudhatja, hogy hibás adat esetén a felhasználótól új értéket kell kérnünk, egy állomány következő sorával kell próbálkoznunk, vagy a legközelebbi megengedett értéket szeretnénk alkalmazni. Ezek a döntések már attól a programrésztől függnek, amely a termosztátot használja. A **kivételek** lehetővé teszik, hogy az érvénytelen állapotot jelezzük anélkül, hogy a hibakezelés teljes algoritmusát az osztályba építenénk.

## A hibák jelzése {#error-signalling}

Korábban már használtunk egyszerű validációt. Hibás paraméter esetén kiírhatnánk egy hibaüzenetet, vagy visszatérhetnénk valamilyen speciális értékkel. A kiírás azonban a megjelenítést összekapcsolná az adatokat kezelő osztállyal, ráadásul egy konzolos, grafikus vagy webes alkalmazás másképpen szeretné értesíteni a felhasználót. A különleges visszatérési érték szintén problémás lehet: nem mindig létezik olyan érték, amelyet biztosan nem szeretnénk valós eredményként használni, egy konstruktornak pedig nincs visszatérési értéke.

Ehelyett a `throw` utasítással **kivételt dobunk**. Java-ban a dobott objektum a `Throwable` osztály leszármazottja. A következő példában egy `IllegalArgumentException` jelzi, hogy a paraméter nem megfelelő. A hibás értéket nem tároljuk el, és a metódus a `throw` végrehajtásakor azonnal megszakad.

:::lang java
```java
class TemperatureSetting {
    private int targetTemperature = 22;

    public void setTargetTemperature(int value) {
        if (value < 18 || value > 28)
            throw new IllegalArgumentException("Temperature outside 18..28");
        targetTemperature = value;
    }

    public int getTargetTemperature() { return targetTemperature; }
}
```
:::end
:::lang csharp
```csharp
using System;
class TemperatureSetting {
    private int targetTemperature = 22;

    public void SetTargetTemperature(int value) {
        if (value < 18 || value > 28)
            throw new ArgumentOutOfRangeException(nameof(value));
        targetTemperature = value;
    }

    public int GetTargetTemperature() => targetTemperature;
}
```
:::end
:::lang python
```python
class TemperatureSetting:
    def __init__(self):
        self._targetTemperature = 22

    def setTargetTemperature(self, value):
        if value < 18 or value > 28:
            raise ValueError("Temperature outside 18..28")
        self._targetTemperature = value

    def getTargetTemperature(self):
        return self._targetTemperature
```
:::end
:::lang cpp
```cpp
#include <stdexcept>
class TemperatureSetting {
    int targetTemperature = 22;
public:
    void setTargetTemperature(int value) {
        if (value < 18 || value > 28)
            throw std::out_of_range("Temperature outside 18..28");
        targetTemperature = value;
    }
    int getTargetTemperature() const { return targetTemperature; }
};
```
:::end

## A kivétel továbbterjedése és kezelése {#propagation}

A kivétel dobásakor a program normál végrehajtása megszakad. A futtatókörnyezet először az adott metóduson belül keres megfelelő kezelőt, majd ha nem talál, visszalép a metódust meghívó programrészhez. Ez a folyamat a hívási láncon keresztül folytatódik addig, amíg valamelyik `catch` blokk kezeli a kivételt, vagy a kivétel kezeletlenül eléri a program futtatókörnyezetét. Fontos tehát, hogy a kivételt **nem kell ott elkapnunk, ahol feldobtuk**; az adott osztály feladata sokszor csak a hiba felismerése és jelzése.

Az alábbi példában a `validate()` metódus dob kivételt, a `configure()` és az `apply()` azonban semmit nem tesznek annak kezelésére. A főprogram `try` blokkja körülveszi a műveletet, a `catch` pedig akkor hajtódik végre, ha az adott típusú kivétel eljut hozzá. A kezelő az eredeti metódus folytatása helyett a `try–catch` szerkezet után engedi tovább a programot; a kivételt dobó utasítás utáni sorok végrehajtása nem indul újra automatikusan.

:::lang java
```java
class TemperatureService {
    static void validate(int value) {
        if (value < 18 || value > 28)
            throw new IllegalArgumentException("Invalid temperature");
    }
    static void apply(int value) { validate(value); }
    static void configure(int value) { apply(value); }
}
class Main {
    public static void main(String[] args) {
        try {
            TemperatureService.configure(35);
        } catch (IllegalArgumentException error) {
            System.out.println("Configuration rejected: " + error.getMessage());
        }
    }
}
```
:::end
:::lang csharp
```csharp
using System;
class TemperatureService {
    public static void Validate(int value) {
        if (value < 18 || value > 28)
            throw new ArgumentOutOfRangeException(nameof(value));
    }
    public static void Apply(int value) { Validate(value); }
    public static void Configure(int value) { Apply(value); }
}
class Program {
    static void Main() {
        try { TemperatureService.Configure(35); }
        catch (ArgumentOutOfRangeException error) {
            Console.WriteLine("Configuration rejected: " + error.Message);
        }
    }
}
```
:::end
:::lang python
```python
class TemperatureService:
    @staticmethod
    def validate(value):
        if value < 18 or value > 28:
            raise ValueError("Invalid temperature")

    @staticmethod
    def apply(value):
        TemperatureService.validate(value)

    @staticmethod
    def configure(value):
        TemperatureService.apply(value)

try:
    TemperatureService.configure(35)
except ValueError as error:
    print("Configuration rejected:", error)
```
:::end
:::lang cpp
```cpp
#include <iostream>
#include <stdexcept>
class TemperatureService {
public:
    static void validate(int value) {
        if (value < 18 || value > 28)
            throw std::out_of_range("Invalid temperature");
    }
    static void apply(int value) { validate(value); }
    static void configure(int value) { apply(value); }
};
int main() {
    try { TemperatureService::configure(35); }
    catch (const std::out_of_range& error) {
        std::cout << "Configuration rejected: " << error.what() << '\n';
    }
}
```
:::end

## Kivételtípusok és a `catch` blokkok sorrendje {#catch-order}

Mivel a kivételek is objektumok, különböző kivételosztályokat hozhatunk létre, és közöttük öröklési kapcsolat állhat fenn. Egy `try` után több `catch` is szerepelhet. Ezeket a megadott sorrendben vizsgálja meg a rendszer, és az **első típuskompatibilis** kezelőt hajtja végre. Emiatt a speciálisabb kivételtípusokat előre kell írnunk, az általánosabbakat pedig mögéjük. Ha Java-ban egy általános `catch (Exception e)` megelőzne egy tőle származó kivételt elkapó blokkot, az utóbbi soha nem lenne elérhető, ezért a program nem fordulna le.

A következő kód az egész számmá alakítás hibáját külön kezeli. Java-ban a `NumberFormatException` az `IllegalArgumentException` leszármazottja, ezért ez a sorrend helyes. A `catch` paraméterében kapott kivételobjektum `getMessage()` metódusa visszaadja a hozzá tartozó üzenetet; hibakereséskor a `printStackTrace()` a hívási láncról is tájékoztat. A kivételek alapján tehát nemcsak általános hibát jelezhetünk, hanem különböző megoldásokat is választhatunk.

:::lang java
```java
class Main {
    public static void main(String[] args) {
        try {
            int number = Integer.parseInt("not-a-number");
            System.out.println(number);
        } catch (NumberFormatException error) {
            System.out.println("The text is not an integer.");
        } catch (IllegalArgumentException error) {
            System.out.println("Invalid argument: " + error.getMessage());
        }
    }
}
```
:::end
:::lang csharp
```csharp
using System;
class Program {
    static void Main() {
        try {
            int number = int.Parse("not-a-number");
            Console.WriteLine(number);
        } catch (FormatException error) {
            Console.WriteLine("The text is not an integer.");
        } catch (Exception error) {
            Console.WriteLine("Other error: " + error.Message);
        }
    }
}
```
:::end
:::lang python
```python
try:
    number = int("not-a-number")
    print(number)
except ValueError as error:
    print("The text is not an integer.")
except Exception as error:
    print("Other error:", error)
```
:::end
:::lang cpp
```cpp
#include <iostream>
#include <string>
#include <stdexcept>
int main() {
    try {
        int number = std::stoi("not-a-number");
        std::cout << number;
    } catch (const std::invalid_argument& error) {
        std::cout << "The text is not an integer.\n";
    } catch (const std::exception& error) {
        std::cout << "Other error: " << error.what() << '\n';
    }
}
```
:::end

## Ellenőrzött és nem ellenőrzött kivételek {#checked-unchecked}

Java-ban két, a programozó számára különösen fontos kivételcsoportot különböztetünk meg. A **nem ellenőrzött kivételek** (`RuntimeException` és leszármazottjai) esetén a fordító nem követeli meg, hogy megadjuk, hol fogjuk a kivételt elkapni. Ilyen például az `IllegalArgumentException` vagy az `IndexOutOfBoundsException`. Az **ellenőrzött kivételek** esetén viszont a metódusnak kezelnie kell a kivételt, vagy a deklarációban a `throws` kulcsszóval jeleznie kell, hogy továbbadja azt a hívójának. Állománykezelésnél gyakran találkozunk `IOException` kivétellel.

Nem helyes tehát úgy megfogalmazni a szabályt, hogy minden `throw` utasításhoz szükség van `throws` deklarációra. Ha például egy metódus `IOException`-t továbbít, a fejlécében szerepelhet a `throws IOException`, és a meghívó programrész felelőssége lesz a kezelés vagy a további továbbítás. A `throws` **nem kezeli** a kivételt, csak a metódus által vállalt lehetőséget jelöli. Az `Error` típusú súlyos futtatókörnyezeti hibákat pedig általában nem az alkalmazás normál hibakezelési folyamatával próbáljuk megoldani.

:::lang java
```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
class SettingsLoader {
    public String load(String fileName) throws IOException {
        return Files.readString(Path.of(fileName));
    }
}
```
:::end
:::lang csharp
```csharp
using System.IO;
class SettingsLoader {
    public string Load(string fileName) {
        return File.ReadAllText(fileName);
        // IOException is possible; no throws clause exists in C#.
    }
}
```
:::end
:::lang python
```python
class SettingsLoader:
    def load(self, fileName):
        with open(fileName, encoding="utf-8") as reader:
            return reader.read()
        # OSError can reach the caller without declaration.
```
:::end
:::lang cpp
```cpp
#include <fstream>
#include <stdexcept>
#include <string>
class SettingsLoader {
public:
    std::string load(const std::string& fileName) {
        std::ifstream reader(fileName);
        if (!reader) throw std::runtime_error("Cannot open file");
        return std::string(std::istreambuf_iterator<char>(reader),
                           std::istreambuf_iterator<char>());
    }
};
```
:::end

## Saját kivételek és tényleges helyreállítás {#custom-exceptions}

Előfordulhat, hogy egy általános `IllegalArgumentException` nem írja le elég pontosan a hibát. A termosztát esetén például külön szeretnénk megkülönböztetni azt, amikor a kívánt hőmérséklet túl alacsony, illetve amikor túl magas. Ehhez elkészíthetjük a `TooLowTemperatureException` és `TooHighTemperatureException` osztályokat, amelyekben akár a hibás értéket is eltárolhatjuk. A saját kivételosztályainkat most közvetlenül az `Exception` osztályból származtatjuk. Természetesen választhatnánk más, az adott hibához jobban illeszkedő kivételosztályt is ősnek. A név végén szereplő `Exception` bevett elnevezési konvenció, nem nyelvi előírás. Mivel Java-ban az `Exception` közvetlen leszármazottjai ellenőrzött kivételek, a továbbadó metódusok fejlécében a megfelelő `throws` deklarációt is meg kell adnunk.

Az alábbi programban a termosztát setter metódusa csak validál, és kivételt dob, ha nem tudja teljesíteni a kérést. A főprogram ezzel szemben **helyreállítja a működést**: túl kicsi értéknél beállítja a minimumot, túl nagy értéknél a maximumot, majd feldolgozza a következő adatot. A példából láthatjuk, hogy a kivételkezelés nem egyenlő egy hibaüzenet megjelenítésével. A helyreállítás szabályait itt tudatosan a hívó programrész határozza meg. A `resetToMinimum()` és `resetToMaximum()` metódusok mindig érvényes, rögzített értéket állítanak be, így nem dobják újra az előző kivételeket. Valós alkalmazásban más szabály is érvényes lehet: például új értéket kérünk vagy elutasítjuk a műveletet.

:::lang java
```java
class TooLowTemperatureException extends Exception {
    private final int suppliedValue;
    public TooLowTemperatureException(int value) {
        super("Temperature below 18: " + value);
        suppliedValue = value;
    }
    public int getSuppliedValue() { return suppliedValue; }
}
class TooHighTemperatureException extends Exception {
    private final int suppliedValue;
    public TooHighTemperatureException(int value) {
        super("Temperature above 28: " + value);
        suppliedValue = value;
    }
    public int getSuppliedValue() { return suppliedValue; }
}
class TemperatureSetting {
    public static final int MIN = 18;
    public static final int MAX = 28;
    private int targetTemperature = 22;
    public void setTargetTemperature(int value)
            throws TooLowTemperatureException, TooHighTemperatureException {
        if (value < MIN) throw new TooLowTemperatureException(value);
        if (value > MAX) throw new TooHighTemperatureException(value);
        targetTemperature = value;
    }
    public int getTargetTemperature() { return targetTemperature; }
    public void resetToMinimum() { targetTemperature = MIN; }
    public void resetToMaximum() { targetTemperature = MAX; }
}
class Main {
    public static void main(String[] args) {
        TemperatureSetting thermostat = new TemperatureSetting();
        int[] readings = {23, 12, 35};
        for (int requested : readings) {
            try {
                thermostat.setTargetTemperature(requested);
            } catch (TooLowTemperatureException error) {
                thermostat.resetToMinimum();
            } catch (TooHighTemperatureException error) {
                thermostat.resetToMaximum();
            }
            System.out.println(thermostat.getTargetTemperature());
        }
    }
}
```
:::end
:::lang csharp
```csharp
using System;
class TooLowTemperatureException : Exception {
    public int SuppliedValue { get; }
    public TooLowTemperatureException(int value)
        : base("Temperature below 18: " + value) { SuppliedValue = value; }
}
class TooHighTemperatureException : Exception {
    public int SuppliedValue { get; }
    public TooHighTemperatureException(int value)
        : base("Temperature above 28: " + value) { SuppliedValue = value; }
}
class TemperatureSetting {
    public const int MIN = 18, MAX = 28;
    private int targetTemperature = 22;
    public void SetTargetTemperature(int value) {
        if (value < MIN) throw new TooLowTemperatureException(value);
        if (value > MAX) throw new TooHighTemperatureException(value);
        targetTemperature = value;
    }
    public int GetTargetTemperature() => targetTemperature;
    public void ResetToMinimum() => targetTemperature = MIN;
    public void ResetToMaximum() => targetTemperature = MAX;
}
class Program {
    static void Main() {
        var thermostat = new TemperatureSetting();
        foreach (int requested in new[] {23, 12, 35}) {
            try { thermostat.SetTargetTemperature(requested); }
            catch (TooLowTemperatureException) {
                thermostat.ResetToMinimum();
            } catch (TooHighTemperatureException) {
                thermostat.ResetToMaximum();
            }
            Console.WriteLine(thermostat.GetTargetTemperature());
        }
    }
}
```
:::end
:::lang python
```python
class TooLowTemperatureException(Exception):
    def __init__(self, value):
        super().__init__(f"Temperature below 18: {value}")
        self.suppliedValue = value

class TooHighTemperatureException(Exception):
    def __init__(self, value):
        super().__init__(f"Temperature above 28: {value}")
        self.suppliedValue = value

class TemperatureSetting:
    MIN, MAX = 18, 28
    def __init__(self):
        self._targetTemperature = 22
    def setTargetTemperature(self, value):
        if value < self.MIN: raise TooLowTemperatureException(value)
        if value > self.MAX: raise TooHighTemperatureException(value)
        self._targetTemperature = value
    def getTargetTemperature(self):
        return self._targetTemperature
    def resetToMinimum(self):
        self._targetTemperature = self.MIN
    def resetToMaximum(self):
        self._targetTemperature = self.MAX

thermostat = TemperatureSetting()
for requested in (23, 12, 35):
    try:
        thermostat.setTargetTemperature(requested)
    except TooLowTemperatureException:
        thermostat.resetToMinimum()
    except TooHighTemperatureException:
        thermostat.resetToMaximum()
    print(thermostat.getTargetTemperature())
```
:::end
:::lang cpp
```cpp
#include <exception>
#include <iostream>
class TooLowTemperatureException : public std::exception {
    int suppliedValue;
public:
    explicit TooLowTemperatureException(int value) : suppliedValue(value) {}
    const char* what() const noexcept override { return "Temperature below 18"; }
    int getSuppliedValue() const { return suppliedValue; }
};
class TooHighTemperatureException : public std::exception {
    int suppliedValue;
public:
    explicit TooHighTemperatureException(int value) : suppliedValue(value) {}
    const char* what() const noexcept override { return "Temperature above 28"; }
    int getSuppliedValue() const { return suppliedValue; }
};
class TemperatureSetting {
public:
    static constexpr int MIN = 18, MAX = 28;
private:
    int targetTemperature = 22;
public:
    void setTargetTemperature(int value) {
        if (value < MIN) throw TooLowTemperatureException(value);
        if (value > MAX) throw TooHighTemperatureException(value);
        targetTemperature = value;
    }
    int getTargetTemperature() const { return targetTemperature; }
    void resetToMinimum() { targetTemperature = MIN; }
    void resetToMaximum() { targetTemperature = MAX; }
};
int main() {
    TemperatureSetting thermostat;
    for (int requested : {23, 12, 35}) {
        try { thermostat.setTargetTemperature(requested); }
        catch (const TooLowTemperatureException&) { thermostat.resetToMinimum(); }
        catch (const TooHighTemperatureException&) { thermostat.resetToMaximum(); }
        std::cout << thermostat.getTargetTemperature() << '\n';
    }
}
```
:::end

![UML](content/chapters/13-kivetelek/media/main-thermostat-hu.svg){width=680}

## Erőforrások felszabadítása: `finally` {#finally}

Az állományok, hálózati kapcsolatok és más külső erőforrások használatakor arra is ügyelnünk kell, hogy a lefoglalt erőforrásokat a művelet végén elengedjük. Erre szolgálhat a `finally` blokk, amely a `try` befejezése után normál működés és kivétel esetén is végrehajtódik, függetlenül attól, hogy volt-e megfelelő `catch`. Ez azért fontos, mert ha az állomány olvasása közben kivétel keletkezik, a `try` végén elhelyezett közönséges lezáró utasításhoz már nem jutnánk el. A `finally` nem helyettesíti a hibakezelést: ha a kivételt senki sem kapta el, a felszabadítás után továbbterjed.

A következő példában egy `Scanner` példánnyal olvasunk a `File` objektummal megadott állományból. A hagyományos `try–catch–finally` szerkezetben először ellenőrizzük, hogy a fájlt sikerült-e megnyitni, a `finally` blokkban pedig lezárjuk a már létrehozott olvasót. A `Scanner` lezárása nem igényel külön `IOException`-kezelést. Kényszerű programleállás esetén ugyanakkor a `finally` végrehajtása sem garantált.

:::lang java
```java
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        Scanner scanner = null;
        try {
            scanner = new Scanner(new File("settings.txt"), "UTF-8");
            if (scanner.hasNextLine()) {
                System.out.println(scanner.nextLine());
            }
        } catch (FileNotFoundException error) {
            System.out.println("Cannot open the file: " + error.getMessage());
        } finally {
            if (scanner != null) scanner.close();
        }
    }
}
```
:::end
:::lang csharp
```csharp
using System;
using System.IO;
class Program {
    static void Main() {
        StreamReader reader = null;
        try {
            reader = new StreamReader("settings.txt");
            Console.WriteLine(reader.ReadLine());
        } catch (IOException error) {
            Console.WriteLine("Cannot read the file: " + error.Message);
        } finally {
            reader?.Dispose();
        }
    }
}
```
:::end
:::lang python
```python
reader = None
try:
    reader = open("settings.txt", encoding="utf-8")
    print(reader.readline().rstrip("\n"))
except OSError as error:
    print("Cannot read the file:", error)
finally:
    if reader is not None:
        reader.close()
```
:::end
:::lang cpp
```cpp
#include <fstream>
#include <iostream>
#include <stdexcept>
#include <string>
int main() {
    try {
        std::ifstream reader("settings.txt");
        if (!reader) throw std::runtime_error("Cannot open file");
        std::string line;
        if (!std::getline(reader, line))
            throw std::runtime_error("Cannot read line");
        std::cout << line << '\n';
        // The local reader is closed automatically (RAII).
    } catch (const std::exception& error) {
        std::cout << "Cannot read the file: " << error.what() << '\n';
    }
}
```
:::end

Java-ban a fájlkezeléshez ma már többnyire a `try-with-resources` szerkezetet használjuk. Itt is `Scanner` olvas egy `File` objektumot, de a lezárást már nem kell külön megírnunk. Az `AutoCloseable` interfészt megvalósító erőforrást a rendszer a blokk befejezésekor automatikusan lezárja, és emiatt lényegesen egyszerűbb, biztonságosabb kódot írhatunk. A C# `using`, a Python `with`, illetve a C++ objektumélettartamhoz kötött erőforrás-kezelése hasonló célt szolgál, de nem ugyanazzal a szintaxissal. A `finally` fogalmát továbbra is ismernünk kell, hiszen nemcsak állományok lezárására használható.

:::lang java
```java
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
class Main {
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(new File("settings.txt"), "UTF-8")) {
            if (scanner.hasNextLine()) {
                System.out.println(scanner.nextLine());
            }
        } catch (FileNotFoundException error) {
            System.out.println("Cannot open the file: " + error.getMessage());
        }
    }
}
```
:::end
:::lang csharp
```csharp
using System;
using System.IO;
class Program {
    static void Main() {
        try {
            using var reader = new StreamReader("settings.txt");
            Console.WriteLine(reader.ReadLine());
        } catch (IOException error) {
            Console.WriteLine("Cannot read the file: " + error.Message);
        }
    }
}
```
:::end
:::lang python
```python
try:
    with open("settings.txt", encoding="utf-8") as reader:
        print(reader.readline().rstrip("\n"))
except OSError as error:
    print("Cannot read the file:", error)
```
:::end
:::lang cpp
```cpp
#include <fstream>
#include <iostream>
#include <stdexcept>
#include <string>
int main() {
    try {
        std::ifstream reader("settings.txt");
        if (!reader) throw std::runtime_error("Cannot open file");
        std::string line;
        if (!std::getline(reader, line))
            throw std::runtime_error("Cannot read line");
        std::cout << line << '\n';
    } catch (const std::exception& error) {
        std::cout << "Cannot read the file: " << error.what() << '\n';
    }
}
```
:::end

## Egy másik példa: a sikertelen művelet helyettesítése {#fallback}

Tegyük fel, hogy csomagokat szeretnénk feladni, és a futárszolgálatunk legfeljebb 20 kilogrammos csomagokat vállal. A csomagfeladást megvalósító osztály felismeri, ha egy küldemény túl nehéz, és saját kivétellel jelzi ezt a helyzetet. Nem feladata azonban eldönteni, hogy a megrendelést visszautasítjuk, kisebb csomagokra bontjuk vagy másik szállítási módot választunk. Ezt a megrendelést intéző programrészre bízzuk.

Az alábbi példában a hívó először futárszolgálattal próbálja feladni a csomagot, és csak súlytúllépés esetén tér át az áruszállításra. A hibát tehát valódi alternatív művelettel kezeljük. Egy érvénytelen, nem pozitív súlyt szándékosan nem kezelünk ugyanígy, mert abból nem következik, hogy a másik szállítási mód helyes megoldást jelentene. Ez jól mutatja, miért fontos a különböző hibák megkülönböztetése.

:::lang java
```java
class TooHeavyException extends Exception {
    public TooHeavyException(int weightKg) {
        super("Courier limit is 20 kg; package is " + weightKg + " kg");
    }
}
class CourierService {
    public void shipByCourier(int weightKg) throws TooHeavyException {
        if (weightKg <= 0) throw new IllegalArgumentException("Invalid weight");
        if (weightKg > 20) throw new TooHeavyException(weightKg);
        System.out.println("Courier shipment registered.");
    }
    public void shipByFreight(int weightKg) {
        if (weightKg <= 0) throw new IllegalArgumentException("Invalid weight");
        System.out.println("Freight shipment registered.");
    }
}
class Main {
    public static void main(String[] args) {
        CourierService service = new CourierService();
        try { service.shipByCourier(32); }
        catch (TooHeavyException error) {
            service.shipByFreight(32); // Real recovery: a different service
        }
    }
}
```
:::end
:::lang csharp
```csharp
using System;
class TooHeavyException : Exception {
    public TooHeavyException(int weightKg)
        : base("Courier limit is 20 kg; package is " + weightKg + " kg") {}
}
class CourierService {
    public void ShipByCourier(int weightKg) {
        if (weightKg <= 0) throw new ArgumentOutOfRangeException(nameof(weightKg));
        if (weightKg > 20) throw new TooHeavyException(weightKg);
        Console.WriteLine("Courier shipment registered.");
    }
    public void ShipByFreight(int weightKg) {
        if (weightKg <= 0) throw new ArgumentOutOfRangeException(nameof(weightKg));
        Console.WriteLine("Freight shipment registered.");
    }
}
class Program {
    static void Main() {
        var service = new CourierService();
        try { service.ShipByCourier(32); }
        catch (TooHeavyException) { service.ShipByFreight(32); }
    }
}
```
:::end
:::lang python
```python
class TooHeavyException(Exception):
    pass

class CourierService:
    def shipByCourier(self, weightKg):
        if weightKg <= 0: raise ValueError("Invalid weight")
        if weightKg > 20: raise TooHeavyException("Courier limit: 20 kg")
        print("Courier shipment registered.")

    def shipByFreight(self, weightKg):
        if weightKg <= 0: raise ValueError("Invalid weight")
        print("Freight shipment registered.")

service = CourierService()
try:
    service.shipByCourier(32)
except TooHeavyException:
    service.shipByFreight(32)
```
:::end
:::lang cpp
```cpp
#include <exception>
#include <iostream>
#include <stdexcept>
class TooHeavyException : public std::exception {
public:
    const char* what() const noexcept override { return "Courier limit: 20 kg"; }
};
class CourierService {
public:
    void shipByCourier(int weightKg) {
        if (weightKg <= 0) throw std::invalid_argument("Invalid weight");
        if (weightKg > 20) throw TooHeavyException();
        std::cout << "Courier shipment registered.\n";
    }
    void shipByFreight(int weightKg) {
        if (weightKg <= 0) throw std::invalid_argument("Invalid weight");
        std::cout << "Freight shipment registered.\n";
    }
};
int main() {
    CourierService service;
    try { service.shipByCourier(32); }
    catch (const TooHeavyException&) { service.shipByFreight(32); }
}
```
:::end

![UML](content/chapters/13-kivetelek/media/main-shipment-hu.svg){width=680}

## Feladatok {#exercises}

A feladatokban először korábban elkészített osztályokat egészítünk ki kivételekkel, majd olyan összetettebb rendszereket tervezünk, amelyekben a hibát jelző és a hibát kezelő programrészek különválasztása a cél. A feladatleírások minden esetben a megvalósítandó adattagokból és azok hozzáférési szabályaiból indulnak ki.

:::exercise
### Termosztát – az érvénytelen érték javítása {#task-1}

![UML](content/chapters/13-kivetelek/media/task-1-hu.svg){width=760}

Készítsen termosztátot reprezentáló `TemperatureSetting` osztályt, és egészítse ki két saját kivételosztállyal! Az osztály a beállított hőmérsékletet tárolja, az érvénytelen érték javításáról pedig a főprogram döntsön.

**Mezők és hozzáférés**
- **Célhőmérséklet (`targetTemperature : int`):** privát mező, megengedett értékei a $[18;28]$ intervallum egész számai. A publikus `getTargetTemperature() : int` getter adja vissza a tárolt értéket. A publikus `setTargetTemperature(value : int) : void` setter a túl alacsony értékre `TooLowTemperatureException`, a túl magas értékre `TooHighTemperatureException` kivételt dobjon, és a fejlécében a `throws` kulcsszóval jelezze mindkettőt. Hibás bemenet esetén a korábban tárolt érték nem változhat meg. A publikus `resetToMinimum() : void` és `resetToMaximum() : void` metódusok a megfelelő határértéket állítsák be; ezek nem dobhatnak saját kivételt.
- **Határértékek (`MIN : int`, `MAX : int`):** publikus, statikus konstansok, értékük 18 és 28. Ezeket használja a validáció és a főprogram is.
- **Hibás érték (`suppliedValue : int`):** mindkét saját kivételosztály privát mezője. A `getSuppliedValue() : int` publikus getter adja vissza azt az értéket, amely miatt a kivétel keletkezett. Mindkét kivételosztály közvetlenül az `Exception` osztályból származzon.

**Konstruktorok**
- A `TemperatureSetting()` paraméter nélküli konstruktor állítsa a célhőmérsékletet 22-re. A két kivételosztály konstruktora kapja meg a hibás értéket, tárolja el, és az ősosztály konstruktorának adjon megfelelő szöveges üzenetet.

**Főprogram**
- Próbálja beállítani egymás után a 23, 12 és 35 fokot. A kivételeket külön `catch` blokkokban kezelje: túl alacsony értéknél 18-ra, túl magasnál 28-ra állítsa a termosztátot. Minden próbálkozás után írja ki a tényleges célhőmérsékletet, és ellenőrizze, hogy a feldolgozás mindhárom esetben folytatódik!

:::endexercise

:::exercise
### Könyvek – árkorlát és javítható adatok {#task-2}

![UML](content/chapters/13-kivetelek/media/task-2-hu.svg){width=760}

A korábbi `Book` osztályt egészítse ki úgy, hogy az árral kapcsolatos hibákat ne általános hibaüzenettel, hanem két külön kivétellel jelezze! A könyvek tárolására a korábban készített konténerosztályt használhatja.

**Mezők és hozzáférés**
- **Azonosító (`isbn : String`):** privát, nem lehet `null` vagy üres szöveg. A `getIsbn() : String` getter visszaadja az azonosítót, setter nem készülhet hozzá.
- **Cím (`title : String`):** privát, legalább két nem szóköz karakterből álljon a két szélső szóköz eltávolítása után. A `getTitle() : String` az aktuális címet adja vissza, a `setTitle(value : String)` pedig ellenőrzés után módosítja azt; hibás szövegnél `IllegalArgumentException` keletkezzen.
- **Ár (`price : int`):** privát, a $[500;50000]$ intervallumban érvényes. A `getPrice() : int` adja vissza az árat. A `setPrice(value : int) : void` túl alacsony értéknél `PriceTooLowException`, túl magasnál `PriceTooHighException` kivételt dobjon, és deklarálja mindkét ellenőrzött kivételt. Hibás adat esetén az ár változatlan marad. A `resetPriceToMinimum() : void` és `resetPriceToMaximum() : void` metódusok állítsák az árat rendre 500 és 50000 forintra, újabb kivétel nélkül.
- **Kivételadat (`requestedPrice : int`):** mindkét saját kivételosztály privát mezője; a `getRequestedPrice() : int` adja vissza az elutasított árat. A kivételek közvetlenül az `Exception` osztályból származzanak.
- **Tárolt könyvek (`books : ArrayList<Book>`):** a `BookShelf` konténerosztály privát listája. Ehhez ne készüljön közvetlen setter.

**Konstruktorok és műveletek**
- A `Book(isbn : String, title : String, price : int)` konstruktor a hozzá tartozó validációkkal állítsa be a mezőket, és szükség esetén a saját, ellenőrzött kivételeket is továbbítsa (`throws`). A kivételosztályok konstruktorai tárolják az elutasított árat, és adják tovább a hibaüzenetet az ősnek.
- A `BookShelf()` konstruktor hozzon létre üres listát. A `BookShelf` konténerosztályban maradjon meg a `addBook(book : Book) : void` és `getBooks() : List<Book>` művelet; az utóbbi ne biztosítson közvetlen módosítási lehetőséget a belső listához. Új könyv hozzáadásakor a konténer ellenőrizze, hogy nincs-e már azonos ISBN-ű példány, és ismétlésnél dobjon `IllegalArgumentException` kivételt.

**Főprogram**
- Az egyik könyv árát próbálja meg 300, majd 62000 forintra állítani! A két kivételt külön kezelje: az első esetben 500, a másodikban 50000 forintra állítsa az árat. A helyes és a javított árú könyveket tegye a polcra, majd írja ki a polc tartalmát!

:::endexercise

:::exercise
### Mozivetítések – másik időpont választása {#task-3}

![UML](content/chapters/13-kivetelek/media/task-3-hu.svg){width=760}

Készítsen olyan foglalási rendszert, amelyben egy `Screening` példány egy vetítést, a `Cinema` pedig a vetítések gyűjteményét kezeli. A férőhelyek elfogyását a vetítés jelezze, a másik időpont kiválasztását viszont a konténerosztályt használó program végezze.

**A `Screening` adatai**
- **Film címe (`movieTitle : String`):** privát, nem lehet üres. Publikus `getMovieTitle() : String` getter, de kívülről ne lehessen módosítani.
- **Vetítésazonosító (`screeningId : String`):** privát, nem lehet üres; a `getScreeningId() : String` publikus getter adja vissza. Az azonosító kívülről nem módosítható.
- **Férőhely (`capacity : int`):** privát, pozitív egész szám. A publikus `getCapacity() : int` lekérdezi, setter nem készül hozzá.
- **Foglalt helyek (`reservedSeats : int`):** privát, kezdetben 0. Csak `getReservedSeats() : int` getterrel legyen lekérdezhető; közvetlen setter nem készülhet hozzá.

- **Vetítések (`screenings : ArrayList<Screening>`):** a `Cinema` osztály privát listája, setter nem készül hozzá. A `Cinema()` konstruktor üres listával indul.

**Konstruktorok és műveletek**
- A `Screening(movieTitle : String, screeningId : String, capacity : int)` konstruktor ellenőrizze és mentse el az adatokat. A `getFreeSeats() : int` adja vissza a szabad helyek számát.
- A `reserveSeats(count : int) : void` művelet nem pozitív darabszám esetén `InvalidReservationException`, a szabad helyeknél nagyobb foglalás esetén `NotEnoughSeatsException` kivételt dobjon. Siker esetén növelje a foglalt helyek számát; sikertelen foglalásnál az állapot ne változzon.
- A két kivételosztály az `Exception` közvetlen leszármazottja legyen; konstruktoruk vegyen át hibaüzenetet, és adja tovább az ősnek. A `reserveSeats()` fejlécében mindkét ellenőrzött kivételt deklarálja (`throws`).
- A `addScreening(screening : Screening) : void` ne fogadjon `null` értéket vagy ismétlődő `screeningId`-t. A `findWithFreeSeats(movieTitle : String, count : int) : Screening` az első olyan vetítést adja vissza, ahol ugyanazt a filmet vetítik, és a kért számú hely még szabad. A keresett cím nem lehet üres, a darabszámnak pozitívnak kell lennie; érvénytelen paraméternél `IllegalArgumentException` keletkezzen. Ha nincs megfelelő vetítés, térjen vissza `null` értékkel. A keresés önmagában ne foglaljon helyet.

**Főprogram**
- Hozzon létre legalább három vetítést, amelyek közül legalább kettő ugyanannak a filmnek más-más időpontja legyen, majd próbáljon olyan foglalást végrehajtani, amelyhez nincs elegendő hely! A `NotEnoughSeatsException` elkapása után keressen másik megfelelő vetítést ugyanahhoz a filmhez, és ott ismételje meg a foglalást. Előbb ellenőrizze, hogy a keresés eredménye nem `null`. Mutassa meg, hogy az eredeti vetítés foglalt helyeinek száma nem változott!

:::endexercise

:::exercise
### Csomagfeladás – alternatív szállítás {#task-4}

![UML](content/chapters/13-kivetelek/media/task-4-hu.svg){width=760}

Készítsen csomagfeladási rendszert, amelyben az alapértelmezett futárszolgálat legfeljebb 20 kilogrammos csomagokat vállal. A túl nehéz csomagok továbbítására külön áruszállítási művelet készüljön, amelyet a főprogram a kivétel kezelésekor választhat.

**Adatok és hozzáférés**
- **Csomagazonosító (`parcelId : String`):** a `Parcel` osztály privát mezője, nem lehet üres. A `getParcelId() : String` adja vissza, setter ne legyen.
- **Tömeg (`weightKg : int`):** privát, csak pozitív egész szám lehet. A `getWeightKg() : int` lekérdezhetővé teszi, a `setWeightKg(value : int) : void` pedig a pozitivitást ellenőrzi, és hiba esetén `IllegalArgumentException` kivételt dob. Hibás új érték nem írhatja felül a régit.
- **Futárszolgálati korlát (`COURIER_LIMIT : int`):** a `ShippingCenter` osztály publikus, statikus konstansa, értéke 20.
- **Feladott csomagok (`shipped : ArrayList<Parcel>`):** a `ShippingCenter` privát listája. A `getShipped() : List<Parcel>` olyan másolatot adjon vissza, amelynek módosítása nem változtatja meg a belső listát.

**Konstruktorok és metódusok**
- A `Parcel(parcelId : String, weightKg : int)` konstruktor érvényes adatokkal hozza létre a csomagot. A `ShippingCenter()` üres listát készítsen.
- A `shipByCourier(parcel : Parcel) : void` ellenőrizze a `null` paramétert és azt, hogy ugyanaz a csomagazonosító még nincs-e a listában. Ha a csomag tömege meghaladja a limitet, dobjon `TooHeavyParcelException` kivételt, amelyet a metódus fejlécében is deklaráljon (`throws`); különben mentse el a csomagot.
- A `shipByFreight(parcel : Parcel) : void` szintén ellenőrizze a `null` értéket és a duplikált azonosítót, de ne alkalmazza a 20 kilogrammos korlátot. A `TooHeavyParcelException` az `Exception` osztályból származzon, konstruktorában kapja meg és tárolja el az elutasított tömeget, amelyet a `getWeightKg() : int` getter ad vissza.

**Főprogram**
- Hozzon létre 8, 24 és 35 kilogrammos csomagokat! Először mindegyiket futárszolgálattal próbálja feladni, majd `TooHeavyParcelException` esetén ugyanazt a példányt áruszállításként adja fel. Ellenőrizze, hogy minden csomag pontosan egyszer szerepel a gyűjteményben, és más kivétel esetén nem történik automatikus alternatív feladás!

:::endexercise

:::exercise
### Mérési adatok – fájlbeolvasás és részleges siker {#task-5}

![UML](content/chapters/13-kivetelek/media/task-5-hu.svg){width=760}

Készítsen olyan alkalmazást, amely egy egyszerű, pontosvesszővel tagolt állományból mérési adatokat olvas be. A fájl egy sora `azonosító;érték` formátumú, ahol az azonosító nem üres szöveg, az érték pedig a $[0;100]$ intervallum egész száma. A hibás sorokat a program jelezze és hagyja ki, de a többi sor feldolgozását folytassa.

**Osztályok és mezők**
- **Szenzorazonosító (`sensorId : String`):** a `Measurement` osztály privát mezője. Nem lehet `null` vagy üres szöveg. A `getSensorId() : String` publikus getter adja vissza, setter ne készüljön hozzá.
- **Mért érték (`value : int`):** a `Measurement` osztály privát mezője, a $[0;100]$ intervallumba essen. A `getValue() : int` adja vissza, a `setValue(value : int) : void` ellenőrizze a határokat. Érvénytelen adatnál `InvalidMeasurementException` keletkezzen, a korábbi érték pedig ne változzon meg.
- Az `InvalidMeasurementException` az `Exception` osztályból származó **ellenőrzött kivétel** legyen. Privát `lineNumber : int` mezőben tárolja az érintett sor sorszámát (ha ismert), a `getLineNumber() : int` adja vissza. A konstruktor hibaüzenetet és sorszámot fogadjon; ismeretlen sorszám esetén 0 használható.
- A `MeasurementArchive` konténerosztály privát `measurements : ArrayList<Measurement>` mezőjéhez ne legyen közvetlen setter. A `getMeasurements() : List<Measurement>` másolatot adjon vissza a listáról.

**Konstruktorok és metódusok**
- A `Measurement(sensorId : String, value : int)` konstruktor a két adatot validálja; a hibás mérési értékhez tartozó `InvalidMeasurementException` kivételt továbbítsa (`throws`). A `MeasurementArchive()` üres listát készítsen.
- Az `addMeasurement(measurement : Measurement) : void` dobjon `IllegalArgumentException` kivételt, ha a paraméter `null`, vagy már van azonos `sensorId`-jú mérés. Az archívum ne tartalmazzon ismétlődő szenzorazonosítókat.
- A különálló `MeasurementImporter` osztály `load(fileName : String, archive : MeasurementArchive) : int` metódusa olvassa végig a fájlt, és adja vissza a sikeresen hozzáadott mérések számát. A szintaktikailag hibás, nem egész számot tartalmazó vagy érvénytelen értékű sorokat kezelje, és jelenítse meg a sorszámukat. A fájlt `Scanner` segítségével olvassa, amelynek egy `File` objektumot ad át. A fájl megnyitásának vagy olvasásának hibáit `IOException` formájában továbbítsa a hívónak; a `Scanner.ioException()` metódussal a beolvasás közben tárolt I/O-hibát is ellenőrizze. A fájl legyen akkor is lezárva, ha kivétel történik; ehhez Java-ban használjon `try-with-resources` szerkezetet. A hiányzó vagy hibás értéket, illetve az ismétlődő szenzorazonosítót tartalmazó sorokat jelezze a sorszámmal együtt, és folytassa a többi sor feldolgozását.

**Főprogram és mintabemenet**
- A fájl tartalmazhatja a következő sorokat: `A01;42`, `B02;125`, `C03;bad`, `D04;78`. A főprogram a helyesen beolvasott és a konténerbe ténylegesen felvett sorok számát írja ki. A fájl feldolgozása során a hibás sorokról a sorszám megadásával történjen tájékoztatás. Hiányzó vagy nem olvasható fájl esetén a főprogram külön `catch (IOException e)` ágban jelezze a problémát. A feladatban az állományt a hallgató maga hozza létre, nem szükséges külső melléklet.

:::endexercise
