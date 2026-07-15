'use client';
import { useState, useEffect } from 'react';
import ImageUploader from '@/components/admin/ImageUploader';

export default function AdminChefs() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit/Add modal state
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '', title: '', experience: '', bio: '', image: '', instagram: '', linkedin: '', philosophy: ''
  });

  async function loadItems() {
    setLoading(true);
    try {
      const res = await fetch('/api/chefs');
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
    setFormData({
      name: '', title: '', experience: '', bio: '', image: '', instagram: '', linkedin: '', philosophy: ''
    });
    setModal(true);
  }

  function openEditModal(chef) {
    setEditItem(chef);
    setFormData({
      name: chef.name || '',
      title: chef.title || '',
      experience: chef.experience || '',
      bio: chef.bio || '',
      image: chef.image || '',
      instagram: chef.instagram || '',
      linkedin: chef.linkedin || '',
      philosophy: chef.philosophy || ''
    });
    setModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let res;
      if (editItem) {
        res = await fetch(`/api/chefs/${editItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        res = await fetch('/api/chefs', {
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
    if (!confirm('Are you sure you want to delete this chef profile?')) return;
    try {
      const res = await fetch(`/api/chefs/${id}`, { method: 'DELETE' });
      if (res.ok) loadItems();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-serif text-xl font-bold text-heading">Culinary Team</h2>
        <button onClick={openAddModal} className="btn-premium px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 w-full sm:w-auto justify-center">
          <i className="fas fa-plus"></i> Add Chef Profile
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading culinary team...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No chefs found. Add chef profiles to populate.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(chef => (
            <div key={chef._id} className="admin-glass overflow-hidden flex flex-col justify-between">
              <div className="relative aspect-[4/5] bg-gradient-to-br from-brand-100 to-brand-200">
                {chef.image ? (
                  <img src={chef.image} className="w-full h-full object-cover" alt={chef.name} />
                ) : (
                  <div className="flex items-center justify-center h-full text-brand-400">
                    <i className="fas fa-user-tie text-8xl"></i>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-2xl font-bold text-white">{chef.name}</h3>
                  <p className="text-brand-300">{chef.title}</p>
                  {chef.experience && <p className="text-white/70 text-sm">{chef.experience}</p>}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-3">{chef.bio}</p>
                <div className="flex justify-between items-center border-t border-brand-600/10 pt-4 mt-auto">
                  <div className="flex gap-2">
                    {chef.instagram && <a href={chef.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-600"><i className="fab fa-instagram"></i></a>}
                    {chef.linkedin && <a href={chef.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-600"><i className="fab fa-linkedin"></i></a>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEditModal(chef)} className="p-1.5 text-brand-600 hover:bg-brand-50 rounded" title="Edit"><i className="fas fa-pen text-sm"></i></button>
                    <button onClick={() => deleteItem(chef._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete"><i className="fas fa-trash text-sm"></i></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chef Profile Form Modal */}
      {modal && (
        <div className="admin-modal active">
          <div className="admin-modal-content relative">
            <div className="sticky top-0 bg-white p-4 md:p-6 border-b border-brand-600/10 flex justify-between items-center z-10 rounded-t-2xl">
              <h2 className="font-serif text-xl md:text-2xl font-bold text-brand-700">{editItem ? 'Edit Chef Profile' : 'Add Chef Profile'}</h2>
              <button onClick={() => setModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition"><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-6 bg-[#fdfbf7]">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                <div className="w-full md:w-1/3">
                  <ImageUploader
                    variant="avatar"
                    folder="chefs"
                    value={formData.image}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                  />
                </div>
                <div className="w-full md:w-2/3 space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">Full Name</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input bg-white" placeholder="Chef Name" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Title / Specialization</label>
                    <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="form-input bg-white" placeholder="e.g. Executive Chef, Pastry Master" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Years of Experience</label>
                    <input type="text" value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} className="form-input bg-white" placeholder="e.g. 15 Years" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Biography & Achievements</label>
                <textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="form-input bg-white" rows="5" placeholder="Tell the chef's culinary story..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Cooking Philosophy Quote (Optional)</label>
                <textarea value={formData.philosophy} onChange={e => setFormData({ ...formData, philosophy: e.target.value })} className="form-input bg-white" rows="2" placeholder="e.g. Cooking is an act of love..."></textarea>
              </div>
              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-brand-600/10">
                <div>
                  <label className="block text-sm font-bold mb-1"><i className="fab fa-instagram text-brand-600"></i> Instagram</label>
                  <input type="url" value={formData.instagram} onChange={e => setFormData({ ...formData, instagram: e.target.value })} className="form-input bg-white" placeholder="https://instagram.com/..." />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1"><i className="fab fa-linkedin text-brand-600"></i> LinkedIn</label>
                  <input type="url" value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} className="form-input bg-white" placeholder="https://linkedin.com/in/..." />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-brand-600/10 mt-6">
                <button type="button" onClick={() => setModal(false)} className="px-6 py-2.5 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</button>
                <button type="submit" className="btn-premium px-8 py-2.5 rounded-lg font-bold">Save Chef Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
