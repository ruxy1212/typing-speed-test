'use client';

import type { Difficulty, Mode } from '../main';
import Divider from './divider';
import ControlSection from './control-section';
import StatSection from './stat-section';

interface MenuProps {
    difficulty: Difficulty;
    mode: Mode;
    onDifficultyChange: (difficulty: Difficulty) => void;
    onModeChange: (mode: Mode) => void;
}

const difficultyOptions: { value: Difficulty; label: string }[] = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
];

const modeOptions: { value: Mode; label: string }[] = [
    { value: 'timed', label: 'Timed (60s)' },
    { value: 'passage', label: 'Passage' },
];

export default function Menu({ 
    difficulty, 
    mode, 
    onDifficultyChange, 
    onModeChange 
}: MenuProps) {
    return (
        <div className="flex justify-between items-center flex-wrap lg:flex-nowrap gap-4 pb-4 border-b border-ts-neutral-700">
            <div className="flex gap-4 justify-center items-center w-full lg:w-auto md:justify-start">
                <StatSection label="WPM" value={'130'} />
                <Divider />
                <StatSection label="Accuracy" value={'100%'} />
                <Divider />
                <StatSection label="Time" value={'0:60'} />
            </div>
            <div className="grid grid-cols-2 gap-2 w-full md:gap-4 md:flex lg:w-auto">
                {/* Difficulty Selector */}
                <ControlSection
                    label="Difficulty"
                    name="difficulty"
                    options={difficultyOptions}
                    value={difficulty}
                    onChange={onDifficultyChange}
                />
                <Divider className="hidden md:block"/>
                
                {/* Mode Selector */}
                <ControlSection
                    label="Mode"
                    name="mode"
                    options={modeOptions}
                    value={mode}
                    onChange={onModeChange}
                />
            </div>
        </div>
    );
}