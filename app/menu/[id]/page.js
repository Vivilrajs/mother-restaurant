import Link from 'next/link';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { notFound } from 'next/navigation';

async function getItem(id) {
  try {
    const db = await getDb();
    return await db.collection('menu_items').findOne({ _id: new ObjectId(id) });
  } catch { return null; }
}

export async function generateMetadata({ params }) {
  const item = await getItem(params.id);
  return { title: item ? `${item.name} — The Mother Restaurant` : 'Menu Item' };
}

export default async function MenuDetailPage({ params }) {
  const item = await getItem(params.id);
  if (!item) notFound();

  return (
    <>
      <div className="pt-20 section-warm min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/menu" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-800 transition mb-8 font-semibold">
            <i className="fas fa-arrow-left"></i> Back to Menu
          </Link>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="relative rounded-3xl overflow-hidden aspect-square shadow-2xl">
              {item.image && <img src={item.image} className="w-full h-full object-cover" alt={item.name} />}
              {item.badge && <div className="absolute top-6 right-6 bg-brand-600 text-white px-4 py-2 rounded-full font-bold">{item.badge}</div>}
              {item.signature && (
                <div className="absolute bottom-6 left-6 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                  <i className="fas fa-star text-brand-300"></i> Signature Dish
                </div>
              )}
            </div>
            <div className="py-4">
              <p className="text-brand-600 text-sm mb-3 font-sc tracking-widest">{item.category?.toUpperCase()}</p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-heading">{item.name}</h1>
              <p className="text-muted text-lg mb-8 leading-relaxed">{item.description}</p>
              <div className="flex items-center gap-8 mb-8">
                <div><div className="font-serif text-4xl font-bold text-brand-600">AED {item.price}</div><div className="text-sm text-muted">Per serving</div></div>
                {item.prepTime && <div><div className="font-serif text-2xl font-bold text-heading">{item.prepTime} min</div><div className="text-sm text-muted">Prep time</div></div>}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/reservation" className="btn-premium px-8 py-4 rounded-full font-semibold inline-flex items-center gap-2">
                  <i className="fas fa-calendar-alt"></i> Reserve & Try
                </Link>
                <Link href="/menu" className="view-all-btn"><span>View Full Menu</span></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
