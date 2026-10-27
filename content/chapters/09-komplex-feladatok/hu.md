# Komplex feladatok

## Háztartási gépek {#haztartasi-gepek}

:::exercise

Készítsen Java nyelvű alkalmazást, amely háztartási gépek adatait tárolja, lehetővé teszi az egyes gépek energiaosztályának meghatározását, valamint egy háztartási gépeket forgalmazó bolt készletének kezelését! A programban a `HouseholdAppliance` osztály az általános háztartási gépeket, az ebből származtatott `WashingMachine` osztály a mosógépeket, az `ApplianceStore` konténerosztály pedig a gépek gyűjteményét reprezentálja.

A feladat melléklete a [**machines_input.csv** mintafájl](content/chapters/09-komplex-feladatok/media/machines_input.csv), amelynek adatai a 2014–2024 közötti időszakból származnak. A feladatban az életkorhoz és a gyártási évhez kapcsolódó számításoknál **2024-et tekintjük viszonyítási évnek**, így az eredmények a feladat megoldásának időpontjától függetlenül ellenőrizhetők. A CSV-fájl feldolgozásához felhasználható a mellékelt [**CsvInput.java** beolvasó segédkód](content/chapters/09-komplex-feladatok/media/CsvInput.java) is.

### Háztartási gép {#haztartasi-gep}

Hozzon létre `HouseholdAppliance` néven osztályt, és implementálja az alábbi mezőket, hozzáférési lehetőségeket és műveleteket! A mezőket `private` láthatósággal tárolja, és csak az előírt getterekkel, illetve setterekkel biztosítson hozzáférést az adatokhoz. Amennyiben egy mező új értéke érvénytelen lenne, a módosítást utasítsa el `IllegalArgumentException` kivétel dobásával.

**Mezők és hozzáférés**

- **Kód (`code`)**: `String` típusú adat, amely kívülről nem módosítható, tehát kizárólag publikus `getCode()` getterrel rendelkezzen. A kód nem lehet `null` vagy üres szöveg, legfeljebb 13 karakter hosszú lehet, és csak az angol ábécé nagybetűit, számjegyeket és kötőjelet tartalmazhat. Első karaktere csak nagybetű, utolsó karaktere nagybetű vagy számjegy lehet, továbbá két kötőjel közvetlenül nem követheti egymást.
- **Gyártási év (`manufactureYear`)**: egész szám, értéke a `[2014; 2024]` intervallumban legyen. Kívülről nem módosítható; értékét a `getManufactureYear()` getterrel lehessen lekérdezni.
- **Kisgép-e (`smallAppliance`)**: logikai típusú adat. Értékét a példány létrehozásakor kell megadni, később nem módosítható; lekérdezésére az `isSmallAppliance()` metódus szolgáljon.
- **Fogyasztás (`consumption`)**: `double` típusú adat, amelynek értéke a `[0,2; 2,5]` intervallumban érvényes. A mezőhöz készítse el a publikus `getConsumption()` metódust és a `protected` láthatóságú `setConsumption(double value)` metódust! A setter vizsgálja meg az új értéket, majd helyes bemenet esetén módosítsa a mezőt. A fogyasztást az osztályon kívül közvetlenül ne lehessen megváltoztatni.

**Konstruktorok**

- A `HouseholdAppliance(String code, int manufactureYear, boolean smallAppliance, double consumption)` konstruktor kérje be és ellenőrzés után tárolja el mind a négy adatot.
- A `HouseholdAppliance(String code, boolean smallAppliance, double consumption)` konstruktor az előző konstruktor meghívásával hozza létre a példányt, a gyártási évet automatikusan állítsa `2024`-re.

**Metódusok**

- **`energyClass(): int`**: paraméter nélküli metódus, amely a háztartási gép energiaosztályát határozza meg. Az osztályozás során a fogyasztást az alábbi táblázat szerint értékelje! Ha a gép 2024-ben már több mint öt éve készült, az eredmény egy osztállyal romlik, de az energiaosztály értéke ebben az esetben sem lehet nagyobb `5`-nél.

- `[0,2; 0,6)` kWh: **1. energiaosztály**; `[0,6; 1)` kWh: **2. energiaosztály**; `[1; 1,5)` kWh: **3. energiaosztály**; `[1,5; 2)` kWh: **4. energiaosztály**; `[2; 2,5]` kWh: **5. energiaosztály**.

