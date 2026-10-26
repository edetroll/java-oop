# 数据隐藏与属性

面向对象编程的一项重要任务是保护类中的数据。这意味着不仅要防止未经授权的代码访问数据，还要确保即使允许访问，也不能将无效值存入字段。

> **本学期，我们将采用以下方式模拟数据保护及未授权访问：凡是在主程序中能够对对象数据进行的操作，都视为其他人也能够进行。**

## 访问权限 {#access-levels}

类、字段和方法都具有访问级别。要理解当前问题及其解决方法，需要掌握以下访问权限。

- **`public`**：可以从任意位置访问
- **`private`**：只能在定义它的类内部访问
- **`protected`**：可在定义它的类及其子类中访问（在 Java 中，同一包中的其他类在特定情况下也可以访问）
- **包级访问权限（package-private）**：在 Java 中不写访问修饰符时，该成员可在同一包中访问

C# 还提供 **`internal`** 访问权限，允许在同一程序集（assembly）中访问。两种语言的权限规则并不完全相同。

上一章示例的问题在于，我们将所有字段标记为 `public`，因此任何代码都可以访问它们，并写入无效数据。

:::lang java
```java
class Student {
    public String name;
}

class Main {
    public static void main(String[] args) {
        Student alex = new Student();
        alex.name = null;
        alex.name = "E";
        alex.name = "AlexTaylor";
        alex.name = "Al3x T4yl0r";
    }
}
```
:::end

:::lang csharp
```csharp
class Student
{
		public string name;
		//...
}

class Program
{
		static void Main(string[] args)
		{
				Student alex = new Student();
				alex.name = null;
				alex.name = "E";
				alex.name = "AlexTaylor";
				alex.name = "Al3x T4yl0r";
				//...
		}
}
```
:::end

:::lang python
```python
class Student:
    def __init__(self):
        self.name = None

alex = Student()
alex.name = None
alex.name = "E"
alex.name = "AlexTaylor"
alex.name = "Al3x T4yl0r"
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
    Student alex;
    alex.name = "E";
    alex.name = "AlexTaylor";
    alex.name = "Al3x T4yl0r";
}
```
:::end


## Getter 与 Setter 方法 {#getters-setters}

为了保护数据，必须限制直接访问。但这样主程序也无法直接访问字段，所以需要提供公共方法。按照惯例，修改字段的方法称为 `setField`，读取字段的方法称为 `getField`。它们分别称为 **setter** 和 **getter** 方法。在 Java 中通常遵循 JavaBeans 命名规则。

:::lang java
```java
class Student {
    private String name;

    public void setName(String value) {
        name = value;
    }

    public String getName() {
        return name;
    }
}

class Main {
    public static void main(String[] args) {
        Student alex = new Student();
        alex.setName(null);
        alex.setName("E");
        System.out.println(alex.getName());
    }
}
```
:::end

:::lang csharp
```csharp
class Student
{
		private string name;
		public void SetName(string value)
		{
				name = value;
		}
		public string GetName()
		{
				return name;
		}
}

class Program
{
		static void Main(string[] args)
		{
				Student alex = new Student();
				alex.SetName(null);
				alex.SetName("E");				
				//...

				Console.WriteLine(alex.GetName());
		}
}
```
:::end

:::lang python
```python
class Student:
    def __init__(self):
        self._name = None

    def set_name(self, value):
        self._name = value

    def get_name(self):
        return self._name

alex = Student()
alex.set_name(None)
alex.set_name("E")
print(alex.get_name())
```
:::end

:::lang cpp
```cpp
#include <string>
#include <iostream>
class Student {
private:
    std::string name;
public:
    void setName(const std::string& value) { name = value; }
    const std::string& getName() const { return name; }
};

int main() {
    Student alex;
    alex.setName("E");
    std::cout << alex.getName();
}
```
:::end


乍看之下，我们一方面限制访问，另一方面又重新开放访问。区别在于，现在通过方法进行访问，因此可以在存储参数之前先验证它。

在前面的示例中，我们将 getter 和 setter 方法都声明为 `public`。但这并不意味着每个字段都必须允许这两种操作。有时我们希望主程序能够读取某个字段的值，却不允许它直接修改该值。这种情况下，只需要提供一个公开的 getter 方法；setter 方法可以省略，或者在有需要时将其声明为 `private`。重要的是，字段只能在能够检查修改规则的地方被更改。

