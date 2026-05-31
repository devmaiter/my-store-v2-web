'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart, Tag } from 'lucide-react';
import { api } from '@/lib/api';
import type { Category, Product } from '@/lib/types';
import { useCart } from '@/lib/cart-store';
import { useToast } from '@/components/Toast';
import { money } from '@/lib/format';
import ProductCard from '@/components/ProductCard';
import { ProductGridSkeleton, Skeleton } from '@/components/Skeleton';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [related, setRelated] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState(1);
  const add = useCart((s) => s.add);
  const toast = useToast();

  useEffect(() => {
    setProduct(null);
    setCategory(null);
    setRelated(null);
    api
      .getProduct(id)
      .then((p) => {
        setProduct(p);
        if (p.categoryId) {
          api.getCategory(p.categoryId).then((c) => {
            setCategory(c);
            setRelated(c.products?.filter((r) => r.id !== p.id).slice(0, 4) ?? []);
          });
        } else {
          setRelated([]);
        }
      })
      .catch((e) => setError(e.message));
  }, [id]);

  function onAdd() {
    if (!product) return;
    add(product, amount);
    toast.success(`${amount}× "${product.name}" agregado`);
  }

  if (error) return <p className="rounded-md bg-red-50 p-4 text-red-700">Error: {error}</p>;

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-neutral-500">
        <Link href="/" className="hover:text-emerald-700">Inicio</Link>
        <ChevronRight size={12} />
        <Link href="/products" className="hover:text-emerald-700">Productos</Link>
        {category && (
          <>
            <ChevronRight size={12} />
            <Link href={`/categories/${category.id}`} className="hover:text-emerald-700">
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight size={12} />
        <span className="truncate text-neutral-700">{product?.name ?? '…'}</span>
      </nav>

      {/* Main */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-xl border border-neutral-200 bg-white">
          {product ? (
            product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-neutral-400">
                sin imagen
              </div>
            )
          ) : (
            <Skeleton className="h-full w-full rounded-none" />
          )}
        </div>

        <div className="space-y-5">
          {product ? (
            <>
              {category && (
                <Link
                  href={`/categories/${category.id}`}
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                >
                  <Tag size={11} /> {category.name}
                </Link>
              )}
              <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
              <p className="text-4xl font-bold tracking-tight text-emerald-700">
                {money(product.price)}
              </p>
              {product.description && (
                <div className="rounded-lg bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-700">
                  {product.description}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="inline-flex items-center rounded-md border border-neutral-300 bg-white">
                  <button
                    onClick={() => setAmount(Math.max(1, amount - 1))}
                    className="px-3 py-2.5 hover:bg-neutral-100"
                    aria-label="Disminuir"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center font-medium">{amount}</span>
                  <button
                    onClick={() => setAmount(amount + 1)}
                    className="px-3 py-2.5 hover:bg-neutral-100"
                    aria-label="Aumentar"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={onAdd}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-3 font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  <ShoppingCart size={16} /> Agregar al carrito · {money(product.price * amount)}
                </button>
              </div>

              <Link
                href="/products"
                className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-emerald-700"
              >
                <ChevronLeft size={14} /> Seguir comprando
              </Link>
            </>
          ) : (
            <>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
            </>
          )}
        </div>
      </div>

      {/* Related */}
      {related !== null && related.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">Más en esta categoría</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((r) => (
              <ProductCard key={r.id} product={r} />
            ))}
          </div>
        </section>
      )}
      {related === null && product?.categoryId && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">Más en esta categoría</h2>
          <ProductGridSkeleton count={4} />
        </section>
      )}
    </div>
  );
}
