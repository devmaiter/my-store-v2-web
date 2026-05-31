'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useCart } from '@/lib/cart-store';
import { money } from '@/lib/format';
import type { Product } from '@/lib/types';

export default function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/products/${product.id}`} className="block aspect-square overflow-hidden bg-neutral-100">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={product.name} className="h-full w-full object-cover transition group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">sin imagen</div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/products/${product.id}`} className="line-clamp-2 font-semibold hover:underline">
          {product.name}
        </Link>
        <p className="text-lg font-bold text-emerald-600">{money(product.price)}</p>
        <button
          onClick={() => add(product, 1)}
          className="mt-auto inline-flex items-center justify-center gap-1 rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-700"
        >
          <Plus size={14} /> Agregar al carrito
        </button>
      </div>
    </div>
  );
}
