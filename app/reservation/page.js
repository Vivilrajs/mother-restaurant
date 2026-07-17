import { getDb } from '@/lib/mongodb';
import ReservationForm from '@/components/reservation/ReservationForm';
export const metadata = { title: 'Reserve a Table — The Mother Restaurant' };

async function getContactInfo() {
  try {
    const db = await getDb();
    const [settings, branch] = await Promise.all([
      db.collection('settings').findOne({ _id: 'global' }),
      db.collection('branches').findOne({}),
    ]);
    return {
      phone: branch?.phone || '',
      email: settings?.email || '',
    };
  } catch { return { phone: '', email: '' }; }
}

async function getBranches() {
  try {
    const db = await getDb();
    const raw = await db.collection('branches').find({}).sort({ createdAt: 1 }).toArray();
    return raw.map(b => ({ _id: b._id.toString(), name: b.name }));
  } catch { return []; }
}

export default async function ReservationPage() {
  const { phone, email } = await getContactInfo();
  const branches = await getBranches();

  return (
    <>
      <div className="pt-20 min-h-[50vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0"><img src="https://image.qwenlm.ai/public_source/0988f4f3-c95a-4b8e-8585-3575d69c4c4f/12a52d6a9-5bfb-4542-9f8e-dad7ae88b00b.png" className="w-full h-full object-cover" alt="" /><div className="absolute inset-0 bg-black/70"></div></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-4">Reserve a <span style={{color:'#d98f7c'}}>Table</span></h1>
          <p className="text-white/80 text-xl">Experience the warmth of a mother&apos;s love</p>
        </div>
      </div>
      <section className="py-24 section-warm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ReservationForm branches={branches} />

          {(phone || email) && (
            <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
              {phone && (
                <div className="glass-card p-6 rounded-2xl">
                  <i className="fas fa-phone text-brand-600 text-2xl mb-3"></i>
                  <h4 className="font-semibold mb-1 text-heading">Call Us</h4>
                  <p className="text-muted text-sm">{phone}</p>
                </div>
              )}
              {email && (
                <div className="glass-card p-6 rounded-2xl">
                  <i className="fas fa-envelope text-brand-600 text-2xl mb-3"></i>
                  <h4 className="font-semibold mb-1 text-heading">Email</h4>
                  <p className="text-muted text-sm">{email}</p>
                </div>
              )}
              <a href="https://wa.me/97144000000" target="_blank" rel="noopener noreferrer" className="glass-card p-6 rounded-2xl hover:-translate-y-1 transition">
                <i className="fab fa-whatsapp text-brand-600 text-2xl mb-3"></i>
                <h4 className="font-semibold mb-1 text-heading">WhatsApp</h4>
                <p className="text-muted text-sm">Chat with us</p>
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
