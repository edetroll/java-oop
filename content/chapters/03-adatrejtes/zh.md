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

本章在上一章编写的类中加入数据验证。当 setter 或数据添加方法收到无效数据时，应抛出异常，同时保证原先保存的数据不发生改变。

:::exercise
### 矩形

![UML](content/chapters/03-adatrejtes/media/task1-zh.svg){width=340}

扩展上一章的 `Rectangle` 类。左上角的 `x`、`y` 坐标可以是任意实数，但**宽度**和**高度**必须是正数。

- 所有字段改为 `private`。
- 实现 getter 和 setter 方法。
- 宽度或高度无效时抛出 `IllegalArgumentException`。
- 保留原来的**周长**、**面积**、**相交判断**和**象限判断**方法。

在主程序中尝试将宽度、高度设置为 `0` 或负数，确认无效值不会被保存。

:::endexercise

:::exercise
### 图书

![UML](content/chapters/03-adatrejtes/media/task2-zh.svg){width=380}

在上一章 `Book` 类的基础上增加以下验证规则。

- **作者：**不能为 `null` 或空字符串，至少 **2** 个字符；只能包含字母、空格、句点（`.`）及连字符（`-`）。允许空格是为了支持多段姓名。
- **书名：**不能为 `null` 或空字符串，至少 **2** 个字符。
- **价格：**整数，取值范围 **[500, 50 000]**。
- **类型：**使用 `enum` 枚举，例如传记、恐怖、剧情、历史、科幻、喜剧。
- **是否纸质书：**布尔类型。

所有字段均设为 `private`，并实现 getter 和 setter。**打折**方法还必须保证折后价格不低于 **899 福林**。如果折扣会使价格低于这一数值，应抛出异常，并保持原价不变。

在主程序中测试有效和无效输入，并通过 `toString()` 显示图书信息。

:::endexercise

:::exercise
### 汽车

![UML: 汽车](content/chapters/03-adatrejtes/media/car-zh.svg){width=330}

将已有 `Car` 类的所有字段设为 `private`。**品牌**和**型号**不能为 `null` 或空字符串；**生产年份**必须在 **[1886, 2100]** 范围内；**行驶里程**不能为负数。

编写必要的 getter 和 setter 方法。主程序只能读取里程，不能直接修改，里程只能通过 `drive` 方法增加，并且传入的距离必须为正数。若数据无效，应抛出异常，并保持原有数据不变。

在主程序中测试有效和无效的输入，确认不能使用负距离行驶，也不能直接修改里程。
:::endexercise

:::exercise
### 银行账户

![UML: 银行账户](content/chapters/03-adatrejtes/media/bank-zh.svg){width=360}

将已有 `BankAccount` 类的所有字段设为 `private`。**持有人姓名**和**账号**不能为 `null` 或空字符串，**余额**不能为负数。账户创建后，主程序不得修改账号。

为余额提供 getter，但不提供公共 setter。余额只能通过 `deposit` 和 `withdraw` 方法修改，两种操作的金额必须为正数，取款后也不能使余额变成负数。对于无效操作，应抛出异常，并保持余额不变。

在主程序中尝试存入零金额、提取负金额和提取超过余额的金额，确认这些无效操作不会改变账户余额。
:::endexercise

:::exercise
### 电影

![UML](content/chapters/03-adatrejtes/media/task3-zh.svg){width=440}

扩展上一章的 `Movie` 类。**导演**和**片名**使用“图书”练习中的文本验证规则。**片长**为 **[10, 360]** 分钟的整数。**语言**和**电影类别**使用 `enum` 枚举类型。

- 使用列表保存**演员**，提供 `addActor(String name)` 方法验证姓名，并禁止重复添加。
- **类别**也用列表保存，同一个类别只能添加一次。
- 列表字段必须设为 `private`。getter 应返回列表的**副本**，避免主程序直接修改对象内部的列表。
- 保留之前实现的演员查询方法和 `toString()` 方法。

**提示：**Java 中可使用 `ArrayList` 及其 `add`、`contains` 方法，通过 `new ArrayList<>(originalList)` 创建副本。此题不要求深入掌握集合框架。

在主程序中尝试输入无效值、重复演员或类别，并确认修改 getter 返回的列表不会影响电影对象内部的数据。

:::endexercise
