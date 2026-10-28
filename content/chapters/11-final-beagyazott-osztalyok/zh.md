# 嵌套类与 final 类

设计类时，我们不仅要决定它应保存哪些数据、实现哪些方法，还必须考虑其他类能够怎样使用它们。有些辅助类只是为了支持另一个类的内部工作，将它作为独立、公开的类型并没有实际意义。另一些情况下，某个类或方法已经完整规定了需要的行为，我们反而希望阻止后续程序通过继承改变它。

这两个目标看起来不同，但实际上都在限制和保护程序的结构。**嵌套类**允许我们把辅助类型放在真正需要它的位置，并控制其他代码是否能够访问它。Java 的 **`final`** 则可以禁止一个类继续派生子类，或禁止子类重写指定方法；在字段上使用该关键字时，它限制的是重新赋值。这些约束由编译器检查，而不仅是程序员之间的约定。

## 嵌套类 {#nested}

在 Java 中，我们可以在一个类的声明内部再声明另一个类，这种类型称为**嵌套类**。当一个辅助类型与外部类的职责紧密相关、在其他地方没有独立用途时，这种设计尤其合适。例如，容器类可以为每本书保存对应的借阅信息。图书馆的内部实现需要 `借阅记录` 这个类型，但主程序不需要直接使用它。

如果把嵌套类声明为 `private`，其他类就不能直接引用这种类型或创建其实例。外部类自身仍可使用这个辅助类，并通过公开的方法向主程序提供必要操作。因此，嵌套并不是代替数据隐藏，而是帮助我们避免将内部实现细节暴露为公共接口。

下面的 `图书馆` 类使用私有的静态嵌套类 `借阅记录`。每条记录保存图书编号和借阅天数，而用户只能请求添加借阅记录或统计逾期记录。容器不会直接返回可修改的内部列表，因此记录的管理权限仍由 `图书馆` 控制。

:::lang java
```java
import java.util.ArrayList;

class 图书馆 {
    private static class 借阅记录 {
        private final String 图书编号;
        private final int 借阅天数;

        private 借阅记录(String 图书编号, int 借阅天数) {
            this.图书编号 = 图书编号;
            this.借阅天数 = 借阅天数;
        }
    }

    private final ArrayList<借阅记录> 借阅列表 = new ArrayList<>();

    public void 添加借阅(String 图书编号, int 借阅天数) {
        if (图书编号 == null || 图书编号.isBlank() || 借阅天数 < 0)
            throw new IllegalArgumentException("Invalid 借阅项");
        借阅列表.add(new 借阅记录(图书编号, 借阅天数));
    }

    public int 统计逾期(int 允许天数) {
        if (允许天数 < 0)
            throw new IllegalArgumentException("天数限制无效");
        int 数量 = 0;
        for (借阅记录 借阅项 : 借阅列表)
            if (借阅项.借阅天数 > 允许天数) 数量++;
        return 数量;
    }
}
```
:::end
:::lang csharp
```csharp
using System;
using System.Collections.Generic;

class 图书馆 {
    private class 借阅记录 {
        public string 图书编号 { get; }
        public int 借阅天数 { get; }

        public 借阅记录(string 图书编号, int 借阅天数) {
            图书编号 = 图书编号;
            借阅天数 = 借阅天数;
        }
    }

    private readonly List<借阅记录> 借阅列表 = new();

    public void 添加借阅(string 图书编号, int 借阅天数) {
        if (string.IsNullOrWhiteSpace(图书编号) || 借阅天数 < 0)
            throw new ArgumentException("Invalid 借阅项");
        借阅列表.Add(new 借阅记录(图书编号, 借阅天数));
    }

    public int 统计逾期(int 允许天数) {
        if (允许天数 < 0) throw new ArgumentException("天数限制无效");
        int 数量 = 0;
        foreach (借阅记录 借阅项 in 借阅列表)
            if (借阅项.借阅天数 > 允许天数) 数量++;
        return 数量;
    }
}
```
:::end
:::lang python
```python
class 图书馆:
    class _借阅记录:
        def __init__(self, 图书编号, 借阅天数):
            self.图书编号 = 图书编号
            self.借阅天数 = 借阅天数

    def __init__(self):
        self._借阅列表 = []

    def 添加借阅(self, 图书编号, 借阅天数):
        if not 图书编号 or not 图书编号.strip() or 借阅天数 < 0:
            raise ValueError("Invalid 借阅项")
        self._借阅列表.append(self._借阅记录(图书编号, 借阅天数))

    def 统计逾期(self, 允许天数):
        if 允许天数 < 0:
            raise ValueError("天数限制无效")
        return sum(借阅项.借阅天数 > 允许天数 for 借阅项 in self._借阅列表)
```
:::end
:::lang cpp
```cpp
#include <string>
#include <vector>
#include <stdexcept>

class 图书馆 {
    struct 借阅记录 {
        std::string 图书编号;
        int 借阅天数;
    };

    std::vector<借阅记录> 借阅列表;
public:
    void 添加借阅(const std::string& 图书编号, int 借阅天数) {
        if (图书编号.empty() || 借阅天数 < 0)
            throw std::invalid_argument("Invalid 借阅项");
        借阅列表.push_back({图书编号, 借阅天数});
    }

    int 统计逾期(int 允许天数) const {
        if (允许天数 < 0)
            throw std::invalid_argument("天数限制无效");
        int 数量 = 0;
        for (const 借阅记录& 借阅项 : 借阅列表)
            if (借阅项.借阅天数 > 允许天数) ++数量;
        return 数量;
    }
};
```
:::end

