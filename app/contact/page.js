import { getDb } from '@/lib/mongodb';
import ContactForm from '@/components/contact/ContactForm';
export const metadata = { title: 'Contact Us — The Mother Restaurant' };

async function getBranches() {
  try { const db = await getDb(); return await db.collection('branches').find({}).sort({ createdAt: 1 }).toArray(); }
  catch { return []; }
}

async function getSettings() {
  try { const db = await getDb(); return await db.collection('settings').findOne({ _id: 'global' }) || {}; }
  catch { return {}; }
}

export default async function ContactPage() {
  const [branches, settings] = await Promise.all([getBranches(), getSettings()]);
  const social = settings.social || {};
  const socialLinks = [
    { key: 'instagram', icon: 'fa-instagram' },
    { key: 'facebook', icon: 'fa-facebook-f' },
    { key: 'twitter', icon: 'fa-twitter' },
    { key: 'tiktok', icon: 'fa-tiktok' },
  ].filter(s => social[s.key]);

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
            {branches.length === 0 ? (
              <div className="glass-card rounded-2xl p-6 text-muted text-sm">Branch information coming soon.</div>
            ) : branches.map(branch => (
              <div key={branch._id.toString()} className="glass-card rounded-2xl p-6 space-y-4">
                <div className="font-serif text-xl font-bold text-heading">{branch.name}</div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-brand-600/10 flex items-center justify-center flex-shrink-0"><i className="fas fa-map-marker-alt text-brand-600"></i></div>
                  <div className="text-muted text-sm">{branch.location}</div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-brand-600/10 flex items-center justify-center flex-shrink-0"><i className="fas fa-phone text-brand-600"></i></div>
                  <div className="text-muted text-sm">{branch.phone}</div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-brand-600/10 flex items-center justify-center flex-shrink-0"><i className="fas fa-envelope text-brand-600"></i></div>
                  <div className="text-muted text-sm">{branch.email}</div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-brand-600/10 flex items-center justify-center flex-shrink-0"><i className="fas fa-clock text-brand-600"></i></div>
                  <div className="text-muted text-sm whitespace-pre-line">{branch.hours}</div>
                </div>
              </div>
            ))}

            {socialLinks.length > 0 && (
              <div className="flex gap-3 pt-2">
                {socialLinks.map(s => (
                  <a key={s.key} href={social[s.key]} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brand-600/10 flex items-center justify-center hover:bg-brand-600 hover:text-white transition text-brand-600">
                    <i className={`fab ${s.icon}`}></i>
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="lg:col-span-2 glass-card rounded-3xl p-8">
            <ContactForm />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 rounded-2xl overflow-hidden h-96">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1785107071884!2d55.2707!3d25.2048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDEyJzE3LjMiTiA1NcKwMTYnMTQuNSJF!5e0!3m2!1sen!2sae!4v1234567890"
            className="w-full h-full border-0"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </>
  );
}
