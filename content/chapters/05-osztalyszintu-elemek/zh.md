# 类级字段和方法

## 内存管理 {#memory}

此前，我们编写的类中，字段和方法都与各个实例相关联。当一个类创建了多个实例时，每个实例都有自己的字段，因此修改其中一个对象的数据，不会改变其他对象中同名字段的值。例如，我们创建两名学生时，他们的姓名和已修学分分别保存在各自的对象中。这样的字段称为**实例字段**。

在 Java 中，使用 `new` 关键字创建的对象存放在**堆（heap）**内存中。主程序中的 `第一位` 和 `第二位` 变量并不直接保存对象本身，而是保存指向对象的**引用**。为了方便观察，图中将两个对象画在一起，但它们在实际内存中不一定相邻。对象的字段属于该实例；如果某个字段引用了另一个对象，例如字符串，那么被引用的对象也可能存储在其他位置。

:::lang java
```java
class 学生 {
    private String 姓名;
    private int 学分;

    public 学生(String 姓名, int 学分) {
        this.姓名 = 姓名;
        this.学分 = 学分;
    }
}

class Main {
    public static void main(String[] args) {
        学生 第一个 = new 学生("Anna", 30);
        学生 第二个 = new 学生("Bela", 45);
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class 学生
{
    private string 姓名;
    private int 学分;

    public 学生(string 姓名, int 学分)
    {
        this.姓名 = 姓名;
        this.学分 = 学分;
    }
}

class 程序
{
    static void Main(string[] args)
    {
        学生 第一个 = new 学生("Anna", 30);
        学生 第二个 = new 学生("Bela", 45);
    }
}
```
:::end

:::lang python
```python
class 学生:
    def __init__(self, 姓名, 学分):
        self.姓名 = 姓名
        self.学分 = 学分

第一个 = 学生("Anna", 30)
第二个 = 学生("Bela", 45)
```
:::end

:::lang cpp
```cpp
#include <string>

class 学生 {
    std::string 姓名;
    int 学分;
public:
    学生(const std::string& 姓名, int 学分)
        : 姓名(姓名), 学分(学分) {}
};

int main() {
    学生 第一个("Anna", 30);
    学生 第二个("Bela", 45);
}
```
:::end

![实例与引用](content/chapters/05-osztalyszintu-elemek/media/memory-instances-zh.svg){width=620}

实例方法的情况有所不同。虽然调用实例方法时总是针对某个对象，但每创建一个实例，并不会同时复制一份该方法的程序代码。执行的仍然是同一段代码，只是方法会通过 `this` 访问当前调用它的对象的字段。因此，同一个方法在第一名学生身上可以使用 `30` 个学分的数据，在第二名学生身上则可以使用 `45` 个学分的数据。

## 类级字段 {#static-fields}

我们经常需要保存不属于某个具体实例，而是属于整个类的信息。假设应用程序中的所有学生都就读于同一所大学，那么大学名称就是这样的信息。没有必要在每个学生对象中分别保存相同的字符串，因为所有实例都需要访问同一份数据。此时，我们可以创建**类级字段**，让整个类共享一个值，而不受已创建实例数量的影响。

在 Java 中，我们使用 `static` 关键字声明类级字段。访问这样的字段时，通常应使用类名，例如 `学生.大学名称`；而访问实例字段则需要一个具体对象。与前面学习的字段一样，类级字段也可以具有 `public` 或 `private` 可见性。下面为了便于演示，直接允许外部访问大学名称，但对于可以修改的类级数据，通常仍应通过方法控制访问。

:::lang java
```java
class 学生 {
    public static String 大学名称 = "示例大学";
    private String 姓名;

    public 学生(String 姓名) {
        this.姓名 = 姓名;
    }
}

class Main {
    public static void main(String[] args) {
        学生 第一个 = new 学生("Anna");
        学生 第二个 = new 学生("Bela");
        System.out.println(学生.大学名称);
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class 学生
{
    public static string 大学名称 = "示例大学";
    private string 姓名;

    public 学生(string 姓名)
    {
        this.姓名 = 姓名;
    }
}

class 程序
{
    static void Main(string[] args)
    {
        学生 第一个 = new 学生("Anna");
        学生 第二个 = new 学生("Bela");
        Console.WriteLine(学生.大学名称);
    }
}
```
:::end

