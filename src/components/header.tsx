import LogoLarge from "@/assets/logo-large.svg"
import LogoSmall from "@/assets/logo-small.svg"
import TrophyIcon from "@/assets/icon-personal-best.svg"

export default function Header() {
    return (
        <header className="w-full max-w-[1200px] mx-auto flex justify-between items-center">
            <div>
                <LogoLarge className="hidden md:block h-10" />
                <LogoSmall className="block md:hidden h-8" />
            </div>
            <div className="flex gap-2.5 items-center justify-center">
                <TrophyIcon className="h-4 md:h-[18px]" />
                <h3 className="text-ts-neutral-400 text-lg">
                    <span className="hidden md:inline">Personal best:</span>
                    <span className="md:hidden">Best:</span>{' '}
                    <span className="text-ts-neutral-0">92 WPM</span>
                </h3>
            </div>
        </header>
    )
}