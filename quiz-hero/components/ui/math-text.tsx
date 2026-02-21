"use client";

import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

interface MathTextProps {
    text: string;
    className?: string;
}

/**
 * Renders a string that may contain inline LaTeX delimited by $...$.
 * Plain text segments are rendered as-is; $...$ segments are rendered via KaTeX.
 */
export function MathText({ text, className }: MathTextProps) {
    // Split on $...$ — capture group keeps the math content
    const parts = text.split(/\$([^$]+)\$/g);

    return (
        <span className={className}>
            {parts.map((part, i) =>
                i % 2 === 1 ? (
                    // Odd indices are inside $...$
                    <InlineMath key={i} math={part} />
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </span>
    );
}
