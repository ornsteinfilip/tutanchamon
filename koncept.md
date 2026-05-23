# Koncept 3D hříčky: Hrobka faraona Tutanchamona

## 1. Základní záměr

Hříčka je krátká atmosférická 3D prohlídka hrobky KV62, v níž hráč jako objevitel postupuje temnou chodbou s loučí. Vidí jen nejbližší okolí v teplém světle plamene. Každý odhalený úsek představuje jednu část příběhu Tutanchamona, jeho hrobky nebo jejího objevení.

Hra se po načtení nejdřív otevře krátkým splash screenem s pohledem na stylizovanou egyptskou pyramidu při západu slunce. Po něm nezačíná dlouhé menu, ale přímý vstup do hry u zapečetěného vstupu do hrobky. Pyramida zde funguje jako čitelný symbol Egypta pro úvodní náladu; historická část hry zároveň jasně vysvětlí, že skutečná Tutanchamonova hrobka KV62 leží v Údolí králů, ne uvnitř pyramidy.

Primární cíl není akce, ale objevování:

- projít stylizovanou hrobkou po předem určené trase,
- postupně odkrývat mapku hrobky,
- poznat klíčové osoby, místa, předměty a fakta,
- katalogizovat alespoň 10 konkrétních předmětů z hrobky do inventáře,
- dojít až do hlavních komor s poklady a ostatky faraona.

Poznámka k přesnosti: zadání zmiňuje "ostatky ženy". Pro historicky přesnou verzi koncept počítá s tím, že v pohřební komoře jsou ostatky Tutanchamona. Královna Anchesenamon je ve hře přítomná přes příběhové informace a výjev na trůnu, ne jako nalezené ostatky. V pokladnici byly také dvě malé mumie plodů nebo novorozenců, často vykládané jako Tutanchamonovy dcery, ale nejde o ostatky dospělé ženy nebo královny.

## 2. Doporučený přístup

### Doporučení: lineární muzejní průchod s lehkým sběrem

Hráč jde po pevné trase. V každém segmentu může krátce zpomalit, nasvítit předmět, přečíst informační box a přidat záznam do inventáře. Tento přístup nejlépe odpovídá zadání, protože drží atmosféru temné chodby, umožní kontrolovat historický obsah a je technicky jednoduchý pro Three.js.

### Alternativy

| Přístup | Výhody | Nevýhody |
|---|---|---|
| Volná explorace celé hrobky | Působí více jako hra | Větší nároky na navigaci, kameru, kolize a obsah |
| Statická 3D prezentace s klikáním | Nejjednodušší výroba | Slabší pocit objevování a pohybu v temnotě |
| Lineární průchod s inventářem | Dobrá atmosféra, kontrolovaný vzdělávací obsah | Menší volnost hráče |

## 3. Vizuální a zvuková atmosféra

Styl:

- low-poly 3D,
- pískovcové chodby s jednoduchými egyptskými texturami,
- teplé světlo louče proti téměř černému okolí,
- předměty zvýrazněné jen po nasvícení,
- jednoduché ikonické tvary místo realistické rekonstrukce,
- decentní hieroglyfické pásy na stěnách.

Zvuky:

- kroky na kameni,
- praskání louče,
- nízký ambientní tón hrobky,
- zvuk posunu kamene nebo pečetě při vstupu do nového segmentu,
- jemné cinknutí při katalogizaci předmětu,
- hlubší zvuk při otevření komory.

### Úvodní splash screen

Splash screen je krátká atmosférická scéna před začátkem hry:

- kamera se dívá na nízkopoly stylizovanou pyramidu v poušti při západu slunce,
- slunce je nízko za pyramidou a vytváří dlouhé stíny v písku,
- barevnost přechází z teplé oranžové u horizontu do tmavší fialové oblohy,
- v popředí je písek, kameny, vítr a slabé světlo pochodně,
- název hry se objeví bez velkého menu,
- po načtení se obraz pomalu zatmí a hra začne přímo u vstupu do hrobky,
- splash může obsahovat krátkou faktickou poznámku: `Symbolický úvod. Skutečná hrobka KV62 leží v Údolí králů.`

