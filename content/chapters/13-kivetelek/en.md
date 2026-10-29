# Exceptions

When designing a class, we generally assume that methods receive valid parameters and can complete their operations. In practice, however, users may supply invalid data, an expected file may be missing, or the current state of an object may prevent an operation from succeeding. We must recognize such conditions, but the method detecting the problem is not necessarily the right place to decide how to recover.

Suppose that a thermostat accepts target temperatures only in the interval $[18,28]$. The thermostat can decide whether the requested value is valid, but it cannot know whether the caller should ask the user for another value, skip the current line of a file, or substitute the nearest permitted value. Those decisions belong to the part of the application using the thermostat. **Exceptions** allow us to report invalid situations without placing the entire recovery algorithm inside the class.

## Signalling errors {#error-signalling}

We have already used input validation. When a parameter is incorrect, we could print a message or return a special value. Printing makes a data-processing class dependent on the user interface, although a console, desktop and web application may need to report problems differently. A special return value is not always available either, because every possible value might have a legitimate meaning, and constructors cannot return error codes.

Instead, we **throw an exception** using `throw`. In Java, the thrown object belongs to a subclass of `Throwable`. The example uses `IllegalArgumentException` to report a parameter outside the permitted interval. The invalid value is never stored, and execution of the method stops immediately when `throw` is reached.

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

## Propagation and handling {#propagation}

When an exception is thrown, normal execution of the current operation stops. The runtime looks for a suitable handler, first in the current method and then in the method that called it. The search continues up the call chain until a matching `catch` is found or the exception reaches the runtime without being handled. Therefore, **the exception need not be handled where it was thrown**; in many cases a class should only identify and report the problem.

In the example, `validate()` throws, while `apply()` and `configure()` let the exception propagate. The main program surrounds the call with `try` and handles it in `catch`. Handling the exception does not resume execution at the interrupted statement. Instead, execution continues after the exception-handling construct, which is why the placement of that construct matters.

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

## Exception types and the order of `catch` blocks {#catch-order}

Exceptions are objects, so exception classes may form inheritance hierarchies. We can write several `catch` blocks after one `try`. They are examined from top to bottom, and **the first type-compatible handler** is selected. More specific exceptions must therefore precede their more general ancestors. Java rejects a `catch` that can never be reached because an earlier block already handles all of its possible exceptions.

The code handles a failed conversion to an integer separately. In Java, `NumberFormatException` is a subclass of `IllegalArgumentException`, so the order shown is correct. The `getMessage()` method provides an exception's message, while `printStackTrace()` can help investigate the call stack. This mechanism allows us to select different recovery strategies for different failures, rather than displaying the same message for every problem.

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

## Checked and unchecked exceptions {#checked-unchecked}

Java distinguishes between **unchecked exceptions**, which include `RuntimeException` and its subclasses, and **checked exceptions**. The compiler does not require an unchecked exception to be caught or declared. `IllegalArgumentException` and `IndexOutOfBoundsException` belong to this category. A checked exception, such as `IOException`, must either be handled or be declared in the method header using `throws`, so that the caller knows it may have to deal with it.

It is therefore incorrect to claim that every `throw` must be accompanied by `throws`. The declaration `throws IOException` does not handle the exception; it states that the method may propagate it. Serious runtime errors represented by `Error` are normally not treated as recoverable application-level failures.

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

## Custom exceptions and actual recovery {#custom-exceptions}

A general `IllegalArgumentException` sometimes does not identify the problem precisely enough. For the thermostat, we may want to distinguish a temperature that is too low from one that is too high. We can define `TooLowTemperatureException` and `TooHighTemperatureException`, and we can store the invalid value in those objects as well. Our custom exceptions now extend `Exception` directly. A more specific superclass could also be chosen when the nature of the error warrants it. Ending the class name in `Exception` is a convention, not a language requirement. In Java, these directly derived exceptions are checked, so methods that propagate them declare them using `throws`.