- **`toString(): String`**: írja felül az `Object` osztálytól örökölt metódust úgy, hogy az eredmény tartalmazza a gép kódját, gyártási évét, kisgép- vagy nagygép-jellegét, fogyasztását és számított energiaosztályát.
- **`equals(Object other): boolean`**: két háztartási gépet tekintsen azonosnak, ha a kódjuk megegyezik, függetlenül attól, hogy a két példány milyen konkrét géptípushoz tartozik. A metódus hamis értékkel térjen vissza `null` vagy más típusú paraméter esetén.
- **`hashCode(): int`**: írja felül a metódust úgy, hogy a kód alapján állítsa elő a hashértéket! Biztosítsa, hogy az `equals()` által egyenlőnek tekintett gépek hashkódja megegyezzen.

### Mosógép {#mosogep}

Hozzon létre `WashingMachine` néven osztályt, amely a `HouseholdAppliance` osztályból származik! A mosógép az ősosztály összes adatával rendelkezik, de minden esetben nagygépnek számít. A további mezőket `private` láthatósággal tárolja, és a hozzájuk tartozó publikus gettereken és settereken keresztül tegye elérhetővé.

**Mezők és hozzáférés**

- **Minimum vízhőmérséklet (`minWaterTemperature`)**: egész szám, amely csak `20`, `25`, `30`, `35` vagy `40` lehet. Készítse el a `getMinWaterTemperature()` gettert és a `setMinWaterTemperature(int value)` settert! Érvénytelen érték esetén a setter dobjon kivételt.
- **Vízfogyasztás mosásonként (`waterConsumption`)**: `double` típusú adat, mely a `[4; 6]` intervallumban érvényes. A mezőt a `getWaterConsumption()` és a `setWaterConsumption(double value)` metódusokon keresztül lehessen kezelni, a setter a megadott intervallum szerint validáljon.
- **Szín (`color`)**: `Color` felsorolás típusú mező, amely a `WHITE`, `BLACK` és `INOX` értékeket veheti fel. Készítse el a `getColor()` és `setColor(Color value)` metódusokat; `null` értéket ne fogadjon el.

**Konstruktorok**

- A `WashingMachine(String code, int manufactureYear, double consumption, int minWaterTemperature, double waterConsumption, Color color)` konstruktor kérje be az összes szükséges adatot, az ősosztály megfelelő konstruktorának meghívásával a `smallAppliance` értékét állítsa hamisra, majd ellenőrizze és mentse el a mosógép saját mezőit is.
- A `WashingMachine(String code, int manufactureYear, double consumption, int minWaterTemperature, double waterConsumption)` konstruktor az előző konstruktor meghívásával működjön, a színt automatikusan `WHITE` értékre állítsa.

**Metódusok**

- **`setConsumption(double value): void`**: írja felül az ősosztály `protected` setterét! Mosógép esetén a fogyasztás csak a `[0,5; 1,5]` intervallumba eshet; helyes bemenet esetén az értéket az ősosztály setterének felhasználásával tárolja el. A szigorúbb ellenőrzés a konstruktorban megadott fogyasztásra is vonatkozzon. Az ősosztály konstruktorában az általános ellenőrzés történjen meg, a mosógép konstruktorában pedig a szigorúbb feltételeket is érvényesítse.
- **`energyClass(): int`**: írja felül az ősosztály metódusát! Először számítsa ki a `k = consumption · minWaterTemperature · waterConsumption` szorzatot, majd ennek értékéből határozza meg az energiaosztályt az alábbi táblázat alapján. A mosógépeknél ezt a külön számítási szabályt kell alkalmazni; a gyártási év alapján már ne rontsa tovább az eredményt.

- `[40; 75)`: **1. energiaosztály**; `[75; 135)`: **2. energiaosztály**; `[135; 210)`: **3. energiaosztály**; `[210; 280)`: **4. energiaosztály**; `[280; 360]`: **5. energiaosztály**.

- **`toString(): String`**: írja felül a szöveges megjelenítést úgy, hogy az örökölt adatokon túl a minimum vízhőmérséklet, a mosásonkénti vízfogyasztás, a szín és a mosógép számított energiaosztálya is megjelenjen. Az örökölt adatok szöveges előállításához felhasználhatja az ősosztály `toString()` metódusát.

