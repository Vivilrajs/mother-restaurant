'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Logo = () => (
  <img src="/logo.png" alt="The Mother Restaurant" className="h-24 md:h-32 lg:h-36 w-auto object-contain flex-shrink transition-all duration-300 my-[-20px] md:my-[-30px]" />
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState({});
  const pathname = usePathname();

  const toggleSection = (label) => {
    setExpanded(prev => ({ ...prev, [label]: !prev[label] }));
  };

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
      { href: '/private-dining', label: 'Private Dining' },
    ]},
    { href: '/gallery', label: 'Gallery' },
    { href: '/blog', label: 'Blog' },
    { href: '/testimonials', label: 'Reviews' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav id="navbar" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'scrolled bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            <Link href="/" className="flex-shrink min-w-0 flex items-center"><Logo /></Link>
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
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button onClick={toggleTheme} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-brand-600/30 flex items-center justify-center hover:bg-brand-600/10 transition bg-white/90 dark:bg-[#1a1412]/90 backdrop-blur shadow-sm" aria-label="Toggle theme">
                <i className={`fas ${dark ? 'fa-moon text-brand-400' : 'fa-sun text-brand-600'} text-xs sm:text-sm`}></i>
              </button>
              <Link href="/reservation" className="btn-premium px-6 py-2.5 rounded-full text-sm font-semibold hidden md:inline-flex items-center gap-2">
                <i className="fas fa-calendar-alt"></i> Reserve
              </Link>
              <button onClick={() => setMobileOpen(true)} className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-brand-600 rounded-full bg-white/90 dark:bg-[#1a1412]/90 backdrop-blur border border-brand-600/30 shadow-sm" aria-label="Open menu">
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
            <img src="/logo.png" alt="The Mother Restaurant" className="h-20 w-auto object-contain my-[-20px]" />
            <button onClick={() => setMobileOpen(false)} className="w-10 h-10 flex items-center justify-center text-white"><i className="fas fa-times text-2xl"></i></button>
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[70vh] pr-2">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="flex flex-col">
                  <button
                    onClick={() => toggleSection(link.label)}
                    className="text-2xl font-serif hover:text-brand-400 transition text-white text-left flex justify-between items-center w-full py-1 cursor-pointer"
                  >
                    <span>{link.label}</span>
                    <i className={`fas fa-chevron-${expanded[link.label] ? 'up' : 'down'} text-lg transition-transform`}></i>
                  </button>
                  <div className={`pl-4 flex flex-col gap-2 overflow-hidden transition-all duration-300 ${expanded[link.label] ? 'max-h-56 mt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                    {link.children.map(c => (
                      <Link
                        key={c.href}
                        href={c.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-lg font-sans hover:text-brand-400 transition text-gray-300 py-1"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-serif hover:text-brand-400 transition text-white py-1"
                >
                  {link.label}
                </Link>
              )
            )}
            <Link href="/reservation" onClick={() => setMobileOpen(false)} className="btn-premium px-6 py-3 rounded-full text-center font-semibold mt-4">Reserve a Table</Link>
          </div>
        </div>
      </div>
    </>
  );
}
