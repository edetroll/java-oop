# Container Classes

## The Container Class {#container-intro}

Until now, we have created classes that describe individual people, books, vehicles, and other objects. In a larger application, however, we usually work with a collection of instances rather than just one. For example, we may store students in a list, add new students, search for a particular person, or select students who satisfy a condition. If we implemented these operations repeatedly in the main program, we would duplicate checks and algorithms, and anyone with access to the list could modify its contents without restriction.

A **container class** manages a collection of instances of another class and controls which operations outside code may perform on that collection. For example, a `Family` class can store `Person` instances while providing its own methods to add, find, and remove family members. Its task is therefore not merely to store a list but to **maintain the collection in a controlled, valid state**. This is a *has-a* relationship rather than inheritance: a family contains people, but a family is not a special kind of person.

![Family–Person UML](content/chapters/05-kontenerosztalyok/media/family-en.svg){width=550}

## Protecting the Collection {#collection-protection}

Suppose we store family members in an `ArrayList<Person>` field. If the field is `public`, the main program can clear the entire list or insert objects without passing through our checks. We should therefore store the list in a `private` field and initialize it in the constructor. Even that is not sufficient, however, if we expose the list in some other way.

:::lang java
```java
class Family {
    public ArrayList<Person> members = new ArrayList<>();
}

Family family = new Family();
family.members.clear(); // all family members can be removed
```
:::end

:::lang csharp
```csharp
class Family {
    public List<Person> Members = new();
}

var family = new Family();
family.Members.Clear();
```
:::end

:::lang python
```python
class Family:
    def __init__(self):
        self.members = []

family = Family()
family.members.clear()
```
:::end

:::lang cpp
```cpp
class Family {
public:
    std::vector<Person> members;
};

Family family;
family.members.clear();
```
:::end

Making the field private while returning its reference from a public getter does not solve the problem. The caller receives the very same mutable collection and can bypass our checks through that reference. The following version therefore does not provide proper protection either.

:::lang java
```java
class Family {
    private final ArrayList<Person> members = new ArrayList<>();

    public ArrayList<Person> getMembers() {
        return members; // returns the same mutable list
    }
}
```
:::end

:::lang csharp
```csharp
class Family {
    private readonly List<Person> members = new();
    public List<Person> GetMembers() => members; // direct access to the list
}
```
:::end

:::lang python
```python
class Family:
    def __init__(self):
        self._members = []

    def get_members(self):
        return self._members  # exposes the internal list
```
:::end

:::lang cpp
```cpp
class Family {
private:
    std::vector<Person> members;
public:
    std::vector<Person>& getMembers() {
        return members; // reference to the internal collection
    }
};
```
:::end

Instead, we implement as public methods only those operations we actually want to allow. If callers need a list, we may return a copy or an unmodifiable view. A copy protects the list structure, but it does not necessarily protect the state of the objects referenced by its elements: callers may still modify an object if its own API permits it.

## Adding and Querying Objects {#operations}

First, we give `Family` a parameterless constructor that creates the private list. We then add methods for counting family members, retrieving a member by index, adding a member, and removing one. Each operation is responsible for validating its arguments; for example, an invalid index causes an exception. When adding a person, we reject `null` and, in this particular example, duplicate names. Another container may of course use a different rule for what counts as a duplicate.

The following example uses ordinary loops for searching. Removal by name returns a boolean indicating whether a match was found, while `findByPrefix()` collects matching family members into a **new list**. Therefore, adding items to or clearing the result does not modify the collection held by the container. Java is our primary language; the language tabs also show the corresponding solutions in C#, Python, and C++.

