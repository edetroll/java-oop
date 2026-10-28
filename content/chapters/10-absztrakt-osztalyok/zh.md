# 抽象类

学习继承和后期绑定时，我们已经看到，子类可以重写继承的方法，而程序在运行时会根据对象的实际类型选择执行哪一种实现。然而，在设计类层次结构时，有时我们已经能够明确规定某个方法应该完成什么任务，却因为当前类的抽象层次太高，暂时无法确定具体算法。例如，我们知道制作不同咖啡都需要研磨咖啡豆并进行萃取，但研磨粗细和萃取方式必须由具体的咖啡种类决定，不能简单地用一套方法完成所有情况。

这时，如果只编写一个没有实际功能的方法，并期待所有子类主动重写它，就会留下隐患。一旦忘记重写，程序可能不会报告错误，却无法正确完成任务。如果在方法中直接抛出异常，也只能等到运行时才发现实现缺失。**抽象方法允许我们先规定必须具备的操作，而不编写方法体，并要求具体子类提供相应的实现。**

## 抽象方法和抽象类 {#abstract-methods}

在 Java 中，我们使用 `abstract` 关键字声明抽象方法。方法声明以分号结束，不包含方法体。包含抽象方法的类也必须声明为 `abstract`。不过，抽象类并不只能包含抽象方法：它还可以具有字段、构造方法和已经完整实现的方法。即使没有任何抽象方法，我们也可以将一个类声明为抽象类，以禁止直接创建该类的实例。

抽象类不能直接实例化，但仍可以用作引用、方法参数和容器元素的类型。具体子类必须实现继承层次中尚未实现的所有抽象方法，否则它自身也必须保持抽象。编译器会检查这一要求，因此抽象方法不仅仅表示“允许重写”，而是对子类提出了必须履行的要求。

下面的例子中，每一种支付方式都必须计算交易手续费，但计算规则取决于具体支付方式。抽象类 `支付方式` 已经能够实现总金额的计算，因为该算法只需要调用尚待子类实现的 `计算手续费()`。不同支付方式负责实现这一操作的具体规则。

:::lang java
```java
abstract class 支付方式 {
    public abstract int 计算手续费(int 金额);

    public int 计算总额(int 金额) {
        return 金额 + 计算手续费(金额);
    }
}

class 银行转账 extends 支付方式 {
    @Override
    public int 计算手续费(int 金额) {
        return 150;
    }
}

class 银行卡支付 extends 支付方式 {
    @Override
    public int 计算手续费(int 金额) {
        return 金额 / 100;
    }
}

class Main {
    public static void main(String[] args) {
        支付方式 支付对象 = new 银行卡支付();
        System.out.println(支付对象.计算总额(10000));
    }
}
```
:::end
:::lang csharp
```csharp
using System;

abstract class 支付方式 {
    public abstract int 计算手续费(int 金额);

    public int 计算总额(int 金额) {
        return 金额 + 计算手续费(金额);
    }
}

class 银行转账 : 支付方式 {
    public override int 计算手续费(int 金额) {
        return 150;
    }
}

class 银行卡支付 : 支付方式 {
    public override int 计算手续费(int 金额) {
        return 金额 / 100;
    }
}

class 主程序 {
    static void Main() {
        支付方式 支付对象 = new 银行卡支付();
        Console.WriteLine(支付对象.计算总额(10000));
    }
}
```
:::end
:::lang python
```python
from abc import ABC, abstractmethod

class 支付方式(ABC):
    @abstractmethod
    def 计算手续费(self, 金额):
        pass

    def 计算总额(self, 金额):
        return 金额 + self.计算手续费(金额)

class 银行转账(支付方式):
    def 计算手续费(self, 金额):
        return 150

class 银行卡支付(支付方式):
    def 计算手续费(self, 金额):
        return 金额 // 100

支付对象 = 银行卡支付()
print(支付对象.计算总额(10000))
```
:::end
:::lang cpp
```cpp
#include <iostream>

class 支付方式 {
public:
    virtual ~支付方式() = default;
    virtual int 计算手续费(int 金额) const = 0;

    int 计算总额(int 金额) const {
        return 金额 + 计算手续费(金额);
    }
};

class 银行转账 : public 支付方式 {
public:
    int 计算手续费(int 金额) const override { return 150; }
};

class 银行卡支付 : public 支付方式 {
public:
    int 计算手续费(int 金额) const override { return 金额 / 100; }
};

int main() {
    银行卡支付 银行卡;
    支付方式& 支付对象 = 银行卡;
    std::cout << 支付对象.计算总额(10000) << '\n';
}
```
:::end

