'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/lib/cart-store';
import { useToast } from '@/components/Toast';
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
  const toast = useToast();

  if (!mounted) return null;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-md space-y-4 rounded-xl border border-neutral-200 bg-white p-10 text-center">
        <ShoppingBag className="mx-auto text-neutral-300" size={48} />
        <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
        <p className="text-sm text-neutral-600">Agrega productos del catálogo para empezar.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-4 py-2.5 font-medium text-white hover:bg-emerald-700"
        >
          Ver catálogo <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-bold">Carrito</h1>
          <span className="text-sm text-neutral-500">
            {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}
          </span>
        </div>

        <div className="space-y-3">
          {lines.map((l) => (
            <div
              key={l.product.id}
              className="flex flex-wrap items-center gap-4 rounded-lg border border-neutral-200 bg-white p-3 sm:flex-nowrap"
            >
              <Link
                href={`/products/${l.product.id}`}
                className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100"
              >
                {l.product.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={l.product.image}
                    alt={l.product.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${l.product.id}`}
                  className="line-clamp-2 font-medium hover:text-emerald-700"
                >
                  {l.product.name}
                </Link>
                <p className="text-xs text-neutral-500">{money(l.product.price)} c/u</p>
              </div>
              <div className="inline-flex items-center rounded-md border border-neutral-300 bg-white">
                <button
                  onClick={() => setAmount(l.product.id, l.amount - 1)}
                  className="px-2.5 py-1.5 hover:bg-neutral-100"
                  aria-label="Disminuir"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-sm font-medium">{l.amount}</span>
                <button
                  onClick={() => setAmount(l.product.id, l.amount + 1)}
                  className="px-2.5 py-1.5 hover:bg-neutral-100"
                  aria-label="Aumentar"
                >
                  <Plus size={14} />
                </button>
              </div>
              <p className="w-24 text-right font-semibold tabular-nums">
                {money(l.product.price * l.amount)}
              </p>
              <button
                onClick={() => {
                  remove(l.product.id);
                  toast.info('Producto eliminado');
                }}
                className="rounded-md p-1.5 text-red-600 hover:bg-red-50"
                aria-label="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            clear();
            toast.info('Carrito vaciado');
          }}
          className="text-sm text-neutral-600 hover:text-red-600 hover:underline"
        >
          Vaciar carrito
        </button>
      </div>

      {/* Summary */}
      <aside className="sticky top-20 h-fit space-y-4 rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Resumen</h2>
        <div className="space-y-1.5 border-y border-neutral-100 py-3 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-600">Subtotal</span>
            <span className="font-medium tabular-nums">{money(totalPrice)}</span>
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
        <Link
          href="/checkout"
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-emerald-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Ir al checkout <ArrowRight size={16} />
        </Link>
        <Link
          href="/products"
          className="block text-center text-sm text-neutral-600 hover:text-emerald-700"
        >
          ← Seguir comprando
        </Link>
      </aside>
    </div>
  );
}
