'use client';
import { useRef, useState } from 'react';

export default function ImageUploader({ variant = 'dropzone', folder, value, onChange, label, helpText }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFiles(fileList) {
    const file = fileList?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('folder', folder);
      formData.append('files', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onChange(data.files[0].url);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function onDrop(e) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  if (variant === 'avatar') {
    return (
      <div className="text-center">
        <div
          className="w-40 h-40 rounded-full bg-gray-200 mx-auto mb-2 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden relative group cursor-pointer"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          {value ? (
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <i className="fas fa-user text-6xl text-gray-400"></i>
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm font-bold transition-opacity">
            {uploading ? <i className="fas fa-spinner animate-spin"></i> : 'Upload Photo'}
          </div>
        </div>
        {value && (
          <button type="button" onClick={() => onChange('')} className="text-xs text-red-600 hover:underline">
            Remove photo
          </button>
        )}
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </div>
    );
  }

  return (
    <div
      className="p-6 border-2 border-dashed border-brand-600/30 rounded-xl text-center bg-white"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      {value ? (
        <div className="relative inline-block mb-3">
          <img src={value} alt="" className="max-h-40 rounded-lg mx-auto object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center text-red-600 hover:bg-red-50"
          >
            <i className="fas fa-times text-xs"></i>
          </button>
        </div>
      ) : (
        <i className="fas fa-cloud-upload-alt text-4xl text-brand-400 mb-2"></i>
      )}
      <p className="font-semibold text-[#2d2422]">{label || 'Upload Featured Image'}</p>
      <p className="text-xs text-gray-500 mt-1 mb-4">{helpText || 'PNG, JPG or WEBP up to 5MB.'}</p>
      {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="px-4 py-2 bg-brand-50 text-brand-700 rounded-lg font-semibold border border-brand-200 hover:bg-brand-100 transition disabled:opacity-50"
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
  );
}
