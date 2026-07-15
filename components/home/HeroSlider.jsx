'use client';
import { useState, useEffect, useRef } from 'react';

function VideoSlide({ url, isActive, onEnded }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    if (isActive) {
      ref.current.currentTime = 0;
      ref.current.play().catch((e) => console.log('Video playback error:', e));
    } else {
      ref.current.pause();
    }
  }, [isActive]);

  return (
    <video
      ref={ref}
      muted
      playsInline
      onEnded={onEnded}
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0'}`}
      style={{ zIndex: isActive ? 1 : 0 }}
    >
      <source src={url} type="video/mp4" />
    </video>
  );
}

export default function HeroSlider({ slides }) {
  const [index, setIndex] = useState(0);

  const activeSlide = slides && slides.length > 0 ? slides[index] : null;

  useEffect(() => {
    if (!slides || slides.length <= 1) return;

    let timer;

    if (activeSlide?.type === 'image') {
      // Image stays for exactly 4 seconds
      timer = setTimeout(() => {
        setIndex((prev) => (prev + 1) % slides.length);
      }, 4000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [index, slides, activeSlide]);

  const handleVideoEnded = () => {
    if (slides && slides.length > 1) {
      setIndex((prev) => (prev + 1) % slides.length);
    }
  };

  // If no slides are configured, render default fallback video
  if (!slides || slides.length === 0) {
    return (
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-black">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
          <source src="https://videos.pexels.com/video-files/3205827/3205827-hd_1280_720_25fps.mp4" type="video/mp4" />
        </video>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-black">
      {slides.map((slide, i) => {
        const isActive = i === index;
        if (slide.type === 'video') {
          return (
            <VideoSlide
              key={slide.url + '-' + i}
              url={slide.url}
              isActive={isActive}
              onEnded={handleVideoEnded}
            />
          );
        } else {
          return (
            <div
              key={slide.url + '-' + i}
              className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 ease-in-out ${isActive ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
              style={{
                backgroundImage: `url('${slide.url}')`,
                transition: isActive 
                  ? 'opacity 1.5s ease-in-out, transform 4s ease-out' 
                  : 'opacity 1.5s ease-in-out',
                zIndex: isActive ? 1 : 0
              }}
            />
          );
        }
      })}
    </div>
  );
}
