'use client';
import { useState } from 'react';

export default function CateringQuoteForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', eventType: 'Wedding', guests: '', date: '', details: '' });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/catering', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit request');
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
      <div className="text-center py-8">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6"><i className="fas fa-check text-green-600 dark:text-green-400 text-3xl"></i></div>
        <h3 className="font-serif text-2xl font-bold text-heading mb-2">Request Sent!</h3>
        <p className="text-muted">Our events team will get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form className="grid md:grid-cols-2 gap-4" onSubmit={submit}>
      <h2 className="font-serif text-3xl font-bold mb-2 text-center text-heading md:col-span-2">Request a Quote</h2>
      {error && <div className="md:col-span-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
      <input type="text" placeholder="Full Name" className="form-input px-4 py-3 rounded-lg" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input type="email" placeholder="Email" className="form-input px-4 py-3 rounded-lg" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="tel" placeholder="Phone" className="form-input px-4 py-3 rounded-lg" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
      <select className="form-input px-4 py-3 rounded-lg" value={form.eventType} onChange={e => setForm({ ...form, eventType: e.target.value })}>
        <option>Wedding</option><option>Corporate</option><option>Birthday</option><option>Other</option>
      </select>
      <input type="number" placeholder="Number of Guests" className="form-input px-4 py-3 rounded-lg" value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })} />
      <input type="date" className="form-input px-4 py-3 rounded-lg" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
      <textarea placeholder="Tell us about your event..." className="form-input px-4 py-3 rounded-lg md:col-span-2" rows="4" value={form.details} onChange={e => setForm({ ...form, details: e.target.value })}></textarea>
      <button type="submit" disabled={sending} className="btn-premium px-8 py-4 rounded-full font-semibold md:col-span-2 disabled:opacity-60">{sending ? 'Sending...' : 'Submit Request'}</button>
    </form>
  );
}
