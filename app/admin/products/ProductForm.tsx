'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { api, type ProductInput } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/Toast';
import type { Category, Product } from '@/lib/types';

export default function ProductForm({ initial }: { initial?: Product }) {
  const router = useRouter();
  const token = useAuth((s) => s.token);
  const toast = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductInput>({
    name: initial?.name ?? '',
    price: initial?.price ?? 0,
    image: initial?.image ?? '',
    description: initial?.description ?? '',
    categoryId: initial?.categoryId ?? null,
    isBlocked: initial?.isBlocked ?? false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.listCategories().then(setCategories).catch(() => {});
  }, []);

  function update<K extends keyof ProductInput>(k: K, v: ProductInput[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      const body: ProductInput = {
        name: form.name,
        price: Number(form.price),
        image: form.image || undefined,
        description: form.description || undefined,
        categoryId: form.categoryId || null,
        isBlocked: !!form.isBlocked,
      };
      if (initial) {
        await api.updateProduct(token, initial.id, body);
        toast.success('Producto actualizado');
      } else {
        await api.createProduct(token, body);
        toast.success('Producto creado');
      }
      router.push('/admin/products');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-[1fr_300px]">
      <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
        <Field label="Nombre" required>
          <input
            type="text"
            required
            minLength={3}
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="input"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Precio (COP)" required>
            <input
              type="number"
              required
              min={10}
              value={form.price || ''}
              onChange={(e) => update('price', Number(e.target.value))}
              className="input"
            />
          </Field>
          <Field label="Categoría">
            <select
              value={form.categoryId ?? ''}
              onChange={(e) => update('categoryId', e.target.value ? Number(e.target.value) : null)}
              className="input"
            >
              <option value="">— Sin categoría —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="URL de la imagen">
          <input
            type="url"
            value={form.image ?? ''}
            onChange={(e) => update('image', e.target.value)}
            placeholder="https://..."
            className="input"
          />
        </Field>

        <Field label="Descripción">
          <textarea
            rows={4}
            value={form.description ?? ''}
            onChange={(e) => update('description', e.target.value)}
            className="input"
          />
        </Field>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!form.isBlocked}
            onChange={(e) => update('isBlocked', e.target.checked)}
          />
          Bloqueado (oculto del catálogo público)
        </label>

        <div className="flex gap-2 border-t border-neutral-100 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? 'Guardando…' : initial ? 'Guardar cambios' : 'Crear producto'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Cancelar
          </button>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Vista previa
          </div>
          <div className="aspect-square overflow-hidden rounded-md bg-neutral-100">
            {form.image ? (
              <Image
                src={form.image}
                alt={form.name || 'preview'}
                width={300}
                height={300}
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                Sin imagen
              </div>
            )}
          </div>
          <div className="mt-2 truncate font-medium">{form.name || 'Nombre del producto'}</div>
          <div className="text-sm text-emerald-700">
            {form.price ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(form.price)) : '—'}
          </div>
        </div>
      </aside>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-neutral-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
