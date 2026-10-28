# 接口

在程序中，我们经常需要让不同类的对象执行相同的操作。例如，一项打印任务既可以交给普通桌面打印机，也可以交给多功能设备，而分配任务的程序并不需要了解设备内部的实现方式。它只需要知道所获得的对象能够打印文档。如果将来增加了新的打印机，我们希望不必重写整个算法就能使用它。

通过继承和抽象类，我们已经可以建立公共父类，但这样做可能在彼此独立的设备之间引入不必要的继承关系。此外，Java 类最多只能直接继承一个父类。许多情况下，我们关心的并不是对象**继承自什么类**，而是它**能够完成哪些操作**。接口正是为表达这类要求而设计的。

## 接口的概念 {#interface-concept}

**接口**不是类，而是一份约定：它规定实现该接口的类必须提供哪些操作。约定描述方法名称、参数和返回类型，而具体算法由实现类编写。因此，即使尚未确定哪些具体类负责执行任务，我们也能先设计程序的高层结构。

在 Java 中，使用 `interface` 关键字定义接口，类通过 `implements` 声明自己实现某个接口。没有方法体的普通接口方法具有 `public` 可见性，所以实现类必须提供公开的方法。接口不能直接实例化，也没有构造方法，但它可以作为类型使用，这一点在任务委派中尤其重要。Java 接口还可以声明常量，不过这些是 `public static final` 的类级值，不是每个实例各自保存的字段。

:::lang java
```java
class 文档 {
    private final String 标题;
    public 文档(String 标题) { this.标题 = 标题; }
    public String 获取标题() { return 标题; }
}

interface 可打印 { void 打印文档(文档 文档对象); }
interface 可扫描 { 文档 扫描文档(String 来源标题); }

class 桌面打印机 implements 可打印 {
    @Override
    public void 打印文档(文档 文档对象) {
        System.out.println("Printing: " + 文档对象.获取标题());
    }
}

class 多功能设备 implements 可打印, 可扫描 {
    @Override
    public void 打印文档(文档 文档对象) {
        System.out.println("Printing: " + 文档对象.获取标题());
    }
    @Override
    public 文档 扫描文档(String 来源标题) {
        return new 文档(来源标题);
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class 文档 {
    public string 标题 { get; }
    public 文档(string 标题) { this.标题 = 标题; }
}
interface 可打印 { void 打印文档(文档 文档对象); }
interface 可扫描 { 文档 扫描文档(string 来源标题); }
class 桌面打印机 : 可打印 {
    public void 打印文档(文档 文档对象) {
        Console.WriteLine("Printing: " + 文档对象.标题);
    }
}
class 多功能设备 : 可打印, 可扫描 {
    public void 打印文档(文档 文档对象) {
        Console.WriteLine("Printing: " + 文档对象.标题);
    }
    public 文档 扫描文档(string 来源标题) {
        return new 文档(来源标题);
    }
}
```
:::end

:::lang python
```python
from abc import ABC, abstractmethod
class 文档:
    def __init__(self, 标题): self.标题 = 标题
class 可打印(ABC):
    @abstractmethod
    def 打印文档(self, 文档对象): pass
class 可扫描(ABC):
    @abstractmethod
    def 扫描文档(self, 来源标题): pass
class 桌面打印机(可打印):
    def 打印文档(self, 文档对象):
        print("Printing:", 文档对象.标题)
class 多功能设备(可打印, 可扫描):
    def 打印文档(self, 文档对象):
        print("Printing:", 文档对象.标题)
    def 扫描文档(self, 来源标题):
        return 文档(来源标题)
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>
class 文档 {
    std::string 标题;
public:
    explicit 文档(std::string 标题) : 标题(标题) {}
    std::string 获取标题() const { return 标题; }
};
struct 可打印 {
    virtual ~可打印() = default;
    virtual void 打印文档(const 文档& 文档对象) = 0;
};
struct 可扫描 {
    virtual ~可扫描() = default;
    virtual 文档 扫描文档(const std::string& 来源标题) = 0;
};
class 桌面打印机 : public 可打印 {
public:
    void 打印文档(const 文档& 文档对象) override {
        std::cout << "Printing: " << 文档对象.获取标题() << '\n';
    }
};
class 多功能设备 : public 可打印, public 可扫描 {
public:
    void 打印文档(const 文档& 文档对象) override {
        std::cout << "Printing: " << 文档对象.获取标题() << '\n';
    }
    文档 扫描文档(const std::string& 来源标题) override {
        return 文档(来源标题);
    }
};
```
:::end

