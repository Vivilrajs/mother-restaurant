'use client';
import { useState, useEffect } from 'react';

export default function AdminSettings() {
  const [formData, setFormData] = useState({
    siteName: 'The Mother Restaurant',
    tagline: 'Love is Her Secret Ingredient',
    email: 'info@themother.ae',
    currency: 'AED',
    social: { instagram: '', facebook: '', tiktok: '', twitter: '' }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data && data.siteName) {
            setFormData({
              siteName: data.siteName || '',
              tagline: data.tagline || '',
              email: data.email || '',
              currency: data.currency || '',
              social: data.social || { instagram: '', facebook: '', tiktok: '', twitter: '' }
            });
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) alert('Settings saved successfully!');
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-center py-8">Loading settings...</div>;

  return (
    <div className="max-w-4xl">
      <div className="admin-glass p-8 bg-white">
        <h2 className="font-serif text-xl font-bold mb-6 border-b border-gray-100 pb-4 text-[#2d2422]">General Settings</h2>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Site Name</label>
              <input type="text" value={formData.siteName} onChange={e => setFormData({ ...formData, siteName: e.target.value })} className="form-input" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Tagline</label>
              <input type="text" value={formData.tagline} onChange={e => setFormData({ ...formData, tagline: e.target.value })} className="form-input" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Contact Email (Global)</label>
              <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="form-input" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Currency Symbol</label>
              <input type="text" value={formData.currency} onChange={e => setFormData({ ...formData, currency: e.target.value })} className="form-input" required />
            </div>
          </div>

          <h2 className="font-serif text-xl font-bold mb-4 pt-6 border-t border-gray-100 text-[#2d2422]">Social Media Links</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2"><i className="fab fa-instagram text-brand-600"></i> Instagram</label>
              <input type="url" value={formData.social?.instagram || ''} onChange={e => setFormData({ ...formData, social: { ...formData.social, instagram: e.target.value } })} className="form-input" placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2"><i className="fab fa-facebook text-brand-600"></i> Facebook</label>
              <input type="url" value={formData.social?.facebook || ''} onChange={e => setFormData({ ...formData, social: { ...formData.social, facebook: e.target.value } })} className="form-input" placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2"><i className="fab fa-tiktok text-brand-600"></i> TikTok</label>
              <input type="url" value={formData.social?.tiktok || ''} onChange={e => setFormData({ ...formData, social: { ...formData.social, tiktok: e.target.value } })} className="form-input" placeholder="https://tiktok.com/..." />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2"><i className="fab fa-twitter text-brand-600"></i> Twitter/X</label>
              <input type="url" value={formData.social?.twitter || ''} onChange={e => setFormData({ ...formData, social: { ...formData.social, twitter: e.target.value } })} className="form-input" placeholder="https://twitter.com/..." />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button type="submit" disabled={saving} className="btn-premium px-8 py-3 rounded-lg font-bold disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
