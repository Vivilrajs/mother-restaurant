import Link from 'next/link';
export const metadata = { title: 'About Us — The Mother Restaurant', description: 'Learn about the history, values, and team behind The Mother Restaurant.' };

export default function AboutPage() {
  return (
    <>
      <div className="pt-20 relative overflow-hidden min-h-[60vh] flex items-center" style={{background:'linear-gradient(135deg,#2d2422 0%,#4a3530 50%,#2d2422 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <p className="text-brand-300 tracking-[.3em] text-sm mb-4 font-sc">// OUR STORY //</p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6">About <span style={{color:'#d98f7c'}}>Us</span></h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto">A quarter century of love on a plate, founded by Hessa Al-Rashid in Dubai in 1998.</p>
        </div>
      </div>

      <section className="py-24 section-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-brand-600 tracking-[.3em] text-sm mb-4 font-sc">// WHO WE ARE //</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-heading">A <span className="text-gradient">Family</span> Legacy</h2>
            <p className="text-muted mb-4 leading-relaxed">Founded in 1998 by Hessa Al-Rashid in the neighborhood of Deira, Dubai, The Mother Restaurant started as a small family kitchen. What began as cooking for neighbors grew into a celebrated dining institution across the UAE.</p>
            <p className="text-muted mb-6 leading-relaxed">Today, we operate five branches across the Emirates, each maintaining the warmth and authenticity of that original kitchen — with the love of a mother in every dish.</p>
            <div className="grid grid-cols-3 gap-6">
              {[['1998','Founded'],['5','Branches'],['50K+','Families Served']].map(([n,l]) => (
                <div key={l}><div className="font-serif text-3xl font-bold text-brand-600">{n}</div><div className="text-sm text-muted">{l}</div></div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src="https://image.qwenlm.ai/public_source/0988f4f3-c95a-4b8e-8585-3575d69c4c4f/1b0c75629-7e42-4904-9acc-b7da012e0f36.png" className="rounded-2xl w-full aspect-square object-cover" alt="Kitchen" />
          </div>
        </div>
      </section>

      <section className="py-24 section-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[['1998','Founded in Dubai'],['2010','UAE Excellence Award'],['2018','Abu Dhabi Branch'],['2024',"Gulf's #8"]].map(([n,l]) => (
              <div key={n} className="border-l-2 border-brand-600 pl-4">
                <div className="font-serif text-3xl font-bold text-brand-600">{n}</div>
                <div className="text-sm text-muted">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 section-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
          <div className="glass-card p-10 rounded-2xl">
            <i className="fas fa-eye text-brand-600 text-3xl mb-6"></i>
            <h3 className="font-serif text-2xl font-bold mb-4 text-heading">Our Vision</h3>
            <p className="text-muted">To be the UAE&apos;s most beloved family dining destination, where every meal feels like home and every guest becomes family.</p>
          </div>
          <div className="glass-card p-10 rounded-2xl">
            <i className="fas fa-heart text-brand-600 text-3xl mb-6"></i>
            <h3 className="font-serif text-2xl font-bold mb-4 text-heading">Our Mission</h3>
            <p className="text-muted">To preserve and share the warmth of mother&apos;s cooking through extraordinary culinary experiences rooted in love and tradition.</p>
          </div>
        </div>
      </section>

      <section className="py-24 section-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-heading">Our <span className="text-gradient">Values</span></h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {icon:'fa-heart',title:'Love',text:'Every dish is a labor of love, prepared as a mother would for her family.'},
              {icon:'fa-seedling',title:'Quality',text:'Only the finest ingredients — sourced locally and from around the world.'},
              {icon:'fa-users',title:'Family',text:'Our guests are family. We treat every visitor with warmth and care.'},
              {icon:'fa-star',title:'Excellence',text:'We strive for perfection in every dish, every service, every moment.'},
            ].map(({icon,title,text}) => (
              <div key={title} className="text-center p-8 glass-card rounded-2xl">
                <div className="w-16 h-16 rounded-full bg-brand-600/10 flex items-center justify-center mx-auto mb-4">
                  <i className={`fas ${icon} text-brand-600 text-2xl`}></i>
                </div>
                <h3 className="font-serif text-xl font-bold mb-3 text-heading">{title}</h3>
                <p className="text-muted text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 section-warm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-heading mb-6">Ready to <span className="text-gradient">Experience</span> the Love?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/reservation" className="btn-premium px-8 py-4 rounded-full font-semibold inline-flex items-center gap-2">Reserve a Table</Link>
            <Link href="/menu" className="view-all-btn"><span>View Our Menu</span></Link>
          </div>
        </div>
      </section>
    </>
  );
}
