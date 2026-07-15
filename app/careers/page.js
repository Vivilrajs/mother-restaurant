import JobsList from '@/components/careers/JobsList';
export const metadata = { title: 'Careers — The Mother Restaurant' };

const jobs = [
  { title:'Head Waiter / Waitress', dept:'Front of House', type:'Full-time', location:'Dubai', desc:'Deliver an extraordinary dining experience with passion and professionalism.' },
  { title:'Sous Chef', dept:'Kitchen', type:'Full-time', location:'Dubai / Abu Dhabi', desc:'Support executive chef in creating world-class Emirati and international cuisine.' },
  { title:'Pastry Chef', dept:'Kitchen', type:'Full-time', location:'Sharjah', desc:'Craft stunning desserts that reflect our commitment to tradition and innovation.' },
  { title:'Restaurant Manager', dept:'Management', type:'Full-time', location:'Dubai', desc:'Lead and inspire the team at our Jumeirah flagship location.' },
  { title:'Barista / Beverage Expert', dept:'Beverages', type:'Part-time', location:'All Branches', desc:'Create signature drinks and manage our premium beverage program.' },
  { title:'Social Media Manager', dept:'Marketing', type:'Full-time', location:'Dubai (Remote Friendly)', desc:'Tell the story of The Mother Restaurant through beautiful content and engaging campaigns.' },
];

export default function CareersPage() {
  return (
    <>
      <div className="pt-20 min-h-[50vh] flex items-center" style={{background:'linear-gradient(135deg,#2d2422 0%,#4a3530 50%,#2d2422 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-4">Join Our <span style={{color:'#d98f7c'}}>Family</span></h1>
          <p className="text-white/80 text-xl">Build a career you love, with people who feel like family</p>
        </div>
      </div>
      <section className="py-24 section-warm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-heading mb-4">Open <span className="text-gradient">Positions</span></h2>
          </div>
          <JobsList jobs={jobs} />
        </div>
      </section>
    </>
  );
}
