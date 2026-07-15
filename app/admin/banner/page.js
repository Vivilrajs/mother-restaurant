'use client';
import { useState, useEffect, useRef } from 'react';

export default function AdminBanner() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({});
  const [banner, setBanner] = useState({ slides: [] });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // S3 file upload states
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Link input states
  const [linkInput, setLinkInput] = useState({ type: 'image', url: '' });

  async function loadSettings() {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
      if (data.banner) {
        let slides = [];
        if (data.banner.slides) {
          slides = data.banner.slides;
        } else {
          // Migrate old format
          if (data.banner.type === 'video' && data.banner.videoUrl) {
            slides.push({ type: 'video', url: data.banner.videoUrl });
          } else if (data.banner.type === 'photo') {
            const imgs = data.banner.images || (data.banner.imageUrl ? [data.banner.imageUrl] : []);
            imgs.forEach(url => {
              if (url) slides.push({ type: 'image', url });
            });
          }
        }
        setBanner({ slides });
      }
    } catch (e) {
      console.error(e);
      setError('Failed to load banner settings.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  async function handleFileUpload(fileList) {
    const file = fileList?.[0];
    if (!file) return;
    setUploadError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('folder', 'banners');
      formData.append('files', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      
      const fileUrl = data.files[0].url;
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      
      setBanner(prev => ({
        ...prev,
        slides: [...(prev.slides || []), { type, url: fileUrl }]
      }));
    } catch (e) {
      setUploadError(e.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function handleAddLink(e) {
    e.preventDefault();
    if (!linkInput.url) return;
    setBanner(prev => ({
      ...prev,
      slides: [...(prev.slides || []), { type: linkInput.type, url: linkInput.url }]
    }));
    setLinkInput({ type: 'image', url: '' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');
    try {
      const payload = {
        ...settings,
        banner
      };
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        throw new Error('Failed to update banner settings');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading banner settings...</div>;
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-xl font-bold text-[#2d2422]">Homepage Media Slideshow Settings</h2>
      </div>

      <div className="admin-glass p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {success && <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-semibold">Slideshow updated successfully!</div>}
          {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-semibold">{error}</div>}

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#2d2422]">Slides List</h3>
            <p className="text-xs text-gray-500">
              The landing banner will cycle through these items in order. Images display for 4 seconds, and videos play to completion before switching to the next item.
            </p>
            
            {(!banner.slides || banner.slides.length === 0) ? (
              <div className="text-center p-8 bg-white rounded-xl border border-dashed border-brand-600/20 text-gray-400 text-xs">
                No media slides added. The slideshow will use the default video background.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {banner.slides.map((slide, idx) => (
                  <div key={idx} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border shadow-sm group">
                    {slide.type === 'video' ? (
                      <video src={slide.url} className="w-full h-full object-cover" />
                    ) : (
                      <img src={slide.url} className="w-full h-full object-cover" alt="" />
                    )}
                    <button
                      type="button"
                      onClick={() => setBanner(prev => ({ ...prev, slides: prev.slides.filter((_, i) => i !== idx) }))}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center text-red-600 hover:bg-red-50"
                      title="Delete Slide"
                    >
                      <i className="fas fa-trash text-xs"></i>
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
                      <i className={slide.type === 'video' ? 'fas fa-video' : 'fas fa-image'}></i>
                      <span>{slide.type.toUpperCase()} #{idx + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 border-t border-brand-600/10 pt-6">
            {/* Upload Area */}
            <div
              className="p-6 border-2 border-dashed border-brand-600/30 rounded-xl text-center bg-white flex flex-col items-center justify-center min-h-[220px]"
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                handleFileUpload(e.dataTransfer.files);
              }}
            >
              <i className="fas fa-cloud-upload-alt text-4xl text-brand-400 mb-2"></i>
              <p className="font-semibold text-sm text-[#2d2422]">Upload Image or Video</p>
              <p className="text-[10px] text-gray-500 mt-1 mb-4">PNG, JPG, MP4 or WebM (up to 50MB).</p>
              {uploadError && <p className="text-xs text-red-600 mb-2">{uploadError}</p>}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/mp4,video/webm"
                className="hidden"
                onChange={e => handleFileUpload(e.target.files)}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 bg-brand-50 text-brand-700 rounded-lg font-semibold border border-brand-200 hover:bg-brand-100 transition disabled:opacity-50 text-xs"
              >
                {uploading ? (
                  <>
                    <i className="fas fa-spinner animate-spin mr-2"></i>Uploading...
                  </>
                ) : (
                  'Browse Files'
                )}
              </button>
            </div>

            {/* Direct Link Form */}
            <div className="p-6 bg-white rounded-xl border border-brand-600/10 flex flex-col justify-between min-h-[220px]">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Alternative: Add External Link</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-[10px] text-gray-400 mb-1">Type</label>
                    <select
                      value={linkInput.type}
                      onChange={e => setLinkInput({ ...linkInput, type: e.target.value })}
                      className="form-input bg-[#fdfbf7] text-xs h-9 py-1"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] text-gray-400 mb-1">Media URL</label>
                    <input
                      type="url"
                      value={linkInput.url}
                      onChange={e => setLinkInput({ ...linkInput, url: e.target.value })}
                      className="form-input bg-[#fdfbf7] text-xs h-9"
                      placeholder="https://example.com/media.mp4"
                    />
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddLink}
                disabled={!linkInput.url}
                className="w-full mt-4 px-4 py-2 bg-brand-600 text-white hover:bg-brand-700 transition font-semibold rounded-lg text-xs disabled:opacity-50"
              >
                Add Link Slide
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-brand-600/10">
            <button
              type="submit"
              disabled={saving}
              className="btn-premium px-8 py-2.5 rounded-lg font-bold disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Banner Slideshow'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
