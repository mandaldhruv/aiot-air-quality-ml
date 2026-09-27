import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'python',
  title,
  showLineNumbers = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  const lines = code.trim().split('\n');

  // Simple token highlighter for python code
  const highlightLine = (line: string) => {
    if (line.trim().startsWith('#')) {
      return <span className="text-[#88998C] italic">{line}</span>;
    }
    if (line.trim().startsWith('!')) {
      return <span className="text-[#E09F3E]">{line}</span>;
    }

    // Replace keywords and strings for clean readable syntax coloring
    const parts = line.split(/(["'].*?["']|\bimport\b|\bfrom\b|\bdef\b|\breturn\b|\bif\b|\belse\b|\bfor\b|\bin\b|\bas\b|\bclass\b|\bprint\b|\bTrue\b|\bFalse\b|\bNone\b)/g);

    return parts.map((part, i) => {
      if (!part) return null;
      if (part.startsWith('"') || part.startsWith("'")) {
        return (
          <span key={i} className="text-[#A3E6B2]">
            {part}
          </span>
        );
      }
      if (
        ['import', 'from', 'def', 'return', 'if', 'else', 'for', 'in', 'as', 'class'].includes(
          part
        )
      ) {
        return (
          <span key={i} className="text-[#93C5FD] font-semibold">
            {part}
          </span>
        );
      }
      if (['print', 'len', 'range', 'list', 'str'].includes(part)) {
        return (
          <span key={i} className="text-[#FBCFE8]">
            {part}
          </span>
        );
      }
      if (['True', 'False', 'None'].includes(part)) {
        return (
          <span key={i} className="text-[#FDE68A] font-semibold">
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="rounded-xl overflow-hidden bg-[#151C17] border border-[#27352B] shadow-md my-3 font-mono text-xs">
      {/* Code Header */}
      <div className="bg-[#1C2620] px-4 py-2.5 flex items-center justify-between border-b border-[#27352B]">
        <div className="flex items-center gap-2 text-[#9DAAA0]">
          <Terminal className="w-3.5 h-3.5 text-[#5F7F6C]" />
          <span className="font-sans text-[11px] font-semibold text-[#D8D2C6]">
            {title || `${language.toUpperCase()} Script`}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-sans font-medium text-[#D8D2C6] bg-[#26352C] hover:bg-[#32453A] rounded transition-colors"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[#A3E6B2]" />
              <span className="text-[#A3E6B2]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-[#9DAAA0]" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-x-auto text-[#E7EFEA] leading-relaxed select-text">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-[#1D2821]/50">
                {showLineNumbers && (
                  <td className="w-10 pr-4 select-none text-[#526458] text-right font-mono text-[11px]">
                    {idx + 1}
                  </td>
                )}
                <td className="whitespace-pre font-mono text-[11.5px] pl-2">{highlightLine(line)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
