'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '@/lib/cart-store';
import { money } from '@/lib/format';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const lines = useCart((s) => s.lines);
  const remove = useCart((s) => s.remove);
  const setAmount = useCart((s) => s.setAmount);
  const totalPrice = useCart((s) => s.totalPrice());
  const totalItems = useCart((s) => s.totalItems());
  const clear = useCart((s) => s.clear);

  if (!mounted) return null;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
        <Link href="/products" className="inline-block rounded-md bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700">
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Carrito ({totalItems})</h1>
      <div className="space-y-3">
        {lines.map((l) => (
          <div key={l.product.id} className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100">
              {l.product.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={l.product.image} alt={l.product.name} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex-1">
              <Link href={`/products/${l.product.id}`} className="font-semibold hover:underline">
                {l.product.name}
              </Link>
              <p className="text-sm text-neutral-600">{money(l.product.price)} c/u</p>
            </div>
            <div className="inline-flex items-center rounded-md border border-neutral-300">
              <button onClick={() => setAmount(l.product.id, l.amount - 1)} className="px-2 py-1 hover:bg-neutral-100">
                <Minus size={14} />
              </button>
              <span className="w-8 text-center">{l.amount}</span>
              <button onClick={() => setAmount(l.product.id, l.amount + 1)} className="px-2 py-1 hover:bg-neutral-100">
                <Plus size={14} />
              </button>
            </div>
            <p className="w-24 text-right font-semibold">{money(l.product.price * l.amount)}</p>
            <button onClick={() => remove(l.product.id)} className="text-red-600 hover:text-red-800" aria-label="Eliminar">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4">
        <button onClick={clear} className="text-sm text-neutral-600 hover:underline">
          Vaciar carrito
        </button>
        <div className="text-right">
          <p className="text-sm text-neutral-600">Total</p>
          <p className="text-2xl font-bold">{money(totalPrice)}</p>
        </div>
      </div>

      <Link href="/checkout" className="block rounded-md bg-emerald-600 px-4 py-3 text-center font-semibold text-white hover:bg-emerald-700">
        Ir a checkout →
      </Link>
    </div>
  );
}
