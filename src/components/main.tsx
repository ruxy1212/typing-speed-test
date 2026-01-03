'use client';

import { useState } from "react";
import Menu from "./_fragments/menu";

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
                onDifficultyChange={setDifficulty}
                onModeChange={setMode}
            />
        </main>
    )
}