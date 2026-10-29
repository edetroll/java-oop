# 异常

在设计类时，我们通常假设方法能够收到有效参数，并顺利完成操作。但实际运行中，用户可能输入错误数据、程序需要的文件可能不存在，或者对象当前的状态不允许执行某项操作。这些情况必须被识别出来，但**发现问题的方法不一定负责解决问题**。如果把所有恢复逻辑都写进数据类，类的职责就会变得不清晰。

假设温控器只允许把目标温度设为 $[18,28]$ 区间内的数值。温控器可以判断一个数值是否有效，却无法决定输入错误时究竟应该让用户重新输入、跳过文件中的一行，还是改用最近的允许值。不同的应用程序可能采取不同的处理方式。**异常**使我们能够在类内部报告错误，而把具体的恢复策略交给使用该类的程序部分。

## 错误的报告 {#error-signalling}

我们已经学习过参数验证。遇到无效参数时，可以打印错误消息，也可以返回一个特殊值。然而，直接打印消息会把业务类与用户界面绑定在一起，控制台程序、图形程序和网页程序的提示方式并不相同。特殊返回值也未必可行，因为所有数值可能都是合法结果，而且构造方法本来就没有返回值。

另一种方式是使用 `throw` **抛出异常**。在 Java 中，被抛出的对象必须属于 `Throwable` 的子类。下面使用 `IllegalArgumentException` 表示参数不在允许区间内。发生异常时，不会保存无效值，方法也会立即停止正常执行。

:::lang java
```java
class 温度设置 {
    private int 目标温度 = 22;

    public void 设置目标温度(int 数值) {
        if (数值 < 18 || 数值 > 28)
            throw new IllegalArgumentException("Temperature outside 18..28");
        目标温度 = 数值;
    }

    public int 获取目标温度() { return 目标温度; }
}
```
:::end
:::lang csharp
```csharp
using System;
class 温度设置 {
    private int 目标温度 = 22;

    public void 设置目标温度(int 数值) {
        if (数值 < 18 || 数值 > 28)
            throw new ArgumentOutOfRangeException(nameof(数值));
        目标温度 = 数值;
    }

    public int 获取目标温度() => 目标温度;
}
```
:::end
:::lang python
```python
class 温度设置:
    def __init__(self):
        self._targetTemperature = 22

    def 设置目标温度(self, 数值):
        if 数值 < 18 or 数值 > 28:
            raise ValueError("Temperature outside 18..28")
        self._targetTemperature = 数值

    def 获取目标温度(self):
        return self._targetTemperature
```
:::end
:::lang cpp
```cpp
#include <stdexcept>
class 温度设置 {
    int 目标温度 = 22;
public:
    void 设置目标温度(int 数值) {
        if (数值 < 18 || 数值 > 28)
            throw std::out_of_range("Temperature outside 18..28");
        目标温度 = 数值;
    }
    int 获取目标温度() const { return 目标温度; }
};
```
:::end

## 异常的传播与处理 {#propagation}

异常抛出后，当前操作的正常执行流程会中断。运行环境先在当前方法中寻找合适的处理程序；如果没有找到，就沿着方法调用链返回到调用者，继续寻找匹配的 `catch`。如果整个调用链都没有处理该异常，它就会以未处理异常的形式到达运行环境。因此，**异常并不一定要在抛出它的地方处理**，负责验证数据的类通常只需要报告问题。

在下面的例子中，`validate()` 抛出异常，而 `apply()` 和 `configure()` 不捕获该异常。主程序在 `try` 中调用操作，并在 `catch` 中进行处理。需要注意：捕获异常以后，程序不会回到出错语句继续执行，而是从异常处理结构之后继续运行。

