# 绑定——早期绑定与后期绑定

## 绑定的概念 {#binding}

在此前的示例中，当我们调用一个方法时，通常可以很容易地判断出程序将执行哪一个方法体。学习继承之后，情况就不一定这么简单了，因为父类与子类中可能存在名称相同的方法，仅凭方法名已经不足以判断实际执行的实现。对于每一次方法调用，程序都需要确定与之对应的具体方法，并执行其中的指令。将方法调用与实际执行的方法关联起来的过程称为**绑定（binding）**。

有些绑定在程序编译时就可以完成，我们称之为**早期绑定**；而对于另一些方法，只有在程序运行时才能决定应当执行哪一个实现，这种情况称为**后期绑定**。当我们使用父类类型的引用来访问实际上属于子类的对象时，两种绑定方式的区别就显得特别重要。前面已经学习过，引用的声明类型与其指向对象的实际类型可以不同；本节将进一步分析这一差别对方法调用的影响。

## 方法重写 {#overriding}

假设我们已经创建了一个 `人员` 类，用来保存人的基本信息，并通过 `获取身份()` 方法返回这个人的身份。对于从中派生的 `学生` 和 `教师` 类，这个问题的答案自然不同。由于三个类中的方法具有相同的含义，我们没有必要为它们分别起不同的名字，只需要按照实际类型改变方法的实现即可。此时可以在子类中**重写**父类的方法，保留相同的方法名以及符合要求的参数列表，但重新编写方法体。

在 Java 中，建议在重写的方法前添加 `@Override` 注解。这样编译器就可以检查父类中是否确实存在能够被重写的方法，从而帮助我们及时发现方法名拼写错误等问题。重写后的方法不能降低原方法的可见性，返回值类型也必须满足相应的兼容性规则。在本例中，三个方法都返回 `String` 类型，因此暂时不需要讨论这些更细的规则。

:::lang java
```java
class 人员 {
    public String 获取身份() {
        return "人员";
    }
}

class 学生 extends 人员 {
    @Override
    public String 获取身份() {
        return "学生";
    }
}

class 教师 extends 人员 {
    @Override
    public String 获取身份() {
        return "教师";
    }
}
```
:::end

:::lang csharp
```csharp
class 人员 {
    public virtual string 获取身份() {
        return "人员";
    }
}

class 学生 : 人员 {
    public override string 获取身份() {
        return "学生";
    }
}

class 教师 : 人员 {
    public override string 获取身份() {
        return "教师";
    }
}
```
:::end

:::lang python
```python
class 人员:
    def 获取身份(self):
        return "人员"

class 学生(人员):
    def 获取身份(self):
        return "学生"

class 教师(人员):
    def 获取身份(self):
        return "教师"
```
:::end

:::lang cpp
```cpp
#include <string>

class 人员 {
public:
    virtual std::string 获取身份() const {
        return "人员";
    }
};

class 学生 : public 人员 {
public:
    std::string 获取身份() const override {
        return "学生";
    }
};

class 教师 : public 人员 {
public:
    std::string 获取身份() const override {
        return "教师";
    }
};
```
:::end

![人员、学生和教师的身份方法](content/chapters/07-kotes/media/roles-zh.svg){width=590}

需要注意，**方法重写**与**方法重载（overloading）**并不是同一回事。如果在同一个类或一个继承层次中，几个方法的名称相同，但参数列表不同，那么它们就是不同的方法。例如，`注册()` 与 `注册(String 课程名)` 的参数列表不同，因此不是同一个方法的两个重写版本。编译器会根据调用时提供的实参及其类型选择相应的重载方法。在 Java 中，仅仅改变返回值类型不足以构成方法重载。

:::lang java
```java
class 学生 extends 人员 {
    public void 注册() {
        System.out.println("开始注册");
    }

    public void 注册(String 课程对象) {
        System.out.println("已注册课程：" + 课程对象);
    }
}

class 主程序 {
    public static void main(String[] args) {
        学生 学生对象 = new 学生();
        学生对象.注册();
        学生对象.注册("面向对象");
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class 人员 { }
class 学生 : 人员 {
    public void 注册() {
        Console.WriteLine("开始注册");
    }
    public void 注册(string 课程对象) {
        Console.WriteLine("已注册课程：" + 课程对象);
    }
}
class 程序 {
    static void Main() {
        学生 学生对象 = new 学生();
        学生对象.注册();
        学生对象.注册("面向对象");
    }
}
```
:::end

