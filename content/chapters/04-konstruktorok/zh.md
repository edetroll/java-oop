# 构造方法

使用 getter、setter 方法以及语言内置的属性机制，可以阻止无效数据被写入实例字段。但是，这并不能保证实例创建后已经具备正常工作所需的全部数据。**构造方法**的目的就是为实例的字段设置适当的初始值，确保必要的数据在实例创建时已经存在。当然，传给构造方法的数据也必须进行有效性检查。

构造方法是一种特殊的类成员，在**实例化**过程中调用。在 Java 中，我们使用 `new` 创建实例，并调用与参数相匹配的构造方法。

:::lang java
```java
class Student {
    private String name;

    public void setName(String name) {
        this.name = name;
    }
}

class Main {
    public static void main(String[] args) {
        Student first = new Student();
        Student second = new Student();
    }
}
```
:::end

:::lang csharp
```csharp
class Student
{
    public string Name { get; set; }
    // ...
}

class Program
{
    static void Main(string[] args)
    {
        Student first = new Student();
        Student second = new Student();
    }
}
```
:::end

:::lang python
```python
class Student:
    def __init__(self):
        self.name = None

first = Student()
second = Student()
```
:::end

:::lang cpp
```cpp
#include <string>

class Student {
public:
    std::string name;
};

int main() {
    Student first;
    Student second;
}
```
:::end

构造方法的一般形式是什么？它的名称必须与类名相同，并且不声明返回类型。

:::lang java
```java
class ClassName {
    // accessModifier ClassName(parameterList) {
    // }
}
```
:::end

:::lang csharp
```csharp
class ClassName
{
    [accessModifier] ClassName([parameterList])
    {
    }
}
```
:::end

:::lang python
```python
class ClassName:
    def __init__(self, parameters):
        pass
```
:::end

:::lang cpp
```cpp
class ClassName {
public:
    ClassName(/* parameter list */) {
    }
};
```
:::end

前面的例子中，我们没有自己编写构造方法，却依然能够调用它，这是为什么？如果一个类没有声明任何构造方法，编译器就会自动提供一个无参数的默认构造方法。在 Java 中，它的访问级别与类的访问级别相对应。

:::lang java
```java
class Student {
    private String name;

    public Student() {
    }
}
```
:::end

:::lang csharp
```csharp
class Student
{
    public Student()
    {
    }

    public string Name { get; set; }
}
```
:::end

:::lang python
```python
class Student:
    def __init__(self):
        self.name = None
```
:::end

:::lang cpp
```cpp
#include <string>

class Student {
public:
    Student() {}
    std::string name;
};
```
:::end

当然，我们也可以编写带参数的构造方法，让它接收实例正常运行时不可缺少的数据。这些数据必须像 setter 方法接收的参数一样进行验证。

在下面的例子中，构造方法接收一个名为 `name` 的参数，而类中也有一个同名字段。此时，单独写 `name` 表示构造方法的参数，`this.name` 则表示当前实例的字段。`this` 关键字指向正在执行构造方法或实例方法的那个对象。如果参数使用不同的名称，这里就不必写 `this`。

:::lang java
```java
class Student {
    private String name;

    public Student(String name) {
        this.name = name;
    }
}
```
:::end

:::lang csharp
```csharp
class Student
{
    public Student(string name)
    {
        Name = name;
    }

    public string Name { get; set; }
}
```
:::end

:::lang python
```python
class Student:
    def __init__(self, name):
        self.name = name
```
:::end

:::lang cpp
```cpp
#include <string>

class Student {
public:
    explicit Student(const std::string& name) : name(name) {}
    std::string name;
};
```
:::end

![UML](content/chapters/04-konstruktorok/media/constructor-zh.svg){width=330}

需要注意，如果我们编写了带参数的构造方法，却没有编写无参数构造方法，编译器便不会自动生成后者。此时必须使用已经定义的构造方法来创建对象。

:::lang java
```java
class Student {
    private String name;

    public Student(String name) {
        this.name = name;
    }
}

class Main {
    public static void main(String[] args) {
        Student first = new Student("Alex Smith");
        Student second = new Student(); // Compilation error: no matching constructor.
    }
}
```
:::end

:::lang csharp
```csharp
class Student
{
    public Student(string name)
    {
        Name = name;
    }

    public string Name { get; set; }
}

class Program
{
    static void Main(string[] args)
    {
        Student first = new Student("Alex Smith");
        Student second = new Student(); // Compilation error: no parameterless constructor exists.
    }
}
```
:::end

:::lang python
```python
class Student:
    def __init__(self, name):
        self.name = name

first = Student("Alex Smith")
second = Student()  # TypeError: missing required argument 'name'
```
:::end

:::lang cpp
```cpp
#include <string>

class Student {
public:
    explicit Student(const std::string& name) : name(name) {}
    std::string name;
};

int main() {
    Student first("Alex Smith");
    Student second; // Compilation error: no default constructor.
}
```
:::end

## 构造方法重载与构造方法调用 {#constructor-chaining}

