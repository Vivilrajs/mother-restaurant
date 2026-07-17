'use client';
import { useState, useEffect } from 'react';

export default function EventImageSlider() {
  const images = ['/party-1.jpg', '/party-2.jpg', '/party-3.jpg'];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-2xl overflow-hidden aspect-[4/5] relative bg-black w-full h-full shadow-lg">
      {images.map((img, idx) => {
        const isActive = idx === index;
        return (
          <div
            key={img}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 ease-in-out ${
              isActive ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
            style={{
              backgroundImage: `url('${img}')`,
              transition: isActive 
                ? 'opacity 1.5s ease-in-out, transform 3.5s ease-out' 
                : 'opacity 1.5s ease-in-out',
              zIndex: idx === index ? 1 : 0
            }}
          />
        );
      })}
    </div>
  );
}
