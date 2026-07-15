'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const CATEGORIES = ['all','Breakfast','Lunch','Dinner','Beverages','Desserts'];

export default function MenuTabsSection() {
  const [active, setActive] = useState('all');
  const [items, setItems] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/menu').then(r => r.json()).then(all => {
      if (!Array.isArray(all)) return;
      const c = { all: all.length };
      for (const item of all) c[item.category] = (c[item.category] || 0) + 1;
      setCounts(c);
    });
    fetchItems('all');
  }, []);

  async function fetchItems(cat) {
    setLoading(true);
    const url = cat === 'all' ? '/api/menu' : `/api/menu?category=${cat}`;
    const res = await fetch(url);
    const data = await res.json();
    setItems(Array.isArray(data) ? data.slice(0, 8) : []);
    setLoading(false);
  }

  function handleTab(cat) {
    setActive(cat);
    fetchItems(cat);
  }

  return (
    <>
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => handleTab(cat)}
            className={`category-tab ${active === cat ? 'active' : ''}`}>
            <i className={`fas ${cat==='all'?'fa-th-large':cat==='Breakfast'?'fa-coffee':cat==='Lunch'?'fa-hamburger':cat==='Dinner'?'fa-utensils':cat==='Beverages'?'fa-cocktail':'fa-ice-cream'}`}></i>
            {cat === 'all' ? 'All Items' : cat}
            <span className="tab-count">{counts[cat] ?? 0}</span>
          </button>
        ))}
      </div>
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[...Array(8)].map((_,i) => <div key={i} className="dish-card animate-pulse bg-brand-100/40 h-64"></div>)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {items.map(d => (
            <Link key={d._id} href={`/menu/${d._id}`} className="dish-card">
              <div className="relative overflow-hidden aspect-square">
                {d.image && <img src={d.image} className="dish-img w-full h-full object-cover" alt={d.name} />}
                {d.badge && <div className="absolute top-3 right-3 bg-brand-600 text-white px-2.5 py-0.5 rounded-full text-xs font-bold">{d.badge}</div>}
              </div>
              <div className="p-4">
                <h3 className="font-serif font-bold text-heading text-base mb-1">{d.name}</h3>
                <p className="text-muted text-xs mb-3 line-clamp-2">{d.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-brand-600 font-bold font-serif">AED {d.price}</span>
                  <button className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white hover:bg-brand-700 transition" aria-label="Add">
                    <i className="fas fa-plus text-xs"></i>
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
