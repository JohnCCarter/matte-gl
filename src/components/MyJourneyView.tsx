import { useMemo } from 'react';
import { getMilestones, getRecentRounds } from '@/lib/progressStore';
import { categoryLabels, categoryEmojis } from '@/lib/mathEngine';

interface MyJourneyViewProps {
  onBack: () => void;
}

function positiveMessage(correct: number, total: number): string {
  if (correct === total) return 'Perfekt! 🌟';
  if (correct >= total * 0.8) return 'Fantastiskt! ✨';
  if (correct >= total * 0.5) return 'Bra jobbat! 💪';
  return 'Snyggt försök! 🌈';
}

export function MyJourneyView({ onBack }: MyJourneyViewProps) {
  const milestones = useMemo(() => getMilestones(), []);
  const recent = useMemo(() => getRecentRounds(5), []);

  const totalStars = recent.length > 0 ? milestones.filter(m => m.achieved).length : 0;
  const achievedMilestones = milestones.filter(m => m.achieved);
  const upcomingMilestone = milestones.find(m => !m.achieved);

  // Unique categories explored
  const categoriesExplored = [...new Set(recent.map(r => r.category))];

  return (
    <div className="flex flex-col items-center px-4 py-6 min-h-screen">
      <button
        onClick={onBack}
        className="self-start text-sm font-body text-muted-foreground mb-4 flex items-center gap-1 hover:text-foreground transition-colors"
      >
        ← Tillbaka
      </button>

      <h1 className="text-3xl font-display text-foreground mb-2 animate-pop-in">🌟 Min resa</h1>
      <p className="text-muted-foreground font-body mb-6 animate-pop-in">Se hur långt du har kommit!</p>

      {/* Stars collected */}
      <div className="w-full max-w-sm mb-6 p-5 rounded-2xl bg-yellow/20 text-center animate-pop-in">
        <p className="text-lg font-bold font-body text-foreground mb-2">Mina stjärnor</p>
        <div className="text-3xl">
          {totalStars > 0
            ? Array.from({ length: Math.min(totalStars, 20) }, (_, i) => '⭐').join('')
            : <span className="text-muted-foreground text-base font-body">Spela en omgång för att samla stjärnor!</span>
          }
        </div>
      </div>

      {/* Milestones */}
      {achievedMilestones.length > 0 && (
        <div className="w-full max-w-sm mb-6 animate-pop-in">
          <h2 className="text-xl font-display text-foreground mb-3 text-center">🏆 Milstolpar</h2>
          <div className="space-y-2">
            {achievedMilestones.map((m, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-mint/30 text-foreground font-body text-sm flex items-center gap-2 animate-pop-in"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <span className="text-xl">{m.emoji}</span>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next milestone */}
      {upcomingMilestone && (
        <div className="w-full max-w-sm mb-6 p-4 rounded-2xl bg-purple/10 text-center animate-pop-in">
          <p className="text-sm font-body text-muted-foreground">Nästa milstolpe:</p>
          <p className="font-bold font-body text-foreground mt-1">
            {upcomingMilestone.emoji} {upcomingMilestone.label}
          </p>
        </div>
      )}

      {/* Categories explored */}
      {categoriesExplored.length > 0 && (
        <div className="w-full max-w-sm mb-6 animate-pop-in">
          <h2 className="text-xl font-display text-foreground mb-3 text-center">🎨 Ämnen jag testat</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {categoriesExplored.map(cat => (
              <span
                key={cat}
                className="px-4 py-2 rounded-full bg-turquoise/20 text-foreground font-body text-sm font-bold"
              >
                {categoryEmojis[cat]} {categoryLabels[cat]}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent rounds */}
      {recent.length > 0 && (
        <div className="w-full max-w-sm mb-6 animate-pop-in">
          <h2 className="text-xl font-display text-foreground mb-3 text-center">📖 Senaste omgångar</h2>
          <div className="space-y-2">
            {recent.slice().reverse().map((r, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-pink/10 text-foreground font-body text-sm flex items-center justify-between"
              >
                <span>{categoryEmojis[r.category]} {categoryLabels[r.category]}</span>
                <span className="font-bold">{r.correct} av {r.total} rätt — {positiveMessage(r.correct, r.total)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {recent.length === 0 && (
        <div className="w-full max-w-sm p-5 rounded-2xl bg-mint/10 text-center animate-pop-in">
          <p className="text-lg mb-2">🚀</p>
          <p className="font-body text-foreground">Börja spela för att se din resa här!</p>
        </div>
      )}
    </div>
  );
}