:::lang python
```python
class 学生(人员):
    # Python does not overload methods by parameter 列表.
    def 注册(self, 课程对象=None):
        if 课程对象 is None:
            print("开始注册")
        else:
            print("已注册课程：" + 课程对象)

学生对象 = 学生()
学生对象.注册()
学生对象.注册("面向对象")
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>
class 人员 { };
class 学生 : public 人员 {
public:
    void 注册课程() const {
        std::cout << "Registration started\n";
    }
    void 注册课程(const std::string& 课程对象) const {
        std::cout << "已注册课程：" << 课程对象 << '\n';
    }
};

int main() {
    学生 学生对象;
    学生对象.注册课程();
    学生对象.注册课程("面向对象");
}
```
:::end

## 后期绑定 {#late-binding}

为了理解后期绑定，我们为 `人员` 类添加一个 `介绍自己()` 方法，用于输出姓名和身份。这个方法内部调用已经定义的 `获取身份()`，因此 `介绍自己()` 的实现只需要在父类中编写一次。`学生` 和 `教师` 可以直接继承它，而各自在自己的类中重写 `获取身份()`。现在的问题是，当学生或教师对象调用继承来的 `介绍自己()` 时，它内部究竟会执行哪一个类的 `获取身份()` 方法？

在 Java 中，可重写的实例方法采用**后期绑定**。这意味着程序运行时会根据对象的实际类型，选择最终执行的方法体。尽管 `介绍自己()` 是在 `人员` 类中实现的，其中的 `获取身份()` 调用在学生对象上会执行 `学生.获取身份()`，在教师对象上则会执行 `教师.获取身份()`。因此，后期绑定允许父类中的通用算法直接使用子类提供的具体实现，而不必为每一种子类重新编写同样的算法。

:::lang java
```java
class 人员 {
    private String 姓名;

    public void 设置姓名(String 新值) { 姓名 = 新值; }
    public String 获取姓名() { return 姓名; }

    public String 获取身份() { return "人员"; }

    public void 介绍自己() {
        System.out.println(姓名 + " 是 " + 获取身份());
    }
}

class 学生 extends 人员 {
    @Override
    public String 获取身份() { return "学生"; }
}

class 教师 extends 人员 {
    @Override
    public String 获取身份() { return "教师"; }
}

class 主程序 {
    public static void main(String[] args) {
        人员[] 人员集合 = {new 学生(), new 教师()};
        人员集合[0].设置姓名("Anna");
        人员集合[1].设置姓名("Peter");

        for (人员 人员对象 : 人员集合) {
            人员对象.介绍自己();
        }
        // Anna is a 学生对象
        // Peter is a 教师对象
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class 人员 {
    private string 姓名;
    public void 设置姓名(string 新值) { 姓名 = 新值; }
    public virtual string 获取身份() { return "人员"; }
    public void 介绍自己() {
        Console.WriteLine(姓名 + " 是 " + 获取身份());
    }
}
class 学生 : 人员 {
    public override string 获取身份() { return "学生"; }
}
class 教师 : 人员 {
    public override string 获取身份() { return "教师"; }
}
class 程序 {
    static void Main() {
        人员[] 人员集合 = {new 学生(), new 教师()};
        人员集合[0].设置姓名("Anna");
        人员集合[1].设置姓名("Peter");
        foreach (人员 人员对象 in 人员集合)
            人员对象.介绍自己();
    }
}
```
:::end

