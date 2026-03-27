import { useMemo, useState } from 'react';
import { getDetailedStats, clearProgress } from '@/lib/progressStore';
import { categoryEmojis } from '@/lib/mathEngine';

interface ParentViewProps {
  onBack: () => void;
}

export function ParentView({ onBack }: ParentViewProps) {
  const [cleared, setCleared] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const stats = useMemo(() => getDetailedStats(), [cleared]);

  const handleClear = () => {
    clearProgress();
    setCleared(c => !c);
    setConfirmClear(false);
  };

  if (stats.totalRounds === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md text-center space-y-6 animate-pop-in">
          <h1 className="text-3xl font-display text-foreground">📊 Statistik</h1>
          <p className="text-lg font-body text-muted-foreground">Ingen data ännu! Spela några omgångar först.</p>
          <button onClick={onBack} className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold font-body shadow-playful hover:shadow-lifted active:scale-95 transition-all">
            ← Tillbaka
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-6">
      <div className="w-full max-w-md space-y-5 animate-pop-in">
        <button onClick={onBack} className="text-sm font-body text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors">
          ← Tillbaka
        </button>

        <h1 className="text-3xl font-display text-foreground text-center">📊 För vuxna</h1>

        {/* Overall */}
        <div className="p-5 rounded-2xl bg-card shadow-card text-center">
          <p className="text-4xl font-display text-primary">{stats.overallPct}%</p>
          <p className="text-sm font-body text-muted-foreground mt-1">
            {stats.totalCorrect} rätt av {stats.totalQuestions} · {stats.totalRounds} omgångar
          </p>
        </div>

        {/* Strengths */}
        {stats.best && stats.weakest && stats.byCategory.length > 1 && (
          <div className="p-4 rounded-2xl bg-mint/20 space-y-2">
            <p className="text-sm font-body text-foreground">
              ✅ <span className="font-bold">Starkast i:</span> {stats.best.label} ({stats.best.pct}%)
            </p>
            <p className="text-sm font-body text-foreground">
              📝 <span className="font-bold">Kan öva mer på:</span> {stats.weakest.label} ({stats.weakest.pct}%)
            </p>
          </div>
        )}

        {/* Per category */}
        <div>
          <h2 className="text-lg font-display text-foreground mb-3">Per ämne</h2>
          <div className="space-y-2">
            {stats.byCategory.map(s => (
              <div key={s.category} className="flex items-center justify-between p-3 rounded-xl bg-card shadow-sm">
                <span className="font-body text-foreground">
                  {categoryEmojis[s.category]} {s.label}
                </span>
                <span className="font-body text-muted-foreground text-sm">
                  {s.pct}% · {s.rounds} omg.
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Per difficulty */}
        <div>
          <h2 className="text-lg font-display text-foreground mb-3">Per nivå</h2>
          <div className="space-y-2">
            {stats.byDifficulty.map(s => (
              <div key={s.difficulty} className="flex items-center justify-between p-3 rounded-xl bg-card shadow-sm">
                <span className="font-body text-foreground">{s.label}</span>
                <span className="font-body text-muted-foreground text-sm">
                  {s.pct}% · {s.rounds} omg.
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent rounds */}
        <div>
          <h2 className="text-lg font-display text-foreground mb-3">Senaste omgångar</h2>
          <div className="space-y-2">
            {stats.recent.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-card shadow-sm text-sm">
                <div className="font-body text-foreground">
                  {r.categoryLabel} · {r.difficultyLabel}
                </div>
                <div className="font-body text-muted-foreground">
                  {r.correct}/{r.total} ({r.pct}%)
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clear data */}
        <div className="pt-4 text-center">
          {!confirmClear ? (
            <button onClick={() => setConfirmClear(true)} className="text-sm font-body text-muted-foreground hover:text-destructive transition-colors">
              🗑 Rensa all data
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-body text-foreground">Är du säker? All statistik försvinner.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={handleClear} className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground font-body text-sm font-bold">
                  Ja, rensa
                </button>
                <button onClick={() => setConfirmClear(false)} className="px-4 py-2 rounded-xl bg-muted text-foreground font-body text-sm">
                  Avbryt
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
