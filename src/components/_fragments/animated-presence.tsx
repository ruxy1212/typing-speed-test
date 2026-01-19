'use client';

import { motion, AnimatePresence } from "motion/react";
import { ReactNode } from "react";

// Shared animation variants for fade + scale transitions
export const fadeScaleVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

interface FadeScaleProps {
  children: ReactNode;
  className?: string;
}

// Wrapper component for fade + scale animations
export function FadeScale({ children, className }: FadeScaleProps) {
  return (
    <motion.div
      variants={fadeScaleVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedSwitchProps {
  children: ReactNode;
  keyProp: string;
  className?: string;
}

// AnimatePresence wrapper for switching between components
export function AnimatedSwitch({ children, keyProp, className }: AnimatedSwitchProps) {
  return (
    <AnimatePresence mode="wait">
      <FadeScale key={keyProp} className={className}>
        {children}
      </FadeScale>
    </AnimatePresence>
  );
}

interface AutoHeightProps {
  children: ReactNode;
  className?: string;
}

// Auto-animate height wrapper for smooth height transitions
export function AutoHeight({ children, className }: AutoHeightProps) {
  return (
    <motion.div
      layout
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