![抽象支付方式 UML](content/chapters/10-absztrakt-osztalyok/media/payment-zh.svg){width=620}

在 UML 中，抽象类名和抽象方法名使用斜体表示。由于后期绑定会选择适当的 `计算手续费()` 实现，公共的 `计算总额()` 算法可以适用于不同的支付方式。具体子类并不是定义新的、互不相关的计算接口，而是实现父类已经规定的同一个操作。

## 咖啡制作算法 {#coffee}

无论准备哪一种咖啡，基本步骤都有明确的先后顺序：先研磨咖啡豆，再萃取咖啡，最后根据饮品种类决定是否加入牛奶。我们可以在公共父类中规定这些步骤的执行顺序，同时把研磨和萃取的具体实现留给子类。这体现了 **Template Method（模板方法）** 设计模式的核心思想：整体算法保持不变，其中的某些步骤可以由不同子类采用不同方式实现。

在 `咖啡` 类中，`制作()` 方法规定操作顺序。每一种具体咖啡都必须实现抽象方法 `研磨()` 和 `萃取()`。相反，`添加牛奶()` 已经具有一个空方法体，它表示一个可选步骤，只有需要牛奶的咖啡才重写它。这样，在同一个例子中就能清楚区分必须实现的抽象方法和可以重写、但并不强制重写的方法。

:::lang java
```java
abstract class 咖啡 {
    protected abstract void 研磨();
    protected abstract void 萃取();

    protected void 添加牛奶() { }

    public void 制作() {
        研磨();
        萃取();
        添加牛奶();
    }
}

class 意式浓缩 extends 咖啡 {
    @Override
    protected void 研磨() {
        System.out.println("研磨 finely");
    }

    @Override
    protected void 萃取() {
        System.out.println("萃取 30 ml under high pressure");
    }
}

class 卡布奇诺 extends 咖啡 {
    @Override
    protected void 研磨() {
        System.out.println("研磨 finely");
    }

    @Override
    protected void 萃取() {
        System.out.println("萃取 30 ml under high pressure");
    }

    @Override
    protected void 添加牛奶() {
        System.out.println("加入热牛奶和奶泡");
    }
}

class Main {
    public static void main(String[] args) {
        咖啡 咖啡对象 = new 卡布奇诺();
        咖啡对象.制作();
    }
}
```
:::end
:::lang csharp
```csharp
using System;

abstract class 咖啡 {
    protected abstract void 研磨();
    protected abstract void 萃取();
    protected virtual void 添加牛奶() { }

    public void 制作() {
        研磨();
        萃取();
        添加牛奶();
    }
}

class 意式浓缩 : 咖啡 {
    protected override void 研磨() => Console.WriteLine("研磨 finely");
    protected override void 萃取() => Console.WriteLine("萃取 30 ml under high pressure");
}

class 卡布奇诺 : 咖啡 {
    protected override void 研磨() => Console.WriteLine("研磨 finely");
    protected override void 萃取() => Console.WriteLine("萃取 30 ml under high pressure");
    protected override void 添加牛奶() => Console.WriteLine("加入热牛奶和奶泡");
}

class 主程序 {
    static void Main() {
        咖啡 咖啡对象 = new 卡布奇诺();
        咖啡对象.制作();
    }
}
```
:::end
:::lang python
```python
from abc import ABC, abstractmethod

class 咖啡(ABC):
    @abstractmethod
    def 研磨(self):
        pass

    @abstractmethod
    def 萃取(self):
        pass

    def 添加牛奶(self):
        pass

    def 制作(self):
        self.研磨()
        self.萃取()
        self.添加牛奶()

class 意式浓缩(咖啡):
    def 研磨(self):
        print("研磨 finely")

    def 萃取(self):
        print("萃取 30 ml under high pressure")

class 卡布奇诺(咖啡):
    def 研磨(self):
        print("研磨 finely")

    def 萃取(self):
        print("萃取 30 ml under high pressure")

    def 添加牛奶(self):
        print("加入热牛奶和奶泡")

咖啡对象 = 卡布奇诺()
咖啡对象.制作()
```
:::end
:::lang cpp
```cpp
#include <iostream>

class 咖啡 {
protected:
    virtual void 研磨() const = 0;
    virtual void 萃取() const = 0;
    virtual void 添加牛奶() const { }
public:
    virtual ~咖啡() = default;
    void 制作() const {
        研磨();
        萃取();
        添加牛奶();
    }
};

class 意式浓缩 : public 咖啡 {
protected:
    void 研磨() const override { std::cout << "研磨 finely\n"; }
    void 萃取() const override { std::cout << "萃取 30 ml under high pressure\n"; }
};

class 卡布奇诺 : public 咖啡 {
protected:
    void 研磨() const override { std::cout << "研磨 finely\n"; }
    void 萃取() const override { std::cout << "萃取 30 ml under high pressure\n"; }
    void 添加牛奶() const override {
        std::cout << "加入热牛奶和奶泡\n";
    }
};

int main() {
    卡布奇诺 卡布奇诺对象;
    咖啡& 咖啡对象 = 卡布奇诺对象;
    咖啡对象.制作();
}
```
:::end

