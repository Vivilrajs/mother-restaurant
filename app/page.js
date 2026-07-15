export const dynamic = 'force-dynamic';

import Link from 'next/link';
import MenuTabsSection from '@/components/home/MenuTabsSection';
import TestimonialSlider from '@/components/home/TestimonialSlider';
import HeroSlider from '@/components/home/HeroSlider';
import { getDb } from '@/lib/mongodb';

const DEFAULT_AWARDS = [
  { _id: 'default-1', icon: 'fa-star', title: 'UAE Excellence', text: 'Best Family Restaurant 2024' },
  { _id: 'default-2', icon: 'fa-trophy', title: 'Dubai Food Festival', text: 'Outstanding Chef 2023' },
  { _id: 'default-3', icon: 'fa-medal', title: "Gulf's 50 Best", text: 'Ranked #8 in 2024' },
  { _id: 'default-4', icon: 'fa-certificate', title: 'HACCP Certified', text: 'Food Safety Excellence' },
];

async function getData() {
  try {
    const db = await getDb();
    const [signature, reviews, blog, gallery, chefs, awards, settings] = await Promise.all([
      db.collection('menu_items').find({ signature: true }).limit(3).toArray(),
      db.collection('reviews').find({ status: 'approved' }).sort({ createdAt: -1 }).toArray(),
      db.collection('blog_posts').find({ status: 'Published' }).sort({ createdAt: -1 }).limit(3).toArray(),
      db.collection('gallery').find({}).sort({ createdAt: -1 }).limit(6).toArray(),
      db.collection('chefs').find({}).sort({ createdAt: 1 }).limit(1).toArray(),
      db.collection('awards').find({}).sort({ createdAt: 1 }).toArray(),
      db.collection('settings').findOne({ _id: 'global' }),
    ]);
    const serialize = (arr) => arr.map(item => ({ ...item, _id: item._id.toString() }));
    return {
      signature: serialize(signature),
      reviews: serialize(reviews),
      blog: serialize(blog),
      gallery: serialize(gallery),
      headChef: serialize(chefs)[0] || null,
      awards: awards.length > 0 ? serialize(awards) : DEFAULT_AWARDS,
      settings: settings ? { ...settings, _id: settings._id.toString() } : null,
    };
  } catch (e) {
    console.error('Error in getData:', e);
    return { signature: [], reviews: [], blog: [], gallery: [], headChef: null, awards: DEFAULT_AWARDS, settings: null };
  }
}

