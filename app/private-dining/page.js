import Link from 'next/link';
export const metadata = { title: 'Private Dining — The Mother Restaurant' };

export default function PrivateDiningPage() {
  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto section-warm">
      <div className="text-center mb-16">
        <p className="text-brand-600 tracking-[.3em] text-sm mb-4 font-sc">// PRIVATE DINING //</p>
        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-heading">Exclusive <span className="text-gradient">Experiences</span></h1>
      </div>
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-brand-400/20 to-brand-800/20 flex items-center justify-center">
          <i className="fas fa-utensils text-6xl text-brand-400"></i>
        </div>
        <div>
          <h2 className="font-serif text-3xl font-bold mb-4 text-heading">The Family Room</h2>
          <p className="text-muted mb-6">Our most exclusive dining space, accommodating up to 12 guests. Perfect for intimate family celebrations, business dinners, or special occasions.</p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-3 text-body"><i className="fas fa-check text-brand-600"></i>Personal chef service</li>
            <li className="flex items-center gap-3 text-body"><i className="fas fa-check text-brand-600"></i>Custom menu creation</li>
            <li className="flex items-center gap-3 text-body"><i className="fas fa-check text-brand-600"></i>Dedicated sommelier</li>
            <li className="flex items-center gap-3 text-body"><i className="fas fa-check text-brand-600"></i>Private entrance</li>
          </ul>
          <Link href="/reservation" className="btn-premium px-8 py-4 rounded-full font-semibold inline-flex items-center gap-2">Book Private Dining</Link>
        </div>
      </div>
    </div>
  );
}
