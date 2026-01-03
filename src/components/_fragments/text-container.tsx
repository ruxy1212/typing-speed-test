export default function TextContainer({ children, isTyping, setIsTyping }: { children: React.ReactNode; isTyping?: boolean; setIsTyping: (isTyping: boolean) => void; }) {
    return <div className="relative text-ts-neutral-400">
        <div className={`leading-normal text-3xl md:text-4xl ${isTyping ? '' : 'blur-[16px]' }`}>
            {children}
        </div>
        {!isTyping && (
            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                <div className="flex flex-col justify-center items-center gap-4 md:gap-5">
                    <button onClick={() => setIsTyping(true)} className="text-center bg-ts-blue-600 text-ts-neutral-0 text-xl rounded-lg cursor-pointer px-4 py-2 md:px-6 md:py-4">Start Typing Test</button>
                    <span className="text-center text-ts-neutral-0 text-xl">Or click the text and start typing</span>
                </div>
            </div>
        )}
    </div>;
}