在这个例子中，`可打印` 只约定打印操作，而 `可扫描` 约定扫描操作。`桌面打印机` 只能打印，所以只实现一个接口；`多功能设备` 同时实现两个接口，因此具备两种独立的能力。接口既不存储这些设备的共同实例状态，也不规定实际使用什么打印或扫描算法，具体实现由各个类决定。

![接口的概念](content/chapters/12-interfeszek/media/main-office-zh.svg){width=820}

## 接口作为类型与任务委派 {#delegation}

父类类型的引用可以指向子类实例；同样，接口类型的引用也可以指向任何实现该接口的对象。通过 `可打印` 类型的引用，我们只能调用接口约定的操作，而不必知道对象实际上是哪种打印机。运行时会根据对象的真实类型，通过晚绑定选择相应的实现。

这一点对**任务委派**尤为重要。高层工作流程只需提出要求：它需要能够打印和扫描的设备。程序在构造方法中接收这些设备，然后将具体操作交给它们执行。工作流程本身不创建打印机，也不必了解网络设备或硬件的内部实现。因此，同一流程可以使用不同的设备，甚至可以接收专门用于测试的替代实现。

:::lang java
```java
class 办公流程 {
    private final 可打印 打印设备;
    private final 可扫描 扫描设备;
    public 办公流程(可打印 打印设备, 可扫描 扫描设备) {
        this.打印设备 = 打印设备;
        this.扫描设备 = 扫描设备;
    }
    public void 复制文档(String 来源标题) {
        文档 文档对象 = 扫描设备.扫描文档(来源标题);
        打印设备.打印文档(文档对象);
    }
}
// In a separate demo, reuse the previous 文档 and device definitions.
class Demo {
    public static void main(String[] args) {
        办公流程 流程 = new 办公流程(
            new 桌面打印机(), new 多功能设备());
        流程.复制文档("Contract");
    }
}
```
:::end

:::lang csharp
```csharp
class 办公流程 {
    private readonly 可打印 打印设备;
    private readonly 可扫描 扫描设备;
    public 办公流程(可打印 打印设备, 可扫描 扫描设备) {
        this.打印设备 = 打印设备;
        this.扫描设备 = 扫描设备;
    }
    public void 复制文档(string 来源标题) {
        文档 文档对象 = 扫描设备.扫描文档(来源标题);
        打印设备.打印文档(文档对象);
    }
}
class Program {
    static void Main() {
        var 流程 = new 办公流程(new 桌面打印机(), new 多功能设备());
        流程.复制文档("Contract");
    }
}
```
:::end

:::lang python
```python
class 办公流程:
    def __init__(self, 打印设备: 可打印, 扫描设备: 可扫描):
        self._打印设备 = 打印设备
        self._扫描设备 = 扫描设备
    def 复制文档(self, 来源标题):
        文档对象 = self._扫描设备.扫描文档(来源标题)
        self._打印设备.打印文档(文档对象)
# Use the classes from the preceding example.
流程 = 办公流程(桌面打印机(), 多功能设备())
流程.复制文档("Contract")
```
:::end

:::lang cpp
```cpp
class 办公流程 {
    可打印& 打印设备;
    可扫描& 扫描设备;
public:
    办公流程(可打印& 打印设备, 可扫描& 扫描设备)
        : 打印设备(打印设备), 扫描设备(扫描设备) {}
    void 复制文档(const std::string& 来源标题) {
        文档 文档对象 = 扫描设备.扫描文档(来源标题);
        打印设备.打印文档(文档对象);
    }
};
int main() {
    桌面打印机 打印设备;
    多功能设备 设备;
    办公流程 流程(打印设备, 设备);
    流程.复制文档("Contract");
}
```
:::end

