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

  if (error) return <p className="rounded-md bg-red-50 p-4 text-red-700">Error: {error}</p>;
  if (!categories) return <p className="text-neutral-500">Cargando…</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Categorías</h1>
      {categories.length === 0 ? (
        <p className="text-neutral-500">Aún no hay categorías. Loguéate como admin y créalas vía /docs.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/categories/${c.id}`}
              className="group flex aspect-video flex-col justify-end overflow-hidden rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              style={c.image ? { backgroundImage: `url(${c.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
            >
              <span className="inline-block w-fit rounded-md bg-black/60 px-3 py-1 text-lg font-semibold text-white backdrop-blur-sm">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
