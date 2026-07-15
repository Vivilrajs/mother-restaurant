'use client';
import { useState, useEffect, useCallback } from 'react';

export default function useCategories(type) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/categories?type=${type}`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => { load(); }, [load]);

  async function addCategory(name) {
    if (!name?.trim()) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, name }),
      });
      if (res.ok) load();
    } catch (e) {
      console.error(e);
    }
  }

  async function removeCategory(id) {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) load();
    } catch (e) {
      console.error(e);
    }
  }

  return { categories, names: categories.map(c => c.name), loading, addCategory, removeCategory };
}