![嵌套辅助类 UML](content/chapters/11-final-beagyazott-osztalyok/media/library-zh.svg){width=650}

在 Java 中，`static` 表示 `借阅记录` 实例不会自动关联某个具体的 `图书馆` 对象。外部类的有关代码可以创建这种内部类型的实例，而不需要为它提供外部对象引用。静态嵌套类可以直接访问外部类的静态成员，却不能不通过对象引用就访问外部类的实例成员。这适合那些仅用于保存内部数据、无需依赖某个具体外部对象状态的辅助类型。

## 非静态内部类 {#inner}

Java 也支持**非静态内部类**。它的每个实例都与某个具体的外部对象相关联，因此可以直接访问该对象的实例字段和方法，包括私有成员。例如，`车库` 可以保存私有字段 `服务单价`，而属于该车库的 `维修单` 则能够按照车库当前的单价计算维修费用。在这种情况下，让内部对象与一个特定外部实例建立联系是合理的。

:::lang java
```java
class 车库 {
    private int 服务单价;

    public 车库(int 服务单价) {
        if (服务单价 <= 0) throw new IllegalArgumentException();
        this.服务单价 = 服务单价;
    }

    public class 维修单 {
        private int 工时;

        public 维修单(int 工时) {
            if (工时 <= 0) throw new IllegalArgumentException();
            this.工时 = 工时;
        }

        public int 计算费用() {
            return 工时 * 服务单价;
        }
    }
}

class Main {
    public static void main(String[] args) {
        车库 车库对象 = new 车库(8000);
        车库.维修单 维修单对象 = 车库对象.new 维修单(3);
        System.out.println(维修单对象.计算费用());
    }
}
```
:::end
:::lang csharp
```csharp
using System;

class 车库 {
    private int 服务单价;
    public 车库(int 服务单价) {
        if (服务单价 <= 0) throw new ArgumentException();
        this.服务单价 = 服务单价;
    }

    public class 维修单 {
        private 车库 车库对象;
        private int 工时;

        public 维修单(车库 车库对象, int 工时) {
            if (车库对象 == null || 工时 <= 0) throw new ArgumentException();
            this.车库对象 = 车库对象;
            this.工时 = 工时;
        }

        public int 计算费用() {
            return 工时 * 车库对象.服务单价;
        }
    }
}
```
:::end
:::lang python
```python
class 车库:
    def __init__(self, 服务单价):
        if 服务单价 <= 0:
            raise ValueError("Invalid 单价")
        self._service_price = 服务单价

    class 维修单:
        def __init__(self, 车库对象, 工时):
            if 车库对象 is None or 工时 <= 0:
                raise ValueError("Invalid 维修单对象")
            self._车库对象 = 车库对象
            self._工时 = 工时

        def 计算费用(self):
            return self._工时 * self._车库对象._service_price

    def 新建维修单(self, 工时):
        return self.维修单(self, 工时)

车库(8000).新建维修单(3).计算费用()
```
:::end
:::lang cpp
```cpp
#include <stdexcept>

class 车库 {
    int 服务单价;
public:
    explicit 车库(int 单价) : 服务单价(单价) {
        if (单价 <= 0) throw std::invalid_argument("Invalid 单价");
    }

    class 维修单 {
        const 车库& 车库对象;
        int 工时;
    public:
        维修单(const 车库& 车库对象, int 工时)
            : 车库对象(车库对象), 工时(工时) {
            if (工时 <= 0) throw std::invalid_argument("Invalid 工时");
        }
        int 计算费用() const { return 工时 * 车库对象.服务单价; }
    };
};
```
:::end