:::lang java
```java
import java.util.ArrayList;

class Person {
    private final String name;

    public Person(String name) {
        if (name == null || name.isBlank())
            throw new IllegalArgumentException("Invalid name");
        this.name = name;
    }

    public String getName() { return name; }
}

class Family {
    private final ArrayList<Person> members;

    public Family() { members = new ArrayList<>(); }

    public int getMemberCount() { return members.size(); }

    public Person getMember(int index) {
        if (index < 0 || index >= members.size())
            throw new IndexOutOfBoundsException("Invalid index");
        return members.get(index);
    }

    public void addMember(Person person) {
        if (person == null)
            throw new IllegalArgumentException("Missing person");
        for (Person current : members) {
            if (current.getName().equals(person.getName()))
                throw new IllegalArgumentException("Already registered");
        }
        members.add(person);
    }

    public boolean removeMember(String name) {
        for (int i = 0; i < members.size(); i++) {
            if (members.get(i).getName().equals(name)) {
                members.remove(i);
                return true;
            }
        }
        return false;
    }

    public ArrayList<Person> findByPrefix(String prefix) {
        if (prefix == null) throw new IllegalArgumentException("Missing prefix");
        ArrayList<Person> result = new ArrayList<>();
        for (Person person : members) {
            if (person.getName().startsWith(prefix)) result.add(person);
        }
        return result;
    }
}
```
:::end

:::lang csharp
```csharp
using System;
using System.Collections.Generic;

class Person {
    public string Name { get; }
    public Person(string name) {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Invalid name");
        Name = name;
    }
}

class Family {
    private readonly List<Person> members = new();
    public int GetMemberCount() => members.Count;

    public Person GetMember(int index) {
        if (index < 0 || index >= members.Count)
            throw new ArgumentOutOfRangeException(nameof(index));
        return members[index];
    }

    public void AddMember(Person person) {
        if (person == null) throw new ArgumentNullException(nameof(person));
        foreach (var current in members)
            if (string.Equals(current.Name, person.Name,
                    StringComparison.Ordinal))
                throw new ArgumentException("Already registered");
        members.Add(person);
    }

    public bool RemoveMember(string name) {
        for (int i = 0; i < members.Count; i++)
            if (string.Equals(members[i].Name, name,
                    StringComparison.Ordinal)) {
                members.RemoveAt(i);
                return true;
            }
        return false;
    }

    public List<Person> FindByPrefix(string prefix) {
        if (prefix == null) throw new ArgumentNullException(nameof(prefix));
        var result = new List<Person>();
        foreach (var person in members)
            if (person.Name.StartsWith(prefix, StringComparison.Ordinal))
                result.Add(person);
        return result;
    }
}
```
:::end

:::lang python
```python
class Person:
    def __init__(self, name):
        if not isinstance(name, str) or not name.strip():
            raise ValueError("Invalid name")
        self._name = name

    def get_name(self):
        return self._name

class Family:
    def __init__(self):
        self._members = []

    def get_member_count(self):
        return len(self._members)

    def get_member(self, index):
        if index < 0 or index >= len(self._members):
            raise IndexError("Invalid index")
        return self._members[index]

    def add_member(self, person):
        if person is None:
            raise ValueError("Missing person")
        if any(p.get_name() == person.get_name()
               for p in self._members):
            raise ValueError("Already registered")
        self._members.append(person)

    def remove_member(self, name):
        for i, person in enumerate(self._members):
            if person.get_name() == name:
                del self._members[i]
                return True
        return False

    def find_by_prefix(self, prefix):
        if prefix is None:
            raise ValueError("Missing prefix")
        return [p for p in self._members
                if p.get_name().startswith(prefix)]
```
:::end

:::lang cpp
```cpp
#include <string>
#include <vector>
#include <stdexcept>
#include <algorithm>
#include <utility>

class Person {
    std::string name;
public:
    explicit Person(std::string name) : name(std::move(name)) {
        if (this->name.empty()) throw std::invalid_argument("Invalid name");
    }
    const std::string& getName() const { return name; }
};

class Family {
    std::vector<Person> members;
public:
    Family() = default;
    int getMemberCount() const { return static_cast<int>(members.size()); }
    const Person& getMember(std::size_t index) const { return members.at(index); }

    void addMember(const Person& person) {
        for (const auto& current : members)
            if (current.getName() == person.getName())
                throw std::invalid_argument("Already registered");
        members.push_back(person);
    }

    bool removeMember(const std::string& name) {
        auto it = std::find_if(members.begin(), members.end(),
            [&](const Person& p) { return p.getName() == name; });
        if (it == members.end()) return false;
        members.erase(it);
        return true;
    }

    std::vector<Person> findByPrefix(const std::string& prefix) const {
        std::vector<Person> result;
        for (const auto& p : members)
            if (p.getName().rfind(prefix, 0) == 0) result.push_back(p);
        return result;
    }
};
```
:::end

