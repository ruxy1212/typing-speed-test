import { Fragment, useState } from "react";

type SubOption = {
  seconds: number;
  label: string;
  value?: string;
};

type ParentOption<T extends string> = {
  value: T;
  label: string;
  subOptions?: SubOption[];
};

type MobileSubOption<T extends string> = {
  parentValue: T;
  seconds: number;
  label: string;
};

type MobileOption<T extends string> = MobileSubOption<T> | { value: T; label: string };

interface ControlSectionProps<T extends string> {
  label: string;
  name: string;
  options: ParentOption<T>[];
  optionsMobile?: MobileOption<T>[];
  value: T;
  onChange: (value: T) => void;
  onSubOptionSelect?: (parentValue: T, seconds: number) => void;
  currentTimedDuration?: number;
  disabled?: boolean;
}

export default function ControlSection<T extends string>({
  label,
  name,
  options,
  optionsMobile,
  value,
  onChange,
  onSubOptionSelect,
  currentTimedDuration,
  disabled
}: ControlSectionProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubIndex, setOpenSubIndex] = useState<number | null>(null);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <>
      {/* Desktop View - Radio Button Group */}
      <div className="hidden md:flex gap-1.5 items-center text-ts-neutral-400">
        <span className="text-sm">{label}:</span>
        <div className="flex gap-2">
          {options.map((option, index) => (
            <div key={option.value} className="relative">
              <label
                className={`
                    px-3 py-1.5 rounded border
                    transition-colors text-sm font-medium flex items-center gap-2
                    ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                    ${value === option.value
                    ? 'border-ts-blue-400 text-ts-blue-400'
                    : `border-ts-neutral-500 text-ts-neutral-0 ${disabled ? '' : 'hover:border-ts-blue-400 hover:text-ts-blue-400'}`
                  }
                `}
              >
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => !disabled && onChange(e.target.value as T)}
                  className="sr-only"
                  disabled={disabled}
                />
                <span className="whitespace-nowrap">{option.label}</span>

                {/* If this option has subOptions, show a small chevron to open a popover */}
                {option.subOptions && (
                  <button
                    type="button"
                    onClick={(ev) => { ev.stopPropagation(); if (disabled) return; setOpenSubIndex(openSubIndex === index ? null : index); }}
                    className="text-ts-neutral-400 hover:text-ts-neutral-200"
                    aria-expanded={openSubIndex === index}
                  >
                    <svg className={`w-4 h-4 transition-transform ${openSubIndex === index ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </label>

              {/* Desktop suboptions popover */}
              {option.subOptions && openSubIndex === index && !disabled && (
                <div className="absolute top-full mt-2 right-0 z-20 w-40 bg-ts-neutral-800 border border-ts-neutral-500 rounded shadow-lg">
                  {option.subOptions.map((sub) => (
                    <button
                      key={sub.seconds ?? sub.label}
                      type="button"
                      onClick={() => {
                        onSubOptionSelect?.(option.value as T, sub.seconds ?? (sub.value ? Number(sub.value) : 0));
                        // ensure parent option is selected as mode
                        onChange(option.value as T);
                        setOpenSubIndex(null);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm ${currentTimedDuration === sub.seconds ? 'bg-ts-neutral-700 text-ts-blue-400' : 'hover:bg-ts-neutral-700'}`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View - Combobox/Dropdown */}
      <div className="md:hidden relative">
        <button
          type="button"
          onClick={() => { if (disabled) return; setIsOpen(!isOpen); }}
          disabled={disabled}
          className={`w-full px-3 py-2 bg-ts-neutral-800 border border-ts-neutral-500 rounded text-ts-neutral-0 text-left flex justify-between items-center ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
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

        {isOpen && !disabled && (
          <div className="absolute z-10 w-full mt-1 bg-ts-neutral-800 border border-ts-neutral-500 rounded shadow-lg">
            {(optionsMobile ?? options).map((option, index) => {
              const isMobileSub = 'parentValue' in option && 'seconds' in option;
              const key = isMobileSub ? `${option.parentValue}-${option.seconds}` : option.value;
              const inputValue = isMobileSub ? option.parentValue : option.value;
              return (
                <Fragment key={key}>
                  <label
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-ts-neutral-700 cursor-pointer text-ts-neutral-0"
                    onClick={() => {
                      if (disabled) return;
                      // If this is a mobile sub-option, it will have parentValue and seconds
                      if (isMobileSub) {
                        const mobileSub = option as MobileSubOption<T>;
                        onSubOptionSelect?.(mobileSub.parentValue as T, mobileSub.seconds);
                        // also make sure the parent mode is selected
                        onChange(mobileSub.parentValue as T);
                      } else {
                        onChange((option as { value: T }).value as T);
                      }
                      setIsOpen(false);
                    }}
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio"
                        name={`${name}-mobile`}
                        value={inputValue}
                        checked={
                          // checked if option is parent mode and matches value
                          isMobileSub ? (value === (option as MobileSubOption<T>).parentValue) : (value === (option as { value: T }).value)
                        }
                        onChange={() => { }}
                        className="appearance-none w-4 h-4 border-2 border-ts-neutral-400 rounded-full checked:border-ts-blue-400 checked:border-[6px]"
                        disabled={disabled}
                      />
                    </div>
                    <span className="text-sm">{option.label}</span>
                  </label>

                  {index < (optionsMobile ?? options).length - 1 && (
                    <div className="h-px bg-ts-neutral-700 mx-2" />
                  )}
                </Fragment>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}