```text
+--------------------------------------------------------------------------------+
|                                                                                |
|                         HROBKA TUTANCHAMONA                                    |
|                                                                                |
|                            zapadajici slunce                                   |
|                                  \ | /                                         |
|                                --  O  --                                       |
|                                  / | \                                         |
|                                  /\                                            |
|                                 /  \                                           |
|                                /____\                                          |
|                              _/______\_                                        |
|                         dlouhe stiny v poustnim pisku                          |
|                                                                                |
|                  Symbolicky pohled na Egypt pred vstupem do KV62               |
|                                                                                |
|                         Nacitani...                                            |
+--------------------------------------------------------------------------------+
```

## 4. Rozložení obrazovky

Chodba vede diagonálně přes obrazovku. Konce mizí ve tmě. Prostor mimo diagonálu slouží jako informační plocha.

```text
+--------------------------------------------------------------------------------+
| MAPA OBJEVOVANI                         | INFORMACNI BOX                       |
|                                          |                                      |
| [Vstup]--[Chodba]--[Predsin]            | Predmet: Zlaty trun                  |
|                       |                  | Misto: predsin KV62                  |
|                    [Komora]--[Poklad.]  |                                      |
|                                          | Kratky text: trun ukazuje faraona    |
|                                          | s kralovnou Anchesenamon.            |
|                                                                                |
|                       tma                                                      |
|                  #######                                                       |
|              ####  @  ####                                                     |
|          ####   svetlo louce  ####                                             |
|      ####========================####                                           |
|  tma        diagonalni chodba          tma                                      |
|                                                                                |
| INVENTAR: [louc] [maska] [trun] [senet] [dyka] [Anubis]                        |
| STAV: Segment 4/8 | Objeveno: 6/12 predmetu | Cil: najdi vstup do pohrebni komory |
| NAPOVEDA: W/S pohyb | mys louc | E prohlednout | I inventar | M mapa | H pomoc |
+--------------------------------------------------------------------------------+
```

## 5. Jednoduchá mapa hrobky

Pro hříčku stačí zjednodušený plán KV62. Hráč nemusí řešit realistickou metrologii, ale místnosti a jejich vztahy by měly odpovídat skutečné struktuře.

```text
        [Schodiste / vstup]
                 |
        [Sikma vstupni chodba]
                 |
              [Predsin] -------- [Annex]
                 |
          [Pohrebni komora] ---- [Pokladnice]
```

Základní charakter hrobky:

- jde o hrobku KV62 v Údolí králů,
- je výrazně menší než velké královské hrobky významnějších faraonů,
- má krátký, kompaktní půdorys s několika místnostmi,
- pohřební komora je hlavní zdobená část,
- význam hrobky vychází hlavně z toho, že byla nalezena téměř neporušená a obsahovala obrovské množství předmětů.

### Srovnání s ostatními královskými hrobkami

Tutanchamon nebyl nejmocnější ani nejdéle vládnoucí faraon. Jeho hrobka je slavná hlavně proto, že se dochovala mimořádně neporušená a plná předmětů. Ve hře se to má ukázat přímo prostorem: hráč projde spíš malou, stísněnou a zaplněnou hrobkou, ne obrovským podzemním chrámem.

| Rozdíl | KV62 - Tutanchamon | Velké královské hrobky významnějších faraonů | Jak to ukázat ve hře |
|---|---|---|---|
| Velikost | Malá a kompaktní hrobka s krátkou vstupní cestou a několika místnostmi. | Často rozsáhlejší soustavy chodeb, síní a vedlejších prostor. | Mapka KV62 se rychle zaplní; vedle ní krátce zobrazit šedý obrys "typické velké hrobky" jako mnohem delší siluetu. |
| Výzdoba | Zdobená je hlavně pohřební komora; ostatní prostory jsou jednodušší. | U významných královských hrobek bývá výzdoba rozsáhlejší a pokrývá více chodeb a komor. | Vstup a předsíň držet skoro bez maleb, výraznější malby ukázat až v pohřební komoře. |
| Předměty | Mnoho předmětů bylo uloženo velmi nahuštěně, skoro jako sklad pokladů a výbavy. | Vykradené nebo větší hrobky často nepůsobí jako takto zachovaný "časový trezor". | V předsíni a annexu nechat předměty stát blízko u sebe, hráč je odhaluje loučí po částech. |
| Důvod slávy | Sláva vychází hlavně ze zachování hrobky a bohatství nálezů. | Větší panovníci mohli mít monumentálnější hrobky, ale jejich výbava se často nedochovala tak úplně. | Informační box vysvětlí: "malá hrobka, obrovský nález". |
| Možný důvod skromnosti | Mladý král zemřel brzy; hrobka mohla být připravena nebo upravena ve spěchu. | Dlouho vládnoucí faraoni měli více času a prostředků na rozsáhlejší pohřební projekty. | Segment 2 přidá krátkou kartu "Proč tak malá hrobka?" se zdroji S01 a S05. |

