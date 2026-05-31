'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Boxes, Package } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{ products: number; categories: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.listProducts({ limit: 1 }), api.listCategories()])
      .then(([p, c]) => setStats({ products: p.total, categories: c.length }))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-600">Resumen rápido del catálogo.</p>
      </div>

      {error && <p className="rounded-md bg-red-50 p-4 text-red-700">Error: {error}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Productos"
          value={stats?.products ?? '—'}
          icon={<Package size={20} />}
          href="/admin/products"
        />
        <StatCard
          label="Categorías"
          value={stats?.categories ?? '—'}
          icon={<Boxes size={20} />}
          href="/admin/categories"
        />
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="font-semibold">Acciones rápidas</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/admin/products/new"
            className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            + Nuevo producto
          </Link>
          <Link
            href="/admin/categories/new"
            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            + Nueva categoría
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  href,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-lg border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-500">{label}</div>
        <div className="rounded-md bg-emerald-50 p-2 text-emerald-700">{icon}</div>
      </div>
      <div className="mt-2 text-3xl font-bold tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-emerald-700 opacity-0 transition-opacity group-hover:opacity-100">
        Ver detalles →
      </div>
    </Link>
  );
}
