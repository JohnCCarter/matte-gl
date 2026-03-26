import { useState } from 'react';
import { Category, Difficulty } from '@/lib/mathEngine';
import { StartScreen } from '@/components/StartScreen';
import { PracticeScreen } from '@/components/PracticeScreen';
import { SummaryScreen } from '@/components/SummaryScreen';

type Screen = 'start' | 'practice' | 'summary';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('start');
  const [category, setCategory] = useState<Category>('addition');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [results, setResults] = useState({ correct: 0, total: 0 });

  const handleStart = (cat: Category, diff: Difficulty) => {
    setCategory(cat);
    setDifficulty(diff);
    setScreen('practice');
  };

  const handleFinish = (correct: number, total: number) => {
    setResults({ correct, total });
    setScreen('summary');
  };

  const handleRestart = () => {
    setScreen('start');
  };

  return (
    <div className="min-h-screen bg-background">
      {screen === 'start' && <StartScreen onStart={handleStart} />}
      {screen === 'practice' && (
        <PracticeScreen
          category={category}
          difficulty={difficulty}
          onFinish={handleFinish}
          onQuit={handleRestart}
        />
      )}
      {screen === 'summary' && (
        <SummaryScreen
          correct={results.correct}
          total={results.total}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default Index;
