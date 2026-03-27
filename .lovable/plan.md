

# Plan: Barnvänlig "Min resa 🌟"-vy + dold föräldralänk

## Problemet
Dottern kommer att klicka på "📊 För vuxna" — det syns tydligt på startsidan. Föräldravyn visar procent och svaghetsjämförelser som kan kännas negativt.

## Lösning

### A. Byt ut den synliga "För vuxna"-länken mot "Min resa 🌟"
Den nya knappen på startsidan leder till en barnvänlig vy som visar framsteg positivt.

### B. Ny komponent: `MyJourneyView.tsx`
En glad, visuell vy som visar:
- **Totala stjärnor** — 1 stjärna per avklarad omgång, visas som en rad ⭐-emojis
- **Milstolpar** — t.ex. "🎉 Första gången Division!", "🔥 5 omgångar klara!", "🌟 10 rätt i rad!"
- **Senaste omgångar** — enkla kort med emoji + kategori + "3 av 5 rätt! Bra!" (positivt formulerat, inga procent)
- **Ämnen utforskade** — visar vilka ämnen hon provat med färgglada badges, inte jämförelser

Inget "kan öva mer på", inga procent, ingen röd färg.

### C. Föräldravyn blir gömd
Flytta "📊 För vuxna" till en dold åtkomst — t.ex. tryck 3 gånger på rubriken "Matteateljén" för att öppna föräldravyn. Barnet hittar den inte av misstag.

### D. Milstolpar i progressStore
Lägg till en `getMilestones()`-funktion som returnerar uppnådda milstolpar baserat på sparad data:
- Första omgången
- Första gången per kategori
- 5, 10, 20 omgångar totalt
- 3+ rätt i en omgång

## Filändringar

| Fil | Ändring |
|---|---|
| `src/components/MyJourneyView.tsx` | Ny — barnvänlig framstegsvy |
| `src/lib/progressStore.ts` | Lägg till `getMilestones()` |
| `src/components/StartScreen.tsx` | Byt synlig länk till "Min resa 🌟", göm föräldralänk bakom trippelklick på rubriken |
| `src/pages/Index.tsx` | Lägg till `'journey'` screen-state, rendera MyJourneyView |