:::lang java
```java
class 温度服务 {
    static void 验证(int 数值) {
        if (数值 < 18 || 数值 > 28)
            throw new IllegalArgumentException("Invalid temperature");
    }
    static void 应用(int 数值) { 验证(数值); }
    static void 配置温度(int 数值) { 应用(数值); }
}
class 主程序 {
    public static void main(String[] args) {
        try {
            温度服务.配置温度(35);
        } catch (IllegalArgumentException 错误) {
            System.out.println("Configuration rejected: " + 错误.getMessage());
        }
    }
}
```
:::end
:::lang csharp
```csharp
using System;
class 温度服务 {
    public static void 验证(int 数值) {
        if (数值 < 18 || 数值 > 28)
            throw new ArgumentOutOfRangeException(nameof(数值));
    }
    public static void 应用(int 数值) { 验证(数值); }
    public static void 配置温度(int 数值) { 应用(数值); }
}
class 主程序 {
    static void 主程序() {
        try { 温度服务.配置温度(35); }
        catch (ArgumentOutOfRangeException 错误) {
            Console.WriteLine("Configuration rejected: " + 错误.Message);
        }
    }
}
```
:::end
:::lang python
```python
class 温度服务:
    @staticmethod
    def 验证(数值):
        if 数值 < 18 or 数值 > 28:
            raise ValueError("Invalid temperature")

    @staticmethod
    def 应用(数值):
        温度服务.验证(数值)

    @staticmethod
    def 配置温度(数值):
        温度服务.应用(数值)

try:
    温度服务.配置温度(35)
except ValueError as 错误:
    print("Configuration rejected:", 错误)
```
:::end
:::lang cpp
```cpp
#include <iostream>
#include <stdexcept>
class 温度服务 {
public:
    static void 验证(int 数值) {
        if (数值 < 18 || 数值 > 28)
            throw std::out_of_range("Invalid temperature");
    }
    static void 应用(int 数值) { 验证(数值); }
    static void 配置温度(int 数值) { 应用(数值); }
};
int main() {
    try { 温度服务::配置温度(35); }
    catch (const std::out_of_range& 错误) {
        std::cout << "Configuration rejected: " << 错误.what() << '\n';
    }
}
```
:::end

## 异常类型与 `catch` 的顺序 {#catch-order}

异常本身是对象，因此不同异常类之间可以存在继承关系。一个 `try` 后可以有多个 `catch`，系统按照书写顺序查找，执行**第一个类型兼容的处理分支**。因此应该先写较具体的异常类型，再写较一般的父类。如果 Java 编译器发现后面的某个 `catch` 永远无法执行，就会拒绝编译。

下面的例子专门处理字符串转换为整数失败的情况。在 Java 中，`NumberFormatException` 继承自 `IllegalArgumentException`，因此所示顺序是正确的。异常对象的 `getMessage()` 可以获得错误消息，`printStackTrace()` 则有助于分析调用链。利用不同的异常类型，我们可以为不同的问题选择不同的恢复措施。

:::lang java
```java
class 主程序 {
    public static void main(String[] args) {
        try {
            int 数字 = Integer.parseInt("not-a-数字");
            System.out.println(数字);
        } catch (NumberFormatException 错误) {
            System.out.println("The text is not an integer.");
        } catch (IllegalArgumentException 错误) {
            System.out.println("Invalid argument: " + 错误.getMessage());
        }
    }
}
```
:::end
:::lang csharp
```csharp
using System;
class 主程序 {
    static void 主程序() {
        try {
            int 数字 = int.Parse("not-a-数字");
            Console.WriteLine(数字);
        } catch (FormatException 错误) {
            Console.WriteLine("The text is not an integer.");
        } catch (Exception 错误) {
            Console.WriteLine("Other 错误: " + 错误.Message);
        }
    }
}
```
:::end
:::lang python
```python
try:
    数字 = int("not-a-数字")
    print(数字)
except ValueError as 错误:
    print("The text is not an integer.")
except Exception as 错误:
    print("Other 错误:", 错误)
```
:::end
:::lang cpp
```cpp
#include <iostream>
#include <string>
#include <stdexcept>
int main() {
    try {
        int 数字 = std::stoi("not-a-数字");
        std::cout << 数字;
    } catch (const std::invalid_argument& 错误) {
        std::cout << "The text is not an integer.\n";
    } catch (const std::exception& 错误) {
        std::cout << "Other 错误: " << 错误.what() << '\n';
    }
}
```
:::end

## 受检异常与非受检异常 {#checked-unchecked}