由于 getter 和 setter 方法的结构通常非常相似，IntelliJ IDEA 可以自动生成这些方法。在编辑类时，选择 **Code → Generate… → Getter and Setter**，然后选中需要生成方法的字段。也可以通过 **Generate…** 右键菜单完成相同的操作。需要注意，自动生成的 setter 默认不会验证传入的数据，因此必要的验证逻辑仍然需要我们自己编写。

## 数据验证与异常 {#validation}

验证失败时，标准做法不是在控制台输出错误或发出声音，而是抛出异常。异常处理将在后面的章节详细介绍。现在只需知道，Java 异常属于 `Throwable` 类的子类，并使用 `throw` 关键字抛出。参数无效时通常使用 `IllegalArgumentException`。

:::lang java
```java
throw new IllegalArgumentException("Error message");
```
:::end

:::lang csharp
```csharp
throw new Exception("Error message");
```
:::end

:::lang python
```python
raise ValueError("Error message")
```
:::end

:::lang cpp
```cpp
throw std::invalid_argument("Error message");
```
:::end


如果异常未被处理，当前操作将中断，异常沿调用栈向上传播。只有当异常未得到处理并到达线程最顶层时，该线程才会终止。

假设我们对学生姓名提出以下要求。

- 不能为 `null` 或空字符串
- 至少包含一个空格
- 姓名的每个部分至少有 **2** 个字符

此时可以采用下面的验证方式。在 Java 示例中，`split(" ", -1)` 会保留空的姓名部分，因此连续空格也无法绕过检查。

:::lang java
```java
class Student {
    private String name;

    public void setName(String value) {
        if (value == null || value.isEmpty())
            throw new IllegalArgumentException("Name must not be empty!");

        if (!value.contains(" "))
            throw new IllegalArgumentException("Name must contain at least one space!");

        String[] parts = value.split(" ", -1);
        for (String tag : parts) {
            if (tag.length() < 2)
                throw new IllegalArgumentException("Every part of the name must contain at least two characters!");
        }
        name = value;
    }

    public String getName() {
        return name;
    }
}
```
:::end

:::lang csharp
```csharp
class Student
{
		private string name;
		public void SetName(string value)
		{
				if (string.IsNullOrEmpty(value))
						throw new Exception("Name must not be empty!");

				if (!value.Contains(' '))
						throw new Exception("Name must contain at least one space!");				

				string[] parts = value.Split(' ');
				foreach (string tag in parts)
				{
						if (tag.Length < 2)
								throw new Exception("Each part of the name must have at least two characters!");
				}

				name = value;
		}
		public string GetName()
		{
				return name;
		}
}
```
:::end

:::lang python
```python
class Student:
    def __init__(self):
        self._name = None

    def set_name(self, value):
        if not value:
            raise ValueError("Name must not be empty!")
        if " " not in value:
            raise ValueError("Name must contain a space!")
        if any(len(tag) < 2 for tag in value.split(" ")):
            raise ValueError("Every part of the name must contain at least two characters!")
        self._name = value

    def get_name(self):
        return self._name
```
:::end

:::lang cpp
```cpp
#include <string>
#include <stdexcept>
#include <sstream>
class Student {
private:
    std::string name;
public:
    void setName(const std::string& value) {
        if (value.empty())
            throw std::invalid_argument("A name nem lehet ures!");
        if (value.find(' ') == std::string::npos)
            throw std::invalid_argument("A nevnek szokoz kell!");
        std::istringstream parts(value);
        std::string part;
        while (std::getline(parts, part, ' ')) {
            if (part.size() < 2)
                throw std::invalid_argument("A name minden tagja legalabb 2 character!");
        }
        name = value;
    }
    const std::string& getName() const { return name; }
};
```
:::end


## UML 中的访问权限 {#uml-access}

在 UML 中，`+` 表示公共访问，`-` 表示私有访问，`#` 表示受保护访问。符号写在字段或方法之前。

![UML](content/chapters/03-adatrejtes/media/hallgato-zh.svg){width=370}

## 语言原生属性 {#properties}

C# 在语言层面直接支持属性（property），可以通过 `get` 和 `set` 使用类似字段的语法。Java 没有对应的内置属性语法，而是使用普通的 getter 和 setter 方法。Python 可以通过 `@property` 装饰器实现类似功能。

:::lang java
```java
// Java has no C#-style property syntax.
// We use getter and setter methods.
class Student {
    private String name;

    public void setName(String value) {
        // validation
        name = value;
    }

    public String getName() {
        return name;
    }
}
```
:::end

:::lang csharp
```csharp
class Student
{
		private string name;
		public void Name
		{
				set
				{
						//validation

						name = value;
				}
				get
				{
						return name;
				}
		}
}
```
:::end

