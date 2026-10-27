# 容器类

## 容器类的概念 {#container-intro}

到目前为止，我们创建的类主要描述单个人、书籍、车辆或其他独立对象。但在较大的应用程序中，往往需要管理许多对象组成的集合。例如，可以将学生放入列表，再进行登记、查找或按条件筛选。如果每次都在主程序中编写这些操作，不仅会重复相同的检查和算法，还可能让外部代码绕过检查，任意修改集合。

**容器类**用于管理另一种类型的对象集合，并决定外部代码可以对该集合执行哪些操作。例如，`家庭` 类可以存储 `人物` 对象，并通过自己的方法完成成员的添加、查询和删除。因此，容器类的作用不只是保存列表，更重要的是**确保集合始终处于符合要求的状态**。这里体现的是“包含”关系，而不是继承关系：家庭包含人物，但家庭不是人物的一种。

![家庭与人物的 UML](content/chapters/05-kontenerosztalyok/media/family-zh.svg){width=550}

## 保护集合 {#collection-protection}

假设我们使用 `ArrayList<人物>` 字段保存家庭成员。如果把该字段声明为 `public`，主程序就可以直接清空整个列表，也可以绕过检查插入任意对象。因此，应把列表设为 `private`，并在构造方法中初始化。不过，如果通过其他途径泄露列表，问题仍然存在。

:::lang java
```java
class 家庭 {
    public ArrayList<人物> 成员列表 = new ArrayList<>();
}

家庭 家庭对象 = new 家庭();
家庭对象.成员列表.clear(); // 可清空全部家庭成员
```
:::end

:::lang csharp
```csharp
class 家庭 {
    public List<人物> 成员列表 = new();
}

var 家庭对象 = new 家庭();
家庭对象.成员列表.Clear();
```
:::end

:::lang python
```python
class 家庭:
    def __init__(self):
        self.成员列表 = []

家庭对象 = 家庭()
家庭对象.成员列表.clear()
```
:::end

:::lang cpp
```cpp
class 家庭 {
public:
    std::vector<人物> 成员列表;
};

家庭 家庭对象;
家庭对象.成员列表.clear();
```
:::end

即使将字段声明为私有，但通过公有 getter 返回原列表的引用，也无法解决这个问题。调用方得到的仍是同一个可修改的集合，因此可以借此绕过全部检查。下面这种写法同样没有实现有效的保护。

:::lang java
```java
class 家庭 {
    private final ArrayList<人物> 成员列表 = new ArrayList<>();

    public ArrayList<人物> 获取全部成员() {
        return 成员列表; // 返回同一个可修改的列表
    }
}
```
:::end

:::lang csharp
```csharp
class 家庭 {
    private readonly List<人物> 成员列表 = new();
    public List<人物> GetMembers() => 成员列表; // 直接访问列表
}
```
:::end

:::lang python
```python
class 家庭:
    def __init__(self):
        self._成员列表 = []

    def 获取所有成员(self):
        return self._成员列表  # 泄露内部列表
```
:::end

:::lang cpp
```cpp
class 家庭 {
private:
    std::vector<人物> 成员列表;
public:
    std::vector<人物>& 获取全部成员() {
        return 成员列表; // 内部集合的引用
    }
};
```
:::end

正确的做法是，只将确实需要允许的操作实现为公有方法。如果外部代码需要得到一份列表，可以返回副本或只读视图。需要注意，列表副本只能保护列表本身的结构；如果其中保存的是可修改对象的引用，调用方仍可能通过这些引用修改对象内部的数据。

## 添加对象与查询 {#operations}

首先，为 `家庭` 编写无参数构造方法来创建私有列表。之后分别编写获取成员数量、按索引查询、添加成员和删除成员的方法。每个方法都负责检查自己的参数，例如索引越界时抛出异常。添加成员时，拒绝 `null`，在本例中还规定姓名不得重复。这里的重复判定只是当前任务的要求，其他容器可以采用不同规则。

