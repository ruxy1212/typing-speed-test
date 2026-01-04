'use client';

import RestartBtn from '@/assets/icon-restart.svg'
import { useTypingTestContext } from '@/context/TypingTestContext'

export default function Footer() {
    const { restart, testState } = useTypingTestContext();
    const isTyping = testState === 'running';
    
    return (
        <div className="w-full">
            <button 
                onClick={restart}
                className="mx-auto rounded-lg text-lg font-semibold md:text-xl px-4 py-2.5 bg-ts-neutral-0 text-ts-neutral-900 flex items-center gap-2 transition-opacity hover:opacity-80"
            >
                Restart
                <RestartBtn className="[&_path]:fill-current" />
            </button>
        </div>
    )
}