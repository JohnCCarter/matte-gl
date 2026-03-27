import { useState, useCallback, useEffect, useRef } from 'react';
import { Category, Difficulty, MathQuestion, generateQuestion, getHints, QUESTIONS_PER_ROUND, categoryLabels, difficultyLabels } from '@/lib/mathEngine';
import { ArtCanvas } from './ArtCanvas';

interface PracticeScreenProps {
  category: Category;
  difficulty: Difficulty;
  onFinish: (correct: number, total: number) => void;
  onQuit: () => void;
}

type FeedbackState = 'idle' | 'correct' | 'wrong' | 'retry';

const encouragements = [
  'Nästan! Du är på rätt väg! 💪',
  'Bra försök! Prova igen! 🌈',
  'Du klarar det! Försök en gång till! ⭐',
  'Inte riktigt, men du lär dig! 🌟',
];

function randomEncouragement() {
  return encouragements[Math.floor(Math.random() * encouragements.length)];
}

export function PracticeScreen({ category, difficulty, onFinish, onQuit }: PracticeScreenProps) {
  const [question, setQuestion] = useState<MathQuestion>(() => generateQuestion(category, difficulty));
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const [encouragement, setEncouragement] = useState('');
  const [hints, setHints] = useState<string[]>([]);
  const [shownHints, setShownHints] = useState(0);
  const [questionNum, setQuestionNum] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const allHints = useCallback(() => getHints(question), [question]);

  useEffect(() => {
    setHints(allHints());
  }, [allHints]);

  useEffect(() => {
    if (feedback === 'idle' || feedback === 'retry') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [feedback, questionNum]);

  const handleSubmit = () => {
    if (answer.trim() === '') return;
    const numAnswer = Number(answer);
    if (numAnswer === question.answer) {
      setFeedback('correct');
      setCorrectCount((c) => c + 1);
      setStreak((s) => s + 1);
    } else {
      if (attempts === 0) {
        // First wrong attempt — let her retry with a hint
        setFeedback('retry');
        setEncouragement(randomEncouragement());
        setShownHints(Math.min(1, hints.length));
        setAttempts(1);
        setAnswer('');
        setStreak(0);
      } else {
        // Second wrong attempt — move on without showing answer
        setFeedback('wrong');
        setEncouragement(randomEncouragement());
        setShownHints(hints.length);
        setStreak(0);
      }
    }
  };

  const handleNext = () => {
    if (questionNum >= QUESTIONS_PER_ROUND) {
      onFinish(correctCount, QUESTIONS_PER_ROUND);
      return;
    }
    setQuestion(generateQuestion(category, difficulty));
    setAnswer('');
    setFeedback('idle');
    setShownHints(0);
    setQuestionNum((n) => n + 1);
    setAttempts(0);
  };

  const handleShowHint = () => {
    if (shownHints < hints.length) {
      setShownHints((s) => s + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (feedback === 'correct' || feedback === 'wrong') handleNext();
      else handleSubmit();
    }
  };

  const progress = (questionNum / QUESTIONS_PER_ROUND) * 100;

  return (
    <div className="flex flex-col min-h-screen px-5 py-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onQuit} className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
          ✕ Avsluta
        </button>
        <span className="text-base font-body font-bold text-foreground">
          {questionNum} av {QUESTIONS_PER_ROUND}
        </span>
        <span className="text-sm font-body text-muted-foreground">
          {difficultyLabels[difficulty]}
        </span>
      </div>

      {/* Progress */}
      <div className="w-full h-3 rounded-full bg-muted mb-4 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Streak */}
      {streak >= 2 && (
        <div className="text-center mb-3 animate-pop-in">
          <span className="inline-block px-4 py-1.5 rounded-full bg-yellow/30 text-sm font-bold font-body text-foreground">
            🌟 {streak} i rad!
          </span>
        </div>
      )}

      {/* Question card */}
      <div className={`p-8 rounded-3xl shadow-card text-center transition-all ${
        feedback === 'correct' ? 'bg-mint/30 ring-2 ring-mint' :
        feedback === 'wrong' ? 'bg-coral/20 ring-2 ring-coral' :
        'bg-card'
      }`}>
        <p className="text-xs font-body text-muted-foreground mb-3 uppercase tracking-wide">
          {categoryLabels[category]}
        </p>
        <p className="text-5xl font-display text-foreground mb-6 animate-pop-in" key={`${questionNum}-${attempts}`}>
          {question.text} = ?
        </p>

        {/* Answer input */}
        {(feedback === 'idle' || feedback === 'retry') ? (
          <div className="flex gap-3 justify-center">
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="?"
              className="w-36 h-16 text-center text-3xl font-bold font-body rounded-2xl border-2 border-input bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              autoFocus
            />
            <button
              onClick={handleSubmit}
              disabled={!answer.trim()}
              className="h-16 px-8 rounded-2xl bg-primary text-primary-foreground font-bold font-body text-xl shadow-playful hover:shadow-lifted active:scale-95 transition-all disabled:opacity-40"
            >
              ✓
            </button>
          </div>
        ) : (
          <div className="animate-pop-in">
            {feedback === 'correct' ? (
              <div className="space-y-3">
                <p className="text-4xl">🎉</p>
                <p className="text-xl font-bold font-body text-foreground">Rätt! Bra jobbat!</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-4xl">💪</p>
                <p className="text-xl font-bold font-body text-foreground">
                  {encouragement}
                </p>
              </div>
            )}
            <button
              onClick={handleNext}
              className="mt-6 h-14 px-10 rounded-2xl bg-primary text-primary-foreground font-bold font-body text-lg shadow-playful hover:shadow-lifted active:scale-95 transition-all"
            >
              {questionNum >= QUESTIONS_PER_ROUND ? '📊 Se resultat' : '→ Nästa fråga'}
            </button>
          </div>
        )}
      </div>

      {/* Retry encouragement */}
      {feedback === 'retry' && (
        <div className="mt-4 p-4 rounded-2xl bg-yellow/20 text-center animate-pop-in">
          <p className="text-base font-body font-semibold text-foreground">{encouragement}</p>
          <p className="text-sm font-body text-muted-foreground mt-1">Du får försöka en gång till!</p>
        </div>
      )}

      {/* Hints */}
      {(feedback === 'idle' || feedback === 'retry') && (
        <div className="mt-5 space-y-3">
          {hints.slice(0, shownHints).map((hint, i) => (
            <div key={i} className="p-4 rounded-2xl bg-yellow/20 text-base font-body text-foreground animate-pop-in">
              {hint}
            </div>
          ))}
          {shownHints < hints.length && (
            <button
              onClick={handleShowHint}
              className="text-base font-body text-muted-foreground hover:text-foreground transition-colors"
            >
              💡 Visa ledtråd {shownHints > 0 && `(${shownHints}/${hints.length})`}
            </button>
          )}
        </div>
      )}

      {/* Wrong answer hints */}
      {feedback === 'wrong' && (
        <div className="mt-5 space-y-3">
          {hints.map((hint, i) => (
            <div key={i} className="p-4 rounded-2xl bg-yellow/20 text-base font-body text-foreground animate-pop-in"
              style={{ animationDelay: `${i * 0.15}s` }}>
              {hint}
            </div>
          ))}
        </div>
      )}

      {/* Art canvas */}
      <div className="mt-auto pt-6">
        <ArtCanvas correctCount={correctCount} totalAnswered={questionNum - 1 + (feedback === 'correct' || feedback === 'wrong' ? 1 : 0)} />
      </div>
    </div>
  );
}