![非静态内部类 UML](content/chapters/11-final-beagyazott-osztalyok/media/garage-zh.svg){width=650}

这两种设计的区别不仅是创建对象时的语法不同。非静态 Java 内部类能够引用所属的外部对象，静态嵌套类则不会自动拥有这种引用。在 C#、Python 和 C++ 中，仅仅把类型定义在另一个类型内部，也不会自动获得外部对象的引用；有需要时应显式传入。嵌套在这些语言中同样有助于组织相关类型，并在语言支持的范围内限制访问。不过，Python 名称前的下划线主要是命名约定，而不是真正的访问禁止。

## final 类 {#final-classes}

学习继承时，我们重点讨论了如何扩展已有类。但某些类的设计已经完成，我们不希望再从它派生其他类。在 Java 中，可以在类声明中使用 `final` 来明确表达这一要求。这样的类仍然能够正常实例化，其字段和方法也仍遵循原有的可见性规则，只是不能再被其他类继承。

这与只定义 `private` 构造方法并不相同。私有构造方法首先用于控制实例创建，虽然也可能限制某些继承形式，但直接表明禁止继承这一意图的是 `final`。使用 `final` 后，编译器会拒绝任何继承该类的声明。C# 中对应的关键字是 `sealed`，C++ 也使用 `final`。Python 中的 `typing.final` 装饰器主要供静态类型检查工具使用，本身并不在运行时禁止继承。

:::lang java
```java
final class 发票编号 {
    private final int 值;

    public 发票编号(int 值) {
        if (值 <= 0) throw new IllegalArgumentException();
        this.值 = 值;
    }

    public int 获取值() { return 值; }
}

// class 特殊发票编号 extends 发票编号 { } // 编译错误
```
:::end
:::lang csharp
```csharp
using System;

sealed class 发票编号 {
    private readonly int 值;

    public 发票编号(int 值) {
        if (值 <= 0) throw new ArgumentException();
        this.值 = 值;
    }

    public int 获取值() { return 值; }
}

// class 特殊发票编号 : 发票编号 { } // 编译错误
```
:::end
:::lang python
```python
from typing import final

@final
class 发票编号:
    def __init__(self, 值):
        if 值 <= 0:
            raise ValueError("Invalid 值")
        self._值 = 值

    def 获取值(self):
        return self._值

# 类型检查器会标出非法继承，
# 但 Python 运行时本身不禁止继承。
```
:::end
:::lang cpp
```cpp
#include <stdexcept>

class 发票编号 final {
    const int 值;
public:
    explicit 发票编号(int 值) : 值(值) {
        if (值 <= 0) throw std::invalid_argument("Invalid 值");
    }
    int 获取值() const { return 值; }
};

// class 特殊发票编号 : public 发票编号 { }; // 编译错误
```
:::end

## final 方法与字段 {#final-members}

`final` 不仅可以用于整个类，也可以修饰单个方法。这样的实例方法仍然可以被子类继承，但不能被子类重写。当某项操作包含重要的校验逻辑，而且我们希望所有子类都遵守相同规则时，这一特性十分有用。例如，银行账户的取款方法可能必须统一检查金额是否合法以及余额是否充足，因此不允许子类改写这些基本检查；子类仍可以添加其他操作。

当 `final` 用于字段时，含义又有所不同：Java 字段初始化之后不能再被赋予新的值。不过，如果字段保存的是对象引用，引用不能改变并不意味着对象自身不可修改。我们仍然可以通过一个 `final` 的 `ArrayList` 引用向列表添加元素。类似地，`static final` 字段经常用作常量，但如果它引用的是可变对象，也不能据此认定该对象完全不可变。

