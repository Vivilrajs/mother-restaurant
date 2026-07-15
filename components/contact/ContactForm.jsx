'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to send message');
      }
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6"><i className="fas fa-check text-green-600 dark:text-green-400 text-3xl"></i></div>
        <h3 className="font-serif text-3xl font-bold text-heading mb-2">Message Sent!</h3>
        <p className="text-muted">We&apos;ll get back to you within 24 hours.</p>
        <button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }} className="btn-premium px-8 py-3 rounded-full font-semibold mt-6">Send Another</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <h2 className="font-serif text-2xl font-bold text-heading mb-6">Send a Message</h2>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-semibold mb-2">Full Name</label><input type="text" className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
        <div><label className="block text-sm font-semibold mb-2">Email</label><input type="email" className="form-input" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
        <div><label className="block text-sm font-semibold mb-2">Phone</label><input type="tel" className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
        <div><label className="block text-sm font-semibold mb-2">Subject</label><input type="text" className="form-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} /></div>
      </div>
      <div><label className="block text-sm font-semibold mb-2">Message</label><textarea className="form-input" rows="5" required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}></textarea></div>
      <button type="submit" disabled={sending} className="btn-premium w-full py-4 rounded-xl font-semibold text-lg disabled:opacity-60">{sending ? 'Sending...' : 'Send Message'}</button>
    </form>
  );
}