Java 中需要区分**非受检异常**和**受检异常**。`RuntimeException` 及其子类属于非受检异常，编译器不要求我们必须捕获或声明它们，例如 `IllegalArgumentException` 和 `IndexOutOfBoundsException`。对于 `IOException` 等受检异常，方法必须进行处理，或者在方法声明中使用 `throws` 标明该异常可能传递给调用者。

因此，并不是每条 `throw` 语句都需要对应一个 `throws`。`throws IOException` 并不处理异常，而是说明当前方法可能把它继续传递出去。属于 `Error` 的严重运行环境故障通常也不作为普通的、可恢复的业务错误来处理。

:::lang java
```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
class SettingsLoader {
    public String load(String 文件名) throws IOException {
        return Files.readString(Path.of(文件名));
    }
}
```
:::end
:::lang csharp
```csharp
using System.IO;
class SettingsLoader {
    public string Load(string 文件名) {
        return File.ReadAllText(文件名);
        // IOException is possible; no throws clause exists in C#.
    }
}
```
:::end
:::lang python
```python
class SettingsLoader:
    def load(self, 文件名):
        with open(文件名, encoding="utf-8") as 读取器:
            return 读取器.read()
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
    std::string load(const std::string& 文件名) {
        std::ifstream 读取器(文件名);
        if (!读取器) throw std::runtime_error("Cannot open file");
        return std::string(std::istreambuf_iterator<char>(读取器),
                           std::istreambuf_iterator<char>());
    }
};
```
:::end

## 自定义异常与真正的恢复 {#custom-exceptions}

通用的 `IllegalArgumentException` 有时不足以准确表达问题。对于温控器，我们希望区分温度过低和温度过高，因此可以定义两个专门的异常类，并把出错的原始数值保存在异常对象中。类名以 `Exception` 结尾是一种常用命名习惯，但并不是语法要求。

下面的程序把职责分开：温控器的 setter 负责验证并抛出异常，主程序负责**恢复正常工作**。温度过低时使用允许的最小值，过高时使用最大值，然后继续处理下一条数据。因此，异常处理并不只是打印错误消息。其他程序也可以选择让用户重新输入，或者取消整个操作。