Herní pointa srovnání: hráč nemá odejít s dojmem, že Tutanchamon měl největší hrobku. Má pochopit opak: KV62 byla relativně malá a skromná stavbou, ale výjimečná zachováním a množstvím nálezů.

## 6. Herní smyčka

```text
splash screen s pyramidou
      |
      v
zatmeni a presun ke vstupu KV62
      |
      v
vstup do segmentu
      |
      v
nasviceni prostoru louci
      |
      v
objeveni predmetu nebo faktu
      |
      v
kratka interakce: prohlednout / katalogizovat / otevrit
      |
      v
zapis do inventare a odkryti casti mapy
      |
      v
odemceni dalsiho segmentu
```

Ovládání může být velmi jednoduché:

- `W/S` nebo šipky: posun vpřed/vzad po trase,
- myš: lehké směrování louče,
- `E`: prohlédnout nebo katalogizovat předmět,
- `I`: otevřít inventář,
- `M`: zvětšit mapu,
- `H`: zobrazit nápovědu ovládání,
- `Z`: zobrazit použité historické zdroje.

## 7. Nápověda ovládání

Hra má dvě úrovně nápovědy:

- stručná nápovědní lišta je stále viditelná ve spodní části obrazovky,
- detailní nápověda se vyvolá klávesou `H` a nezastaví rozehraný stav hry.

```text
+------------------------------------------------------------------+
| NAPOVEDA OVLADANI                                                |
+----------------------+-------------------------------------------+
| W / S nebo sipky     | pohyb vpřed a vzad po trase hrobkou        |
| mys                  | smer louce a prohledavani blizkeho okoli   |
| E                    | prohlednout misto nebo katalogizovat nalez  |
| I                    | otevrit nalezovy denik a inventar           |
| M                    | zvetsit mapu objevene casti hrobky          |
| Z                    | zobrazit historicke zdroje                  |
| H                    | zavrit / otevrit tuto napovedu              |
| Esc                  | zpet do hry                                 |
+------------------------------------------------------------------+
```

Nápověda by měla používat krátké popisky a ikonky kláves. Při první interakci s předmětem se může krátce zvýraznit řádek `E prohlednout`, aby hráč pochopil základní smyčku objevování.

## 8. Segmenty průchodu

| Segment | Místo | Téma | Klíčová informace | Příklad interakce |
|---|---|---|---|---|
| 1 | Vstup do hrobky | Objev roku 1922 | Hrobku objevil tým Howarda Cartera, financovaný lordem Carnarvonem. První schod byl nalezen 4. listopadu 1922. | Odhrnout písek a odhalit schod |
| 2 | Vstupní chodba | Proč byla hrobka výjimečná | KV62 byla malá, kompaktní a skromněji zdobená než mnohé jiné královské hrobky, ale mimořádná tím, jak se dochovala a kolik předmětů obsahovala. | Nasvítit porušené pečeti a zobrazit srovnávací siluetu větší hrobky |
| 3 | Předsíň | První pohled do pokladů | Carter 26. listopadu 1922 nahlédl do předsíně a viděl "úžasné věci". | Otevřít průzor do temné místnosti |
| 4 | Předsíň | Královská výbava | Rozebrané vozy, pohřební lůžka, trůn a strážní sochy ukazují bohatost pohřební výbavy. | Katalogizovat trůn a části vozu |
| 5 | Annex | Každodennost a zásoby | Hrobka obsahovala také nádoby, koše, hry, oleje, potraviny a praktické věci pro posmrtný život. | Najít hru senet |
| 6 | Pohřební komora | Ostatky faraona | V sarkofágu byly rakve a mumie mladého krále. | Nasvítit sarkofág |
| 7 | Pohřební komora | Smrt a sláva Tutanchamona | Zemřel mladý, kolem 18-19 let. Slavný je hlavně díky téměř neporušené hrobce. | Odkrýt zlatou masku jako informační kartu |
| 8 | Pokladnice | Rituální předměty | Pokladnice obsahovala kanopickou schránu, svatyni Anubise a další rituální objekty. | Aktivovat závěrečný přehled nálezů |

## 9. Osoby

