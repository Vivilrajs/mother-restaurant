'use client';
import { useState, useEffect, useRef } from 'react';
import useCategories from '@/components/admin/useCategories';

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const { categories: categoryDocs, names: categories, addCategory: addCategoryApi, removeCategory: removeCategoryApi } = useCategories('gallery');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Upload modal state
  const [modal, setModal] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [altText, setAltText] = useState('');
  const [uploadCategory, setUploadCategory] = useState('food');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

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

  function openUploadModal() {
    setPendingFiles([]);
    setAltText('');
    setUploadCategory(categories[0] || 'food');
    setUploadError('');
    setModal(true);
  }

  function handleFilePick(fileList) {
    setPendingFiles(Array.from(fileList || []));
  }

  async function handleUploadSubmit(e) {
    e.preventDefault();
    if (pendingFiles.length === 0) {
      setUploadError('Choose at least one image.');
      return;
    }
    setUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('folder', 'gallery');
      pendingFiles.forEach((file) => formData.append('files', file));
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      for (let i = 0; i < data.files.length; i++) {
        const alt = pendingFiles.length > 1 ? `${altText || 'Gallery image'} ${i + 1}` : (altText || 'Gallery image');
        await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: data.files[i].url, alt, category: uploadCategory })
        });
      }

      setModal(false);
      loadItems();
    } catch (e) {
      setUploadError(e.message);
    } finally {
      setUploading(false);
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
          <button onClick={openUploadModal} className="btn-premium px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 w-full sm:w-auto justify-center">
            <i className="fas fa-cloud-upload-alt"></i> Upload Images
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

      {/* Upload Gallery Images Modal */}
      {modal && (
        <div className="admin-modal active">
          <div className="admin-modal-content relative max-w-md">
            <div className="sticky top-0 bg-white p-4 md:p-6 border-b border-brand-600/10 flex justify-between items-center z-10 rounded-t-2xl">
              <h2 className="font-serif text-xl font-bold text-brand-700">Upload Gallery Images</h2>
              <button onClick={() => setModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition"><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleUploadSubmit} className="p-4 md:p-6 space-y-4 bg-[#fdfbf7]">
              <div
                className="p-6 border-2 border-dashed border-brand-600/30 rounded-xl text-center bg-white cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleFilePick(e.dataTransfer.files); }}
              >
                <i className="fas fa-cloud-upload-alt text-4xl text-brand-400 mb-2"></i>
                <p className="font-semibold text-[#2d2422]">
                  {pendingFiles.length > 0 ? `${pendingFiles.length} image${pendingFiles.length > 1 ? 's' : ''} selected` : 'Click or drag images here'}
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG or WEBP up to 5MB each. Select multiple to upload in bulk.</p>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFilePick(e.target.files)} />
              </div>
              {pendingFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {pendingFiles.map((f, i) => (
                    <span key={i} className="text-xs bg-brand-50 text-brand-700 px-2 py-1 rounded-full border border-brand-200">{f.name}</span>
                  ))}
                </div>
              )}
              <div>
                <label className="block text-sm font-bold mb-1">Alt Text</label>
                <input type="text" value={altText} onChange={e => setAltText(e.target.value)} className="form-input bg-white" placeholder="Description of the image(s)" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Category</label>
                <select value={uploadCategory} onChange={e => setUploadCategory(e.target.value)} className="form-input bg-white">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
              <div className="flex justify-end gap-3 pt-4 border-t border-brand-600/10">
                <button type="button" onClick={() => setModal(false)} className="px-6 py-2.5 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</button>
                <button type="submit" disabled={uploading} className="btn-premium px-8 py-2.5 rounded-lg font-bold disabled:opacity-50">
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
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
                    <span className="font-semibold text-[#2d2422] capitalize">{cat.name}</span>
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