![咖啡制作 UML](content/chapters/10-absztrakt-osztalyok/media/coffee-zh.svg){width=620}

我们在创建咖啡对象后才调用 `制作()`，而不是从父类构造方法中调用它。构造方法运行时，子类的状态可能尚未完成初始化，此时调用可重写的方法可能产生意料之外的结果。这并不改变算法的设计：公共父类仍负责定义咖啡制作的步骤，具体子类则负责实现这些步骤。

## 抽象类的使用 {#usage}

当我们希望统一处理多种具有共同特征的对象，但某些公共操作没有适用于所有对象的通用算法时，抽象类特别有用。例如，可以用抽象类表示几何图形，要求每一种具体图形计算面积；也可以定义出版物的公共父类，由不同出版物按不同规则计算处理费用。不同子类的实例可以存放在以父类为元素类型的集合中，并在调用方法时执行各自的实现。

在 Java 中，抽象方法不能同时声明为 `private`、`static` 或 `final`，因为这些修饰符与子类必须实现该方法的要求相矛盾。抽象类本身仍然可以包含静态方法和不允许重写的具体方法。C# 使用 `abstract` 和 `override`，C++ 使用 `virtual ... = 0` 形式的纯虚函数，Python 则使用 `abc` 模块中的 `ABC` 和 `@abstractmethod`。这些机制遵循相近的设计思想，但具体语法和规则有所不同。

即使尚未能够实现某些具体操作，我们也可以先通过抽象类设计高层算法。公共方法已经可以调用这些步骤，而编译器会要求具体子类提供实现。相反，如果父类已经提供一个具有方法体的可重写方法，子类可以选择是否重写。因此，设计类层次结构时要区分真正存在合理默认行为的方法和那些不应使用空方法体掩盖实现缺失的方法。

抽象类不能直接实例化，但可以具有构造方法。具体子类的构造方法调用链会使用它们来初始化公共字段。抽象方法是对操作的规定，不是可执行算法。子类实现时必须满足要求的参数列表和返回类型；在 Java 中还不能缩小可见性。抽象方法不能同时使用 `static`、`private` 或 `final`，因为这些修饰符与强制重写的要求相矛盾。

## 练习 {#tasks}

下面的练习会明确标注抽象方法。父类中的这些方法**只有声明，没有方法体**；所有具体子类都必须实现它们。不需要在子类中重复编写父类已有的公共算法。

下面的练习将在已经学习过的类层次结构中加入公共操作，这些操作的具体实现取决于对象的实际类型。UML 图展示所需的字段和方法，而数据校验和算法的完整要求仍以文字说明为准。

:::exercise
### 矩形与图形

![图形 UML](content/chapters/10-absztrakt-osztalyok/media/task-shapes-zh.svg){width=650}

**类与字段**
- 创建抽象类 `图形`，保存 `名称 : String` 字段。名称不得为 `null` 或空字符串；允许通过 `获取名称()` 读取，但不允许从类外部修改。
- `矩形` 保存正实数 `宽度` 和 `高度`，`圆形` 保存正实数 `半径`。

**构造方法**
- `图形(名称 : String)` 构造方法必须验证并保存名称。`矩形(名称 : String, 宽度 : double, 高度 : double)` 和 `圆形(名称 : String, 半径 : double)` 必须先通过父类构造方法初始化公共数据，再验证自己的字段。

