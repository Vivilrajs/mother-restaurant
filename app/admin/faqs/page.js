'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AdminFaqs() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams ? (searchParams.get('search') || '') : '';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({ question: '', answer: '' });

  async function loadItems() {
    setLoading(true);
    try {
      const res = await fetch('/api/faqs');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadItems(); }, []);

  function openAddModal() {
    setEditItem(null);
    setFormData({ question: '', answer: '' });
    setModal(true);
  }

  function openEditModal(item) {
    setEditItem(item);
    setFormData({ question: item.question || '', answer: item.answer || '' });
    setModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = editItem
        ? await fetch(`/api/faqs/${editItem._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
        : await fetch('/api/faqs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      if (res.ok) {
        setModal(false);
        loadItems();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      const res = await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
      if (res.ok) loadItems();
    } catch (e) {
      console.error(e);
    }
  }

  const filteredItems = items.filter(item => 
    item.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-serif text-xl font-bold text-heading">Frequently Asked Questions</h2>
        <button onClick={openAddModal} className="btn-premium px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 w-full sm:w-auto justify-center">
          <i className="fas fa-plus"></i> Add FAQ
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading FAQs...</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {items.length === 0 ? 'No FAQs found. Add one to populate the public FAQs page.' : 'No matching FAQs found.'}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map(item => (
            <div key={item._id} className="admin-glass p-5 flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-[#2d2422] mb-1">{item.question}</h3>
                <p className="text-sm text-gray-600 whitespace-pre-line">{item.answer}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEditModal(item)} className="p-1.5 text-brand-600 hover:bg-brand-50 rounded" title="Edit"><i className="fas fa-pen"></i></button>
                <button onClick={() => deleteItem(item._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete"><i className="fas fa-trash"></i></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="admin-modal active">
          <div className="admin-modal-content relative max-w-lg">
            <div className="sticky top-0 bg-white p-4 md:p-6 border-b border-brand-600/10 flex justify-between items-center z-10 rounded-t-2xl">
              <h2 className="font-serif text-xl font-bold text-brand-700">{editItem ? 'Edit FAQ' : 'Add FAQ'}</h2>
              <button onClick={() => setModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition"><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 bg-[#fdfbf7]">
              <div>
                <label className="block text-sm font-bold mb-1">Question</label>
                <input type="text" required value={formData.question} onChange={e => setFormData({ ...formData, question: e.target.value })} className="form-input bg-white" placeholder="e.g. Do you accept reservations?" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Answer</label>
                <textarea required value={formData.answer} onChange={e => setFormData({ ...formData, answer: e.target.value })} className="form-input bg-white" rows="5"></textarea>
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
