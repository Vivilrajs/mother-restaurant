'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ menu: 0, chefs: 0, reviews: 0, blog: 0 });
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [mRes, cRes, rRes, bRes, allReviewsRes] = await Promise.all([
          fetch('/api/menu'),
          fetch('/api/chefs'),
          fetch('/api/reviews?status=pending'),
          fetch('/api/blog'),
          fetch('/api/reviews')
        ]);
        const mData = await mRes.json();
        const cData = await cRes.json();
        const rData = await rRes.json();
        const bData = await bRes.json();
        const allReviews = await allReviewsRes.json();
        setStats({
          menu: Array.isArray(mData) ? mData.length : 0,
          chefs: Array.isArray(cData) ? cData.length : 0,
          reviews: Array.isArray(rData) ? rData.length : 0,
          blog: Array.isArray(bData) ? bData.length : 0
        });

        const latestOf = (arr) => {
          if (!Array.isArray(arr) || arr.length === 0) return null;
          return [...arr].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))[0];
        };
        const latestMenu = latestOf(mData);
        const latestBlog = latestOf(bData);
        const latestReview = latestOf(allReviews);

        const entries = [];
        if (latestMenu) entries.push({
          key: 'menu', icon: 'fa-utensils', bg: 'bg-green-100', color: 'text-green-600',
          title: latestMenu.updatedAt && latestMenu.updatedAt !== latestMenu.createdAt ? 'Menu Item Updated' : 'New Menu Item Added',
          desc: `"${latestMenu.name}" — ${latestMenu.category}`,
          time: latestMenu.updatedAt || latestMenu.createdAt
        });
        if (latestBlog) entries.push({
          key: 'blog', icon: 'fa-pen', bg: 'bg-blue-100', color: 'text-blue-600',
          title: latestBlog.updatedAt && latestBlog.updatedAt !== latestBlog.createdAt ? 'Blog Post Updated' : 'New Blog Post',
          desc: `"${latestBlog.title}" by ${latestBlog.author}`,
          time: latestBlog.updatedAt || latestBlog.createdAt
        });
        if (latestReview) entries.push({
          key: 'review', icon: 'fa-star', bg: 'bg-yellow-100', color: 'text-yellow-600',
          title: latestReview.status === 'pending' ? 'New Review Submitted' : 'Review Approved',
          desc: `${latestReview.rating}-star review from ${latestReview.customerName}`,
          time: latestReview.createdAt
        });
        entries.sort((a, b) => new Date(b.time) - new Date(a.time));
        setActivity(entries);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/admin/menu" className="admin-glass p-6 flex items-center justify-between hover:-translate-y-1 hover:border-brand-600/30 transition-all duration-300 cursor-pointer block">
          <div>
            <p className="text-sm text-gray-500 font-semibold mb-1">Total Menu Items</p>
            <h3 className="font-serif text-3xl font-bold text-[#2d2422]">{loading ? '...' : stats.menu}</h3>
            <p className="text-xs text-green-600 mt-2"><i className="fas fa-arrow-up"></i> Live on site</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-brand-600/10 flex items-center justify-center text-brand-600 text-xl"><i className="fas fa-utensils"></i></div>
        </Link>

        <Link href="/admin/chefs" className="admin-glass p-6 flex items-center justify-between hover:-translate-y-1 hover:border-brand-600/30 transition-all duration-300 cursor-pointer block">
          <div>
            <p className="text-sm text-gray-500 font-semibold mb-1">Active Chefs</p>
            <h3 className="font-serif text-3xl font-bold text-[#2d2422]">{loading ? '...' : stats.chefs}</h3>
            <p className="text-xs text-gray-500 mt-2">Fully staffed</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-brand-600/10 flex items-center justify-center text-brand-600 text-xl"><i className="fas fa-user-tie"></i></div>
        </Link>

        <Link href="/admin/reviews" className="admin-glass p-6 flex items-center justify-between hover:-translate-y-1 hover:border-brand-600/30 transition-all duration-300 cursor-pointer block">
          <div>
            <p className="text-sm text-gray-500 font-semibold mb-1">Pending Reviews</p>
            <h3 className="font-serif text-3xl font-bold text-[#2d2422]">{loading ? '...' : stats.reviews}</h3>
            <p className="text-xs text-yellow-600 mt-2"><i className="fas fa-clock"></i> Requires approval</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-brand-600/10 flex items-center justify-center text-brand-600 text-xl"><i className="fas fa-star"></i></div>
        </Link>

        <Link href="/admin/blog" className="admin-glass p-6 flex items-center justify-between hover:-translate-y-1 hover:border-brand-600/30 transition-all duration-300 cursor-pointer block">
          <div>
            <p className="text-sm text-gray-500 font-semibold mb-1">Blog Articles</p>
            <h3 className="font-serif text-3xl font-bold text-[#2d2422]">{loading ? '...' : stats.blog}</h3>
            <p className="text-xs text-green-600 mt-2"><i className="fas fa-arrow-up"></i> Published & Drafts</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-brand-600/10 flex items-center justify-center text-brand-600 text-xl"><i className="fas fa-pen-nib"></i></div>
        </Link>
      </div>

      {/* Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 admin-glass p-6">
          <h3 className="font-serif text-xl font-bold mb-4 text-[#2d2422]">Recent Activity</h3>
          <div className="space-y-4">
            {loading ? (
              <p className="text-sm text-gray-500">Loading activity...</p>
            ) : activity.length === 0 ? (
              <p className="text-sm text-gray-500">No activity yet.</p>
            ) : activity.map((a, i) => (
              <div key={a.key} className={`flex items-start gap-4 pb-4 ${i < activity.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className={`w-10 h-10 rounded-full ${a.bg} flex items-center justify-center ${a.color}`}><i className={`fas ${a.icon}`}></i></div>
                <div>
                  <p className="font-semibold text-sm">{a.title}</p>
                  <p className="text-xs text-gray-500">{a.desc}</p>
                </div>
                <span className="ml-auto text-xs text-gray-400 whitespace-nowrap">{timeAgo(a.time)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-glass p-6">
          <h3 className="font-serif text-xl font-bold mb-4 text-[#2d2422]">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/admin/menu" className="w-full py-3 px-4 border border-brand-600/30 rounded-lg text-brand-700 hover:bg-brand-600 hover:text-white transition flex items-center gap-3 font-medium">
              <i className="fas fa-plus-circle"></i> Manage Menu Items
            </Link>
            <Link href="/admin/blog" className="w-full py-3 px-4 border border-brand-600/30 rounded-lg text-brand-700 hover:bg-brand-600 hover:text-white transition flex items-center gap-3 font-medium">
              <i className="fas fa-edit"></i> Write Blog Post
            </Link>
            <Link href="/admin/reviews" className="w-full py-3 px-4 border border-brand-600/30 rounded-lg text-brand-700 hover:bg-brand-600 hover:text-white transition flex items-center gap-3 font-medium">
              <i className="fas fa-check-circle"></i> Moderate Reviews
            </Link>
            <button onClick={async () => {
              if (confirm('Are you sure you want to seed default data? This will overwrite existing records.')) {
                const res = await fetch('/api/seed');
                if (res.ok) alert('Successfully seeded default data!');
                else alert('Failed to seed default data.');
                window.location.reload();
              }
            }} className="w-full py-3 px-4 border border-red-600/30 rounded-lg text-red-700 hover:bg-red-600 hover:text-white transition flex items-center gap-3 font-medium">
              <i className="fas fa-database"></i> Seed Default Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
