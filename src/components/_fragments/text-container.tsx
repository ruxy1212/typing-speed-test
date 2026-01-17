'use client';

import { ClipboardEvent, DragEvent, FormEvent, KeyboardEvent, useEffect, useRef } from 'react';
import { useTypingTestContext } from '@/context/TypingTestContext';

export default function TextContainer() {
  const {
    passage,
    testState,
    startTest,
    handleKeyPress,
    getCharacterStatus,
  } = useTypingTestContext();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isTyping = testState === 'running';
  const isIdle = testState === 'idle';
  const isAllowedChar = (ch: string) => /^[\x20-\x7E]$/.test(ch);
  const isComposingRef = useRef(false);

  const handleCompositionStart = () => { isComposingRef.current = true; };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false;
    const committed = e.data || '';
    if (committed.length === 1 && isAllowedChar(committed)) {
      handleKeyPress(committed);
    }
  };

  // Focus the input when test starts or on mount so keyboard target is the input
  useEffect(() => {
    if (inputRef.current && (isTyping || isIdle)) {
      try { inputRef.current.focus(); } catch { /* ignore */ }
    }
  }, [isTyping, isIdle]);

  // Handle keyboard input
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLDivElement>) => {
    if (e.key === 'Unidentified') return;

    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) return;
    if (e.key === 'Backspace' || e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
      e.preventDefault();
      handleKeyPress(e.key);
      return;
    }

    if (e.key && e.key.length === 1 && isAllowedChar(e.key)) {
      e.preventDefault();
      handleKeyPress(e.key);
    } else {
      e.preventDefault();
    }
  };

  const handleInput = (e: FormEvent<HTMLInputElement>) => {
    if (isComposingRef.current) return;
    const el = e.currentTarget as HTMLInputElement;
    const val = el.value;
    if (!val) return;

    for (const ch of val) {
      if (isAllowedChar(ch)) handleKeyPress(ch);
    }

    el.value = '';
  };

  const handleContainerClick = () => {
    if (inputRef.current) {
      startTest();
      try { inputRef.current.focus(); } catch { /* ignore */ }
    } else if (containerRef.current) {
      startTest();
      try { containerRef.current.focus(); } catch { /* ignore */ }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    // Show UI that paste is disallowed
  };

  const handleDrop = (e: DragEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  // Render characters with appropriate styling
  const renderCharacters = () => {
    return passage.text.split('').map((char, index) => {
      const status = getCharacterStatus(index);

      let className = '';
      switch (status) {
        case 'correct':
          className = 'text-ts-green-500';
          break;
        case 'incorrect':
          className = 'text-ts-red-500 underline decoration-ts-red-500';
          break;
        case 'current':
          className = 'bg-ts-blue-600/30 text-ts-neutral-0';
          break;
        case 'upcoming':
        default:
          className = 'text-ts-neutral-400';
          break;
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onClick={handleContainerClick}
      onKeyDown={handleKeyDown}
      className="relative text-ts-neutral-400 pt-8 pb-4 border-b border-ts-neutral-700 outline-none cursor-text"
    >
      <input
        ref={inputRef}
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-label="Typing input"
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onClick={() => { startTest(); try { inputRef.current?.focus(); } catch { } }}
        className="absolute inset-0 w-full h-full opacity-0"
      />
      <div className={`leading-normal text-3xl min-h-[50vh] md:text-4xl ${isIdle ? 'blur-lg' : ''}`}>
        {isIdle ? passage.text : renderCharacters()}
      </div>
      {isIdle && (
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-[clamp(20vh,50%,30vh)]">
          <div className="flex flex-col justify-center items-center gap-4 whitespace-nowrap md:gap-5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                startTest();
                if (inputRef.current) {
                  inputRef.current.focus();
                } else if (containerRef.current) {
                  containerRef.current.focus();
                }
              }}
              className="text-center bg-ts-blue-600 text-ts-neutral-0 text-xl rounded-lg cursor-pointer px-4 py-2 md:px-6 md:py-4 transition-colors hover:bg-ts-blue-400"
            >
              Start Typing Test
            </button>
            <span className="text-center text-ts-neutral-0 text-xl">Or click the text and start typing</span>
          </div>
        </div>
      )}
    </div>
  );
}