'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Logo = () => (
  <div className="logo-container">
    <div><div className="logo-the">THE</div><div className="logo-m">m</div></div>
    <div className="logo-circle"><div className="logo-circle-text">LOVE IS<br/>HER SECRET<br/>INGREDIENT</div></div>
    <div><div className="logo-m">ther</div><div className="logo-restaurant">RESTAURANT</div></div>
  </div>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') { setDark(true); document.documentElement.classList.add('dark'); }
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { label: 'About', children: [
      { href: '/about', label: 'About Us' },
      { href: '/story', label: 'Our Story' },
      { href: '/chef', label: 'Our Chef' },
      { href: '/careers', label: 'Careers' },
    ]},
    { label: 'Menu', children: [
      { href: '/menu', label: 'All Menu' },
      { href: '/catering', label: 'Catering' },
    ]},
    { href: '/gallery', label: 'Gallery' },
    { href: '/blog', label: 'Blog' },
    { href: '/testimonials', label: 'Reviews' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav id="navbar" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-[#1a1412]/95 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/"><Logo /></Link>
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label} className="group relative">
                    <span className={`nav-link text-sm font-medium hover:text-brand-600 transition text-body cursor-pointer flex items-center gap-1 ${link.children.some(c => c.href === pathname) ? 'active' : ''}`}>
                      {link.label} <i className="fas fa-chevron-down text-xs"></i>
                    </span>
                    <div className="mega-menu absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white dark:bg-[#1f1816] border border-brand-600/20 rounded-lg p-3 shadow-xl">
                      {link.children.map(c => (
                        <Link key={c.href} href={c.href} className="block py-2 px-3 text-sm hover:text-brand-600 transition rounded hover:bg-brand-600/5 text-body">{c.label}</Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link key={link.href} href={link.href} className={`nav-link text-sm font-medium hover:text-brand-600 transition text-body ${pathname === link.href ? 'active' : ''}`}>{link.label}</Link>
                )
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={toggleTheme} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-brand-600/30 flex items-center justify-center hover:bg-brand-600/10 transition bg-white/90 dark:bg-[#1a1412]/90 backdrop-blur shadow-sm" aria-label="Toggle theme">
                <i className={`fas ${dark ? 'fa-moon text-brand-400' : 'fa-sun text-brand-600'} text-xs sm:text-sm`}></i>
              </button>
              <Link href="/admin" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-brand-600/30 flex items-center justify-center hover:bg-brand-600/10 transition bg-white/90 dark:bg-[#1a1412]/90 backdrop-blur shadow-sm" aria-label="Admin Panel" title="Admin Panel">
                <i className="fas fa-cog text-brand-600 dark:text-brand-400 text-xs sm:text-sm"></i>
              </Link>
              <Link href="/reservation" className="btn-premium px-6 py-2.5 rounded-full text-sm font-semibold hidden md:inline-flex items-center gap-2">
                <i className="fas fa-calendar-alt"></i> Reserve
              </Link>
              <button onClick={() => setMobileOpen(true)} className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-heading rounded-full bg-white/90 dark:bg-[#1a1412]/90 backdrop-blur border border-brand-600/30 shadow-sm">
                <i className="fas fa-bars text-lg sm:text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu lg:hidden ${mobileOpen ? 'active' : ''}`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex justify-between items-center mb-12">
            <div className="logo-container">
              <div><div className="logo-the" style={{color:'#f9f3e8'}}>THE</div><div className="logo-m" style={{color:'#d98f7c'}}>m</div></div>
              <div className="logo-circle"><div className="logo-circle-text">LOVE IS<br/>HER SECRET<br/>INGREDIENT</div></div>
              <div><div className="logo-m" style={{color:'#d98f7c'}}>ther</div><div className="logo-restaurant" style={{color:'#f9f3e8'}}>RESTAURANT</div></div>
            </div>
            <button onClick={() => setMobileOpen(false)} className="w-10 h-10 flex items-center justify-center text-white"><i className="fas fa-times text-2xl"></i></button>
          </div>
          <div className="flex flex-col gap-6">
            {[{href:'/',l:'Home'},{href:'/about',l:'About'},{href:'/story',l:'Our Story'},{href:'/menu',l:'Menu'},{href:'/chef',l:'Chef'},{href:'/gallery',l:'Gallery'},{href:'/blog',l:'Blog'},{href:'/testimonials',l:'Reviews'},{href:'/contact',l:'Contact'},{href:'/admin',l:'Admin Panel'}].map(({href,l}) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)} className="text-2xl font-serif hover:text-brand-400 transition text-white">{l}</Link>
            ))}
            <Link href="/reservation" onClick={() => setMobileOpen(false)} className="btn-premium px-6 py-3 rounded-full text-center font-semibold mt-4">Reserve a Table</Link>
          </div>
        </div>
      </div>
    </>
  );
}
