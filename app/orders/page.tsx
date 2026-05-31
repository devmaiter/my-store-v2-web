'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import type { Order } from '@/lib/types';
import { money } from '@/lib/format';

export default function OrdersPage() {
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
      <div className="mx-auto max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-bold">Inicia sesión</h1>
        <Link href="/login" className="inline-block rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700">
          Login
        </Link>
      </div>
    );
  }

  if (error) return <p className="rounded-md bg-red-50 p-4 text-red-700">Error: {error}</p>;
  if (!orders) return <p className="text-neutral-500">Cargando…</p>;

  return (
    <div className="space-y-6">
      {justId && (
        <div className="flex items-center gap-2 rounded-md bg-emerald-50 p-4 text-emerald-800">
          <CheckCircle2 size={20} />
          <span>¡Orden #{justId} creada con éxito!</span>
        </div>
      )}
      <h1 className="text-2xl font-bold">Mis órdenes</h1>
      {orders.length === 0 ? (
        <p className="text-neutral-500">Aún no tienes órdenes.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="rounded-lg border border-neutral-200 bg-white p-4">
              <div className="mb-3 flex items-baseline justify-between">
                <h3 className="font-semibold">Orden #{o.id}</h3>
                <span className="text-sm text-neutral-500">{new Date(o.createdAt).toLocaleString('es-CO')}</span>
              </div>
              <div className="space-y-1 text-sm">
                {o.items.map((it) => (
                  <div key={it.id} className="flex justify-between">
                    <span>{it.OrderProduct.amount}× {it.name}</span>
                    <span>{money(it.price * it.OrderProduct.amount)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between border-t border-neutral-100 pt-3 font-bold">
                <span>Total</span>
                <span>{money(o.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