:::lang python
```python
class 学生:
    大学名称 = "示例大学"

    def __init__(self, 姓名):
        self.姓名 = 姓名

第一个 = 学生("Anna")
第二个 = 学生("Bela")
print(学生.大学名称)
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>

class 学生 {
public:
    inline static std::string 大学名称 = "示例大学";
private:
    std::string 姓名;
public:
    explicit 学生(const std::string& 姓名) : 姓名(姓名) {}
};

int main() {
    学生 第一个("Anna");
    学生 第二个("Bela");
    std::cout << 学生::大学名称 << '\n';
}
```
:::end

![共享类级字段与实例](content/chapters/05-osztalyszintu-elemek/media/memory-zh.svg){width=760}

为了使两类字段更加容易区分，本教材约定将类级字段写成大写形式，并使用下划线分隔单词，例如英文代码中的 `UNIVERSITY_NAME` 和 `NEXT_ID`。对于可以修改的静态字段，这只是我们在课程中采用的命名约定；Java 的常见命名规范主要在常量上采用这种形式。类级方法仍按照普通方法的方式命名。中文代码中的标识符使用中文名称，不受英文大小写规则的限制。

类级字段并不属于某个单独的 `学生` 对象，而是与整个类相关联的共享数据。如果修改大学名称，所有实例看到的都会是新值，因为我们修改的是一个共同字段，而不是逐个修改对象中的字段。但这并不意味着学生的所有信息都成为共享数据：`姓名` 字段仍然分别属于每个实例。

### 类级常量 {#constants}

某些类级数据在程序运行过程中不应发生变化，例如允许修读的最大学分数，或者在一次程序运行中固定不变的学校标识。在 Java 中，除了 `static`，我们还会使用 `final` 关键字声明这样的字段。对于英文标识符，Java 的常见命名规范也要求类级常量使用全大写字母，并以下划线分隔单词。

:::lang java
```java
class 学生 {
    public static final int 最大学分 = 300;
}

class Main {
    public static void main(String[] args) {
        System.out.println(学生.最大学分);
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class 学生
{
    public const int 最大学分 = 300;
}

class 程序
{
    static void Main(string[] args)
    {
        Console.WriteLine(学生.最大学分);
    }
}
```
:::end

:::lang python
```python
class 学生:
    最大学分 = 300

print(学生.最大学分)
```
:::end

:::lang cpp
```cpp
#include <iostream>

class 学生 {
public:
    static constexpr int 最大学分 = 300;
};

int main() {
    std::cout << 学生::最大学分 << '\n';
}
```
:::end

`final` 使 Java 程序无法再给该字段赋予新值。不过，如果字段保存的是对象引用，`final` 本身并不会阻止被引用对象的内部状态发生变化。对于这里展示的简单常量，C# 使用 `const` 关键字，C++ 则可以使用 `constexpr`。在 Python 中，全大写名称只是一种约定，并不会真正禁止之后修改数值。

## 类级方法 {#static-methods}

不仅字段可以属于类，方法也可以是类级的。调用这样的**类级方法**时，不需要先创建对象，因此它们特别适合处理类的共享数据，或者执行根本不需要实例状态的操作。例如，我们可以通过类级方法查询或修改大学名称。在下面的例子中，原本公开的字段被改为 `private`，外部程序只能通过类级方法访问它。

:::lang java
```java
class 学生 {
    private static String 大学名称 = "示例大学";

    public static String 获取大学名称() {
        return 大学名称;
    }

    public static void 设置大学名称(String 值) {
        if (值 == null || 值.isBlank())
            throw new IllegalArgumentException("Invalid university 姓名.");
        大学名称 = 值;
    }
}

class Main {
    public static void main(String[] args) {
        学生.设置大学名称("新大学");
        System.out.println(学生.获取大学名称());
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class 学生
{
    private static string 大学名称 = "示例大学";

    public static string 获取大学名称()
    {
        return 大学名称;
    }

    public static void 设置大学名称(string 值)
    {
        if (string.IsNullOrWhiteSpace(值))
            throw new ArgumentException("Invalid university 姓名.");
        大学名称 = 值;
    }
}

class 程序
{
    static void Main(string[] args)
    {
        学生.设置大学名称("新大学");
        Console.WriteLine(学生.获取大学名称());
    }
}
```
:::end

