# Talberg & Aarvåg Bygg AS – nettside

Statisk én-sides nettside for Talberg & Aarvåg Bygg AS (org.nr 937 528 140), tømrerfirma i Trondheim.

## Struktur

```
talberg-aarvag-bygg/
├── index.html          # Hele siden (norsk)
├── favicon.svg         # Monogram-favicon
├── css/style.css       # All styling (designtokens øverst)
├── js/main.js          # Mobilmeny, scroll-reveal, tilbudsskjema
└── assets/
    ├── monogram.svg    # TE-monogram (gjenskapt som SVG fra logoen)
    └── img/            # Prosjektbilder hentet fra Mittanbud-profilen
        ├── rekkverk.jpg
        ├── etterisolering.jpg
        ├── listing.jpg
        └── profil.jpg  # (ubrukt – uformelt bilde av eierne)
```

## Design

- **Varm håndverkspalett:** krem `#F7F1E6`, honning `#CE8F3F`, espresso `#251D12` –
  logoblåtonene (`#4FA3E8` / `#2E3192`) lever kun i selve logomerket
- **Fonter:** Archivo (overskrifter) + Hanken Grotesk (brødtekst), via Google Fonts
- **Signatur:** tommestokk-/målebånd-motiv som skillelinjer (`.ruler` og `.hero-ruler`)
- Struktur fra en Behance-referanse (tilbudsskjema i hero); varm tone fra en
  snekkerside-referanse (krem/honning/espresso med verkstedsfølelse)
- Prosjektbildene får en lett varm fargetone via CSS-filter (`sepia` + `saturate`)

## Tilbudsskjemaet

Skjemaet åpner i dag et ferdig utfylt e-postutkast (`mailto:`) – det krever ingen server.
For innsending uten e-postprogram, bytt til en skjematjeneste:

1. Opprett gratis skjema på [formspree.io](https://formspree.io) (eller bruk Netlify Forms)
2. I `js/main.js`: erstatt `mailto:`-delen med en `fetch('https://formspree.io/f/DIN-ID', ...)`
   eller sett `action`/`method` direkte på `<form>` i `index.html`

## Publisering

Siden er ren HTML/CSS/JS og kan legges rett ut på:

- **GitHub Pages** (gratis): push til GitHub → Settings → Pages → deploy fra `main`
- **Netlify / Vercel / Cloudflare Pages** (gratis): dra-og-slipp mappen eller koble til repo
- Eget webhotell: last opp filene til rotmappen

Husk eget domene, f.eks. `talbergaarvaagbygg.no` (sjekk ledighet på norid.no).

## Verdt å vurdere senere

- Egen e-postadresse (f.eks. `post@talbergaarvaagbygg.no`) i stedet for Gmail-adressen
- Flere/bedre prosjektbilder i liggende format (landskap) etter hvert som jobber fullføres
- Google Bedriftsprofil + kobling til kart i kontaktseksjonen
