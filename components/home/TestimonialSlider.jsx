'use client';
import { useState, useEffect, useCallback } from 'react';

export default function TestimonialSlider({ reviews }) {
  const [idx, setIdx] = useState(0);
  const items = reviews.length ? reviews : [
    { customerName:'Sarah Mitchell', rating:5, text:'An extraordinary dining experience. The wagyu was perfection, the ambiance felt like home, and the service was impeccable.', role:'Food Critic, Khaleej Times' },
    { customerName:'James Chen', rating:5, text:"From the moment we walked in, we felt like family. The omakase experience was a journey through flavors I'll never forget.", role:'Business Executive, Dubai' },
  ];

  const go = useCallback((dir) => setIdx((i) => (i + dir + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => go(1), 5000);
    return () => clearInterval(timer);
  }, [go, items.length, idx]);

  const item = items[idx];

  return (
    <div className="relative max-w-4xl mx-auto">
      <button onClick={() => go(-1)} className="absolute top-1/2 -left-2 sm:-left-4 md:-left-12 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-[#1a1412] shadow-lg border border-brand-600/20 flex items-center justify-center text-brand-600 hover:bg-brand-600 hover:text-white transition z-10">
        <i className="fas fa-chevron-left text-sm"></i>
      </button>
      <button onClick={() => go(1)} className="absolute top-1/2 -right-2 sm:-right-4 md:-right-12 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-[#1a1412] shadow-lg border border-brand-600/20 flex items-center justify-center text-brand-600 hover:bg-brand-600 hover:text-white transition z-10">
        <i className="fas fa-chevron-right text-sm"></i>
      </button>
      <div key={idx} className="glass-card rounded-3xl p-8 md:p-12 text-center" style={{animation:'fadeIn .6s ease'}}>
        <i className="fas fa-quote-left text-brand-600 text-4xl mb-6"></i>
        <p className="font-display text-2xl md:text-3xl text-body mb-8 leading-relaxed">&ldquo;{item.text}&rdquo;</p>
        <div className="flex justify-center gap-1 mb-4">
          {[...Array(item.rating || 5)].map((_,i) => <i key={i} className="fas fa-star text-brand-600"></i>)}
        </div>
        <div className="flex items-center justify-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center font-serif font-bold text-white text-xl">
            {item.customerName?.[0]}
          </div>
          <div className="text-left">
            <div className="font-semibold text-heading">{item.customerName}</div>
            <div className="text-sm text-muted">{item.role}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-8">
        {items.map((_,i) => (
          <button key={i} onClick={() => setIdx(i)} className={`w-3 h-3 rounded-full transition ${i===idx?'bg-brand-600':'bg-brand-600/30'}`}></button>
        ))}
      </div>
    </div>
  );
}
