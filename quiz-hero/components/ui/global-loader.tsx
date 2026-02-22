"use client";

import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "./loading-spinner";

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
            timeout = setTimeout(() => setShow(true), 150);
        } else {
            setShow(false);
        }
        return () => clearTimeout(timeout);
    }, [active]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px] z-[9999]"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 flex flex-col items-center gap-4"
                    >
                        <LoadingSpinner />
                        <p className="text-sm font-medium text-gray-500 animate-pulse">
                            Processing...
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
