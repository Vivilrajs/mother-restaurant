import Link from 'next/link';
export const metadata = { title: 'Our Story — The Mother Restaurant', description: "The full story of how Hessa Al-Rashid's kitchen became the UAE's most beloved restaurant." };

export default function StoryPage() {
  return (
    <>
      <div className="pt-20 min-h-[50vh] flex items-center" style={{background:'linear-gradient(135deg,#2d2422 0%,#4a3530 50%,#2d2422 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <p className="text-brand-300 tracking-[.3em] text-sm mb-4 font-sc">// EST. 1998 //</p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6">Our <span style={{color:'#d98f7c'}}>Story</span></h1>
        </div>
      </div>
      <section className="py-24 section-warm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {[
              {year:'1998',title:"A Mother's Kitchen",text:"Hessa Al-Rashid began cooking for her neighbors in Deira, Dubai. Word spread quickly. What started as weekend meals for a handful of families grew into something much larger — a community gathering place where love was the main ingredient.",img:'https://image.qwenlm.ai/public_source/0988f4f3-c95a-4b8e-8585-3575d69c4c4f/1b0c75629-7e42-4904-9acc-b7da012e0f36.png'},
              {year:'2005',title:'A Restaurant is Born',text:"Encouraged by her family and community, Hessa opened the doors of The Mother Restaurant in Deira. The menu was her personal recipe book — Emirati classics, Lebanese favorites, and international fine dining, all prepared with her signature touch.",img:'https://image.qwenlm.ai/public_source/0988f4f3-c95a-4b8e-8585-3575d69c4c4f/12a52d6a9-5bfb-4542-9f8e-dad7ae88b00b.png'},
              {year:'2015',title:'A Legacy Continues',text:"Hessa's daughter, Chef Fatima, trained at Le Cordon Bleu in Paris and returned to Dubai to carry the torch. She elevated the menu while preserving every cherished original recipe. The Mother Restaurant expanded to Jumeirah, then Abu Dhabi, Sharjah, and JLT.",img:'https://image.qwenlm.ai/public_source/0988f4f3-c95a-4b8e-8585-3575d69c4c4f/11d53ef46-1879-4b9a-8034-d9bf6acd03cb.png'},
              {year:'2025',title:'A Living Legend',text:"Today, The Mother Restaurant is a UAE institution — five branches, multiple awards, and over 50,000 families served. Yet our mission remains unchanged: to cook with love, and to make every guest feel like they're eating at their mother's table.",img:'https://image.qwenlm.ai/public_source/0988f4f3-c95a-4b8e-8585-3575d69c4c4f/14b81e7b6-372b-4e30-9817-1e3ccd928685.png'},
            ].map(({year,title,text,img},i) => (
              <div key={year} className={`grid md:grid-cols-2 gap-12 items-center ${i%2===1 ? 'md:[&>div:last-child]:order-first' : ''}`}>
                <div>
                  <div className="inline-block bg-brand-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">{year}</div>
                  <h2 className="font-serif text-3xl font-bold mb-4 text-heading">{title}</h2>
                  <p className="text-muted leading-relaxed">{text}</p>
                </div>
                <div><img src={img} className="rounded-2xl w-full aspect-square object-cover shadow-xl" alt={title} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
