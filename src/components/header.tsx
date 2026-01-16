'use client';

import LogoLarge from "@/assets/logo-large.svg"
import LogoSmall from "@/assets/logo-small.svg"
import TrophyIcon from "@/assets/icon-personal-best.svg"
import { useTypingTestContext } from "@/context/TypingTestContext"

export default function Header() {
    const { personalBest } = useTypingTestContext();
    
    return (
        <header className="w-full max-w-300 mx-auto flex justify-between items-center">
            <div>
                <LogoLarge className="hidden md:block h-10" />
                <LogoSmall className="block md:hidden h-8" />
            </div>
            <div className="flex gap-2.5 items-center justify-center">
                <TrophyIcon className="h-4 md:h-4.5" />
                <h3 className="text-ts-neutral-400 text-lg">
                    <span className="hidden md:inline">Personal best:</span>
                    <span className="md:hidden">Best:</span>{' '}
                    <span className="text-ts-neutral-0">
                        {personalBest !== null ? `${personalBest} WPM` : '0 WPM'}
                    </span>
                </h3>
            </div>
        </header>
    )
}