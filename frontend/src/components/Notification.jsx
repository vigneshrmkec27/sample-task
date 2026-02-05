import React from 'react';
import { motion } from 'framer-motion';

const Notification = ({ message, type = 'success', onClose }) => {
    const renderMessage = () => {
        if (message == null) {
            return '';
        }
        if (typeof message === 'string' || typeof message === 'number') {
            return message;
        }
        if (typeof message === 'object' && 'message' in message) {
            return message.message;
        }
        try {
            return JSON.stringify(message);
        } catch (error) {
            return 'An unexpected error occurred.';
        }
    };
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (onClose) onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            role="alert"
            aria-live="assertive"
            className={`
                fixed top-5 right-5 z-50
                max-w-sm
                px-5 py-4
                rounded-xl
                shadow-2xl
                border
                backdrop-blur-md
                ${
                type === 'error'
                    ? 'bg-red-500/90 border-red-400'
                    : 'bg-emerald-500/90 border-emerald-400'
            }
                text-white
            `}
            initial={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
            transition={{ duration: 0.3 }}
        >
            <p className="text-sm font-semibold leading-snug">
                {renderMessage()}
            </p>
        </motion.div>
    );
};

export default Notification;