:::lang java
```java
class 温度过低异常 extends RuntimeException {
    private final int 原值;
    public 温度过低异常(int 数值) {
        super("Temperature below 18: " + 数值);
        原值 = 数值;
    }
    public int 获取原值() { return 原值; }
}
class 温度过高异常 extends RuntimeException {
    private final int 原值;
    public 温度过高异常(int 数值) {
        super("Temperature above 28: " + 数值);
        原值 = 数值;
    }
    public int 获取原值() { return 原值; }
}
class 温度设置 {
    static final int MIN = 18;
    static final int MAX = 28;
    private int 目标温度 = 22;
    public void 设置目标温度(int 数值) {
        if (数值 < MIN) throw new 温度过低异常(数值);
        if (数值 > MAX) throw new 温度过高异常(数值);
        目标温度 = 数值;
    }
    public int 获取目标温度() { return 目标温度; }
}
class 主程序 {
    public static void main(String[] args) {
        温度设置 温控器 = new 温度设置();
        int[] 读数列表 = {23, 12, 35};
        for (int 要求值 : 读数列表) {
            try {
                温控器.设置目标温度(要求值);
            } catch (温度过低异常 错误) {
                温控器.设置目标温度(温度设置.MIN);
            } catch (温度过高异常 错误) {
                温控器.设置目标温度(温度设置.MAX);
            }
            System.out.println(温控器.获取目标温度());
        }
    }
}
```
:::end
:::lang csharp
```csharp
using System;
class 温度过低异常 : Exception {
    public int 原值 { get; }
    public 温度过低异常(int 数值)
        : base("Temperature below 18: " + 数值) { 原值 = 数值; }
}
class 温度过高异常 : Exception {
    public int 原值 { get; }
    public 温度过高异常(int 数值)
        : base("Temperature above 28: " + 数值) { 原值 = 数值; }
}
class 温度设置 {
    public const int MIN = 18, MAX = 28;
    private int 目标温度 = 22;
    public void 设置目标温度(int 数值) {
        if (数值 < MIN) throw new 温度过低异常(数值);
        if (数值 > MAX) throw new 温度过高异常(数值);
        目标温度 = 数值;
    }
    public int 获取目标温度() => 目标温度;
}
class 主程序 {
    static void 主程序() {
        var 温控器 = new 温度设置();
        foreach (int 要求值 in new[] {23, 12, 35}) {
            try { 温控器.设置目标温度(要求值); }
            catch (温度过低异常) {
                温控器.设置目标温度(温度设置.MIN);
            } catch (温度过高异常) {
                温控器.设置目标温度(温度设置.MAX);
            }
            Console.WriteLine(温控器.获取目标温度());
        }
    }
}
```
:::end
:::lang python
```python
class 温度过低异常(Exception):
    def __init__(self, 数值):
        super().__init__(f"Temperature below 18: {数值}")
        self.原值 = 数值

class 温度过高异常(Exception):
    def __init__(self, 数值):
        super().__init__(f"Temperature above 28: {数值}")
        self.原值 = 数值

class 温度设置:
    MIN, MAX = 18, 28
    def __init__(self):
        self._targetTemperature = 22
    def 设置目标温度(self, 数值):
        if 数值 < self.MIN: raise 温度过低异常(数值)
        if 数值 > self.MAX: raise 温度过高异常(数值)
        self._targetTemperature = 数值
    def 获取目标温度(self):
        return self._targetTemperature

温控器 = 温度设置()
for 要求值 in (23, 12, 35):
    try:
        温控器.设置目标温度(要求值)
    except 温度过低异常:
        温控器.设置目标温度(温度设置.MIN)
    except 温度过高异常:
        温控器.设置目标温度(温度设置.MAX)
    print(温控器.获取目标温度())
```
:::end
:::lang cpp
```cpp
#include <iostream>
#include <stdexcept>
#include <string>
class 温度过低异常 : public std::runtime_error {
    int 原值;
public:
    explicit 温度过低异常(int 数值)
        : std::runtime_error("Temperature below 18"), 原值(数值) {}
    int 获取原值() const { return 原值; }
};
class 温度过高异常 : public std::runtime_error {
    int 原值;
public:
    explicit 温度过高异常(int 数值)
        : std::runtime_error("Temperature above 28"), 原值(数值) {}
    int 获取原值() const { return 原值; }
};
class 温度设置 {
public:
    static constexpr int MIN = 18, MAX = 28;
private:
    int 目标温度 = 22;
public:
    void 设置目标温度(int 数值) {
        if (数值 < MIN) throw 温度过低异常(数值);
        if (数值 > MAX) throw 温度过高异常(数值);
        目标温度 = 数值;
    }
    int 获取目标温度() const { return 目标温度; }
};
int main() {
    温度设置 温控器;
    for (int 要求值 : {23, 12, 35}) {
        try { 温控器.设置目标温度(要求值); }
        catch (const 温度过低异常&) {
            温控器.设置目标温度(温度设置::MIN);
        } catch (const 温度过高异常&) {
            温控器.设置目标温度(温度设置::MAX);
        }
        std::cout << 温控器.获取目标温度() << '\n';
    }
}
```
:::end

![UML](content/chapters/13-kivetelek/media/main-thermostat-zh.svg){width=680}

## 使用 `finally` 释放资源 {#finally}

文件、网络连接以及其他外部资源在使用结束后都应该被释放。通常情况下，无论 `try` 中的操作是否成功、是否抛出了异常，`finally` 都会执行。即使没有合适的 `catch`，也可以先完成清理，然后继续传播异常。否则，一旦文件读取操作中途失败，放在 `try` 末尾的普通关闭语句可能根本得不到执行。

下面展示传统的 `try–catch–finally` 结构。关闭文件之前先检查它是否成功打开，同时还要考虑关闭操作本身也可能失败。需要注意，在进程被强制终止等极端情况下，并不能保证正常的资源清理一定发生。

