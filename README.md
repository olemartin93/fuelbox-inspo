# Fuel Talks 🔥💬

Samtalekort på norsk, inspirert av samtalespill som Fuelbox. Velg en kategori, trekk et kort, snakk sammen – og sveip for å gi tommel opp 👍 eller ned 👎.

**Åpne appen:** https://olemartin93.github.io/fuelbox-inspo/

## Funksjoner

- 6 kategorier med 55 spørsmål hver (330 totalt):
  Romantikk & dating, Jobb & karriere, Vennskap, Familie & oppvekst, Dype tanker, Moro & isbrytere
- Sveip kort til høyre (👍) eller venstre (👎), eller bruk knappene / piltastene
- 👍-kort lagres som favoritter, 👎-kort vises ikke igjen (kan nullstilles)
- Angre og hopp over
- Fungerer helt uten nett (service worker), kan legges til på hjemskjermen
- Ingen sporing, ingen konto – alt lagres bare lokalt på telefonen (`localStorage`)

## Legg til på hjemskjermen

- **iPhone (Safari):** Del-knappen → «Legg til på Hjem-skjerm»
- **Android (Chrome):** ⋮-menyen → «Installer app» / «Legg til på startsiden»

Åpne appen én gang med nett, så fungerer den offline etterpå.

## Om spørsmålene

Alle spørsmålene er skrevet for denne appen (ingen er kopiert fra Fuelbox). Noen av spørsmålene i
romantikk-kategorien bygger på temaer fra en kjent og fagfellevurdert studie om nærhet mellom mennesker:

> Aron, A., Melinat, E., Aron, E. N., Vallone, R. D., & Bator, R. J. (1997). *The Experimental Generation of
> Interpersonal Closeness: A Procedure and Some Preliminary Findings.* Personality and Social Psychology
> Bulletin, 23(4), 363–377. https://doi.org/10.1177/0146167297234003

## Utvikling

```bash
npm install
npm run dev        # utviklingsserver
npm test           # enhets- og komponenttester (Vitest)
npm run build      # produksjonsbygg til dist/
npm run test:e2e   # nettlesertester med Playwright (krever build), inkl. offline-test
npm run icons      # lag PNG-ikoner fra public/favicon.svg
```

Teknologi: React 19, strict TypeScript, Tailwind CSS v4, Vite og vite-plugin-pwa (Workbox).

## Publisering

GitHub Actions kjører typesjekk, tester og bygg på hver PR. Ved push til `main` publiseres appen til
`gh-pages`-grenen og serveres av GitHub Pages.
