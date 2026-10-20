# OOP alapelvek

Az **objektum-orientált programozás (OOP)** kialakulását elsősorban **Alan Kay** nevéhez kötjük. Az „objektum-orientált programozás” kifejezést saját visszaemlékezése szerint **1967** körül használta először és szintén az Ő nevéhez fűződik a **Smalltalk** megtervezése. Szokás ezt tekinteni az első objektumorientált nyelvnek, ugyanakkor az objektumorientált programozás alapvető fogalmait már a korábbi **Simula 67** nyelv is alkalmazta.

![Alan Kay](content/chapters/01-bevezetes/media/alankay.jpeg){width=420}

Az objektum-orientált programozás során arra törekszünk, hogy az egyes feladataink, problémáink esetén **a valós világ objektumait leképezzük a forráskódunkba** oly módon, hogy azok konzisztens módon reprezentálják a valós objektumokat és azok viselkedését.

## Az objektum-orientált programozás alapelvei {#oop-principles}

- **Egységbezárás:** a valós világ objektumainak leképezésére objektum-osztályokat hozunk létre, melyek egyetlen egységbe zárják az objektum adatait (mezőit) és az azokat kezelő metódusokat. Az adatokhoz való hozzáférést szabályozhatjuk.
- **Öröklődés:** amennyiben olyan osztályt szeretnénk készíteni, melyhez hasonlót már implementáltunk (és ez jó alapja lehetne az új osztálynak), akkor lehetőségünk van arra, hogy a korábban elkészített osztályt az új osztály őseként megjelöljük, és örököljük annak minden mezőjét és metódusát (a konstruktorok kivételével).
- **Többalakúság:** ugyanaz a metódushívás különböző típusú objektumok esetén eltérő viselkedést eredményezhet. Öröklődés esetén ezt a felülírt metódusok dinamikus kiválasztása teszi lehetővé.

Több olyan megközelítés is létezik, ahol az absztrakciót is az alapelvek közé sorolják.

- **Absztrakció**: az a gondolkodási mód, melynek során a világ objektumait leképezzük. Ilyenkor a lefontosabb jellemzőkre és funkcionalitásokra fókuszálunk, és nem foglalkozunk az alacsony szintű információkkal és algoritmusokkal.

## A programozási nyelvek osztályozása {#language-classification}

Attól függően, hogy az egyes programozási nyelvek milyen mértékben alkalmazzák az OOP alapelveit, az alábbi három csoportba sorolhatók.

- Elsősorban procedurális nyelvek: pl.: C
- Többparadigmás, OOP-t támogató nyelvek: pl.: C++, Java, C#, Python
- Következetesen objektumorientált szemléletű nyelvek: pl.: Smalltalk
