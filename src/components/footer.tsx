'use client';

import { useState } from 'react';
import RestartBtn from '@/assets/icon-restart.svg'
import { useTypingTestContext } from '@/context/TypingTestContext'
import { LucideEllipsisVertical, Share2, X } from 'lucide-react';
import ShareModal from './_fragments/share-modal';

export default function Footer() {
  const { restart, testState, toggleHeatMap, resultTab, result } = useTypingTestContext();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <div className="w-full flex justify-center gap-5 md:gap-6">
      <button
        onClick={restart}
        className={`rounded-lg text-lg font-semibold md:text-xl px-4 py-2.5 items-center gap-2 cursor-pointer transition-opacity focus:ring-2 focus:ring-ts-blue-400 focus:ring-offset-2 focus:ring-offset-ts-neutral-900 hover:opacity-80 ${testState === 'idle' ? 'hidden' : 'flex'} ${testState === 'running' ? 'bg-ts-neutral-800 text-ts-neutral-0' : 'bg-ts-neutral-0 text-ts-neutral-900'}`}
      >
        <span className="hidden md:inline">{testState === 'running' ? 'Restart Test' : 'Go Again'}</span>
        <RestartBtn className="[&_path]:fill-current" />
      </button>
      {testState === 'completed' && (
        <>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className={`rounded-lg text-lg font-semibold md:text-xl px-4 py-2.5 items-center gap-2 cursor-pointer transition-opacity hover:opacity-80 flex bg-ts-neutral-0 text-ts-neutral-900 focus:ring-2 focus:ring-ts-blue-400 focus:ring-offset-2 focus:ring-offset-ts-neutral-900`}
          >
            <span className="hidden md:inline">Share</span>
            <Share2 className="[&_path]:fill-current" />
          </button>
          <button
            onClick={toggleHeatMap}
            className={`rounded-lg text-lg font-semibold md:text-xl px-4 py-2.5 items-center gap-2 cursor-pointer focus:ring-2 focus:ring-ts-blue-400 focus:ring-offset-2 focus:ring-offset-ts-neutral-900 transition-opacity hover:opacity-80 flex ${resultTab === 'summary' ? 'bg-ts-neutral-0 text-ts-neutral-900' : 'text-ts-neutral-0 bg-ts-neutral-700'}`}
          >
            {resultTab === 'summary' ? <LucideEllipsisVertical className="[&_path]:fill-current" /> : <X className="[&_path]:fill-current" />}
          </button>
          <ShareModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            wpm={result ? result.wpm.toString() : '0'}
            accuracy={result ? `${result.accuracy}%` : '0%'}
            correct={result?.correctChars ?? 0}
            incorrect={result?.incorrectChars ?? 0}
          />
        </>
      )}
    </div>
  )
}