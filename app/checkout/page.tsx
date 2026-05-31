'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { useCart } from '@/lib/cart-store';
import { money } from '@/lib/format';

export default function CheckoutPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const lines = useCart((s) => s.lines);
  const totalPrice = useCart((s) => s.totalPrice());
  const clear = useCart((s) => s.clear);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (!token) {
    return (
      <div className="mx-auto max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-bold">Inicia sesión para continuar</h1>
        <p className="text-neutral-600">Necesitas una cuenta para crear una orden.</p>
        <Link href="/login" className="inline-block rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700">
          Login
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-bold">No hay nada que comprar</h1>
        <Link href="/products" className="text-emerald-700 hover:underline">
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
      router.push(`/orders?just=${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'no se pudo crear la orden');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <p className="text-sm text-neutral-600">
        Comprando como <strong>{user?.email}</strong>
      </p>

      <div className="space-y-2 rounded-lg border border-neutral-200 bg-white p-4">
        {lines.map((l) => (
          <div key={l.product.id} className="flex justify-between border-b border-neutral-100 py-2 last:border-0">
            <span>
              {l.amount}× {l.product.name}
            </span>
            <span className="font-medium">{money(l.product.price * l.amount)}</span>
          </div>
        ))}
        <div className="flex justify-between pt-3 text-lg font-bold">
          <span>Total</span>
          <span>{money(totalPrice)}</span>
        </div>
      </div>

      {error && <p className="rounded-md bg-red-50 p-4 text-red-700">{error}</p>}

      <button
        onClick={onConfirm}
        disabled={loading}
        className="w-full rounded-md bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading ? 'Procesando…' : 'Confirmar y crear orden'}
      </button>
    </div>
  );
}
