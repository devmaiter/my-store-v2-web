'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Boxes, Database, ExternalLink, Heart, Package, RefreshCw, ShoppingBag, Users } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import type { Category, Order, Product } from '@/lib/types';
import { money } from '@/lib/format';
import { useToast } from '@/components/Toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';
const ROOT_API = API_BASE.replace(/\/api\/v1\/?$/, '');
const SWAGGER_URL = `${ROOT_API}/docs`;
const HEALTH_URL = `${ROOT_API}/health`;
const RAILWAY_PROJECT = 'https://railway.com/project/70667544-d497-44a0-a3d4-c53c8df4658e';

type Tab = 'products' | 'categories' | 'users' | 'orders';

type UserRow = { id: number; email: string; role: string; createdAt: string };

export default function AdminDataPage() {
  const [tab, setTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [health, setHealth] = useState<{ status: string; uptime: number } | null>(null);
  const token = useAuth((s) => s.token);
  const toast = useToast();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function load() {
    if (!token) return;
    try {
      const [p, c, u, o, h] = await Promise.all([
        api.listProducts({ limit: 100 }),
        api.listCategories(),
        api.listUsers(token).catch(() => [] as UserRow[]),
        api.listAllOrders(token).catch(() => [] as Order[]),
        fetch(HEALTH_URL).then((r) => r.json()).catch(() => null),
      ]);
      setProducts(p.items);
      setCategories(c);
      setUsers(u);
      setOrders(o);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (autoRefresh) {
      timerRef.current = setInterval(load, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh, token]);

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
            <Database size={14} /> Swagger UI <ExternalLink size={12} />
          </a>
          <a
            href={RAILWAY_PROJECT}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-purple-300 bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100"
            title="Abrir el proyecto en Railway para queries SQL directos"
          >
            <Database size={14} /> Postgres en Railway <ExternalLink size={12} />
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
      <div className="flex flex-wrap gap-1 border-b border-neutral-200">
        <TabBtn active={tab === 'products'} onClick={() => setTab('products')} icon={<Package size={14} />}>
          products <Badge>{products.length}</Badge>
        </TabBtn>
        <TabBtn active={tab === 'categories'} onClick={() => setTab('categories')} icon={<Boxes size={14} />}>
          categories <Badge>{categories.length}</Badge>
        </TabBtn>
        <TabBtn active={tab === 'users'} onClick={() => setTab('users')} icon={<Users size={14} />}>
          users <Badge>{users.length}</Badge>
        </TabBtn>
        <TabBtn active={tab === 'orders'} onClick={() => setTab('orders')} icon={<ShoppingBag size={14} />}>
          orders <Badge>{orders.length}</Badge>
        </TabBtn>
      </div>

      {tab === 'products' && (
        <DataTable
          headers={['id', 'name', 'price', 'category_id', 'is_blocked', 'created_at']}
          empty={!loading && products.length === 0}
        >
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
        </DataTable>
      )}

      {tab === 'categories' && (
        <DataTable headers={['id', 'name', 'created_at', 'acciones']} empty={!loading && categories.length === 0}>
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
        </DataTable>
      )}

      {tab === 'users' && (
        <DataTable headers={['id', 'email', 'role', 'created_at']} empty={!loading && users.length === 0}>
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-neutral-50">
              <td className="px-3 py-2 font-mono text-emerald-700">{u.id}</td>
              <td className="px-3 py-2 font-medium">{u.email}</td>
              <td className="px-3 py-2">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    u.role === 'admin'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-neutral-100 text-neutral-700'
                  }`}
                >
                  {u.role}
                </span>
              </td>
              <td className="px-3 py-2 font-mono text-neutral-500">
                {new Date(u.createdAt).toLocaleString('es-CO')}
              </td>
            </tr>
          ))}
        </DataTable>
      )}

      {tab === 'orders' && (
        <DataTable
          headers={['id', 'user_id', 'email', 'items', 'total', 'created_at']}
          empty={!loading && orders.length === 0}
        >
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-neutral-50">
              <td className="px-3 py-2 font-mono text-emerald-700">#{o.id}</td>
              <td className="px-3 py-2 font-mono">{o.userId}</td>
              <td className="px-3 py-2">{o.user?.email ?? '—'}</td>
              <td className="px-3 py-2 text-neutral-600">
                {o.items.reduce((s, it) => s + it.OrderProduct.amount, 0)}
              </td>
              <td className="px-3 py-2 font-mono">{money(o.total)}</td>
              <td className="px-3 py-2 font-mono text-neutral-500">
                {new Date(o.createdAt).toLocaleString('es-CO')}
              </td>
            </tr>
          ))}
        </DataTable>
      )}

      <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-4 text-xs text-neutral-600">
        <p className="flex items-start gap-2">
          <Heart size={14} className="mt-0.5 shrink-0 text-emerald-600" />
          <span>
            Los datos vienen de Postgres en Railway vía la API REST en Express. Para queries SQL crudos,
            abre el proyecto en Railway → servicio Postgres → pestaña <strong>Data</strong>. Endpoints públicos en{' '}
            <a href={SWAGGER_URL} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">
              /docs (Swagger)
            </a>
            .
          </span>
        </p>
      </div>
    </div>
  );
}

function DataTable({
  headers,
  empty,
  children,
}: {
  headers: string[];
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-left uppercase tracking-wide text-neutral-500">
            <tr>
              {headers.map((h) => (
                <th key={h} className="px-3 py-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">{children}</tbody>
        </table>
      </div>
      {empty && <div className="p-6 text-center text-sm text-neutral-500">Sin registros.</div>}
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

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="ml-1 rounded-full bg-neutral-200 px-1.5 text-xs">{children}</span>;
}

function formatUptime(s: number) {
  if (s < 60) return `${Math.round(s)}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
  return `${Math.floor(s / 86400)}d ${Math.floor((s % 86400) / 3600)}h`;
}
