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
            <TextContainer children={`The archaeological expedition unearthed artifacts that complicated prevailing theories about Bronze Age trade networks. Obsidian from Anatolia, lapis lazuli from Afghanistan, and amber from the Baltic—all discovered in a single Mycenaean tomb—suggested commercial connections far more extensive than previously hypothesized. "We've underestimated ancient peoples' navigational capabilities and their appetite for luxury goods," the lead researcher observed. "Globalization isn't as modern as we assume."`} />
        </main>
    )
}

// Text example, from @/data/data.json: 
// The archaeological expedition unearthed artifacts that complicated prevailing theories about Bronze Age trade networks. Obsidian from Anatolia, lapis lazuli from Afghanistan, and amber from the Baltic—all discovered in a single Mycenaean tomb—suggested commercial connections far more extensive than previously hypothesized. "We've underestimated ancient peoples' navigational capabilities and their appetite for luxury goods," the lead researcher observed. "Globalization isn't as modern as we assume."