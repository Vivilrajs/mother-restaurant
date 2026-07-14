import { getDb } from '@/lib/mongodb';
import TestimonialSlider from '@/components/home/TestimonialSlider';
export const metadata = { title: 'Reviews & Testimonials — The Mother Restaurant' };

async function getReviews() {
  try {
    const db = await getDb();
    const items = await db.collection('reviews').find({ status:'approved' }).sort({ createdAt:-1 }).toArray();
    return items.map(item => ({ ...item, _id: item._id.toString() }));
  }
  catch { return []; }
}

export default async function TestimonialsPage() {
  const reviews = await getReviews();
  return (
    <>
      <div className="pt-20 min-h-[50vh] flex items-center" style={{background:'linear-gradient(135deg,#2d2422 0%,#4a3530 50%,#2d2422 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-4">What Our <span style={{color:'#d98f7c'}}>Guests</span> Say</h1>
        </div>
      </div>
      <section className="py-24 section-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16"><TestimonialSlider reviews={reviews} /></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {reviews.map(r => (
              <div key={r._id.toString()} className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center font-serif font-bold text-white text-xl">
                    {r.customerName?.[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-heading">{r.customerName}</div>
                    {r.role && <div className="text-xs text-muted">{r.role}</div>}
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(r.rating||5)].map((_,i) => <i key={i} className="fas fa-star text-brand-600 text-sm"></i>)}
                </div>
                <p className="text-muted text-sm leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                {r.source && <p className="text-xs text-brand-600 mt-3">via {r.source}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
