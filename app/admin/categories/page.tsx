'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/Toast';
import type { Category } from '@/lib/types';
import { RowSkeleton } from '@/components/Skeleton';

export default function AdminCategoriesPage() {
  const token = useAuth((s) => s.token);
  const toast = useToast();
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  async function load() {
    try {
      setCategories(await api.listCategories());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al cargar');
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(c: Category) {
    if (!token) return;
    if (!confirm(`¿Eliminar "${c.name}"? Los productos quedarán sin categoría.`)) return;
    setBusyId(c.id);
    try {
      await api.deleteCategory(token, c.id);
      toast.success('Categoría eliminada');
      setCategories((cur) => cur?.filter((x) => x.id !== c.id) ?? cur);
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
          <h1 className="text-2xl font-bold">Categorías</h1>
          <p className="text-sm text-neutral-600">
            {categories ? `${categories.length} categorías` : 'Cargando…'}
          </p>
        </div>
        <Link href="/admin/categories/new" className="btn-primary">
          <Plus size={16} /> Nueva
        </Link>
      </div>

      {!categories && (
        <div className="space-y-2">
          <RowSkeleton />
          <RowSkeleton />
        </div>
      )}

      {categories && categories.length === 0 && (
        <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
          No hay categorías.
        </div>
      )}

      {categories && categories.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div
              key={c.id}
              className="overflow-hidden rounded-lg border border-neutral-200 bg-white transition-shadow hover:shadow-md"
            >
              <div className="aspect-[3/2] bg-neutral-100">
                {c.image && (
                  <Image
                    src={c.image}
                    alt={c.name}
                    width={400}
                    height={260}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="p-3">
                <div className="font-semibold">{c.name}</div>
                <div className="text-xs text-neutral-500">ID #{c.id}</div>
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/admin/categories/${c.id}`}
                    className="inline-flex items-center gap-1 rounded-md border border-neutral-200 px-2 py-1 text-xs hover:bg-neutral-100"
                  >
                    <Pencil size={12} /> Editar
                  </Link>
                  <button
                    onClick={() => remove(c)}
                    disabled={busyId === c.id}
                    className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={12} /> {busyId === c.id ? '…' : 'Borrar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
