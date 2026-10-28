# 继承

## 继承的基本原理 {#inheritance-principle}

当我们准备创建一个新类时，经常会发现，其中相当一部分字段和方法已经存在于此前实现的某个类中。直接复制原有源代码并不是理想的办法，因为相同的功能需要在多个地方维护，以后进行修改时也容易漏掉其中某个副本。面向对象编程中的**继承**使我们能够在已有类的基础上派生出一个更具体的新类，直接使用已经实现的成员。已有的类称为**基类（父类）**，新创建的类称为**派生类（子类）**。

假设我们需要保存大学学生和教师的信息。学生与教师都是人，因此都具有姓名，而且读取和修改姓名的方法也相同。与其在两个类中分别实现姓名的保存和访问，不如建立共同的 `人员` 基类，并从中派生 `学生` 和 `教师`。Java 使用 `extends` 关键字表示继承，在派生类中只需要实现其自身特有的字段和方法，而不必重新编写已有的功能。

设计继承关系时，还必须考虑两个类之间是否确实存在**“是一种”（is-a）**的关系。学生是一种人，电动汽车是一种汽车，因此这些关系适合用继承表示。不能仅仅因为两个类具有几个同名字段就让它们发生继承关系，真正重要的是派生类是否代表基类的一种更具体的类型。例如汽车有发动机，但汽车并不是一种发动机。

:::lang java
```java
class 人员 {
    private String 姓名;

    public String 获取姓名() { return 姓名; }
    public void 设置姓名(String 新值) { 姓名 = 新值; }
}

class 学生 extends 人员 {
    private String 学号;

    public void 设置学号(String 新值) { 学号 = 新值; }
    public String 获取学号() { return 学号; }
    public void 选课(String 课程) {
        System.out.println(获取姓名() + " 选修 " + 课程);
    }
}

class 教师 extends 人员 {
    public void 授课(String 课程) {
        System.out.println(获取姓名() + " 教授 " + 课程);
    }
}

class 主程序 {
    public static void main(String[] args) {
        学生 学生对象 = new 学生();
        学生对象.设置姓名("Anna");
        学生对象.设置学号("ABC123");
        学生对象.选课("OOP");
    }
}
```
:::end

:::lang csharp
```csharp
using System;

class 人员 {
    private string 姓名;
    public string 获取姓名() { return 姓名; }
    public void 设置姓名(string 新值) { 姓名 = 新值; }
}

class 学生 : 人员 {
    private string 学号;
    public void 设置学号(string 新值) { 学号 = 新值; }
    public string 获取学号() { return 学号; }
    public void 选课(string 课程) {
        Console.WriteLine(获取姓名() + " 选修 " + 课程);
    }
}

class 教师 : 人员 {
    public void 授课(string 课程) {
        Console.WriteLine(获取姓名() + " 教授 " + 课程);
    }
}

class 程序 {
    static void 主程序() {
        学生 学生对象 = new 学生();
        学生对象.设置姓名("Anna");
        学生对象.设置学号("ABC123");
        学生对象.选课("OOP");
    }
}
```
:::end

:::lang python
```python
class 人员:
    def 设置姓名(self, 新值):
        self._姓名 = 新值

    def 获取姓名(self):
        return self._姓名

class 学生(人员):
    def 设置学号(self, 新值):
        self._学号 = 新值

    def 获取学号(self):
        return self._学号

    def 选课(self, 课程):
        print(self.获取姓名() + " 选修 " + 课程)

class 教师(人员):
    def 授课(self, 课程):
        print(self.获取姓名() + " 教授 " + 课程)

学生对象 = 学生()
学生对象.设置姓名("Anna")
学生对象.设置学号("ABC123")
学生对象.选课("OOP")
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>

class 人员 {
    std::string 姓名;
public:
    void 设置姓名(const std::string& 新值) { 姓名 = 新值; }
    std::string 获取姓名() const { return 姓名; }
};

class 学生 : public 人员 {
    std::string 学号;
public:
    void 设置学号(const std::string& 新值) { 学号 = 新值; }
    std::string 获取学号() const { return 学号; }
    void 选课(const std::string& 课程) const {
        std::cout << 获取姓名() << " 选修 " << 课程 << '\n';
    }
};

class 教师 : public 人员 {
public:
    void 授课(const std::string& 课程) const {
        std::cout << 获取姓名() << " 教授 " << 课程 << '\n';
    }
};

int main() {
    学生 学生对象;
    学生对象.设置姓名("Anna");
    学生对象.设置学号("ABC123");
    学生对象.选课("OOP");
}
```
:::end

