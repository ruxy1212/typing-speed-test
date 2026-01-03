import { useState } from "react";

interface ControlSectionProps<T extends string> {
    label: string;
    name: string;
    options: { value: T; label: string }[];
    value: T;
    onChange: (value: T) => void;
}

export default function ControlSection<T extends string>({ 
    label, 
    name, 
    options, 
    value, 
    onChange 
}: ControlSectionProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(opt => opt.value === value);

    return (
        <>
            {/* Desktop View - Radio Button Group */}
            <div className="hidden md:flex gap-1.5 items-center text-ts-neutral-400">
                <span className="text-sm">{label}:</span>
                <div className="flex gap-2">
                    {options.map((option) => (
                        <label
                            key={option.value}
                            className={`
                                px-3 py-1.5 rounded border cursor-pointer
                                transition-colors text-sm font-medium
                                ${value === option.value
                                    ? 'border-ts-blue-400 text-ts-blue-400'
                                    : 'border-ts-neutral-500 text-ts-neutral-0 hover:border-ts-neutral-400'
                                }
                            `}
                        >
                            <input
                                type="radio"
                                name={name}
                                value={option.value}
                                checked={value === option.value}
                                onChange={(e) => onChange(e.target.value as T)}
                                className="sr-only"
                            />
                            {option.label}
                        </label>
                    ))}
                </div>
            </div>

            {/* Mobile View - Combobox/Dropdown */}
            <div className="md:hidden relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-3 py-2 bg-ts-neutral-800 border border-ts-neutral-500 rounded text-ts-neutral-0 text-left flex justify-between items-center"
                >
                    <span>{selectedOption?.label}</span>
                    <svg 
                        className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                
                {isOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-ts-neutral-800 border border-ts-neutral-500 rounded shadow-lg">
                        {options.map((option) => (
                            <label
                                key={option.value}
                                className="flex items-center gap-3 px-3 py-2.5 hover:bg-ts-neutral-700 cursor-pointer text-ts-neutral-0"
                                onClick={() => {
                                    onChange(option.value as T);
                                    setIsOpen(false);
                                }}
                            >
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="radio"
                                        name={`${name}-mobile`}
                                        value={option.value}
                                        checked={value === option.value}
                                        onChange={() => {}}
                                        className="appearance-none w-4 h-4 border-2 border-ts-neutral-400 rounded-full checked:border-ts-blue-400 checked:border-[6px]"
                                    />
                                </div>
                                <span className="text-sm">{option.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}