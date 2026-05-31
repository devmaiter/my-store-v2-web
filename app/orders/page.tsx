'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Package, ShoppingBag } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import type { Order } from '@/lib/types';
import { money } from '@/lib/format';
import { RowSkeleton } from '@/components/Skeleton';

export default function OrdersPage() {
  return (
    <Suspense fallback={<p className="text-neutral-500">Cargando…</p>}>
      <OrdersInner />
    </Suspense>
  );
}

function OrdersInner() {
  const token = useAuth((s) => s.token);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const params = useSearchParams();
  const justId = params.get('just');
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!token) return;
    api.myOrders(token).then(setOrders).catch((e) => setError(e.message));
  }, [token]);

  if (!mounted) return null;

  if (!token) {
    return (
      <div className="mx-auto max-w-md space-y-3 rounded-xl border border-neutral-200 bg-white p-10 text-center">
        <Package className="mx-auto text-neutral-300" size={40} />
        <h1 className="text-2xl font-bold">Inicia sesión</h1>
        <p className="text-sm text-neutral-600">Necesitas estar autenticado para ver tus órdenes.</p>
        <Link
          href="/login"
          className="inline-block rounded-md bg-emerald-600 px-4 py-2.5 font-medium text-white hover:bg-emerald-700"
        >
          Login
        </Link>
      </div>
    );
  }

  if (error) return <p className="rounded-md bg-red-50 p-4 text-red-700">Error: {error}</p>;

  return (
    <div className="space-y-6">
      {justId && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <CheckCircle2 size={20} />
          <span className="text-sm font-medium">
            ¡Orden #{justId} creada con éxito! Revisa el detalle abajo.
          </span>
        </div>
      )}

      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold">Mis órdenes</h1>
        {orders && (
          <span className="text-sm text-neutral-500">
            {orders.length} {orders.length === 1 ? 'orden' : 'órdenes'}
          </span>
        )}
      </div>

      {!orders && (
        <div className="space-y-2">
          <RowSkeleton />
          <RowSkeleton />
        </div>
      )}

      {orders && orders.length === 0 && (
        <div className="rounded-xl border border-neutral-200 bg-white p-10 text-center">
          <ShoppingBag className="mx-auto text-neutral-300" size={40} />
          <p className="mt-3 text-neutral-500">Aún no tienes órdenes.</p>
          <Link
            href="/products"
            className="mt-4 inline-block rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Explorar catálogo
          </Link>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
              <div className="flex items-baseline justify-between border-b border-neutral-100 bg-neutral-50 px-5 py-3">
                <h3 className="font-semibold">
                  Orden <span className="text-emerald-700">#{o.id}</span>
                </h3>
                <span className="text-xs text-neutral-500">
                  {new Date(o.createdAt).toLocaleString('es-CO', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
              <div className="divide-y divide-neutral-100">
                {o.items.map((it) => (
                  <div key={it.id} className="flex items-center gap-3 px-5 py-2.5 text-sm">
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-neutral-100">
                      {it.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${it.id}`}
                        className="line-clamp-1 font-medium hover:text-emerald-700"
                      >
                        {it.name}
                      </Link>
                      <p className="text-xs text-neutral-500">
                        {it.OrderProduct.amount} × {money(it.price)}
                      </p>
                    </div>
                    <span className="font-medium tabular-nums">
                      {money(it.price * it.OrderProduct.amount)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-baseline justify-between border-t border-neutral-100 bg-neutral-50 px-5 py-3 font-bold">
                <span>Total</span>
                <span className="text-emerald-700">{money(o.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
