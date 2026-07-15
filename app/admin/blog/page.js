'use client';
import { useState, useEffect } from 'react';
import ImageUploader from '@/components/admin/ImageUploader';
import useCategories from '@/components/admin/useCategories';

export default function AdminBlog() {
  const [items, setItems] = useState([]);
  const { categories: categoryDocs, names: categories, addCategory: addCategoryApi, removeCategory: removeCategoryApi } = useCategories('blog');
  const [loading, setLoading] = useState(true);

  // Edit/Add modal state
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '', content: '', category: 'Recipe', author: 'Chef Fatima Al-Rashid', tags: '', status: 'Draft', featuredImage: '', readTime: ''
  });

  // Category manage modal state
  const [categoryModal, setCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  async function loadItems() {
    setLoading(true);
    try {
      const res = await fetch('/api/blog');
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
      title: '', content: '', category: categories[0] || 'Recipe', author: 'Chef Fatima Al-Rashid', tags: '', status: 'Draft', featuredImage: '', readTime: ''
    });
    setModal(true);
  }

  function openEditModal(post) {
    setEditItem(post);
    setFormData({
      title: post.title || '',
      content: post.content || '',
      category: post.category || 'Recipe',
      author: post.author || 'Chef Fatima Al-Rashid',
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
      status: post.status || 'Draft',
      featuredImage: post.featuredImage || '',
      readTime: post.readTime || ''
    });
    setModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    try {
      let res;
      if (editItem) {
        res = await fetch(`/api/blog/${editItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
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
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (res.ok) loadItems();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <input type="text" placeholder="Search posts..." className="form-input w-full sm:w-64 bg-white" />
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button onClick={() => setCategoryModal(true)} className="px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 w-full sm:w-auto justify-center border border-brand-600 text-brand-600 hover:bg-brand-50 transition bg-white">
            <i className="fas fa-tags"></i> Categories
          </button>
          <button onClick={openAddModal} className="btn-premium px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 w-full sm:w-auto justify-center">
            <i className="fas fa-pen"></i> Create Post
          </button>
        </div>
      </div>

      <div className="admin-glass overflow-hidden">
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Post Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8">Loading posts...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500">No blog posts found.</td></tr>
              ) : items.map(post => (
                <tr key={post._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {post.featuredImage ? (
                        <img src={post.featuredImage} className="w-10 h-10 object-cover rounded-lg" alt="" />
                      ) : (
                        <div className="w-10 h-10 bg-brand-100 flex items-center justify-center rounded-lg text-brand-600"><i className="fas fa-pen-nib"></i></div>
                      )}
                      <div className="font-semibold text-[#2d2422]">{post.title}</div>
                    </div>
                  </td>
                  <td>{post.category}</td>
                  <td>{post.author}</td>
                  <td>{new Date(post.createdAt || post.updatedAt).toLocaleDateString('en-US')}</td>
                  <td>
                    <span className={`status-badge ${post.status === 'Published' ? 'status-active' : 'status-draft'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="text-right space-x-1">
                    <button onClick={() => openEditModal(post)} className="p-1.5 text-brand-600 hover:bg-brand-50 rounded" title="Edit"><i className="fas fa-pen"></i></button>
                    <button onClick={() => deleteItem(post._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete"><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Write Blog Post Modal */}
      {modal && (
        <div className="admin-modal active">
          <div className="admin-modal-content relative max-w-4xl">
            <div className="sticky top-0 bg-white p-4 md:p-6 border-b border-brand-600/10 flex justify-between items-center z-10 rounded-t-2xl">
              <h2 className="font-serif text-xl md:text-2xl font-bold text-brand-700">{editItem ? 'Edit Blog Post' : 'Write Blog Post'}</h2>
              <button onClick={() => setModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition"><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 md:p-8 bg-[#fdfbf7] flex flex-col md:flex-row gap-6 md:gap-8">
              <div className="w-full md:w-2/3 space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Article Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="form-input bg-white text-lg font-serif" placeholder="e.g. The Secrets of Spiced Rice" />
                </div>
                <div className="border rounded-lg bg-white overflow-hidden">
                  <div className="bg-gray-50 p-2 border-b flex gap-2">
                    <button type="button" className="p-2 hover:bg-gray-200 rounded"><i className="fas fa-bold"></i></button>
                    <button type="button" className="p-2 hover:bg-gray-200 rounded"><i className="fas fa-italic"></i></button>
                    <button type="button" className="p-2 hover:bg-gray-200 rounded"><i className="fas fa-list"></i></button>
                    <button type="button" className="p-2 hover:bg-gray-200 rounded"><i className="fas fa-link"></i></button>
                    <button type="button" className="p-2 hover:bg-gray-200 rounded"><i className="fas fa-image"></i></button>
                  </div>
                  <textarea required value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full p-4 h-64 focus:outline-none resize-none form-input border-none" placeholder="Write your culinary story here..."></textarea>
                </div>
              </div>
              <div className="w-full md:w-1/3 space-y-6">
                <div className="admin-glass p-5 bg-white space-y-4">
                  <h3 className="font-bold border-b pb-2 mb-4">Publishing</h3>
                  <div>
                    <label className="block text-sm mb-1">Status</label>
                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="form-input">
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Category</label>
                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="form-input">
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Author</label>
                    <input type="text" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} className="form-input" placeholder="e.g. Chef Fatima" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Read Time (Optional)</label>
                    <input type="text" value={formData.readTime} onChange={e => setFormData({ ...formData, readTime: e.target.value })} className="form-input" placeholder="e.g. 5 min read" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Tags (comma separated)</label>
                    <input type="text" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} className="form-input" placeholder="e.g. Wagyu, Fine Dining" />
                  </div>
                </div>
                <div className="admin-glass p-5 bg-white">
                  <h3 className="font-bold border-b pb-2 mb-4">Featured Image</h3>
                  <ImageUploader
                    folder="blog"
                    value={formData.featuredImage}
                    onChange={(url) => setFormData({ ...formData, featuredImage: url })}
                  />
                </div>
                <button type="submit" className="btn-premium w-full py-2.5 rounded-lg font-bold">Save Post</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blog Categories Modal */}
      {categoryModal && (
        <div className="admin-modal active">
          <div className="admin-modal-content relative max-w-md">
            <div className="sticky top-0 bg-white p-4 md:p-6 border-b border-brand-600/10 flex justify-between items-center z-10 rounded-t-2xl">
              <h2 className="font-serif text-xl font-bold text-brand-700">Blog Categories</h2>
              <button onClick={() => setCategoryModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition"><i className="fas fa-times"></i></button>
            </div>
            <div className="p-4 md:p-6 bg-[#fdfbf7]">
              <form onSubmit={e => {
                e.preventDefault();
                addCategoryApi(newCategoryName);
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
                {categoryDocs.map(cat => (
                  <div key={cat._id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-brand-600/10">
                    <span className="font-semibold text-[#2d2422]">{cat.name}</span>
                    <button onClick={() => removeCategoryApi(cat._id)} className="text-red-500 hover:text-red-700 p-1"><i className="fas fa-trash-alt"></i></button>
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
