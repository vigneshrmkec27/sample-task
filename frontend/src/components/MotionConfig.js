import { MotionConfig as FramerMotionConfig, useReducedMotion } from 'framer-motion';

export const motionTokens = {
    duration: {
        fast: 0.35,
        medium: 0.6,
        slow: 1,
    },
    ease: {
        smooth: [0.22, 1, 0.36, 1],
        soft: [0.16, 1, 0.3, 1],
    },
    spring: {
        soft: {
            type: 'spring',
            stiffness: 120,
            damping: 18,
            mass: 0.8,
        },
        medium: {
            type: 'spring',
            stiffness: 160,
            damping: 20,
            mass: 0.7,
        },
        snappy: {
            type: 'spring',
            stiffness: 240,
            damping: 20,
            mass: 0.6,
        },
    },
};

export const MotionConfig = ({ children }) => {
    const prefersReducedMotion = useReducedMotion();

    return (
        <FramerMotionConfig reducedMotion={prefersReducedMotion ? 'always' : 'never'}>
            {children}
        </FramerMotionConfig>
    );
};
