# 封装

封装是面向对象编程的第一项基本原则。它指出：将现实世界中的对象映射到程序中时，应把描述对象的数据（字段）以及操作这些数据的方法封装在同一个单元中。我们通过创建类来实现封装。使用 `class` 关键字声明类。

:::lang java
```java
import java.time.LocalDate;

class Student {
    public String name;
    public String studentId;
    public LocalDate dateOfBirth;

    public void register(String course) {
        // Registration will be implemented later.
    }

    public void withdraw(String course) {
        // Withdrawal will be implemented later.
    }

    public boolean canTakeFinalExam() {
        // Eligibility check will be implemented later.
        return false;
    }
}
```
:::end

:::lang csharp
```csharp
class Student
{
		public string name;
		public string studentId;
		public DateTime dateOfBirth;
		//...

		public void Register(string course) { /*...*/ }
		public void Withdraw(string course) { /*...*/ }
		public bool CanTakeFinalExam() { /*...*/ }
		//...
}
```
:::end

:::lang python
```python
from datetime import date

class Student:
    def __init__(self):
        self.name = ""
        self.studentId = ""
        self.dateOfBirth = None

    def register(self, course):
        pass

    def withdraw(self, course):
        pass

    def can_take_final_exam(self):
        return False
```
:::end

:::lang cpp
```cpp
#include <string>
#include <ctime>

class Student {
public:
    std::string name;
    std::string studentId;
    std::tm dateOfBirth{};

    void register(const std::string& course) { /* ... */ }
    void withdraw(const std::string& course) { /* ... */ }
    bool canTakeFinalExam() { return false; }
};
```
:::end

上面的示例中，每个字段和方法都使用了 `public` 关键字。我们将在后面的章节中详细介绍它。目前，方法体只是占位代码，实际功能将在之后实现。

因此，类明确地定义和描述了所代表对象的结构。我们通过**实例化**创建具体的对象，也就是类的**实例**。

:::lang java
```java
public static void main(String[] args) {
    Student alex = new Student();
    Student ben = new Student();
}
```
:::end

:::lang csharp
```csharp
static void Main(string[] args)
{
		Student alex = new Student();
		Student ben = new Student();
}
```
:::end

:::lang python
```python
alex = Student()
ben = Student()
```
:::end

:::lang cpp
```cpp
int main() {
    Student alex;
    Student ben;
}
```
:::end

通过实例的标识符，使用点运算符（**`.`**）访问该实例的字段和方法。

:::lang java
```java
import java.time.LocalDate;

public static void main(String[] args) {
    Student alex = new Student();
    alex.name = "Troll Alex";
    alex.dateOfBirth = LocalDate.of(1987, 5, 4);
    alex.studentId = "QWER12";

    Student ben = new Student();
    ben.name = "Ben Carter";
    ben.dateOfBirth = LocalDate.of(1977, 5, 10);
    ben.studentId = "AWSD99";

    alex.register("Introduction to Computer Graphics (lecture)");
    ben.withdraw("Computer Graphics (lab)");
    boolean gergoCanTakeFinalExam = ben.canTakeFinalExam();
}
```
:::end

:::lang csharp
```csharp
static void Main(string[] args)
{
		Student alex = new Student();
		alex.name = "Troll Alex";
		alex.dateOfBirth = DateTime.Parse("1987.05.04");
		alex.studentId = "QWER12";

		Student ben = new Student();
		ben.name = "Ben Carter";
		ben.dateOfBirth = DateTime.Parse("1977.05.10");
		ben.studentId = "AWSD99";

		alex.Register("Introduction to Computer Graphics (lecture)");
		ben.Withdraw("Computer Graphics (lab)");
		bool gergoCanTakeFinalExam = ben.CanTakeFinalExam();
}
```
:::end

:::lang python
```python
from datetime import date

alex = Student()
alex.name = "Troll Alex"
alex.dateOfBirth = date(1987, 5, 4)
alex.studentId = "QWER12"

ben = Student()
ben.name = "Ben Carter"
ben.dateOfBirth = date(1977, 5, 10)
ben.studentId = "AWSD99"

alex.register("Introduction to Computer Graphics (lecture)")
ben.withdraw("Computer Graphics (lab)")
gergoCanTakeFinalExam = ben.can_take_final_exam()
```
:::end

:::lang cpp
```cpp
int main() {
    Student alex;
    alex.name = "Troll Alex";
    alex.dateOfBirth = {0, 0, 0, 4, 4, 87}; // 1987.05.04
    alex.studentId = "QWER12";

    Student ben;
    ben.name = "Ben Carter";
    ben.dateOfBirth = {0, 0, 0, 10, 4, 77}; // 1977.05.10
    ben.studentId = "AWSD99";

    alex.register("Introduction to Computer Graphics (lecture)");
    ben.withdraw("Computer Graphics (lab)");
    bool gergoCanTakeFinalExam = ben.canTakeFinalExam();
}
```
:::end

在 Java 中，我们使用 `LocalDate` 类存储出生日期。目前不详细讨论它的工作原理。