:::lang python
```python
class 人员:
    def 设置姓名(self, 新值):
        self._姓名 = 新值

    def 获取身份(self):
        return "人员"

    def 介绍自己(self):
        print(self._姓名 + " 是 " + self.获取身份())

class 学生(人员):
    def 获取身份(self):
        return "学生"

class 教师(人员):
    def 获取身份(self):
        return "教师"

人员集合 = [学生(), 教师()]
人员集合[0].设置姓名("Anna")
人员集合[1].设置姓名("Peter")
for 人员对象 in 人员集合:
    人员对象.介绍自己()
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
    virtual std::string 获取身份() const { return "人员"; }
    void 介绍自己() const {
        std::cout << 姓名 << " 是 " << 获取身份() << '\n';
    }
};
class 学生 : public 人员 {
public:
    std::string 获取身份() const override { return "学生"; }
};
class 教师 : public 人员 {
public:
    std::string 获取身份() const override { return "教师"; }
};

int main() {
    学生 学生对象;
    教师 教师对象;
    学生对象.设置姓名("Anna");
    教师对象.设置姓名("Peter");
    人员* 人员集合[] = {&学生对象, &教师对象};
    for (人员* 人员对象 : 人员集合)
        人员对象->介绍自己();
}
```
:::end

![介绍自己与获取身份的方法调用关系](content/chapters/07-kotes/media/dispatch-zh.svg){width=620}

从示例中还可以看出，`人员` 类型的数组能够保存指向不同子类对象的引用。循环中 `人员对象` 的声明类型始终是 `人员`，但它实际指向的对象可能是 `学生`，也可能是 `教师`。编译器根据声明类型检查 `人员对象.介绍自己()` 是否为合法调用，而其中 `获取身份()` 的重写版本直到运行时才被选定。这正是**多态**最重要的基础之一：我们能够使用同一套算法处理不同类型的对象，而不需要为每种类型分别编写条件判断。

## 调用父类的方法 {#super-call}

重写方法时，并不一定要丢弃父类中已经实现的算法。很多时候，原来的实现已经满足大部分要求，我们只需要在此基础上增加少量功能即可。假设 `人员` 的 `获取描述()` 返回姓名，而在 `学生` 中我们还希望显示学号。我们没有必要重新编写姓名的获取过程，因为 Java 提供了 `super` 关键字，可以先调用父类中的方法，再对返回的结果进行补充。

`super.获取描述()` 明确调用父类中的实现，而 `获取描述()` 或 `this.获取描述()` 则可能使用正常的后期绑定。两者不能混淆：如果一个重写方法在自身的方法体中再次调用自己，就可能产生无限递归。C# 使用 `base`，C++ 使用父类名和 `::` 运算符，Python 则使用 `super()` 实现同样的目的。

:::lang java
```java
class 人员 {
    private String 姓名;
    public void 设置姓名(String 新值) { 姓名 = 新值; }
    public String 获取描述() { return 姓名; }
}

class 学生 extends 人员 {
    private String 学号;
    public void 设置学号(String 新值) { 学号 = 新值; }

    @Override
    public String 获取描述() {
        return super.获取描述() + " (" + 学号 + ")";
    }
}
```
:::end

:::lang csharp
```csharp
class 人员 {
    private string 姓名;
    public void 设置姓名(string 新值) { 姓名 = 新值; }
    public virtual string GetDescription() { return 姓名; }
}
class 学生 : 人员 {
    private string 学号;
    public void SetStudentId(string 新值) { 学号 = 新值; }
    public override string GetDescription() {
        return base.GetDescription() + " (" + 学号 + ")";
    }
}
```
:::end

:::lang python
```python
class 人员:
    def 设置姓名(self, 新值):
        self._姓名 = 新值

    def 获取描述(self):
        return self._姓名

class 学生(人员):
    def 设置学号(self, 新值):
        self._学号 = 新值

    def 获取描述(self):
        return super().获取描述() + " (" + self._学号 + ")"
```
:::end

:::lang cpp
```cpp
#include <string>
class 人员 {
    std::string 姓名;
public:
    void 设置姓名(const std::string& 新值) { 姓名 = 新值; }
    virtual std::string 获取描述() const { return 姓名; }
};
class 学生 : public 人员 {
    std::string 学号;
public:
    void 设置学号(const std::string& 新值) { 学号 = 新值; }
    std::string 获取描述() const override {
        return 人员::获取描述() + " (" + 学号 + ")";
    }
};
```
:::end

## 早期绑定 {#early-binding}