![人员、学生和教师的继承关系](content/chapters/06-oroklodes/media/inheritance-zh.svg){width=640}

## 继承成员及其访问权限 {#inherited-members}

派生类除了能够使用从基类继承的字段和方法外，还可以声明自己的新字段和新方法。在例子中，`学生` 增加了 `学号` 字段和 `选课()` 方法，同时仍然能够使用从 `人员` 继承的 `获取姓名()` 和 `设置姓名()` 方法。构造方法不适用这一简单规则，因为 Java 中的构造方法不会被继承。类级字段和方法也可能从派生类访问，但它们仍然属于类本身，不会因为创建新实例而复制出多份。

我们还应当区分两个问题：基类的数据是否属于派生类对象的内部状态，以及派生类的源代码是否能够直接访问这些数据。`public` 方法既能在派生类中使用，也能从主程序访问；在 Java 中，`protected` 成员可以在同一包内访问，也能按照继承的访问规则供派生类使用。基类中的 `private` 字段仍然存在于对象的内部状态中，但在 Java 中并不是派生类可以直接访问的继承成员，必须通过基类提供的合适方法进行访问。因此，即使继续扩展一个类，我们此前实现的数据隐藏也不会失效。

在下面的示例中，`学生` 可以直接使用继承得到的 `年龄` 字段，却不能直接访问私有的 `姓名` 字段。读取姓名时，需要调用已经从基类继承的公开方法 `获取姓名()`。这样能够继续遵守以前建立的访问规则，与从主程序访问对象时的要求保持一致。在 UML 类图中，继承关系由实线和指向基类的空心三角箭头表示。

:::lang java
```java
class 人员 {
    private String 姓名;
    protected int 年龄;

    public String 获取姓名() { return 姓名; }
    public void 设置姓名(String 新值) { 姓名 = 新值; }
}

class 学生 extends 人员 {
    public String 描述() {
        // 姓名 is private: it cannot be accessed directly here.
        return 获取姓名() + " (" + 年龄 + ")";
    }
}
```
:::end

:::lang csharp
```csharp
class 人员 {
    private string 姓名;
    protected int 年龄;
    public string 获取姓名() { return 姓名; }
    public void 设置姓名(string 新值) { 姓名 = 新值; }
}

class 学生 : 人员 {
    public string 描述() {
        // 姓名 is private: use the inherited getter.
        return 获取姓名() + " (" + 年龄 + ")";
    }
}
```
:::end

:::lang python
```python
class 人员:
    def 设置姓名(self, 新值):
        self.__姓名 = 新值

    def 获取姓名(self):
        return self.__姓名

class 学生(人员):
    def 描述(self):
        # _年龄 is a naming convention, not protected access control.
        return self.获取姓名() + " (" + str(self._年龄) + ")"
```
:::end

:::lang cpp
```cpp
#include <string>

class 人员 {
    std::string 姓名;
protected:
    int 年龄 = 0;
public:
    std::string 获取姓名() const { return 姓名; }
    void 设置姓名(const std::string& 新值) { 姓名 = 新值; }
};

class 学生 : public 人员 {
public:
    std::string 描述() const {
        // 姓名 is private: use the inherited getter.
        return 获取姓名() + " (" + std::to_string(年龄) + ")";
    }
};
```
:::end

![派生类中的可访问性](content/chapters/06-oroklodes/media/visibility-zh.svg){width=430}

## 继承层次结构 {#inheritance-hierarchies}

一个类可以有多个不同的派生类，而已经派生出来的类也可以继续作为其他类的基类。这样就形成了**继承层次结构**，其中较一般的类位于上层，较具体的类位于下层。例如 `奖学金学生` 从 `学生` 派生，因此既能使用学生类中的方法，也能使用从 `人员` 间接继承的方法。借助 UML 类图，我们可以清楚地表示这种多层关系。

