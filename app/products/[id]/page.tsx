'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Minus } from 'lucide-react';
import { api } from '@/lib/api';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-store';
import { money } from '@/lib/format';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState(1);
  const add = useCart((s) => s.add);

  useEffect(() => {
    api.getProduct(id).then(setProduct).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="rounded-md bg-red-50 p-4 text-red-700">Error: {error}</p>;
  if (!product) return <p className="text-neutral-500">Cargando…</p>;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="aspect-square overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400">sin imagen</div>
        )}
      </div>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-3xl font-bold text-emerald-600">{money(product.price)}</p>
        {product.description && <p className="text-neutral-700">{product.description}</p>}

        <div className="flex items-center gap-3 pt-2">
          <div className="inline-flex items-center rounded-md border border-neutral-300">
            <button
              onClick={() => setAmount(Math.max(1, amount - 1))}
              className="px-3 py-2 hover:bg-neutral-100"
              aria-label="Disminuir"
            >
              <Minus size={14} />
            </button>
            <span className="w-10 text-center font-medium">{amount}</span>
            <button
              onClick={() => setAmount(amount + 1)}
              className="px-3 py-2 hover:bg-neutral-100"
              aria-label="Aumentar"
            >
              <Plus size={14} />
            </button>
          </div>
          <button
            onClick={() => add(product, amount)}
            className="flex-1 rounded-md bg-emerald-600 px-4 py-2.5 font-medium text-white hover:bg-emerald-700"
          >
            Agregar al carrito
          </button>
        </div>

        <Link href="/products" className="inline-block text-sm text-emerald-700 hover:underline">
          ← Volver al catálogo
        </Link>
      </div>
    </div>
  );
}