后期绑定非常有用，但并不是每个方法调用都需要等到运行时才能决定执行哪一个实现。如果编译阶段就能够确定调用对应的方法，我们将其称为**早期绑定**。Java 的类级方法就是一个很好的例子，因为它属于类，而不是某个具体对象。Java 中的 `private` 和 `final` 方法也不会通过普通的方法重写进行后期分派，不过它们的具体限制将在其他主题中进一步介绍。

在下面的示例中，`学生` 声明了一个与 `人员` 同名的类级方法。在 Java 中，这种情况不是方法重写，而是对父类方法的**隐藏（method hiding）**。调用 `人员.获取类别()` 和 `学生.获取类别()` 时，我们已经明确指出要使用哪一个类的方法。这也是为什么调用类级方法时，应当使用类名，而不是某个实例的引用。

:::lang java
```java
class 人员 {
    public static String 获取类别() {
        return "人员";
    }
}
class 学生 extends 人员 {
    public static String 获取类别() {
        return "学生";
    }
}
class 主程序 {
    public static void main(String[] args) {
        System.out.println(人员.获取类别());  // 人员对象
        System.out.println(学生.获取类别()); // 学生对象
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class 人员 {
    public static string 获取类别() { return "人员"; }
}
class 学生 : 人员 {
    public new static string 获取类别() { return "学生"; }
}
class 程序 {
    static void Main() {
        Console.WriteLine(人员.获取类别());  // 人员对象
        Console.WriteLine(学生.获取类别()); // 学生对象
    }
}
```
:::end

:::lang python
```python
class 人员:
    @staticmethod
    def 获取类别():
        return "人员"

class 学生(人员):
    @staticmethod
    def 获取类别():
        return "学生"

print(人员.获取类别())   # 人员对象
print(学生.获取类别())  # 学生对象
# Python resolves attributes dynamically; this is not Java-style static binding.
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>
class 人员 {
public:
    static std::string 获取类别() { return "人员"; }
};
class 学生 : public 人员 {
public:
    static std::string 获取类别() { return "学生"; }
};
int main() {
    std::cout << 人员::获取类别() << '\n';  // 人员对象
    std::cout << 学生::获取类别() << '\n'; // 学生对象
}
```
:::end

不同编程语言在这一点上存在重要差别。在 Java 中，可重写的实例方法默认采用后期绑定；而在 C# 中，父类方法需要使用 `virtual`，子类方法需要使用 `override`。C++ 也通过 `virtual` 支持虚方法调用，Python 则利用动态属性查找来选择方法的实现。因此，Python 的 `@staticmethod` 与 Java 的静态方法并不完全相同。这里的代码采用各语言自然的写法，并不意味着其每个细节都具有相同的行为。

继承层次中不仅方法可能被隐藏，字段也可能出现名称相同的情况。但是，**Java 实例字段的访问不采用后期绑定**。如果子类声明了与父类同名的字段，父类字段并不会消失，最终访问哪一个字段取决于引用的声明类型和访问规则。为了避免程序变得难以理解，通常不建议在父类与子类中重复使用相同的字段名。因此，我们主要通过方法重写来利用后期绑定的优点。

## 后期绑定的应用 {#applications}

前一章已经学习过，可以把不同子类对象的引用保存在同一个父类类型的数组中，并在必要时检查各对象的实际类型。借助后期绑定，在许多情况下就不再需要针对每一种类型编写不同的条件分支。只要各子类提供相同的操作，并根据自己的特点实现它即可。例如，遍历 `人员` 数组时，可以对所有元素调用 `介绍自己()`，而得到的结果则取决于各元素所指向对象的实际类型。

后期绑定不仅适用于我们自己编写的方法，也适用于从 Java 所有类的共同父类 `Object` 继承的方法。此前已经接触过其中的一部分，现在将进一步说明为什么需要重写这些方法，以及如何利用它们完成对象的字符串表示、相等性比较和集合中的查找。

## 从 Object 继承的方法 {#object-methods}

前面已经介绍过，在 Java 中，所有类最终都继承自 `Object`，即使我们没有在类的声明中明确写出这一点。因此，每个对象都具有 `Object` 提供的方法，其中 `toString()`、`equals()` 和 `hashCode()` 尤其常用。我们可以重写这些方法，让它们按照自己定义的类的特点工作，而不是使用通用的默认实现。我们此前已经利用 `toString()` 输出过对象的数据，现在再来了解对象之间的相等性比较，以及哈希码的生成。

