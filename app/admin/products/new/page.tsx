'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import ProductForm from '../ProductForm';

export default function NewProductPage() {
  return (
    <div className="space-y-4">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-emerald-700"
      >
        <ChevronLeft size={14} /> Volver
      </Link>
      <h1 className="text-2xl font-bold">Nuevo producto</h1>
      <ProductForm />
    </div>
  );
}
