'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { api } from '@/lib/api';
import type { Category } from '@/lib/types';
import ProductCard, { AddProductTile } from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/Skeleton';
import { useAuth } from '@/lib/auth-store';

export default function CategoryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [category, setCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isAdmin = mounted && user?.role === 'admin';

  useEffect(() => {
    setCategory(null);
    api.getCategory(id).then(setCategory).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="rounded-md bg-red-50 p-4 text-red-700">Error: {error}</p>;

  return (
    <div className="space-y-6 animate-fade-up">
      <nav className="flex items-center gap-1 text-sm text-neutral-500">
        <Link href="/" className="hover:text-emerald-700">Inicio</Link>
        <ChevronRight size={12} />
        <Link href="/categories" className="hover:text-emerald-700">Categorías</Link>
        <ChevronRight size={12} />
        <span className="text-neutral-700">{category?.name ?? '…'}</span>
      </nav>

      <div className="relative overflow-hidden rounded-xl bg-neutral-100">
        {category?.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={category.image} alt={category.name} className="h-48 w-full object-cover md:h-64" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-x-6 bottom-4 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow md:text-4xl">
              {category?.name ?? '...'}
            </h1>
            {category && (
              <p className="text-sm text-white/80">
                {category.products?.length ?? 0} producto{(category.products?.length ?? 0) === 1 ? '' : 's'}
              </p>
            )}
          </div>
          {isAdmin && category && (
            <Link
              href={`/admin/categories/${category.id}`}
              className="inline-flex items-center gap-1 rounded-md bg-amber-400 px-2.5 py-1.5 text-xs font-medium text-amber-900 shadow-md transition-colors hover:bg-amber-300"
            >
              <Pencil size={12} /> Editar
            </Link>
          )}
        </div>
      </div>

      {!category ? (
        <ProductGridSkeleton count={8} />
      ) : (category.products && category.products.length > 0) || isAdmin ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {isAdmin && (
            <div className="animate-scale-in">
              <AddProductTile />
            </div>
          )}
          {category.products?.map((p, i) => (
            <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
              <ProductCard
                product={p}
                onDeleted={(pid) =>
                  setCategory((cur) =>
                    cur ? { ...cur, products: cur.products?.filter((x) => x.id !== pid) } : cur,
                  )
                }
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
          Aún no hay productos en esta categoría.
        </div>
      )}

      <Link href="/categories" className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-emerald-700">
        <ChevronLeft size={14} /> Ver todas las categorías
      </Link>
    </div>
  );
}
