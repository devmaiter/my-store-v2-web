'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Code2, Database, Linkedin, Lock, Mail, ShoppingBag, Sparkles, Zap } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';
const SWAGGER_URL = `${API_BASE.replace(/\/api\/v1\/?$/, '')}/docs`;
import { api } from '@/lib/api';
import type { Category, Product } from '@/lib/types';
import ProductCard, { AddProductTile } from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/Skeleton';
import { useAuth } from '@/lib/auth-store';

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    Promise.all([api.listProducts({ limit: 8 }), api.listCategories()])
      .then(([p, c]) => {
        setFeatured(p.items);
        setCategories(c);
      })
      .catch((e) => setError(e.message));
  }, []);

  const isAdmin = mounted && user?.role === 'admin';
  const isAuthed = mounted && !!user;

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-8 text-white shadow-lg animate-fade-up md:p-12">
        <div className="absolute -right-12 -top-12 h-64 w-64 animate-pulse rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-12 h-72 w-72 animate-pulse rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur animate-fade-down">
            <Zap size={12} /> Demo live · Next.js 16 + Express + Postgres
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl animate-fade-up stagger-1">
            Bienvenido a<br />
            <span className="bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
              Julian Store
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-emerald-50 md:text-lg animate-fade-up stagger-2">
            {isAuthed ? (
              <>
                Hola, <span className="font-semibold">{user.email.split('@')[0]}</span>. Explora el catálogo o
                {isAdmin ? ' gestiona tus productos.' : ' continúa con tu compra.'}
              </>
            ) : (
              'Tu tienda online de demostración: catálogo dinámico, carrito persistente, checkout autenticado con JWT y panel admin en tiempo real.'
            )}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 animate-fade-up stagger-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 rounded-md bg-white px-4 py-2.5 font-medium text-emerald-700 transition-all hover:bg-emerald-50 hover:shadow-md"
            >
              <ShoppingBag size={16} /> Ver catálogo
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-md bg-amber-400 px-4 py-2.5 font-medium text-amber-900 transition-all hover:bg-amber-300 hover:shadow-md"
              >
                <Sparkles size={16} /> Panel admin
              </Link>
            )}
            {!isAuthed && mounted && (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-md border border-white/30 px-4 py-2.5 font-medium text-white backdrop-blur transition-all hover:bg-white/10"
              >
                <Lock size={16} /> Login demo
              </Link>
            )}
            <a
              href={SWAGGER_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-white/30 px-4 py-2.5 font-medium text-white backdrop-blur transition-all hover:bg-white/10"
              title="Ver el backend en vivo (Swagger UI con endpoints)"
            >
              <Database size={16} /> Ver backend
              <span className="ml-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-200" />
            </a>
          </div>
          {!isAuthed && mounted && (
            <p className="mt-3 text-xs text-emerald-100/90 animate-fade-up stagger-4">
              Prueba como admin: <code className="rounded bg-black/20 px-1 py-0.5 font-mono">admin@store.com</code> /{' '}
              <code className="rounded bg-black/20 px-1 py-0.5 font-mono">superSecret123</code>
            </p>
          )}
        </div>
      </section>

      {/* Categories grid */}
      <section className="animate-fade-up stagger-2">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Explora por categoría</h2>
          <Link href="/categories" className="inline-flex items-center gap-1 text-sm text-emerald-700 hover:underline">
            Ver todas <ArrowRight size={14} />
          </Link>
        </div>
        {categories === null ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-lg bg-neutral-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {categories.slice(0, 6).map((c, i) => (
              <Link
                key={c.id}
                href={`/categories/${c.id}`}
                style={{ animationDelay: `${i * 50}ms` }}
                className="group relative aspect-square overflow-hidden rounded-lg bg-neutral-100 animate-scale-in"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span className="absolute inset-x-2 bottom-2 truncate text-sm font-semibold text-white">
                  {c.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured */}
      <section className="animate-fade-up stagger-3">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Destacados</h2>
          <Link href="/products" className="inline-flex items-center gap-1 text-sm text-emerald-700 hover:underline">
            Ver todo <ArrowRight size={14} />
          </Link>
        </div>
        {error && <p className="rounded-md bg-red-50 p-4 text-red-700">Error: {error}</p>}
        {featured === null && !error && <ProductGridSkeleton count={8} />}
        {featured && featured.length === 0 && !isAdmin && (
          <p className="rounded-md border border-dashed border-neutral-300 bg-white p-6 text-center text-neutral-500">
            Aún no hay productos en el catálogo.
          </p>
        )}
        {featured && (featured.length > 0 || isAdmin) && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {isAdmin && (
              <div className="animate-scale-in">
                <AddProductTile />
              </div>
            )}
            {featured.map((p, i) => (
              <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                <ProductCard product={p} onDeleted={(id) => setFeatured((cur) => cur?.filter((x) => x.id !== id) ?? cur)} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* About / portfolio callout */}
      <section className="animate-fade-up overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:p-10">
        <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <Code2 size={12} /> Sobre este proyecto
            </span>
            <h2 className="text-2xl font-bold tracking-tight">
              Esto es portfolio, no producción real.
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
              Soy <strong className="text-neutral-800">Julian Osorio</strong>, full-stack freelance
              en Colombia 🇨🇴. Este demo es público para mostrar cómo trabajo de punta a punta:
              API REST en Express con auth JWT, base de datos Postgres con migraciones y seeders,
              storefront en Next.js 16 con state persistente y panel admin con CRUD en vivo, todo
              desplegado en Railway + Vercel. Si te interesa contratarme para un proyecto similar,
              hablemos.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href="https://www.linkedin.com/in/oscar-julian-osorio-romero/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-[#0a66c2] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <Linkedin size={16} /> LinkedIn
            </a>
            <a
              href="mailto:f1000161620@gmail.com?subject=Hablemos%20de%20un%20proyecto"
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <Mail size={16} /> Escríbeme
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