:::lang java
```java
import java.util.ArrayList;

class 银行账户 {
    private int 余额;
    private final ArrayList<String> 交易记录 = new ArrayList<>();

    public 银行账户(int 余额) {
        if (余额 < 0) throw new IllegalArgumentException();
        this.余额 = 余额;
    }

    public final void 取款(int 金额) {
        if (金额 <= 0 || 金额 > 余额)
            throw new IllegalArgumentException();
        余额 -= 金额;
        交易记录.add("取款：" + 金额);
    }

    public int 获取余额() { return 余额; }
}

class 储蓄账户 extends 银行账户 {
    public 储蓄账户(int 余额) { super(余额); }
    // public void 取款(int 金额) { } // 编译错误
}
```
:::end
:::lang csharp
```csharp
using System;
using System.Collections.Generic;

class 银行账户 {
    private int 余额;
    private readonly List<string> 交易记录 = new();

    public 银行账户(int 余额) {
        if (余额 < 0) throw new ArgumentException();
        this.余额 = 余额;
    }

    public virtual void 取款(int 金额) {
        if (金额 <= 0 || 金额 > 余额)
            throw new ArgumentException();
        余额 -= 金额;
        交易记录.Add("取款：" + 金额);
    }
    public int 获取余额() { return 余额; }
}

class 储蓄账户 : 银行账户 {
    public 储蓄账户(int 余额) : base(余额) { }
    public sealed override void 取款(int 金额) {
        base.取款(金额);
    }
}
```
:::end
:::lang python
```python
from typing import final

class 银行账户:
    def __init__(self, 余额):
        if 余额 < 0:
            raise ValueError("Invalid 余额")
        self._balance = 余额
        self._交易记录 = []

    @final
    def 取款(self, 金额):
        if 金额 <= 0 or 金额 > self._balance:
            raise ValueError("Invalid 金额")
        self._balance -= 金额
        self._交易记录.append(f"取款：{金额}")

    def 获取余额(self):
        return self._balance

# @final：用于类型检查，并非运行时保护
```
:::end
:::lang cpp
```cpp
#include <stdexcept>
#include <vector>
#include <string>

class 银行账户 {
    int 余额;
    const int 账户编号;
public:
    银行账户(int 余额, int 账户编号)
        : 余额(余额), 账户编号(账户编号) {
        if (余额 < 0 || 账户编号 <= 0)
            throw std::invalid_argument("账户无效");
    }
    virtual ~银行账户() = default;
    virtual void 取款(int 金额) final {
        if (金额 <= 0 || 金额 > 余额)
            throw std::invalid_argument("Invalid 金额");
        余额 -= 金额;
    }
    int 获取余额() const { return 余额; }
};
```
:::end

![final 方法 UML](content/chapters/11-final-beagyazott-osztalyok/media/final-method-zh.svg){width=570}

在 C# 中，`sealed override` 可以阻止子类继续重写一个已经被重写的方法。Java 可以直接在方法声明中使用 `final`；C++ 的 `final` 则限制虚函数的进一步重写。Python 的 `@final` 主要向类型检查器表明相同意图。这些机制都要求我们明确决定，在类层次结构的哪个位置应当停止改变某项操作的实现。

## 练习 {#tasks}

下面的练习重点训练内部实现的隐藏以及对进一步继承的有意识限制。嵌套类不能替代容器的公开方法，因此外部类仍须控制对数据的操作。可以在符合要求的情况下复用之前编写的类。

:::exercise
### 矩形——固定尺寸

![矩形 UML](content/chapters/11-final-beagyazott-osztalyok/media/task-rectangle-zh.svg){width=590}

**类与字段**
- 创建 `final` 类 `矩形尺寸`，包含 `宽度 : double` 和 `高度 : double`。两个字段均为 `private final`，且必须是正实数。

**构造方法与其他方法**
- `矩形尺寸(宽度 : double, 高度 : double)` 必须验证两个参数。`获取宽度()` 和 `获取高度()` 仅提供读取功能。
- `获取面积() : double` 必须计算矩形面积；实例创建后不能改变其尺寸。
- 尝试继承 `矩形尺寸` 并改变面积计算规则，观察编译器报告的错误。
:::endexercise