**抽象方法——在公共父类中只有声明，不编写方法体**
- **`abstract 获取面积() : double`**：只在 `图形` 中声明，不提供方法体；`矩形` 返回宽度乘以高度，`圆形` 返回 `Math.PI * 半径 * 半径`。
- **`abstract 获取周长() : double`**：`矩形` 返回宽与高之和的两倍，`圆形` 返回 `2 * Math.PI * 半径`。

**具体方法——由父类统一实现**
- 公共具体方法 `面积更大(其他 : 图形) : boolean` 必须比较两个图形的面积。如果当前图形面积更大则返回 `true`；若参数为 `null`，则抛出异常。

**主程序与验证**
- 在主程序中将不同图形加入 `ArrayList<图形>`，找出面积最大的图形。

:::endexercise

:::exercise
### 图书与出版物

![出版物 UML](content/chapters/10-absztrakt-osztalyok/media/task-publications-zh.svg){width=650}

**类与字段**
- 抽象类 `出版物` 保存非空 `标题 : String` 和正整数 `基本价格 : int`，这些字段只能由构造方法设置，并通过 `获取标题()` 和 `获取基本价格()` 读取。
- `教材` 保存正整数 `页数 : int`，`杂志` 保存正整数 `期号 : int`。

**构造方法**
- `出版物(标题 : String, 基本价格 : int)` 必须验证公共数据。子类构造方法必须接收并验证公共字段和各自新增的字段。

**抽象方法——在公共父类中只有声明，不编写方法体**
- 在 `出版物` 中声明抽象方法 `计算运费() : int`。教材的运费为 `600 + 2 * 页数`，杂志的运费固定为 `400` 福林。

**具体方法——由父类统一实现**
- 公共具体方法 `获取总价() : int` 应返回基本价格与运费之和。不要在各个子类中重新编写总价计算方法。

**主程序与验证**
- 创建 `ArrayList<出版物>`，找出总价最高的出版物。

:::endexercise

:::exercise
### 车辆

![车辆 UML](content/chapters/10-absztrakt-osztalyok/media/task-vehicles-zh.svg){width=650}

**类与字段**
- 抽象类 `车辆` 保存非空 `品牌 : String` 和非负整数 `里程 : int`。这两个字段只能由构造方法设置，并通过 `获取品牌()` 和 `获取里程()` 读取。
- `汽车` 增加正整数 `排量 : int`；`摩托车` 增加布尔字段 `有边车 : boolean`。

**构造方法**
- `车辆(品牌 : String, 里程 : int)` 必须验证公共数据。子类构造方法应先调用父类构造方法，再初始化自己的字段。

**抽象方法——在公共父类中只有声明，不编写方法体**
- `车辆` 声明抽象方法 `获取保养间隔() : int`。汽车排量至少为 `1600` 时，保养间隔为 `15000` 公里，否则为 `10000` 公里。带边车的摩托车间隔为 `5000` 公里，不带边车则为 `7000` 公里。

**具体方法——由父类统一实现**
- 具体方法 `需要保养(距上次保养公里数 : int) : boolean` 必须将非负参数与对应车辆的保养间隔进行比较，达到间隔时返回 `true`。负值必须引发异常。

**主程序与验证**
- 将不同车辆存入 `ArrayList<车辆>`，筛选出行驶指定距离后需要保养的车辆。

:::endexercise

:::exercise
### 银行账户

![银行账户 UML](content/chapters/10-absztrakt-osztalyok/media/task-bank-zh.svg){width=650}

**类与字段**
- 抽象类 `银行账户` 保存非空 `账号 : String` 和非负整数 `余额 : int`。账号只能读取，余额只能通过之前实现的存款和取款方法改变。
- `储蓄账户` 保存非负整数 `每月免费转账次数 : int`，`企业账户` 保存正实数 `手续费比例 : double`。

**构造方法**
- `银行账户(账号 : String, 余额 : int)` 必须验证公共字段，子类构造方法还须验证各自的参数。

**抽象方法——在公共父类中只有声明，不编写方法体**
- 在 `银行账户` 中声明抽象方法 `计算转账手续费(金额 : int) : int`，金额必须为正数。`手续费比例` 按百分数表示（例如 `2.5` 表示 2.5%）。仅计算费用不得减少免费转账次数。对于储蓄账户，如果仍有免费转账次数，手续费为 `0`，否则为 `300` 福林。企业账户的手续费为金额与手续费百分比除以 `100` 后的乘积向上取整后的整数。