`toString()` 方法用于返回对象的字符串表示。如果没有重写它，继承自 `Object` 的默认实现通常会返回包含类名及一段十六进制哈希码表示的字符串，这并不适合直接展示对象的实际数据。因此，我们通常将对象最重要的字段组合成一个字符串并返回。当我们把对象传给 `System.out.println()` 时，Java 会在需要时调用它的 `toString()`；由于采用了后期绑定，最终执行的是对象实际类型中对应的重写版本。

:::lang java
```java
class 课程 {
    private String 编号;
    private String 标题;

    public 课程(String 编号, String 标题) {
        this.编号 = 编号;
        this.标题 = 标题;
    }

    @Override
    public String toString() {
        return 编号 + ": " + 标题;
    }
}

class 主程序 {
    public static void main(String[] args) {
        课程 课程对象 = new 课程("OOP101", "面向对象程序设计");
        System.out.println(课程对象);
    }
}
```
:::end

:::lang csharp
```csharp
using System;
class 课程 {
    private string 编号, 标题;
    public 课程(string 编号, string 标题) {
        this.编号 = 编号;
        this.标题 = 标题;
    }
    public override string ToString() {
        return 编号 + ": " + 标题;
    }
}
class 程序 {
    static void Main() {
        课程 课程对象 = new 课程("OOP101", "面向对象程序设计");
        Console.WriteLine(课程对象);
    }
}
```
:::end

:::lang python
```python
class 课程:
    def __init__(self, 编号, 标题):
        self.编号 = 编号
        self.标题 = 标题

    def __str__(self):
        return self.编号 + ": " + self.标题

课程对象 = 课程("OOP101", "面向对象程序设计")
print(课程对象)
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>
class 课程 {
    std::string 编号, 标题;
public:
    课程(std::string 编号, std::string 标题)
        : 编号(编号), 标题(标题) { }
    std::string toString() const {
        return 编号 + ": " + 标题;
    }
};
int main() {
    课程 课程对象("OOP101", "面向对象程序设计");
    std::cout << 课程对象.toString() << '\n';
}
```
:::end

`equals(Object obj)` 方法用于判断两个对象是否应当被视为相等。`Object` 的默认实现比较的是对象的身份，也就是说，只有两个引用指向同一个对象时才返回 `true`。但是，很多情况下，即使是两个不同的对象，只要某项重要数据相同，我们也希望将它们视为相等。例如，对于 `课程` 类，可以规定只要课程编号相同，就认为两门课程是同一门课程，而不必要求它们是同一个实例。

重写 `equals()` 时，需要保证对象与自身比较时结果为真，交换比较双方的顺序不会影响结果，并且多个对象之间的比较仍然保持一致。与 `null` 比较必须返回 `false`；只要参与比较的数据没有发生变化，结果也不应改变。在当前示例中，课程编号通过构造方法设置，之后不能再修改，因此用于判断相等性的依据始终保持不变。

`Object` 还提供了一个重要方法 `hashCode()`，它为对象计算一个整数，哈希集合主要利用这个整数来提高查找效率。我们必须遵守一条规则：**如果两个对象通过 `equals()` 比较的结果为相等，那么它们的 `hashCode()` 必须返回相同的值**。反过来则不一定成立，不同对象也可能出现相同的哈希码。因此，重写 `equals()` 时通常也要重写 `hashCode()`，并且两者应当使用相同的关键数据作为判断依据。

