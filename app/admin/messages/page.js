'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AdminMessages() {
  const searchParams = useSearchParams();
  const querySearch = searchParams ? (searchParams.get('search') || '') : '';
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState(querySearch);
  const [loading, setLoading] = useState(true);

  async function loadItems() {
    setLoading(true);
    try {
      const res = await fetch(`/api/contact?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setSearch(querySearch);
  }, [querySearch]);

  useEffect(() => {
    loadItems();
  }, [search]);

  async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      if (res.ok) loadItems();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-serif text-xl font-bold text-[#2d2422]">Customer Messages</h2>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading messages...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {search ? 'No matching messages found.' : 'No messages found from the contact form.'}
        </div>
      ) : (
        <div className="grid gap-6">
          {items.map(msg => (
            <div key={msg._id} className="admin-glass p-6 space-y-4">
              <div className="flex justify-between items-start gap-4 border-b border-brand-600/10 pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2d2422]">{msg.subject || 'No Subject'}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                    <span><i className="fas fa-user mr-1.5 text-brand-600"></i>{msg.name}</span>
                    <span><i className="fas fa-envelope mr-1.5 text-brand-600"></i><a href={"mailto:" + msg.email} className="hover:underline">{msg.email}</a></span>
                    {msg.phone && <span><i className="fas fa-phone mr-1.5 text-brand-600"></i><a href={"tel:" + msg.phone} className="hover:underline">{msg.phone}</a></span>}
                    <span><i className="far fa-calendar-alt mr-1.5 text-brand-600"></i>{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteItem(msg._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition shrink-0"
                  title="Delete/Resolve Message"
                >
                  <i className="fas fa-trash-alt text-sm"></i>
                </button>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed bg-[#f9f3e8]/30 p-4 rounded-lg border border-brand-600/5">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