下面通过普通循环实现查找。按姓名删除的方法用布尔值表示是否找到成员，而 `按前缀查找()` 将匹配的成员放入**新列表**。因此，对返回列表进行添加或清空操作，都不会改变容器内部的集合。课程主要使用 Java，其余语言的写法可通过代码标签查看。

:::lang java
```java
import java.util.ArrayList;

class 人物 {
    private final String 姓名;

    public 人物(String 姓名) {
        if (姓名 == null || 姓名.isBlank())
            throw new IllegalArgumentException("Invalid 姓名");
        this.姓名 = 姓名;
    }

    public String 获取姓名() { return 姓名; }
}

class 家庭 {
    private final ArrayList<人物> 成员列表;

    public 家庭() { 成员列表 = new ArrayList<>(); }

    public int 获取成员数量() { return 成员列表.size(); }

    public 人物 获取成员(int 索引) {
        if (索引 < 0 || 索引 >= 成员列表.size())
            throw new IndexOutOfBoundsException("Invalid 索引");
        return 成员列表.get(索引);
    }

    public void 添加成员(人物 人物对象) {
        if (人物对象 == null)
            throw new IllegalArgumentException("Missing 人物对象");
        for (人物 当前成员 : 成员列表) {
            if (当前成员.获取姓名().equals(人物对象.获取姓名()))
                throw new IllegalArgumentException("Already registered");
        }
        成员列表.add(人物对象);
    }

    public boolean 删除成员(String 姓名) {
        for (int i = 0; i < 成员列表.size(); i++) {
            if (成员列表.get(i).获取姓名().equals(姓名)) {
                成员列表.remove(i);
                return true;
            }
        }
        return false;
    }

    public ArrayList<人物> 按前缀查找(String 前缀) {
        if (前缀 == null) throw new IllegalArgumentException("Missing 前缀");
        ArrayList<人物> 结果 = new ArrayList<>();
        for (人物 人物对象 : 成员列表) {
            if (人物对象.获取姓名().startsWith(前缀)) 结果.add(人物对象);
        }
        return 结果;
    }
}
```
:::end

:::lang csharp
```csharp
using System;
using System.Collections.Generic;

class 人物 {
    public string 姓名 { get; }
    public 人物(string 姓名) {
        if (string.IsNullOrWhiteSpace(姓名))
            throw new ArgumentException("Invalid 姓名");
        姓名 = 姓名;
    }
}

class 家庭 {
    private readonly List<人物> 成员列表 = new();
    public int 获取成员数量() => 成员列表.Count;

    public 人物 获取成员(int 索引) {
        if (索引 < 0 || 索引 >= 成员列表.Count)
            throw new ArgumentOutOfRangeException(nameof(索引));
        return 成员列表[索引];
    }

    public void 添加成员(人物 人物对象) {
        if (人物对象 == null) throw new ArgumentNullException(nameof(人物对象));
        foreach (var 当前成员 in 成员列表)
            if (string.Equals(当前成员.姓名, 人物对象.姓名,
                    StringComparison.Ordinal))
                throw new ArgumentException("Already registered");
        成员列表.Add(人物对象);
    }

    public bool 删除成员(string 姓名) {
        for (int i = 0; i < 成员列表.Count; i++)
            if (string.Equals(成员列表[i].姓名, 姓名,
                    StringComparison.Ordinal)) {
                成员列表.RemoveAt(i);
                return true;
            }
        return false;
    }

    public List<人物> 按前缀查找(string 前缀) {
        if (前缀 == null) throw new ArgumentNullException(nameof(前缀));
        var 结果 = new List<人物>();
        foreach (var 人物对象 in 成员列表)
            if (人物对象.姓名.StartsWith(前缀, StringComparison.Ordinal))
                结果.Add(人物对象);
        return 结果;
    }
}
```
:::end

