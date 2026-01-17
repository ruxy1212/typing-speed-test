import IconCompleted from "@/assets/icon-completed.svg";
import IconHighScore from "@/assets/icon-new-pb.svg";
import Star1 from "@/assets/pattern-star-1.svg";
import Star2 from "@/assets/pattern-star-2.svg";
import Confetti from "@/assets/pattern-confetti.svg";
import ResultCard from "./_fragments/result-card";
import Heatmap from "./_fragments/heat-map";
import { useTypingTestContext } from "@/context/TypingTestContext";

// accuracy={`${result.accuracy}%`}
//           wpm={result.wpm.toString()}
//           characters={RenderCharacters(result.correctChars, result.incorrectChars)}
//           verdict={result.verdict}
//           keyStats={keyStats}
//           keyList={keyList}


// { wpm, accuracy, characters, verdict = 'default' }: { wpm: string; accuracy: string; characters: React.ReactNode; keyStats: { [key: string]: { count: number; errors: number } }; keyList: string[]; verdict?: 'new-game' | 'default' | 'high-score' }

const RenderCharacters = (correct: number, incorrect: number) => {
  return (
    <>
      <span className="text-ts-green-500">{correct}</span>
      <span className="text-ts-neutral-400">/</span>
      <span className={incorrect > 0 ? 'text-ts-red-500' : 'text-ts-neutral-0' }>{incorrect}</span>
    </>
  )
};

export default function Result() {
  const { result, keyStats, keyList, resultTab } = useTypingTestContext();
  const verdict = result?.verdict || 'default';
  const wpm = result ? result.wpm.toString() : '0';
  const accuracy = result ? `${result.accuracy}%` : '0%';
  const characters = result ? RenderCharacters(result.correctChars, result.incorrectChars) : RenderCharacters(0, 0);
  const title = {
    'new-game': {
      heading: 'Baseline Established!',
      message: "You've set the bar. Now the real challenge begins — time to beat it.",
    },
    'default': {
      heading: 'Test Complete!',
      message: 'Solid run. Keep pushing to beat your high score.',
    },
    'high-score': {
      heading: 'High Score Smashed!',
      message: "You're getting faster. That was incredible typing.",
    }
  }
  return (
    <div className="relative flex flex-col justify-center items-center w-full max-w-344 mx-auto gap-6 md:gap-8">
      {verdict === 'high-score' ? (
        <IconHighScore className="" />
      ) : (
        <div className="rounded-full p-3 bg-ts-green-500/10 md:p-4">
          <div className="rounded-full p-3 bg-ts-green-500/20 md:p-4">
            <IconCompleted className="md:h-16 md:w-16" />
          </div>
        </div>
      )}
      <div className="flex flex-col items-center justify-center gap-2 md:gap-2.5">
        <h1 className="text-2xl md:text-4xl text-ts-neutral-0">{title[verdict].heading}</h1>
        <p className="text-center text-ts-neutral-400 text-lg md:text-xl">
          {title[verdict].message}
        </p>
      </div>
      {resultTab === 'summary' ? (
        <div className="w-full flex flex-col justify-center items-center gap-4 md:flex-row md:gap-5">
          <ResultCard label="WPM" value={wpm} />
          <ResultCard label="Accuracy" value={accuracy} color={parseFloat(accuracy) >= 50 ? 'text-ts-green-500' : 'text-ts-red-500'} />
          <ResultCard label="Characters" value={characters} type="node" />
        </div>
      ) : (
        <div className="w-full">
          <Heatmap stats={keyStats} keyList={keyList} />
        </div>
      )}

      {verdict === 'high-score' ? (
        <Confetti className="fixed bottom-0 left-0 w-full -z-1" />
      ) : (
        <div className="absolute top-0 left-0 w-full h-full select-none pointer-events-none">
          <div className="relative h-full w-full">
            <Star2 className="absolute top-1/5 left-6" />
            <Star1 className="absolute -bottom-1/5 right-6" />
          </div>
        </div>
      )}
    </div>
  )
}