:::lang java
```java
import java.io.*;
class 主程序 {
    public static void main(String[] args) {
        BufferedReader 读取器 = null;
        try {
            读取器 = new BufferedReader(new FileReader("设置集.txt"));
            System.out.println(读取器.readLine());
        } catch (IOException 错误) {
            System.out.println("Cannot read the file: " + 错误.getMessage());
        } finally {
            if (读取器 != null) {
                try { 读取器.close(); }
                catch (IOException 关闭错误) {
                    System.out.println("Cannot close the file.");
                }
            }
        }
    }
}
```
:::end
:::lang csharp
```csharp
using System;
using System.IO;
class 主程序 {
    static void 主程序() {
        StreamReader 读取器 = null;
        try {
            读取器 = new StreamReader("设置集.txt");
            Console.WriteLine(读取器.ReadLine());
        } catch (IOException 错误) {
            Console.WriteLine("Cannot read the file: " + 错误.Message);
        } finally {
            读取器?.Dispose();
        }
    }
}
```
:::end
:::lang python
```python
读取器 = None
try:
    读取器 = open("设置集.txt", encoding="utf-8")
    print(读取器.readline().rstrip("\n"))
except OSError as 错误:
    print("Cannot read the file:", 错误)
finally:
    if 读取器 is not None:
        读取器.close()
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
        std::ifstream 读取器("设置集.txt");
        if (!读取器) throw std::runtime_error("Cannot open file");
        std::string 一行;
        if (!std::getline(读取器, 一行))
            throw std::runtime_error("Cannot read 一行");
        std::cout << 一行 << '\n';
        // The local 读取器 is closed automatically (RAII).
    } catch (const std::exception& 错误) {
        std::cout << "Cannot read the file: " << 错误.what() << '\n';
    }
}
```
:::end

在现代 Java 中，文件处理通常优先使用 `try-with-resources`。实现了 `AutoCloseable` 的对象会在代码块结束时自动关闭，从而减少重复代码和资源泄漏。C# 的 `using`、Python 的 `with` 与 C++ 依靠对象生命周期管理资源的方式也有相似目的，但具体语法和规则不同。即使如此，我们仍然需要理解 `finally`，因为它也可以负责文件之外的其他清理工作。

:::lang java
```java
import java.io.*;
class 主程序 {
    public static void main(String[] args) {
        try (BufferedReader 读取器 = new BufferedReader(
                new FileReader("设置集.txt"))) {
            System.out.println(读取器.readLine());
        } catch (IOException 错误) {
            System.out.println("Cannot read the file: " + 错误.getMessage());
        }
    }
}
```
:::end
:::lang csharp
```csharp
using System;
using System.IO;
class 主程序 {
    static void 主程序() {
        try {
            using var 读取器 = new StreamReader("设置集.txt");
            Console.WriteLine(读取器.ReadLine());
        } catch (IOException 错误) {
            Console.WriteLine("Cannot read the file: " + 错误.Message);
        }
    }
}
```
:::end
:::lang python
```python
try:
    with open("设置集.txt", encoding="utf-8") as 读取器:
        print(读取器.readline().rstrip("\n"))
except OSError as 错误:
    print("Cannot read the file:", 错误)
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
        std::ifstream 读取器("设置集.txt");
        if (!读取器) throw std::runtime_error("Cannot open file");
        std::string 一行;
        if (!std::getline(读取器, 一行))
            throw std::runtime_error("Cannot read 一行");
        std::cout << 一行 << '\n';
    } catch (const std::exception& 错误) {
        std::cout << "Cannot read the file: " << 错误.what() << '\n';
    }
}
```
:::end

## 另一个例子：用替代操作恢复 {#fallback}

假设快递服务只接受重量不超过 20 千克的包裹。负责快递寄送的类可以识别超重情况，并通过自定义异常报告问题。但它不应该自行决定是拒绝订单、把包裹拆开，还是改用货运服务。这些决策应由协调订单的程序部分完成。

在下面的例子中，调用者首先尝试使用快递服务，只有在重量超限时才改用货运服务。这里的异常处理包含了真正的替代操作。对于非正数的无效重量，我们故意不采用同样的方法，因为改换运输方式并不能修正错误的输入。这说明区分异常类型具有实际意义。

