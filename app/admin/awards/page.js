'use client';
import { useState, useEffect } from 'react';
import ImageUploader from '@/components/admin/ImageUploader';

const ICONS = [
  { value: 'fa-trophy', label: 'Trophy' },
  { value: 'fa-star', label: 'Star' },
  { value: 'fa-medal', label: 'Medal' },
  { value: 'fa-certificate', label: 'Certificate' },
  { value: 'fa-award', label: 'Award Ribbon' },
  { value: 'fa-shield-alt', label: 'Shield' },
  { value: 'fa-ribbon', label: 'Ribbon' },
  { value: 'fa-heart', label: 'Heart' },
];

export default function AdminAwards() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit/Add modal state
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '', text: '', icon: 'fa-trophy', image: ''
  });

  async function loadItems() {
    setLoading(true);
    try {
      const res = await fetch('/api/awards');
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
  }, []);

  function openAddModal() {
    setEditItem(null);
    setFormData({ title: '', text: '', icon: 'fa-trophy', image: '' });
    setModal(true);
  }

  function openEditModal(item) {
    setEditItem(item);
    setFormData({
      title: item.title || '',
      text: item.text || '',
      icon: item.icon || 'fa-trophy',
      image: item.image || ''
    });
    setModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let res;
      if (editItem) {
        res = await fetch(`/api/awards/${editItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        res = await fetch('/api/awards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      if (res.ok) {
        setModal(false);
        loadItems();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this award/certification?')) return;
    try {
      const res = await fetch(`/api/awards/${id}`, { method: 'DELETE' });
      if (res.ok) loadItems();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-serif text-xl font-bold text-[#2d2422]">Awards & Certifications</h2>
        <button onClick={openAddModal} className="btn-premium px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 w-full sm:w-auto justify-center">
          <i className="fas fa-plus"></i> Add Award
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading awards...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No awards found. Add awards or certifications to populate.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((award, index) => {
            const GRADIENTS = [
              { from: 'from-brand-400', to: 'to-brand-600' },
              { from: 'from-brand-500', to: 'to-brand-700' },
              { from: 'from-brand-600', to: 'to-brand-800' },
              { from: 'from-brand-700', to: 'to-brand-900' },
            ];
            const grad = GRADIENTS[index % GRADIENTS.length];
            return (
              <div key={award._id} className={`bg-gradient-to-br ${grad.from} ${grad.to} p-6 rounded-2xl text-center shadow-md relative flex flex-col justify-between min-h-[220px]`}>
                <div className="absolute top-4 right-4 flex gap-1 bg-black/20 rounded-lg p-1 backdrop-blur-sm">
                  <button onClick={() => openEditModal(award)} className="p-1.5 text-white hover:text-brand-300 transition" title="Edit"><i className="fas fa-pen text-xs"></i></button>
                  <button onClick={() => deleteItem(award._id)} className="p-1.5 text-white hover:text-red-300 transition" title="Delete"><i className="fas fa-trash text-xs"></i></button>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center pt-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 border border-white/20 overflow-hidden">
                    {award.image ? (
                      <img src={award.image} className="w-full h-full object-contain p-2" alt={award.title} />
                    ) : (
                      <i className={`fas ${award.icon || 'fa-trophy'} text-white text-xl`}></i>
                    )}
                  </div>
                  <h4 className="font-serif font-bold text-lg text-white line-clamp-1 mb-1">{award.title}</h4>
                  <p className="text-white/80 text-xs line-clamp-2 px-2">{award.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Award Modal */}
      {modal && (
        <div className="admin-modal active">
          <div className="admin-modal-content relative max-w-lg">
            <div className="sticky top-0 bg-white p-4 md:p-6 border-b border-brand-600/10 flex justify-between items-center z-10 rounded-t-2xl">
              <h2 className="font-serif text-xl font-bold text-brand-700">{editItem ? 'Edit Award / Certification' : 'Add Award / Certification'}</h2>
              <button onClick={() => setModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition"><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 bg-[#fdfbf7]">
              <div>
                <label className="block text-sm font-bold mb-1">Title</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="form-input bg-white" placeholder="e.g. Michelin Star, Dubai Best Cafeteria" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Description / Achievement</label>
                <input type="text" required value={formData.text} onChange={e => setFormData({ ...formData, text: e.target.value })} className="form-input bg-white" placeholder="e.g. Best Family Restaurant 2024" />
              </div>
              
              <div className="border-t border-brand-600/10 pt-4 space-y-4">
                <h3 className="text-sm font-bold text-[#2d2422]">Award Logo / Icon</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Option A: Upload Logo Image</label>
                    <ImageUploader
                      folder="awards"
                      value={formData.image}
                      onChange={(url) => setFormData({ ...formData, image: url })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Option B: Predefined Icon</label>
                    <select
                      value={formData.icon}
                      onChange={e => setFormData({ ...formData, icon: e.target.value })}
                      disabled={!!formData.image}
                      className="form-input bg-white disabled:opacity-50"
                    >
                      {ICONS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                    </select>
                    {formData.image && <p className="text-[10px] text-brand-600 mt-1"><i className="fas fa-info-circle mr-1"></i>Predefined icon is disabled because an image logo is uploaded.</p>}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-brand-600/10">
                <button type="button" onClick={() => setModal(false)} className="px-6 py-2.5 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</button>
                <button type="submit" className="btn-premium px-8 py-2.5 rounded-lg font-bold">Save Award</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
