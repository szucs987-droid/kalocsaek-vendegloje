# Kalocsáék Vendéglője 1957 — weboldal

Éttermi weboldal (Cegléd) fejlesztési repója. A jóváhagyott megjelenést a
`design-reference.html` tartalmazza; a teljes projektkontextus a **`CLAUDE.md`**-ben,
a teljes 2026-os étlap a **`MENU.md`**-ben van.

Élő előnézet (jóváhagyott dizájn): https://szucs987-droid.github.io/kalocsaek-preview/teljes.html

## Folytatás Claude Code-ban
```bash
git clone https://github.com/szucs987-droid/kalocsaek-vendegloje.git
cd kalocsaek-vendegloje
claude        # Claude Code indítása a repóban
```
Ezután illeszd be az alábbi **kickoff promptot** a Claude Code-nak.

## Kickoff prompt (másold a Claude Code-ba)
> Olvasd el a `CLAUDE.md`-t és a `MENU.md`-t — ezek tartalmazzák a márkát, a design rendszert,
> a tartalmat, az asseteket és a szekció-specifikációt. A jóváhagyott megjelenés a
> `design-reference.html` (nyisd meg böngészőben) — reprodukáld, **ne tervezd újra**.
>
> Technológia: hozz létre egy **Astro** projektet (TypeScript, UI-keret nélkül; vanilla CSS a
> CLAUDE.md design tokenjeivel). Mobilelső, gyors, SEO-barát.
>
> 1. Inicializáld az Astro projektet ebben a repóban (tartsd meg a README/CLAUDE/MENU/design-reference fájlokat és a képeket).
> 2. Tedd a 3 képet `public/`-ba; a galéria/rendezvény fotók CDN-URL-jeit lásd a design-reference-ben (letölthetők vagy hivatkozhatók).
> 3. Építsd fel a főoldalt Astro komponensekként, szekciónként, a design-reference szerint
>    (fejléc lelógó logóval; hero váltakozó háttérrel + 3 gomb; gyors műveletek; Történetünk;
>    Étlap hibrid: kiemelt kártyák + ragadós kategória-fülek a MENU.md-ből generált content
>    collectionből; Heti+Napi ajánlat; Kert & rendezvények esküvős fotóval + ajánlatkérő;
>    Galéria teljes szélességű 3 mp-es diavetítő lapozással; Kapcsolat stílusos nyitvatartás-
>    kártyával (élő nyitva/zárva + mai nap) + térkép; mobil alsó sáv; lábléc).
> 4. Design tokenek CSS változókként; serif címek; meleg paletta; lelógó logó (mobilon/tableten 80%). Nincs kalocsai minta.
> 5. Űrlapok (foglalás, rendezvény, kapcsolat): Formspree/Netlify Forms vagy mailto; valódi foglalásra felkészítve.
> 6. SEO: oldalankénti title/meta, Restaurant JSON-LD, lang=hu, sitemap, robots; helyi SEO Cegléd.
> 7. Akadálymentesség: WCAG AA, billentyűzet, alt; helyes ő/ű.
> 8. Tartsd modulárisan a Phase 2-höz (központi étlap-admin egy forrásból; napi/heti menü + Facebook auto-poszt; rendezvény-CRM; analitika).
>
> Először javasolj fájlszerkezetet és Astro-telepítési lépéseket, majd implementáld szekciónként. Fizetős szolgáltatás előtt kérdezz.

## Tartalom
- `CLAUDE.md` — projektkontextus, design system, szekciók, roadmap
- `MENU.md` — teljes 2026-os étlap (kategóriák, fogások, árak)
- `design-reference.html` — a jóváhagyott v7 megjelenés (referencia)
- `logo_atlatszo.png`, `kalocsa_table_2.png`, `vendeglo_1970_3_atlatszo.png` — fő képek
<!-- vege -->
