import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { createHash } from 'crypto';

function hashPassword(password) {
  return createHash('sha256').update(password).digest('hex');
}

const IMG = {
  wagyu:   'https://image.qwenlm.ai/public_source/0988f4f3-c95a-4b8e-8585-3575d69c4c4f/15a60d4b5-5cda-45a1-bfa0-bbd4d224d6ce.png',
  sushi:   'https://image.qwenlm.ai/public_source/0988f4f3-c95a-4b8e-8585-3575d69c4c4f/10485313a-d148-4002-8f1c-a6ae8f81073b.png',
  pasta:   'https://image.qwenlm.ai/public_source/0988f4f3-c95a-4b8e-8585-3575d69c4c4f/12fc75675-69ca-44cd-9160-b39c06707a56.png',
  kitchen: 'https://image.qwenlm.ai/public_source/0988f4f3-c95a-4b8e-8585-3575d69c4c4f/1b0c75629-7e42-4904-9acc-b7da012e0f36.png',
  dining:  'https://image.qwenlm.ai/public_source/0988f4f3-c95a-4b8e-8585-3575d69c4c4f/12a52d6a9-5bfb-4542-9f8e-dad7ae88b00b.png',
  private: 'https://image.qwenlm.ai/public_source/0988f4f3-c95a-4b8e-8585-3575d69c4c4f/13ef415fa-00e1-4e70-992e-50cd0981097e.png',
  steak:   'https://image.qwenlm.ai/public_source/0988f4f3-c95a-4b8e-8585-3575d69c4c4f/14b81e7b6-372b-4e30-9817-1e3ccd928685.png',
  chef:    'https://image.qwenlm.ai/public_source/0988f4f3-c95a-4b8e-8585-3575d69c4c4f/11d53ef46-1879-4b9a-8034-d9bf6acd03cb.png',
};

const menuItems = [
  { name:'Wagyu Beef Tenderloin', category:'Dinner', price:'680', prepTime:'25', status:'available', signature:true, badge:'SIGNATURE', image:IMG.wagyu, description:'Gold leaf, truffle mash, seasonal vegetables. Our prized A5 Wagyu from the finest Japanese cattle.' },
  { name:'Omakase Sushi Platter', category:'Dinner', price:'530', prepTime:'30', status:'available', signature:true, badge:"CHEF'S PICK", image:IMG.sushi, description:'Premium fish selection, wasabi, gold accents. Chef-curated for the ultimate experience.' },
  { name:'Black Truffle Linguine', category:'Lunch', price:'285', prepTime:'20', status:'available', signature:false, badge:'NEW', image:IMG.pasta, description:'Fresh pasta, black truffle, parmesan. Handmade daily with the finest Italian ingredients.' },
  { name:'Slow-Braised Lamb Ouzi', category:'Dinner', price:'320', prepTime:'35', status:'available', signature:false, badge:'TRADITIONAL', image:IMG.steak, description:'12-hour braised lamb, saffron rice, toasted nuts. A tribute to Emirati tradition.' },
  { name:'Lobster Thermidor', category:'Dinner', price:'480', prepTime:'40', status:'available', signature:false, badge:'NEW', image:IMG.private, description:'Whole lobster, brandy cream sauce, parmesan. A timeless French classic.' },
  { name:'Shakshuka Supreme', category:'Breakfast', price:'85', prepTime:'15', status:'available', signature:false, badge:'POPULAR', image:IMG.kitchen, description:'Eggs poached in spiced tomato sauce, feta, herbs. The ultimate breakfast.' },
  { name:'Emirati Balaleet', category:'Breakfast', price:'70', prepTime:'20', status:'available', signature:false, badge:'TRADITIONAL', image:IMG.wagyu, description:'Sweet vermicelli, cardamom omelette, rose water. A cherished Emirati morning dish.' },
  { name:'Truffle Eggs Benedict', category:'Breakfast', price:'120', prepTime:'18', status:'available', signature:false, badge:'', image:IMG.pasta, description:'Poached eggs, hollandaise, black truffle shavings.' },
  { name:"Mother's Chicken Machboos", category:'Lunch', price:'145', prepTime:'25', status:'available', signature:false, badge:'TRADITIONAL', image:IMG.kitchen, description:'Spiced chicken, basmati rice, dried lime, onion. Hessa\'s original recipe.' },
  { name:'Grilled Sea Bass', category:'Lunch', price:'195', prepTime:'22', status:'available', signature:false, badge:'', image:IMG.dining, description:'Whole grilled sea bass, chermoula, roasted vegetables.' },
  { name:'Saffron Lemonade', category:'Beverages', price:'45', prepTime:'5', status:'available', signature:false, badge:'POPULAR', image:IMG.private, description:'Fresh lemons, Iranian saffron, rose petals.' },
  { name:'UAE Karak Tea', category:'Beverages', price:'25', prepTime:'5', status:'available', signature:false, badge:'CLASSIC', image:IMG.pasta, description:'Spiced milk tea with cardamom and saffron.' },
  { name:'Rose Lassi', category:'Beverages', price:'40', prepTime:'5', status:'available', signature:false, badge:'', image:IMG.kitchen, description:'Chilled yogurt drink, rose water, pistachios.' },
  { name:'Hibiscus Mocktail', category:'Beverages', price:'50', prepTime:'5', status:'available', signature:false, badge:'', image:IMG.steak, description:'Dried hibiscus, mint, lime, sparkling water.' },
  { name:'Umm Ali', category:'Desserts', price:'75', prepTime:'15', status:'available', signature:false, badge:'TRADITIONAL', image:IMG.wagyu, description:'Egyptian bread pudding, nuts, cream, rose water.' },
  { name:'Saffron Panna Cotta', category:'Desserts', price:'90', prepTime:'10', status:'available', signature:false, badge:"CHEF'S PICK", image:IMG.sushi, description:'Silky panna cotta, saffron syrup, pistachio dust.' },
  { name:'Luqaimat', category:'Desserts', price:'55', prepTime:'12', status:'available', signature:false, badge:'', image:IMG.dining, description:'Crispy dumplings, date syrup, sesame seeds.' },
  { name:'Ful Medames Bowl', category:'Breakfast', price:'55', prepTime:'10', status:'available', signature:false, badge:'VEGAN', image:IMG.steak, description:'Slow-cooked fava beans, lemon, cumin, olive oil.' },
  { name:'Avocado Smash Toast', category:'Breakfast', price:'90', prepTime:'10', status:'available', signature:false, badge:'', image:IMG.dining, description:'Sourdough, avocado, sumac, pomegranate seeds.' },
  { name:'Laban Pancakes', category:'Breakfast', price:'65', prepTime:'15', status:'available', signature:false, badge:'', image:IMG.private, description:'Fluffy laban pancakes, date honey, whipped cream.' },
];