:::lang python
```python
class 人物:
    def __init__(self, 姓名):
        if not isinstance(姓名, str) or not 姓名.strip():
            raise ValueError("Invalid 姓名")
        self._姓名 = 姓名

    def 获取姓名(self):
        return self._姓名

class 家庭:
    def __init__(self):
        self._成员列表 = []

    def 获取成员数量(self):
        return len(self._成员列表)

    def 获取成员(self, 索引):
        if 索引 < 0 or 索引 >= len(self._成员列表):
            raise IndexError("Invalid 索引")
        return self._成员列表[索引]

    def 添加成员(self, 人物对象):
        if 人物对象 is None:
            raise ValueError("Missing 人物对象")
        if any(人物项.获取姓名() == 人物对象.获取姓名()
               for 人物项 in self._成员列表):
            raise ValueError("Already registered")
        self._成员列表.append(人物对象)

    def 删除成员(self, 姓名):
        for i, 人物对象 in enumerate(self._成员列表):
            if 人物对象.获取姓名() == 姓名:
                del self._成员列表[i]
                return True
        return False

    def 按前缀查找(self, 前缀):
        if 前缀 is None:
            raise ValueError("Missing 前缀")
        return [人物项 for 人物项 in self._成员列表
                if 人物项.获取姓名().startswith(前缀)]
```
:::end

:::lang cpp
```cpp
#include <string>
#include <vector>
#include <stdexcept>
#include <algorithm>
#include <utility>

class 人物 {
    std::string 姓名;
public:
    explicit 人物(std::string 姓名) : 姓名(std::move(姓名)) {
        if (this->姓名.empty()) throw std::invalid_argument("Invalid 姓名");
    }
    const std::string& 获取姓名() const { return 姓名; }
};

class 家庭 {
    std::vector<人物> 成员列表;
public:
    家庭() = default;
    int 获取成员数量() const { return static_cast<int>(成员列表.size()); }
    const 人物& 获取成员(std::size_t 索引) const { return 成员列表.at(索引); }

    void 添加成员(const 人物& 人物对象) {
        for (const auto& 当前成员 : 成员列表)
            if (当前成员.获取姓名() == 人物对象.获取姓名())
                throw std::invalid_argument("Already registered");
        成员列表.push_back(人物对象);
    }

    bool 删除成员(const std::string& 姓名) {
        auto it = std::find_if(成员列表.begin(), 成员列表.end(),
            [&](const 人物& 人物项) { return 人物项.获取姓名() == 姓名; });
        if (it == 成员列表.end()) return false;
        成员列表.erase(it);
        return true;
    }

    std::vector<人物> 按前缀查找(const std::string& 前缀) const {
        std::vector<人物> 结果;
        for (const auto& 人物项 : 成员列表)
            if (人物项.获取姓名().rfind(前缀, 0) == 0) 结果.push_back(人物项);
        return 结果;
    }
};
```
:::end

这个示例中的 `人物` 类只保存姓名，目的是避免让其他细节分散注意力。容器类负责决定哪些对象可以加入，并提供必要的查询功能。没有必要重复实现 `ArrayList` 的全部方法；容器类的重要目标恰恰是**限制**外部能够执行的操作。

## 索引与语言特性 {#indexing}

在 Java 中，我们通常用 `获取成员(index)` 这样的普通方法实现索引查询。C# 支持**索引器属性**，使 `家庭对象[0]` 这样的写法成为可能。Python 可以通过 `__getitem__()` 实现类似功能，而 C++ 可以重载 `operator[]`。这些机制只是为访问提供方便，并不意味着可以省略参数检查或访问控制。

:::lang java
```java
家庭 家庭对象 = new 家庭();
家庭对象.添加成员(new 人物("Anna Kovacs"));
人物 第一位成员 = 家庭对象.获取成员(0); // 通过方法进行已检查的访问
```
:::end