`办公流程` 的构造方法接收两个接口类型的参数。其 `复制文档()` 方法先扫描，再打印扫描得到的文档，因此无需依赖具体设备就能控制整个流程。以后只要向构造方法传入其他设备实例，就可以替换实现。高层设计的一项重要优点正是：**把“需要完成什么操作”与“如何完成操作”分开**。

## 实现多个接口 {#multiple-interfaces}

Java 不支持类之间的多重继承，因此一个类不能同时直接继承两个不同的父类。但一个类可以实现任意多个接口。这与多重类继承并不相同：我们并非继承多个父类的实例状态和已实现的方法，而是同时承诺满足多份不同的接口约定。这样的对象可以赋值给它所实现的任何接口类型的引用。

接口实现也可以与普通继承结合使用。例如，所有办公设备都可以从一个父类继承共同的序列号，而打印和扫描能力仍由不同接口规定。因此，从一个类继承和实现多个接口完全可以同时进行。

:::lang java
```java
abstract class 办公设备 {
    protected final String 序列号;
    protected 办公设备(String 序列号) { this.序列号 = 序列号; }
}
class 网络设备 extends 办公设备 implements 可打印, 可扫描 {
    public 网络设备(String 序列号) { super(序列号); }
    @Override public void 打印文档(文档 文档对象) {
        System.out.println(序列号 + ": " + 文档对象.获取标题());
    }
    @Override public 文档 扫描文档(String 来源标题) {
        return new 文档(来源标题);
    }
}
```
:::end

:::lang csharp
```csharp
abstract class 办公设备 {
    protected string SerialNumber { get; }
    protected 办公设备(string 序列号) { this.SerialNumber = 序列号; }
}
class 网络设备 : 办公设备, 可打印, 可扫描 {
    public 网络设备(string 序列号) : base(序列号) { }
    public void 打印文档(文档 文档对象) {
        Console.WriteLine(SerialNumber + ": " + 文档对象.Title);
    }
    public 文档 扫描文档(string 来源标题) {
        return new 文档(来源标题);
    }
}
```
:::end

:::lang python
```python
class 办公设备(ABC):
    def __init__(self, serial_number): self.serial_number = serial_number
class 网络设备(办公设备, 可打印, 可扫描):
    def 打印文档(self, 文档对象):
        print(self.serial_number, 文档对象.标题)
    def 扫描文档(self, 来源标题):
        return 文档(来源标题)
```
:::end

:::lang cpp
```cpp
class 办公设备 {
protected:
    std::string 序列号;
public:
    explicit 办公设备(std::string 序列号) : 序列号(序列号) {}
    virtual ~办公设备() = default;
};
class 网络设备 : public 办公设备, public 可打印, public 可扫描 {
public:
    explicit 网络设备(std::string 序列号) : 办公设备(序列号) {}
    void 打印文档(const 文档& 文档对象) override {
        std::cout << 序列号 << ": " << 文档对象.获取标题() << '\n';
    }
    文档 扫描文档(const std::string& 来源标题) override {
        return 文档(来源标题);
    }
};
```
:::end

![实现多个接口](content/chapters/12-interfeszek/media/main-multiple-zh.svg){width=820}

## 接口之间的继承 {#interface-inheritance}

接口也可以继承其他接口。例如，彩色打印接口可以扩展基本打印接口，增加设置彩色模式的操作。实现扩展接口的类还必须实现原接口规定的所有方法。一个接口甚至可以继承多个接口，在必要时组合相关能力。

不过，我们不应该把能够想到的所有操作都放进一个巨大的接口。如果要求普通打印机同时完成传真和扫描，它就不得不实现没有实际意义的方法。较小、职责明确的接口可以保证每个类只承诺真正属于自身功能的操作。

:::lang java
```java
interface 可打印 { void 打印文档(文档 文档对象); }
interface ColorPrintable extends 可打印 { void setColorMode(boolean enabled); }
// ColorPrintable inherits 打印文档() as well.
class ColorPrinter implements ColorPrintable {
    private boolean colorMode;
    @Override public void setColorMode(boolean enabled) { colorMode = enabled; }
    @Override public void 打印文档(文档 文档对象) {
        System.out.println(文档对象.获取标题() + " color=" + colorMode);
    }
}
```
:::end