在 Java 和 C# 中，一个类最多只能直接继承一个类。C++ 和 Python 还支持**多重继承**，也就是一个类可以同时拥有多个直接基类。下面的示例在四种语言中都采用单继承，以便我们专注于理解继承层次本身。多重继承所带来的其他问题暂时不需要进一步讨论。

在 Java 中，如果一个类没有显式声明父类，它的父类就是 `Object`；而 `Object` 本身是类继承层次结构的根。因此，我们创建的对象还具有以前已经使用过的一些基本操作，例如 `toString()`。在 UML 图中通常不必为每一个类都单独画出 `Object`，否则只会使图变得过于复杂。

:::lang java
```java
class 人员 { public void 问候() { System.out.println("你好！"); } }
class 学生 extends 人员 { public void 选课() { } }
class 奖学金学生 extends 学生 { public void 申请奖学金() { } }
class 教师 extends 人员 { public void 授课() { } }

class 主程序 {
    public static void main(String[] args) {
        奖学金学生 学生对象 = new 奖学金学生();
        学生对象.问候();
        学生对象.选课();
        学生对象.申请奖学金();
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class 人员 { public void 问候() { Console.WriteLine("你好！"); } }
class 学生 : 人员 { public void 选课() { } }
class 奖学金学生 : 学生 { public void 申请奖学金() { } }
class 教师 : 人员 { public void 授课() { } }

class 程序 {
    static void 主程序() {
        奖学金学生 学生对象 = new 奖学金学生();
        学生对象.问候();
        学生对象.选课();
        学生对象.申请奖学金();
    }
}
```
:::end

:::lang python
```python
class 人员:
    def 问候(self):
        print("你好！")

class 学生(人员):
    def 选课(self):
        pass

class 奖学金学生(学生):
    def 申请奖学金(self):
        pass

class 教师(人员):
    def 授课(self):
        pass

学生对象 = 奖学金学生()
学生对象.问候()
学生对象.选课()
学生对象.申请奖学金()
```
:::end

:::lang cpp
```cpp
#include <iostream>

class 人员 {
public:
    void 问候() { std::cout << "Hello!\n"; }
};
class 学生 : public 人员 { public: void 选课() {} };
class 奖学金学生 : public 学生 {
public:
    void 申请奖学金() {}
};
class 教师 : public 人员 { public: void 授课() {} };

int main() {
    奖学金学生 学生对象;
    学生对象.问候();
    学生对象.选课();
    学生对象.申请奖学金();
}
```
:::end

![多层继承结构](content/chapters/06-oroklodes/media/hierarchy-zh.svg){width=630}

## 类型兼容性 {#type-compatibility}

继承带来的一个重要结果是**类型兼容性**。如果 `学生` 继承自 `人员`，那么在需要 `人员` 类型对象的地方，我们也可以使用 `学生` 实例。这是因为每个学生同时也是一个人，能够支持基类提供的操作。然而相反的方向通常并不成立，因为一个人未必是学生。

在 Java 中，编译器允许我们自动将派生类对象赋给兼容的基类类型引用，这称为**向上类型转换（upcasting）**。转换过程中不会创建新对象，我们只是通过一个更一般类型的引用来访问原来的实例。在示例中，变量 `人员对象` 的**声明类型（静态类型）**是 `人员`，而它所引用对象的**实际类型（运行时类型）**是 `学生`。即使对象本身还有其他功能，通过该引用直接调用的成员仍然受到声明类型的限制。

类型兼容性具有**传递性**：如果 `奖学金学生` 继承自 `学生`，而 `学生` 继承自 `人员`，那么 `奖学金学生` 也兼容 `人员`。因此，我们可以编写接收基类参数的通用方法，让同一方法处理不同派生类的实例。也正是因为这一规则，我们能够在 `人员` 类型的数组中同时保存学生和教师。