In this example, `Person` stores only a name so that the container operations remain easy to follow. The container decides which instances it accepts and provides precisely the queries needed by its clients. We do not want to copy every method of `ArrayList`: the point of the container is to **restrict** the operations that are available.

## Indexing and Language-specific Features {#indexing}

In Java, indexed access is normally provided through a method such as `getMember(index)`. C# supports an **indexer property**, so a container can support expressions such as `family[0]`. Python offers `__getitem__()`, while C++ can overload `operator[]` for similar notation. These language features provide a convenient interface, but they do not replace argument validation or access control.

:::lang java
```java
Family family = new Family();
family.addMember(new Person("Anna Kovacs"));
Person first = family.getMember(0); // validated access through a method
```
:::end

:::lang csharp
```csharp
// A Family osztályba kerülhet ez a property:
public Person this[int index] {
    get { return GetMember(index); }
}
// Ekkor a használat: Person first = family[0];
```
:::end

:::lang python
```python
# A Family osztályba kerülhet:
def __getitem__(self, index):
    return self.get_member(index)
# Ekkor a használat: first = family[0]
```
:::end

:::lang cpp
```cpp
// A Family osztályba kerülhet:
const Person& operator[](std::size_t index) const {
    return members.at(index);
}
// Ekkor a használat: const Person& first = family[0];
```
:::end

Retrieving an object and replacing an object are different operations. We should allow replacement only if the rules of the class permit it. This `Family` class deliberately does not provide a replacement operation, since it would need to repeat the validation applied when a member is added.


## Exercises {#exercises}

Implement the following five container classes by extending the corresponding tasks from earlier chapters. Every field, constructor and method is specified in writing; the UML diagrams provide an additional overview.

:::exercise
### Rectangles

![Rectangles – UML](content/chapters/05-kontenerosztalyok/media/task-1-en.svg){width=580}

Extend the existing `Rectangle` task with a container class named `RectangleCollection`. The class shall protect the collection and expose only the operations described below.

**Fields**

- `private rectangles : ArrayList<Rectangle>` – an internal list, never returned directly or made available as a public field.

**Constructor**

- `public RectangleCollection()` – initialize an empty collection.

**Methods**

- `getCount() : int` – return the current number of stored objects.
- `getRectangle(index : int) : Rectangle` – return the object at the given index; throw `IndexOutOfBoundsException` if the index is invalid.
- `addRectangle(rectangle : Rectangle) : void` – reject `null` with `IllegalArgumentException`; the very same instance must not be added twice, otherwise add the item.
- `getLargeRectangles(minArea : double) : ArrayList<Rectangle>` – create and return a **new list** containing only objects with an area strictly greater than minArea; do not expose the internal list.

**Main program**

Create at least five objects. Check accepted and rejected insertions, valid and invalid indexes, and the selection or summary methods. A retrieved object may still be mutable, but the caller must not be able to replace or clear the container's internal list directly.
:::endexercise

:::exercise
### Books

![Books – UML](content/chapters/05-kontenerosztalyok/media/task-2-en.svg){width=580}

Extend the existing `Book` task with a container class named `Library`. The class shall protect the collection and expose only the operations described below.

**Fields**

- `private books : ArrayList<Book>` – an internal list, never returned directly or made available as a public field.

**Constructor**

- `public Library()` – initialize an empty collection.

**Methods**

- `getCount() : int` – return the current number of stored objects.
- `getBook(index : int) : Book` – return the object at the given index; throw `IndexOutOfBoundsException` if the index is invalid.
- `addBook(book : Book) : void` – reject `null` with `IllegalArgumentException`; do not accept another book with both the same title and the same author, otherwise add the item.
- `findBooksByAuthor(author : String) : ArrayList<Book>` – create and return a **new list** containing books whose author matches the argument; return an empty list when none match; do not expose the internal list.
- `getTotalPrice() : int` – return the sum of current prices; return 0 for an empty library.

