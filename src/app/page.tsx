import Header from "@/components/header";
import Main from "@/components/main";

export default function Home() {
  return (
    <div className="p-4 flex flex-col gap-8 md:p-8 md:gap-10 xl:gap-14">
      <Header />
      <Main />
    </div>
  );
}