:::lang java
```java
class 人员 { public void 问候() { } }
class 学生 extends 人员 { public void 选课() { } }

class 主程序 {
    public static void 处理人员(人员 新值) { 新值.问候(); }
    public static void main(String[] args) {
        学生 学生对象 = new 学生();
        处理人员(学生对象);
        人员 人员对象 = 学生对象;      // 自动向上转换为基类类型。
        人员对象.问候();              // Available through 人员.
        // 人员对象.选课();           // Not available through 人员.
        学生 原对象 = (学生) 人员对象; // Safe: the object is 学生.
        原对象.选课();
    }
}
```
:::end

:::lang csharp
```csharp
class 人员 { public void 问候() {} }
class 学生 : 人员 { public void 选课() {} }

class 程序 {
    static void 处理人员(人员 新值) { 新值.问候(); }
    static void 主程序() {
        学生 学生对象 = new 学生();
        处理人员(学生对象);
        人员 人员对象 = 学生对象;        // 向上类型转换。
        人员对象.问候();
        // 人员对象.选课();             // Not available through 人员.
        学生 原对象 = (学生)人员对象;
        原对象.选课();
    }
}
```
:::end

:::lang python
```python
class 人员:
    def 问候(self):
        pass

class 学生(人员):
    def 选课(self):
        pass

def 处理人员(人员对象):
    人员对象.问候()

学生对象 = 学生()
处理人员(学生对象)
人员对象 = 学生对象       # 两个变量引用同一个对象。
人员对象.问候()
人员对象.选课()       # Python 在运行时检查对象。
```
:::end

:::lang cpp
```cpp
class 人员 { public: void 问候() {} };
class 学生 : public 人员 { public: void 选课() {} };

void 处理人员(人员& 新值) { 新值.问候(); }

int main() {
    学生 学生对象;
    处理人员(学生对象);
    人员& 人员对象 = 学生对象;     // Base-class reference to 学生.
    人员对象.问候();
    // 人员对象.选课();           // Not available through 人员.
    学生& 原对象 = static_cast<学生&>(人员对象);
    原对象.选课();           // Safe here: the object is 学生.
}
```
:::end

### 类型转换与类型检查 {#type-casting}

有时我们手中只有一个较一般的基类类型引用，但知道它实际指向某个更具体的派生类对象，并希望调用派生类特有的方法。这时需要进行**向下类型转换（downcasting）**。Java 将目标类型写在括号中，例如 `(学生) 人员对象`。这种转换同样不会创建新对象，只是让我们能够以另一种引用类型访问已经存在的实例。

向下转换只有在实际对象确实属于目标派生类型时才有效。如果类型不匹配，Java 在运行时会抛出 `ClassCastException`，因此对于实际类型不确定的对象，应该先进行类型检查。Java 使用 `instanceof` 运算符判断对象是否与指定类型兼容，并返回布尔值。现代 Java 还支持 `instanceof 学生 学生对象` 形式，它在完成检查的同时声明相应类型的新变量，从而不必再单独编写一次强制转换。

不同语言在这方面存在明显差异。C# 通过 `is` 运算符检查类型，Python 则使用 `isinstance()` 函数，而且调用对象的方法时不需要另外执行类型转换。在 C++ 中，如果基类是多态类，就可以用 `dynamic_cast` 进行运行时类型检查；因此我们的示例给基类声明了一个虚析构函数。这些机制的细节将在以后讨论，现在只需要理解向下转换可能失败，必须先确认其安全性。

:::lang java
```java
class 人员 { }
class 学生 extends 人员 {
    public String 获取学号() { return "ABC123"; }
}

class 主程序 {
    public static void main(String[] args) {
        人员 人员对象 = new 学生();
        if (人员对象 instanceof 学生 学生对象) {
            System.out.println(学生对象.获取学号());
        }
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class 人员 { }
class 学生 : 人员 {
    public string 获取学号() { return "ABC123"; }
}

class 程序 {
    static void 主程序() {
        人员 人员对象 = new 学生();
        if (人员对象 is 学生 学生对象) {
            Console.WriteLine(学生对象.获取学号());
        }
    }
}
```
:::end

