'use client';

import { KeyboardEvent, useEffect, useRef } from 'react';
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
    
    // Focus the container when test starts or on mount
    useEffect(() => {
        if (containerRef.current && (isTyping || isIdle)) {
            containerRef.current.focus();
        }
    }, [isTyping, isIdle]);
    
    // Handle keyboard input
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        // Prevent default for most keys to avoid scrolling, etc.
        if (e.key !== 'Tab' && e.key !== 'Escape') {
            e.preventDefault();
        } alert('pressed');
        
        // Ignore modifier keys alone
        if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) {
            return;
        }
        
        handleKeyPress(e.key);
    };
    
    // Handle container click
    const handleContainerClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        } else if (containerRef.current) {
            containerRef.current.focus();
        }
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
            className="relative text-ts-neutral-400 pb-4 border-b border-ts-neutral-700 outline-none cursor-text"
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
                className="absolute opacity-0 pointer-events-none"
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