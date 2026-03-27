

# Plan: 4 förbättringar för Matteateljén

## 1. "Överraska mig!"-knapp på startsidan
Add a prominent button at the top of the category list that picks a random category and difficulty, then starts immediately. Reduces decision fatigue.

**File: `StartScreen.tsx`**
- Add a large "🎲 Överraska mig!" button before the category cards
- On click, randomly pick a category + difficulty and call `onStart` directly

## 2. Konfetti-effekt vid rätt svar
Add a lightweight canvas-based confetti burst when the child answers correctly. No external library needed — a simple particle animation using a temporary canvas overlay.

**New file: `src/components/Confetti.tsx`**
- A component that renders a full-screen canvas overlay with colorful particles
- Auto-removes after ~2 seconds
- Triggered by a `show` prop

**File: `PracticeScreen.tsx`**
- Import and render `<Confetti show={feedback === 'correct'} />` on correct answer
- No sound (keeping it simple and school-friendly)

## 3. Spara framsteg i localStorage
Track completed rounds with scores so the child can see progress over time. Show a simple stats section on the start screen.

**New file: `src/lib/progressStore.ts`**
- `saveRound(category, difficulty, correct, total)` — appends to a JSON array in localStorage
- `getStats()` — returns total rounds played, total correct, total questions, best streak
- `getRecentRounds(n)` — returns last N rounds

**File: `StartScreen.tsx`**
- Import stats and show a small summary card below the header: "Du har spelat X omgångar! 🌟 Y rätt totalt"

**File: `Index.tsx`**
- After `handleFinish`, call `saveRound` to persist the result

## 4. Paus-knapp under övning
Add a pause button that overlays a calming screen with encouraging text, giving the child a moment to breathe.

**File: `PracticeScreen.tsx`**
- Add a "⏸ Paus" button in the header
- When clicked, show a full-screen overlay with soft background, a calming emoji, text like "Ta en paus! 🌸 Du gör jättebra." and a "▶ Fortsätt" button
- Simple boolean `isPaused` state

---

## Summary of changes

| File | Action |
|---|---|
| `src/components/StartScreen.tsx` | Add "Överraska mig!" button + stats display |
| `src/components/PracticeScreen.tsx` | Add confetti trigger + pause button/overlay |
| `src/components/Confetti.tsx` | New — lightweight confetti animation |
| `src/lib/progressStore.ts` | New — localStorage save/read helpers |
| `src/pages/Index.tsx` | Save round result after finish |

