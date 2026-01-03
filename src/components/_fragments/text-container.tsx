export default function TextContainer({ children, isTyping, setIsTyping }: { children: React.ReactNode; isTyping?: boolean; setIsTyping: (isTyping: boolean) => void; }) {
    return <div className="relative text-ts-neutral-400 pb-4 border-b border-ts-neutral-700">
        <div className={`leading-normal text-3xl md:text-4xl ${isTyping ? '' : 'blur-[16px]' }`}>
            {children}
        </div>
        {!isTyping && (
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-[clamp(20vh,50%,30vh)]">
                <div className="flex flex-col justify-center items-center gap-4 whitespace-nowrap md:gap-5">
                    <button onClick={() => setIsTyping(true)} className="text-center bg-ts-blue-600 text-ts-neutral-0 text-xl rounded-lg cursor-pointer px-4 py-2 md:px-6 md:py-4 transition-colors hover:bg-ts-blue-400">Start Typing Test</button>
                    <span className="text-center text-ts-neutral-0 text-xl">Or click the text and start typing</span>
                </div>
            </div>
        )}
    </div>;
}