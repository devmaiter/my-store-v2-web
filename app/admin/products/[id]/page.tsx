'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/Toast';
import type { Product } from '@/lib/types';
import ProductForm from '../ProductForm';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const toast = useToast();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    api
      .getProduct(id)
      .then(setProduct)
      .catch((e) => toast.error(e instanceof Error ? e.message : 'No se pudo cargar'));
  }, [id, toast]);

  return (
    <div className="space-y-4">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-emerald-700"
      >
        <ChevronLeft size={14} /> Volver
      </Link>
      <h1 className="text-2xl font-bold">
        Editar producto {product && <span className="text-neutral-400">#{product.id}</span>}
      </h1>
      {product ? <ProductForm initial={product} /> : <p className="text-neutral-500">Cargando…</p>}
    </div>
  );
}
