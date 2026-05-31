'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/lib/cart-store';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/Toast';
import { api } from '@/lib/api';
import { money } from '@/lib/format';
import type { Product } from '@/lib/types';

type Props = {
  product: Product;
  onDeleted?: (id: number) => void;
};

export default function ProductCard({ product, onDeleted }: Props) {
  const add = useCart((s) => s.add);
  const toast = useToast();
  const { user, token } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [deleting, setDeleting] = useState(false);

  function onAdd() {
    add(product, 1);
    toast.success(`"${product.name}" agregado`);
  }

  async function onDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!token) return;
    if (!confirm(`¿Eliminar "${product.name}"?`)) return;
    setDeleting(true);
    try {
      await api.deleteProduct(token, product.id);
      toast.success('Producto eliminado');
      onDeleted?.(product.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar');
      setDeleting(false);
    }
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/5">
      {/* Admin overlay */}
      {isAdmin && (
        <div className="pointer-events-none absolute right-2 top-2 z-10 flex gap-1 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
          <Link
            href={`/admin/products/${product.id}`}
            onClick={(e) => e.stopPropagation()}
            title="Editar"
            className="rounded-full bg-white p-1.5 text-neutral-700 shadow-md hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Pencil size={14} />
          </Link>
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            title="Eliminar"
            className="rounded-full bg-white p-1.5 text-red-600 shadow-md hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      <Link
        href={`/products/${product.id}`}
        className="block aspect-square overflow-hidden bg-neutral-100"
      >
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
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
          className="line-clamp-2 text-sm font-medium leading-snug transition-colors hover:text-emerald-700"
        >
          {product.name}
        </Link>
        <p className="text-lg font-bold tracking-tight text-emerald-700">{money(product.price)}</p>
        <button
          onClick={onAdd}
          className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-md bg-neutral-900 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-emerald-700 active:scale-95"
        >
          <Plus size={14} /> Agregar
        </button>
      </div>
    </div>
  );
}

export function AddProductTile() {
  return (
    <Link
      href="/admin/products/new"
      className="group flex h-full min-h-[240px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-6 text-emerald-700 transition-all hover:-translate-y-1 hover:border-emerald-500 hover:bg-emerald-100 hover:shadow-xl hover:shadow-emerald-900/5"
    >
      <div className="rounded-full bg-emerald-600 p-3 text-white shadow-md transition-transform group-hover:scale-110 group-hover:rotate-90">
        <Plus size={24} />
      </div>
      <span className="text-sm font-semibold">Nuevo producto</span>
      <span className="text-center text-xs text-emerald-600/70">Crea uno desde aquí</span>
    </Link>
  );
}

export function AddCategoryTile() {
  return (
    <Link
      href="/admin/categories/new"
      className="group flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-6 text-emerald-700 transition-all hover:-translate-y-1 hover:border-emerald-500 hover:bg-emerald-100 hover:shadow-xl hover:shadow-emerald-900/5"
    >
      <div className="rounded-full bg-emerald-600 p-3 text-white shadow-md transition-transform group-hover:scale-110 group-hover:rotate-90">
        <Plus size={24} />
      </div>
      <span className="text-sm font-semibold">Nueva categoría</span>
    </Link>
  );
}
