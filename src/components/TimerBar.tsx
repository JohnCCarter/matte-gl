import { useEffect, useState } from 'react';

interface TimerBarProps {
  isRunning: boolean;
  onTimeUp?: () => void;
  duration?: number; // seconds
  reset?: number; // increment to reset
}

export function TimerBar({ isRunning, onTimeUp, duration = 60, reset }: TimerBarProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(0);
  }, [reset]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= duration) {
          onTimeUp?.();
          return prev;
        }
        return prev + 0.1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isRunning, duration, onTimeUp]);

  const progress = Math.min((elapsed / duration) * 100, 100);
  const isLow = progress > 75;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-body font-semibold text-muted-foreground mb-1">
        <span>⏱️ Tid</span>
        <span>{Math.max(0, Math.ceil(duration - elapsed))}s</span>
      </div>
      <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-100"
          style={{
            width: `${100 - progress}%`,
            background: isLow
              ? 'hsl(var(--destructive))'
              : 'linear-gradient(90deg, hsl(var(--turquoise)), hsl(var(--mint)))',
          }}
        />
      </div>
    </div>
  );
}