export default async function HomePage() {
  const { signature, reviews, blog, gallery, headChef, awards, settings } = await getData();

  return (
    <>
      {/* Hero */}
      <section className="relative h-screen overflow-hidden bg-black">
        <div className="hero-glow-orb w-[400px] h-[400px] bg-brand-400/30 top-1/4 -left-20"></div>
        <HeroSlider slides={settings?.banner?.slides} />
        <div className="absolute inset-0 bg-black/50 z-[1]"></div>
        <div className="absolute inset-0 flex items-center z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
            <div className="max-w-2xl">
              <div className="inline-block bg-black/40 backdrop-blur-sm border border-white/10 px-4 py-1.5 rounded-full mb-6 shadow-lg">
                <p className="text-brand-300 tracking-[.2em] text-xs font-sc font-bold">★ HOME-STYLE FINE DINING ★</p>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-white [text-shadow:_0_4px_12px_rgb(0_0_0_/_0.8)]">
                {settings?.siteName || "The Mother Restaurant"}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/95 mb-8 max-w-md font-medium [text-shadow:_0_2px_8px_rgb(0_0_0_/_0.8)]">{settings?.tagline || "Love is Her Secret Ingredient"}</p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <Link href="/reservation" className="btn-premium px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base rounded-full font-semibold inline-flex items-center gap-2">
                  Book Your Table <i className="fas fa-arrow-right"></i>
                </Link>
                <Link href="/menu" className="btn-premium px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base rounded-full font-semibold inline-flex items-center gap-2">
                  Explore Menu <i className="fas fa-utensils"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-bar py-4 overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-content font-serif text-lg">
            {['★ HOME-STYLE DINING','★ MOTHER\'S RECIPES','★ FRESH INGREDIENTS','★ UAE\'S FINEST','★ WARM HOSPITALITY','★ FAMILY EXPERIENCE','★ HOME-STYLE DINING','★ MOTHER\'S RECIPES','★ FRESH INGREDIENTS','★ UAE\'S FINEST'].map((t,i) => (
              <span key={i} className="mx-8">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Signature Dishes */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 section-warm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-brand-600 tracking-[.3em] text-sm mb-4 font-sc">// SIGNATURE DISHES //</p>
            <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-heading">Our <span className="text-gradient">Culinary</span> Masterpieces</h2>
            <p className="text-muted max-w-2xl mx-auto">Each dish is crafted with a mother&apos;s love and the finest ingredients.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {signature.map((item) => (
              <div key={item._id.toString()} className="menu-card group">
                <Link href={`/menu/${item._id}`}>
                  <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[4/5]">
                    {item.image && <img src={item.image} className="menu-img w-full h-full object-cover" alt={item.name} />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    {item.badge && <div className="absolute top-4 right-4 bg-brand-600 text-white px-3 py-1 rounded-full text-xs font-bold">{item.badge}</div>}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-serif text-2xl font-bold mb-1 text-white">{item.name}</h3>
                      <p className="text-gray-200 text-sm">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-brand-600 font-serif text-2xl font-bold">AED {item.price}</span>
                    <span className="btn-premium px-4 py-2 rounded-full font-semibold text-xs inline-flex items-center gap-1">View Details <i className="fas fa-arrow-right"></i></span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/menu" className="btn-premium px-8 py-4 rounded-full font-semibold inline-flex items-center gap-2">
              <span>View Full Menu</span><i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome Story */}
      <section className="py-24 section-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="relative">
                <img src="https://image.qwenlm.ai/public_source/0988f4f3-c95a-4b8e-8585-3575d69c4c4f/12a52d6a9-5bfb-4542-9f8e-dad7ae88b00b.png" className="rounded-2xl w-full aspect-[4/5] object-cover" alt="Interior" />
                <div className="absolute -bottom-6 -right-6 bg-brand-600 text-white p-6 rounded-2xl hidden md:block">
                  <div className="font-serif text-4xl font-bold">25+</div>
                  <div className="text-sm font-semibold">Years of Love</div>
                </div>
              </div>
            </div>
            <div>
              <p className="text-brand-600 tracking-[.3em] text-sm mb-4 font-sc">// WELCOME //</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight text-heading">A Legacy of <span className="text-gradient">Mother&apos;s</span> Love</h2>
              <p className="text-muted mb-6 leading-relaxed">Founded in 1998 in the heart of Dubai, The Mother Restaurant has been redefining home-style fine dining in the UAE. Our commitment to love, passion for flavor, and dedication to creating unforgettable experiences have made us a destination for families from around the world.</p>
              <div className="grid grid-cols-3 gap-6 mb-8">
                {[['4.9','Rating'],['50K+','Happy Families'],['15','Awards']].map(([n,l]) => (
                  <div key={l}><div className="font-serif text-3xl font-bold text-brand-600">{n}</div><div className="text-sm text-muted">{l}</div></div>
                ))}
              </div>
              <Link href="/about" className="btn-premium px-8 py-4 rounded-full font-semibold inline-flex items-center gap-2">
                Discover Our Story <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 section-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-brand-600 tracking-[.3em] text-sm mb-4 font-sc">// WHY CHOOSE US //</p>
            <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-heading">The Mother <span className="text-gradient">Experience</span></h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {icon:'fa-award',title:'Award Winning',text:'Multiple UAE culinary awards and international recognition.',from:'from-brand-400',to:'to-brand-600'},
              {icon:'fa-leaf',title:'Fresh Ingredients',text:'Locally sourced from UAE farms and world\'s finest producers.',from:'from-brand-500',to:'to-brand-700'},
              {icon:'fa-user-tie',title:'Expert Chefs',text:'World-class culinary artists with decades of experience.',from:'from-brand-600',to:'to-brand-800'},
              {icon:'fa-heart',title:'Made with Love',text:'Every dish prepared with the warmth of a mother\'s touch.',from:'from-brand-700',to:'to-brand-900'},
            ].map(({icon,title,text,from,to}) => (
              <div key={title} className={`bg-gradient-to-br ${from} ${to} p-8 rounded-2xl shadow-xl hover:-translate-y-2 hover:shadow-2xl transition duration-300`}>
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 border border-white/20">
                  <i className={`fas ${icon} text-white text-2xl`}></i>
                </div>
                <h3 className="font-serif text-xl font-bold mb-3 text-white">{title}</h3>
                <p className="text-white/90 text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-24 section-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <p className="text-brand-600 tracking-[.3em] text-sm mb-4 font-sc">// THE EXPERIENCE //</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight text-heading">More Than Just a <span className="text-gradient">Meal</span></h2>
              <p className="text-muted mb-6">At The Mother Restaurant, dining is an act of love. Every detail — from the ambiance to the presentation — is carefully curated to make you feel at home.</p>
              <Link href="/reservation" className="btn-premium px-8 py-4 rounded-full font-semibold inline-flex items-center gap-2">
                Reserve Now <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              {gallery.slice(0, 4).map((img, i) => (
                <div key={img._id} className={`gallery-item rounded-2xl overflow-hidden ${i % 2 === 0 ? 'aspect-square' : 'aspect-[4/3]'} ${i >= 2 ? 'mt-8' : ''}`}>
                  <img src={img.url} className="w-full h-full object-cover" alt={img.alt || 'The Mother Restaurant'} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chef Introduction */}
      {headChef && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto section-warm">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-brand-600 tracking-[.3em] text-sm mb-4 font-sc">// MEET OUR CHEF //</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-heading"><span className="text-gradient">{headChef.name}</span></h2>
              <p className="text-muted mb-6 leading-relaxed">{headChef.bio}</p>
              <Link href="/chef" className="btn-premium px-8 py-4 rounded-full font-semibold inline-flex items-center gap-2">
                Meet the Team <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                {headChef.image ? (
                  <img src={headChef.image} className="rounded-2xl w-full aspect-[3/4] object-cover" alt={headChef.name} />
                ) : (
                  <div className="rounded-2xl w-full aspect-[3/4] bg-gradient-to-br from-brand-400/20 to-brand-800/20 flex items-center justify-center">
                    <i className="fas fa-user-tie text-6xl text-brand-400"></i>
                  </div>
                )}
                {headChef.experience && (
                  <div className="absolute -bottom-4 -left-4 bg-brand-600 text-white p-4 rounded-xl">
                    <div className="font-serif text-2xl font-bold">{headChef.experience}</div>
                    <div className="text-xs">Culinary Experience</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Menu Tabs */}
      <section className="py-24 section-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-brand-600 tracking-[.3em] text-sm mb-4 font-sc">// OUR MENU //</p>
            <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-heading">Explore Our <span className="text-gradient">Menu</span></h2>
            <p className="text-muted max-w-2xl mx-auto">From breakfast to dinner, discover dishes crafted with a mother&apos;s love.</p>
          </div>
          <MenuTabsSection />
          <div className="text-center mt-12">
            <Link href="/menu" className="btn-premium px-8 py-4 rounded-full font-semibold inline-flex items-center gap-2">
              <span>View All Menus</span><i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 section-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-brand-600 tracking-[.3em] text-sm mb-4 font-sc">// TESTIMONIALS //</p>
            <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-heading">What Our <span className="text-gradient">Families</span> Say</h2>
          </div>
          <TestimonialSlider reviews={reviews} />
        </div>
      </section>

      {/* Gallery Preview */}
      {gallery.length > 0 && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto section-warm">
          <div className="text-center mb-16">
            <p className="text-brand-600 tracking-[.3em] text-sm mb-4 font-sc">// GALLERY //</p>
            <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-heading">Visual <span className="text-gradient">Journey</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.slice(0, 4).map(img => (
              <div key={img._id} className="gallery-item rounded-2xl overflow-hidden aspect-square">
                <img src={img.url} className="w-full h-full object-cover" alt={img.alt || 'Gallery'} />
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/gallery" className="btn-premium px-8 py-4 rounded-full font-semibold inline-flex items-center gap-2">
              View Full Gallery <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </section>
      )}

      {/* Events & Catering */}
      <section className="py-24 section-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-brand-600 tracking-[.3em] text-sm mb-4 font-sc">// EVENTS & CATERING //</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight text-heading">Make Your Event <span className="text-gradient">Unforgettable</span></h2>
              <p className="text-muted mb-6">From intimate family gatherings to grand celebrations, our events team crafts bespoke experiences tailored to your vision.</p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: 'fa-ring', title: 'Wedding Catering', text: 'Elegant menus for your special day' },
                  { icon: 'fa-briefcase', title: 'Corporate Events', text: 'Impress your clients and team' },
                  { icon: 'fa-birthday-cake', title: 'Family Parties', text: 'Celebrations made memorable' },
                ].map(({ icon, title, text }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className={`fas ${icon} text-brand-600`}></i>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 text-heading">{title}</h4>
                      <p className="text-muted text-sm">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/catering" className="btn-premium px-8 py-4 rounded-full font-semibold inline-flex items-center gap-2">
                Plan Your Event <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-gradient-to-br from-brand-400/20 to-brand-800/20 flex items-center justify-center">
              <i className="fas fa-glass-cheers text-6xl text-brand-400"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto section-warm">
        <div className="text-center mb-16">
          <p className="text-brand-600 tracking-[.3em] text-sm mb-4 font-sc">// RECOGNITION //</p>
          <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-heading">Awards & <span className="text-gradient">Certifications</span></h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {awards.map((award, index) => {
            const GRADIENTS = [
              { from: 'from-brand-400', to: 'to-brand-600' },
              { from: 'from-brand-500', to: 'to-brand-700' },
              { from: 'from-brand-600', to: 'to-brand-800' },
              { from: 'from-brand-700', to: 'to-brand-900' },
            ];
            const grad = GRADIENTS[index % GRADIENTS.length];
            return (
              <div key={award._id} className={`bg-gradient-to-br ${grad.from} ${grad.to} p-8 rounded-2xl text-center shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border border-white/20 flex flex-col items-center justify-center min-h-[240px]`}>
                <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 border border-white/20 overflow-hidden">
                  {award.image ? (
                    <img src={award.image} className="w-full h-full object-contain p-2" alt={award.title} />
                  ) : (
                    <i className={`fas ${award.icon || 'fa-trophy'} text-white text-2xl`}></i>
                  )}
                </div>
                <h4 className="font-serif font-bold text-xl mb-2 text-white">{award.title}</h4>
                <p className="text-white/90 text-sm">{award.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Instagram Feed */}
      {gallery.length > 0 && (
        <section className="py-24 section-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-brand-600 tracking-[.3em] text-sm mb-4 font-sc">// FOLLOW US //</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-heading">@themotherrestaurant.ae</h2>
              <p className="text-muted">Join our community of food lovers in the UAE</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              {gallery.map(img => (
                <div key={img._id} className="gallery-item aspect-square rounded-lg overflow-hidden">
                  <img src={img.url} className="w-full h-full object-cover" alt={img.alt || 'Instagram'} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reservation CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://image.qwenlm.ai/public_source/0988f4f3-c95a-4b8e-8585-3575d69c4c4f/12a52d6a9-5bfb-4542-9f8e-dad7ae88b00b.png" className="w-full h-full object-cover" alt="Restaurant" />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-300 tracking-[.3em] text-sm mb-4 font-sc">// BOOK YOUR TABLE //</p>
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6">Reserve Your <span className="text-brand-300">Moment</span></h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">Experience the warmth of a mother&apos;s love. Join us for an unforgettable dining experience.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/reservation" className="btn-premium px-8 py-4 rounded-full font-semibold inline-flex items-center gap-2">
              Book Now <i className="fas fa-calendar-alt"></i>
            </Link>
            <a href="tel:+97144000000" className="bg-white/10 backdrop-blur border border-white/30 text-white px-8 py-4 rounded-full font-semibold inline-flex items-center gap-2 hover:bg-white/20 transition">
              <i className="fas fa-phone"></i> Call Us
            </a>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-24 section-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-brand-600 tracking-[.3em] text-sm mb-4 font-sc">// LATEST NEWS //</p>
            <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-heading">From Our <span className="text-gradient">Kitchen</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {blog.map((post) => (
              <article key={post._id.toString()} className="menu-card group">
                <Link href={`/blog/${post._id}`}>
                  <div className="relative overflow-hidden rounded-2xl mb-4 aspect-video">
                    {post.featuredImage && <img src={post.featuredImage} className="menu-img w-full h-full object-cover" alt={post.title} />}
                    <div className="absolute top-4 left-4 bg-brand-600 text-white px-3 py-1 rounded-full text-xs font-bold">{post.category}</div>
                  </div>
                  <div className="px-1">
                    <p className="text-brand-600 text-xs mb-2 font-sc">{new Date(post.createdAt).toLocaleDateString('en-US',{month:'long',year:'numeric'}).toUpperCase()}</p>
                    <h3 className="font-serif text-xl font-bold mb-2 text-heading group-hover:text-brand-600 transition">{post.title}</h3>
                    <p className="text-muted text-sm mb-4 line-clamp-2">{post.content}</p>
                    <span className="text-brand-600 text-sm font-semibold hover:text-brand-800 transition inline-flex items-center gap-1">
                      Read More <i className="fas fa-arrow-right text-xs"></i>
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Google Map */}
      <section className="h-96 relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1785107071884!2d55.2707!3d25.2048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDEyJzE3LjMiTiA1NcKwMTYnMTQuNSJF!5e0!3m2!1sen!2sae!4v1234567890"
          className="w-full h-full border-0"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </section>
    </>
  );
}
