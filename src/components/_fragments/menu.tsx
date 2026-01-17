'use client';

import { useState } from 'react';
import type { Category, Difficulty, Mode } from '@/hooks/useTypingTest';
import Divider from './divider';
import ControlSection from './control-section';
import StatSection from './stat-section';
import { FileTextIcon, QuoteIcon, Code2Icon, Music2Icon } from 'lucide-react';

interface MenuProps {
  category: Category;
  difficulty: Difficulty;
  mode: Mode;
  accuracy: string;
  wpm: string;
  time: string;
  difficultyLabels: Record<Difficulty, string>;
  onCategoryChange: (category: Category) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onModeChange: (mode: Mode) => void;
  timedDuration: number;
  onTimedChange: (seconds: number) => void;
  testState: 'idle' | 'running' | 'completed';
}

const CATEGORY_OPTIONS: { value: Category; label: string; icon: typeof FileTextIcon }[] = [
  { value: 'general', label: 'General', icon: FileTextIcon },
  { value: 'quotes', label: 'Quotes', icon: QuoteIcon },
  { value: 'code', label: 'Code', icon: Code2Icon },
  { value: 'lyrics', label: 'Lyrics', icon: Music2Icon },
];

const TIMED_DURATIONS = [15, 30, 45, 60, 90, 120];

export default function Menu({
  category,
  difficulty,
  mode,
  accuracy,
  wpm,
  time,
  difficultyLabels,
  onCategoryChange,
  onDifficultyChange,
  onModeChange,
  timedDuration,
  onTimedChange,
  testState
}: MenuProps) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  
  // Dynamic difficulty options based on category
  const difficultyOptions: { value: Difficulty; label: string }[] = [
    { value: 'easy', label: difficultyLabels.easy },
    { value: 'medium', label: difficultyLabels.medium },
    { value: 'hard', label: difficultyLabels.hard },
  ];

  // Get current category icon
  const currentCategoryOption = CATEGORY_OPTIONS.find(opt => opt.value === category) || CATEGORY_OPTIONS[0];
  const CategoryIcon = currentCategoryOption.icon;
  // Desktop options
  const modeOptions = [
    { value: 'timed' as Mode, label: `Timed (${timedDuration}s)`, subOptions: TIMED_DURATIONS.map(s => ({ seconds: s, label: `Timed ${s}s` })) },
    { value: 'passage' as Mode, label: 'Passage' },
  ];

  // Mobile options
  const modeOptionsMobile = [
    ...TIMED_DURATIONS.map(s => ({ parentValue: 'timed' as Mode, seconds: s, label: `Timed ${s}s` })),
    { value: 'passage' as Mode, label: 'Passage' },
  ];
  return (
    <div className="relative z-1 pt-60 -mb-60">
    <div className="overflow-x-auto tiny-scrollbar w-full -mt-60 pb-3 pt-60 rotate-180">
      {/* <div className="overflow-x-auto tiny-scrollbar w-full"> */}
        <div className="inline-flex justify-between items-center flex-wrap lg:flex-nowrap gap-4 pb-4 border-b border-ts-neutral-700 rotate-180">
          <div className="flex gap-4 justify-center items-center w-full lg:w-auto md:justify-start">
            <StatSection label="WPM" value={wpm} />
            <Divider />
            <StatSection label="Accuracy" value={accuracy} />
            <Divider />
            <StatSection label="Time" value={time} />
          </div>
          <div className="grid grid-cols-2 gap-2 w-full md:gap-4 md:flex lg:w-auto">
            {/* Difficulty Selector with Category Icon */}
            <div className="flex items-center gap-2">
              {/* Mobile: Category icon before dropdown */}
              <div className="relative md:hidden">
                <button
                  type="button"
                  onClick={() => !testState.includes('running') && setCategoryOpen(!categoryOpen)}
                  disabled={testState === 'running'}
                  className={`p-2 rounded border border-ts-neutral-500 text-ts-blue-400 ${testState === 'running' ? 'opacity-60 cursor-not-allowed' : 'hover:border-ts-blue-400 hover:text-ts-neutral-0'}`}
                  aria-label="Select category"
                >
                  <CategoryIcon className="w-5 h-5" />
                </button>
                {categoryOpen && testState !== 'running' && (
                  <div className="absolute z-20 mt-1 left-0 w-36 bg-ts-neutral-800 border border-ts-neutral-500 rounded shadow-lg">
                    {CATEGORY_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => { onCategoryChange(opt.value); setCategoryOpen(false); }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left ${category === opt.value ? 'bg-ts-neutral-700 text-ts-blue-400' : 'hover:bg-ts-neutral-700 text-ts-neutral-0'}`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <ControlSection
                label="Difficulty"
                name="difficulty"
                options={difficultyOptions}
                value={difficulty}
                onChange={onDifficultyChange}
                disabled={testState === 'running'}
              />
              {/* Desktop: Category icon after buttons */}
              <div className="relative hidden md:flex items-center">
                <button
                  type="button"
                  onClick={() => !testState.includes('running') && setCategoryOpen(!categoryOpen)}
                  disabled={testState === 'running'}
                  className={`cursor-pointer text-ts-blue-400 ${testState === 'running' ? 'opacity-60 cursor-not-allowed' : 'hover:text-ts-neutral-0'}`}
                  aria-label="Select category"
                >
                  <CategoryIcon className="w-5 h-5" />
                </button>
                {categoryOpen && testState !== 'running' && (
                  <div className="absolute z-20 mt-2 top-6 right-0 w-36 bg-ts-neutral-800 border border-ts-neutral-500 rounded shadow-lg">
                    {CATEGORY_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => { onCategoryChange(opt.value); setCategoryOpen(false); }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left ${category === opt.value ? 'bg-ts-neutral-700 text-ts-blue-400' : 'hover:bg-ts-neutral-700 text-ts-neutral-0'}`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <Divider className="hidden md:block" />

            {/* Mode Selector */}
            <ControlSection
              label="Mode"
              name="mode"
              options={modeOptions}
              optionsMobile={modeOptionsMobile}
              value={mode}
              onChange={onModeChange}
              onSubOptionSelect={(parent, seconds) => {
                onModeChange(parent);
                onTimedChange(seconds);
              }}
              currentTimedDuration={timedDuration}
              disabled={testState === 'running'}
            />
          </div>
        </div>
      {/* </div> */}
    </div>
    </div>
  );
}