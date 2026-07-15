import Link from 'next/link';
import CateringQuoteForm from '@/components/catering/CateringQuoteForm';
export const metadata = { title: 'Catering Services — The Mother Restaurant' };

const eventTypes = [
  { icon: 'fa-ring', title: 'Wedding Catering', text: 'Make your special day unforgettable with bespoke wedding menus.' },
  { icon: 'fa-briefcase', title: 'Corporate Events', text: 'Impress clients and team with world-class catering.' },
  { icon: 'fa-birthday-cake', title: 'Family Parties', text: 'Celebrate in style with custom menus and desserts.' },
];
const tiers = [
  { name:'Classic', price:'AED 150', unit:'per person',tag:'Most Popular', min:'30',features:['3-course set menu','Service staff included','Linen and tableware','Canapes & drinks reception','Dietary options available'] },
  { name:'Premium', price:'AED 250', unit:'per person',tag:'Best Value', min:'50',features:['5-course tasting menu','Dedicated event manager','Custom menu design','Premium bar & mocktails','Live cooking station','Decor coordination'] },
  { name:'Grand', price:'Custom',unit:'Quote on request',tag:'For 500+', min:'200',features:['Fully bespoke menu','Multiple cuisine stations','Full event production','Private chef team','Valet & concierge','Day-of coordination'] },
];
export default function CateringPage() {
  return (
    <>
      <div className="pt-20 min-h-[50vh] flex items-center" style={{background:'linear-gradient(135deg,#2d2422 0%,#4a3530 50%,#2d2422 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-4">Catering <span style={{color:'#d98f7c'}}>Services</span></h1>
          <p className="text-white/80 text-xl">Elevate every celebration with a mother&apos;s love</p>
        </div>
      </div>
      <section className="py-24 section-warm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-heading mb-4">Catering <span className="text-gradient">Packages</span></h2>
            <p className="text-muted max-w-2xl mx-auto">From intimate family gatherings to grand corporate events, we bring the warmth of The Mother Restaurant to any venue.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {eventTypes.map(({ icon, title, text }) => (
              <div key={title} className="glass-card rounded-2xl p-8 text-center">
                <div className="w-14 h-14 mx-auto bg-brand-600/10 rounded-xl flex items-center justify-center mb-6">
                  <i className={`fas ${icon} text-brand-600 text-2xl`}></i>
                </div>
                <h3 className="font-serif text-xl font-bold mb-2 text-heading">{title}</h3>
                <p className="text-muted text-sm">{text}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {tiers.map((t,i) => (
              <div key={t.name} className={`rounded-3xl p-8 ${i===1?'bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-2xl scale-105':'glass-card'}`}>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${i===1?'bg-white/20 text-white':'bg-brand-50 text-brand-700'}`}>{t.tag}</div>
                <h3 className={`font-serif text-3xl font-bold mb-2 ${i===1?'text-white':'text-heading'}`}>{t.name}</h3>
                <div className={`text-4xl font-serif font-bold mb-1 ${i===1?'text-white':'text-brand-600'}`}>{t.price}</div>
                <div className={`text-sm mb-2 ${i===1?'text-white/80':'text-muted'}`}>{t.unit}</div>
                <div className={`text-sm mb-6 font-semibold ${i===1?'text-white/90':'text-muted'}`}>Min. {t.min} guests</div>
                <div className="space-y-3 mb-8">
                  {t.features.map(f => (
                    <div key={f} className={`flex items-center gap-2 text-sm ${i===1?'text-white/90':'text-muted'}`}>
                      <i className={`fas fa-check ${i===1?'text-white':'text-brand-600'}`}></i>{f}
                    </div>
                  ))}
                </div>
                <Link href="/contact" className={`w-full py-3 rounded-full font-semibold text-center block transition ${i===1?'bg-white text-brand-700 hover:bg-brand-50':'btn-premium'}`}>
                  Get a Quote
                </Link>
              </div>
            ))}
          </div>
          <div className="glass-card rounded-3xl p-8 md:p-12">
            <CateringQuoteForm />
          </div>
        </div>
      </section>
    </>
  );
}