:::lang python
```python
class 学生:
    _大学名称 = "示例大学"

    @classmethod
    def 获取大学名称(cls):
        return cls._大学名称

    @classmethod
    def 设置大学名称(cls, 值):
        if not 值 or not 值.strip():
            raise ValueError("Invalid university 姓名.")
        cls._大学名称 = 值

学生.设置大学名称("新大学")
print(学生.获取大学名称())
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <stdexcept>
#include <string>

class 学生 {
    inline static std::string 大学名称 = "示例大学";
public:
    static std::string 获取大学名称() {
        return 大学名称;
    }

    static void 设置大学名称(const std::string& 值) {
        if (值.empty())
            throw std::invalid_argument("Invalid university 姓名.");
        大学名称 = 值;
    }
};

int main() {
    学生::设置大学名称("新大学");
    std::cout << 学生::获取大学名称() << '\n';
}
```
:::end

Java 和 C# 使用 `static` 关键字声明类级方法，C++ 也有类似的语法。Python 则提供 `@classmethod` 装饰器，被它修饰的方法会通过 `cls` 参数自动接收当前类；使用 `@staticmethod` 时，方法既不会自动接收实例，也不会自动接收类。两种 Python 写法并不完全相同，我们需要根据方法的用途进行选择。

### 访问规则 {#access}

实例方法可以直接访问当前实例的字段和方法，也能访问类级成员。类级方法则没有当前实例，因此只能直接使用类级字段和方法。这并不表示静态方法完全不能访问实例数据：只要它拥有某个具体对象的引用，就可以通过该引用访问对象的字段和方法。由于访问代码仍然位于定义这些字段的类中，所以即使字段是 `private`，也可以通过相应对象访问。

:::lang java
```java
class 学生 {
    private String 姓名;
    private static String 大学名称 = "示例大学";

    public 学生(String 姓名) {
        this.姓名 = 姓名;
    }

    public String 获取描述() {
        return 姓名 + " - " + 大学名称;
    }

    public static String 描述(学生 学生对象) {
        return 学生对象.姓名 + " - " + 大学名称;
        // return 姓名; // Invalid: no current 实例.
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class 学生
{
    private string 姓名;
    private static string 大学名称 = "示例大学";

    public 学生(string 姓名) { this.姓名 = 姓名; }

    public string 获取描述()
    {
        return 姓名 + " - " + 大学名称;
    }

    public static string 描述(学生 学生对象)
    {
        return 学生对象.姓名 + " - " + 大学名称;
        // return 姓名; // Invalid: no current 实例.
    }
}
```
:::end

:::lang python
```python
class 学生:
    大学名称 = "示例大学"

    def __init__(self, 姓名):
        self.姓名 = 姓名

    def get_description(self):
        return self.姓名 + " - " + 学生.大学名称

    @staticmethod
    def 描述(学生对象):
        return 学生对象.姓名 + " - " + 学生.大学名称
```
:::end

:::lang cpp
```cpp
#include <string>

class 学生 {
    std::string 姓名;
    inline static std::string 大学名称 = "示例大学";
public:
    explicit 学生(const std::string& 姓名) : 姓名(姓名) {}

    std::string 获取描述() const {
        return 姓名 + " - " + 大学名称;
    }

    static std::string 描述(const 学生& 学生对象) {
        return 学生对象.姓名 + " - " + 大学名称;
        // return 姓名; // Invalid: no current 实例.
    }
};
```
:::end

在 UML 类图中，我们使用**下划线**标记类级字段和方法，以便与实例成员区分。这个标记与可见性无关，因此带下划线的成员前面仍然可以出现 `+` 或 `-`。下图中，`姓名` 是实例字段，`大学名称` 和 `获取大学名称()` 则是类级成员。

![学生类 UML 图](content/chapters/05-osztalyszintu-elemek/media/student-static-zh.svg){width=420}

## 静态构造方法 {#static-initialization}

此前，我们通过构造方法为实例字段设置初始值，但共享的类级字段不应在每次创建对象时重新初始化，因为它们属于整个类。大多数情况下，我们在声明类级字段时直接赋予初始值就足够了。不过，有时初始化需要执行更复杂的操作，例如计算多个值或检查某项设置。Java 提供 `static { ... }` 形式的**静态初始化块**来完成这样的工作；Java 并不存在独立的静态构造方法。

