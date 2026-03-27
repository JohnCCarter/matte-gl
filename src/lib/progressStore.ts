import { Category, Difficulty, categoryLabels } from './mathEngine';

interface RoundResult {
  category: Category;
  difficulty: Difficulty;
  correct: number;
  total: number;
  date: string;
}

const STORAGE_KEY = 'matteateljen-progress';

function getRounds(): RoundResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRound(category: Category, difficulty: Difficulty, correct: number, total: number) {
  const rounds = getRounds();
  rounds.push({ category, difficulty, correct, total, date: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rounds));
}

export function getStats() {
  const rounds = getRounds();
  const totalRounds = rounds.length;
  const totalCorrect = rounds.reduce((s, r) => s + r.correct, 0);
  const totalQuestions = rounds.reduce((s, r) => s + r.total, 0);
  return { totalRounds, totalCorrect, totalQuestions };
}

export function getRecentRounds(n: number): RoundResult[] {
  return getRounds().slice(-n);
}

const difficultyOrder: Difficulty[] = ['easy', 'medium', 'hard'];
const difficultyLabelsMap: Record<Difficulty, string> = { easy: 'Lätt', medium: 'Lagom', hard: 'Svår' };

export function getSuggestedDifficulty(category: Category, currentDifficulty: Difficulty): { suggested: Difficulty; reason: string } {
  const rounds = getRounds().filter(r => r.category === category).slice(-3);
  if (rounds.length === 0) return { suggested: currentDifficulty, reason: '' };

  const totalCorrect = rounds.reduce((s, r) => s + r.correct, 0);
  const totalQuestions = rounds.reduce((s, r) => s + r.total, 0);
  const pct = totalQuestions > 0 ? totalCorrect / totalQuestions : 0;
  const idx = difficultyOrder.indexOf(currentDifficulty);

  if (pct >= 0.8 && idx < difficultyOrder.length - 1) {
    const next = difficultyOrder[idx + 1];
    return { suggested: next, reason: `Du klarade ${Math.round(pct * 100)}%! Redo för ${difficultyLabelsMap[next]}-nivån? 🚀` };
  }
  if (pct <= 0.4 && idx > 0) {
    const prev = difficultyOrder[idx - 1];
    return { suggested: prev, reason: `Prova ${difficultyLabelsMap[prev]}-nivån så att det känns lättare! 💪` };
  }
  return { suggested: currentDifficulty, reason: '' };
}

interface CategoryStats {
  category: Category;
  label: string;
  rounds: number;
  correct: number;
  total: number;
  pct: number;
}

interface DifficultyStats {
  difficulty: Difficulty;
  label: string;
  rounds: number;
  correct: number;
  total: number;
  pct: number;
}

export function getDetailedStats() {
  const rounds = getRounds();
  const categories: Category[] = ['addition', 'multiplication', 'division', 'mixed'];

  const byCategory: CategoryStats[] = categories.map(cat => {
    const catRounds = rounds.filter(r => r.category === cat);
    const correct = catRounds.reduce((s, r) => s + r.correct, 0);
    const total = catRounds.reduce((s, r) => s + r.total, 0);
    return { category: cat, label: categoryLabels[cat], rounds: catRounds.length, correct, total, pct: total > 0 ? Math.round((correct / total) * 100) : 0 };
  }).filter(s => s.rounds > 0);

  const byDifficulty: DifficultyStats[] = difficultyOrder.map(diff => {
    const diffRounds = rounds.filter(r => r.difficulty === diff);
    const correct = diffRounds.reduce((s, r) => s + r.correct, 0);
    const total = diffRounds.reduce((s, r) => s + r.total, 0);
    return { difficulty: diff, label: difficultyLabelsMap[diff], rounds: diffRounds.length, correct, total, pct: total > 0 ? Math.round((correct / total) * 100) : 0 };
  }).filter(s => s.rounds > 0);

  const best = byCategory.length > 0 ? byCategory.reduce((a, b) => a.pct > b.pct ? a : b) : null;
  const weakest = byCategory.length > 0 ? byCategory.reduce((a, b) => a.pct < b.pct ? a : b) : null;

  const recent = rounds.slice(-10).reverse().map(r => ({
    ...r,
    categoryLabel: categoryLabels[r.category],
    difficultyLabel: difficultyLabelsMap[r.difficulty],
    pct: r.total > 0 ? Math.round((r.correct / r.total) * 100) : 0,
  }));

  const totalCorrect = rounds.reduce((s, r) => s + r.correct, 0);
  const totalQuestions = rounds.reduce((s, r) => s + r.total, 0);

  return { totalRounds: rounds.length, totalCorrect, totalQuestions, overallPct: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0, byCategory, byDifficulty, best, weakest, recent };
}

export function clearProgress() {
  localStorage.removeItem(STORAGE_KEY);
}