const chefs = [
  { name:'Chef Fatima Al-Rashid', title:'Head Chef & Founder\'s Daughter', experience:'20+ Years', bio:'Chef Fatima inherited her mother Hessa\'s passion for cooking from a young age. After training at Le Cordon Bleu Paris and working in Michelin-starred restaurants across Europe, she returned to Dubai to carry on the family legacy. Her philosophy: cook with love, use the finest ingredients.', image:IMG.chef, instagram:'https://instagram.com/cheffatima', linkedin:'', awards:['UAE Culinary Excellence Award','Dubai Food Festival Winner','Mother\'s Recipe Preservationist'] },
  { name:'Ahmad Al-Farsi', title:'Sous Chef', experience:'10 Years', bio:'Specializing in Emirati and Levantine cuisines with 10 years of experience in luxury hospitality across the UAE.', image:'', instagram:'', linkedin:'' },
  { name:'Marco Bianchi', title:'Pastry Chef', experience:'8 Years', bio:'Italian pastry virtuoso with a passion for fusing European and Middle Eastern flavors into stunning dessert creations.', image:'', instagram:'', linkedin:'' },
  { name:'Khalid Hassan', title:'Sommelier', experience:'12 Years', bio:'Expert in global wines with a deep knowledge of Mediterranean varietals and perfect pairings for Emirati cuisine.', image:'', instagram:'', linkedin:'' },
];

const blogPosts = [
  { title:'The Art of Slow Cooking: Mother\'s Technique', content:'Discover how Chef Fatima uses her mother\'s slow cooking techniques to create the most tender, flavorful dishes. The key is patience — and love. Every dish that leaves our kitchen has been prepared with deliberate care, respecting the natural flavors of each ingredient.', category:'Recipe', author:'Chef Fatima Al-Rashid', tags:['slow cooking','technique','traditional'], status:'Published', featuredImage:IMG.kitchen, readTime:'5 min read' },
  { title:'Dubai Food Festival 2025: Our Winning Menu', content:"We're proud to announce our award-winning menu at the Dubai Food Festival 2025. This year we showcased three signature dishes that captured the essence of what The Mother Restaurant stands for — tradition, innovation, and love on a plate.", category:'Events', author:'Hessa Al-Rashid', tags:['Dubai Food Festival','awards','2025'], status:'Published', featuredImage:IMG.steak, readTime:'3 min read' },
  { title:'5 Secrets to Pairing Wine with Emirati Cuisine', content:"Our sommelier Khalid Hassan shares expert tips on pairing wines with traditional Emirati dishes for an elevated dining experience. From the bold spices of machboos to the delicate sweetness of umm ali, there's a perfect wine for every course.", category:'Tips', author:'Khalid Hassan', tags:['wine pairing','sommelier','Emirati cuisine'], status:'Published', featuredImage:IMG.pasta, readTime:'7 min read' },
];

