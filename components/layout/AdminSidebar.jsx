'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const NAV = [
  { label:'Dashboard', href:'/admin', icon:'fa-chart-line', group:'Main Menu' },
  { label:'Reservations', href:'/admin/reservations', icon:'fa-calendar-alt', group:'Main Menu' },
  { label:'Menu Items', href:'/admin/menu', icon:'fa-utensils', group:'Main Menu' },
  { label:'Chefs Team', href:'/admin/chefs', icon:'fa-user-tie', group:'Main Menu' },
  { label:'Gallery', href:'/admin/gallery', icon:'fa-images', group:'Content' },
  { label:'Blog & News', href:'/admin/blog', icon:'fa-pen-nib', group:'Content' },
  { label:'Reviews & Testimonials', href:'/admin/reviews', icon:'fa-star', group:'Content' },
  { label:'Messages', href:'/admin/messages', icon:'fa-envelope', group:'Content' },
  { label:'Awards & Certifications', href:'/admin/awards', icon:'fa-award', group:'Content' },
  { label:'FAQs', href:'/admin/faqs', icon:'fa-question-circle', group:'Content' },
  { label:'Hero Banner', href:'/admin/banner', icon:'fa-tv', group:'Content' },
  { label:'Branches', href:'/admin/branches', icon:'fa-map-marker-alt', group:'System' },
  { label:'Settings', href:'/admin/settings', icon:'fa-cog', group:'System' }
];

export default function AdminSidebar({ onClose }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth', { method:'DELETE' });
    router.push('/admin/login');
  };

  const groups = ['Main Menu','Content','System'];

  return (
    <aside className="w-64 bg-white border-r border-brand-600/10 flex flex-col shadow-sm h-full">
      <div className="h-20 flex items-center justify-between border-b border-brand-600/10 px-4 overflow-hidden">
        <div className="flex items-center gap-2 my-[-20px] h-20">
          <img src="/logo.png" alt="The Mother Restaurant" className="h-24 w-auto object-contain" />
          <span className="font-serif text-xs font-bold text-brand-700 tracking-wider flex-shrink-0">ADMIN</span>
        </div>
        {onClose && <button onClick={onClose} className="text-gray-500 hover:text-red-500"><i className="fas fa-times"></i></button>}
      </div>
      <div className="flex-1 overflow-y-auto py-6 px-4">
        {groups.map(g => (
          <div key={g} className="mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 pl-3">{g}</p>
            {NAV.filter(n => n.group === g).map(item => (
              <Link key={item.href} href={item.href} onClick={onClose}
                className={`nav-item ${pathname === item.href ? 'active' : ''}`}>
                <i className={`fas ${item.icon} w-5`}></i> {item.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-brand-600/10">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-lg">A</div>
          <div><p className="text-sm font-bold text-[#2d2422]">Admin User</p><p className="text-xs text-gray-500">Super Administrator</p></div>
        </div>
        <button onClick={logout} className="w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition flex items-center justify-center gap-2 font-medium">
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </aside>
  );
}