In the program below, the setter validates the value and throws when necessary, while the main program **recovers from the failure**. A low value is replaced by the minimum, a high value by the maximum, and processing continues with the next input. This demonstrates that exception handling is not merely printing an error message. The recovery policy belongs to the caller. The `resetToMinimum()` and `resetToMaximum()` methods write fixed, valid values and cannot throw these exceptions again. Another application might ask for a new value or reject the whole operation instead.

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

![UML](content/chapters/13-kivetelek/media/main-thermostat-en.svg){width=680}

## Releasing resources with `finally` {#finally}

Files, network connections and other external resources must be released when we are finished with them. A `finally` block normally runs whether the `try` block completed successfully or an exception occurred, even when there is no matching `catch`. This matters because an exception during reading may prevent execution from reaching an ordinary close statement placed at the end of the `try` block. `finally` does not itself handle an exception: if the exception remains unhandled, it continues propagating after the cleanup.

The following code illustrates `try–catch–finally` with a `Scanner` reading from a `File`. Before closing the scanner, we check whether it was created. `Scanner.close()` does not require a separate checked `IOException` handler. Forced process termination, however, may still prevent cleanup.

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

In modern Java, file handling generally uses `try-with-resources`. The example again uses `Scanner` with a `File` object, now with automatic closing. An object implementing `AutoCloseable` is closed automatically when the block ends, which usually gives simpler and safer code. C# has `using`, Python has `with`, and C++ generally relies on resource management tied to object lifetime. Their syntax and precise behavior differ, but the purpose is similar. Understanding `finally` is still important because it also applies to cleanup not directly associated with a file.

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

## Another example: substituting a failed operation {#fallback}

Suppose that a courier service accepts parcels weighing no more than 20 kilograms. The shipping class detects when the limit is exceeded and reports this situation using a custom exception. It should not decide whether the order is rejected, split into smaller parcels, or moved to another delivery method. That decision belongs to the program coordinating the order.

In the example, the caller first attempts courier shipping. Only when the parcel exceeds the weight limit does it use freight shipping instead. We thus handle the problem by performing a meaningful alternative operation. An invalid non-positive weight is deliberately not treated in the same way, because another shipping method would not make the input valid. This illustrates why distinguishing different kinds of errors is useful.

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

![UML](content/chapters/13-kivetelek/media/main-shipment-en.svg){width=680}

## Exercises {#exercises}

The first exercises extend classes developed earlier, while the later ones involve systems where reporting a failure and deciding how to recover belong to different components. Each specification begins with the data fields and their access rules, followed by constructors and operations.

:::exercise
### Thermostat – correcting an invalid value {#task-1}

![UML](content/chapters/13-kivetelek/media/task-1-en.svg){width=760}

Create a `TemperatureSetting` class representing a thermostat, together with two custom exceptions. The thermostat stores a target temperature, but the main program decides how to correct invalid input.

**Fields and access**
- **Target temperature (`targetTemperature : int`):** private, valid integer values in $[18,28]$. `getTargetTemperature() : int` returns the stored value. `setTargetTemperature(value : int) : void` throws `TooLowTemperatureException` below 18 and `TooHighTemperatureException` above 28, declares both with `throws`, and must not change the stored value after either failure. The public `resetToMinimum() : void` and `resetToMaximum() : void` methods set 18 and 28 without throwing checked exceptions.
- **Limits (`MIN : int`, `MAX : int`):** public static constants with values 18 and 28, used by both the setter and caller.
- **Rejected value (`suppliedValue : int`):** private field in both custom exceptions. `getSuppliedValue() : int` returns it. Both exceptions extend `Exception` directly.

**Constructors**
- `TemperatureSetting()` initializes the target to 22. Each exception constructor receives the rejected value, stores it, and passes a suitable message to its superclass.

**Main program**
- Attempt the values 23, 12 and 35. Catch the two exception types separately, substituting 18 or 28 respectively. Print the actual temperature after each attempt and verify that processing continues.

:::endexercise

:::exercise
### Books – price limits and recoverable data {#task-2}

