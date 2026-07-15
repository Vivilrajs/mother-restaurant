'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function MenuBrowser({ items, categories }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter(item => {
      const matchesFilter = filter === 'all' || item.category === filter;
      const matchesSearch = !q || 
        item.name.toLowerCase().includes(q) || 
        (item.description || '').toLowerCase().includes(q) ||
        (item.category || '').toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [items, search, filter]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-1">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-muted"></i>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search dishes..."
            className="form-input w-full pr-4 py-3 rounded-full"
            style={{ paddingLeft: '3rem' }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            className={`filter-btn px-5 py-2 rounded-full border border-brand-600/30 text-sm transition ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn px-5 py-2 rounded-full border border-brand-600/30 text-sm transition ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted">No dishes match your search.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(item => (
            <Link key={item._id} href={`/menu/${item._id}`} className="dish-card group">
              <div className="relative overflow-hidden aspect-square">
                {item.image && <img src={item.image} className="dish-img w-full h-full object-cover" alt={item.name} />}
                {item.badge && <div className="absolute top-3 right-3 bg-brand-600 text-white px-2.5 py-0.5 rounded-full text-xs font-bold">{item.badge}</div>}
                {item.status === 'out' && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="text-white font-bold">Out of Stock</span></div>}
              </div>
              <div className="p-4">
                <h3 className="font-serif font-bold text-heading text-base mb-1">{item.name}</h3>
                <p className="text-muted text-xs mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-brand-600 font-bold font-serif">AED {item.price}</span>
                  {item.prepTime && <span className="text-muted text-xs"><i className="far fa-clock mr-1"></i>{item.prepTime} min</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
