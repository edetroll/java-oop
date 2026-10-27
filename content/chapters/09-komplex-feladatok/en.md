# Complex Exercises

## Household Appliances {#haztartasi-gepek}

:::exercise

Create a Java application that stores information about household appliances, determines the energy class of individual appliances, and manages the inventory of a store selling household appliances. The `HouseholdAppliance` class represents household appliances in general, the derived `WashingMachine` class represents washing machines, and the `ApplianceStore` container class represents the collection of appliances.

The exercise includes the sample file [**machines_input_en.csv**](content/chapters/09-komplex-feladatok/media/machines_input_en.csv), whose records cover the years 2014–2024. For calculations involving the age and year of manufacture of an appliance, **use 2024 as the reference year**, so the results can be checked independently of when the exercise is completed. You may also use the supplied [**CsvInput.java** helper for reading the CSV file](content/chapters/09-komplex-feladatok/media/CsvInput.java).

### Household Appliance {#haztartasi-gep}

Create a class named `HouseholdAppliance` and implement the following fields, access methods, and operations. Store the fields with `private` visibility and provide access only through the specified getters and setters. If a new value would be invalid, reject the change by throwing an `IllegalArgumentException`.

**Fields and access**

- **Code (`code`)**: A `String` that cannot be changed from outside the class, so it must have only a public `getCode()` getter. The code must not be `null` or empty, may contain at most 13 characters, and may consist only of uppercase letters of the English alphabet, digits, and hyphens. Its first character must be an uppercase letter, its last character must be an uppercase letter or digit, and two hyphens must not occur consecutively.
- **Year of manufacture (`manufactureYear`)**: An integer in the interval `[2014; 2024]`. It cannot be changed from outside the class; its value must be accessible through the `getManufactureYear()` getter.
- **Small appliance (`smallAppliance`)**: A boolean value specified when the object is created and not modifiable afterward. Use the `isSmallAppliance()` method to retrieve its value.
- **Consumption (`consumption`)**: A `double` in the interval `[0.2; 2.5]`. Implement a public `getConsumption()` method and a `protected` `setConsumption(double value)` method. The setter must validate the new value and update the field only if the value is valid. Consumption must not be directly modifiable from outside the class.

**Constructors**

- The `HouseholdAppliance(String code, int manufactureYear, boolean smallAppliance, double consumption)` constructor must accept all four values, validate them, and store them.
- The `HouseholdAppliance(String code, boolean smallAppliance, double consumption)` constructor must invoke the preceding constructor and automatically set the year of manufacture to `2024`.

**Methods**

- **`energyClass(): int`**: A parameterless method that determines the appliance's energy class. Evaluate its consumption according to the following ranges. If, in 2024, more than five years have passed since the appliance was manufactured, worsen the resulting class by one, but do not allow it to exceed `5`.

- `[0.2; 0.6)` kWh: **energy class 1**; `[0.6; 1)` kWh: **energy class 2**; `[1; 1.5)` kWh: **energy class 3**; `[1.5; 2)` kWh: **energy class 4**; `[2; 2.5]` kWh: **energy class 5**.

- **`toString(): String`**: Override the method inherited from `Object` so that the resulting text includes the appliance's code, year of manufacture, whether it is a small or large appliance, its consumption, and its calculated energy class.
- **`equals(Object other): boolean`**: Consider two household appliances equal if their codes are identical, regardless of the concrete appliance types to which they belong. Return `false` if the argument is `null` or is of an unrelated type.
- **`hashCode(): int`**: Override this method so that the hash code is derived from the appliance code. Ensure that appliances considered equal by `equals()` have identical hash codes.

### Washing Machine {#mosogep}

Create a class named `WashingMachine` derived from `HouseholdAppliance`. A washing machine has all the data of its parent class but is always considered a large appliance. Store the additional fields with `private` visibility, and provide access to them through their public getters and setters.

**Fields and access**

- **Minimum water temperature (`minWaterTemperature`)**: An integer whose value may only be `20`, `25`, `30`, `35`, or `40`. Implement the `getMinWaterTemperature()` getter and the `setMinWaterTemperature(int value)` setter. The setter must throw an exception if the value is invalid.
- **Water consumption per wash (`waterConsumption`)**: A `double` in the interval `[4; 6]`. Access this field through the `getWaterConsumption()` and `setWaterConsumption(double value)` methods. The setter must validate the specified range.
- **Color (`color`)**: A field of enumeration type `Color`, which may take the values `WHITE`, `BLACK`, and `INOX`. Implement the `getColor()` and `setColor(Color value)` methods; do not accept `null`.