:::lang csharp
```csharp
interface 可打印 { void 打印文档(文档 文档对象); }
interface IColorPrintable : 可打印 { void SetColorMode(bool enabled); }
class ColorPrinter : IColorPrintable {
    private bool colorMode;
    public void SetColorMode(bool enabled) { colorMode = enabled; }
    public void 打印文档(文档 文档对象) {
        Console.WriteLine(文档对象.Title + " color=" + colorMode);
    }
}
```
:::end

:::lang python
```python
class ColorPrintable(可打印, ABC):
    @abstractmethod
    def set_color_mode(self, enabled): pass
class ColorPrinter(ColorPrintable):
    def __init__(self): self.color_mode = False
    def set_color_mode(self, enabled): self.color_mode = enabled
    def 打印文档(self, 文档对象):
        print(文档对象.标题, self.color_mode)
```
:::end

:::lang cpp
```cpp
struct ColorPrintable : public 可打印 {
    virtual void setColorMode(bool enabled) = 0;
};
class ColorPrinter : public ColorPrintable {
    bool colorMode = false;
public:
    void setColorMode(bool enabled) override { colorMode = enabled; }
    void 打印文档(const 文档& 文档对象) override {
        std::cout << 文档对象.获取标题() << " color=" << colorMode << '\n';
    }
};
```
:::end

## 重要的内置接口 {#standard-interfaces}

### Comparable 与 Comparator {#comparing}

Java 标准库中有许多接口，现成的算法就是建立在这些接口之上的。`Comparable<T>` 用于规定对象的**自然顺序**。它要求实现 `compareTo(T other)` 方法：如果当前对象应排在参数对象之前，返回负数；如果两者按排序规则等价，返回零；否则返回正数。返回值不必恰好是 `-1`、`0` 或 `1`。

同一批对象有时需要采用不同排序标准。例如，我们可以把价格从低到高作为产品的自然顺序，但在另一个界面中希望按名称排序。`Comparator<T>` 用一个独立的比较对象来描述另一种顺序，其 `compare(T first, T second)` 方法负责比较两个参数。这样无需修改产品类，就能提供不同的排序方式。

:::lang java
```java
import java.util.*;
class 产品 implements Comparable<产品> {
    private final String 名称;
    private final int 价格;
    public 产品(String 名称, int 价格) { this.名称=名称; this.价格=价格; }
    public String 获取名称() { return 名称; }
    public int 获取价格() { return 价格; }
    @Override public int compareTo(产品 其他产品) {
        return Integer.compare(价格, 其他产品.价格);
    }
}
class 产品名称比较器 implements Comparator<产品> {
    @Override public int compare(产品 第一项, 产品 第二项) {
        return 第一项.获取名称().compareTo(第二项.获取名称());
    }
}
class Demo {
    public static void main(String[] args) {
        ArrayList<产品> 产品列表 = new ArrayList<>();
        产品列表.add(new 产品("Paper", 800));
        产品列表.add(new 产品("Ink", 2500));
        Collections.sort(产品列表);                             // by 价格
        Collections.sort(产品列表, new 产品名称比较器()); // by 名称
    }
}
```
:::end

:::lang csharp
```csharp
using System;
using System.Collections.Generic;
class 产品 : IComparable<产品> {
    public string Name { get; }
    public int Price { get; }
    public 产品(string 名称, int 价格) { this.Name=名称; this.Price=价格; }
    public int CompareTo(产品 其他产品) {
        return Price.CompareTo(其他产品.Price);
    }
}
class 产品名称比较器 : IComparer<产品> {
    public int Compare(产品 第一项, 产品 第二项) {
        return string.CompareOrdinal(第一项.Name, 第二项.Name);
    }
}
class Program {
    static void Main() {
        var 产品列表 = new List<产品> { new 产品("Paper",800), new 产品("Ink",2500) };
        产品列表.Sort();                            // by 价格
        产品列表.Sort(new 产品名称比较器()); // by 名称
    }
}
```
:::end

