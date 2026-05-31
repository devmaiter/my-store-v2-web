'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Boxes, Database, ExternalLink, Package, Plus } from 'lucide-react';
import { api } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';
const SWAGGER_URL = `${API_BASE.replace(/\/api\/v1\/?$/, '')}/docs`;

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{ products: number; categories: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.listProducts({ limit: 1 }), api.listCategories()])
      .then(([p, c]) => setStats({ products: p.total, categories: c.length }))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-600">Resumen rápido del catálogo y accesos al backend.</p>
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

      {/* Highlighted: live backend */}
      <Link
        href="/admin/data"
        className="group relative block overflow-hidden rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl"
      >
        <div className="absolute -right-8 -top-8 h-32 w-32 animate-pulse rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <div className="rounded-lg bg-white/15 p-3 backdrop-blur">
            <Database size={28} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">Backend en vivo</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/30 px-2 py-0.5 text-xs font-medium backdrop-blur">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-200" />
                live
              </span>
            </div>
            <p className="text-sm text-emerald-50">
              Tablas de Postgres con auto-refresh + acceso directo al explorador Swagger UI.
            </p>
          </div>
          <span className="text-2xl opacity-60 transition-transform group-hover:translate-x-1">→</span>
        </div>
      </Link>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <h2 className="font-semibold">Acciones rápidas</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              <Plus size={14} /> Producto
            </Link>
            <Link
              href="/admin/categories/new"
              className="inline-flex items-center gap-1 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <Plus size={14} /> Categoría
            </Link>
          </div>
        </div>

        <a
          href={SWAGGER_URL}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-md"
        >
          <div>
            <h2 className="font-semibold">Swagger UI</h2>
            <p className="mt-1 text-xs text-neutral-500">
              Documentación interactiva · Probar endpoints con JWT
            </p>
          </div>
          <ExternalLink size={18} className="text-neutral-400 transition-colors group-hover:text-emerald-600" />
        </a>
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