:::lang python
```python
class Student:
    def __init__(self):
        self._name = None

    @property
    def name(self):
        return self._name

    @name.setter
    def name(self, value):
        # validation
        self._name = value
```
:::end

:::lang cpp
```cpp
// C++ has no built-in C#-style property syntax.
class Student {
private:
    std::string name;
public:
    void setName(const std::string& value) {
        // validation
        name = value;
    }
    const std::string& getName() const { return name; }
};
```
:::end


C# 示例中的 `public void Name` 不是合法的属性声明。字符串属性的正确写法是 `public string Name`。

C# 的 `set` 部分具有名为 `value` 的隐式参数，其类型与属性类型相同。`get` 部分必须返回兼容类型的值。在主程序中，属性的使用方式与字段类似。

:::lang java
```java
class Main {
    public static void main(String[] args) {
        Student alex = new Student();
        alex.setName("Troll Alex");
        System.out.println(alex.getName());
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
				Student alex = new Student();
				alex.Name = "Troll Alex";
				Console.WriteLine(alex.Name);
		}
}
```
:::end

:::lang python
```python
alex = Student()
alex.name = "Troll Alex"
print(alex.name)
```
:::end

:::lang cpp
```cpp
#include <iostream>
int main() {
    Student alex;
    alex.setName("Troll Alex");
    std::cout << alex.getName();
}
```
:::end


## 练习 {#exercises}

下列任务明确描述每个字段的类型、可见性、有效性限制，以及各操作的具体行为。UML 图用于辅助理解，但仅凭文字要求也可独立完成任务。

:::exercise
### 矩形
![矩形 – UML](content/chapters/03-adatrejtes/media/complete-task-1-zh.svg){width=560}
创建 `矩形` 类，实现下列字段与操作。请按照以下要求实现字段和方法。

**字段与属性**
- `横坐标 : double` – 左上角横坐标，可为任意实数. 私有字段，公有 `获取横坐标() : double` 与 `设置横坐标(横坐标 : double) : void`；该坐标允许自由修改。
- `纵坐标 : double` – 左上角纵坐标，可为任意实数. 私有字段，公有 `获取纵坐标() : double` 与 `设置纵坐标(纵坐标 : double) : void`；该坐标允许自由修改。
- `宽度 : double` – 矩形宽度；从数据隐藏一章起必须大于零. 私有字段，具有公有 getter `获取宽度() : double` 和 setter `设置宽度(宽度 : double) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。
- `高度 : double` – 矩形高度；从数据隐藏一章起必须大于零. 私有字段，具有公有 getter `获取高度() : double` 和 setter `设置高度(高度 : double) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。

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
![图书 – UML](content/chapters/03-adatrejtes/media/complete-task-2-zh.svg){width=560}
创建 `图书` 类，实现下列字段与操作。请按照以下要求实现字段和方法。

**字段与属性**
- `作者 : String` – 作者，至少两个字符，只允许字母、空格、句点和连字符. 私有字段，具有公有 getter `获取作者() : String` 和 setter `设置作者(作者 : String) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。
- `标题 : String` – 书名，至少两个字符. 私有字段，具有公有 getter `获取标题() : String` 和 setter `设置标题(标题 : String) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。
- `价格 : int` – 价格，以整数福林计；有效范围 `[500, 50 000]`. 私有字段，具有公有 getter `获取价格() : int` 和 setter `设置价格(价格 : int) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。
- `类别 : 类别` – 枚举类型，例如 BIOGRAPHY、HORROR、DRAMA、HISTORY、SCIFI、COMEDY. 私有字段，具有公有 getter `获取类别() : 类别` 和 setter `设置类别(类别 : 类别) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。
- `纸质 : boolean` – 纸质书为 true，电子书为 false. 私有字段，公有 `是否纸质() : boolean` 与 `设置纸质(纸质 : boolean) : void`；布尔值无需额外验证。

**方法**
- `打折(百分比 : int) : void` – 参数是 `1` 到 `99` 的整数折扣百分比；无效输入不改变价格，折后金额向下取整为福林且不得低于 `899`.
- `toString() : String` – 返回包含图书主要字段的可读字符串.
各字段 getter/setter 的可见性以上述说明为准。验证失败时不得破坏对象原有的有效状态。

**主程序**
创建五个不同的实例，填写数据并测试各项操作。对于已经学习的数据验证，还应尝试合法和非法的参数。
:::endexercise

:::exercise
### 汽车
![汽车 – UML](content/chapters/03-adatrejtes/media/complete-task-3-zh.svg){width=560}
创建 `汽车` 类，实现下列字段与操作。请按照以下要求实现字段和方法。

