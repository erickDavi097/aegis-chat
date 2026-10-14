//src/components/ExpandableText.tsx
import React, { useState } from 'react';

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
}

export const ExpandableText: React.FC<ExpandableTextProps> = ({ text, maxLength = 280 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= maxLength) {
    return <p className="whitespace-pre-wrap break-words">{text}</p>;
  }

  return (
    <div>
      <p className="whitespace-pre-wrap break-words">
        {isExpanded ? text : `${text.slice(0, maxLength)}...`}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-1 text-xs font-semibold text-cyan-400 hover:underline focus:outline-none"
      >
        {isExpanded ? 'Mostrar menos' : 'Ler mais'}
      </button>
    </div>
  );
};