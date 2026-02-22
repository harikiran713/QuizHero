"use client";

import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function GlobalLoader() {
    const isFetching = useIsFetching();
    const isMutating = useIsMutating();
    const [show, setShow] = useState(false);

    // Show if there is any fetching or mutating happening
    const active = isFetching > 0 || isMutating > 0;

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (active) {
            // Small delay to prevent flickering for near-instant requests
            timeout = setTimeout(() => setShow(true), 200);
        } else {
            setShow(false);
        }
        return () => clearTimeout(timeout);
    }, [active]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 z-[9999] origin-left"
                    style={{ boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)" }}
                >
                    <motion.div
                        animate={{
                            x: ["0%", "100%"],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute top-0 left-0 w-1/3 h-full bg-white/30 skew-x-[-20deg]"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
