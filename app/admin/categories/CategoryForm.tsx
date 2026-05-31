'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { api, type CategoryInput } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/Toast';
import type { Category } from '@/lib/types';

export default function CategoryForm({ initial }: { initial?: Category }) {
  const router = useRouter();
  const token = useAuth((s) => s.token);
  const toast = useToast();
  const [form, setForm] = useState<CategoryInput>({
    name: initial?.name ?? '',
    image: initial?.image ?? '',
  });
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      const body: CategoryInput = {
        name: form.name,
        image: form.image || undefined,
      };
      if (initial) {
        await api.updateCategory(token, initial.id, body);
        toast.success('Categoría actualizada');
      } else {
        await api.createCategory(token, body);
        toast.success('Categoría creada');
      }
      router.push('/admin/categories');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-[1fr_280px]">
      <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5">
        <label className="block">
          <span className="text-sm font-medium text-neutral-700">
            Nombre <span className="text-red-500">*</span>
          </span>
          <input
            type="text"
            required
            minLength={2}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input mt-1"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-neutral-700">URL de la imagen</span>
          <input
            type="url"
            value={form.image ?? ''}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="https://..."
            className="input mt-1"
          />
        </label>

        <div className="flex gap-2 border-t border-neutral-100 pt-4">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Guardando…' : initial ? 'Guardar cambios' : 'Crear categoría'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-secondary">
            Cancelar
          </button>
        </div>
      </div>

      <aside className="rounded-lg border border-neutral-200 bg-white p-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Vista previa
        </div>
        <div className="aspect-[3/2] overflow-hidden rounded-md bg-neutral-100">
          {form.image ? (
            <Image
              src={form.image}
              alt={form.name || 'preview'}
              width={300}
              height={200}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-neutral-400">
              Sin imagen
            </div>
          )}
        </div>
        <div className="mt-2 font-medium">{form.name || 'Nombre'}</div>
      </aside>
    </form>
  );
}