:::lang java
```java
import java.util.ArrayList;
import java.util.HashSet;

class 课程 {
    private final String 编号;
    private String 标题;

    public 课程(String 编号, String 标题) {
        if (编号 == null || 编号.isEmpty())
            throw new IllegalArgumentException("Invalid 课程对象 编号");
        this.编号 = 编号;
        this.标题 = 标题;
    }

    @Override
    public String toString() {
        return 编号 + ": " + 标题;
    }

    @Override
    public boolean equals(Object 对象) {
        if (this == 对象) return true;
        if (对象 == null || getClass() != 对象.getClass()) return false;
        课程 另一对象 = (课程) 对象;
        return 编号.equals(另一对象.编号);
    }

    @Override
    public int hashCode() {
        return 编号.hashCode();
    }
}

class 主程序 {
    public static void main(String[] args) {
        课程 课程甲 = new 课程("OOP101", "面向对象");
        课程 课程乙 = new 课程("OOP101", "面向对象程序设计");
        System.out.println(课程甲.equals(课程乙)); // true

        ArrayList<课程> 列表 = new ArrayList<>();
        列表.add(课程甲);
        System.out.println(列表.contains(课程乙)); // true

        HashSet<课程> 集合 = new HashSet<>();
        集合.add(课程甲);
        System.out.println(集合.contains(课程乙)); // true
    }
}
```
:::end

:::lang csharp
```csharp
using System;
using System.Collections.Generic;
class 课程 {
    private readonly string 编号;
    private string 标题;
    public 课程(string 编号, string 标题) {
        if (string.IsNullOrEmpty(编号))
            throw new ArgumentException("Invalid 课程对象 编号");
        this.编号 = 编号;
        this.标题 = 标题;
    }
    public override string ToString() { return 编号 + ": " + 标题; }
    public override bool Equals(object 对象) {
        课程 另一对象 = 对象 as 课程;
        return 另一对象 != null && GetType() == 另一对象.GetType()
            && 编号 == 另一对象.编号;
    }
    public override int GetHashCode() { return 编号.GetHashCode(); }
}
class 程序 {
    static void Main() {
        课程 课程甲 = new 课程("OOP101", "面向对象");
        课程 课程乙 = new 课程("OOP101", "面向对象程序设计");
        Console.WriteLine(课程甲.Equals(课程乙)); // True
        var 列表 = new List<课程> { 课程甲 };
        Console.WriteLine(列表.Contains(课程乙)); // True
        var 集合 = new HashSet<课程> { 课程甲 };
        Console.WriteLine(集合.Contains(课程乙)); // True
    }
}
```
:::end

:::lang python
```python
class 课程:
    def __init__(self, 编号, 标题):
        if not 编号:
            raise ValueError("Invalid 课程对象 编号")
        self._编号 = 编号
        self.标题 = 标题

    def __str__(self):
        return self._编号 + ": " + self.标题

    def __eq__(self, 另一对象):
        return type(self) is type(另一对象) and self._编号 == 另一对象._编号

    def __hash__(self):
        return hash(self._编号)

课程甲 = 课程("OOP101", "面向对象")
课程乙 = 课程("OOP101", "面向对象程序设计")
print(课程甲 == 课程乙)     # True
print(课程乙 in [课程甲])   # True
print(课程乙 in {课程甲})   # True
```
:::end

:::lang cpp
```cpp
#include <iostream>
#include <string>
#include <unordered_set>
#include <functional>
class 课程 {
    const std::string 编号;
    std::string 标题;
public:
    课程(std::string 编号, std::string 标题)
        : 编号(编号), 标题(标题) { }
    std::string toString() const { return 编号 + ": " + 标题; }
    bool operator==(const 课程& 另一对象) const { return 编号 == 另一对象.编号; }
    const std::string& 获取编号() const { return 编号; }
};
struct 课程哈希 {
    std::size_t operator()(const 课程& 课程对象) const {
        return std::hash<std::string>{}(课程对象.获取编号());
    }
};
int main() {
    课程 课程甲("OOP101", "面向对象");
    课程 课程乙("OOP101", "面向对象程序设计");
    std::cout << (课程甲 == 课程乙) << '\n';
    std::unordered_set<课程, 课程哈希> 课程集合;
    课程集合.insert(课程甲);
    std::cout << (课程集合.find(课程乙) != 课程集合.end()) << '\n';
}
```
:::end

![Object 继承与重写的方法](content/chapters/07-kotes/media/object-methods-zh.svg){width=510}

使用前面介绍过的容器类时，我们经常需要判断某个对象是否已经保存在集合中。Java 的 `ArrayList.contains()` 使用 `equals()` 比较元素，`HashSet.contains()` 则还会借助 `hashCode()` 查找可能匹配的元素，再通过 `equals()` 检查是否相等。上面的示例创建了两个不同的 `课程` 对象，但它们具有相同的课程编号，因此两个集合都可以识别出这个相等的元素。如果 `hashCode()` 和 `equals()` 的行为不一致，基于哈希码的集合就可能给出错误的结果。