:::lang python
```python
class 人员:
    pass

class 学生(人员):
    def 获取学号(self):
        return "ABC123"

人员对象 = 学生()
if isinstance(人员对象, 学生):
    print(人员对象.获取学号())
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>

class 人员 {
public:
    virtual ~人员() = default; // 提供运行时类型检查所需的多态基类。
};
class 学生 : public 人员 {
public:
    std::string 获取学号() const { return "ABC123"; }
};

int main() {
    学生 学生对象;
    人员* 人员对象 = &学生对象;
    if (学生* 结果 = dynamic_cast<学生*>(人员对象)) {
        std::cout << 结果->获取学号() << '\n';
    }
}
```
:::end

### 根据类型筛选对象 {#type-selection}

当我们希望在一个集合中处理多种派生类对象时，类型兼容性就显得尤其重要。例如，我们可以创建 `人员` 类型的数组，并同时放入学生和教师对象，因为它们都与共同的基类兼容。遍历数组时，我们可以对所有元素使用 `人员` 中的方法。如果某项操作只适用于学生，则可以检查元素的实际类型，筛选出符合条件的对象。

在下面的示例中，我们依次检查人员数组的各个元素，只对 `学生` 类型的对象调用 `选课()` 方法。与此同时，还可以统计学生人数，而不需要先把这些对象复制到另一个数组中。这里最重要的是理解：共同的基类使不同类型的对象能够统一保存，而类型检查又允许我们在必要时区分它们。实现这个例子并不需要使用以后才会学习的方法重写。

:::lang java
```java
class 人员 { }
class 学生 extends 人员 {
    public void 选课() { System.out.println("学生"); }
}
class 教师 extends 人员 { }

class 主程序 {
    public static void main(String[] args) {
        人员[] 人员列表 = {new 学生(), new 教师(), new 学生()};
        int 学生数量 = 0;
        for (人员 人员对象 : 人员列表) {
            if (人员对象 instanceof 学生 学生对象) {
                学生对象.选课();
                学生数量++;
            }
        }
        System.out.println(学生数量);
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class 人员 { }
class 学生 : 人员 {
    public void 选课() { Console.WriteLine("学生"); }
}
class 教师 : 人员 { }

class 程序 {
    static void 主程序() {
        人员[] 人员列表 = {new 学生(), new 教师(), new 学生()};
        int 学生数量 = 0;
        foreach (人员 人员对象 in 人员列表) {
            if (人员对象 is 学生 学生对象) {
                学生对象.选课();
                学生数量++;
            }
        }
        Console.WriteLine(学生数量);
    }
}
```
:::end

:::lang python
```python
class 人员:
    pass

class 学生(人员):
    def 选课(self):
        print("学生")

class 教师(人员):
    pass

人员列表 = [学生(), 教师(), 学生()]
学生数量 = 0
for 人员对象 in 人员列表:
    if isinstance(人员对象, 学生):
        人员对象.选课()
        学生数量 += 1
print(学生数量)
```
:::end

:::lang cpp
```cpp
#include <iostream>
class 人员 {
public:
    virtual ~人员() = default;
};
class 学生 : public 人员 {
public:
    void 选课() { std::cout << "学生\n"; }
};
class 教师 : public 人员 { };

int main() {
    学生 第一个, 第二个;
    教师 教师对象;
    人员* 人员列表[] = {&第一个, &教师对象, &第二个};
    int 学生数量 = 0;
    for (人员* 人员对象 : 人员列表) {
        if (学生* 学生对象 = dynamic_cast<学生*>(人员对象)) {
            学生对象->选课();
            学生数量++;
        }
    }
    std::cout << 学生数量 << '\n';
}
```
:::end

## 练习 {#exercises}

本章的练习重点是将公共数据提取到父类中，通过继承建立类之间的关系，并在同一个集合中处理不同类型的对象。每个字段都单独说明其 getter 和 setter 的作用。除非另有规定，setter 收到无效数据时应抛出 `IllegalArgumentException`，且不得修改字段原来的值。

:::exercise
### 矩形

![矩形 – UML](content/chapters/06-oroklodes/media/complete-task-1-zh.svg){width=620}

为之前的 `矩形` 类创建 `图形` 父类，再从这个父类派生一个新的 `圆形` 类。颜色属于两种图形的公共数据，因此只能在父类中保存，不能在子类中重复声明。

**`图形` —— 数据**