:::exercise
### 图书馆——内部借阅记录

![图书馆 UML](content/chapters/11-final-beagyazott-osztalyok/media/task-library-zh.svg){width=640}

**类与字段**
- 在 `图书馆` 内创建私有、静态嵌套的 `借阅记录` 类，保存非空 `图书编号 : String` 和非负整数 `借阅天数 : int`。
- `图书馆` 保存私有列表 `借阅列表 : ArrayList<借阅记录>`，创建图书馆对象时必须初始化。

**构造方法与其他方法**
- `借阅记录(图书编号 : String, 借阅天数 : int)` 必须验证数据。外部代码不能直接访问嵌套类或内部列表。
- `添加借阅(图书编号 : String, 借阅天数 : int) : void` 应创建并保存一条新记录。相同图书编号只能出现一次，重复时必须抛出异常。
- `统计逾期(允许天数 : int) : int` 应返回借阅时长超过非负限制的记录数量。`获取借阅数量() : int` 返回全部记录数量。
- 验证主程序是否只能通过公开方法修改借阅信息。
:::endexercise

:::exercise
### 汽车维修——内部维修单

![汽车维修 UML](content/chapters/11-final-beagyazott-osztalyok/media/task-garage-zh.svg){width=660}

**类与字段**
- `车库` 保存非空 `名称 : String` 和正整数 `每小时费用 : int`，两个字段均为私有。
- 在 `车库` 内创建公开的、非静态内部类 `维修单`，用私有字段 `工时 : int` 保存正整数工时。

**构造方法与其他方法**
- `车库(名称 : String, 每小时费用 : int)` 验证公共数据；`维修单(工时 : int)` 验证并保存工时。
- `维修单.计算费用() : int` 根据所属 `车库` 对象的每小时费用计算本次维修费用。
- `车库` 提供 `获取名称() : String` 和 `获取每小时费用() : int` 只读方法，外部不能修改这两个字段。
- 创建两个收费标准不同的车库，并为每个车库创建一张维修单，证明相同工时会得到不同的费用。
:::endexercise

:::exercise
### 银行账户——不可重写的取款操作

![银行账户 UML](content/chapters/11-final-beagyazott-osztalyok/media/task-bank-zh.svg){width=660}

**类与字段**
- `银行账户` 保存私有字段 `账号 : String` 和 `余额 : int`。账号不能是空字符串，余额必须是非负整数。
- `储蓄账户` 在父类基础上增加非负实数 `利率 : double`。

**构造方法与其他方法**
- `银行账户(账号 : String, 余额 : int)` 和 `储蓄账户(账号 : String, 余额 : int, 利率 : double)` 必须验证并初始化所有数据。
- 将 `银行账户` 的 `取款(金额 : int) : void` 声明为 `final`，拒绝非正金额，也不能让账户余额变成负数。
- `获取余额() : int` 和 `获取账号() : String` 只负责读取。`储蓄账户.计算月利息() : int` 返回余额与利率乘积向下取整后的整数。
- 验证继承的 `取款()` 可以正常使用，却不能在 `储蓄账户` 中重写。
:::endexercise

:::exercise
### 电影目录——私有放映数据

![电影目录 UML](content/chapters/11-final-beagyazott-osztalyok/media/task-movies-zh.svg){width=660}

**类与字段**
- 在 `电影目录` 内定义私有、静态嵌套类 `放映记录`，保存非空 `电影标题 : String` 和非负整数 `已售票数 : int`。
- `电影目录` 保存私有列表 `放映列表 : ArrayList<放映记录>`。

**构造方法与其他方法**
- `放映记录(电影标题 : String, 已售票数 : int)` 必须验证参数；`电影目录()` 必须初始化列表。
- `添加放映(电影标题 : String, 已售票数 : int) : void` 保存新放映记录。`获取总售票数() : int` 返回全部放映的总售票数。
- `统计热门(最低票数 : int) : int` 返回至少售出给定非负票数的放映数量。负参数必须引发异常。
- 不能直接暴露列表或 `放映记录` 实例。添加若干放映记录并测试汇总方法。
:::endexercise
