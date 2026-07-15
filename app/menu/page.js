import { getDb } from '@/lib/mongodb';
import MenuBrowser from '@/components/menu/MenuBrowser';
export const metadata = { title: 'Menu — The Mother Restaurant', description: 'Browse our full menu of Emirati, Lebanese, and international dishes.' };

async function getMenu() {
  try { const db = await getDb(); return await db.collection('menu_items').find({}).sort({ category:1, createdAt:-1 }).toArray(); }
  catch { return []; }
}

export default async function MenuPage() {
  const raw = await getMenu();
  const items = raw.map(item => ({ ...item, _id: item._id.toString() }));
  const categories = [...new Set(items.map(i => i.category))];

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
          <MenuBrowser items={items} categories={categories} />
        </div>
      </section>
    </>
  );
}
