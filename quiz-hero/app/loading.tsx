"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Loading() {
    return (
        <div className="flex min-h-[60vh] w-full items-center justify-center">
            <LoadingSpinner />
        </div>
    );
}
