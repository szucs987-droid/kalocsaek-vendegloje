# Kalocsáék Vendéglője 1957 — projektkontextus (Claude Code)

Ez egy **éttermi weboldal** fejlesztési projektje. A cél a jóváhagyott dizájn (lásd
`design-reference.html`) alapján egy **éles, production weboldal** felépítése **Astro**
keretrendszerrel. **Ne tervezd újra** a megjelenést — reprodukáld a referenciát.

## A vendéglő
- Név: **Kalocsáék Vendéglője 1957** · mottó: „Szépet, jót, finomat!"
- Cegléd, családi vendéglő **1957 óta** (3. generáció). Magyaros, házias konyha, kert, kemence, rendezvények, házhozszállítás.
- Cím: **2700 Cegléd, Kőrösi út 36** · Tel: **+36 70 772 0291** · E-mail: **kalocsaekvendegloje1957@gmail.com**
- Facebook: facebook.com/kalocsaekvendegloje
- Nyitvatartás: H–Cs, V: 11:00–21:00 · P–Szo: 11:00–22:00
- Alapítók: Kalocsa János és Király Erzsébet.

## Technológia
- **Astro** (TypeScript), UI-keret nélkül; **vanilla CSS** a lenti design tokenekkel.
- Mobilelső, gyors, jó SEO. Tartalom: Astro **content collection** az étlaphoz (a `MENU.md` alapján).

## Design system (a v7-ből)
- Színek (CSS változók): wine `#7a1c2b`, wine-deep `#591019`, terra `#b5532e`, terra-deep `#9a3f1f`,
  gold `#c08a2e`, gold-light `#e3c074`, cream `#f7efe1`, cream2 `#fcf7ec`, paper `#fffdf8`,
  ink `#3a2a22`, muted `#6e5d50`, line `#e7dcc8`.
- Tipográfia: címek **Georgia/serif**, törzs sans-serif. Meleg, hagyományos + modern hangulat.
- **Logó:** átlátszó `logo_atlatszo.png`, ~2× méret, a változatlan magasságú fejlécből **lelóg**
  (fele a sávban, fele a tartalom fölött), mögötte fehér radiális ragyogás
  (`radial-gradient(circle closest-side, rgba(255,255,255,.9) 0–80%, transparent 100%)`).
  Mobilon/tableten 80% méret, asztali nézeten teljes.
- **NINCS kalocsai népi minta** a tervben (a megrendelő kérésére eltávolítva).

## Oldalszerkezet (főoldal, a referencia szerint)
1. **Sticky fejléc**: lelógó logó + „Kalocsáék Vendéglője 1957" + menü (Étlap, Rendezvények, Galéria, Házhozszállítás, Kapcsolat) + arany „Asztalfoglalás" gomb. Mobilon hamburger + alsó műveleti sáv.
2. **Hero**: háttér 15 mp-enként vált a `kalocsa_table_2.png` (logós faasztal, pörkölt – ez indít) és a kerti fotó között, lágy áttűnéssel. Cím, mottó, alszöveg + gombok: **Asztalfoglalás**, **Napi menü**, **Étlap megtekintése**.
3. **Gyors műveletek**: Hívás · Útvonal · Étlap · Nyitvatartás (ikon + felirat).
4. **Történetünk**: kétoszlopos, középre rendezett szöveg + az 1970-es szépia fotó (`vendeglo_1970_3_atlatszo.png`, átlátszó szegély), mini-idővonal (1957 · 1992 · 2006 · 2016). Tableten/mobilon egy oszlop.
5. **Étlap (hibrid)**: felül 3 fotós kiemelt fogás; alatta **ragadós kategória-fülek** a teljes 2026-os étlappal (lásd `MENU.md`), árakkal; általános allergén-tájékoztató; PDF-letöltés (másodlagos).
6. **Heti ajánlat** (bal) + **Napi ajánlat** kártya (jobb) — flyer/étlap-kép nélkül.
7. **Kert & rendezvények**: esküvői fotó + „Ajánlatkérés rendezvényre" gomb/űrlap.
8. **Galéria**: teljes szélességű **diavetítő**, 3 mp-enként vált, lapozható (nyilak + pontok). Kert/belső tér/étel/kemence fotók.
9. **Kapcsolat**: stílusos nyitvatartás-kártya **élő „most nyitva/zárva"** jelzéssel és a mai nap kiemelésével + térkép + cím/telefon/e-mail.
10. **Lábléc** + mobil alsó sáv (Hívás · Útvonal · Étlap · Foglalás).

## Assetek
- A repóban: `logo_atlatszo.png` (fejléc-logó), `kalocsa_table_2.png` (hero), `vendeglo_1970_3_atlatszo.png` (Történetünk).
- További fotók a dish.co CDN-en (kert, esküvő, sültestál, kemence, svédasztal) — lásd `design-reference.html` (a `src`-ekben), ezeket le lehet tölteni a repóba vagy CDN-ről hivatkozni.

## Funkciók
- Űrlapok (asztalfoglalás, rendezvény-ajánlatkérés, kapcsolat): kezdetnek **Formspree/Netlify Forms** vagy `mailto:`; valódi foglalási rendszer később.
- SEO: oldalanként title/meta, **Restaurant JSON-LD** strukturált adat, `lang="hu"`, sitemap, robots; helyi SEO Ceglédre.
- Akadálymentesség: WCAG AA kontraszt, billentyűzet-navigáció, alt szövegek; helyes magyar karakterek (ő, ű).

## Roadmap (Phase 2 / Future) — tartsd modulárisan
- Központi **étlap-/árkezelő** (egy forrás → web + nyomtatható PDF + asztali/elviteli változat).
- Napi/heti menü modul + **automatikus Facebook-közzététel** (AI-segített szöveg/kép).
- Könnyű **rendezvény-CRM** (lead, státusz, emlékeztető, ajánlat).
- Analitika/KPI riport; később törzsvendég-program, hírlevél, online rendelés, vendégfiókok.

## Konvenciók
- Szekciónként külön Astro komponens; design tokenek CSS változóként; mobilelső; magyar tartalom.
- Élő előnézet (jóváhagyott megjelenés): https://szucs987-droid.github.io/kalocsaek-preview/teljes.html
<!-- vege -->
