'use client';
import { useState } from 'react';

export default function ApplyModal({ jobTitle, onClose }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', resumeUrl: '', message: '' });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, jobTitle }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit application');
      }
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="admin-modal active" onClick={onClose}>
      <div className="admin-modal-content relative max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white p-4 md:p-6 border-b border-brand-600/10 flex justify-between items-center z-10 rounded-t-2xl">
          <h2 className="font-serif text-xl font-bold text-brand-700">Apply — {jobTitle}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition"><i className="fas fa-times"></i></button>
        </div>
        <div className="p-4 md:p-6 bg-[#fdfbf7]">
          {sent ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6"><i className="fas fa-check text-green-600 dark:text-green-400 text-3xl"></i></div>
              <h3 className="font-serif text-2xl font-bold text-heading mb-2">Application Sent!</h3>
              <p className="text-muted mb-6">We&apos;ll review your application and get back to you soon.</p>
              <button onClick={onClose} className="btn-premium px-8 py-2.5 rounded-lg font-bold">Close</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
              <div>
                <label className="block text-sm font-bold mb-1">Full Name</label>
                <input type="text" required className="form-input bg-white" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Email</label>
                <input type="email" required className="form-input bg-white" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Phone</label>
                <input type="tel" className="form-input bg-white" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Resume / Portfolio Link</label>
                <input type="url" className="form-input bg-white" placeholder="https://..." value={form.resumeUrl} onChange={e => setForm({ ...form, resumeUrl: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Message (Optional)</label>
                <textarea className="form-input bg-white" rows="3" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</button>
                <button type="submit" disabled={sending} className="btn-premium px-8 py-2.5 rounded-lg font-bold disabled:opacity-60">{sending ? 'Sending...' : 'Submit Application'}</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
