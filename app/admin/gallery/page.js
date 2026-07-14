'use client';
import { useState, useEffect } from 'react';

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState(['food', 'ambiance', 'events']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Edit/Add modal state
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({ url: '', alt: '', category: 'food' });

  // Category manage modal state
  const [categoryModal, setCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  async function loadItems() {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery');
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

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setModal(false);
        setFormData({ url: '', alt: '', category: 'food' });
        loadItems();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;
    try {
      // In the API, we can just delete from DB
      // We didn't define a /api/gallery/[id] endpoint, let's write delete logic or delete via API
      // Since we don't have gallery/[id] DELETE, let's make sure it deletes by calling the endpoint. Let's see if we should create a DELETE handler in route.js or create /api/gallery/[id].
      // Let's call /api/gallery with a method or use a generic DELETE route. Wait, in app/api/gallery/route.js we don't have DELETE. Let's write a simple DELETE handler inside route.js by matching request query/body or create a detail route.
      // Let's modify app/api/gallery/route.js to support DELETE by ID, or create app/api/gallery/[id]/route.js. Let's write app/api/gallery/[id]/route.js. Wait, editing is easier or we can do it directly. Let's write app/api/gallery/[id]/route.js! Or, to keep file count lower, we can handle DELETE in app/api/gallery/route.js! Yes! Let's check how we can do it. In Next.js, app/api/gallery/route.js can have DELETE:
      // Let's create `app/api/gallery/[id]/route.js` to match consistent CRUD pattern in other components!
    } catch (e) {
      console.error(e);
    }
  }

  const filtered = activeCategory === 'All' ? items : items.filter(i => i.category === activeCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-4 rounded-xl border border-brand-600/10 shadow-sm gap-4">
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <button onClick={() => setActiveCategory('All')} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${activeCategory === 'All' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            All Categories
          </button>
          {categories.map(c => (
            <button key={c} onClick={() => setActiveCategory(c)} className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition ${activeCategory === c ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <button onClick={() => setCategoryModal(true)} className="px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 w-full sm:w-auto justify-center border border-brand-600 text-brand-600 hover:bg-brand-50 transition bg-white">
            <i className="fas fa-tags"></i> Categories
          </button>
          <button onClick={() => setModal(true)} className="btn-premium px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 w-full sm:w-auto justify-center">
            <i className="fas fa-cloud-upload-alt"></i> Add Image URL
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading gallery items...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No images found. Add images to populate.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map((img, index) => (
            <div key={img._id || index} className="relative group rounded-xl overflow-hidden aspect-square border border-brand-600/10 bg-white">
              <img src={img.url} className="w-full h-full object-cover" alt={img.alt} />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button onClick={async () => {
                  if (confirm('Are you sure you want to delete this image?')) {
                    const res = await fetch(`/api/gallery/${img._id}`, { method: 'DELETE' });
                    if (res.ok) loadItems();
                  }
                }} className="w-10 h-10 rounded-full bg-white text-red-600 hover:bg-red-600 hover:text-white transition"><i className="fas fa-trash"></i></button>
              </div>
              <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded capitalize">{img.category}</span>
            </div>
          ))}
        </div>
      )}

      {/* Add Gallery Image Modal */}
      {modal && (
        <div className="admin-modal active">
          <div className="admin-modal-content relative max-w-md">
            <div className="sticky top-0 bg-white p-4 md:p-6 border-b border-brand-600/10 flex justify-between items-center z-10 rounded-t-2xl">
              <h2 className="font-serif text-xl font-bold text-brand-700">Add Gallery Image</h2>
              <button onClick={() => setModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition"><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 bg-[#fdfbf7]">
              <div>
                <label className="block text-sm font-bold mb-1">Image URL</label>
                <input type="url" required value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} className="form-input bg-white" placeholder="https://example.com/image.jpg" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Alt Text</label>
                <input type="text" required value={formData.alt} onChange={e => setFormData({ ...formData, alt: e.target.value })} className="form-input bg-white" placeholder="Description of the image" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Category</label>
                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="form-input bg-white">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-brand-600/10">
                <button type="button" onClick={() => setModal(false)} className="px-6 py-2.5 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</button>
                <button type="submit" className="btn-premium px-8 py-2.5 rounded-lg font-bold">Add Image</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Categories Modal */}
      {categoryModal && (
        <div className="admin-modal active">
          <div className="admin-modal-content relative max-w-md">
            <div className="sticky top-0 bg-white p-4 md:p-6 border-b border-brand-600/10 flex justify-between items-center z-10 rounded-t-2xl">
              <h2 className="font-serif text-xl font-bold text-brand-700">Gallery Categories</h2>
              <button onClick={() => setCategoryModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition"><i className="fas fa-times"></i></button>
            </div>
            <div className="p-4 md:p-6 bg-[#fdfbf7]">
              <form onSubmit={e => {
                e.preventDefault();
                if (newCategoryName && !categories.includes(newCategoryName)) {
                  setCategories([...categories, newCategoryName]);
                }
                setNewCategoryName('');
              }} className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  className="form-input bg-white flex-1"
                  placeholder="New Category Name"
                  required
                />
                <button type="submit" className="btn-premium px-4 py-2 rounded-lg font-bold"><i className="fas fa-plus"></i></button>
              </form>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {categories.map(cat => (
                  <div key={cat} className="flex justify-between items-center bg-white p-3 rounded-lg border border-brand-600/10">
                    <span className="font-semibold text-[#2d2422] capitalize">{cat}</span>
                    <button onClick={() => setCategories(categories.filter(c => c !== cat))} className="text-red-500 hover:text-red-700 p-1"><i className="fas fa-trash-alt"></i></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
