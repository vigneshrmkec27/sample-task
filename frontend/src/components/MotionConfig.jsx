import React from 'react';
import { MotionConfig, useReducedMotion } from 'framer-motion';

export const MOTION_TOKENS = {
    ease: [0.22, 1, 0.36, 1],
    easeSoft: [0.33, 1, 0.68, 1],
    spring: {
        type: 'spring',
        stiffness: 140,
        damping: 22,
        mass: 0.9,
    },
    springGentle: {
        type: 'spring',
        stiffness: 110,
        damping: 18,
        mass: 0.8,
    },
    duration: {
        fast: 0.35,
        medium: 0.6,
        slow: 0.9,
    },
};

export const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: {
        opacity: 1,
        y: 0,
        transition: MOTION_TOKENS.springGentle,
    },
};

export const stagger = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
        },
    },
};

export function MotionConfigProvider({ children }) {
    const reduceMotion = useReducedMotion();

    return (
        <MotionConfig
            reducedMotion="user"
            transition={
                reduceMotion
                    ? { duration: 0 }
                    : {
                          duration: MOTION_TOKENS.duration.medium,
                          ease: MOTION_TOKENS.ease,
                      }
            }
        >
            {children}
        </MotionConfig>
    );
}
