import { useState, useCallback } from 'react';

const KEY = 'deja_recently_viewed';
const MAX = 10;

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export default function useRecentlyViewed() {
  const [viewed, setViewed] = useState(load);

  const addViewed = useCallback((item) => {
    setViewed(prev => {
      const next = [item, ...prev.filter(i => i.id !== item.id)].slice(0, MAX);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { viewed, addViewed };
}