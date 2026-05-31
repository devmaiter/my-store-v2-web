'use client';

import Link from 'next/link';
import { ShoppingCart, LogOut, User } from 'lucide-react';
import { useAuth } from '@/lib/auth-store';
import { useCart } from '@/lib/cart-store';
import { useEffect, useState } from 'react';

export default function Header() {
  const { user, clear } = useAuth();
  const totalItems = useCart((s) => s.totalItems());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold tracking-tight">
          my-store<span className="text-emerald-600">.v2</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link className="hover:underline" href="/products">Productos</Link>
          <Link className="hover:underline" href="/categories">Categorías</Link>
          {mounted && user && (
            <Link className="hover:underline" href="/orders">Mis órdenes</Link>
          )}
          <Link href="/cart" className="relative inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-neutral-100">
            <ShoppingCart size={18} />
            <span>Carrito</span>
            {mounted && totalItems > 0 && (
              <span className="absolute -right-2 -top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>
          {mounted && user ? (
            <button
              onClick={clear}
              className="inline-flex items-center gap-1 rounded-md border border-neutral-300 px-2 py-1 text-xs hover:bg-neutral-100"
              title={user.email}
            >
              <User size={14} /> {user.email.split('@')[0]} <LogOut size={14} />
            </button>
          ) : mounted ? (
            <Link className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700" href="/login">
              Login
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