同一个类中可以编写**多个构造方法**，只要它们的参数列表不同即可。这称为**构造方法重载**。因此，我们可以根据已有信息的多少，使用不同的方式创建同一个类的实例。

不过，我们应当考虑是否有必要为每个构造方法重复编写初始化代码。如果字段赋值和验证过程相同，重复代码只会增加维护难度。在 Java 中，可以通过 `this(...)` **从一个构造方法调用同一个类的另一个构造方法**。因此，`this.name` 表示当前实例的字段，而 `this(...)` 用于调用同一个类中的另一个构造方法。在本教材的例子中，我们把这一调用写在构造方法体的开头。在下例中，无参数构造方法将姓名的初始化交给另一个构造方法完成。

:::lang java
```java
class Student {
    private String name;

    public Student() {
        this("Unknown Student");
    }

    public Student(String name) {
        setName(name);
    }

    public void setName(String name) {
        if (name == null || name.isBlank())
            throw new IllegalArgumentException("Name cannot be empty!");
        this.name = name;
    }
}
```
:::end

:::lang csharp
```csharp
class Student
{
    private string name;

    public Student() : this("Unknown Student")
    {
    }

    public Student(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name cannot be empty!");
        this.name = name;
    }
}
```
:::end

:::lang python
```python
class Student:
    def __init__(self, name="Unknown Student"):
        if not name or not name.strip():
            raise ValueError("Name cannot be empty!")
        self.name = name
```
:::end

:::lang cpp
```cpp
#include <stdexcept>
#include <string>

class Student {
    std::string name;
public:
    Student() : Student("Unknown Student") {}

    explicit Student(const std::string& name) : name(name) {
        if (name.empty())
            throw std::invalid_argument("Name cannot be empty!");
    }
};
```
:::end

这样一来，姓名的赋值和验证只需编写一次。以后增加新的构造方法时，也可以调用已有的构造方法。由这些调用构成的顺序称为**构造方法调用链**。目前我们只讨论同一类内部的调用；学习继承以后，再完整介绍构造方法调用链。

C# 可以通过 `: this(...)` 实现类似功能，C++ 则支持委托构造函数。在 Python 中，不能以完全相同的方式重载多个 `__init__` 方法，但可以利用参数默认值达到相近的效果。

## 练习 {#exercises}

现在为前面章节编写的五个类添加构造方法。如果需要多个构造方法，应尽可能从一个构造方法调用另一个，避免重复编写初始化和数据验证代码。

:::exercise
### 矩形

![UML](content/chapters/04-konstruktorok/media/rect-zh.svg){width=355}

为之前的 `Rectangle` 类添加带参数的构造方法，接收左上角坐标以及矩形的宽度和高度。使用已经编写的 setter 方法检查两条边长是否合法。

再编写一个无参数构造方法，创建左上角位于 `(0, 0)`、尺寸为 `1 × 1` 的矩形。**这个构造方法必须调用带参数的构造方法**，而不是重复编写初始化代码。在主程序中使用两种构造方法创建实例，并显示周长和面积。
:::endexercise

:::exercise
### 图书

![UML](content/chapters/04-konstruktorok/media/book-zh.svg){width=400}

为 `Book` 类编写一个构造方法，接收作者、书名、价格、类别以及是否为纸质书。使用之前编写的验证方法检查数据。

再编写一个只接收作者、书名和价格的构造方法。它必须**调用前一个构造方法**，为类别指定一个默认枚举值，并将书籍设为纸质书。使用两种构造方法创建至少四本书，并测试无效价格。
:::endexercise

:::exercise
### 汽车

![UML](content/chapters/04-konstruktorok/media/car-zh.svg){width=355}

为 `Car` 类编写构造方法，接收品牌、型号、生产年份以及初始里程。构造方法必须确保所有数据符合上一章的要求。

再编写一个只接收品牌、型号和生产年份的构造方法，将里程初始化为零。**第二个构造方法必须调用第一个构造方法。** 创建三辆汽车，通过 `drive` 方法增加里程。
:::endexercise

:::exercise
### 银行账户

![UML](content/chapters/04-konstruktorok/media/bank-zh.svg){width=400}

为 `BankAccount` 类编写构造方法，接收持有人姓名、账号和初始余额。构造方法应保证创建出的账户具有合法数据。

再编写一个只接收持有人姓名和账号的构造方法，通过**调用前一个构造方法**创建初始余额为零的账户。余额仍然不应具有公共 setter。在主程序中创建多个账户，并测试存款和取款操作。
:::endexercise

:::exercise
### 电影

![UML](content/chapters/04-konstruktorok/media/movie-zh.svg){width=450}

为 `Movie` 类添加构造方法，接收导演、片名、时长、语言以及是否使用字幕。验证传入的数据，并将演员和电影类别列表初始化为空列表。

再编写一个不接收字幕参数的构造方法，它必须**调用前一个构造方法**，默认创建无字幕电影。在主程序中创建三部电影，添加演员和类别并显示其信息，同时确认不能通过 getter 返回的列表直接修改对象内部数据。
:::endexercise
