'use client';

import RestartBtn from '@/assets/icon-restart.svg'
import { useTypingTestContext } from '@/context/TypingTestContext'

export default function Footer() {
  const { restart, testState } = useTypingTestContext();

  return (
    <div className="w-full">
      <button
        onClick={restart}
        className={`mx-auto rounded-lg text-lg font-semibold md:text-xl px-4 py-2.5 items-center gap-2 cursor-pointer transition-opacity hover:opacity-80 ${testState === 'idle' ? 'hidden' : 'flex'} ${testState === 'running' ? 'bg-ts-neutral-800 text-ts-neutral-0' : 'bg-ts-neutral-0 text-ts-neutral-900'}`}
      >
        {testState === 'running' ? 'Restart Test' : 'Go Again'}
        <RestartBtn className="[&_path]:fill-current" />
      </button>
    </div>
  )
}