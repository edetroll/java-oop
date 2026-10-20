# Principles of OOP

The origins of **object-oriented programming (OOP)** are primarily associated with **Alan Kay**. According to his own recollections, he first used the term “object-oriented programming” around **1967**, and he was also responsible for the design of **Smalltalk**. It is often regarded as the first object-oriented language, although the earlier **Simula 67** language had already employed fundamental object-oriented concepts.

![Alan Kay](content/chapters/01-bevezetes/media/alankay.jpeg){width=420}

In object-oriented programming, we strive to **represent real-world objects in our source code** when solving tasks and problems, so that they consistently represent real-world objects and their behavior.

## Principles of object-oriented programming {#oop-principles}

- **Encapsulation:** to represent real-world objects, we create classes that combine an object's data (fields) and the methods that handle that data into a single unit. Access to the data can be controlled.
- **Inheritance:** if we want to create a class similar to one we have already implemented (and the existing class could provide a good foundation for the new one), we can designate the previously created class as the parent of the new class and inherit all its fields and methods (except constructors).
- **Polymorphism:** the same method call can result in different behavior for objects of different types. In the case of inheritance, this is made possible by dynamically selecting overridden methods.

Some approaches also consider abstraction to be one of the fundamental principles.

- **Abstraction:** the way of thinking through which we model objects in the world. We focus on the most important characteristics and functionality and do not concern ourselves with low-level information and algorithms.

## Classification of programming languages {#language-classification}

Depending on the extent to which programming languages apply the principles of OOP, they can be divided into the following three groups.

- Primarily procedural languages: e.g., C
- Multi-paradigm languages supporting OOP: e.g., C++, Java, C#, Python
- Languages with a consistently object-oriented approach: e.g., Smalltalk