**具体方法——由父类统一实现**
- `存款(金额 : int) : void` 只接受正数并增加余额；`取款(金额 : int) : void` 只允许提取大于 `0` 且不超过余额的金额。两个方法都应在父类中具体实现；参数不合法时抛出异常。
- 公共方法 `可以转账(金额 : int) : boolean` 负责检查余额是否足以支付转账金额和手续费。该方法本身不得扣除余额，也不得减少剩余免费转账次数。

**主程序与验证**
- 从 `ArrayList<银行账户>` 中选出可以转账 `25000` 福林的账户。

:::endexercise

:::exercise
### 电影与剧集

![影视作品 UML](content/chapters/10-absztrakt-osztalyok/media/task-media-zh.svg){width=650}

**类与字段**
- 抽象类 `影视作品` 保存非空 `标题 : String` 和正整数 `发行年份 : int`。只能通过 `获取标题()` 和 `获取发行年份()` 读取，不允许从外部修改。
- `电影` 保存以分钟为单位的正整数 `时长 : int`；`剧集` 保存正整数 `集数 : int` 和 `平均每集时长 : int`。

**构造方法**
- `影视作品(标题 : String, 发行年份 : int)` 必须验证并初始化公共字段，两个子类的构造方法还应验证自己的字段。

**抽象方法——在公共父类中只有声明，不编写方法体**
- `影视作品` 声明抽象方法 `获取总时长() : int`。电影返回播放时长，剧集返回集数与平均每集时长的乘积。

**具体方法——由父类统一实现**
- 公共方法 `可在时间内观看(可用分钟 : int) : boolean` 必须判断非负的时间预算是否足以完整观看作品，负参数应引发异常。

**主程序与验证**
- 从 `ArrayList<影视作品>` 中选出可以在四小时内完整看完的电影和剧集。

:::endexercise

:::exercise
### 咖啡制作——扩展公共算法 {#coffee-exercise}

![咖啡制作——完整 UML](content/chapters/10-absztrakt-osztalyok/media/task-coffee-zh.svg){width=650}

扩展前面的咖啡制作示例，使每一步计算所需的时间，而不仅是输出提示。公共父类负责规定操作顺序，具体咖啡类负责计算各步骤的时间。

**类与字段**
- 创建**抽象类 `咖啡`**，包含 `咖啡粉克数 : int` 和 `水量毫升 : int`。两个字段均为 `protected`，只能保存正整数。
- `意式浓缩` 直接继承 `咖啡`，并保存私有的正整数 `压力巴 : int`。
- `卡布奇诺` 也直接继承 `咖啡`，并保存私有的正整数 `牛奶毫升 : int`。

**构造方法**
- `咖啡(咖啡粉克数 : int, 水量毫升 : int)` 负责验证并初始化公共字段。不得直接创建 `咖啡` 实例。
- `意式浓缩(咖啡粉克数 : int, 水量毫升 : int, 压力巴 : int)` 和 `卡布奇诺(咖啡粉克数 : int, 水量毫升 : int, 牛奶毫升 : int)` 必须调用父类构造方法，并验证各自新增的字段。

**抽象方法——在 `咖啡` 类中没有方法体**
- `研磨() : int`：返回研磨时间（秒）。意式浓缩使用 `咖啡粉克数 * 2`，卡布奇诺使用 `咖啡粉克数 * 3`。
- `萃取() : int`：返回萃取时间（秒）。意式浓缩使用整数除法 `水量毫升 / 5 + 压力巴`，卡布奇诺使用 `水量毫升 / 4`。

**具体方法——在 `咖啡` 类中实现**
- `添加牛奶() : int`：默认返回 `0`。只有 `卡布奇诺` 重写该方法，返回整数除法 `牛奶毫升 / 10`。
- `制作() : int`：依次调用 `研磨()`、`萃取()`、`添加牛奶()` 并返回时间总和。子类**不得重新编写**这个公共算法。

**主程序与验证**
- 使用不同参数创建两个 `意式浓缩` 和两个 `卡布奇诺` 对象，放入 `ArrayList<咖啡>`，找出制作时间最长的对象。并检查构造方法是否对无效参数抛出异常。
:::endexercise
