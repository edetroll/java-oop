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

![UML: Hallgato](content/chapters/02-osztalyok/media/hallgato-zh.svg){width=310}

## 练习题 {#exercises}

:::exercise
### 矩形

![UML: Teglalap](content/chapters/02-osztalyok/media/teglalap-zh.svg){width=330}

创建 `Rectangle` 类，用于表示边平行于坐标轴的矩形。每个矩形需保存以下**数据**。

- 左上顶点的 **x** 坐标：实数
- 左上顶点的 **y** 坐标：实数
- 矩形的**宽度**：实数
- 矩形的**高度**：实数

在类中实现以下方法！

- 计算矩形的**周长**：无参数，返回实数
- 计算矩形的**面积**：无参数，返回实数
- 判断**重叠**：接收另一个矩形作为参数，返回布尔值。判断两个矩形是否存在面积大于零的公共区域。仅在边或顶点接触不算重叠！
- 确定所在**象限**：无参数，返回整数。如果整个矩形完全位于某个象限的内部，则返回该象限编号；否则返回 `-1`！

假设 **y 轴正方向向上**，宽度和高度均为正数。在主程序中创建 **5** 个矩形实例，填写数据，调用实现的方法并显示结果！其中应包括相互重叠、仅接触以及彼此分离的矩形。

:::endexercise

:::exercise
### 图书

![UML: Konyv](content/chapters/02-osztalyok/media/konyv-zh.svg){width=340}

创建 `Book` 类，用于保存图书的以下信息。

- **作者**：字符串
- **书名**：字符串
- **价格**：整数，以匈牙利福林计
- **类型**：字符串（如传记、恐怖、剧情、历史、科幻、喜剧）
- 是否为**纸质书**：布尔值。纸质书为真，电子书为假

在类中实现以下方法！

- **打折**：接收 **1 至 99** 之间的整数作为折扣百分比。如果参数超出范围，则不修改价格并结束方法。否则，按指定的折扣百分比更新价格，并将结果四舍五入到整数福林。**扩展要求：** 只有折后价格不少于 **899 福林** 时才允许修改价格！
- 重写 `toString()` 方法，以清晰的格式返回图书信息！

在主程序中创建 **5** 个图书实例，填写自己喜欢的图书的信息并显示。然后使用不同的折扣值（包括无效值）调用打折方法，再次显示所有实例！

:::endexercise

:::exercise
### 电影

![UML: Film](content/chapters/02-osztalyok/media/film-zh.svg){width=360}

创建 `Movie` 类，用于保存以下电影信息。

- **导演**：字符串
- **片名**：字符串
- **演员**：三个独立的字符串字段，最多保存三位演员姓名
- **片长**：整数，以分钟计
- **类型**：字符串（如喜剧、传记、科幻、恐怖、惊悚、剧情）
- **语言**：字符串（如匈牙利语、英语、德语、法语、中文）
- 是否有**字幕**：布尔值

在类中实现以下方法！

- **演员是否出演**：接收演员姓名作为参数并返回布尔值。检查三个演员姓名字段，忽略空字段。如果均不匹配，则返回假！
- 重写 `toString()` 方法，以清晰的格式返回电影信息。片长按 `小时:分钟:00` 格式显示；只有电影语言不是匈牙利语时，才显示是否有字幕！

在主程序中创建 **5** 个电影实例，填入自己喜欢的电影的信息并显示。随后让用户输入演员姓名，显示所有包含该演员的电影片名！

:::endexercise
