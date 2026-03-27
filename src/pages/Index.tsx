import { useState } from 'react';
import { Category, Difficulty } from '@/lib/mathEngine';
import { StartScreen } from '@/components/StartScreen';
import { PracticeScreen } from '@/components/PracticeScreen';
import { SummaryScreen } from '@/components/SummaryScreen';
import { ParentView } from '@/components/ParentView';
import { saveRound } from '@/lib/progressStore';

type Screen = 'start' | 'practice' | 'summary' | 'parent';

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
    saveRound(category, difficulty, correct, total);
    setScreen('summary');
  };

  const handleRestart = () => {
    setScreen('start');
  };

  const handleStartWithDifficulty = (diff: Difficulty) => {
    setDifficulty(diff);
    setScreen('practice');
  };

  return (
    <div className="min-h-screen bg-background">
      {screen === 'start' && <StartScreen onStart={handleStart} onParentView={() => setScreen('parent')} />}
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
          category={category}
          difficulty={difficulty}
          onRestart={handleRestart}
          onStartWithDifficulty={handleStartWithDifficulty}
        />
      )}
      {screen === 'parent' && <ParentView onBack={handleRestart} />}
    </div>
  );
};

export default Index;
