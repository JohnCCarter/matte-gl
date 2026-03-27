

# Plan: Adaptiv svårighetsgrad + Föräldra-/lärarvy

## 1. Adaptiv svårighetsgrad

After each round, suggest a difficulty change based on performance.

**`src/lib/progressStore.ts`** — add helper:
- `getSuggestedDifficulty(category)` — looks at last 2-3 rounds for that category:
  - ≥80% correct → suggest next harder level
  - ≤40% correct → suggest next easier level
  - Otherwise → stay at current level
- Returns `{ suggested: Difficulty, reason: string }` (e.g. "Du klarade 90%! Redo för nästa nivå?")

**`src/components/SummaryScreen.tsx`** — show suggestion:
- After showing the score, display a suggestion card: "Du verkar redo för Lagom-nivån! 🚀" with a button to start at the suggested level
- Also keep the regular "Spela igen" button
- Pass `category` and `difficulty` as new props

**`src/pages/Index.tsx`** — pass category/difficulty to SummaryScreen, add `handleStartWithDifficulty` handler

## 2. Föräldra-/lärarvy

A simple stats page accessible from the start screen, showing per-category performance over time. No login needed — it reads from the same localStorage data.

**New file: `src/components/ParentView.tsx`**
- Accessed via a small "📊 För vuxna" link on the start screen
- Shows:
  - Total rounds, total correct/questions, overall percentage
  - Per-category breakdown: a simple table/cards showing category name, rounds played, accuracy %
  - Per-difficulty breakdown: same format
  - Last 10 rounds list with date, category, difficulty, score
  - A "strength/weakness" summary: "Starkast i: Addition ✅" / "Kan öva mer på: Division 📝"
- A "← Tillbaka" button to return to start screen
- A "🗑 Rensa data" button with confirmation

**`src/lib/progressStore.ts`** — add helpers:
- `getDetailedStats()` — returns per-category and per-difficulty aggregates
- `clearProgress()` — clears localStorage

**`src/pages/Index.tsx`** — add `'parent'` screen state, render ParentView

**`src/components/StartScreen.tsx`** — add small "📊 För vuxna" link, accepting an `onParentView` prop

## Summary of changes

| File | Change |
|---|---|
| `src/lib/progressStore.ts` | Add `getSuggestedDifficulty()`, `getDetailedStats()`, `clearProgress()` |
| `src/components/SummaryScreen.tsx` | Show adaptive difficulty suggestion after score |
| `src/components/ParentView.tsx` | New — stats dashboard for parents/teachers |
| `src/components/StartScreen.tsx` | Add "För vuxna" link |
| `src/pages/Index.tsx` | Wire up parent view screen + pass category/difficulty to summary |

