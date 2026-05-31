'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, LogIn, ShieldAlert } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/Toast';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/';
  const setSession = useAuth((s) => s.setSession);
  const toast = useToast();
  const [email, setEmail] = useState('admin@store.com');
  const [password, setPassword] = useState('superSecret123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { user, token } = await api.login({ email, password });
      setSession(token, user);
      toast.success(`Bienvenido, ${user.email.split('@')[0]}`);
      router.push(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'login failed');
    } finally {
      setLoading(false);
    }
  }

  function fillAs(role: 'admin' | 'customer') {
    if (role === 'admin') {
      setEmail('admin@store.com');
      setPassword('superSecret123');
    } else {
      setEmail('customer@store.com');
      setPassword('customer123');
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4 animate-fade-up">
      <div className="text-center">
        <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Lock size={22} />
        </div>
        <h1 className="text-2xl font-bold">Iniciar sesión</h1>
        <p className="mt-1 text-sm text-neutral-600">Accede para crear órdenes y gestionar tu cuenta.</p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
      >
        <label className="block">
          <span className="text-sm font-medium text-neutral-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input mt-1"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-neutral-700">Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input mt-1"
          />
        </label>

        {error && (
          <p className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
            <ShieldAlert size={14} /> {error}
          </p>
        )}

        <button
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-emerald-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
        >
          <LogIn size={16} /> {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>

      <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-3 text-xs text-neutral-600">
        <div className="mb-1 font-semibold text-neutral-700">Cuentas demo:</div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fillAs('admin')}
            className="flex-1 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-left hover:border-emerald-300"
          >
            <div className="font-mono text-[10px] text-neutral-400">admin</div>
            admin@store.com
          </button>
          <button
            type="button"
            onClick={() => fillAs('customer')}
            className="flex-1 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-left hover:border-emerald-300"
          >
            <div className="font-mono text-[10px] text-neutral-400">customer</div>
            customer@store.com
          </button>
        </div>
      </div>

      <p className="text-center text-sm text-neutral-600">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="font-medium text-emerald-700 hover:underline">
          Crear una
        </Link>
      </p>
    </div>
  );
}