**Main program**

Create at least five objects. Check accepted and rejected insertions, valid and invalid indexes, and the selection or summary methods. A retrieved object may still be mutable, but the caller must not be able to replace or clear the container's internal list directly.
:::endexercise

:::exercise
### Cars

![Cars – UML](content/chapters/05-kontenerosztalyok/media/task-3-en.svg){width=580}

Extend the existing `Car` task with a container class named `Garage`. The class shall protect the collection and expose only the operations described below.

**Fields**

- `private cars : ArrayList<Car>` – an internal list, never returned directly or made available as a public field.

**Constructor**

- `public Garage()` – initialize an empty collection.

**Methods**

- `getCount() : int` – return the current number of stored objects.
- `getCar(index : int) : Car` – return the object at the given index; throw `IndexOutOfBoundsException` if the index is invalid.
- `addCar(car : Car) : void` – reject `null` with `IllegalArgumentException`; do not insert the same object reference twice, otherwise add the item.
- `getCarsWithHighMileage(limit : int) : ArrayList<Car>` – create and return a **new list** containing cars whose mileage is strictly greater than limit; do not expose the internal list.

**Main program**

Create at least five objects. Check accepted and rejected insertions, valid and invalid indexes, and the selection or summary methods. A retrieved object may still be mutable, but the caller must not be able to replace or clear the container's internal list directly.
:::endexercise

:::exercise
### Bank Accounts

![Bank Accounts – UML](content/chapters/05-kontenerosztalyok/media/task-4-en.svg){width=580}

Extend the existing `BankAccount` task with a container class named `Bank`. The class shall protect the collection and expose only the operations described below.

**Fields**

- `private accounts : ArrayList<BankAccount>` – an internal list, never returned directly or made available as a public field.

**Constructor**

- `public Bank()` – initialize an empty collection.

**Methods**

- `getCount() : int` – return the current number of stored objects.
- `getAccount(index : int) : BankAccount` – return the object at the given index; throw `IndexOutOfBoundsException` if the index is invalid.
- `addAccount(account : BankAccount) : void` – reject `null` with `IllegalArgumentException`; do not allow two accounts with the same account number, otherwise add the item.
- `findAccountsAbove(amount : int) : ArrayList<BankAccount>` – create and return a **new list** containing accounts whose balance is strictly greater than amount; do not expose the internal list.
- `getTotalBalance() : int` – sum current balances; return 0 if empty.

**Main program**

Create at least five objects. Check accepted and rejected insertions, valid and invalid indexes, and the selection or summary methods. A retrieved object may still be mutable, but the caller must not be able to replace or clear the container's internal list directly.
:::endexercise

:::exercise
### Movies

![Movies – UML](content/chapters/05-kontenerosztalyok/media/task-5-en.svg){width=580}

Extend the existing `Movie` task with a container class named `MovieCollection`. The class shall protect the collection and expose only the operations described below.

**Fields**

- `private movies : ArrayList<Movie>` – an internal list, never returned directly or made available as a public field.

**Constructor**

- `public MovieCollection()` – initialize an empty collection.

**Methods**

- `getCount() : int` – return the current number of stored objects.
- `getMovie(index : int) : Movie` – return the object at the given index; throw `IndexOutOfBoundsException` if the index is invalid.
- `addMovie(movie : Movie) : void` – reject `null` with `IllegalArgumentException`; do not allow another movie with both the same title and the same director, otherwise add the item.
- `findLongMovies(minMinutes : int) : ArrayList<Movie>` – create and return a **new list** containing movies longer than minMinutes; do not expose the internal list.
- `getAverageDuration() : double` – arithmetic mean of the durations; return 0 when empty.

**Main program**

Create at least five objects. Check accepted and rejected insertions, valid and invalid indexes, and the selection or summary methods. A retrieved object may still be mutable, but the caller must not be able to replace or clear the container's internal list directly.
:::endexercise
