'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Category } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

export default function CategoryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [category, setCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getCategory(id).then(setCategory).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="rounded-md bg-red-50 p-4 text-red-700">Error: {error}</p>;
  if (!category) return <p className="text-neutral-500">Cargando…</p>;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/categories" className="text-sm text-emerald-700 hover:underline">
          ← Categorías
        </Link>
        <h1 className="mt-2 text-2xl font-bold">{category.name}</h1>
      </div>
      {category.products && category.products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {category.products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-neutral-500">Aún no hay productos en esta categoría.</p>
      )}
    </div>
  );
}