- **`颜色 : String`** —— 私有字段，保存图形的颜色。公开的 `获取颜色() : String` 返回当前保存的颜色。`设置颜色(颜色 : String) : void` 不能接受 `null`、空字符串或只有空格的字符串。

**`矩形` —— 数据**

- **`横坐标 : double`** —— 左上角的横坐标，可以是任意实数。私有字段具有公开的 `获取横坐标() : double` 和 `设置横坐标(横坐标 : double) : void`，分别用于读取和修改该坐标。
- **`纵坐标 : double`** —— 左上角的纵坐标，可以是任意实数。`获取纵坐标() : double` 返回已保存的值，`设置纵坐标(纵坐标 : double) : void` 修改该值。本题规定纵轴正方向向上。
- **`宽度 : double`** —— 矩形的宽度，必须严格大于零。`获取宽度() : double` 返回当前宽度；`设置宽度(宽度 : double) : void` 只接受正数。
- **`高度 : double`** —— 矩形的高度，也必须严格大于零。`获取高度() : double` 返回当前高度；`设置高度(高度 : double) : void` 拒绝零和负数。
- **`创建数量 : int`** —— 私有静态计数器，初始值为 `0`。每成功创建一个矩形，恰好增加一次。公开的静态方法 `获取创建数量() : int` 返回累计创建的矩形数量，不提供 setter。

**`矩形` —— 构造方法和其他操作**

`矩形()` 创建左上角为 `(0, 0)`、尺寸为 `1 × 1` 的矩形。`矩形(横坐标 : double, 纵坐标 : double, 宽度 : double, 高度 : double)` 使用给定数据，并检查宽度和高度是否合法。构造方法之间的调用不能使同一个对象被重复计数。

- **`计算面积() : double`** —— 返回宽度和高度的乘积。
- **`计算周长() : double`** —— 返回 `2 × (宽度 + 高度)`。
- **`判断重叠(另一个 : 矩形) : boolean`** —— 只有两个矩形的公共区域具有正面积时才返回 `true`。仅在边或顶点接触不算重叠。
- **`获取象限() : int`** —— 如果整个矩形严格位于某一个象限内部，则返回 `1` 到 `4` 中对应的编号。碰到坐标轴或跨越多个象限时返回 `-1`。

**`圆形` —— 数据和其他操作**

- **`半径 : double`** —— 圆的私有半径，必须严格大于零。`获取半径() : double` 返回保存的半径，`设置半径(半径 : double) : void` 拒绝无效数值。

`计算面积() : double` 返回 `π × 半径²`，`计算周长() : double` 返回 `2 × π × 半径`。它们是 `圆形` 自己的新方法，目前不要在 `图形` 中定义这些方法。

**主程序**

将矩形与圆形一起放入 `ArrayList<图形>`。使用 `instanceof` 选出全部圆形并保存到一个新列表中，然后计算这些圆形的总面积。注意两种子类都通过父类的方法访问颜色。
:::endexercise

:::exercise
### 图书

![图书 – UML](content/chapters/06-oroklodes/media/complete-task-2-zh.svg){width=620}

创建 `出版物` 父类，再从中派生已有的 `图书` 类和新的 `期刊` 类。出版社及出版国家是公共数据，不得在子类中再次声明。

**`出版物` —— 数据**

- **`出版社 : String`** —— 私有字段，保存出版社名称。`获取出版社() : String` 返回当前名称；`设置出版社(出版社 : String) : void` 拒绝 `null` 或空字符串。
- **`国家 : String`** —— 私有字段，保存出版国家的名称。`获取国家() : String` 返回当前值；`设置国家(国家 : String) : void` 拒绝 `null`、空字符串以及仅包含空格的字符串。

**`图书` —— 数据**