:::lang python
```python
class 产品:
    def __init__(self, 名称, 价格):
        self.名称, self.价格 = 名称, 价格
    def __lt__(self, 其他产品):
        return self.价格 < 其他产品.价格
产品列表 = [产品("Paper", 800), 产品("Ink", 2500)]
产品列表.sort()                        # by 价格 (__lt__)
产品列表.sort(key=lambda item: item.名称)  # by 名称
```
:::end

:::lang cpp
```cpp
#include <algorithm>
#include <string>
#include <vector>
class 产品 {
public:
    std::string 名称;
    int 价格;
    产品(std::string 名称, int 价格) : 名称(名称), 价格(价格) {}
    bool operator<(const 产品& 其他产品) const { return 价格 < 其他产品.价格; }
};
int main() {
    std::vector<产品> 产品列表 = {{"Paper",800},{"Ink",2500}};
    std::sort(产品列表.begin(), 产品列表.end()); // by 价格
    std::sort(产品列表.begin(), 产品列表.end(),
        [](const 产品& 第一项, const 产品& 第二项) { return 第一项.名称 < 第二项.名称; });
}
```
:::end

### Iterable 与 Iterator {#iterators}

`Iterable<T>` 表示一个对象的元素可以依次遍历。它的 `iterator()` 方法返回 `Iterator<T>` 实例；后者的 `hasNext()` 方法判断是否还有元素，`next()` 方法取得下一个元素。Java 的增强型 `for` 循环正是通过这些操作工作的，因此我们实现 `Iterable` 后，自己的容器类也能直接用于该循环。

我们不一定需要自己实现完整的迭代器算法。如果容器内部使用 `ArrayList`，可以直接借助它的迭代器完成遍历。为了防止外部程序通过迭代器删除元素，还可以返回不可修改视图的迭代器。但这种保护限制的是集合结构，并不自动阻止修改集合中对象的内部状态。

:::lang java
```java
import java.util.*;
class 图书 { private final String 标题;
    图书(String 标题) { this.标题 = 标题; }
    String 获取标题() { return 标题; }
}
class 图书集合 implements Iterable<图书> {
    private final ArrayList<图书> 图书列表 = new ArrayList<>();
    public void 添加图书(图书 图书) { if(图书==null) throw new IllegalArgumentException(); 图书列表.add(图书); }
    @Override public Iterator<图书> iterator() {
        return Collections.unmodifiableList(图书列表).iterator();
    }
}
class Demo {
    public static void main(String[] args) {
        图书集合 目录 = new 图书集合();
        目录.添加图书(new 图书("OOP"));
        for (图书 图书 : 目录) System.out.println(图书.获取标题());
    }
}
```
:::end

:::lang csharp
```csharp
using System;
using System.Collections;
using System.Collections.Generic;
class 图书 {
    public string Title { get; }
    public 图书(string 标题) { Title = 标题; }
}
class 图书集合 : IEnumerable<图书> {
    private readonly List<图书> 图书列表 = new();
    public void AddBook(图书 图书) { if(图书 == null) throw new ArgumentNullException(); 图书列表.Add(图书); }
    public IEnumerator<图书> GetEnumerator() { return 图书列表.GetEnumerator(); }
    IEnumerator IEnumerable.GetEnumerator() { return GetEnumerator(); }
}
class Program {
    static void Main() {
        var 目录 = new 图书集合();
        目录.AddBook(new 图书("OOP"));
        foreach (var 图书 in 目录) Console.WriteLine(图书.Title);
    }
}
```
:::end

:::lang python
```python
class 图书:
    def __init__(self, 标题): self.标题 = 标题
class 图书集合:
    def __init__(self): self._books = []
    def add_book(self, 图书):
        if 图书 is None: raise ValueError("Missing 图书")
        self._books.append(图书)
    def __iter__(self): return iter(tuple(self._books))
目录 = 图书集合()
目录.add_book(图书("OOP"))
for 图书 in 目录: print(图书.标题)
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>
#include <vector>
class 图书 {
public:
    std::string 标题;
    explicit 图书(std::string 标题) : 标题(标题) {}
};
class 图书集合 {
    std::vector<图书> 图书列表;
public:
    void 添加图书(图书 图书) { 图书列表.push_back(图书); }
    auto begin() const { return 图书列表.cbegin(); }
    auto end() const { return 图书列表.cend(); }
};
int main() {
    图书集合 目录;
    目录.添加图书(图书("OOP"));
    for (const auto& 图书 : 目录) std::cout << 图书.标题 << '\n';
}
```
:::end

