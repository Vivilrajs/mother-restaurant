'use client';
import { useState } from 'react';
export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' });
  const submit = async (e) => {
    e.preventDefault();
    await new Promise(r => setTimeout(r, 800));
    setSent(true);
  };
  return (
    <>
      <div className="pt-20 min-h-[50vh] flex items-center" style={{background:'linear-gradient(135deg,#2d2422 0%,#4a3530 50%,#2d2422 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-4">Contact <span style={{color:'#d98f7c'}}>Us</span></h1>
          <p className="text-white/80 text-xl">We&apos;d love to hear from you</p>
        </div>
      </div>
      <section className="py-24 section-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-12">
          <div className="space-y-6">
            {[{icon:'fa-map-marker-alt',title:'Address',text:'Jumeirah Beach Road, Dubai, UAE'},{icon:'fa-phone',title:'Phone',text:'+971 4 400 0000'},{icon:'fa-envelope',title:'Email',text:'hello@themotherrestaurant.ae'},{icon:'fa-clock',title:'Hours',text:'Mon–Fri: 7AM–11PM\nSat–Sun: 8AM–12AM'}].map(({icon,title,text}) => (
              <div key={title} className="glass-card rounded-2xl p-6 flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-brand-600/10 flex items-center justify-center flex-shrink-0">
                  <i className={`fas ${icon} text-brand-600`}></i>
                </div>
                <div><div className="font-semibold text-heading mb-1">{title}</div><div className="text-muted text-sm whitespace-pre-line">{text}</div></div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-2 glass-card rounded-3xl p-8">
            {sent ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"><i className="fas fa-check text-green-600 text-3xl"></i></div>
                <h3 className="font-serif text-3xl font-bold text-heading mb-2">Message Sent!</h3>
                <p className="text-muted">We&apos;ll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="btn-premium px-8 py-3 rounded-full font-semibold mt-6">Send Another</button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-6">
                <h2 className="font-serif text-2xl font-bold text-heading mb-6">Send a Message</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold mb-2">Full Name</label><input type="text" className="form-input" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
                  <div><label className="block text-sm font-semibold mb-2">Email</label><input type="email" className="form-input" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
                  <div><label className="block text-sm font-semibold mb-2">Phone</label><input type="tel" className="form-input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
                  <div><label className="block text-sm font-semibold mb-2">Subject</label><input type="text" className="form-input" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} /></div>
                </div>
                <div><label className="block text-sm font-semibold mb-2">Message</label><textarea className="form-input" rows="5" required value={form.message} onChange={e=>setForm({...form,message:e.target.value})}></textarea></div>
                <button type="submit" className="btn-premium w-full py-4 rounded-xl font-semibold text-lg">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