按照常见的设计方式，我们通常不会在类中编写直接向屏幕输出对象数据的方法，因为这样需要在类内部实现依赖运行平台的显示操作。要解决这个问题，需要知道每个 Java 类都有父类。如果没有显式指定父类，它就会自动继承 `Object` 类。我们会从 `Object` 继承一些方法，其中部分方法可以被重写。暂时不深入讨论其原理，下面先编写返回字符串的 `toString()` 方法，把重要信息组合成一个字符串并将其返回。

请将下面的方法放在 `Student` 类的内部。在 Java 中，方法名为 `toString()`（首字母小写），`@Override` 表示我们正在重写继承的方法。

:::lang java
```java
@Override
public String toString() {
    String text = "";
    text += "Name: " + name + "\n";
    text += "Student ID: " + studentId + "\n";
    text += "Date of birth: " + dateOfBirth + "\n";
    return text;
}
```
:::end

:::lang csharp
```csharp
class Student
{
		public string name;
		public string studentId;
		public DateTime dateOfBirth;
		//...

		public override string ToString()
		{
				string text = string.Empty;
				text += "Name: " + name + "\n";
				text += "Student ID: " + studentId + "\n";
				text += "Date of birth: " + dateOfBirth.ToString("yyyy.MM.dd (dddd)") + "\n";
				return text;
		}
}
```
:::end

:::lang python
```python
def __str__(self):
    text = "Name: " + self.name + "\n"
    text += "Student ID: " + self.studentId + "\n"
    text += "Date of birth: " + self.dateOfBirth.strftime("%Y.%m.%d (%A)") + "\n"
    return text
```
:::end

:::lang cpp
```cpp
// Inside the Student class:
std::string toString() const {
    char dateBuffer[40];
    std::strftime(dateBuffer, sizeof(dateBuffer), "%Y.%m.%d (%A)", &dateOfBirth);
    std::string text = "Name: " + name + "\n";
    text += "Student ID: " + studentId + "\n";
    text += "Date of birth: " + std::string(dateBuffer) + "\n";
    return text;
}
```
:::end

按照上述方式重写 `toString()` 后，就可以在主程序中这样显示实例的数据。

:::lang java
```java
public static void main(String[] args) {
    Student alex = new Student();
    alex.name = "Troll Alex";
    alex.dateOfBirth = LocalDate.of(1987, 5, 4);
    alex.studentId = "QWER12";

    Student ben = new Student();
    ben.name = "Ben Carter";
    ben.dateOfBirth = LocalDate.of(1977, 5, 10);
    ben.studentId = "AWSD99";

    System.out.println(alex);
    System.out.println(ben);
}
```
:::end

:::lang csharp
```csharp
static void Main(string[] args)
{
		Student alex = new Student();
		alex.name = "Troll Alex";
		alex.dateOfBirth = DateTime.Parse("1987.05.04");
		alex.studentId = "QWER12";

		Student ben = new Student();
		ben.name = "Ben Carter";
		ben.dateOfBirth = DateTime.Parse("1977.05.10");
		ben.studentId = "AWSD99";

		Console.WriteLine(alex);
		Console.WriteLine(ben);
}
```
:::end

:::lang python
```python
from datetime import date

alex = Student()
alex.name = "Troll Alex"
alex.dateOfBirth = date(1987, 5, 4)
alex.studentId = "QWER12"

ben = Student()
ben.name = "Ben Carter"
ben.dateOfBirth = date(1977, 5, 10)
ben.studentId = "AWSD99"

print(alex)
print(ben)
```
:::end

:::lang cpp
```cpp
#include <iostream>

int main() {
    Student alex;
    alex.name = "Troll Alex";
    alex.dateOfBirth = {0, 0, 0, 4, 4, 87};
    alex.studentId = "QWER12";

    Student ben;
    ben.name = "Ben Carter";
    ben.dateOfBirth = {0, 0, 0, 10, 4, 77};
    ben.studentId = "AWSD99";

    std::cout << alex.toString() << ben.toString();
}
```
:::end

我们也可以使用 UML 类图表示类的结构。最上方是类名，中间是字段，下方是方法。`+` 符号的含义将在后面的章节中介绍。

![UML: Student](content/chapters/02-osztalyok/media/hallgato-zh.svg){width=310}

## 练习 {#exercises}

下列任务明确描述每个字段的类型、可见性、有效性限制，以及各操作的具体行为。UML 图用于辅助理解，但仅凭文字要求也可独立完成任务。

:::exercise
### 矩形
![矩形 – UML](content/chapters/02-osztalyok/media/complete-task-1-zh.svg){width=560}
创建 `矩形` 类，实现下列字段与操作。请按照以下要求实现字段和方法。

**字段与属性**
- `横坐标 : double` – 横坐标. 此阶段为公有字段，主程序可以直接访问。
- `纵坐标 : double` – 纵坐标. 此阶段为公有字段，主程序可以直接访问。
- `宽度 : double` – 宽度. 此阶段为公有字段，主程序可以直接访问。
- `高度 : double` – 高度. 此阶段为公有字段，主程序可以直接访问。