### Collection、List 与其他接口 {#collections}

`Collection<T>` 继承 `Iterable<T>`，并规定元素数量查询、添加与查找等操作。`List<T>` 进一步增加按索引访问和替换元素的能力。`ArrayList<T>` 不是接口，而是实现这些约定的具体类。因此，在 `List<String> names = new ArrayList<>();` 中，引用类型为 `List`，对象的实际类型为 `ArrayList`。

此外，我们还应认识 `AutoCloseable` 接口，它用于管理使用完成后必须关闭的资源。具体使用方式将在文件处理部分介绍。标准库的这些接口再次表明：不同实现可以满足同一份约定，而使用它们的高层算法无需因此改变。

![Collection、List 与其他接口](content/chapters/12-interfeszek/media/main-collection-zh.svg){width=820}

现代 Java 接口也可以包含某些带方法体的方法。`default` 方法允许接口提供共同的默认行为，在向既有接口添加操作、又不希望修改所有实现类时尤其有用。不过，在当前章节中，我们主要把接口理解为**操作约定**，具体算法仍由实现类负责。

## 练习 {#exercises}

:::exercise

### 1. 办公设备——为已有类添加接口

设计一个简单的文档处理系统，将打印和扫描定义为两个独立的能力。设备不需要继承共同的设备父类，而是由已有的类分别实现适合自己的接口。

![办公设备 UML](content/chapters/12-interfeszek/media/task-office-zh.svg){width=720}

**接口**

- `可打印`：声明 `打印文档(文档 : 文档) : void`。接口只规定操作，具体打印行为由实现类负责。
- `可扫描`：声明 `扫描文档(标题 : String) : 文档`，要求返回一个新建的文档实例。

**文档类**

- `标题 : String`：私有字段，不能从类外直接修改。
- `文档(标题 : String)`：公开构造方法。标题不能为 `null`、空字符串或全空格；不满足要求时抛出 `IllegalArgumentException`。
- `获取标题() : String`：公开 getter；不提供 setter。

**简单打印机类——implements 可打印**

- `已完成任务数 : int`：私有字段，初始值为 `0`。
- `简单打印机()`：公开无参构造方法，初始化计数器。
- `打印文档(文档 : 文档) : void`：拒绝 `null`，输出文档标题，并将计数器加一。
- `获取已完成任务数() : int`：公开 getter，不提供 setter。

**多功能设备类——implements 可打印, 可扫描**

- `已完成任务数 : int`：私有字段，初始值为 `0`。
- `多功能设备()`：公开无参构造方法。
- `打印文档(文档 : 文档) : void`：检查参数，显示标题，然后将计数器加一。
- `扫描文档(标题 : String) : 文档`：用指定标题创建并返回新文档；扫描不增加打印计数。
- `获取已完成任务数() : int`：公开只读 getter。

**复印服务类**

- `打印机 : 可打印` 和 `扫描仪 : 可扫描`：私有字段，使用接口类型而非具体设备类型。
- `复印服务(打印机 : 可打印, 扫描仪 : 可扫描)`：公开构造方法；两个引用都不能为 `null`。
- `复印(标题 : String) : void`：先调用扫描接口获取文档，再将结果交给打印接口处理。

**主程序**

创建一个 `简单打印机` 和一个 `多功能设备` 实例。创建两个 `复印服务` 实例，让它们分别使用不同设备打印。执行复印操作，并检查两个打印计数器的值。

:::endexercise

:::exercise

### 2. 图书馆——独立的接口能力

扩展之前的 `图书` 和 `图书馆` 类。用不同的接口定义图书的可识别性和可借阅性，并由容器类统一控制图书集合的访问。

![图书馆 UML](content/chapters/12-interfeszek/media/task-books-zh.svg){width=720}

**接口**

