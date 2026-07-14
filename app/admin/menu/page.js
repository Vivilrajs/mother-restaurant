'use client';
import { useState, useEffect } from 'react';

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState(['Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Beverages']);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [loading, setLoading] = useState(true);

  // Edit/Add modal state
  const [itemModal, setItemModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '', category: 'Dinner', price: '', prepTime: '', status: 'available', signature: false, description: '', badge: '', image: ''
  });

  // Category manage modal state
  const [categoryModal, setCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  async function loadItems() {
    setLoading(true);
    let url = '/api/menu';
    if (categoryFilter !== 'All Categories') {
      url += `?category=${encodeURIComponent(categoryFilter)}`;
    }
    try {
      const res = await fetch(url);
      const data = await res.json();
      let filtered = Array.isArray(data) ? data : [];
      if (search) {
        filtered = filtered.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
      }
      setItems(filtered);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, [categoryFilter, search]);

  function openAddModal() {
    setEditItem(null);
    setFormData({
      name: '', category: categories[0] || 'Dinner', price: '', prepTime: '', status: 'available', signature: false, description: '', badge: '', image: ''
    });
    setItemModal(true);
  }

  function openEditModal(item) {
    setEditItem(item);
    setFormData({
      name: item.name || '',
      category: item.category || 'Dinner',
      price: item.price || '',
      prepTime: item.prepTime || '',
      status: item.status || 'available',
      signature: !!item.signature,
      description: item.description || '',
      badge: item.badge || '',
      image: item.image || ''
    });
    setItemModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...formData,
      price: String(formData.price),
      prepTime: String(formData.prepTime),
    };
    try {
      let res;
      if (editItem) {
        res = await fetch(`/api/menu/${editItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      if (res.ok) {
        setItemModal(false);
        loadItems();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      if (res.ok) loadItems();
    } catch (e) {
      console.error(e);
    }
  }

  function addCategory(e) {
    e.preventDefault();
    if (!newCategoryName) return;
    if (!categories.includes(newCategoryName)) {
      setCategories([...categories, newCategoryName]);
    }
    setNewCategoryName('');
  }

  function removeCategory(cat) {
    setCategories(categories.filter(c => c !== cat));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search menu..."
            className="form-input w-full sm:w-64 bg-white"
          />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="form-input bg-white w-full sm:w-40"
          >
            <option value="All Categories">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <button onClick={() => setCategoryModal(true)} className="px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 w-full sm:w-auto justify-center border border-brand-600 text-brand-600 hover:bg-brand-50 transition bg-white">
            <i className="fas fa-tags"></i> Categories
          </button>
          <button onClick={openAddModal} className="btn-premium px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 w-full sm:w-auto justify-center">
            <i className="fas fa-plus"></i> Add New Item
          </button>
        </div>
      </div>

      <div className="admin-glass overflow-hidden">
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Price</th>
                <th>Prep Time</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8">Loading menu items...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500">No menu items found.</td></tr>
              ) : items.map(item => (
                <tr key={item._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                      ) : (
                        <div className="w-10 h-10 bg-brand-100 flex items-center justify-center rounded-lg text-brand-600"><i className="fas fa-utensils"></i></div>
                      )}
                      <div>
                        <div className="font-semibold text-[#2d2422]">{item.name}</div>
                        {item.signature && <span className="text-[10px] bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded font-bold">Signature</span>}
                      </div>
                    </div>
                  </td>
                  <td>{item.category}</td>
                  <td>AED {item.price}</td>
                  <td>{item.prepTime ? `${item.prepTime} mins` : 'N/A'}</td>
                  <td>
                    <span className={`status-badge capitalize ${item.status === 'available' ? 'status-active' : item.status === 'out' ? 'status-out' : 'status-draft'}`}>
                      {item.status === 'available' ? 'Available' : item.status === 'out' ? 'Out of Stock' : 'Hidden'}
                    </span>
                  </td>
                  <td className="text-right space-x-1">
                    <button onClick={() => openEditModal(item)} className="p-1.5 text-brand-600 hover:bg-brand-50 rounded" title="Edit"><i className="fas fa-pen"></i></button>
                    <button onClick={() => deleteItem(item._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete"><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Menu Item Form Modal */}
      {itemModal && (
        <div className="admin-modal active">
          <div className="admin-modal-content relative">
            <div className="sticky top-0 bg-white p-4 md:p-6 border-b border-brand-600/10 flex justify-between items-center z-10 rounded-t-2xl">
              <h2 className="font-serif text-xl md:text-2xl font-bold text-brand-700">{editItem ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
              <button onClick={() => setItemModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition"><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-6 bg-[#fdfbf7]">
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-2">Item Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input bg-white" placeholder="e.g. Wagyu Beef Tenderloin" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Category</label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="form-input bg-white">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Price (AED)</label>
                  <input type="number" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="form-input bg-white" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Preparation Time (Mins)</label>
                  <input type="number" value={formData.prepTime} onChange={e => setFormData({ ...formData, prepTime: e.target.value })} className="form-input bg-white" placeholder="e.g. 25" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Availability Status</label>
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="form-input bg-white">
                    <option value="available">Available</option>
                    <option value="out">Out of Stock</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Badge (Optional)</label>
                  <input type="text" value={formData.badge} onChange={e => setFormData({ ...formData, badge: e.target.value })} className="form-input bg-white" placeholder="e.g. SIGNATURE, CHEF'S PICK" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Image URL (Optional)</label>
                  <input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="form-input bg-white" placeholder="e.g. https://example.com/image.png" />
                </div>
                <div className="md:col-span-2 flex items-center gap-3 p-4 bg-brand-50 rounded-lg border border-brand-600/20">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.signature} onChange={e => setFormData({ ...formData, signature: e.target.checked })} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                  </label>
                  <div>
                    <span className="block text-sm font-bold text-[#2d2422]">Signature Item</span>
                    <span className="block text-xs text-gray-500">Enable this to feature the item prominently on the website's Home Page.</span>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-2">Detailed Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="form-input bg-white" rows="4" placeholder="Describe the ingredients, flavors, and presentation..."></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-brand-600/10 mt-6">
                <button type="button" onClick={() => setItemModal(false)} className="px-6 py-2.5 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition">Cancel</button>
                <button type="submit" className="btn-premium px-8 py-2.5 rounded-lg font-bold">Save Menu Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menu Categories Modal */}
      {categoryModal && (
        <div className="admin-modal active">
          <div className="admin-modal-content relative max-w-md">
            <div className="sticky top-0 bg-white p-4 md:p-6 border-b border-brand-600/10 flex justify-between items-center z-10 rounded-t-2xl">
              <h2 className="font-serif text-xl font-bold text-brand-700">Menu Categories</h2>
              <button onClick={() => setCategoryModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition"><i className="fas fa-times"></i></button>
            </div>
            <div className="p-4 md:p-6 bg-[#fdfbf7]">
              <form onSubmit={addCategory} className="flex gap-2 mb-6">
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
                    <span className="font-semibold text-[#2d2422]">{cat}</span>
                    <button onClick={() => removeCategory(cat)} className="text-red-500 hover:text-red-700 p-1"><i className="fas fa-trash-alt"></i></button>
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
