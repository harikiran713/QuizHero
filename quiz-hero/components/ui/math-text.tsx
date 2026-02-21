"use client";

import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

interface MathTextProps {
    text: string;
    className?: string;
}

/**
 * Renders text that may contain:
 *  - Fenced code blocks: ```lang\n...\n```
 *  - Inline code: `...`
 *  - Inline math: $...$
 *  - Bold: **...**
 *  - Italic: *...*
 */
export function MathText({ text, className }: MathTextProps) {
    const elements: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
        // 1. Fenced code block: ```...```
        const fencedMatch = remaining.match(/^([\s\S]*?)```(\w*)\n?([\s\S]*?)```/);
        if (fencedMatch) {
            const before = fencedMatch[1];
            const code = fencedMatch[3];
            if (before) elements.push(<MathText key={key++} text={before} />);
            elements.push(
                <pre
                    key={key++}
                    className="bg-gray-100 border border-gray-300 rounded-lg p-3 my-2 overflow-x-auto text-sm font-mono text-gray-800 whitespace-pre-wrap break-words"
                >
                    <code>{code.trim()}</code>
                </pre>
            );
            remaining = remaining.slice(fencedMatch[0].length);
            continue;
        }

        // 2. Inline code: `...`
        const inlineCodeMatch = remaining.match(/^([\s\S]*?)`([^`]+)`/);
        if (inlineCodeMatch) {
            const before = inlineCodeMatch[1];
            const code = inlineCodeMatch[2];
            if (before) elements.push(<MathText key={key++} text={before} />);
            elements.push(
                <code
                    key={key++}
                    className="bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 text-sm font-mono text-blue-700"
                >
                    {code}
                </code>
            );
            remaining = remaining.slice(inlineCodeMatch[0].length);
            continue;
        }

        // 3. Inline LaTeX: $...$
        const mathMatch = remaining.match(/^([\s\S]*?)\$([^$]+)\$/);
        if (mathMatch) {
            const before = mathMatch[1];
            const math = mathMatch[2];
            if (before) elements.push(<InlinePlain key={key++} text={before} />);
            elements.push(
                <InlineMath key={key++} math={math} />
            );
            remaining = remaining.slice(mathMatch[0].length);
            continue;
        }

        // 4. Bold: **...**
        const boldMatch = remaining.match(/^([\s\S]*?)\*\*([^*]+)\*\*/);
        if (boldMatch) {
            const before = boldMatch[1];
            const bold = boldMatch[2];
            if (before) elements.push(<MathText key={key++} text={before} />);
            elements.push(<strong key={key++}>{bold}</strong>);
            remaining = remaining.slice(boldMatch[0].length);
            continue;
        }

        // 5. Italic: *...*
        const italicMatch = remaining.match(/^([\s\S]*?)\*([^*]+)\*/);
        if (italicMatch) {
            const before = italicMatch[1];
            const italic = italicMatch[2];
            if (before) elements.push(<MathText key={key++} text={before} />);
            elements.push(<em key={key++}>{italic}</em>);
            remaining = remaining.slice(italicMatch[0].length);
            continue;
        }

        // No pattern matched — render rest as plain text
        elements.push(<span key={key++}>{remaining}</span>);
        break;
    }

    return <span className={className}>{elements}</span>;
}

/** Renders plain text only (no recursion needed for segments without markup) */
function InlinePlain({ text }: { text: string }) {
    return <span>{text}</span>;
}
