'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Boxes, LayoutGrid, Package, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/lib/auth-store';

const sections = [
  { href: '/admin', label: 'Dashboard', Icon: LayoutGrid, exact: true },
  { href: '/admin/products', label: 'Productos', Icon: Package },
  { href: '/admin/categories', label: 'Categorías', Icon: Boxes },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (!token || !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [mounted, token, user, pathname, router]);

  if (!mounted) {
    return <p className="text-neutral-500">Cargando…</p>;
  }

  if (!user || !token) return null;

  if (user.role !== 'admin') {
    return (
      <div className="mx-auto max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <ShieldAlert className="mx-auto mb-2 text-red-600" size={32} />
        <h2 className="text-lg font-semibold text-red-800">Acceso restringido</h2>
        <p className="mt-1 text-sm text-red-700">
          Esta sección es solo para administradores. Tu cuenta tiene rol{' '}
          <span className="font-mono">{user.role}</span>.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-[200px_1fr]">
      <aside className="space-y-1">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Panel admin
        </div>
        {sections.map(({ href, label, Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </aside>
      <section>{children}</section>
    </div>
  );
}
