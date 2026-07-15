import { getDb } from '@/lib/mongodb';
export const metadata = { title: 'Our Chefs — The Mother Restaurant' };

async function getChefs() {
  try { const db = await getDb(); return await db.collection('chefs').find({}).sort({ createdAt: 1 }).toArray(); }
  catch { return []; }
}

async function getSignatureDishes() {
  try { const db = await getDb(); return await db.collection('menu_items').find({ signature: true }).limit(3).toArray(); }
  catch { return []; }
}

export default async function ChefPage() {
  const [chefs, signatureDishes] = await Promise.all([getChefs(), getSignatureDishes()]);
  const [headChef, ...team] = chefs;

  return (
    <>
      <div className="pt-20 min-h-[50vh] flex items-center" style={{background:'linear-gradient(135deg,#2d2422 0%,#4a3530 50%,#2d2422 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-4">Meet the <span style={{color:'#d98f7c'}}>Masters</span></h1>
          <p className="text-white/80 text-xl">The artists behind every masterpiece</p>
        </div>
      </div>

      {headChef && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto section-warm">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div>
              {headChef.image ? (
                <img src={headChef.image} className="rounded-2xl w-full aspect-[3/4] object-cover" alt={headChef.name} />
              ) : (
                <div className="rounded-2xl w-full aspect-[3/4] bg-gradient-to-br from-brand-400/20 to-brand-800/20 flex items-center justify-center">
                  <i className="fas fa-user-tie text-8xl text-brand-400"></i>
                </div>
              )}
            </div>
            <div>
              <p className="text-brand-600 tracking-[.3em] text-sm mb-4 font-sc">// {headChef.title?.toUpperCase() || 'EXECUTIVE CHEF'} //</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-heading">{headChef.name}</h2>
              <p className="text-muted mb-6">{headChef.bio}</p>

              {Array.isArray(headChef.awards) && headChef.awards.length > 0 && (
                <div className="space-y-3 mb-8">
                  {headChef.awards.map((a, i) => (
                    <div key={i} className="flex items-center gap-3"><i className="fas fa-award text-brand-600"></i><span className="text-body">{a}</span></div>
                  ))}
                </div>
              )}

              {headChef.philosophy && (
                <>
                  <h3 className="font-serif text-2xl font-bold mb-4 text-heading">Cooking Philosophy</h3>
                  <p className="text-muted mb-6 italic">&ldquo;{headChef.philosophy}&rdquo;</p>
                </>
              )}

              {signatureDishes.length > 0 && (
                <>
                  <h3 className="font-serif text-2xl font-bold mb-4 text-heading">Signature Recipes</h3>
                  <div className="space-y-3">
                    {signatureDishes.map(d => (
                      <div key={d._id.toString()} className="glass-card p-4 rounded-xl flex justify-between items-center">
                        <span className="text-body">{d.name}</span>
                        <span className="text-brand-600 font-bold">AED {d.price}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {team.length > 0 && (
        <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto section-warm">
          <h2 className="font-serif text-3xl font-bold text-center mb-12 text-heading">Our <span className="text-gradient">Team</span></h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map(chef => (
              <div key={chef._id.toString()} className="glass-card rounded-3xl overflow-hidden hover:-translate-y-2 transition duration-300 group">
                <div className="relative aspect-[4/5] bg-gradient-to-br from-brand-100 to-brand-200 dark:from-[#2d2422] dark:to-[#1a1412]">
                  {chef.image ? <img src={chef.image} className="w-full h-full object-cover" alt={chef.name} /> : (
                    <div className="flex items-center justify-center h-full">
                      <i className="fas fa-user-tie text-8xl text-brand-400"></i>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-serif text-2xl font-bold text-white">{chef.name}</h3>
                    <p className="text-brand-300">{chef.title}</p>
                    {chef.experience && <p className="text-white/70 text-sm">{chef.experience}</p>}
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-4">{chef.bio}</p>
                  {Array.isArray(chef.awards) && chef.awards.length > 0 && (
                    <div className="space-y-1">
                      {chef.awards.slice(0,2).map((a,i) => <div key={i} className="flex items-center gap-2 text-sm"><i className="fas fa-award text-brand-600 text-xs"></i><span className="text-muted">{a}</span></div>)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