| Osoba | Role ve hře | Fakta pro informační boxy |
|---|---|---|
| Tutanchamon | Ústřední historická postava | Faraon 18. dynastie, vládl asi devět let a stal se králem jako dítě. Původně byl spojen se jménem Tutanchaton, později s návratem ke kultu Amona. |
| Anchesenamon / Ankhesenamun | Kontext královské rodiny | Manželka Tutanchamona. Ve hře se objeví hlavně přes výjev na zlatém trůnu. Její hrob ani mumie nejsou bezpečně identifikované jako součást KV62. |
| Achnaton | Předchozí náboženský zlom | Faraon spojený s reformou kultu Atona. Slouží jako vysvětlení změny jména a návratu k Amonovi. |
| Aj / Ay | Nástupnictví po Tutanchamonovi | Významný dvořan a pozdější faraon po Tutanchamonově smrti. V anglických zdrojích se často píše Ay. |
| Howard Carter | Vedoucí archeologického výzkumu | Britský archeolog, vedl tým, který v roce 1922 odkryl vstup do KV62 a dokumentoval nález. |
| Lord Carnarvon | Financování expedice | Mecenáš Carterova výzkumu v Údolí králů. |
| Egyptští dělníci a předáci expedice | Skutečná práce v terénu | Hra by měla stručně připomenout, že objev nebyl jen práce Cartera, ale také místních pracovníků a egyptských předáků. |
| Harry Burton | Dokumentace nálezu | Fotograf, jehož snímky významně zachytily stav hrobky a předmětů. |

## 10. Předměty pro inventář

Inventář není myšlený jako vykrádání hrobky. Hráč "sbírá" katalogizační karty nálezů: po nasvícení a interakci se předmět přidá jako záznam s ikonou, krátkým popisem a místem nálezu.

| ID | Předmět | Místo | Typ interakce | Krátký fakt |
|---|---|---|---|---|
| A01 | Zlatá pohřební maska | Pohřební komora | Závěrečné prohlédnutí | Nejznámější obraz Tutanchamona, kryla hlavu a ramena mumie. |
| A02 | Kvarcitový sarkofág | Pohřební komora | Nasvítit víko | V něm byly uloženy rakve s mumií. |
| A03 | Zlatá vnitřní rakev | Pohřební komora | Odemknout po sarkofágu | Nejvnitřnější ze tří rakví chránících tělo faraona byla ze zlata. |
| A04 | Kanopická výbava | Pokladnice | Otevřít informační detail | Kanopická svatyně a kalcitová schrána souvisely s uložením vnitřních orgánů zemřelého. |
| A05 | Svatyně s Anubisem | Pokladnice | Nasvítit siluetu | Anubis byl spojen s mumifikací a ochranou mrtvých. |
| A06 | Zlatý trůn | Předsíň | Katalogizovat | Zobrazuje Tutanchamona s Anchesenamon v intimní královské scéně. |
| A07 | Rozebraný královský vůz | Předsíň | Složit do ikony | Hrobka obsahovala několik vozů a velké množství jejich částí; bezpečnější je neoznačovat každý vůz jako válečný. |
| A08 | Rituální lehátko se zvířecí hlavou | Předsíň | Prohlédnout siluetu | Pohřební lehátka měla výrazné stylizované zvířecí tvary. |
| A09 | Dvě strážní sochy | Předsíň / vstup ke komoře | Obejít a nasvítit | Strážní postavy symbolicky chrání vstup do pohřební komory. |
| A10 | Herní skříňka / senet | Annex | Sebrat kartu | Herní skříňka z annexu ukazuje každodenní i symbolický rozměr posmrtné výbavy. |
| A11 | Dýka z meteoritického železa | Pohřební komora | Detail přes inventář | Výzkum složení čepele podporuje meteoritický původ železa. |
| A12 | Modelová loď | Pokladnice / Annex | Otočit model | V hrobce bylo více modelových lodí, spojených s cestou a posmrtným životem. |
| A13 | Alabastrový lotosový pohár | Předsíň | Prozkoumat texturu | Pohár ve tvaru lotosu symbolicky přeje králi dlouhý život a obnovu. |
| A14 | Vějíř z pštrosího peří | Pohřební komora | Katalogizační karta | Slavný vějíř z pohřební komory původně nesl střídavě hnědá a bílá pštrosí pera. |

### Faktická revize předmětů

Tahle tabulka je pracovní kontrola pro školní verzi. U každého předmětu shrnuje, jestli je v konceptu ponechaný beze změny, nebo kde je potřeba hlídat přesnou formulaci.