**Constructors**

- The `WashingMachine(String code, int manufactureYear, double consumption, int minWaterTemperature, double waterConsumption, Color color)` constructor must accept all the required values, invoke the appropriate constructor of the parent class with `smallAppliance` set to `false`, then validate and store the washing machine's own fields.
- The `WashingMachine(String code, int manufactureYear, double consumption, int minWaterTemperature, double waterConsumption)` constructor must delegate to the preceding constructor and automatically set the color to `WHITE`.

**Methods**

- **`setConsumption(double value): void`**: Override the parent's `protected` setter. For a washing machine, consumption is valid only in the interval `[0.5; 1.5]`; if the value is valid, use the parent class's setter to store it. The stricter restriction must also apply to the consumption specified in the constructor. The parent class constructor must perform the general validation, and the washing machine constructor must additionally enforce the stricter conditions.
- **`energyClass(): int`**: Override the method inherited from the parent class. First calculate `k = consumption · minWaterTemperature · waterConsumption`, then determine the energy class using the following ranges. Washing machines must use this separate calculation; do not worsen the result further on the basis of the year of manufacture.

- `[40; 75)`: **energy class 1**; `[75; 135)`: **energy class 2**; `[135; 210)`: **energy class 3**; `[210; 280)`: **energy class 4**; `[280; 360]`: **energy class 5**.

- **`toString(): String`**: Override the textual representation so that, in addition to the inherited data, it displays the minimum water temperature, water consumption per wash, color, and calculated energy class of the washing machine. You may use the parent class's `toString()` method to generate the text for the inherited data.

### Appliance Store {#haztartasi-bolt}

Create a container class named `ApplianceStore` for managing household appliances. The collection must not be directly accessible from outside the class, because appliances may only be added and retrieved through the class's public methods.

**Fields, constructor, and access**

- **Appliances (`machines`)**: A `private List<HouseholdAppliance>`. Create an empty list in the class constructor, and do not implement a getter that directly returns the internal list or a setter for that list.
- **Store name (`name`)**: A `String` with public `getName()` and `setName(String value)` methods. No additional validation is required for the assigned text.
- **`ApplianceStore(String name)`**: The constructor must create an empty list and set the store's name.

**Methods and queries**

- **`addMachine(HouseholdAppliance machine): void`**: Add the appliance passed as an argument only if it is not `null` and there is no appliance with the same code already in the list. Otherwise, throw an `IllegalArgumentException`. Use the implemented `equals()` method to detect duplicates.
- **`getOlderMachines(): List<HouseholdAppliance>`**: Create and return a new list containing appliances manufactured before 2019. Modifying the returned list must not affect the store's internal list.
- **`getWashingMachinesByEnergyClass(int energyClass): List<WashingMachine>`**: Collect into a new list the washing machines whose energy class matches the argument. The argument must be an integer from `1` to `5`; otherwise, throw an exception. Check each appliance's actual type during the query and perform a type cast when necessary.
- **`getMachineByCode(String code): HouseholdAppliance`**: Find the household appliance with the given code and return that instance. If no appliance with the specified code exists, return `null`. This method replaces the string-keyed indexer property available in C#.

### Main Program {#foprogram}

Create an `ApplianceStore` instance and assign an arbitrary name to the store. Read the enclosed semicolon-separated `machines_input_en.csv` file, create a `HouseholdAppliance` or `WashingMachine` object from each row, and add it to the store. Finally, display the results of the two filtering methods and test the search by appliance code. Use the appliances' `toString()` methods to display the results.

The first field of each record identifies the type of appliance. For rows marked `H`, the remaining fields are, in order: code, year of manufacture, the `small_appliance` (small appliance) or `large_appliance` (large appliance) label, and consumption. For rows marked `M`, the fields are: code, year of manufacture, consumption, minimum water temperature, water consumption per wash, and color. Colors in the file are represented by `white`, `black`, and `stainless_steel`; convert these to the corresponding values of the `Color` enumeration. Numbers use a dot as the decimal separator.

```text
H;ZEH-ITTW2Y82;2022;small_appliance;0.8
M;G3F72DF0EJ88;2019;0.9;40;5.3;white
```

The UML diagrams below show all the required fields, constructors, and methods of the three classes. The exercise can also be completed using only the written specification, without the diagrams.

![Household appliance class hierarchy](content/chapters/09-komplex-feladatok/media/appliance-uml-en.svg){width=790}

![Appliance store container class](content/chapters/09-komplex-feladatok/media/store-uml-en.svg){width=630}

:::endexercise
