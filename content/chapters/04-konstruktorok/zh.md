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

下列任务明确描述每个字段的类型、可见性、有效性限制，以及各操作的具体行为。UML 图用于辅助理解，但仅凭文字要求也可独立完成任务。

:::exercise
### 矩形
![矩形 – UML](content/chapters/04-konstruktorok/media/complete-task-1-zh.svg){width=560}
创建 `矩形` 类，实现下列字段与操作。请按照以下要求实现字段和方法。

**字段与属性**
- `横坐标 : double` – 左上角横坐标，可为任意实数. 私有字段，公有 `获取横坐标() : double` 与 `设置横坐标(横坐标 : double) : void`；该坐标允许自由修改。
- `纵坐标 : double` – 左上角纵坐标，可为任意实数. 私有字段，公有 `获取纵坐标() : double` 与 `设置纵坐标(纵坐标 : double) : void`；该坐标允许自由修改。
- `宽度 : double` – 矩形宽度；从数据隐藏一章起必须大于零. 私有字段，具有公有 getter `获取宽度() : double` 和 setter `设置宽度(宽度 : double) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。
- `高度 : double` – 矩形高度；从数据隐藏一章起必须大于零. 私有字段，具有公有 getter `获取高度() : double` 和 setter `设置高度(高度 : double) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。

**构造方法**
- `矩形()` – 调用完整的构造方法；省略的参数默认值为左上角 `(0,0)`，宽高均为 `1`。
- `矩形(横坐标 : double, 纵坐标 : double, 宽度 : double, 高度 : double)` – 验证所有参数；非法值必须抛出异常，不得创建无效实例。

**方法**
- `计算周长() : double` – 无参数函数，返回 `2 × (width + height)`.
- `计算面积() : double` – 无参数函数，返回 `width × height`.
- `判断重叠(另一个 : 矩形) : boolean` – 检查两个矩形是否存在面积大于零的交集；仅边界接触不算重叠.
- `获取象限() : int` – 整个矩形严格位于某一象限时返回 `1`–`4`，否则返回 `-1`.
各字段 getter/setter 的可见性以上述说明为准。验证失败时不得破坏对象原有的有效状态。

**主程序**
创建五个不同的实例，填写数据并测试各项操作。对于已经学习的数据验证，还应尝试合法和非法的参数。
:::endexercise

:::exercise
### 图书
![图书 – UML](content/chapters/04-konstruktorok/media/complete-task-2-zh.svg){width=560}
创建 `图书` 类，实现下列字段与操作。请按照以下要求实现字段和方法。

**字段与属性**
- `作者 : String` – 作者，至少两个字符，只允许字母、空格、句点和连字符. 私有字段，具有公有 getter `获取作者() : String` 和 setter `设置作者(作者 : String) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。
- `标题 : String` – 书名，至少两个字符. 私有字段，具有公有 getter `获取标题() : String` 和 setter `设置标题(标题 : String) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。
- `价格 : int` – 价格，以整数福林计；有效范围 `[500, 50 000]`. 私有字段，具有公有 getter `获取价格() : int` 和 setter `设置价格(价格 : int) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。
- `类别 : 类别` – 枚举类型，例如 BIOGRAPHY、HORROR、DRAMA、HISTORY、SCIFI、COMEDY. 私有字段，具有公有 getter `获取类别() : 类别` 和 setter `设置类别(类别 : 类别) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。
- `纸质 : boolean` – 纸质书为 true，电子书为 false. 私有字段，公有 `是否纸质() : boolean` 与 `设置纸质(纸质 : boolean) : void`；布尔值无需额外验证。

**构造方法**
- `图书(作者 : String, 标题 : String, 价格 : int, 类别 : 类别, 纸质 : boolean)` – 验证所有参数；非法值必须抛出异常，不得创建无效实例。
- `图书(作者 : String, 标题 : String, 价格 : int)` – 调用完整的构造方法；省略的参数默认值为`Genre.DRAMA` 且为纸质书。

**方法**
- `打折(百分比 : int) : void` – 参数是 `1` 到 `99` 的整数折扣百分比；无效输入不改变价格，折后金额向下取整为福林且不得低于 `899`.
- `toString() : String` – 返回包含图书主要字段的可读字符串.
各字段 getter/setter 的可见性以上述说明为准。验证失败时不得破坏对象原有的有效状态。

**主程序**
创建五个不同的实例，填写数据并测试各项操作。对于已经学习的数据验证，还应尝试合法和非法的参数。
:::endexercise

:::exercise
### 汽车
![汽车 – UML](content/chapters/04-konstruktorok/media/complete-task-3-zh.svg){width=560}
创建 `汽车` 类，实现下列字段与操作。请按照以下要求实现字段和方法。

