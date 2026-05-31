# Půdorysná varianta KV62

Samostatná alternativa k původní Three.js hře. Intro textově zůstává stejné, hlavní část už není hra s hráčem, ale 2D půdorys hrobky shora.

## Kde upravovat obsah

- `data/content.json` - všechny texty, místnosti, body v mapě, osoby, zdroje a metadata fotek.
- `assets/tutankhamun/` - lokálně stažené fotky předmětů pro detailový panel.
- `styles.css` - čistě vzhled.
- `src/app.js` - načtení JSONu a interakce; neměl by obsahovat faktický obsah hrobky.

## Datová struktura

- `rooms` určují místnosti v půdorysu (`x`, `y`, `w`, `h` jsou procenta plochy).
- `hotspots` jsou klikatelné body. Pokud mají `kind: "artifact"`, odkazují přes `artifactId` na záznam v `artifacts`.
- `artifacts` obsahují katalogizační texty, zdroje a `photo`.
- `sources` obsahují historické zdroje; fotky mají odkaz na stránku souboru přímo ve svém záznamu.

Spouštět přes lokální web server, protože aplikace načítá JSON přes `fetch`.
