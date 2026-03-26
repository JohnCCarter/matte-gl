export type Category = 'addition' | 'multiplication' | 'division' | 'mixed';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface MathQuestion {
  text: string;
  answer: number;
  operation: '+' | '-' | '×' | '÷';
  a: number;
  b: number;
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAddSub(diff: Difficulty): MathQuestion {
  const doAdd = Math.random() > 0.5;
  let a: number, b: number;
  if (diff === 'easy') { a = rand(1, 20); b = rand(1, 20); }
  else if (diff === 'medium') { a = rand(10, 100); b = rand(10, 100); }
  else { a = rand(50, 500); b = rand(50, 500); }

  if (doAdd) {
    return { text: `${a} + ${b}`, answer: a + b, operation: '+', a, b };
  }
  const big = Math.max(a, b), small = Math.min(a, b);
  return { text: `${big} - ${small}`, answer: big - small, operation: '-', a: big, b: small };
}

function generateMul(diff: Difficulty): MathQuestion {
  let a: number, b: number;
  if (diff === 'easy') { a = rand(2, 5); b = rand(2, 10); }
  else if (diff === 'medium') { a = rand(3, 10); b = rand(3, 12); }
  else { a = rand(6, 15); b = rand(6, 15); }
  return { text: `${a} × ${b}`, answer: a * b, operation: '×', a, b };
}

function generateDiv(diff: Difficulty): MathQuestion {
  let a: number, b: number;
  if (diff === 'easy') { b = rand(2, 5); a = b * rand(1, 10); }
  else if (diff === 'medium') { b = rand(3, 10); a = b * rand(2, 12); }
  else { b = rand(4, 12); a = b * rand(5, 15); }
  return { text: `${a} ÷ ${b}`, answer: a / b, operation: '÷', a, b };
}

export function generateQuestion(category: Category, difficulty: Difficulty): MathQuestion {
  if (category === 'mixed') {
    const ops: Category[] = ['addition', 'multiplication', 'division'];
    return generateQuestion(ops[rand(0, 2)], difficulty);
  }
  if (category === 'addition') return generateAddSub(difficulty);
  if (category === 'multiplication') return generateMul(difficulty);
  return generateDiv(difficulty);
}

export function getHints(q: MathQuestion): string[] {
  const { operation, a, b, answer } = q;
  switch (operation) {
    case '+': {
      if (a > 20 || b > 20) {
        const aH = Math.floor(a / 10) * 10, aO = a % 10;
        const bH = Math.floor(b / 10) * 10, bO = b % 10;
        return [
          `💡 Dela upp talen! ${a} = ${aH} + ${aO} och ${b} = ${bH} + ${bO}`,
          `🧮 Lägg ihop tiotalena först: ${aH} + ${bH} = ${aH + bH}`,
          `✨ Lägg sedan till entalena: ${aH + bH} + ${aO} + ${bO} = ${answer}`,
        ];
      }
      return [
        `💡 Börja med det största talet: ${Math.max(a, b)}`,
        `🧮 Räkna uppåt ${Math.min(a, b)} steg`,
        `✨ Svaret blir ${answer}!`,
      ];
    }
    case '-': {
      return [
        `💡 Tänk: vad ska du lägga till ${b} för att komma till ${a}?`,
        `🧮 Räkna uppåt från ${b}: ${b} + ? = ${a}`,
        `✨ Svaret är ${answer}!`,
      ];
    }
    case '×': {
      const steps = Array.from({ length: Math.min(b, 4) }, (_, i) =>
        `${a} × ${i + 1} = ${a * (i + 1)}`
      ).join(', ');
      return [
        `💡 Tänk på det som ${b} grupper med ${a} i varje!`,
        `🧮 Räkna steg: ${steps}...`,
        `✨ ${a} × ${b} = ${answer}!`,
      ];
    }
    case '÷': {
      return [
        `💡 Tänk baklänges! Vad gånger ${b} blir ${a}?`,
        `🧮 Testa: ${b} × ? = ${a}`,
        `✨ ${b} × ${answer} = ${a}, så svaret är ${answer}!`,
      ];
    }
    default:
      return [`Svaret är ${answer}`];
  }
}

export const QUESTIONS_PER_ROUND = 10;

export const categoryLabels: Record<Category, string> = {
  addition: 'Addition & Subtraktion',
  multiplication: 'Multiplikation',
  division: 'Division',
  mixed: 'Blandat',
};

export const categoryEmojis: Record<Category, string> = {
  addition: '➕',
  multiplication: '✖️',
  division: '➗',
  mixed: '🎲',
};

export const difficultyLabels: Record<Difficulty, string> = {
  easy: 'Enkel',
  medium: 'Lagom',
  hard: 'Utmaning',
};

export const difficultyEmojis: Record<Difficulty, string> = {
  easy: '🌟',
  medium: '⭐',
  hard: '🔥',
};
