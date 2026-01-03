import RestartBtn from '@/assets/icon-restart.svg'

export default function Footer({ isTyping }: { isTyping?: boolean }) {
    return (
        <div className="w-full">
            <button className="mx-auto rounded-lg text-lg font-semibold md:text-xl px-4 py-2.5 bg-ts-neutral-0 text-ts-neutral-900 flex items-center gap-2">
                Restart
                <RestartBtn className="[&_path]:fill-current" />
            </button>
        </div>
    )
}