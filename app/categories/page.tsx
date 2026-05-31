'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Category } from '@/lib/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.listCategories().then(setCategories).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Categorías</h1>
        <p className="mt-1 text-sm text-neutral-600">Explora el catálogo agrupado por tipo de producto.</p>
      </div>

      {error && <p className="rounded-md bg-red-50 p-4 text-red-700">Error: {error}</p>}

      {!categories && !error && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] animate-pulse rounded-lg bg-neutral-200" />
          ))}
        </div>
      )}

      {categories && categories.length === 0 && (
        <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
          Aún no hay categorías.
        </div>
      )}

      {categories && categories.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/categories/${c.id}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              {c.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.image}
                  alt={c.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
                <span className="text-lg font-bold text-white drop-shadow">{c.name}</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs text-white backdrop-blur transition-colors group-hover:bg-emerald-500">
                  Ver →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
