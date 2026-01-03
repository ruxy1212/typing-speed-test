import LogoLarge from "@/assets/logo-large.svg"
import LogoSmall from "@/assets/logo-small.svg"

export default function Header() {
    return (
        <header className="w-full max-w-[1200px] flex justify-between items-center">
            <div className="flex gap-2 items-center">
                <picture>
                    <source media="(min-width: 768px)" srcSet={LogoLarge} />
                    <img src={LogoSmall} alt="Typing Speed Test logo" />
                </picture>
            </div>
        </header>
    )
}