'use client';
import { useState } from 'react';

export default function ReservationForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', phone:'', date:'', time:'', guests:'2', occasion:'', seating:'', requests:'' });
  const today = (() => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().split('T')[0]; })();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/reservations', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
      setSent(true);
    } finally { setLoading(false); }
  };

  if (sent) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center">
        <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6"><i className="fas fa-check text-green-600 dark:text-green-400 text-4xl"></i></div>
        <h2 className="font-serif text-4xl font-bold text-heading mb-4">Reservation Confirmed!</h2>
        <p className="text-muted mb-2">Thank you, <strong>{form.name}</strong>! We&apos;ll confirm your table at <strong>{form.date}</strong> at <strong>{form.time}</strong> for <strong>{form.guests} guests</strong>.</p>
        <p className="text-muted mb-8">A confirmation will be sent to {form.email}. We look forward to welcoming you!</p>
        <button onClick={() => setSent(false)} className="btn-premium px-8 py-4 rounded-full font-semibold">Make Another Reservation</button>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-8">
      <h2 className="font-serif text-3xl font-bold text-heading mb-8 text-center">Book Your Table</h2>
      <form onSubmit={submit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-semibold mb-2">Full Name *</label><input type="text" className="form-input" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
          <div><label className="block text-sm font-semibold mb-2">Phone *</label><input type="tel" className="form-input" required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
          <div><label className="block text-sm font-semibold mb-2">Email *</label><input type="email" className="form-input" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
          <div><label className="block text-sm font-semibold mb-2">Number of Guests *</label>
            <select className="form-input" required value={form.guests} onChange={e=>setForm({...form,guests:e.target.value})}>
              {[1,2,3,4,5,6,7,8,9,10].map(n=><option key={n} value={n}>{n} {n===1?'Guest':'Guests'}</option>)}
              <option value="11+">11+ Guests (Group)</option>
            </select>
          </div>
          <div><label className="block text-sm font-semibold mb-2">Date *</label><input type="date" className="form-input" required min={today} value={form.date} onChange={e=>setForm({...form,date:e.target.value})} /></div>
          <div><label className="block text-sm font-semibold mb-2">Time *</label>
            <select className="form-input" required value={form.time} onChange={e=>setForm({...form,time:e.target.value})}>
              <option value="">Select time</option>
              {['12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM','10:00 PM'].map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div><label className="block text-sm font-semibold mb-2">Occasion</label>
          <select className="form-input" value={form.occasion} onChange={e=>setForm({...form,occasion:e.target.value})}>
            {['','Birthday','Anniversary','Business Dinner','Romantic Dinner','Family Gathering','Other'].map(o=><option key={o} value={o}>{o||'Select Occasion (Optional)'}</option>)}
          </select>
        </div>
        <div><label className="block text-sm font-semibold mb-2">Seating Preference</label>
          <select className="form-input" value={form.seating} onChange={e=>setForm({...form,seating:e.target.value})}>
            {['No Preference','Window Seat','Private Room','Bar Area','Outdoor Terrace'].map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div><label className="block text-sm font-semibold mb-2">Special Requests</label><textarea className="form-input" rows="3" placeholder="Dietary requirements, allergies, etc." value={form.requests} onChange={e=>setForm({...form,requests:e.target.value})}></textarea></div>
        <button type="submit" disabled={loading} className="btn-premium w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-70">
          {loading ? <><i className="fas fa-spinner animate-spin"></i> Processing...</> : <><i className="fas fa-calendar-check"></i> Confirm Reservation</>}
        </button>
      </form>
    </div>
  );
}
