import { getDb } from '@/lib/mongodb';
import FaqAccordion from '@/components/faqs/FaqAccordion';
export const metadata = { title: 'FAQs — The Mother Restaurant' };

async function getFaqs() {
  try {
    const db = await getDb();
    const items = await db.collection('faqs').find({}).sort({ createdAt: 1 }).toArray();
    return items.map(i => ({ q: i.question, a: i.answer }));
  } catch { return []; }
}

export default async function FaqsPage() {
  const faqs = await getFaqs();

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto section-warm">
      <div className="text-center mb-16">
        <p className="text-brand-600 tracking-[.3em] text-sm mb-4 font-sc">// FAQS //</p>
        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-heading">Frequently <span className="text-gradient">Asked</span></h1>
      </div>
      {faqs.length === 0 ? (
        <div className="text-center py-20 text-muted">No FAQs published yet.</div>
      ) : (
        <FaqAccordion items={faqs} />
      )}
    </div>
  );
}
