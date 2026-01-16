export default function ResultCard({ label, value, type = "text", color }: { label: string; value: string | React.ReactNode; type?: "text" | "node"; color?: string }) {
  return (
    <div className="rounded-lg px-6 py-4 border border-ts-neutral-700 w-full grow lg:max-w-40">
      <h3 className="text-ts-neutral-400 text-xl">{label}:</h3>
      <h2 className={`text-2xl font-bold ${color ? color : 'text-ts-neutral-0'}`}>{(type === 'text' || type === 'node') && value}</h2>
    </div>
  );
}