- `可识别`：`获取标识() : String`，返回唯一标识。
- `可借阅`：`借阅() : void` 和 `归还() : void`。

**图书类——implements 可识别, 可借阅**

- `国际书号 : String`：私有字段；创建后不允许从外部修改。
- `标题 : String`：私有字段，外部只读。
- `已借出 : boolean`：私有状态字段，表示图书是否已经借出。
- `图书(国际书号 : String, 标题 : String)`：两个字符串都必须至少包含一个非空格字符；`已借出` 的初始值为 `false`。
- `获取标识() : String`：返回国际书号。
- `获取标题() : String`：返回书名。
- `是否借出() : boolean`：返回当前借阅状态；这三个 getter 均不提供 setter。
- `借阅() : void`：若已借出，抛出 `IllegalStateException`；否则设为 `true`。
- `归还() : void`：若尚未借出，抛出 `IllegalStateException`；否则设为 `false`。

**图书馆容器类**

- `图书列表 : ArrayList<图书>`：私有集合，不向外暴露内部列表引用。
- `图书馆()`：创建空列表。
- `添加图书(图书 : 图书) : void`：拒绝 `null` 以及已存在相同国际书号的图书；发生错误时抛出 `IllegalArgumentException`。
- `查找图书(国际书号 : String) : 图书`：按国际书号查找，不存在时返回 `null`。
- `获取可借图书() : ArrayList<图书>`：创建并返回包含未借出图书的新列表，而不是内部列表本身。

**主程序**

添加至少五本书，借出其中两本，输出剩余可借图书的标题。测试重复书号以及重复借阅的处理。

:::endexercise

:::exercise

### 3. 车辆租赁——接口与抽象父类

设计车辆租赁系统。接口只规定租金计算能力，抽象父类统一保存车辆信息。两个具体子类必须分别实现同一个抽象方法，使用不同的算法计算租金。

![车辆租赁 UML](content/chapters/12-interfeszek/media/task-vehicles-zh.svg){width=760}

**可租赁接口**

- `计算租金(天数 : int) : int`：公开方法，返回总租金；天数必须为正。

**抽象车辆类——implements 可租赁**

- `车牌号 : String`：私有字段，外部只读。
- `里程数 : int`：私有字段，不允许外部直接修改。
- `车辆(车牌号 : String, 里程数 : int)`：车牌号不能为空或全空格；里程数不能为负。
- `获取车牌号() : String` 与 `获取里程数() : int`：公开 getter，无 setter。
- `行驶(距离 : int) : void`：只接受正数距离，增加里程数；无效值抛出异常。
- `计算租金(天数 : int) : int`：**公开抽象方法**。父类不实现算法，由具体子类负责。

**汽车类——extends 车辆**

- `汽车(车牌号 : String, 里程数 : int)`：调用父类构造方法。
- `计算租金(天数 : int) : int`：**实现继承的抽象方法**。基础租金是 `9000 × 天数`；租期达到七天时优惠 `10%`，使用整数运算。天数必须为正。

**货运车类——extends 车辆**

- `载重量 : int`：私有字段，以千克为单位，必须为正。
- `货运车(车牌号 : String, 里程数 : int, 载重量 : int)`：调用父类构造方法，并检查载重量。
- `获取载重量() : int`：公开 getter，无 setter。
- `计算租金(天数 : int) : int`：**用不同的算法实现同一抽象方法**。租金为 `14000 × 天数 + 6000`，其中 `6000` 为每次租赁只收取一次的准备费用。

**租赁中心容器类**

- `车辆列表 : ArrayList<车辆>`：私有列表，可以同时保存两种具体车辆。
- `租赁中心()`：创建空列表。
- `添加车辆(车辆 : 车辆) : void`：拒绝 `null` 或车牌号重复的对象。
- `计算总租金(天数 : int) : int`：调用每辆车的 `计算租金()`，返回租金之和。

**主程序**

添加至少两辆汽车和两辆货运车，计算七天租期的费用，验证接口定义的同一方法在具体类中采用了不同算法。

:::endexercise

:::exercise

### 4. 支付系统——抽象实现与可选能力

实现支付系统。支付行为由接口规定，抽象父类负责统一管理余额，两种具体子类采用不同的支付算法。退款能力仅由银行卡支付实现。

