'use client';
import { useState } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { usePathname } from 'next/navigation';

const TITLES = {
  '/admin':'Dashboard','/admin/reservations':'Reservations','/admin/menu':'Menu Items',
  '/admin/chefs':'Chefs Team','/admin/gallery':'Gallery','/admin/blog':'Blog & News',
  '/admin/reviews':'Reviews','/admin/branches':'Branches','/admin/settings':'Settings',
};

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  if (pathname === '/admin/login') return children;
  const title = TITLES[pathname] || 'Admin';

  return (
    <div className="flex h-screen overflow-hidden bg-[#f9f3e8]">
      {/* Desktop sidebar */}
      <div className="hidden lg:block flex-shrink-0"><AdminSidebar /></div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)}></div>
          <div className="relative z-50"><AdminSidebar onClose={() => setMobileOpen(false)} /></div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-brand-600/10 flex items-center justify-between px-4 md:px-8 shadow-sm z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-500 hover:text-brand-600" onClick={() => setMobileOpen(true)}>
              <i className="fas fa-bars text-xl"></i>
            </button>
            <h1 className="font-serif text-xl md:text-2xl font-bold text-[#2d2422]">{title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input type="text" placeholder="Search..." className="form-input pl-9 py-2 text-sm w-48 lg:w-64 rounded-full bg-[#f9f3e8] border-none" />
            </div>
            <a href="/" target="_blank" rel="noopener noreferrer" className="hidden sm:flex text-sm font-semibold text-brand-600 hover:text-brand-800 items-center gap-1">
              View Site <i className="fas fa-external-link-alt text-xs"></i>
            </a>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