:::lang java
```java
class 学生 {
    private static int 下一个编号;

    static {
        下一个编号 = 1000;
        System.out.println("学生类已初始化。");
    }

    public static int 获取下一个编号() {
        return 下一个编号;
    }
}

class Main {
    public static void main(String[] args) {
        System.out.println(学生.获取下一个编号());
        System.out.println(学生.获取下一个编号());
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class 学生
{
    private static int 下一个编号;

    static 学生()
    {
        下一个编号 = 1000;
        Console.WriteLine("学生类已初始化。");
    }

    public static int 获取下一个编号() { return 下一个编号; }
}

class 程序
{
    static void Main(string[] args)
    {
        Console.WriteLine(学生.获取下一个编号());
        Console.WriteLine(学生.获取下一个编号());
    }
}
```
:::end

:::lang python
```python
class 学生:
    下一个编号 = 1000
    print("学生类已初始化。")

    @classmethod
    def 获取下一个编号(cls):
        return cls.下一个编号

print(学生.获取下一个编号())
print(学生.获取下一个编号())
```
:::end

:::lang cpp
```cpp
#include <iostream>

class 学生 {
    static int 初始化下一个编号() {
        std::cout << "学生类已初始化。\n";
        return 1000;
    }

    inline static int 下一个编号 = 初始化下一个编号();
public:
    static int 获取下一个编号() { return 下一个编号; }
};

int main() {
    std::cout << 学生::获取下一个编号() << '\n';
    std::cout << 学生::获取下一个编号() << '\n';
}
```
:::end

Java 的静态初始化块不能由程序员直接调用，而是在类初始化时由运行环境自动执行。这个过程不会在每次创建实例时重复发生，因此例子中的初始化消息只会输出一次。C# 则提供不带参数的**静态构造方法**来实现类似功能；C++ 和 Python 使用其他语言机制初始化类相关的数据，具体执行时间也可能与 Java 不同。

## 应用场景 {#applications}

### 自动递增的标识符 {#automatic-ids}

一个常见需求是为新创建的对象自动分配唯一标识符。我们可以创建名为 `下一个编号` 的类级字段，并使它的初始值为 `1`。每次创建新学生时，构造方法从这个共享字段中读取下一个可用编号，保存到对象自己的 `编号` 字段中，再将共享值加一。这样，每个学生都会得到不同的编号，而下一个可用编号只需要保存在一个位置。

:::lang java
```java
class 学生 {
    private static int 下一个编号 = 1;
    private final int 编号;
    private final String 姓名;

    public 学生(String 姓名) {
        this.姓名 = 姓名;
        this.编号 = 下一个编号;
        下一个编号++;
    }

    public int 获取编号() { return 编号; }
}

class Main {
    public static void main(String[] args) {
        学生 第一个 = new 学生("Anna");
        学生 第二个 = new 学生("Bela");
        System.out.println(第一个.获取编号());  // 1
        System.out.println(第二个.获取编号()); // 2
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class 学生
{
    private static int 下一个编号 = 1;
    public int 编号 { get; }
    public string 姓名 { get; }

    public 学生(string 姓名)
    {
        this.姓名 = 姓名;
        编号 = 下一个编号;
        下一个编号++;
    }
}

class 程序
{
    static void Main(string[] args)
    {
        学生 第一个 = new 学生("Anna");
        学生 第二个 = new 学生("Bela");
        Console.WriteLine(第一个.编号);  // 1
        Console.WriteLine(第二个.编号); // 2
    }
}
```
:::end

:::lang python
```python
class 学生:
    下一个编号 = 1

    def __init__(self, 姓名):
        self.姓名 = 姓名
        self.编号 = 学生.下一个编号
        学生.下一个编号 += 1

第一个 = 学生("Anna")
第二个 = 学生("Bela")
print(第一个.编号)   # 1
print(第二个.编号)  # 2
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>

class 学生 {
    inline static int 下一个编号 = 1;
    const int 编号;
    std::string 姓名;
public:
    explicit 学生(const std::string& 姓名)
        : 编号(下一个编号++), 姓名(姓名) {}

    int 获取编号() const { return 编号; }
};

int main() {
    学生 第一个("Anna");
    学生 第二个("Bela");
    std::cout << 第一个.获取编号() << '\n';   // 1
    std::cout << 第二个.获取编号() << '\n';  // 2
}
```
:::end

