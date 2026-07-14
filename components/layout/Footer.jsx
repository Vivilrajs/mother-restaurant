import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="logo-container mb-6">
              <div><div className="logo-the" style={{color:'#f9f3e8'}}>THE</div><div className="logo-m" style={{color:'#d98f7c'}}>m</div></div>
              <div className="logo-circle"><div className="logo-circle-text">LOVE IS<br/>HER SECRET<br/>INGREDIENT</div></div>
              <div><div className="logo-m" style={{color:'#d98f7c'}}>ther</div><div className="logo-restaurant" style={{color:'#f9f3e8'}}>RESTAURANT</div></div>
            </div>
            <p className="text-[#c8b5b0] mb-6 max-w-sm">Where every dish is a labor of love, every meal a family memory, and every visit a homecoming.</p>
            <div className="flex gap-4">
              {[['fab fa-instagram','#'],['fab fa-facebook','#'],['fab fa-tiktok','#'],['fab fa-twitter','#']].map(([icon,href],i) => (
                <a key={i} href={href} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-600 transition"><i className={`${icon} text-white`}></i></a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-serif text-lg font-bold mb-6">Quick Links</h4>
            <div className="space-y-3">
              {[['/',  'Home'],['/about','About Us'],['/menu','Our Menu'],['/chef','Our Chefs'],['/gallery','Gallery'],['/contact','Contact']].map(([href,label]) => (
                <Link key={href} href={href} className="block text-[#c8b5b0] hover:text-brand-400 transition text-sm">{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-serif text-lg font-bold mb-6">Opening Hours</h4>
            <div className="space-y-2 text-[#c8b5b0] text-sm">
              <div className="flex justify-between"><span>Mon – Fri</span><span>7:00 AM – 11 PM</span></div>
              <div className="flex justify-between"><span>Saturday</span><span>8:00 AM – 12 AM</span></div>
              <div className="flex justify-between"><span>Sunday</span><span>8:00 AM – 11 PM</span></div>
            </div>
            <div className="mt-6">
              <h4 className="font-serif text-lg font-bold mb-3">Contact</h4>
              <p className="text-[#c8b5b0] text-sm">+971 4 400 0000</p>
              <p className="text-[#c8b5b0] text-sm">hello@themotherrestaurant.ae</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[#c8b5b0] text-sm">© 2025 The Mother Restaurant. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-[#c8b5b0] text-sm hover:text-brand-400 transition">Privacy Policy</a>
            <a href="#" className="text-[#c8b5b0] text-sm hover:text-brand-400 transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
