'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ menu: 0, chefs: 0, reviews: 0, blog: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [mRes, cRes, rRes, bRes] = await Promise.all([
          fetch('/api/menu'),
          fetch('/api/chefs'),
          fetch('/api/reviews?status=pending'),
          fetch('/api/blog')
        ]);
        const mData = await mRes.json();
        const cData = await cRes.json();
        const rData = await rRes.json();
        const bData = await bRes.json();
        setStats({
          menu: Array.isArray(mData) ? mData.length : 0,
          chefs: Array.isArray(cData) ? cData.length : 0,
          reviews: Array.isArray(rData) ? rData.length : 0,
          blog: Array.isArray(bData) ? bData.length : 0
        });
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
        <div className="admin-glass p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-semibold mb-1">Total Menu Items</p>
            <h3 className="font-serif text-3xl font-bold text-[#2d2422]">{loading ? '...' : stats.menu}</h3>
            <p className="text-xs text-green-600 mt-2"><i className="fas fa-arrow-up"></i> Live on site</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-brand-600/10 flex items-center justify-center text-brand-600 text-xl"><i className="fas fa-utensils"></i></div>
        </div>

        <div className="admin-glass p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-semibold mb-1">Active Chefs</p>
            <h3 className="font-serif text-3xl font-bold text-[#2d2422]">{loading ? '...' : stats.chefs}</h3>
            <p className="text-xs text-gray-500 mt-2">Fully staffed</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-brand-600/10 flex items-center justify-center text-brand-600 text-xl"><i className="fas fa-user-tie"></i></div>
        </div>

        <div className="admin-glass p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-semibold mb-1">Pending Reviews</p>
            <h3 className="font-serif text-3xl font-bold text-[#2d2422]">{loading ? '...' : stats.reviews}</h3>
            <p className="text-xs text-yellow-600 mt-2"><i className="fas fa-clock"></i> Requires approval</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-brand-600/10 flex items-center justify-center text-brand-600 text-xl"><i className="fas fa-star"></i></div>
        </div>

        <div className="admin-glass p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-semibold mb-1">Blog Articles</p>
            <h3 className="font-serif text-3xl font-bold text-[#2d2422]">{loading ? '...' : stats.blog}</h3>
            <p className="text-xs text-green-600 mt-2"><i className="fas fa-arrow-up"></i> Published & Drafts</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-brand-600/10 flex items-center justify-center text-brand-600 text-xl"><i className="fas fa-pen-nib"></i></div>
        </div>
      </div>

      {/* Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 admin-glass p-6">
          <h3 className="font-serif text-xl font-bold mb-4 text-[#2d2422]">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><i className="fas fa-pen"></i></div>
              <div>
                <p className="font-semibold text-sm">Blog Post Updated</p>
                <p className="text-xs text-gray-500">&ldquo;The Art of Wagyu&rdquo; was modified by Admin</p>
              </div>
              <span className="ml-auto text-xs text-gray-400">2 hours ago</span>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600"><i className="fas fa-utensils"></i></div>
              <div>
                <p className="font-semibold text-sm">New Menu Item Added</p>
                <p className="text-xs text-gray-500">&ldquo;Truffle Risotto&rdquo; added to Dinner category</p>
              </div>
              <span className="ml-auto text-xs text-gray-400">5 hours ago</span>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600"><i className="fas fa-star"></i></div>
              <div>
                <p className="font-semibold text-sm">New Review Submitted</p>
                <p className="text-xs text-gray-500">5-star review from Sarah M. pending approval</p>
              </div>
              <span className="ml-auto text-xs text-gray-400">1 day ago</span>
            </div>
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
