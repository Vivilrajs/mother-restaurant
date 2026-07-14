import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'The Mother Restaurant — Love is Her Secret Ingredient',
  description: 'Home-style fine dining in the heart of the UAE. Founded in 1998 by Hessa Al-Rashid. Crafted with a mother\'s love and the finest ingredients.',
  keywords: 'restaurant, UAE, Dubai, fine dining, Emirati cuisine, mother restaurant',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@300;400;500;600;700&family=Playfair+Display+SC:wght@400;700;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body className="overflow-x-hidden">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <a href="https://wa.me/97144000000" className="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
          <i className="fab fa-whatsapp text-white text-2xl"></i>
        </a>
        <div id="toast" className="fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full text-sm font-semibold z-[300] opacity-0 transition-opacity duration-300 pointer-events-none shadow-xl"></div>
      </body>
    </html>
  );
}
