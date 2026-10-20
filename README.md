# OOP Atlas — statikus oktatási weboldal

## Indítás

A ZIP kicsomagolása után nyiss terminált a `java-oop-site` mappában, és futtasd:

```bash
python -m http.server 8000
```

Majd nyisd meg: http://localhost:8000

**Fontos:** Az `index.html` közvetlen megnyitása (`file://`) helyett helyi webszerver kell a Markdown/JSON fájlok beolvasásához. A szerver csak a fájlok kiszolgálására szolgál, nincs szükség adatbázisra vagy szerveroldali alkalmazásra. Publikálható statikus tárhelyen is.

## Új fejezet

1. Hozz létre egy új mappát a `content/chapters/` alatt (például `03-oroklodes`).
2. Adj hozzá `meta.json` fájlt a meglévő minták alapján (azonosító, sorrend, címek, leírások).
3. Készíts `hu.md` fájlt. Később `en.md` és `zh.md` is hozzáadható.
4. Futtasd: `python tools/update-manifest.py`
5. Frissítsd az oldalt. A menü csak azokat a fejezeteket jeleníti meg, amelyekhez legalább egy tényleges nyelvi fájl tartozik. A nyelvi elérhetőség is a fájlok alapján frissül.

A böngésző biztonsági korlátai miatt a mappák automatikus kilistázása nem lehetséges egy tisztán statikus oldalon. A manifestet ezért ez a rövid script generálja. GitHub Pages/Netlify esetén a generált `manifest.json` fájlt is publikálni kell.

## További tartalmak

- `content/glossary.json`: háromnyelvű szakszótár (kód nélkül)
- `content/phrases.json`: háromnyelvű oktatási kifejezéstár (kód nélkül)
- `assets/css/style.css`: megjelenés
- `assets/js/app.js`: menü, Markdown, nyelv- és témaváltás, osztott nézet, keresés

## Megjegyzések

- A két nyelv egymás mellett, külön panelben látszik. A pontos, alfejezetenkénti függőleges szinkronizálás még nincs megvalósítva.
- A két példafejezet **helykitöltő**, nem a végleges oktatási anyag.
- A Markdown alapvető címsorokat, listákat, kiemeléseket, idézeteket és kódblokkokat támogat. Komplex Markdown, UML és kódkiemelés egy későbbi fejlesztési kör feladata.
- A Google Fonts használata opcionális hálózati kapcsolatot igényel; nélkülük rendszerbetűtípusra vált.


## Programozási nyelvek közti váltás

A Markdown fájlban egymást követő `:::lang java`, `:::lang csharp`, `:::lang python` és `:::lang cpp` szakaszokat `:::end` zárja. Az egymást közvetlenül követő szakaszok egyetlen füles nyelvváltóvá állnak össze. A szakaszok teljes Markdown-tartalmat (magyarázatot és kódot) tartalmazhatnak. A Java legyen az első szakasz. Mintát a `content/chapters/01-bevezetes/hu.md` fájlban találsz.

A szintaxiskiemelés helyben működő, alapvető kiemelés, nem teljes nyelvi parser és nem pontos IntelliJ/Visual Studio/PyCharm színséma.

## Alfejezet-igazítás és rendezés

A Markdown második szintű címsoraihoz stabil azonosítót használj, amely ugyanaz mindhárom nyelvi verzióban: `## Osztályok {#classes}` és `## Classes {#classes}`. Split View esetén az azonos azonosítójú alfejezetek egymás melletti közös sorba kerülnek; a különböző hosszúságú szövegek emiatt nem csúsztatják el a következő alfejezetet. Az oldalsó navigáció ezekből a címsorokból épül. Az azonosítónak egy fejezeten belül egyedinek kell lennie.

A szótár és a kifejezéstár nyelvi oszlopfejléceire kattintva az adott nyelv szerint növekvő/csökkenő sorrend állítható be; a keresés továbbra is mindhárom nyelven működik.


### Ábrák és kódmásolás
A Markdown-képek a projekt gyökeréhez viszonyított elérési úttal szerepelnek (`content/chapters/.../media/...`). A feladatok egyszerű UML-vázlatai SVG-fájlokként jelennek meg; szerkeszthető Graphviz DOT-forrásuk ugyanott található. A kódblokkok másolásikonja a kód alatt található.
