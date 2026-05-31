'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, UserPlus } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-store';
import { useToast } from '@/components/Toast';

export default function RegisterPage() {
  const router = useRouter();
  const setSession = useAuth((s) => s.setSession);
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.register({ email, password });
      const { user, token } = await api.login({ email, password });
      setSession(token, user);
      toast.success('Cuenta creada');
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'register failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4 animate-fade-up">
      <div className="text-center">
        <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <UserPlus size={22} />
        </div>
        <h1 className="text-2xl font-bold">Crear cuenta</h1>
        <p className="mt-1 text-sm text-neutral-600">Empieza a comprar en segundos.</p>
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
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input mt-1"
          />
          <span className="mt-1 block text-xs text-neutral-500">Mínimo 8 caracteres.</span>
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
          <UserPlus size={16} /> {loading ? 'Creando…' : 'Crear cuenta'}
        </button>
      </form>

      <p className="text-center text-sm text-neutral-600">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="font-medium text-emerald-700 hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}