负责分配标识符的字段值，并不等于当前还存在的对象数量。如果某个先前创建的对象已经无法再访问，下一个标识符也不能因此减小，否则可能重复分配已经使用过的编号。所以我们必须区分**下一个可用编号**和**已经创建的实例数量**，即使在简单程序刚开始运行时，这两个值看起来很接近。

### 对象工厂 {#object-factory}

到目前为止，我们都是通过 `new` 关键字和合适的构造方法直接创建对象。但有时，我们希望对象的创建必须满足一定条件，例如限制一个类最多能够创建多少个实例。这时，可以把构造方法设为 `private`，再编写一个公开的类级方法，由它先检查条件，满足要求时才创建并返回对象。这样的解决方案称为**对象工厂（Object factory）**。

下面的例子规定，一次程序运行中最多只能创建三名学生。`创建` 方法记录已经创建的学生数量，达到限制后不再创建新对象，而是返回 `null`。由于构造方法是私有的，主程序无法直接调用构造方法绕过限制。因此，调用方在使用返回值之前，也必须检查是否真的创建成功。

:::lang java
```java
class 学生 {
    private static final int 最多学生数 = 3;
    private static int 已创建数量 = 0;
    private final String 姓名;

    private 学生(String 姓名) {
        this.姓名 = 姓名;
    }

    public static 学生 创建(String 姓名) {
        if (姓名 == null || 姓名.isBlank())
            throw new IllegalArgumentException("Invalid 姓名.");
        if (已创建数量 >= 最多学生数)
            return null;

        学生 学生对象 = new 学生(姓名);
        已创建数量++;
        return 学生对象;
    }
}

class Main {
    public static void main(String[] args) {
        学生 第一个 = 学生.创建("Anna");
        学生 第二个 = 学生.创建("Bela");
        学生 第三个 = 学生.创建("Cecilia");
        学生 第四个 = 学生.创建("David"); // null
    }
}
```
:::end

:::lang csharp
```csharp
#nullable enable
using System;
class 学生
{
    private const int 最多学生数 = 3;
    private static int 已创建数量 = 0;
    private readonly string 姓名;

    private 学生(string 姓名) { this.姓名 = 姓名; }

    public static 学生? 创建(string 姓名)
    {
        if (string.IsNullOrWhiteSpace(姓名))
            throw new ArgumentException("Invalid 姓名.");
        if (已创建数量 >= 最多学生数)
            return null;

        学生 学生对象 = new 学生(姓名);
        已创建数量++;
        return 学生对象;
    }
}

class 程序
{
    static void Main(string[] args)
    {
        学生? 第一个 = 学生.创建("Anna");
        学生? 第二个 = 学生.创建("Bela");
        学生? 第三个 = 学生.创建("Cecilia");
        学生? 第四个 = 学生.创建("David"); // null
    }
}
```
:::end

:::lang python
```python
class 学生:
    最多学生数 = 3
    已创建数量 = 0

    def __init__(self, 姓名):
        self.姓名 = 姓名

    @classmethod
    def 创建(cls, 姓名):
        if not 姓名 or not 姓名.strip():
            raise ValueError("Invalid 姓名.")
        if cls.已创建数量 >= cls.最多学生数:
            return None

        学生对象 = cls(姓名)
        cls.已创建数量 += 1
        return 学生对象

第一个 = 学生.创建("Anna")
第二个 = 学生.创建("Bela")
第三个 = 学生.创建("Cecilia")
第四个 = 学生.创建("David")  # None
```
:::end

:::lang cpp
```cpp
#include <memory>
#include <stdexcept>
#include <string>

class 学生 {
    inline static constexpr int 最多学生数 = 3;
    inline static int 已创建数量 = 0;
    std::string 姓名;

    explicit 学生(const std::string& 姓名) : 姓名(姓名) {}
public:
    static std::unique_ptr<学生> 创建(const std::string& 姓名) {
        if (姓名.empty())
            throw std::invalid_argument("Invalid 姓名.");
        if (已创建数量 >= 最多学生数)
            return nullptr;

        std::unique_ptr<学生> 学生对象(new 学生(姓名));
        已创建数量++;
        return 学生对象;
    }
};

int main() {
    auto 第一个 = 学生::创建("Anna");
    auto 第二个 = 学生::创建("Bela");
    auto 第三个 = 学生::创建("Cecilia");
    auto 第四个 = 学生::创建("David"); // nullptr
}
```
:::end

