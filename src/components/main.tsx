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
    } = useTypingTestContext();

    return (
        <main className="flex flex-col gap-8">
            <Menu 
                difficulty={difficulty}
                mode={mode}
                accuracy={`${currentAccuracy}%`}
                wpm={currentWPM.toString()}
                time={displayTime}
                onDifficultyChange={setDifficulty}
                onModeChange={setMode}
            />
            <TextContainer />
        </main>
    )
}