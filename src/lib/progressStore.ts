import { Category, Difficulty } from './mathEngine';

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
