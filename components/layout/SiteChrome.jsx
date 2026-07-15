'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    if (isAdmin) return;
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => setSettings(d))
      .catch(e => console.error(e));
  }, [isAdmin]);

  if (isAdmin) {
    return children;
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer settings={settings} />
      <a href="https://wa.me/97144000000" className="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <i className="fab fa-whatsapp text-white text-2xl"></i>
      </a>
      <div id="toast" className="fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full text-sm font-semibold z-[300] opacity-0 transition-opacity duration-300 pointer-events-none shadow-xl"></div>
    </>
  );
}