### Háztartási gépek boltja {#haztartasi-bolt}

Hozzon létre `ApplianceStore` néven konténerosztályt a háztartási gépek kezelésére! A gyűjteményhez kívülről ne lehessen közvetlenül hozzáférni, mert a gépek felvétele és lekérdezése kizárólag az osztály publikus metódusain keresztül történhet.

**Mezők, konstruktor és hozzáférés**

- **Gépek (`machines`)**: `private List<HouseholdAppliance>` típusú lista. Az osztály konstruktorában hozza létre az üres listát, és ne készítsen hozzá a belső listát közvetlenül visszaadó gettert vagy settert.
- **Bolt neve (`name`)**: `String` típusú adat. Legyen hozzá publikus `getName()` és `setName(String value)` metódus; a beállított szövegre nem szükséges további ellenőrzést végeznie.
- **`ApplianceStore(String name)`**: a konstruktor hozza létre az üres listát, és állítsa be a bolt nevét.

**Metódusok és lekérdezések**

- **`addMachine(HouseholdAppliance machine): void`**: a paraméterben kapott gépet csak akkor helyezze el a listában, ha az nem `null`, és a listában még nem szerepel vele azonos kódú gép. Ellenkező esetben dobjon `IllegalArgumentException` kivételt. Az ismétlődés megállapításához az osztályokban implementált `equals()` metódust használja.
- **`getOlderMachines(): List<HouseholdAppliance>`**: állítson elő és adjon vissza új listát azokkal a gépekkel, amelyeket 2019 előtt gyártottak! A visszaadott lista módosítása nem befolyásolhatja a bolt belső listáját.
- **`getWashingMachinesByEnergyClass(int energyClass): List<WashingMachine>`**: gyűjtse új listába azokat a mosógépeket, amelyek energiaosztálya megegyezik a paraméterrel! A paraméter csak `1` és `5` közötti egész lehet, más érték esetén dobjon kivételt. A lekérdezés során ellenőrizze az egyes gépek tényleges típusát, majd szükség esetén végezzen típuskonverziót.
- **`getMachineByCode(String code): HouseholdAppliance`**: keresse meg a paraméterben kapott kódhoz tartozó háztartási gépet, és térjen vissza a megtalált példánnyal! Ha nincs ilyen kódú gép, a metódus `null` értékkel térjen vissza. Ez a művelet helyettesíti a C#-ban használható, szöveges kulccsal indexelő property-t.

### Főprogram {#foprogram}

Hozzon létre egy `ApplianceStore` példányt, és állítsa be a bolt nevét egy tetszőleges szövegre! Olvassa be a mellékelt `machines_input.csv` pontosvesszővel tagolt fájlt, és az egyes sorok alapján készítsen `HouseholdAppliance`, illetve `WashingMachine` példányokat, majd adja hozzá azokat a bolthoz. A program végén jelenítse meg a két kiválogatás eredményét, és próbálja ki a kód alapján történő keresést is. Az eredmények megjelenítéséhez használja a gépek `toString()` metódusát!

A mintafájlban az első mező a gép típusát azonosítja. `H` jelölés esetén a sor további adatai sorrendben: kód, gyártási év, `kisgep` vagy `nagygep` jelölés, fogyasztás. `M` jelölés esetén a mezők: kód, gyártási év, fogyasztás, minimum vízhőmérséklet, mosásonkénti vízfogyasztás, szín. A fájlban a színek `feher`, `fekete` és `inox` alakban szerepelnek; ezeket a program a `Color` felsorolás megfelelő értékeire alakítsa. A számértékek tizedeselválasztója pont.

```text
H;ZEH-ITTW2Y82;2022;kisgep;0.8
M;G3F72DF0EJ88;2019;0.9;40;5.3;feher
```

Az alábbi UML-ábrák a három osztály valamennyi előírt mezőjét, konstruktorát és metódusát tartalmazzák. A feladat a diagramok nélkül, a szöveges leírás alapján is megoldható.

![A háztartási gépek osztályhierarchiája](content/chapters/09-komplex-feladatok/media/appliance-uml.svg){width=790}

![A háztartási gépek boltja](content/chapters/09-komplex-feladatok/media/store-uml.svg){width=630}

:::endexercise
