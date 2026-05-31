'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Lock, ShoppingBag, Zap } from 'lucide-react';
import { api } from '@/lib/api';
import type { Category, Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/Skeleton';

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.listProducts({ limit: 8 }), api.listCategories()])
      .then(([p, c]) => {
        setFeatured(p.items);
        setCategories(c);
      })
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-8 text-white shadow-lg md:p-12">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-12 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            <Zap size={12} /> Demo live · Next.js 16 + Express + Postgres
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            Tu tienda online,<br />conectada de verdad.
          </h1>
          <p className="mt-3 max-w-xl text-emerald-50 md:text-lg">
            Catálogo dinámico, carrito persistente, checkout autenticado con JWT
            y panel admin para gestionar productos y categorías en vivo.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 rounded-md bg-white px-4 py-2.5 font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              <ShoppingBag size={16} /> Ver catálogo
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-md border border-white/30 px-4 py-2.5 font-medium text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              <Lock size={16} /> Login demo
            </Link>
          </div>
          <p className="mt-3 text-xs text-emerald-100/90">
            Prueba como admin: <code className="rounded bg-black/20 px-1 py-0.5 font-mono">admin@store.com</code> /{' '}
            <code className="rounded bg-black/20 px-1 py-0.5 font-mono">superSecret123</code>
          </p>
        </div>
      </section>

      {/* Categories grid */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Explora por categoría</h2>
          <Link href="/categories" className="inline-flex items-center gap-1 text-sm text-emerald-700 hover:underline">
            Ver todas <ArrowRight size={14} />
          </Link>
        </div>
        {categories === null ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-lg bg-neutral-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {categories.slice(0, 6).map((c) => (
              <Link
                key={c.id}
                href={`/categories/${c.id}`}
                className="group relative aspect-square overflow-hidden rounded-lg bg-neutral-100"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span className="absolute inset-x-2 bottom-2 truncate text-sm font-semibold text-white">
                  {c.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Destacados</h2>
          <Link href="/products" className="inline-flex items-center gap-1 text-sm text-emerald-700 hover:underline">
            Ver todo <ArrowRight size={14} />
          </Link>
        </div>
        {error && <p className="rounded-md bg-red-50 p-4 text-red-700">Error: {error}</p>}
        {featured === null && !error && <ProductGridSkeleton count={8} />}
        {featured && featured.length === 0 && (
          <p className="rounded-md border border-dashed border-neutral-300 bg-white p-6 text-center text-neutral-500">
            Aún no hay productos en el catálogo.
          </p>
        )}
        {featured && featured.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
