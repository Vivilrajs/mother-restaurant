'use client';
import { useState, useEffect } from 'react';

export default function AdminReviews() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');

  // Add review modal state
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({ customerName: '', rating: 5, text: '', role: '', source: 'Google', status: 'approved' });

  async function loadItems() {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?status=${statusFilter}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, [statusFilter]);

  async function handleApprove(id) {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });
      if (res.ok) loadItems();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) loadItems();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setModal(false);
        setFormData({ customerName: '', rating: 5, text: '', role: '', source: 'Google', status: 'approved' });
        loadItems();
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${statusFilter === 'pending' ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-600'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${statusFilter === 'approved' ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-600'}`}
          >
            Approved
          </button>
        </div>
        <button onClick={() => setModal(true)} className="btn-premium px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2">
          <i className="fas fa-plus"></i> Add Review
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading reviews...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No {statusFilter} reviews found.</div>
      ) : (
        <div className="space-y-4">
          {items.map(review => (
            <div key={review._id} className="admin-glass p-6 flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-lg">
                    {review.customerName?.[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-heading">{review.customerName}</h4>
                    {review.role && <p className="text-xs text-gray-500">{review.role}</p>}
                  </div>
                </div>
                <div className="flex gap-1 text-brand-600 text-sm">
                  {[...Array(review.rating)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
                </div>
                <p className="text-muted text-sm leading-relaxed">{review.text}</p>
                <div className="text-[10px] text-gray-400 capitalize">Source: {review.source || 'Direct'}</div>
              </div>
              <div className="flex md:flex-col justify-end items-end gap-2 shrink-0">
                {review.status === 'pending' && (
                  <button onClick={() => handleApprove(review._id)} className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-bold transition flex items-center gap-1">
                    <i className="fas fa-check"></i> Approve
                  </button>
                )}
                <button onClick={() => handleDelete(review._id)} className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold transition flex items-center gap-1">
                  <i className="fas fa-trash-alt"></i> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Review Modal */}
      {modal && (
        <div className="admin-modal active">
          <div className="admin-modal-content relative max-w-md">
            <div className="sticky top-0 bg-white p-4 md:p-6 border-b border-brand-600/10 flex justify-between items-center z-10 rounded-t-2xl">
              <h2 className="font-serif text-xl font-bold text-brand-700">Add Review</h2>
              <button onClick={() => setModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition"><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 bg-[#fdfbf7]">
              <div>
                <label className="block text-sm font-bold mb-1">Customer Name</label>
                <input type="text" required value={formData.customerName} onChange={e => setFormData({ ...formData, customerName: e.target.value })} className="form-input bg-white" placeholder="Customer Name" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Customer Role / Title (Optional)</label>
                <input type="text" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="form-input bg-white" placeholder="e.g. Food Critic, Regular Guest" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Rating (1-5)</label>
                <input type="number" required min="1" max="5" value={formData.rating} onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })} className="form-input bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Source (e.g., Google, TripAdvisor)</label>
                <input type="text" value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })} className="form-input bg-white" placeholder="Google" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Review Text</label>
                <textarea required value={formData.text} onChange={e => setFormData({ ...formData, text: e.target.value })} className="form-input bg-white" rows="4" placeholder="Type review here..."></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-brand-600/10">
                <button type="button" onClick={() => setModal(false)} className="px-6 py-2.5 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</button>
                <button type="submit" className="btn-premium px-8 py-2.5 rounded-lg font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