**字段与属性**
- `品牌 : String` – 品牌，不得为 null 或空字符串. 私有字段，具有公有 getter `获取品牌() : String` 和 setter `设置品牌(品牌 : String) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。
- `型号 : String` – 型号，不得为 null 或空字符串. 私有字段，具有公有 getter `获取型号() : String` 和 setter `设置型号(型号 : String) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。
- `年份 : int` – 生产年份，范围 `[1886, 2100]`. 私有字段，具有公有 getter `获取年份() : int` 和 setter `设置年份(年份 : int) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。
- `里程 : int` – 里程表读数，单位为整公里，不得为负数. 私有字段；只需公有 `获取里程() : int`，字段只能通过指定操作或构造方法修改。

**方法**
- `行驶(距离 : int) : void` – 仅接受正整数公里数，并增加 `mileage`.
- `toString() : String` – 返回含品牌、型号、年份和里程的字符串.
各字段 getter/setter 的可见性以上述说明为准。验证失败时不得破坏对象原有的有效状态。

**主程序**
创建五个不同的实例，填写数据并测试各项操作。对于已经学习的数据验证，还应尝试合法和非法的参数。
:::endexercise

:::exercise
### 银行账户
![银行账户 – UML](content/chapters/03-adatrejtes/media/complete-task-4-zh.svg){width=560}
创建 `银行账户` 类，实现下列字段与操作。请按照以下要求实现字段和方法。

**字段与属性**
- `持有人 : String` – 账户所有人姓名，不得为 null 或空字符串. 私有字段，具有公有 getter `获取持有人() : String` 和 setter `设置持有人(持有人 : String) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。
- `账号 : String` – 账号，不得为 null 或空字符串，创建后不得修改. 私有字段，提供公有 `获取账号() : String` 和 `设置账号(账号 : String) : void`；setter 只允许首次有效赋值，之后修改须抛出异常。
- `余额 : int` – 余额，以整数福林计，不得为负数. 私有字段；只需公有 `获取余额() : int`，字段只能通过指定操作或构造方法修改。

**方法**
- `存款(金额 : int) : void` – 仅接受正整数金额，增加余额.
- `取款(金额 : int) : void` – 只能提取正整数且不超过当前余额.
- `获取余额() : int` – 返回当前余额.
- `toString() : String` – 返回包含账号、持有人及余额的可读字符串.
各字段 getter/setter 的可见性以上述说明为准。验证失败时不得破坏对象原有的有效状态。

**主程序**
创建五个不同的实例，填写数据并测试各项操作。对于已经学习的数据验证，还应尝试合法和非法的参数。

在本章中，允许使用公有 `setAccountNumber(String)` 仅设置一次账号，此后禁止更改。下一章将使用构造方法完成初始赋值。
:::endexercise

:::exercise
### 电影
![电影 – UML](content/chapters/03-adatrejtes/media/complete-task-5-zh.svg){width=560}
创建 `电影` 类，实现下列字段与操作。请按照以下要求实现字段和方法。

**字段与属性**
- `导演 : String` – 导演，不得为 null，至少两个字符，只允许字母、空格、句点和连字符. 私有字段，具有公有 getter `获取导演() : String` 和 setter `设置导演(导演 : String) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。
- `标题 : String` – 片名，不得为 null，至少两个字符. 私有字段，具有公有 getter `获取标题() : String` 和 setter `设置标题(标题 : String) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。
- `时长 : int` – 影片时长，以整数分钟计，范围 `[10, 360]`. 私有字段，具有公有 getter `获取时长() : int` 和 setter `设置时长(时长 : int) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。
- `语言 : 语言` – 语言，枚举类型. 私有字段，具有公有 getter `获取语言() : 语言` 和 setter `设置语言(语言 : 语言) : void`。验证通过后方可赋值；非法数据应抛出 `IllegalArgumentException`，并保持原值不变。
- `字幕 : boolean` – 是否带字幕. 私有字段，公有 `是否有字幕() : boolean` 与 `设置字幕(字幕 : boolean) : void`；布尔值无需额外验证。
- `演员列表 : ArrayList<String>` – 演员列表；私有字段，外部只能获得副本. 私有字段；公有 `获取演员列表() : ArrayList<String>` getter 返回防御性副本，只能通过指定的添加方法修改集合。
- `类别列表 : ArrayList<类别>` – 影片类别列表；私有字段，getter 只返回副本. 私有字段；公有 `获取类别列表() : ArrayList<类别>` getter 返回防御性副本，只能通过指定的添加方法修改集合。

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
