import IconCompleted from "@/assets/icon-completed.svg";
import Star1 from "@/assets/pattern-star-1.svg";
import Star2 from "@/assets/pattern-star-2.svg";
import ResultCard from "./_fragments/result-card";

export default function Result({ wpm, accuracy, characters }: { wpm: string; accuracy: string; characters: string }) {
    return (
        <div className="relative flex flex-col justify-center items-center gap-6 md:gap-8">
            <div className="rounded-full p-3 bg-ts-green-500/10 md:p-4">
                <div className="rounded-full p-3 bg-ts-green-500/20 md:p-4">
                    <IconCompleted className="md:h-16 md:w-16" />
                </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 md:gap-2.5">
                <h1 className="text-2xl md:text-4xl text-ts-neutral-0">Test Complete!</h1>
                <p className="text-center text-ts-neutral-400 text-lg md:text-xl">
                    Solid run. Keep pushing to beat your high score.
                </p>
            </div>
            <div className="w-full flex flex-col justify-center items-center gap-4 md:flex-row md:gap-5">
                <ResultCard label="WPM" value={wpm} />
                <ResultCard label="Accuracy" value={accuracy} />
                <ResultCard label="Characters" value={characters} />
            </div>
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="relative h-full w-full">
                    <Star2 className="absolute top-1/5 left-6" />
                    <Star1 className="absolute -bottom-1/5 right-6" />
                </div>
            </div>
        </div>
    )
}