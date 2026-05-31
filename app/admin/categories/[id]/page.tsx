'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/Toast';
import type { Category } from '@/lib/types';
import CategoryForm from '../CategoryForm';

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const toast = useToast();
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    api
      .getCategory(id)
      .then(setCategory)
      .catch((e) => toast.error(e instanceof Error ? e.message : 'No se pudo cargar'));
  }, [id, toast]);

  return (
    <div className="space-y-4">
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-emerald-700"
      >
        <ChevronLeft size={14} /> Volver
      </Link>
      <h1 className="text-2xl font-bold">
        Editar categoría {category && <span className="text-neutral-400">#{category.id}</span>}
      </h1>
      {category ? (
        <CategoryForm initial={category} />
      ) : (
        <p className="text-neutral-500">Cargando…</p>
      )}
    </div>
  );
}
