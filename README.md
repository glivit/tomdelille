# Tom De Lille — Osteopathie Knokke

Statische website voor de osteopathiepraktijk van Tom De Lille te
Knokke-Heist. NL + FR.

## Deploy — Cloudflare Pages

1. Connect deze repo (`glivit/tomdelille`) in Cloudflare Pages.
2. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leeg laten)*
   - **Build output directory:** `/`
3. **Environment variables** → toevoegen:
   - `WEB3FORMS_KEY` — access key van https://web3forms.com
     (gratis registratie, key wordt gebonden aan delille.tom@gmail.com)
4. Deploy.

## Stack

- Statische HTML, CSS en vanilla JS — geen build-stap.
- Fonts via Fontshare (Switzer + General Sans).
- Mortex texture als body background.
- Cloudflare Pages Functions voor het contactformulier (`/api/contact`).
- Schema.org JSON-LD: `MedicalBusiness` + `FAQPage`.
- hreflang annotaties voor NL/FR alternatieven.

## Bestanden

```
.
├── index.html · over-mij.html · osteopathie.html
├── voor-wie.html · praktisch.html · afspraak.html
├── faq.html · privacy.html
├── fr/                  ─── Franse pagina's
│   ├── index.html · a-propos.html · osteopathie.html
│   ├── pour-qui.html · pratique.html · rendez-vous.html
│   ├── faq.html · confidentialite.html
├── functions/api/
│   └── contact.js       ─── form-handler (Web3Forms proxy)
├── sitemap.xml · robots.txt · README.md
└── assets/
    ├── css/styles.css
    ├── js/main.js
    ├── favicon.svg
    └── img/             ─── praktijk + portret + mortex.webp
```

## Form backend

`functions/api/contact.js` ontvangt POST-submissions van het
afspraakformulier en stuurt ze door naar Web3Forms, dat ze emailt
naar delille.tom@gmail.com. De `WEB3FORMS_KEY` env var is verplicht.

## Lokaal testen

```sh
python3 -m http.server 8000
```

en open `http://localhost:8000`. Form-backend werkt enkel na deploy
op Cloudflare Pages (lokale `python3` server kan geen functions
uitvoeren).

## Contact praktijk

Helmweg 14, 8300 Knokke-Heist · 050 62 15 67 · delille.tom@gmail.com
