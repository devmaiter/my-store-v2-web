'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Database, ShoppingCart, LogOut, User, Shield, Store } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-store';
import { useCart } from '@/lib/cart-store';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';
const SWAGGER_URL = `${API_BASE.replace(/\/api\/v1\/?$/, '')}/docs`;
const RAILWAY_PG_URL = 'https://railway.com/project/70667544-d497-44a0-a3d4-c53c8df4658e';

export default function Header() {
  const { user, clear } = useAuth();
  const totalItems = useCart((s) => s.totalItems());
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isAdmin = user?.role === 'admin';

  const navLink = (href: string, label: string) => {
    const active = pathname === href || pathname.startsWith(href + '/');
    return (
      <Link
        href={href}
        className={`relative px-1 py-1 text-sm transition-colors ${
          active ? 'text-emerald-700' : 'text-neutral-700 hover:text-emerald-700'
        }`}
      >
        {label}
        {active && (
          <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-emerald-600" />
        )}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="group flex items-center gap-2 text-xl font-bold tracking-tight">
          <span className="rounded-md bg-emerald-600 p-1.5 text-white transition-transform group-hover:scale-105">
            <Store size={18} />
          </span>
          <span>
            Julian<span className="text-emerald-600"> Store</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLink('/products', 'Productos')}
          {navLink('/categories', 'Categorías')}
          {mounted && user && navLink('/orders', 'Mis órdenes')}
          {mounted && isAdmin && navLink('/admin', 'Admin')}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={SWAGGER_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 rounded-md bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-700"
            title="Abrir Swagger UI con los endpoints del backend"
          >
            <Database size={14} />
            <span>Backend</span>
            <span className="ml-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
          </a>
          <a
            href={RAILWAY_PG_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 rounded-md bg-purple-700 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-purple-800"
            title="Abrir el servicio Postgres en Railway (queries SQL directos)"
          >
            <Database size={14} />
            <span>Postgres</span>
          </a>
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Carrito</span>
            {mounted && totalItems > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-xs font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {mounted && user ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                  <Shield size={12} /> admin
                </span>
              )}
              <div className="flex items-center gap-1.5 rounded-md border border-neutral-200 px-2 py-1.5 text-xs">
                <User size={14} className="text-neutral-500" />
                <span className="hidden sm:inline">{user.email.split('@')[0]}</span>
                <button
                  onClick={clear}
                  title="Cerrar sesión"
                  className="ml-1 text-neutral-500 hover:text-red-600"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          ) : mounted ? (
            <Link
              href="/login"
              className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Login
            </Link>
          ) : null}
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center justify-center gap-5 border-t border-neutral-100 bg-white px-4 py-2 text-xs md:hidden">
        {navLink('/products', 'Productos')}
        {navLink('/categories', 'Categorías')}
        {mounted && user && navLink('/orders', 'Órdenes')}
        {mounted && isAdmin && navLink('/admin', 'Admin')}
      </nav>
    </header>
  );
}
