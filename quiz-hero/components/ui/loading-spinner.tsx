"use client";

import { motion } from "framer-motion";

export function LoadingSpinner({ className }: { className?: string }) {
    return (
        <div className={`flex items-center justify-center gap-2 ${className}`}>
            {[0, 1, 2].map((index) => (
                <motion.div
                    key={index}
                    className="h-4 w-4 rounded-full bg-primary"
                    animate={{
                        y: [-10, 10],
                        opacity: [0.5, 1],
                        scale: [0.8, 1.2],
                    }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: index * 0.2,
                    }}
                />
            ))}
        </div>
    );
}