| ID | Výsledek ověření | Zdroj |
|---|---|---|
| A01 | Správně: zlatá maska ležela přes hlavu a ramena Tutanchamonovy mumie. | S02, S06 |
| A02 | Správně: sarkofág byl v pohřební komoře, uvnitř soustavy svatyní a s rakvemi. Materiál držet jako kvarcitový/stone sarcophagus, bez zbytečných rozměrů. | S01, S02, S05 |
| A03 | Správně: nejvnitřnější ze tří rakví byla zlatá. | S01, S02 |
| A04 | Správně po zpřesnění: nepoužívat jen "kanopická nádoba", ale širší kanopická výbava, tedy svatyně, schrána a miniaturní rakvičky pro vnitřní orgány. | S02, S06 |
| A05 | Správně: Anubis na schráně stál v pokladnici, u vstupu do této místnosti. | S02, S06 |
| A06 | Správně: zlatý trůn byl v předsíni a zobrazuje krále s královnou pod paprsky Atona. | S02, S06 |
| A07 | Správně po zpřesnění: hrobka obsahovala vozy a části vozů; ve hře je bezpečnější název "královský vůz" než automaticky "válečný vůz". | S02, S05 |
| A08 | Správně: zvířecí pohřební lehátka patří k výrazným předmětům předsíně. | S02, S04 |
| A09 | Správně: dvě černé a zlaté strážní sochy stály u vstupu z předsíně do pohřební komory. | S02, S04 |
| A10 | Správně po zpřesnění: herní skříňka/deska je doložená mezi předměty v annexu; "senet" lze použít jako srozumitelný herní motiv, ale inventární název má být obecnější. | S01, S02, S08 |
| A11 | Správně se zdrojem navíc: meteoritický původ čepele podporuje materiálový výzkum publikovaný v časopise Meteoritics & Planetary Science. | S02, S07 |
| A12 | Správně: modelové lodě jsou v Carterově seznamu doložené víckrát, hlavně v pokladnici; ve hře proto nemá jít o jedinou unikátní loď. | S02 |
| A13 | Správně po opravě: jde o alabastrový/kryštalický kalcitový lotosový pohár z předsíně, ne obecnou nádobu z annexu. | S02, S06 |
| A14 | Správně po opravě: slavný pštrosí vějíř patří do pohřební komory a nesl stopy střídavých hnědých a bílých per. | S02, S06 |

Minimum pro první verzi: implementovat 10 záznamů. Doporučený plný set: 14 záznamů výše, aby hra nepůsobila prázdně.

## 11. Fakta a témata

| Téma | Co má hra sdělit | Kde se objeví |
|---|---|---|
| Kdo objevil hrobku | Howard Carter a jeho tým, s podporou lorda Carnarvona | Vstup a první schody |
| Kdy byla hrobka objevena | První schod 4. listopadu 1922, slavný průzor do předsíně 26. listopadu 1922 | Segment 1-3 |
| Kde se hrobka nachází | Údolí králů, hrobka KV62 | Mapa a úvod |
| Proč je na začátku pyramida | Jde o symbolický egyptský splash screen; samotná hrobka KV62 není uvnitř pyramidy | Splash screen a segment 1 |
| Proč je Tutanchamon slavný | Ne kvůli největší moci, ale kvůli téměř neporušené hrobce a bohatství nálezů | Předsíň a závěr |
| Jak hrobka vypadá | Schodiště, vstupní chodba, předsíň, annex, pohřební komora, pokladnice | Postupná mapka |
| Srovnání s jinými faraony | Hrobka je malá, kompaktní a méně rozsáhle zdobená než velké královské hrobky; její výjimečnost spočívá v zachování a nahuštěném množství nálezů | Segment 2 |
| Život faraona | Dítě na trůnu, 18. dynastie, náboženský kontext po Achnatonovi | Segment 4-5 |
| Smrt faraona | Zemřel velmi mladý, přesná příčina smrti není jistá | Pohřební komora |
| Pohřební výbava | Předměty měly krále chránit a vybavit pro posmrtný život | Všechny komory |
| Archeologická dokumentace | Nálezy se katalogizují, fotí a popisují | Inventář |
| Co v KV62 nebylo | V hrobce nejsou doložené ostatky Anchesenamon; byly zde ostatky Tutanchamona a dvě malé mumie plodů nebo novorozenců v pokladnici | Pohřební komora a pokladnice |

