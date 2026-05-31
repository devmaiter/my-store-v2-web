'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/Toast';
import { AddCategoryTile } from '@/components/ProductCard';
import type { Category } from '@/lib/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const { user, token } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isAdmin = mounted && user?.role === 'admin';
  const toast = useToast();

  useEffect(() => {
    api.listCategories().then(setCategories).catch((e) => setError(e.message));
  }, []);

  async function remove(e: React.MouseEvent, c: Category) {
    e.preventDefault();
    e.stopPropagation();
    if (!token) return;
    if (!confirm(`¿Eliminar "${c.name}"? Los productos quedarán sin categoría.`)) return;
    setBusyId(c.id);
    try {
      await api.deleteCategory(token, c.id);
      toast.success('Categoría eliminada');
      setCategories((cur) => cur?.filter((x) => x.id !== c.id) ?? cur);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold">Categorías</h1>
        <p className="mt-1 text-sm text-neutral-600">Explora el catálogo agrupado por tipo de producto.</p>
      </div>

      {error && <p className="rounded-md bg-red-50 p-4 text-red-700">Error: {error}</p>}

      {!categories && !error && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] animate-pulse rounded-lg bg-neutral-200" />
          ))}
        </div>
      )}

      {categories && categories.length === 0 && !isAdmin && (
        <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
          Aún no hay categorías.
        </div>
      )}

      {categories && (categories.length > 0 || isAdmin) && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {isAdmin && (
            <div className="animate-scale-in">
              <AddCategoryTile />
            </div>
          )}
          {categories.map((c, i) => (
            <Link
              key={c.id}
              href={`/categories/${c.id}`}
              style={{ animationDelay: `${i * 50}ms` }}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl animate-fade-up"
            >
              {c.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.image}
                  alt={c.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
                <span className="text-lg font-bold text-white drop-shadow">{c.name}</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs text-white backdrop-blur transition-colors group-hover:bg-emerald-500">
                  Ver →
                </span>
              </div>

              {/* Admin overlay */}
              {isAdmin && (
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Link
                    href={`/admin/categories/${c.id}`}
                    onClick={(e) => e.stopPropagation()}
                    title="Editar"
                    className="rounded-full bg-white p-1.5 text-neutral-700 shadow-md hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <Pencil size={14} />
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => remove(e, c)}
                    disabled={busyId === c.id}
                    title="Eliminar"
                    className="rounded-full bg-white p-1.5 text-red-600 shadow-md hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
