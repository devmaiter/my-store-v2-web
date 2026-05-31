'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useCart } from '@/lib/cart-store';
import { useToast } from '@/components/Toast';
import { money } from '@/lib/format';
import type { Product } from '@/lib/types';

export default function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const toast = useToast();

  function onAdd() {
    add(product, 1);
    toast.success(`"${product.name}" agregado`);
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <Link
        href={`/products/${product.id}`}
        className="block aspect-square overflow-hidden bg-neutral-100"
      >
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
            sin imagen
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link
          href={`/products/${product.id}`}
          className="line-clamp-2 text-sm font-medium leading-snug hover:text-emerald-700"
        >
          {product.name}
        </Link>
        <p className="text-lg font-bold tracking-tight text-emerald-700">{money(product.price)}</p>
        <button
          onClick={onAdd}
          className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-md bg-neutral-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-700"
        >
          <Plus size={14} /> Agregar
        </button>
      </div>
    </div>
  );
}