![支付系统 UML](content/chapters/12-interfeszek/media/task-banking-zh.svg){width=760}

**接口**

- `可支付`：`支付(金额 : int) : boolean`，返回支付是否成功。
- `可退款`：`退款(金额 : int) : boolean`，返回退款是否成功。

**抽象支付方式类——implements 可支付**

- `余额 : int`：私有字段，以整数货币单位保存，不能从外部直接修改。
- `支付方式(余额 : int)`：不允许负的初始余额。
- `获取余额() : int`：公开 getter，无 setter。
- `取款(金额 : int) : boolean`：**protected 具体方法**，只接受正数。余额足够时扣除金额并返回 `true`；否则不修改余额并返回 `false`。
- `存款(金额 : int) : void`：**protected 具体方法**，存入正数金额，错误输入抛出异常。
- `支付(金额 : int) : boolean`：**公开抽象方法**，由两个子类分别实现。

**银行转账类——extends 支付方式**

- `银行转账(余额 : int)`：调用父类构造方法。
- `支付(金额 : int) : boolean`：扣除正数支付额及一次性 `500` 的转账手续费；成功返回 `true`，余额不足返回 `false`，无效金额抛出异常。

**银行卡支付类——extends 支付方式, implements 可退款**

- `上次支付金额 : int`：私有字段，初始为 `0`，记录最后一笔尚未退款的成功支付。
- `银行卡支付(余额 : int)`：调用父类构造方法并初始化字段。
- `支付(金额 : int) : boolean`：无手续费。成功时更新 `上次支付金额`，失败时该字段不变。
- `退款(金额 : int) : boolean`：只有正数金额与尚未退款的记录完全相同才成功。成功时调用 `存款()` 并将记录清零；否则返回 `false`。

**结算服务类**

- `结算服务()`：公开无参构造方法。
- `结算(方式 : 可支付, 金额 : int) : boolean`：通过接口调用 `支付()`，拒绝 `null` 引用。

**主程序**

使用同一个 `结算服务` 处理两种支付。检查手续费的区别、余额不足以及一次成功的银行卡退款。

:::endexercise

:::exercise

### 5. 订单——标准接口与容器类

创建订单登记系统。使用 `Comparable` 定义自然顺序，`Comparator` 定义另一种排序方式，`Iterable` 提供对容器的遍历能力。

![订单 UML](content/chapters/12-interfeszek/media/task-orders-zh.svg){width=760}

**订单类——implements Comparable<订单>**

- `编号 : int`：私有正整数标识。
- `金额 : int`：私有非负整数金额。
- `订单(编号 : int, 金额 : int)`：公开构造方法，验证两个参数；不合法时抛出 `IllegalArgumentException`。
- `获取编号() : int` 与 `获取金额() : int`：公开 getter，不提供 setter。
- `compareTo(其他订单 : 订单) : int`：先按金额升序比较，金额相同再按编号比较；拒绝 `null`。返回值应按大小关系为负数、零或正数。

**订单编号比较器类——implements Comparator<订单>**

- `订单编号比较器()`：公开无参构造方法。
- `compare(第一项 : 订单, 第二项 : 订单) : int`：只按编号升序比较，拒绝 `null`。

**订单登记簿容器类——implements Iterable<订单>**

- `订单列表 : ArrayList<订单>`：私有列表，不公开内部列表的引用。
- `订单登记簿()`：初始化空列表。
- `添加订单(订单 : 订单) : void`：拒绝 `null` 和重复编号，错误时抛出 `IllegalArgumentException`。
- `iterator() : Iterator<订单>`：按添加顺序遍历，不允许通过迭代器的 `remove()` 删除内部元素。
- `按金额排序() : ArrayList<订单>`：返回按自然顺序排列的新列表。
- `按编号排序() : ArrayList<订单>`：返回使用 `订单编号比较器` 排序的新列表。两种排序均不能改变原容器的添加顺序。

**主程序**

添加至少五个订单，其中部分金额相同。显示两种排序结果，再用增强型 `for` 循环遍历容器，确认原始存储顺序未改变。

:::endexercise
