'use client';

import Footer from "@/components/footer";
import Header from "@/components/header";
import Main from "@/components/main";
import Result from "@/components/result";
import { TypingTestProvider, useTypingTestContext } from "@/context/TypingTestContext";

const RenderCharacters = (correct: number, incorrect: number) => {
  return (
    <>
      <span className="text-ts-green-500">{correct}</span>
      <span className="text-ts-neutral-400">/</span>
      <span className={incorrect > 0 ? 'text-ts-red-500' : 'text-ts-neutral-0' }>{incorrect}</span>
    </>
  )
}

function HomeContent() {
  const { testState, result } = useTypingTestContext();
  const showResult = testState === 'completed' && result !== null;
  
  return (
    <div className="p-4 flex flex-col gap-8 md:p-8 md:gap-10 xl:gap-14">
      <Header />
      {showResult && result ? (
        <Result
          accuracy={`${result.accuracy}%`}
          wpm={result.wpm.toString()}
          characters={RenderCharacters(result.correctChars, result.incorrectChars)}
          verdict={result.verdict}
        />
      ) : (
        <Main />
      )}
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <TypingTestProvider>
      <HomeContent />
    </TypingTestProvider>
  );
}