- **`作者 : String`** —— 作者姓名。`获取作者() : String` 返回保存的姓名；`设置作者(作者 : String) : void` 要求至少两个字符，并且只允许字母、空格、句点和连字符。
- **`标题 : String`** —— 图书标题。`获取标题() : String` 返回保存的标题；`设置标题(标题 : String) : void` 只接受非 `null`、长度至少为两个字符的字符串。
- **`价格 : int`** —— 以整数福林表示的价格。`获取价格() : int` 返回当前价格；`设置价格(价格 : int) : void` 只允许 `[500; 50000]` 内的值。
- **`类别 : 类别`** —— 枚举类型的图书类别，例如 `传记`、`恐怖`、`戏剧`、`历史`、`科幻` 和 `喜剧`。`获取类别() : 类别` 返回保存的类别；`设置类别(类别 : 类别) : void` 不接受 `null`。
- **`纸质 : boolean`** —— `true` 表示纸质图书，`false` 表示电子书。`是否纸质() : boolean` 返回保存的布尔值；`设置纸质(纸质 : boolean) : void` 无需额外验证即可修改该值。
- **`最低价格 : int` 和 `最高价格 : int`** —— `图书` 类的公开 `static final` 常量，值分别为 `500` 和 `50000`。公开静态方法 `检查价格(价格 : int) : boolean` 判断价格是否位于规定区间内。

**`图书` —— 构造方法和其他操作**

`图书(作者 : String, 标题 : String, 价格 : int, 类别 : 类别, 纸质 : boolean)` 按照上述规则验证并设置图书自身的数据。`图书(作者 : String, 标题 : String, 价格 : int)` 调用完整参数版本，默认类别为 `类别.戏剧`，且默认是纸质图书。父类中的出版社与国家由继承来的 setter 设置。

- **`打折(百分比 : int) : void`** —— 按 `1` 到 `99` 的整数百分比降价，并将结果向下取整到整数福林。百分比无效或降价后低于 `899` 福林时，不得修改原价。
- **`toString() : String`** —— 返回包含图书重要数据、便于阅读的字符串。

**`期刊` —— 数据**

- **`标题 : String`** —— 期刊标题，属于私有字段。`获取标题() : String` 返回保存的标题；`设置标题(标题 : String) : void` 拒绝 `null` 或空字符串。
- **`期号 : int`** —— 正整数期号。`获取期号() : int` 返回保存的期号；`设置期号(期号 : int) : void` 拒绝零和负数。

**主程序**

创建若干图书和期刊，设置它们共同的出版信息，然后放入 `ArrayList<出版物>`。利用类型检查选出期刊，显示每一期刊的标题、期号和出版社。
:::endexercise

:::exercise
### 汽车

![汽车 – UML](content/chapters/06-oroklodes/media/complete-task-3-zh.svg){width=620}

将已有 `汽车` 类的品牌字段移到新的 `交通工具` 父类中，并在父类中增加最高时速。再创建 `摩托车` 子类。子类不得重复定义这些公共字段。

**`交通工具` —— 数据**

- **`品牌 : String`** —— 私有品牌名称。`获取品牌() : String` 返回当前名称；`设置品牌(品牌 : String) : void` 拒绝 `null` 或空字符串。
- **`最高时速 : int`** —— 以 km/h 表示的最大速度，必须是正整数。`获取最高时速() : int` 返回保存的速度；`设置最高时速(最高时速 : int) : void` 拒绝非正数。

**`汽车` —— 数据**

- **`型号 : String`** —— 汽车型号。`获取型号() : String` 返回保存的型号；`设置型号(型号 : String) : void` 只接受非空字符串。
- **`年份 : int`** —— 生产年份，范围为 `[1886; 2100]`。`获取年份() : int` 返回年份；`设置年份(年份 : int) : void` 拒绝超出范围的值。
- **`里程 : int`** —— 整数公里数，不能为负数。`获取里程() : int` 返回当前里程；不允许公开 setter，只有构造方法和 `行驶()` 可以修改它。
- **`编号 : int`** —— 自动分配的正整数对象编号。`获取编号() : int` 返回该编号；编号在对象生命周期中保持不变，不提供 setter。
- **`下个编号 : int`** —— 私有静态字段，初始值为 `1`。每个新的 `汽车` 获得当前编号，然后该值加一。

**`汽车` —— 构造方法和其他操作**

`汽车(品牌 : String, 型号 : String, 年份 : int, 里程 : int)` 验证各参数。`汽车(品牌 : String, 型号 : String, 年份 : int)` 调用前者，并将里程设为 `0`。品牌应通过父类 setter 设置。