:::lang csharp
```csharp
// A 家庭 osztályba kerülhet ez a property:
public 人物 this[int 索引] {
    get { return 获取成员(索引); }
}
// Ekkor a használat: 人物 第一位成员 = 家庭对象[0];
```
:::end

:::lang python
```python
# A 家庭 osztályba kerülhet:
def __getitem__(self, 索引):
    return self.获取成员(索引)
# Ekkor a használat: 第一位成员 = 家庭对象[0]
```
:::end

:::lang cpp
```cpp
// A 家庭 osztályba kerülhet:
const 人物& operator[](std::size_t 索引) const {
    return 成员列表.at(索引);
}
// Ekkor a használat: const 人物& 第一位成员 = 家庭对象[0];
```
:::end

读取集合中的某个对象与替换某个对象是两种不同操作。只有在类的设计确实允许替换时，才应提供相应功能。这里的 `家庭` 类暂不提供替换方法，因为替换成员时必须再次执行与添加操作相同的检查。


## 练习 {#exercises}

在前面各章的练习基础上实现以下五个容器类。各字段、构造方法和方法的要求均在文字中写明，UML 图仅用于帮助理解。

:::exercise
### 矩形

![矩形 – UML](content/chapters/05-kontenerosztalyok/media/task-1-zh.svg){width=580}

在原有 `矩形` 练习的基础上，编写容器类 `矩形集合`。容器必须保护集合，只允许通过规定的方法进行操作。

**字段**

- `private 矩形列表 : ArrayList<矩形>`：内部列表，不允许直接返回或以公有字段公开。

**构造方法**

- `public 矩形集合()`：创建空列表。

**方法**

- `获取数量() : int`：返回当前保存的对象数量。
- `获取矩形(索引 : int) : 矩形`：返回指定索引的对象；索引不合法时抛出 `IndexOutOfBoundsException`。
- `添加矩形(矩形对象 : 矩形) : void`：不允许传入 `null`，否则抛出 `IllegalArgumentException`；同一对象引用不能重复加入，否则添加对象。
- `筛选大面积矩形(最小面积 : double) : ArrayList<矩形>`：将只返回面积严格大于参数值的矩形存入**新列表**并返回，不得泄露内部列表。

**主程序**

创建至少五个对象，分别验证正常添加、重复添加、合法和非法索引，以及筛选或统计操作。通过查询方法取得的对象自身仍可能允许修改，但外部代码不能直接替换或清空容器的内部列表。
:::endexercise

:::exercise
### 图书

![图书 – UML](content/chapters/05-kontenerosztalyok/media/task-2-zh.svg){width=580}

在原有 `图书` 练习的基础上，编写容器类 `图书馆`。容器必须保护集合，只允许通过规定的方法进行操作。

**字段**

- `private 图书列表 : ArrayList<图书>`：内部列表，不允许直接返回或以公有字段公开。

**构造方法**

- `public 图书馆()`：创建空列表。

**方法**

- `获取数量() : int`：返回当前保存的对象数量。
- `获取图书(索引 : int) : 图书`：返回指定索引的对象；索引不合法时抛出 `IndexOutOfBoundsException`。
- `添加图书(图书对象 : 图书) : void`：不允许传入 `null`，否则抛出 `IllegalArgumentException`；作者和书名均相同的书不能重复加入，否则添加对象。
- `按作者查找(作者 : String) : ArrayList<图书>`：将只返回作者与参数相同的图书；没有结果时返回空列表存入**新列表**并返回，不得泄露内部列表。
- `获取总价() : int`：计算所有图书的当前总价；空集合时返回 0。

**主程序**

创建至少五个对象，分别验证正常添加、重复添加、合法和非法索引，以及筛选或统计操作。通过查询方法取得的对象自身仍可能允许修改，但外部代码不能直接替换或清空容器的内部列表。
:::endexercise

:::exercise
### 汽车

![汽车 – UML](content/chapters/05-kontenerosztalyok/media/task-3-zh.svg){width=580}