const reviews = [
  { customerName:'Sarah Mitchell', rating:5, text:'An extraordinary dining experience. The wagyu was perfection, the ambiance felt like home, and the service was impeccable. The Mother Restaurant is truly special.', source:'Google', status:'approved', role:'Food Critic, Khaleej Times' },
  { customerName:'James Chen', rating:5, text:'From the moment we walked in, we felt like family. The omakase experience was a journey through flavors I\'ll never forget. Absolutely world-class.', source:'TripAdvisor', status:'approved', role:'Business Executive, Dubai' },
  { customerName:'Aisha Al-Mansoori', rating:5, text:'We celebrated our anniversary here and it was perfect. The private dining experience, the food, the attention to detail — everything exceeded our expectations.', source:'Google', status:'approved', role:'Loyal Guest, Abu Dhabi' },
  { customerName:'Rania Hassan', rating:5, text:'Truly the finest Emirati dining experience in the UAE. Chef Fatima\'s passion shines through every single dish.', source:'Instagram', status:'approved', role:'Travel Blogger' },
  { customerName:'David Park', rating:5, text:'The catering for our corporate event was spectacular. Professional, delicious, and the presentation was stunning. Highly recommend.', source:'Google', status:'approved', role:'CEO, TechDubai' },
  { customerName:'Test Customer', rating:4, text:'Really enjoyed the food and atmosphere. The staff were so welcoming and kind.', source:'Walk-in', status:'pending', role:'Guest' },
];

const branches = [
  { name:'Jumeirah Main Branch', location:'Jumeirah Beach Road, Dubai, UAE', phone:'+971 4 400 0000', email:'jumeirah@themotherrestaurant.ae', hours:'Mon–Fri: 7:00 AM–11 PM | Sat–Sun: 8:00 AM–12 AM' },
  { name:'Deira — The Original', location:'Deira, Dubai, UAE (Est. 1998)', phone:'+971 4 400 0001', email:'deira@themotherrestaurant.ae', hours:'Mon–Sun: 7:00 AM–11 PM' },
  { name:'Abu Dhabi Corniche', location:'Corniche Road, Abu Dhabi, UAE', phone:'+971 2 400 0000', email:'abudhabi@themotherrestaurant.ae', hours:'Mon–Sun: 8:00 AM–11 PM' },
  { name:'Sharjah Al Majaz', location:'Al Majaz, Sharjah, UAE', phone:'+971 6 400 0000', email:'sharjah@themotherrestaurant.ae', hours:'Mon–Sun: 8:00 AM–10:30 PM' },
  { name:'Jumeirah Lakes Towers', location:'JLT, Dubai, UAE', phone:'+971 4 400 0002', email:'jlt@themotherrestaurant.ae', hours:'Mon–Fri: 8:00 AM–11 PM | Sat–Sun: 9:00 AM–11 PM' },
];

const galleryImages = [
  { url:IMG.wagyu,   alt:'Wagyu Beef Tenderloin', category:'food' },
  { url:IMG.dining,  alt:'Dining Room', category:'ambiance' },
  { url:IMG.sushi,   alt:'Omakase Sushi Platter', category:'food' },
  { url:IMG.kitchen, alt:'Our Kitchen', category:'events' },
  { url:IMG.pasta,   alt:'Black Truffle Linguine', category:'food' },
  { url:IMG.private, alt:'Private Dining Room', category:'ambiance' },
  { url:IMG.steak,   alt:'Grilled Steak', category:'food' },
  { url:IMG.chef,    alt:'Chef Fatima', category:'ambiance' },
];

export async function GET() {
  try {
    const db = await getDb();
    const now = new Date();
    const addTs = (arr) => arr.map(item => ({ ...item, createdAt: now }));

    await db.collection('menu_items').deleteMany({});
    await db.collection('menu_items').insertMany(addTs(menuItems));

    await db.collection('chefs').deleteMany({});
    await db.collection('chefs').insertMany(addTs(chefs));

    await db.collection('blog_posts').deleteMany({});
    await db.collection('blog_posts').insertMany(addTs(blogPosts));

    await db.collection('reviews').deleteMany({});
    await db.collection('reviews').insertMany(addTs(reviews));

    await db.collection('branches').deleteMany({});
    await db.collection('branches').insertMany(addTs(branches));

    await db.collection('gallery').deleteMany({});
    await db.collection('gallery').insertMany(addTs(galleryImages));

    await db.collection('settings').updateOne(
      { _id: 'global' },
      { $set: { _id: 'global', siteName:'The Mother Restaurant', tagline:'Love is Her Secret Ingredient', email:'info@themother.ae', currency:'AED', social:{ instagram:'https://instagram.com/themother', facebook:'https://facebook.com/themother', tiktok:'', twitter:'' }, updatedAt: now } },
      { upsert: true }
    );

    const adminUser = {
      username: 'admin@themother.ae',
      password: hashPassword('MotherAdminSecure2025!'),
      createdAt: now
    };
    await db.collection('admins').deleteMany({});
    await db.collection('admins').insertOne(adminUser);

    return NextResponse.json({ success: true, seeded: { admins: 1, menuItems:menuItems.length, chefs:chefs.length, blog:blogPosts.length, reviews:reviews.length, branches:branches.length, gallery:galleryImages.length } });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
