'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Boxes, Database, ExternalLink, Heart, Package, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';
import type { Category, Product } from '@/lib/types';
import { money } from '@/lib/format';
import { useToast } from '@/components/Toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';
const ROOT_API = API_BASE.replace(/\/api\/v1\/?$/, '');
const SWAGGER_URL = `${ROOT_API}/docs`;
const HEALTH_URL = `${ROOT_API}/health`;

type Tab = 'products' | 'categories';

export default function AdminDataPage() {
  const [tab, setTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [health, setHealth] = useState<{ status: string; uptime: number } | null>(null);
  const toast = useToast();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function load() {
    try {
      const [p, c, h] = await Promise.all([
        api.listProducts({ limit: 100 }),
        api.listCategories(),
        fetch(HEALTH_URL).then((r) => r.json()).catch(() => null),
      ]);
      setProducts(p.items);
      setCategories(c);
      setHealth(h);
      setLastFetch(new Date());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al refrescar');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      timerRef.current = setInterval(load, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoRefresh]);

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Datos en vivo</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Lectura directa de la base de datos Postgres vía la API en Railway.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={SWAGGER_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
          >
            <Database size={14} /> Abrir Swagger UI <ExternalLink size={12} />
          </a>
          <button
            onClick={() => load()}
            className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refrescar
          </button>
        </div>
      </div>

      {/* Status row */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4 text-sm">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${health?.status === 'ok' ? 'animate-pulse bg-emerald-500' : 'bg-red-500'}`}
          />
          <span className="font-medium">
            API {health?.status === 'ok' ? 'online' : 'offline'}
          </span>
          {health && (
            <span className="text-xs text-neutral-500">
              · uptime {formatUptime(health.uptime)}
            </span>
          )}
        </div>
        <div className="text-neutral-500">
          Última lectura: {lastFetch ? lastFetch.toLocaleTimeString('es-CO') : '—'}
        </div>
        <label className="ml-auto flex items-center gap-2 text-xs text-neutral-600">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          Auto-refresh (5s)
        </label>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-neutral-200">
        <TabBtn active={tab === 'products'} onClick={() => setTab('products')} icon={<Package size={14} />}>
          Productos <span className="ml-1 rounded-full bg-neutral-200 px-1.5 text-xs">{products.length}</span>
        </TabBtn>
        <TabBtn active={tab === 'categories'} onClick={() => setTab('categories')} icon={<Boxes size={14} />}>
          Categorías <span className="ml-1 rounded-full bg-neutral-200 px-1.5 text-xs">{categories.length}</span>
        </TabBtn>
      </div>

      {tab === 'products' && (
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-neutral-200 bg-neutral-50 text-left uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-3 py-2">id</th>
                  <th className="px-3 py-2">name</th>
                  <th className="px-3 py-2">price</th>
                  <th className="px-3 py-2">category_id</th>
                  <th className="px-3 py-2">is_blocked</th>
                  <th className="px-3 py-2">created_at</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50">
                    <td className="px-3 py-2 font-mono text-emerald-700">{p.id}</td>
                    <td className="px-3 py-2">
                      <Link href={`/admin/products/${p.id}`} className="font-medium hover:text-emerald-700">
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-3 py-2 font-mono">{money(p.price)}</td>
                    <td className="px-3 py-2 font-mono text-neutral-500">{p.categoryId ?? 'null'}</td>
                    <td className="px-3 py-2">
                      <span className={p.isBlocked ? 'text-red-600' : 'text-emerald-700'}>
                        {String(p.isBlocked)}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-neutral-500">
                      {new Date(p.createdAt).toLocaleString('es-CO')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {products.length === 0 && !loading && (
            <div className="p-6 text-center text-sm text-neutral-500">Sin productos.</div>
          )}
        </div>
      )}

      {tab === 'categories' && (
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-neutral-200 bg-neutral-50 text-left uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-3 py-2">id</th>
                  <th className="px-3 py-2">name</th>
                  <th className="px-3 py-2">created_at</th>
                  <th className="px-3 py-2 text-right">acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50">
                    <td className="px-3 py-2 font-mono text-emerald-700">{c.id}</td>
                    <td className="px-3 py-2 font-medium">{c.name}</td>
                    <td className="px-3 py-2 font-mono text-neutral-500">
                      {new Date(c.createdAt).toLocaleString('es-CO')}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Link href={`/admin/categories/${c.id}`} className="text-emerald-700 hover:underline">
                        editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {categories.length === 0 && !loading && (
            <div className="p-6 text-center text-sm text-neutral-500">Sin categorías.</div>
          )}
        </div>
      )}

      <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-4 text-xs text-neutral-600">
        <p className="flex items-start gap-2">
          <Heart size={14} className="mt-0.5 shrink-0 text-emerald-600" />
          <span>
            Los datos vienen de Postgres en Railway vía la API REST en Express. Endpoints públicos:{' '}
            <a href={SWAGGER_URL} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">
              /docs (Swagger)
            </a>{' '}
            permite consultar y mutar cualquier recurso con auth JWT.
          </span>
        </p>
      </div>
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? 'border-emerald-600 text-emerald-700'
          : 'border-transparent text-neutral-600 hover:text-emerald-700'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function formatUptime(s: number) {
  if (s < 60) return `${Math.round(s)}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
  return `${Math.floor(s / 86400)}d ${Math.floor((s % 86400) / 3600)}h`;
}