在原有 `汽车` 练习的基础上，编写容器类 `车库`。容器必须保护集合，只允许通过规定的方法进行操作。

**字段**

- `private 汽车列表 : ArrayList<汽车>`：内部列表，不允许直接返回或以公有字段公开。

**构造方法**

- `public 车库()`：创建空列表。

**方法**

- `获取数量() : int`：返回当前保存的对象数量。
- `获取汽车(索引 : int) : 汽车`：返回指定索引的对象；索引不合法时抛出 `IndexOutOfBoundsException`。
- `添加汽车(汽车对象 : 汽车) : void`：不允许传入 `null`，否则抛出 `IllegalArgumentException`；同一对象引用不能重复加入，否则添加对象。
- `筛选高里程汽车(限值 : int) : ArrayList<汽车>`：将只返回里程严格大于参数值的汽车存入**新列表**并返回，不得泄露内部列表。

**主程序**

创建至少五个对象，分别验证正常添加、重复添加、合法和非法索引，以及筛选或统计操作。通过查询方法取得的对象自身仍可能允许修改，但外部代码不能直接替换或清空容器的内部列表。
:::endexercise

:::exercise
### 银行账户

![银行账户 – UML](content/chapters/05-kontenerosztalyok/media/task-4-zh.svg){width=580}

在原有 `银行账户` 练习的基础上，编写容器类 `银行`。容器必须保护集合，只允许通过规定的方法进行操作。

**字段**

- `private 账户列表 : ArrayList<银行账户>`：内部列表，不允许直接返回或以公有字段公开。

**构造方法**

- `public 银行()`：创建空列表。

**方法**

- `获取数量() : int`：返回当前保存的对象数量。
- `获取账户(索引 : int) : 银行账户`：返回指定索引的对象；索引不合法时抛出 `IndexOutOfBoundsException`。
- `添加账户(账户对象 : 银行账户) : void`：不允许传入 `null`，否则抛出 `IllegalArgumentException`；账号相同的账户不能重复加入，否则添加对象。
- `筛选高余额账户(金额 : int) : ArrayList<银行账户>`：将只返回余额严格大于参数值的账户存入**新列表**并返回，不得泄露内部列表。
- `获取总余额() : int`：汇总所有账户余额；空集合时返回 0。

**主程序**

创建至少五个对象，分别验证正常添加、重复添加、合法和非法索引，以及筛选或统计操作。通过查询方法取得的对象自身仍可能允许修改，但外部代码不能直接替换或清空容器的内部列表。
:::endexercise

:::exercise
### 电影

![电影 – UML](content/chapters/05-kontenerosztalyok/media/task-5-zh.svg){width=580}

在原有 `电影` 练习的基础上，编写容器类 `电影集合`。容器必须保护集合，只允许通过规定的方法进行操作。

**字段**

- `private 电影列表 : ArrayList<电影>`：内部列表，不允许直接返回或以公有字段公开。

**构造方法**

- `public 电影集合()`：创建空列表。

**方法**

- `获取数量() : int`：返回当前保存的对象数量。
- `获取电影(索引 : int) : 电影`：返回指定索引的对象；索引不合法时抛出 `IndexOutOfBoundsException`。
- `添加电影(电影对象 : 电影) : void`：不允许传入 `null`，否则抛出 `IllegalArgumentException`；片名和导演均相同的电影不能重复加入，否则添加对象。
- `筛选长电影(最低分钟 : int) : ArrayList<电影>`：将只返回时长严格大于参数值的电影存入**新列表**并返回，不得泄露内部列表。
- `获取平均时长() : double`：返回平均时长；空集合时返回 0。

**主程序**

创建至少五个对象，分别验证正常添加、重复添加、合法和非法索引，以及筛选或统计操作。通过查询方法取得的对象自身仍可能允许修改，但外部代码不能直接替换或清空容器的内部列表。
:::endexercise