## 12. Práce se zdroji pro školní práci

Protože jde o školní práci, hra musí umět zobrazit použité historické a faktické zdroje. Zdroje nejsou jen poznámka v dokumentaci, ale součást herního obsahu.

Pravidla:

- každý historický fakt ve hře má přiřazený alespoň jeden zdroj,
- každý předmět v inventáři má zdroj pro svůj název, místo nálezu nebo popis,
- zdroje lze kdykoliv vyvolat klávesou `Z`,
- stejná obrazovka se zdroji se automaticky zobrazí po dokončení hry,
- každý zdroj na obrazovce zdrojů je prokliknutelný odkaz a otevře se v novém okně nebo nové kartě prohlížeče,
- informační box může zobrazit krátkou značku zdroje, například `Zdroj: S01, S02`,
- finální školní verze nesmí obsahovat historické tvrzení bez dohledatelného zdroje.

```text
+------------------------------------------------------------------+
| ZDROJE A POUZITE PRAMENY                                         |
+------+----------------------------+------------------------------+
| S01  | Griffith Institute         | Carteruv archiv, KV62,       |
|      | Anatomy of an Excavation   | objev hrobky, mistnosti      |
+------+----------------------------+------------------------------+
| S02  | Griffith Institute Archive | karty objektu, fotografie,   |
|      |                            | dokumentace vykopavek        |
+------+----------------------------+------------------------------+
| S03  | The Metropolitan Museum    | 18. dynastie, historicky     |
|      | of Art                     | kontext Tutanchamona         |
+------+----------------------------+------------------------------+
| S04  | British Museum             | recepce objevu, popularita   |
|      |                            | Tutanchamona                 |
+------+----------------------------+------------------------------+
| S05  | Egypt Monuments            | srovnani KV62 s jinymi       |
|      | Ministry of Tourism        | kralovskymi hrobkami         |
+------+----------------------------+------------------------------+
| S06  | Grand Egyptian Museum      | overeni konkretnich          |
|      | artefact pages             | predmetu z Tutanchamona      |
+------+----------------------------+------------------------------+
| S07  | Meteoritics & Planetary    | materialovy vyzkum dyky      |
|      | Science / Courtauld        | z meteoritickeho zeleza      |
+------+----------------------------+------------------------------+
| S08  | Global Egyptian Museum     | senetova herni deska         |
|      |                            | z Tutanchamonovy vybavy      |
+------+----------------------------+------------------------------+
| Klik / Enter: otevrit zdroj v prohlizeci                          |
| [Esc] Zpet do hry        Zdroje se zobrazi i po dokonceni hry.   |
+------------------------------------------------------------------+
```

Chování odkazů:

- kliknutí myší nebo potvrzení vybraného řádku klávesou `Enter` otevře URL zdroje mimo hru,
- ve webové implementaci použít odkaz typu `<a href="..." target="_blank" rel="noopener noreferrer">`,
- pokud prohlížeč zablokuje nové okno, hra má aspoň zobrazit plnou URL adresu u zdroje,
- každý odkaz má mít krátký popisek, například `Otevřít zdroj S06`, ne jen samotnou adresu.

Příklad přiřazení zdrojů:

| Herní fakt | Doporučený zdroj |
|---|---|
| Objev hrobky v roce 1922, Howard Carter, lord Carnarvon | S01, S02 |
| První schod 4. listopadu 1922 a průzor do předsíně 26. listopadu 1922 | S01 |
| Struktura KV62: vstup, chodba, předsíň, annex, pohřební komora, pokladnice | S01, S02 |
| Předměty z hrobky a jejich katalogizace | S02 |
| Konkrétní muzejní popisy masky, trůnu, kanopické výbavy, Anubise, lotosového poháru a pštrosího vějíře | S06 |
| Meteoritický původ železné dýky | S07 |
| Herní skříňka a senet | S02, S08 |
| Tutanchamon v kontextu 18. dynastie | S03 |
| Proč je Tutanchamon dnes tak známý | S03, S04 |
| Srovnání velikosti a výzdoby KV62 s jinými královskými hrobkami | S01, S05 |
| Ostatky v KV62: mumie Tutanchamona a dvě malé mumie plodů nebo novorozenců, ne dospělá královna Anchesenamon | S02 |

## 13. Informační box

Informační box se mění podle toho, na co hráč svítí. Text musí být krátký, protože obrazovka má působit herně, ne jako dlouhý článek.

