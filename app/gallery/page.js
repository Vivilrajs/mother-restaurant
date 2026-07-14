'use client';
import { useState, useEffect } from 'react';

const CATS = ['All','food','ambiance','events'];

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [cat, setCat] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => { fetch('/api/gallery').then(r=>r.json()).then(d=>setImages(Array.isArray(d)?d:[])); }, []);

  const filtered = cat === 'All' ? images : images.filter(i => i.category === cat);

  return (
    <>
      <div className="pt-20 min-h-[50vh] flex items-center" style={{background:'linear-gradient(135deg,#2d2422 0%,#4a3530 50%,#2d2422 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-4">Our <span style={{color:'#d98f7c'}}>Gallery</span></h1>
          <p className="text-white/80 text-xl">A visual feast for the eyes</p>
        </div>
      </div>
      <section className="py-16 section-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} className={`gallery-filter px-6 py-2 rounded-full border font-semibold text-sm transition ${cat===c?'active':'border-brand-600/30'}`}>
                {c.charAt(0).toUpperCase()+c.slice(1)}
              </button>
            ))}
          </div>
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map((img, i) => (
              <div key={i} className="gallery-item rounded-xl overflow-hidden break-inside-avoid cursor-pointer mb-4" onClick={() => setLightbox(img)}>
                <img src={img.url} alt={img.alt} className="w-full" />
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted">
              <i className="fas fa-images text-5xl mb-4 opacity-30"></i>
              <p>No images in this category yet.</p>
            </div>
          )}
        </div>
      </section>
      {lightbox && (
        <div className="lightbox active" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition">
            <i className="fas fa-times text-xl"></i>
          </button>
          <img src={lightbox.url} alt={lightbox.alt} className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl" />
        </div>
      )}
    </>
  );
}
