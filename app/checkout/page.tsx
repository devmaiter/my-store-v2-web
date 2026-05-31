'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, CreditCard, Lock, ShoppingBag } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { useCart } from '@/lib/cart-store';
import { useToast } from '@/components/Toast';
import { money } from '@/lib/format';

export default function CheckoutPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const lines = useCart((s) => s.lines);
  const totalPrice = useCart((s) => s.totalPrice());
  const totalItems = useCart((s) => s.totalItems());
  const clear = useCart((s) => s.clear);
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (!token) {
    return (
      <div className="mx-auto max-w-md space-y-3 rounded-xl border border-neutral-200 bg-white p-10 text-center">
        <Lock className="mx-auto text-neutral-300" size={40} />
        <h1 className="text-2xl font-bold">Inicia sesión para continuar</h1>
        <p className="text-sm text-neutral-600">Necesitas una cuenta para crear una orden.</p>
        <Link
          href="/login?next=/checkout"
          className="inline-block rounded-md bg-emerald-600 px-4 py-2.5 font-medium text-white hover:bg-emerald-700"
        >
          Login
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-md space-y-3 rounded-xl border border-neutral-200 bg-white p-10 text-center">
        <ShoppingBag className="mx-auto text-neutral-300" size={40} />
        <h1 className="text-2xl font-bold">No hay nada que comprar</h1>
        <Link
          href="/products"
          className="inline-block rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  async function onConfirm() {
    setError(null);
    setLoading(true);
    try {
      const order = await api.createOrder(
        token!,
        lines.map((l) => ({ productId: l.product.id, amount: l.amount })),
      );
      clear();
      toast.success(`Orden #${order.id} creada`);
      router.push(`/orders?just=${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'no se pudo crear la orden');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Comprando como <span className="font-medium text-neutral-800">{user?.email}</span>
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_280px]">
        <div className="space-y-2 rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Detalle ({totalItems})
          </h2>
          <div className="divide-y divide-neutral-100">
            {lines.map((l) => (
              <div key={l.product.id} className="flex items-center gap-3 py-3 text-sm">
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-neutral-100">
                  {l.product.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={l.product.image}
                      alt={l.product.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 font-medium">{l.product.name}</p>
                  <p className="text-xs text-neutral-500">
                    {l.amount} × {money(l.product.price)}
                  </p>
                </div>
                <span className="font-medium tabular-nums">
                  {money(l.product.price * l.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <aside className="h-fit space-y-4 rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Resumen</h2>
          <div className="space-y-1.5 border-y border-neutral-100 py-3 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Subtotal</span>
              <span className="tabular-nums">{money(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Envío</span>
              <span className="text-emerald-700">Gratis</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-semibold">Total</span>
            <span className="text-2xl font-bold tabular-nums">{money(totalPrice)}</span>
          </div>

          {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <button
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-emerald-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? (
              'Procesando…'
            ) : (
              <>
                <CheckCircle2 size={16} /> Confirmar orden
              </>
            )}
          </button>
          <p className="flex items-center justify-center gap-1 text-xs text-neutral-500">
            <CreditCard size={12} /> Demo · sin pago real
          </p>
        </aside>
      </div>
    </div>
  );
}