**方法**
- `计算周长() : double` – 无参数函数，返回 `2 × (width + height)`.
- `计算面积() : double` – 无参数函数，返回 `width × height`.
- `判断重叠(另一个 : 矩形) : boolean` – 检查两个矩形是否存在面积大于零的交集；仅边界接触不算重叠.
- `获取象限() : int` – 整个矩形严格位于某一象限时返回 `1`–`4`，否则返回 `-1`.

**主程序**
创建五个不同的实例，填写数据并测试各项操作。对于已经学习的数据验证，还应尝试合法和非法的参数。
:::endexercise

:::exercise
### 图书
![图书 – UML](content/chapters/02-osztalyok/media/complete-task-2-zh.svg){width=560}
创建 `图书` 类，实现下列字段与操作。请按照以下要求实现字段和方法。

**字段与属性**
- `作者 : String` – 作者. 此阶段为公有字段，主程序可以直接访问。
- `标题 : String` – 标题. 此阶段为公有字段，主程序可以直接访问。
- `价格 : int` – 价格. 此阶段为公有字段，主程序可以直接访问。
- `类别 : String` – 类别，此阶段使用字符串.
- `纸质 : boolean` – 纸质. 此阶段为公有字段，主程序可以直接访问。

**方法**
- `打折(百分比 : int) : void` – 参数是 `1` 到 `99` 的整数折扣百分比；无效输入不改变价格，折后金额向下取整为福林且不得低于 `899`.
- `toString() : String` – 返回包含图书主要字段的可读字符串.

**主程序**
创建五个不同的实例，填写数据并测试各项操作。对于已经学习的数据验证，还应尝试合法和非法的参数。
:::endexercise

:::exercise
### 汽车
![汽车 – UML](content/chapters/02-osztalyok/media/complete-task-3-zh.svg){width=560}
创建 `汽车` 类，实现下列字段与操作。请按照以下要求实现字段和方法。

**字段与属性**
- `品牌 : String` – 品牌. 此阶段为公有字段，主程序可以直接访问。
- `型号 : String` – 型号. 此阶段为公有字段，主程序可以直接访问。
- `年份 : int` – 年份. 此阶段为公有字段，主程序可以直接访问。
- `里程 : int` – 里程. 此阶段为公有字段，主程序可以直接访问。

**方法**
- `行驶(距离 : int) : void` – 仅接受正整数公里数，并增加 `mileage`.
- `toString() : String` – 返回含品牌、型号、年份和里程的字符串.

**主程序**
创建五个不同的实例，填写数据并测试各项操作。对于已经学习的数据验证，还应尝试合法和非法的参数。
:::endexercise

:::exercise
### 银行账户
![银行账户 – UML](content/chapters/02-osztalyok/media/complete-task-4-zh.svg){width=560}
创建 `银行账户` 类，实现下列字段与操作。请按照以下要求实现字段和方法。

**字段与属性**
- `持有人 : String` – 持有人. 此阶段为公有字段，主程序可以直接访问。
- `账号 : String` – 账号. 此阶段为公有字段，主程序可以直接访问。
- `余额 : int` – 余额. 此阶段为公有字段，主程序可以直接访问。

**方法**
- `存款(金额 : int) : void` – 仅接受正整数金额，增加余额.
- `取款(金额 : int) : void` – 只能提取正整数且不超过当前余额.
- `获取余额() : int` – 返回当前余额.
- `toString() : String` – 返回包含账号、持有人及余额的可读字符串.

**主程序**
创建五个不同的实例，填写数据并测试各项操作。对于已经学习的数据验证，还应尝试合法和非法的参数。
:::endexercise

:::exercise
### 电影
![电影 – UML](content/chapters/02-osztalyok/media/complete-task-5-zh.svg){width=560}
创建 `电影` 类，实现下列字段与操作。请按照以下要求实现字段和方法。

**字段与属性**
- `导演 : String` – 导演. 此阶段为公有字段，主程序可以直接访问。
- `标题 : String` – 标题. 此阶段为公有字段，主程序可以直接访问。
- `时长 : int` – 时长. 此阶段为公有字段，主程序可以直接访问。
- `语言 : 语言` – 语言. 此阶段为公有字段，主程序可以直接访问。
- `字幕 : boolean` – 字幕. 此阶段为公有字段，主程序可以直接访问。
- `演员一 : String` – 最多三个演员分别存放在字符串字段中，类别也使用字符串字段.
- `演员二 : String` – 最多三个演员分别存放在字符串字段中，类别也使用字符串字段.
- `演员三 : String` – 最多三个演员分别存放在字符串字段中，类别也使用字符串字段.
- `category : String` – 最多三个演员分别存放在字符串字段中，类别也使用字符串字段.

**方法**
- `是否有演员(姓名 : String) : boolean` – 判断指定演员是否出演本片.
- `toString() : String` – 返回可读文本，时长为 `时:分:00`，仅对非匈牙利语影片显示字幕信息.

**主程序**
创建五个不同的实例，填写数据并测试各项操作。对于已经学习的数据验证，还应尝试合法和非法的参数。
:::endexercise
