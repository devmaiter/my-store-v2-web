'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listProducts({ limit: 8 })
      .then((r) => setFeatured(r.items))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="space-y-10">
      <section className="rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-8 text-white shadow-md">
        <h1 className="text-3xl font-bold tracking-tight">Tienda demo my-store-v2</h1>
        <p className="mt-2 max-w-2xl text-emerald-50">
          Storefront Next.js 16 + React 19 conectado a la API Express+Sequelize+Postgres del proyecto.
          Catálogo público, carrito local con Zustand persistente, checkout autenticado con JWT.
        </p>
        <div className="mt-4 flex gap-3">
          <Link href="/products" className="rounded-md bg-white px-4 py-2 font-medium text-emerald-700 hover:bg-emerald-50">
            Ver catálogo
          </Link>
          <Link href="/register" className="rounded-md border border-white/40 px-4 py-2 font-medium hover:bg-white/10">
            Crear cuenta
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Destacados</h2>
          <Link href="/products" className="text-sm text-emerald-700 hover:underline">
            Ver todo →
          </Link>
        </div>
        {error && <p className="rounded-md bg-red-50 p-4 text-red-700">Error: {error}</p>}
        {!featured && !error && (
          <p className="text-neutral-500">Cargando…</p>
        )}
        {featured && (
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
