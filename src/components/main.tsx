'use client';

import Menu from "./_fragments/menu";
import TextContainer from "./_fragments/text-container";
import { useTypingTestContext } from "@/context/TypingTestContext";

export type { Category, Difficulty, Mode } from '@/hooks/useTypingTest';

export default function Main() {
  const {
    category,
    difficulty,
    mode,
    setCategory,
    setDifficulty,
    setMode,
    difficultyLabels,
    currentWPM,
    currentAccuracy,
    displayTime,
    testState,
    timedDuration,
    setTimedDuration,
  } = useTypingTestContext();

  return (
    <main className="flex flex-col max-w-344 w-full self-center gap-0">
      <Menu
        category={category}
        difficulty={difficulty}
        mode={mode}
        accuracy={`${currentAccuracy}%`}
        wpm={currentWPM.toString()}
        time={displayTime}
        difficultyLabels={difficultyLabels}
        onCategoryChange={setCategory}
        onDifficultyChange={setDifficulty}
        onModeChange={setMode}
        timedDuration={timedDuration}
        onTimedChange={setTimedDuration}
        testState={testState}
      />
      <TextContainer />
    </main>
  )
}