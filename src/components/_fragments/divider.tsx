export default function Divider({ className = '' }: { className?: string }) {
    return <div className={`border-l self-stretch border-ts-neutral-700 ${className}`} />;
}