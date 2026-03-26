import { useState, useCallback, useEffect, useRef } from 'react';
import { Category, Difficulty, MathQuestion, generateQuestion, getHints, QUESTIONS_PER_ROUND, categoryLabels, difficultyLabels } from '@/lib/mathEngine';
import { TimerBar } from './TimerBar';
import { ArtCanvas } from './ArtCanvas';

interface PracticeScreenProps {
  category: Category;
  difficulty: Difficulty;
  onFinish: (correct: number, total: number) => void;
  onQuit: () => void;
}

type FeedbackState = 'idle' | 'correct' | 'wrong';

export function PracticeScreen({ category, difficulty, onFinish, onQuit }: PracticeScreenProps) {
  const [question, setQuestion] = useState<MathQuestion>(() => generateQuestion(category, difficulty));
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const [hints, setHints] = useState<string[]>([]);
  const [shownHints, setShownHints] = useState(0);
  const [questionNum, setQuestionNum] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [timerReset, setTimerReset] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const allHints = useCallback(() => getHints(question), [question]);

  useEffect(() => {
    setHints(allHints());
  }, [allHints]);

  useEffect(() => {
    if (feedback === 'idle') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [feedback, questionNum]);

  const handleSubmit = () => {
    if (answer.trim() === '') return;
    const numAnswer = Number(answer);
    if (numAnswer === question.answer) {
      setFeedback('correct');
      setCorrectCount((c) => c + 1);
    } else {
      setFeedback('wrong');
      setShownHints(hints.length); // show all hints on wrong
    }
  };

  const handleNext = () => {
    if (questionNum >= QUESTIONS_PER_ROUND) {
      onFinish(correctCount + (feedback === 'correct' ? 0 : 0), QUESTIONS_PER_ROUND);
      return;
    }
    setQuestion(generateQuestion(category, difficulty));
    setAnswer('');
    setFeedback('idle');
    setShownHints(0);
    setQuestionNum((n) => n + 1);
    setTimerReset((r) => r + 1);
  };

  const handleShowHint = () => {
    if (shownHints < hints.length) {
      setShownHints((s) => s + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (feedback !== 'idle') handleNext();
      else handleSubmit();
    }
  };

  const progress = (questionNum / QUESTIONS_PER_ROUND) * 100;

  return (
    <div className="flex flex-col min-h-screen px-4 py-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={onQuit} className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
          ✕ Avsluta
        </button>
        <span className="text-sm font-body font-bold text-foreground">
          {questionNum}/{QUESTIONS_PER_ROUND}
        </span>
        <span className="text-xs font-body text-muted-foreground">
          {difficultyLabels[difficulty]}
        </span>
      </div>

      {/* Progress */}
      <div className="w-full h-2 rounded-full bg-muted mb-3 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Timer */}
      <TimerBar isRunning={feedback === 'idle'} duration={45} reset={timerReset} />

      {/* Question card */}
      <div className={`mt-4 p-6 rounded-2xl shadow-card text-center transition-all ${
        feedback === 'correct' ? 'bg-mint/30 ring-2 ring-mint' :
        feedback === 'wrong' ? 'bg-coral/20 ring-2 ring-coral' :
        'bg-card'
      }`}>
        <p className="text-xs font-body text-muted-foreground mb-2 uppercase tracking-wide">
          {categoryLabels[category]}
        </p>
        <p className="text-4xl font-display text-foreground mb-4 animate-pop-in" key={questionNum}>
          {question.text} = ?
        </p>

        {/* Answer input */}
        {feedback === 'idle' ? (
          <div className="flex gap-2 justify-center">
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ditt svar"
              className="w-32 h-14 text-center text-2xl font-bold font-body rounded-xl border-2 border-input bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              autoFocus
            />
            <button
              onClick={handleSubmit}
              disabled={!answer.trim()}
              className="h-14 px-6 rounded-xl bg-primary text-primary-foreground font-bold font-body text-lg shadow-playful hover:shadow-lifted active:scale-95 transition-all disabled:opacity-40"
            >
              ✓
            </button>
          </div>
        ) : (
          <div className="animate-pop-in">
            {feedback === 'correct' ? (
              <div className="space-y-2">
                <p className="text-3xl">🎉</p>
                <p className="text-lg font-bold font-body text-foreground">Rätt! Bra jobbat!</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-3xl">😊</p>
                <p className="text-lg font-bold font-body text-foreground">
                  Inte riktigt! Svaret är <span className="text-primary">{question.answer}</span>
                </p>
              </div>
            )}
            <button
              onClick={handleNext}
              className="mt-4 h-12 px-8 rounded-xl bg-primary text-primary-foreground font-bold font-body shadow-playful hover:shadow-lifted active:scale-95 transition-all"
            >
              {questionNum >= QUESTIONS_PER_ROUND ? '📊 Se resultat' : '→ Nästa fråga'}
            </button>
          </div>
        )}
      </div>

      {/* Hints */}
      {feedback === 'idle' && (
        <div className="mt-4 space-y-2">
          {hints.slice(0, shownHints).map((hint, i) => (
            <div key={i} className="p-3 rounded-xl bg-yellow/20 text-sm font-body text-foreground animate-pop-in">
              {hint}
            </div>
          ))}
          {shownHints < hints.length && (
            <button
              onClick={handleShowHint}
              className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
            >
              💡 Visa ledtråd {shownHints > 0 && `(${shownHints}/${hints.length})`}
            </button>
          )}
        </div>
      )}

      {/* Wrong answer hints */}
      {feedback === 'wrong' && (
        <div className="mt-4 space-y-2">
          {hints.map((hint, i) => (
            <div key={i} className="p-3 rounded-xl bg-yellow/20 text-sm font-body text-foreground animate-pop-in"
              style={{ animationDelay: `${i * 0.15}s` }}>
              {hint}
            </div>
          ))}
        </div>
      )}

      {/* Art canvas */}
      <div className="mt-auto pt-4">
        <ArtCanvas correctCount={correctCount} totalAnswered={questionNum - 1 + (feedback !== 'idle' ? 1 : 0)} />
      </div>
    </div>
  );
}
