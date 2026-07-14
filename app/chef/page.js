import { getDb } from '@/lib/mongodb';
import Link from 'next/link';
export const metadata = { title: 'Our Chefs — The Mother Restaurant' };

async function getChefs() {
  try { const db = await getDb(); return await db.collection('chefs').find({}).toArray(); }
  catch { return []; }
}

export default async function ChefPage() {
  const chefs = await getChefs();
  return (
    <>
      <div className="pt-20 min-h-[50vh] flex items-center" style={{background:'linear-gradient(135deg,#2d2422 0%,#4a3530 50%,#2d2422 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-4">Our <span style={{color:'#d98f7c'}}>Culinary Team</span></h1>
          <p className="text-white/80 text-xl">The artists behind every masterpiece</p>
        </div>
      </div>
      <section className="py-24 section-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {chefs.map(chef => (
              <div key={chef._id.toString()} className="glass-card rounded-3xl overflow-hidden hover:-translate-y-2 transition duration-300 group">
                <div className="relative aspect-[4/5] bg-gradient-to-br from-brand-100 to-brand-200 dark:from-[#2d2422] dark:to-[#1a1412]">
                  {chef.image ? <img src={chef.image} className="w-full h-full object-cover" alt={chef.name} /> : (
                    <div className="flex items-center justify-center h-full">
                      <i className="fas fa-user-tie text-8xl text-brand-400"></i>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-serif text-2xl font-bold text-white">{chef.name}</h3>
                    <p className="text-brand-300">{chef.title}</p>
                    {chef.experience && <p className="text-white/70 text-sm">{chef.experience}</p>}
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-4">{chef.bio}</p>
                  {chef.awards && (
                    <div className="space-y-1">
                      {chef.awards.slice(0,2).map((a,i) => <div key={i} className="flex items-center gap-2 text-sm"><i className="fas fa-award text-brand-600 text-xs"></i><span className="text-muted">{a}</span></div>)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
