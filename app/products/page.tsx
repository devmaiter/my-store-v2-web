'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { api } from '@/lib/api';
import type { Category, Product } from '@/lib/types';
import ProductCard, { AddProductTile } from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/Skeleton';
import { useAuth } from '@/lib/auth-store';

type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'name';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState<SortKey>('newest');
  const [limit] = useState(12);
  const [offset, setOffset] = useState(0);
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isAdmin = mounted && user?.role === 'admin';

  useEffect(() => {
    api.listCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setProducts(null);
    api
      .listProducts({
        limit,
        offset,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      })
      .then((r) => {
        setProducts(r.items);
        setTotal(r.total);
        setError(null);
      })
      .catch((e) => setError(e.message));
  }, [minPrice, maxPrice, limit, offset]);

  // Client-side filter by category + search + sort
  const visible = useMemo(() => {
    if (!products) return null;
    let list = products;
    if (categoryId) list = list.filter((p) => p.categoryId === categoryId);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || (p.description ?? '').toLowerCase().includes(q),
      );
    }
    const sorted = [...list];
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [products, categoryId, query, sort]);

  function clearFilters() {
    setQuery('');
    setCategoryId(null);
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setOffset(0);
  }

  const hasFilters = query || categoryId || minPrice || maxPrice || sort !== 'newest';

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">Catálogo</h1>
        <span className="text-sm text-neutral-500">
          {visible ? `${visible.length} ${visible.length === 1 ? 'producto' : 'productos'}` : ''}
        </span>
      </div>

      {/* Filters bar */}
      <div className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto] md:items-end">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-neutral-600">Buscar</span>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nombre o descripción…"
                className="input pl-9"
              />
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-neutral-600">Categoría</span>
            <select
              value={categoryId ?? ''}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
              className="input md:w-44"
            >
              <option value="">Todas</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-neutral-600">
              <SlidersHorizontal size={11} className="inline" /> Ordenar
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="input md:w-40"
            >
              <option value="newest">Más recientes</option>
              <option value="price-asc">Precio: bajo a alto</option>
              <option value="price-desc">Precio: alto a bajo</option>
              <option value="name">Nombre A–Z</option>
            </select>
          </label>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:max-w-md">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-neutral-600">Precio min (COP)</span>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => { setMinPrice(e.target.value); setOffset(0); }}
              placeholder="0"
              className="input"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-neutral-600">Precio max (COP)</span>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => { setMaxPrice(e.target.value); setOffset(0); }}
              placeholder="∞"
              className="input"
            />
          </label>
        </div>
      </div>

      {error && <p className="rounded-md bg-red-50 p-4 text-red-700">Error: {error}</p>}
      {visible === null && !error && <ProductGridSkeleton count={12} />}

      {visible && visible.length === 0 && (
        <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-12 text-center">
          <p className="text-neutral-500">No hay productos con esos filtros.</p>
          {hasFilters && (
            <button onClick={clearFilters} className="mt-3 text-sm text-emerald-700 hover:underline">
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {visible && (visible.length > 0 || isAdmin) && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {isAdmin && (
              <div className="animate-scale-in">
                <AddProductTile />
              </div>
            )}
            {visible.map((p, i) => (
              <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                <ProductCard
                  product={p}
                  onDeleted={(id) => setProducts((cur) => cur?.filter((x) => x.id !== id) ?? cur)}
                />
              </div>
            ))}
          </div>
          {total > limit && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - limit))}
                className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm disabled:opacity-50 hover:bg-neutral-50"
              >
                ← Anterior
              </button>
              <span className="text-sm text-neutral-500">
                {Math.floor(offset / limit) + 1} / {Math.ceil(total / limit)}
              </span>
              <button
                disabled={offset + limit >= total}
                onClick={() => setOffset(offset + limit)}
                className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm disabled:opacity-50 hover:bg-neutral-50"
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