![UML](content/chapters/13-kivetelek/media/task-2-en.svg){width=760}

Extend the earlier `Book` class so that price errors are signalled by two distinct exceptions rather than by messages printed inside the class. You may reuse the previously developed container.

**Fields and access**
- **ISBN (`isbn : String`):** private, non-null and non-empty. `getIsbn() : String` returns it; no setter.
- **Title (`title : String`):** private, at least two non-whitespace characters after trimming. `getTitle() : String` returns it, while `setTitle(value : String)` validates and changes it, throwing `IllegalArgumentException` for invalid text.
- **Price (`price : int`):** private, valid in $[500,50000]$. `getPrice() : int` returns it. `setPrice(value : int)` throws `PriceTooLowException` or `PriceTooHighException` and declares both with `throws`. A rejected change must not alter the stored price. `resetPriceToMinimum() : void` and `resetPriceToMaximum() : void` set the price to 500 and 50000 without throwing another exception.
- **Rejected price (`requestedPrice : int`):** private in both exception types, exposed through `getRequestedPrice() : int`. Both exceptions extend `Exception` directly.
- **Stored books (`books : ArrayList<Book>`):** private list of `BookShelf`, without a direct setter.

**Constructors and operations**
- `Book(isbn : String, title : String, price : int)` validates all fields and declares any propagated checked exceptions using `throws`. Each exception constructor stores the price and passes an explanatory message to its superclass.
- The `BookShelf()` constructor creates an empty list. The container provides `addBook(book : Book) : void` and `getBooks() : List<Book>`. The returned collection must not allow changes to the internal list. Reject another book with an existing ISBN using `IllegalArgumentException`.

**Main program**
- Try changing one book's price to 300 and then 62000. Handle the errors separately by setting the price to 500 and 50000. Add the books to the shelf and display the results.

:::endexercise

:::exercise
### Cinema screenings – selecting another show {#task-3}

![UML](content/chapters/13-kivetelek/media/task-3-en.svg){width=760}

Create a booking system where `Screening` represents one screening and `Cinema` stores the available screenings. A screening reports insufficient seats, while the application selects a different time.

**Fields of `Screening`**
- **Title (`movieTitle : String`):** private, non-empty, accessible through `getMovieTitle() : String` with no setter.
- **ID (`screeningId : String`):** private, non-empty, returned by `getScreeningId() : String` and never changed externally.
- **Capacity (`capacity : int`):** positive, private, read-only through `getCapacity() : int`.
- **Reserved seats (`reservedSeats : int`):** private, initially zero, read-only through `getReservedSeats() : int`. No direct setter.

- **Screenings (`screenings : ArrayList<Screening>`):** private list of `Cinema`, with no direct setter. `Cinema()` initializes it empty.

**Constructors and operations**
- `Screening(movieTitle : String, screeningId : String, capacity : int)` validates and stores the fields; `getFreeSeats() : int` returns the number of remaining seats.
- `reserveSeats(count : int) : void` throws `InvalidReservationException` for a non-positive count and `NotEnoughSeatsException` if the request exceeds available seats. On success it increases `reservedSeats`; on failure it must not change the state.
- Both exceptions extend `Exception` directly and accept a message in their constructors. `reserveSeats()` declares both checked exceptions using `throws`.
- `addScreening(screening : Screening) : void` rejects null and repeated IDs. `findWithFreeSeats(movieTitle : String, count : int) : Screening` returns the first screening of the specified movie that has at least `count` free seats, or `null` when none exists. The movie title must be nonempty and `count` positive; otherwise it throws `IllegalArgumentException`. Searching does not reserve seats.

**Main program**
- Create at least three screenings, including two showings of the same movie at different times, and attempt a booking that cannot be fulfilled. After catching `NotEnoughSeatsException`, find another screening of the same film, check that the result is not `null`, and make the booking there. Verify that the original screening was not modified.

:::endexercise

:::exercise
### Parcel shipping – alternative transport {#task-4}

![UML](content/chapters/13-kivetelek/media/task-4-en.svg){width=760}

