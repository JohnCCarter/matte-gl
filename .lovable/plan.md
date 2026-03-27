

## Requested Changes

### 1. Hide the correct answer on wrong attempts
Currently line 150 shows `Svaret är {question.answer}`. Change this to only show encouragement like "Inte riktigt! Försök igen nästa gång!" without revealing the answer.

### 2. Remove the timer/countdown
Remove the `<TimerBar>` component from PracticeScreen (line 102) and clean up related state (`timerReset`). This removes time pressure, which is counterproductive for a child with concentration difficulties.

### 3. Remove answer from hints
The last hint in each operation type in `mathEngine.ts` reveals the answer (e.g. `Svaret är ${answer}!`). Remove or rewrite those final hints to only give the strategy, not the answer.

---

## Concrete Suggestions for a 9-year-old with Focus Difficulties

Here are changes I can implement:

**A. Fewer questions per round** — Change from 10 to 5 questions. Shorter sessions feel more achievable and reduce overwhelm.

**B. Bigger, calmer UI** — Increase button/input sizes even more, reduce visual clutter (fewer colors competing for attention at once), and add more whitespace.

**C. Positive-only feedback loop** — On wrong answers, show warm encouragement ("Nästan! Du är på rätt väg! 💪") without showing the answer. Let her try again on the same question (up to 2 attempts) before moving on.

**D. "Try again" on wrong answer** — Instead of immediately moving to next question, let her attempt the same question again with a hint shown. This reinforces learning without frustration.

**E. Streak counter with celebration** — Show a small streak counter ("3 i rad! 🌟") when she gets consecutive correct answers. Positive reinforcement for sustained focus.

**F. Reduce number of categories on start screen** — Show fewer choices to avoid decision paralysis. Perhaps default to one category or show a "Surprise me!" button prominently.

---

## Summary of File Changes

| File | Change |
|---|---|
| `PracticeScreen.tsx` | Remove TimerBar, hide answer on wrong feedback, optionally add retry logic |
| `mathEngine.ts` | Remove answer reveals from final hints, reduce `QUESTIONS_PER_ROUND` to 5 |
| `TimerBar.tsx` | Can be left in place (unused) or deleted |

