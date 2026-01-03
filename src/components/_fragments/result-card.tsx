export default function ResultCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg px-6 py-4 border border-ts-neutral-700 w-full grow lg:max-w-40">
            <h3 className="text-ts-neutral-400 text-xl">{label}:</h3>
            <h2 className="text-ts-neutral-0 text-2xl font-bold">{value}</h2>
        </div>
    );
}