Java 中的方法名称是 `hashCode()`，而 C# 中对应的方法名为 `GetHashCode()`。Python 使用 `__str__()`、`__eq__()` 和 `__hash__()` 这些特殊方法，C++ 通常使用自定义方法或运算符实现字符串表示和相等性比较。尽管语言的语法不同，但只要使用基于哈希码的容器，就必须保证被视为相等的对象具有相同的哈希码。

## 练习 {#exercises}

下面的练习继续使用上一章建立的类层次结构。我们的任务是根据子类自身的特点修改父类已有的操作，同时通过共同父类的引用统一调用这些方法。练习的难度将逐步增加：先练习简单的方法重写，再调用父类中的实现，最后观察继承来的算法内部如何通过后期绑定执行正确的方法。

:::exercise
### 矩形

![图形、矩形与圆形的描述方法](content/chapters/07-kotes/media/task-rectangle-zh.svg){width=530}

在上一章创建的 `图形` 父类中添加 `获取描述()` 方法，使它返回图形的颜色。在 `矩形` 和 `圆形` 中重写该方法，让结果除了颜色之外，还包含矩形的宽度和高度，或者圆的半径。在子类中应当调用父类的 `获取描述()` 来获得颜色，而不是重新编写相同的代码。在主程序中建立 `图形` 类型的数组，保存多个不同的图形对象，并使用一个循环输出所有图形的描述。
:::endexercise

:::exercise
### 图书

![出版物、图书与杂志的摘要方法](content/chapters/07-kotes/media/task-book-zh.svg){width=560}

在 `出版物` 类中实现 `获取摘要()`，返回出版社名称和出版国家。在 `图书` 类中重写该方法，使结果还包含书名和作者；在 `杂志` 类中则增加卷号和期号。两个子类都应当通过调用父类的方法获取共同信息。建立一个 `出版物` 类型的数组，保存多种出版物，然后逐一调用 `获取摘要()`，观察实际执行的方法。
:::endexercise

:::exercise
### 汽车

![车辆续航计算](content/chapters/07-kotes/media/task-car-zh.svg){width=550}

在 `交通工具` 类中实现 `获取续航()`，使其默认返回 `0`。在 `汽车` 类中，根据油箱容量与百公里平均油耗计算预计行驶距离；在 `摩托车` 类中使用自己的油箱容量和耗油量进行计算。重写时不要改变方法名和参数列表，只修改方法体。主程序使用一个 `交通工具` 类型的数组保存不同车辆，并且不进行类型检查，直接输出每辆车的预计续航距离。还应当确保平均油耗不能被设置为零或负数。
:::endexercise

:::exercise
### 银行账户

![银行账户层次中的月费方法](content/chapters/07-kotes/media/task-bank-zh.svg){width=610}

在 `银行账户` 中添加 `获取月费()`，默认返回 `0`。在 `储蓄账户` 和 `企业账户` 中重写该方法，使储蓄账户不收取月费，而企业账户每月收取 2500 福林。然后在父类中实现 `计算扣费后余额()`，从当前余额中减去 `获取月费()` 的返回值，但不直接修改账户余额。主程序创建两种账户的若干对象，通过 `银行账户` 类型的引用调用 `计算扣费后余额()`。观察继承来的方法究竟使用了父类还是子类的月费计算方式。
:::endexercise

:::exercise
### 电影

![媒体内容的描述方法](content/chapters/07-kotes/media/task-film-zh.svg){width=590}

在 `媒体内容` 中实现 `获取描述()`，返回包含作品标题和发行年份的字符串。`电影` 中的重写版本应当增加影片时长，`剧集` 中的重写版本应当增加季数。在父类中添加 `输出描述()`，输出 `获取描述()` 所返回的字符串。使用一个 `媒体内容` 类型的数组保存电影和剧集，每个元素只调用 `输出描述()`。最后，在 `电影` 中再添加一个接收布尔参数的 `获取描述(boolean 详细)` 方法，并比较方法重载与重写的区别。
:::endexercise