:::lang java
```java
class 重量超限异常 extends RuntimeException {
    public 重量超限异常(int 重量公斤) {
        super("Courier 限额 is 20 kg; package is " + 重量公斤 + " kg");
    }
}
class 快递服务 {
    public void 快递寄送(int 重量公斤) {
        if (重量公斤 <= 0) throw new IllegalArgumentException("Invalid 重量");
        if (重量公斤 > 20) throw new 重量超限异常(重量公斤);
        System.out.println("Courier 寄件 registered.");
    }
    public void 货运寄送(int 重量公斤) {
        if (重量公斤 <= 0) throw new IllegalArgumentException("Invalid 重量");
        System.out.println("Freight 寄件 registered.");
    }
}
class 主程序 {
    public static void main(String[] args) {
        快递服务 服务 = new 快递服务();
        try { 服务.快递寄送(32); }
        catch (重量超限异常 错误) {
            服务.货运寄送(32); // Real fallback, not just an 错误 message
        }
    }
}
```
:::end
:::lang csharp
```csharp
using System;
class 重量超限异常 : Exception {
    public 重量超限异常(int 重量公斤)
        : base("Courier 限额 is 20 kg; package is " + 重量公斤 + " kg") {}
}
class 快递服务 {
    public void 快递寄送(int 重量公斤) {
        if (重量公斤 <= 0) throw new ArgumentOutOfRangeException(nameof(重量公斤));
        if (重量公斤 > 20) throw new 重量超限异常(重量公斤);
        Console.WriteLine("Courier 寄件 registered.");
    }
    public void 货运寄送(int 重量公斤) {
        if (重量公斤 <= 0) throw new ArgumentOutOfRangeException(nameof(重量公斤));
        Console.WriteLine("Freight 寄件 registered.");
    }
}
class 主程序 {
    static void 主程序() {
        var 服务 = new 快递服务();
        try { 服务.快递寄送(32); }
        catch (重量超限异常) { 服务.货运寄送(32); }
    }
}
```
:::end
:::lang python
```python
class 重量超限异常(Exception):
    pass

class 快递服务:
    def 快递寄送(self, 重量公斤):
        if 重量公斤 <= 0: raise ValueError("Invalid 重量")
        if 重量公斤 > 20: raise 重量超限异常("Courier 限额: 20 kg")
        print("Courier 寄件 registered.")

    def 货运寄送(self, 重量公斤):
        if 重量公斤 <= 0: raise ValueError("Invalid 重量")
        print("Freight 寄件 registered.")

服务 = 快递服务()
try:
    服务.快递寄送(32)
except 重量超限异常:
    服务.货运寄送(32)
```
:::end
:::lang cpp
```cpp
#include <iostream>
#include <stdexcept>
class 重量超限异常 : public std::runtime_error {
public:
    重量超限异常() : std::runtime_error("Courier 限额: 20 kg") {}
};
class 快递服务 {
public:
    void 快递寄送(int 重量公斤) {
        if (重量公斤 <= 0) throw std::invalid_argument("Invalid 重量");
        if (重量公斤 > 20) throw 重量超限异常();
        std::cout << "Courier 寄件 registered.\n";
    }
    void 货运寄送(int 重量公斤) {
        if (重量公斤 <= 0) throw std::invalid_argument("Invalid 重量");
        std::cout << "Freight 寄件 registered.\n";
    }
};
int main() {
    快递服务 服务;
    try { 服务.快递寄送(32); }
    catch (const 重量超限异常&) { 服务.货运寄送(32); }
}
```
:::end

![UML](content/chapters/13-kivetelek/media/main-shipment-zh.svg){width=680}

## 练习 {#exercises}

前面的练习主要扩展已有的类，后面的练习则需要设计更加完整的系统，使发现错误的类与负责恢复的程序部分保持分离。每项任务先明确字段及其访问规则，再说明构造方法和其他操作。

:::exercise
### 温控器——修正无效数值 {#task-1}

![UML](content/chapters/13-kivetelek/media/task-1-zh.svg){width=760}

创建表示温控器的 `温度设置` 类，并定义两个自定义异常。温控器负责保存目标温度，而由主程序决定如何处理无效输入。

