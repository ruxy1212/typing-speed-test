export default function StatSection({ label, value }: { label: string; value: string }) {
    return (
        <h3 className="text-ts-neutral-400 text-xl flex flex-col justify-center items-center gap-1.5 sm:flex-row sm:gap-2 md:gap-3">
            {label}:
            <span className="text-ts-neutral-0 text-2xl font-bold">{value}</span>
        </h3>
    )
}