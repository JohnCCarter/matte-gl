import { Category, Difficulty, categoryLabels, categoryEmojis, difficultyLabels, difficultyEmojis } from '@/lib/mathEngine';
import { getStats } from '@/lib/progressStore';
import { useState, useMemo } from 'react';

interface StartScreenProps {
  onStart: (category: Category, difficulty: Difficulty) => void;
  onParentView: () => void;
}

const categories: Category[] = ['addition', 'multiplication', 'division', 'mixed'];
const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

const categoryColors: Record<Category, string> = {
  addition: 'bg-pink text-primary-foreground',
  multiplication: 'bg-turquoise text-primary-foreground',
  division: 'bg-purple text-primary-foreground',
  mixed: 'bg-orange text-primary-foreground',
};

const difficultyColors: Record<Difficulty, string> = {
  easy: 'bg-mint text-foreground',
  medium: 'bg-yellow text-foreground',
  hard: 'bg-coral text-primary-foreground',
};

function handleSurprise(onStart: (cat: Category, diff: Difficulty) => void) {
  const cat = categories[Math.floor(Math.random() * categories.length)];
  const diff = difficulties[Math.floor(Math.random() * difficulties.length)];
  onStart(cat, diff);
}

export function StartScreen({ onStart, onParentView }: StartScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const stats = useMemo(() => getStats(), []);

  return (
    <div className="flex flex-col items-center px-4 py-6 min-h-screen">
      {/* Header */}
      <div className="text-center mb-6 animate-pop-in">
        <h1 className="text-4xl font-display text-foreground mb-2">🎨 Matteateljén</h1>
        <p className="text-lg font-body text-muted-foreground">Öva matte och måla!</p>
      </div>

      {/* Stats */}
      {stats.totalRounds > 0 && (
        <div className="mb-6 px-5 py-3 rounded-2xl bg-yellow/20 text-center animate-pop-in">
          <p className="text-sm font-body text-foreground">
            🌟 Du har spelat <span className="font-bold">{stats.totalRounds}</span> omgångar med{' '}
            <span className="font-bold">{stats.totalCorrect}</span> rätt av {stats.totalQuestions}!
          </p>
        </div>
      )}

      {/* Surprise button */}
      {!selectedCategory && (
        <button
          onClick={() => handleSurprise(onStart)}
          className="w-full max-w-sm mb-6 p-5 rounded-2xl bg-primary text-primary-foreground shadow-playful text-center transition-all active:scale-95 hover:shadow-lifted animate-pop-in"
        >
          <span className="text-2xl mr-3">🎲</span>
          <span className="text-lg font-bold font-body">Överraska mig!</span>
        </button>
      )}

      {/* Category selection */}
      {!selectedCategory ? (
        <div className="w-full max-w-sm space-y-3">
          <h2 className="text-xl font-display text-center text-foreground mb-4">Välj ämne</h2>
          {categories.map((cat, i) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full p-5 rounded-2xl shadow-card text-left transition-all active:scale-95 hover:shadow-lifted animate-pop-in ${categoryColors[cat]}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span className="text-2xl mr-3">{categoryEmojis[cat]}</span>
              <span className="text-lg font-bold font-body">{categoryLabels[cat]}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-sm font-body text-muted-foreground mb-2 flex items-center gap-1 hover:text-foreground transition-colors"
          >
            ← Tillbaka
          </button>
          <h2 className="text-xl font-display text-center text-foreground mb-4">
            {categoryEmojis[selectedCategory]} Välj nivå
          </h2>
          {difficulties.map((diff, i) => (
            <button
              key={diff}
              onClick={() => onStart(selectedCategory, diff)}
              className={`w-full p-5 rounded-2xl shadow-card text-left transition-all active:scale-95 hover:shadow-lifted animate-pop-in ${difficultyColors[diff]}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span className="text-2xl mr-3">{difficultyEmojis[diff]}</span>
              <span className="text-lg font-bold font-body">{difficultyLabels[diff]}</span>
            </button>
          ))}
        </div>
      )}

      {/* Parent link */}
      <button
        onClick={onParentView}
        className="mt-8 text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
      >
        📊 För vuxna
      </button>
    </div>
  );
}
