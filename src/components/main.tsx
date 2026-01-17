'use client';

import Menu from "./_fragments/menu";
import TextContainer from "./_fragments/text-container";
import { useTypingTestContext } from "@/context/TypingTestContext";

export type { Difficulty, Mode } from '@/hooks/useTypingTest';

export default function Main() {
  const {
    difficulty,
    mode,
    setDifficulty,
    setMode,
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
        difficulty={difficulty}
        mode={mode}
        accuracy={`${currentAccuracy}%`}
        wpm={currentWPM.toString()}
        time={displayTime}
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