**字段与访问规则**
- **目标温度（`目标温度 : int`）：**私有，允许值为 $[18,28]$ 区间内的整数。`获取目标温度() : int` 返回当前数值，`设置目标温度(数值 : int) : void` 对过低数值抛出 `温度过低异常`，对过高数值抛出 `温度过高异常`。处理失败时原数值不得改变。
- **上下限（`MIN : int`、`MAX : int`）：**公共静态常量，分别为 18 和 28，供 setter 与主程序共同使用。
- **被拒绝的数值（`原值 : int`）：**两个自定义异常中的私有字段，`获取原值() : int` 返回该数值。异常类继承 `RuntimeException`。

**构造方法**
- `温度设置()` 将目标温度设为 22。两个异常类的构造方法接收并保存原始数值，同时把适当的消息传递给父类构造方法。

**主程序**
- 依次尝试 23、12、35。分别捕获两种异常：过低时设为 18，过高时设为 28。每次操作后输出实际温度，并验证程序继续处理下一条数据。

:::endexercise

:::exercise
### 图书——价格限制和数据修正 {#task-2}

![UML](content/chapters/13-kivetelek/media/task-2-zh.svg){width=760}

扩展之前的 `图书` 类，使用两种不同的异常表示价格过低或过高，而不是在类内部直接输出消息。可以复用已经实现的图书容器。

**字段与访问规则**
- **ISBN（`书号 : String`）：**私有，不可为 `null` 或空字符串。`获取书号() : String` 返回它，不提供 setter。
- **标题（`标题 : String`）：**私有，去除首尾空格后至少包含两个非空白字符。`获取标题() : String` 返回标题；`设置标题(数值 : String)` 验证后修改，无效时抛出 `IllegalArgumentException`。
- **价格（`价格 : int`）：**私有，合法范围 $[500,50000]$。`获取价格() : int` 返回价格；`设置价格(数值 : int)` 在过低或过高时分别抛出 `价格过低异常` 或 `价格过高异常`，并保留原价。
- **被拒绝的价格（`请求价格 : int`）：**两个异常类的私有字段，通过 `获取请求价格() : int` 返回。异常类继承 `RuntimeException`。

**构造方法与操作**
- `图书(书号 : String, 标题 : String, 价格 : int)` 必须验证所有字段。异常构造方法保存被拒绝的价格并将消息传递给父类。
- 容器 `书架` 提供 `添加图书(图书 : 图书) : void` 和 `获取图书() : List<图书>`。返回集合不能直接修改内部列表，ISBN 重复时抛出 `IllegalArgumentException`。

**主程序**
- 尝试将同一本书的价格改为 300 和 62000。分别在 `catch` 中设为 500 和 50000。把处理后的图书加入书架并显示结果。

:::endexercise

:::exercise
### 电影院排片——选择其他场次 {#task-3}

![UML](content/chapters/13-kivetelek/media/task-3-zh.svg){width=760}

设计订票系统：`场次` 代表一次电影放映，`影院` 管理所有场次。座位不足应由场次报告，而选择替代场次由调用者负责。

**`场次` 的字段**
- **电影名称（`电影名称 : String`）：**私有、非空，通过 `获取电影名称() : String` 查询，不提供 setter。
- **场次编号（`场次编号 : String`）：**私有、非空，通过 `获取场次编号() : String` 查询，不能从外部修改。
- **容量（`容量 : int`）：**正整数，通过 `获取容量() : int` 只读访问。
- **已订座位（`已订座位 : int`）：**私有，初始为 0，仅通过 `获取已订座位() : int` 查询，不提供 setter。

**构造方法与操作**
- `场次(电影名称 : String, 场次编号 : String, 容量 : int)` 验证并保存字段。`获取空位() : int` 返回剩余座位数。
- `预订座位(数量 : int) : void` 在数量不大于零时抛出 `预订无效异常`，在座位不足时抛出 `座位不足异常`。成功时增加已订座位；失败时不修改对象。
- 两种异常继承 `RuntimeException`，构造方法接收错误消息并传给父类。
- `影院` 保存私有列表 `场次列表 : ArrayList<场次>`。`添加场次(场次 : 场次) : void` 拒绝 `null` 和重复编号。`查找有空位场次(电影名称 : String, 数量 : int) : 场次` 返回第一个满足要求的场次，找不到时返回 `null`，查询本身不预订座位。

