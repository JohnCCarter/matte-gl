import { ArtCanvas } from './ArtCanvas';

interface SummaryScreenProps {
  correct: number;
  total: number;
  onRestart: () => void;
}

export function SummaryScreen({ correct, total, onRestart }: SummaryScreenProps) {
  const percentage = Math.round((correct / total) * 100);
  const emoji = percentage >= 80 ? '🏆' : percentage >= 50 ? '👏' : '💪';
  const message = percentage >= 80 ? 'Fantastiskt!' : percentage >= 50 ? 'Bra jobbat!' : 'Fortsätt öva!';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <div className="w-full max-w-sm text-center space-y-6 animate-pop-in">
        <p className="text-6xl">{emoji}</p>
        <h2 className="text-3xl font-display text-foreground">{message}</h2>
        <div className="p-6 rounded-2xl bg-card shadow-card">
          <p className="text-5xl font-display text-primary mb-2">{correct}/{total}</p>
          <p className="text-lg font-body text-muted-foreground">rätt svar</p>
          <div className="mt-4 w-full h-4 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="mt-2 text-sm font-body text-muted-foreground">{percentage}%</p>
        </div>

        <div className="w-full">
          <ArtCanvas correctCount={correct} totalAnswered={total} />
        </div>

        <button
          onClick={onRestart}
          className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold font-body text-lg shadow-playful hover:shadow-lifted active:scale-95 transition-all"
        >
          🎨 Spela igen
        </button>
      </div>
    </div>
  );
}
