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

async function getReviews(itemId) {
  try {
    const db = await getDb();
    return await db.collection('reviews')
      .find({ menuItemId: itemId, status: 'approved' })
      .sort({ createdAt: -1 })
      .toArray();
  } catch { return []; }
}

async function getRelated(item) {
  try {
    const db = await getDb();
    return await db.collection('menu_items')
      .find({ category: item.category, _id: { $ne: item._id } })
      .limit(3)
      .toArray();
  } catch { return []; }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const item = await getItem(id);
  return { title: item ? `${item.name} — The Mother Restaurant` : 'Menu Item' };
}

export default async function MenuDetailPage({ params }) {
  const { id } = await params;
  const item = await getItem(id);
  if (!item) notFound();
  const [reviews, related] = await Promise.all([
    getReviews(id),
    getRelated(item),
  ]);
  const avgRating = reviews.length
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : null;

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

              {avgRating && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(n => (
                      <i key={n} className={`fas fa-star text-sm ${n <= Math.round(avgRating) ? 'text-brand-600' : 'text-gray-300'}`}></i>
                    ))}
                  </div>
                  <span className="text-muted text-sm">{avgRating} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                </div>
              )}

              <p className="text-muted text-lg mb-8 leading-relaxed">{item.description}</p>
              <div className="flex items-center gap-8 mb-8">
                <div><div className="font-serif text-4xl font-bold text-brand-600">AED {item.price}</div><div className="text-sm text-muted">Per serving</div></div>
                {item.prepTime && <div><div className="font-serif text-2xl font-bold text-heading">{item.prepTime} min</div><div className="text-sm text-muted">Prep time</div></div>}
              </div>

              <div className="space-y-6 mb-8">
                {Array.isArray(item.ingredients) && item.ingredients.length > 0 && (
                  <div>
                    <h3 className="font-serif text-xl font-bold mb-3 text-brand-600">Ingredients</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.ingredients.map(ing => (
                        <span key={ing} className="px-3 py-1 bg-brand-600/10 rounded-full text-sm text-body">{ing}</span>
                      ))}
                    </div>
                  </div>
                )}

                {Array.isArray(item.allergens) && item.allergens.length > 0 && (
                  <div>
                    <h3 className="font-serif text-xl font-bold mb-3 text-brand-600">Allergens</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.allergens.map(a => (
                        <span key={a} className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-sm">{a}</span>
                      ))}
                    </div>
                  </div>
                )}

                {item.nutrition && (item.nutrition.calories || item.nutrition.protein || item.nutrition.fat || item.nutrition.carbs) && (
                  <div>
                    <h3 className="font-serif text-xl font-bold mb-3 text-brand-600">Nutrition</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center"><div className="font-bold text-lg text-heading">{item.nutrition.calories || '-'}</div><div className="text-xs text-muted">Calories</div></div>
                      <div className="text-center"><div className="font-bold text-lg text-heading">{item.nutrition.protein ? `${item.nutrition.protein}g` : '-'}</div><div className="text-xs text-muted">Protein</div></div>
                      <div className="text-center"><div className="font-bold text-lg text-heading">{item.nutrition.fat ? `${item.nutrition.fat}g` : '-'}</div><div className="text-xs text-muted">Fat</div></div>
                      <div className="text-center"><div className="font-bold text-lg text-heading">{item.nutrition.carbs ? `${item.nutrition.carbs}g` : '-'}</div><div className="text-xs text-muted">Carbs</div></div>
                    </div>
                  </div>
                )}

                {item.pairingSuggestion && (
                  <div>
                    <h3 className="font-serif text-xl font-bold mb-3 text-brand-600">Pairing Suggestions</h3>
                    <p className="text-body">{item.pairingSuggestion}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/reservation" className="btn-premium px-8 py-4 rounded-full font-semibold inline-flex items-center gap-2">
                  <i className="fas fa-calendar-alt"></i> Reserve & Try
                </Link>
                <Link href="/menu" className="view-all-btn"><span>View Full Menu</span></Link>
              </div>
            </div>
          </div>

          {reviews.length > 0 && (
            <div className="mt-24">
              <h2 className="font-serif text-3xl font-bold mb-8 text-heading">Customer Reviews</h2>
              <div className="space-y-6">
                {reviews.map(r => (
                  <div key={r._id.toString()} className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center font-bold text-white">
                        {r.customerName?.[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-heading">{r.customerName}</div>
                        <div className="flex gap-1 text-xs">
                          {[...Array(r.rating)].map((_, i) => <i key={i} className="fas fa-star text-brand-600"></i>)}
                        </div>
                      </div>
                    </div>
                    <p className="text-body">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {related.length > 0 && (
            <div className="mt-24">
              <h2 className="font-serif text-3xl font-bold mb-8 text-heading">Related Dishes</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {related.map(r => (
                  <Link key={r._id.toString()} href={`/menu/${r._id}`} className="menu-card group block">
                    <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[4/3]">
                      {r.image && <img src={r.image} className="menu-img w-full h-full object-cover" alt={r.name} />}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-heading">{r.name}</h3>
                    <p className="text-brand-600 font-bold">AED {r.price}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