Create a shipping system where ordinary courier delivery accepts parcels weighing up to 20 kg. When the parcel is too heavy, the application can choose freight delivery instead.

**Fields and access**
- **Parcel ID (`parcelId : String`):** private, non-empty, returned by `getParcelId() : String`, with no setter.
- **Weight (`weightKg : int`):** private, positive. `getWeightKg() : int` returns it and `setWeightKg(value : int) : void` validates it, throwing `IllegalArgumentException` if invalid without modifying the old value.
- **Limit (`COURIER_LIMIT : int`):** public static constant of `ShippingCenter`, equal to 20.
- **Shipped parcels (`shipped : ArrayList<Parcel>`):** private list within `ShippingCenter`. `getShipped() : List<Parcel>` returns a copy, so callers cannot modify the internal list through it.

**Constructors and methods**
- `Parcel(parcelId : String, weightKg : int)` validates both fields. `ShippingCenter()` creates an empty collection.
- `shipByCourier(parcel : Parcel) : void` rejects null and repeated IDs. It throws `TooHeavyParcelException` if the weight exceeds the limit (declared with `throws`), otherwise it adds the parcel.
- `shipByFreight(parcel : Parcel) : void` performs the same null and duplicate checks but has no 20 kg restriction. `TooHeavyParcelException` extends `Exception` directly, receives the rejected weight in its constructor and exposes it through `getWeightKg() : int`.

**Main program**
- Create parcels of 8, 24 and 35 kg. Try courier delivery first; if a `TooHeavyParcelException` occurs, send the same parcel by freight instead. Verify that each parcel appears exactly once in the collection and that unrelated failures do not trigger automatic fallback.

:::endexercise

:::exercise
### Measurements – file input and partial success {#task-5}

![UML](content/chapters/13-kivetelek/media/task-5-en.svg){width=760}

Develop an application that reads measurements from a semicolon-separated text file. Each line has the form `identifier;value`; the identifier must be non-empty and the value must be an integer in $[0,100]$. Invalid rows should be reported and skipped, while valid rows are processed normally.

**Classes and fields**
- **Sensor ID (`sensorId : String`):** private field of `Measurement`; it must not be `null` or empty. `getSensorId() : String` returns it; no setter is provided.
- **Measured value (`value : int`):** private field of `Measurement`, valid in $[0,100]$. `getValue() : int` returns it. `setValue(value : int) : void` checks the interval, throwing `InvalidMeasurementException` on an invalid value without changing the previous one.
- `InvalidMeasurementException` is a **checked exception** extending `Exception`. A private `lineNumber : int` stores the affected line number (0 when unknown), returned by `getLineNumber() : int`. Its constructor accepts the message and line number.
- `MeasurementArchive` holds a private `measurements : ArrayList<Measurement>` list with no setter. `getMeasurements() : List<Measurement>` returns a copy of the list.

**Constructors and methods**
- `Measurement(sensorId : String, value : int)` validates its data and propagates (`throws`) `InvalidMeasurementException` for an invalid value. `MeasurementArchive()` creates an empty list.
- `addMeasurement(measurement : Measurement) : void` throws `IllegalArgumentException` for null or a repeated sensor ID.
- `MeasurementImporter` provides `load(fileName : String, archive : MeasurementArchive) : int`, which reads the file and returns the number of measurements added. Malformed lines, non-integer values and measurements outside the permitted interval are reported with their line numbers and skipped. Read using `Scanner` constructed with a `File` object. File-opening and reading errors must propagate as `IOException`; check `Scanner.ioException()` for I/O errors recorded during iteration. Use Java `try-with-resources` to close the scanner even after an exception. Report and skip malformed, out-of-range and duplicate-sensor records with their line numbers.

**Main program and sample data**
- The input may contain `A01;42`, `B02;125`, `C03;bad` and `D04;78` on separate lines. Display the number of records actually added to the container; report invalid rows with their line numbers while processing. Catch `IOException` separately in the main program. Students create the sample file themselves; no external attachment is required.

:::endexercise