- **`行驶(距离 : int) : void`** —— 只允许用正整数公里数增加里程。
- **`toString() : String`** —— 返回包含品牌、型号、生产年份和当前里程的字符串。

**`摩托车` —— 数据**

- **`排量 : int`** —— 发动机排量，单位为 cm³，必须是正整数。`获取排量() : int` 返回当前值；`设置排量(排量 : int) : void` 只接受正数。
- **`边车 : boolean`** —— 表示是否带有边车。`是否带边车() : boolean` 返回保存的布尔值；`设置边车(边车 : boolean) : void` 可用任意布尔值修改。

**主程序**

将汽车和摩托车放入 `ArrayList<交通工具>`。筛选摩托车，统计其中带边车的数量。并展示两种车辆的品牌都能通过父类方法查询。
:::endexercise

:::exercise
### 银行账户

![银行账户 – UML](content/chapters/06-oroklodes/media/complete-task-4-zh.svg){width=620}

创建简单的 `银行账户` 父类，从中派生 `储蓄账户` 和 `企业账户`。两个子类不得重复声明继承来的字段。

**`银行账户` —— 数据**

- **`持有人 : String`** —— 账户持有人的姓名。`获取持有人() : String` 返回保存的姓名；`设置持有人(持有人 : String) : void` 拒绝 `null` 或空字符串。
- **`账号 : String`** —— 账户标识。`获取账号() : String` 返回保存的账号。`设置账号(账号 : String) : void` 只允许第一次有效赋值；设置成功后不能修改。`null` 或空账号必须被拒绝。
- **`余额 : int`** —— 以整数福林表示的余额，初始值为 `0`。`获取余额() : int` 返回当前余额。不得提供公开 setter，只能通过存款和取款操作修改，而且不能为负数。

**`银行账户` —— 其他操作**

- **`存款(金额 : int) : void`** —— 只接受正整数金额，并将其加入余额。
- **`取款(金额 : int) : void`** —— 只能扣除正数且不超过当前余额的金额。金额无效时不得改变余额。

**`储蓄账户` —— 数据**

- **`利率 : double`** —— 年利率，范围为 `[0; 1]`。`获取利率() : double` 返回保存的值；`设置利率(利率 : double) : void` 拒绝区间外的数值。

**`企业账户` —— 数据**

- **`公司名 : String`** —— 公司名称。`获取公司名() : String` 返回保存的名称；`设置公司名(公司名 : String) : void` 只接受非 `null`、非空字符串。

**主程序**

创建两种账户，设置数据并执行存款、取款。将它们放入 `ArrayList<银行账户>`，利用类型检查选出企业账户，显示其持有人、公司名称和余额。
:::endexercise

:::exercise
### 电影

![电影 – UML](content/chapters/06-oroklodes/media/complete-task-5-zh.svg){width=620}

创建 `媒体内容` 父类，再派生 `电影` 与 `剧集`。标题与发行年份属于公共字段，只能在父类中出现一次。

**`媒体内容` —— 数据**

- **`标题 : String`** —— 私有标题。`获取标题() : String` 返回保存的标题；`设置标题(标题 : String) : void` 只接受非 `null`、长度至少为两个字符的字符串。
- **`上映年份 : int`** —— 正整数发行年份。`获取发行年() : int` 返回该值；`设置发行年(上映年份 : int) : void` 拒绝零和负数。

**`电影` —— 数据**

- **`导演 : String`** —— 导演姓名。`获取导演() : String` 返回保存的姓名；`设置导演(导演 : String) : void` 要求非 `null`、至少两个字符，只能包含字母、空格、句点和连字符。
- **`时长 : int`** —— 电影时长，单位为分钟，必须在 `[10; 360]` 内。`获取时长() : int` 返回保存的时长；`设置时长(时长 : int) : void` 拒绝区间外的值。

**`剧集` —— 数据**

- **`季数 : int`** —— 已制作的季数，必须是正整数。`获取季数() : int` 返回保存的值；`设置季数(季数 : int) : void` 只接受正数。

**主程序**

创建若干电影和剧集，并将它们保存在 `ArrayList<媒体内容>` 中。利用类型检查选出剧集，显示每个剧集的标题、发行年份以及季数。
:::endexercise