```text
+--------------------------------------+
| ZLATY TRUN                           |
| Misto: Predsin                       |
|                                      |
| Na operadle je kralovsky par:        |
| Tutanchamon a Anchesenamon. Scena    |
| pripomina obdobi po naboenske zmene  |
| Achnatona a navrat ke kultu Amona.   |
|                                      |
| Zdroj: S02, S03                      |
|                                      |
| [E] Katalogizovat  [I] Inventar      |
+--------------------------------------+
```

## 14. Inventář

Inventář je součástí grafiky a zároveň vzdělávací přehled.

```text
+------------------------------------------------------------------+
| INVENTAR / NALEZOVY DENIK                                        |
+------------+------------+------------+------------+--------------+
| Maska      | Trun       | Senet      | Anubis     | Sarkofag     |
| nalezeno   | nalezeno   | nalezeno   | ?          | ?            |
+------------+------------+------------+------------+--------------+
| Detail vybraneho predmetu:                                       |
| Zlaty trun - nalezen v predsini. Vyjev ukazuje faraona s jeho    |
| manzelkou Anchesenamon.                                          |
| Zdroj: S02                                                       |
+------------------------------------------------------------------+
```

Stavy položek:

- `?` neobjeveno,
- šedá ikona: hráč viděl siluetu, ale ještě ji nenasvítil,
- barevná ikona: katalogizováno,
- zlatý okraj: klíčový předmět nutný pro dokončení.

## 15. Datové schéma obsahu

Jednoduchá struktura vhodná pro pozdější implementaci:

```text
Person
- id
- name
- role
- shortFact
- relatedSegments[]

TombSegment
- id
- title
- room
- mapPosition
- historyTopic
- introText
- ambientSound
- artifacts[]
- sourceIds[]
- unlocksSegmentId

Artifact
- id
- name
- room
- visualType
- inventoryIcon
- factShort
- factLong
- collectable
- sourceIds[]
- soundOnInspect

FactCard
- id
- title
- text
- sourceIds[]
- relatedPersonIds[]
- relatedArtifactIds[]

Source
- id
- title
- institution
- url
- linkLabel
- opensInNewWindow
- usedFor
- accessedAt

GameScreen
- id
- type
- title
- visualDescription
- nextScreenId
- sourceIds[]

ControlHint
- id
- key
- label
- description
- visibleInHud
```

Vztahy:

```text
[Tutanchamon] --souvisi s--> [Maska] [Sarkofag] [Zlata rakev]
[Howard Carter] --objevil--> [KV62]
[Lord Carnarvon] --financoval--> [Expedice]
[Anchesenamon] --zobrazena na--> [Zlaty trun]
[KV62] --obsahuje--> [Predsin] [Annex] [Pohrebni komora] [Pokladnice]
```

## 16. Návrh první hratelné verze

První verze by měla být úzká a dokončitelná:

- jedna diagonální chodba s odbočkami reprezentovanými jako segmenty,
- krátký splash screen s pohledem na stylizovanou pyramidu,
- automatický přechod ze splash screenu přímo ke vstupu do KV62,
- 8 segmentů průchodu,
- 10 až 14 katalogizovatelných předmětů,
- mapka postupně odkrývaná podle segmentů,
- informační box s krátkými texty,
- inventář jako spodní lišta a rozšířený detail,
- stálá nápovědní lišta a detailní obrazovka nápovědy přes `H`,
- vyvolatelná obrazovka zdrojů přes `Z` a závěrečné zobrazení zdrojů po dohrání,
- základní zvuky kroků, louče, komory a katalogizace,
- jeden závěrečný souhrn: "Co jsi objevil?"

## 17. Závěrečný souhrn pro hráče

Po dokončení se zobrazí stručné shrnutí:

```text
+------------------------------------------------------------------+
| HROBKA OBJEVENA                                                  |
+------------------------------------------------------------------+
| Objevil jsi strukturu KV62: vstup, chodbu, predsin, annex,       |
| pohrebni komoru a pokladnici.                                    |
|                                                                  |
| Klicove poznatky:                                                |
| - Hrobku objevil Howard Carteruv tym v roce 1922.                |
| - Tutanchamon byl mlady faraon 18. dynastie.                     |
| - Hrobka byla mala, mene zdobena, ale mimoradne zachovana.       |
| - Slava Tutanchamona je spojena hlavne s bohatstvim nalezu.      |
|                                                                  |
| Katalogizovane predmety: 12/14                                   |
|                                                                  |
| [Z] Zobrazit historicke zdroje pouzite ve hre                    |
| Klik na zdroj otevre odkaz v novem okne prohlizece.              |
+------------------------------------------------------------------+
```

