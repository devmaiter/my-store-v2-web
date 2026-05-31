'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/Toast';
import { money } from '@/lib/format';
import type { Product } from '@/lib/types';
import { RowSkeleton } from '@/components/Skeleton';

export default function AdminProductsPage() {
  const token = useAuth((s) => s.token);
  const toast = useToast();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  async function load() {
    try {
      const r = await api.listProducts({ limit: 100 });
      setProducts(r.items);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al cargar');
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(p: Product) {
    if (!token) return;
    if (!confirm(`¿Eliminar "${p.name}"?`)) return;
    setBusyId(p.id);
    try {
      await api.deleteProduct(token, p.id);
      toast.success('Producto eliminado');
      setProducts((cur) => cur?.filter((x) => x.id !== p.id) ?? cur);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al eliminar');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-sm text-neutral-600">
            {products ? `${products.length} en catálogo` : 'Cargando…'}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <Plus size={16} />
          Nuevo
        </Link>
      </div>

      {!products && (
        <div className="space-y-2">
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
        </div>
      )}

      {products && products.length === 0 && (
        <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
          No hay productos. <Link href="/admin/products/new" className="text-emerald-700 hover:underline">Crea uno.</Link>
        </div>
      )}

      {products && products.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-2.5">Producto</th>
                <th className="px-4 py-2.5">Precio</th>
                <th className="px-4 py-2.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {products.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.name}
                          width={40}
                          height={40}
                          unoptimized
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-neutral-200" />
                      )}
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-neutral-500">ID #{p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{money(p.price)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="inline-flex items-center gap-1 rounded-md border border-neutral-200 px-2 py-1 text-xs hover:bg-neutral-100"
                      >
                        <Pencil size={12} /> Editar
                      </Link>
                      <button
                        onClick={() => remove(p)}
                        disabled={busyId === p.id}
                        className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 size={12} /> {busyId === p.id ? '…' : 'Borrar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
