import Footer from "@/components/footer";
import Header from "@/components/header";
import Main from "@/components/main";
import Result from "@/components/result";

export default function Home() {
  const showResult = false;
  return (
    <div className="p-4 flex flex-col gap-8 md:p-8 md:gap-10 xl:gap-14">
      <Header />
      {showResult ? (<Result
          accuracy={'100%'}
          wpm={'130'}
          characters={'120/5'}
          verdict={'high-score'}
      />):(<Main />)}
      <Footer isTyping={false} />
    </div>
  );
}