**主程序**
- 创建至少三个场次并尝试一次座位不足的预订。捕获 `座位不足异常` 后，寻找同一电影的另一个场次并完成预订。验证原场次状态没有改变。

:::endexercise

:::exercise
### 包裹寄送——替代运输方式 {#task-4}

![UML](content/chapters/13-kivetelek/media/task-4-zh.svg){width=760}

建立寄送系统：普通快递只接受不超过 20 千克的包裹，超重时可由应用程序选择货运服务。

**字段与访问规则**
- **包裹编号（`包裹编号 : String`）：**私有、非空，`获取包裹编号() : String` 返回，不提供 setter。
- **重量（`重量公斤 : int`）：**私有、正整数。`获取重量公斤() : int` 读取，`设置重量公斤(数值 : int) : void` 验证正数，无效时抛出 `IllegalArgumentException` 且不修改原值。
- **快递重量上限（`COURIER_LIMIT : int`）：**`运输中心` 的公共静态常量，值为 20。
- **已寄包裹（`已寄包裹 : ArrayList<包裹>`）：**`运输中心` 的私有列表。`获取已寄包裹() : List<包裹>` 返回副本，调用者不能直接修改内部列表。

**构造方法与操作**
- `包裹(包裹编号 : String, 重量公斤 : int)` 验证两项数据；`运输中心()` 创建空列表。
- `快递寄送(包裹 : 包裹) : void` 拒绝 `null` 和重复编号。超过上限时抛出 `包裹超重异常`，否则保存包裹。
- `货运寄送(包裹 : 包裹) : void` 也检查 `null` 和重复编号，但不受 20 千克限制。`包裹超重异常` 继承 `RuntimeException`，构造方法保存重量，并通过 `获取重量公斤() : int` 返回。

**主程序**
- 创建 8、24、35 千克三个包裹，先尝试快递，捕获 `包裹超重异常` 后把同一个包裹转为货运。检查每个包裹在列表中恰好出现一次，其他异常不应自动触发替代寄送。

:::endexercise

:::exercise
### 测量数据——文件处理与部分成功 {#task-5}

![UML](content/chapters/13-kivetelek/media/task-5-zh.svg){width=760}

设计程序，从以分号分隔的文本文件中读取测量数据。每行格式为 `标识符;数值`，标识符非空，数值必须是 $[0,100]$ 的整数。无效行需要报告并跳过，而其他记录继续处理。

**类与字段**
- `测量` 的私有 `传感器编号 : String` 不允许为空，由 `获取传感器编号() : String` 返回，不提供 setter；私有 `数值 : int` 必须位于 $[0,100]$，`获取数值() : int` 返回它，`设置数值(数值 : int) : void` 验证后修改，无效时抛出 `测量无效异常` 并保留旧值。
- `测量无效异常` 继承 `Exception`，属于**受检异常**。私有 `行号 : int` 保存出错的行号（未知时为 0），由 `获取行号() : int` 返回，构造方法接收错误消息和行号。
- `测量档案` 具有私有 `测量列表 : ArrayList<测量>`，不提供 setter。`获取测量列表() : List<测量>` 返回列表副本。

**构造方法与操作**
- `测量(传感器编号 : String, 数值 : int)` 验证字段，对无效测量值传播 `测量无效异常`（使用 `throws`）。`测量档案()` 创建空列表。
- `添加测量(测量 : 测量) : void` 对 `null` 或重复传感器编号抛出 `IllegalArgumentException`。
- 独立的 `测量导入器` 提供 `加载(文件名 : String, 档案 : 测量档案) : int`，读取所有行并返回成功加入的记录数。格式错误、整数解析失败以及越界的行都应报告行号后跳过。文件打开和读取失败则作为 `IOException` 传播给调用者。使用 Java `try-with-resources` 保证文件关闭。

**主程序与测试数据**
- 文件可以逐行包含 `A01;42`、`B02;125`、`C03;bad`、`D04;78`。保存有效记录，说明无效记录的原因并输出成功数量。主程序用单独的 `catch (IOException e)` 处理文件错误。测试文件由学生自己创建，不需要外部附件。

:::endexercise
