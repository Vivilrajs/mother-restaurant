'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AdminBranches() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams ? (searchParams.get('search') || '') : '';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit/Add modal state
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '', location: '', phone: '', email: '', hours: ''
  });

  async function loadItems() {
    setLoading(true);
    try {
      const res = await fetch('/api/branches');
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
    setFormData({ name: '', location: '', phone: '', email: '', hours: '' });
    setModal(true);
  }

  function openEditModal(branch) {
    setEditItem(branch);
    setFormData({
      name: branch.name || '',
      location: branch.location || '',
      phone: branch.phone || '',
      email: branch.email || '',
      hours: branch.hours || ''
    });
    setModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let res;
      if (editItem) {
        res = await fetch(`/api/branches/${editItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        res = await fetch('/api/branches', {
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
    if (!confirm('Are you sure you want to delete this branch?')) return;
    try {
      const res = await fetch(`/api/branches/${id}`, { method: 'DELETE' });
      if (res.ok) loadItems();
    } catch (e) {
      console.error(e);
    }
  }

  const filteredItems = items.filter(branch => 
    branch.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    branch.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    branch.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    branch.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-serif text-xl font-bold text-[#2d2422]">Restaurant Locations</h2>
        <button onClick={openAddModal} className="btn-premium px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 w-full sm:w-auto justify-center">
          <i className="fas fa-plus"></i> Add Branch
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading branches...</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {items.length === 0 ? 'No branches found. Add branches to populate.' : 'No matching branches found.'}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredItems.map(branch => (
            <div key={branch._id} className="admin-glass p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-serif text-xl font-bold text-[#2d2422]">{branch.name}</h3>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEditModal(branch)} className="p-1 text-brand-600 hover:bg-brand-50 rounded" title="Edit"><i className="fas fa-pen text-sm"></i></button>
                    <button onClick={() => deleteItem(branch._id)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete"><i className="fas fa-trash text-sm"></i></button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2"><i className="fas fa-map-marker-alt text-brand-600 mr-2"></i>{branch.location}</p>
                <p className="text-sm text-gray-600 mt-1"><i className="fas fa-phone text-brand-600 mr-2"></i>{branch.phone}</p>
                <p className="text-sm text-gray-600 mt-1"><i className="fas fa-envelope text-brand-600 mr-2"></i>{branch.email}</p>
              </div>
              <div className="bg-[#f9f3e8]/50 p-3 rounded-lg border border-brand-600/5 text-xs text-brand-800">
                <i className="far fa-clock mr-2"></i>{branch.hours || 'Hours not specified'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Branch Form Modal */}
      {modal && (
        <div className="admin-modal active">
          <div className="admin-modal-content relative max-w-md">
            <div className="sticky top-0 bg-white p-4 md:p-6 border-b border-brand-600/10 flex justify-between items-center z-10 rounded-t-2xl">
              <h2 className="font-serif text-xl font-bold text-brand-700">{editItem ? 'Edit Branch' : 'Add Branch'}</h2>
              <button onClick={() => setModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition"><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 bg-[#fdfbf7]">
              <div>
                <label className="block text-sm font-bold mb-1">Branch Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input bg-white" placeholder="e.g. Jumeirah Main Branch" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Location / Address</label>
                <input type="text" required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="form-input bg-white" placeholder="e.g. Jumeirah Beach Road, Dubai" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Phone Number</label>
                <input type="text" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="form-input bg-white" placeholder="e.g. +971 4 400 0000" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Email Address</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="form-input bg-white" placeholder="e.g. jumeirah@themotherrestaurant.ae" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Business Hours</label>
                <input type="text" required value={formData.hours} onChange={e => setFormData({ ...formData, hours: e.target.value })} className="form-input bg-white" placeholder="Mon-Sun: 12PM - 11PM" />
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
