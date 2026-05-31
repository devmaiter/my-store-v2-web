'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import CategoryForm from '../CategoryForm';

export default function NewCategoryPage() {
  return (
    <div className="space-y-4">
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-emerald-700"
      >
        <ChevronLeft size={14} /> Volver
      </Link>
      <h1 className="text-2xl font-bold">Nueva categoría</h1>
      <CategoryForm />
    </div>
  );
}