## 18. Zdroje pro historickou kontrolu

Při přípravě finálních textů do hry je nutné ověřit formulace proti odborným nebo muzejním zdrojům. Každý níže uvedený zdroj má vlastní ID, které se používá v datech hry i na obrazovce zdrojů. Ve hře se má každý řádek zdroje vykreslit jako prokliknutelný odkaz otevřený v novém okně nebo nové kartě prohlížeče.

| ID | Zdroj | Využití ve hře | URL |
|---|---|---|---|
| S01 | Griffith Institute, Oxford: Tutankhamun: Anatomy of an Excavation | Carterův archiv, objev hrobky, základní dokumentace KV62 | https://www.griffith.ox.ac.uk/discoveringtut/ |
| S02 | Griffith Institute Archive: Tutankhamun Archive | primární dokumentace vykopávek, karty objektů, Burtonovy fotografie | https://archive.griffith.ox.ac.uk/index.php/tutankhamun-archive-i?sf_culture=en |
| S03 | The Metropolitan Museum of Art: Tutankhamun's World | kontext Tutanchamonova života, 18. dynastie a doby po Achnatonovi | https://www.metmuseum.org/perspectives/tutankhamuns-world |
| S04 | British Museum: Tutankhamun: ancient and modern perspectives | popularita Tutanchamona, moderní recepce objevu a výklad pro veřejnost | https://www.britishmuseum.org/visit/object-trails/tutankhamun-ancient-and-modern-perspectives |
| S05 | Egypt Monuments, Ministry of Tourism and Antiquities: Tomb of Tutankhamun | srovnání KV62 s jinými hrobkami v Údolí králů, velikost, výzdoba a důvod výjimečnosti | https://egymonuments.gov.eg/monuments/tomb-of-tutankhamun/ |
| S06 | Grand Egyptian Museum: Tutankhamun artefact pages | ověření konkrétních předmětů, hlavně masky, trůnu, kanopické výbavy, Anubise, lotosového poháru a pštrosího vějíře | https://gem.eg/en/collection/ |
| S07 | Comelli et al. 2016: The meteoritic origin of Tutankhamun's iron dagger blade | odborný zdroj pro meteoritické železo u dýky | https://pure.courtauld.ac.uk/en/publications/the-meteoritic-origin-of-tutankhamuns-iron-dagger-blade/ |
| S08 | Global Egyptian Museum: Senet Game of Tutankhamun | doplňující muzejní záznam pro herní skříňku/senet | https://www.globalegyptianmuseum.org/detail.aspx?id=15033 |

Konkrétní odkazy použité při kontrole:

| Kontrolovaná věc | Přímý odkaz |
|---|---|
| První sezóna, 4. a 26. listopad 1922 | https://tutankhamun.griffith.ox.ac.uk/seasons/1st-season-1922-1923 |
| Předsíň KV62 | https://tutankhamun.griffith.ox.ac.uk/rooms/antechamber |
| Pohřební komora KV62 | https://tutankhamun.griffith.ox.ac.uk/rooms/burial-chamber |
| Pokladnice KV62 | https://tutankhamun.griffith.ox.ac.uk/rooms/treasury |
| Annex KV62 | https://tutankhamun.griffith.ox.ac.uk/rooms/annexe |
| Carterův seznam předmětů | https://tutankhamun.griffith.ox.ac.uk/sites/default/files/2026-03/Murray%20Nuttall%20Handlist-ocr.pdf |
| Senetová herní deska | https://www.globalegyptianmuseum.org/detail.aspx?id=15033 |
| Zlatá maska | https://gem.eg/en/collection/artefacts/the-golden-burial-mask-of-tutankhamun |
| Zlatý trůn | https://gem.eg/en/collection/artefacts/golden-throne |
| Anubis na schráně | https://gem.eg/en/collection/artefacts/anubis-on-a-chest |
| Kanopická svatyně | https://gem.eg/en/collection/artefacts/canopic-shrine-on-a-sledge |
| Kanopická schrána | https://gem.eg/en/collection/artefacts/canopic-chest |
| Lotosový pohár | https://gem.eg/en/collection/artefacts/lotus-cup |
| Pštrosí vějíř | https://gem.eg/en/collection/artefacts/ostrich-hunt-fan |