**字段与属性**
- `品牌 : String` – 品牌，不得为 null 或空字符串. 私有字段，具有公有 getter `获取品牌() : String` 和 setter `设置品牌(品牌 : String) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。
- `型号 : String` – 型号，不得为 null 或空字符串. 私有字段，具有公有 getter `获取型号() : String` 和 setter `设置型号(型号 : String) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。
- `年份 : int` – 生产年份，范围 `[1886, 2100]`. 私有字段，具有公有 getter `获取年份() : int` 和 setter `设置年份(年份 : int) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。
- `里程 : int` – 里程表读数，单位为整公里，不得为负数. 私有字段；只需公有 `获取里程() : int`，字段只能通过指定操作或构造方法修改。

**构造方法**
- `汽车(品牌 : String, 型号 : String, 年份 : int, 里程 : int)` – 验证所有参数；非法值必须抛出异常，不得创建无效实例。
- `汽车(品牌 : String, 型号 : String, 年份 : int)` – 调用完整的构造方法；省略的参数默认值为里程为 `0` 公里。

**方法**
- `行驶(距离 : int) : void` – 仅接受正整数公里数，并增加 `mileage`.
- `toString() : String` – 返回含品牌、型号、年份和里程的字符串.
各字段 getter/setter 的可见性以上述说明为准。验证失败时不得破坏对象原有的有效状态。

**主程序**
创建五个不同的实例，填写数据并测试各项操作。对于已经学习的数据验证，还应尝试合法和非法的参数。
:::endexercise

:::exercise
### 银行账户
![银行账户 – UML](content/chapters/04-konstruktorok/media/complete-task-4-zh.svg){width=560}
创建 `银行账户` 类，实现下列字段与操作。请按照以下要求实现字段和方法。

**字段与属性**
- `持有人 : String` – 账户所有人姓名，不得为 null 或空字符串. 私有字段，具有公有 getter `获取持有人() : String` 和 setter `设置持有人(持有人 : String) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。
- `账号 : String` – 账号，不得为 null 或空字符串，创建后不得修改. 私有字段；只提供公有 `获取账号() : String`，不提供公有 setter，由构造方法初始化。
- `余额 : int` – 余额，以整数福林计，不得为负数. 私有字段；只需公有 `获取余额() : int`，字段只能通过指定操作或构造方法修改。

**构造方法**
- `银行账户(持有人 : String, 账号 : String, 余额 : int)` – 验证所有参数；非法值必须抛出异常，不得创建无效实例。
- `银行账户(持有人 : String, 账号 : String)` – 调用完整的构造方法；省略的参数默认值为初始余额 `0`。

**方法**
- `存款(金额 : int) : void` – 仅接受正整数金额，增加余额.
- `取款(金额 : int) : void` – 只能提取正整数且不超过当前余额.
- `获取余额() : int` – 返回当前余额.
- `toString() : String` – 返回包含账号、持有人及余额的可读字符串.
各字段 getter/setter 的可见性以上述说明为准。验证失败时不得破坏对象原有的有效状态。

**主程序**
创建五个不同的实例，填写数据并测试各项操作。对于已经学习的数据验证，还应尝试合法和非法的参数。
:::endexercise

:::exercise
### 电影
![电影 – UML](content/chapters/04-konstruktorok/media/complete-task-5-zh.svg){width=560}
创建 `电影` 类，实现下列字段与操作。请按照以下要求实现字段和方法。

**字段与属性**
- `导演 : String` – 导演，不得为 null，至少两个字符，只允许字母、空格、句点和连字符. 私有字段，具有公有 getter `获取导演() : String` 和 setter `设置导演(导演 : String) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。
- `标题 : String` – 片名，不得为 null，至少两个字符. 私有字段，具有公有 getter `获取标题() : String` 和 setter `设置标题(标题 : String) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。
- `时长 : int` – 影片时长，以整数分钟计，范围 `[10, 360]`. 私有字段，具有公有 getter `获取时长() : int` 和 setter `设置时长(时长 : int) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。
- `语言 : 语言` – 语言，枚举类型. 私有字段，具有公有 getter `获取语言() : 语言` 和 setter `设置语言(语言 : 语言) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。
- `字幕 : boolean` – 是否带字幕. 私有字段，公有 `是否有字幕() : boolean` 与 `设置字幕(字幕 : boolean) : void`；布尔值无需额外验证。
- `演员列表 : ArrayList<String>` – 演员列表；私有字段，外部只能获得副本. 私有字段；公有 `获取演员列表() : ArrayList<String>` getter 返回防御性副本，只能通过指定的添加方法修改集合。
- `类别列表 : ArrayList<类别>` – 影片类别列表；私有字段，getter 只返回副本. 私有字段；公有 `获取类别列表() : ArrayList<类别>` getter 返回防御性副本，只能通过指定的添加方法修改集合。

**构造方法**
- `电影(导演 : String, 标题 : String, 时长 : int, 语言 : 语言, 字幕 : boolean)` – 验证所有参数；非法值必须抛出异常，不得创建无效实例。
- `电影(导演 : String, 标题 : String, 时长 : int, 语言 : 语言)` – 调用完整的构造方法；省略的参数默认值为无字幕影片。

**方法**
- `是否有演员(姓名 : String) : boolean` – 判断指定演员是否出演本片.
- `添加演员(姓名 : String) : void` – 按照导演姓名规则检查后添加演员，禁止重复.
- `添加类别(类别 : 类别) : void` – 添加非 null 的类别，禁止重复.
- `获取演员列表() : ArrayList<String>` – 返回新的演员列表.
- `获取类别列表() : ArrayList<类别>` – 返回新的类别列表.
- `toString() : String` – 返回可读文本，时长为 `时:分:00`，仅对非匈牙利语影片显示字幕信息.
各字段 getter/setter 的可见性以上述说明为准。验证失败时不得破坏对象原有的有效状态。

**主程序**
创建五个不同的实例，填写数据并测试各项操作。对于已经学习的数据验证，还应尝试合法和非法的参数。
:::endexercise
