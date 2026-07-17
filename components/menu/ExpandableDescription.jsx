'use client';
import { useState } from 'react';

export default function ExpandableDescription({ text, className = "text-muted text-xs mb-3" }) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  // Truncation threshold (only show read more for descriptions longer than 2 lines, approx 150 chars)
  const isLong = text.length > 150;

  if (!isLong) {
    return <p className={className}>{text}</p>;
  }

  return (
    <div className={className} onClick={e => e.stopPropagation()}>
      <span className={expanded ? '' : 'line-clamp-2'}>
        {text}
      </span>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setExpanded(!expanded);
        }}
        className="text-brand-300 hover:text-brand-400 font-bold ml-1 hover:underline focus:outline-none inline-block"
      >
        {expanded ? 'Read Less' : 'Read More'}
      </button>
    </div>
  );
}