对象工厂不仅可以限制实例的数量，也可以根据提供的数据决定创建什么类型的对象。在构造方法和 setter 中学习过的数据验证依然重要，因为新创建的对象也必须处于有效状态。Python 没有与 Java 私有构造方法完全相同的语言级限制，因此在 Python 中，通过类级 `创建` 方法创建实例主要依靠约定。

### 单例 {#singleton}

对象工厂可以帮助我们控制类的实例数量。其中一种特殊情况是，我们希望**某个类总共只能使用一个实例**。例如，应用程序的公共设置可以保存在一个对象中，并让程序的所有部分访问同一个对象。这种实现方式被称为 **Singleton（单例）**设计模式。

Java 中最简单的实现方法之一，是将构造方法设为私有，在类级字段中预先创建唯一实例，再通过公开的类级方法让外部程序获取它。这样，无论调用 `获取实例()` 多少次，得到的始终是同一个对象。C#、Python 和 C++ 也能够实现类似功能，但具体使用的语言机制并不完全相同。

:::lang java
```java
class 设置管理器 {
    private static final 设置管理器 唯一实例 = new 设置管理器();
    private String 语言 = "en";

    private 设置管理器() {}

    public static 设置管理器 获取实例() {
        return 唯一实例;
    }

    public String 获取语言() { return 语言; }
    public void 设置语言(String 值) { 语言 = 值; }
}

class Main {
    public static void main(String[] args) {
        设置管理器 第一个 = 设置管理器.获取实例();
        设置管理器 第二个 = 设置管理器.获取实例();
        第一个.设置语言("hu");
        System.out.println(第二个.获取语言()); // hu
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class 设置管理器
{
    public static 设置管理器 唯一实例 { get; } = new 设置管理器();
    public string 语言 { get; set; } = "en";

    private 设置管理器() {}
}

class 程序
{
    static void Main(string[] args)
    {
        设置管理器 第一个 = 设置管理器.唯一实例;
        设置管理器 第二个 = 设置管理器.唯一实例;
        第一个.语言 = "hu";
        Console.WriteLine(第二个.语言); // hu
    }
}
```
:::end

:::lang python
```python
class 设置管理器:
    _唯一实例 = None

    def __init__(self):
        self.语言 = "en"

    @classmethod
    def 获取实例(cls):
        if cls._唯一实例 is None:
            cls._唯一实例 = cls()
        return cls._唯一实例

第一个 = 设置管理器.获取实例()
第二个 = 设置管理器.获取实例()
第一个.语言 = "hu"
print(第二个.语言)  # hu
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>

class 设置管理器 {
    std::string 语言 = "en";
    设置管理器() = default;
public:
    设置管理器(const 设置管理器&) = delete;
    设置管理器& operator=(const 设置管理器&) = delete;

    static 设置管理器& 获取实例() {
        static 设置管理器 实例;
        return 实例;
    }

    void 设置语言(const std::string& 值) { 语言 = 值; }
    const std::string& 获取语言() const { return 语言; }
};

int main() {
    设置管理器& 第一个 = 设置管理器::获取实例();
    设置管理器& 第二个 = 设置管理器::获取实例();
    第一个.设置语言("hu");
    std::cout << 第二个.获取语言() << '\n'; // hu
}
```
:::end

需要注意，Singleton 并不只是使用一个静态字段，而是对唯一实例的创建和访问方式都进行了控制。这里的 Java 和 C# 示例阻止主程序直接创建额外的实例，C++ 示例还禁止复制对象。Python 没有完全等同于 Java `private` 构造方法的保护，因此示例体现的是共同使用一个实例，并不能阻止直接创建其他对象。

## 练习 {#exercises}

下列任务明确描述每个字段的类型、可见性、有效性限制，以及各操作的具体行为。UML 图用于辅助理解，但仅凭文字要求也可独立完成任务。

:::exercise
### 矩形

![矩形 – UML](content/chapters/05-osztalyszintu-elemek/media/complete-task-1-zh.svg){width=620}

扩展原有的 `矩形` 类。保留已有功能，下面明确规定新增要求以及现有成员的必要行为。

