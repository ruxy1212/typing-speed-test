'use client';

import { useState } from "react";
import Menu from "./_fragments/menu";
import TextContainer from "./_fragments/text-container";

export type Difficulty = 'easy' | 'medium' | 'hard';
export type Mode = 'timed' | 'passage';

export default function Main() {
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [mode, setMode] = useState<Mode>('timed');

    return (
        <main className="flex flex-col gap-8">
            <Menu 
                difficulty={difficulty}
                mode={mode}
                accuracy={'100%'}
                wpm={'130'}
                time={'0:60'}
                onDifficultyChange={setDifficulty}
                onModeChange={setMode}
            />
            <TextContainer></TextContainer>
        </main>
    )
}