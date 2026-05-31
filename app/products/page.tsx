'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [limit] = useState(12);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setLoading(true);
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
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [minPrice, maxPrice, limit, offset]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Catálogo</h1>

      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 bg-white p-4">
        <label className="text-sm">
          <span className="block text-neutral-600">Precio min</span>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => { setMinPrice(e.target.value); setOffset(0); }}
            placeholder="0"
            className="w-32 rounded-md border border-neutral-300 px-3 py-1.5"
          />
        </label>
        <label className="text-sm">
          <span className="block text-neutral-600">Precio max</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => { setMaxPrice(e.target.value); setOffset(0); }}
            placeholder="∞"
            className="w-32 rounded-md border border-neutral-300 px-3 py-1.5"
          />
        </label>
        <div className="ml-auto text-sm text-neutral-500">
          {total > 0 && `${total} producto(s)`}
        </div>
      </div>

      {error && <p className="rounded-md bg-red-50 p-4 text-red-700">Error: {error}</p>}
      {loading && <p className="text-neutral-500">Cargando…</p>}

      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <p className="text-neutral-500">No hay productos con esos filtros.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
          {total > limit && (
            <div className="flex justify-center gap-2 pt-4">
              <button
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - limit))}
                className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm disabled:opacity-50"
              >
                ← Anterior
              </button>
              <button
                disabled={offset + limit >= total}
                onClick={() => setOffset(offset + limit)}
                className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm disabled:opacity-50"
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
