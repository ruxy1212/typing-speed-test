'use client';

import Link from "next/link";
import LogoLarge from "@/assets/logo-large.svg"
import LogoSmall from "@/assets/logo-small.svg"
import TrophyIcon from "@/assets/icon-personal-best.svg"
import { Volume2, VolumeX } from "lucide-react"
import { useTypingTestContext } from "@/context/TypingTestContext"

export default function Header() {
  const { personalBest, soundEnabled, toggleSound } = useTypingTestContext();

  return (
    <header className="w-full max-w-344 mx-auto flex justify-between items-center">
      <Link href="/" aria-label="Go to homepage">
        <LogoLarge className="hidden md:block h-10" />
        <LogoSmall className="block md:hidden h-8" />
      </Link>
      <div className="flex gap-4 items-center justify-center">
        <div className="flex gap-2.5 items-center">
          <TrophyIcon className="h-4 md:h-4.5" />
          <h3 className="text-ts-neutral-400 text-lg">
            <span className="hidden md:inline">Personal best:</span>
            <span className="md:hidden">Best:</span>{' '}
            <span className="text-ts-neutral-0">
              {personalBest !== null ? `${personalBest} WPM` : '0 WPM'}
            </span>
          </h3>
        </div>
        <button
          onClick={toggleSound}
          className={`cursor-pointer p-2 rounded-full transition-colors duration-200 border hover:text-ts-blue-400 hover:bg-ts-neutral-800 ${soundEnabled ? 'text-ts-blue-600 border-ts-blue-400' : 'text-ts-neutral-400 border-ts-neutral-400'}`}
          aria-label={soundEnabled ? "Mute sounds" : "Unmute sounds"}
          title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5" />
          ) : (
            <VolumeX className="w-5 h-5" />
          )}
        </button>
      </div>
    </header>
  )
}