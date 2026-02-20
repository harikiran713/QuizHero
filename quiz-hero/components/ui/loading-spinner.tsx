"use client";

import { motion } from "framer-motion";

export function LoadingSpinner({ className }: { className?: string }) {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className="relative flex items-center justify-center">
                {/* Outer pulsing ring */}
                <motion.div
                    className="absolute h-20 w-20 rounded-full border-4 border-primary/20"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Main spinning ring */}
                <motion.div
                    className="h-14 w-14 rounded-full border-4 border-primary/30 border-t-primary"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner pulsing dot */}
                <motion.div
                    className="absolute h-3 w-3 rounded-full bg-primary"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>
        </div>
    );
}
