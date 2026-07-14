import Link from 'next/link';
import { getDb } from '@/lib/mongodb';
export const metadata = { title: 'Menu — The Mother Restaurant', description: 'Browse our full menu of Emirati, Lebanese, and international dishes.' };

async function getMenu() {
  try { const db = await getDb(); return await db.collection('menu_items').find({}).sort({ category:1, createdAt:-1 }).toArray(); }
  catch { return []; }
}

export default async function MenuPage() {
  const items = await getMenu();
  const categories = ['All', ...new Set(items.map(i => i.category))];

  return (
    <>
      <div className="pt-20 min-h-[50vh] flex items-center" style={{background:'linear-gradient(135deg,#2d2422 0%,#4a3530 50%,#2d2422 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <p className="text-brand-300 tracking-[.3em] text-sm mb-4 font-sc">// OUR MENU //</p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6">Our <span style={{color:'#d98f7c'}}>Menu</span></h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto">{items.length} dishes crafted with a mother&apos;s love.</p>
        </div>
      </div>
      <section className="py-24 section-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.filter(c => c !== 'All').map(cat => (
            <div key={cat} className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="font-serif text-3xl font-bold text-heading">{cat}</h2>
                <div className="flex-1 h-px bg-brand-600/20"></div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.filter(i => i.category === cat).map(item => (
                  <Link key={item._id.toString()} href={`/menu/${item._id}`} className="dish-card group">
                    <div className="relative overflow-hidden aspect-square">
                      {item.image && <img src={item.image} className="dish-img w-full h-full object-cover" alt={item.name} />}
                      {item.badge && <div className="absolute top-3 right-3 bg-brand-600 text-white px-2.5 py-0.5 rounded-full text-xs font-bold">{item.badge}</div>}
                      {item.status === 'out' && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="text-white font-bold">Out of Stock</span></div>}
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif font-bold text-heading text-base mb-1">{item.name}</h3>
                      <p className="text-muted text-xs mb-3 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-brand-600 font-bold font-serif">AED {item.price}</span>
                        {item.prepTime && <span className="text-muted text-xs"><i className="far fa-clock mr-1"></i>{item.prepTime} min</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