**字段与属性**

保留现有实例字段和验证规则，再添加以下类级字段：

- `创建数量 : int` – 私有静态字段，初始为 `0`，每成功创建一个实例增加一次.

**构造方法**

只在构造方法中计数，不在普通实例方法中计数；委托构造不得重复计数。

**方法**

- `获取创建数量() : int` – 公有静态方法，返回累计创建数量，而不是当前仍可访问的数量.


**主程序**

创建多个实例，验证类级机制，并测试题目规定的边界情况。
:::endexercise

:::exercise
### 图书

![图书 – UML](content/chapters/05-osztalyszintu-elemek/media/complete-task-2-zh.svg){width=620}

扩展原有的 `图书` 类。保留已有功能，下面明确规定新增要求以及现有成员的必要行为。

**字段与属性**

保留现有实例字段和验证规则，再添加以下类级字段：

- `最低价格 : int / 最高价格 : int` – 公有 `static final` 常量，值分别为 `500` 和 `50000`.

**构造方法**

价格验证应使用这些常量及公共检查方法；折扣后价格仍不得低于 `899`。

**方法**

- `检查价格(价格 : int) : boolean` – 公有静态函数，价格在含端点的有效区间时返回 true.


**主程序**

创建多个实例，验证类级机制，并测试题目规定的边界情况。
:::endexercise

:::exercise
### 汽车

![汽车 – UML](content/chapters/05-osztalyszintu-elemek/media/complete-task-3-zh.svg){width=620}

扩展原有的 `汽车` 类。保留已有功能，下面明确规定新增要求以及现有成员的必要行为。

**字段与属性**

保留现有实例字段和验证规则，再添加以下类级字段：

- `下个编号 : int` – 私有静态字段，初始为 `1`，保存下一个可用编号.

- `id : int` – 私有实例字段，由构造方法赋值，随后不可修改。

**构造方法**

每创建一个实例，构造方法分配当前编号并将计数器加一；编号不得由外部修改。

**方法**

- `获取编号() : int` – 公有实例方法，返回对象私有且不可再修改的编号.


**主程序**

创建多个实例，验证类级机制，并测试题目规定的边界情况。
:::endexercise

:::exercise
### 银行账户

![银行账户 – UML](content/chapters/05-osztalyszintu-elemek/media/complete-task-4-zh.svg){width=620}

扩展原有的 `银行账户` 类。保留已有功能，下面明确规定新增要求以及现有成员的必要行为。

**字段与属性**

保留现有实例字段和验证规则，再添加以下类级字段：

- `创建数量 : int / 最大创建数 : int` – 私有静态计数器（`0`）及私有静态常量（`3`）.

**构造方法**

构造方法必须为私有，无法绕过工厂；非法数据使用已有的验证异常，仅在成功创建实例后增加计数。

**方法**

- `创建(持有人 : String, 账号 : String, 余额 : int) : 银行账户` – 公有静态工厂；最多创建三个合法账户，达到上限时返回 `null`.


**主程序**

创建多个实例，验证类级机制，并测试题目规定的边界情况。
:::endexercise

:::exercise
### 电影

![电影 – UML](content/chapters/05-osztalyszintu-elemek/media/complete-task-5-zh.svg){width=620}

扩展原有的 `电影` 类。保留已有功能，下面明确规定新增要求以及现有成员的必要行为。

**字段与属性**

保留现有实例字段和验证规则，再添加以下类级字段：

- `唯一实例 : 影片库` – `MovieLibrary` 类中保存唯一实例的私有静态字段.

在 `MovieLibrary` 中，`movies : ArrayList<Movie>` 也必须为私有字段；只允许一个影片库实例。

**构造方法**

将 `MovieLibrary` 的构造方法及影片列表设为私有，预先创建唯一实例，无需涉及并发。

**方法**

- `获取实例() : 影片库` – 公有静态方法，每次都返回同一个实例.
- `添加电影(movie : 电影) : void` – 添加非 null 电影；导演与片名重复时抛出异常.
- `获取数量() : int` – 返回已保存电影的数量.

不能从类外部调用 `MovieLibrary` 构造方法；只能通过规定的公有方法操作影片集合。

**主程序**

创建多个实例，验证类级机制，并测试题目规定的边界情况。
:::endexercise
