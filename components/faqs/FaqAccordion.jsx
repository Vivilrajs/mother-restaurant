'use client';
import { useState } from 'react';

export default function FaqAccordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="glass-card rounded-2xl overflow-hidden">
          <button
            className="faq-toggle w-full p-6 text-left flex justify-between items-center text-heading"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="font-semibold">{item.q}</span>
            <i className={`fas fa-chevron-down transition-transform text-brand-600 ${open === i ? 'rotate-180' : ''}`}></i>
          </button>
          {open === i && (
            <div className="px-6 pb-6 text-muted whitespace-pre-line">{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}
