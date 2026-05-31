import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ExternalLink } from 'lucide-react';
import './globals.css';
import Header from '@/components/Header';
import { ToastProvider } from '@/components/Toast';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

const API_DOCS = 'https://my-store-v2-production.up.railway.app/docs';
const API_HEALTH = 'https://my-store-v2-production.up.railway.app/health';

export const metadata: Metadata = {
  title: 'Julian Store · Tienda online demo',
  description:
    'Storefront moderno de Julian Osorio. Catálogo dinámico, carrito persistente, checkout autenticado con JWT y panel admin.',
  authors: [{ name: 'Julian Osorio' }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900">
        <ToastProvider>
          <Header />
          <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
          <footer className="border-t border-neutral-200 bg-white">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-neutral-500 sm:flex-row">
              <p>
                © {new Date().getFullYear()} <span className="font-semibold text-neutral-700">Julian Store</span> · Diseñado y desarrollado por{' '}
                <span className="font-medium text-emerald-700">Julian Osorio</span>
              </p>
              <nav className="flex items-center gap-4 text-xs">
                <a
                  href={API_DOCS}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-emerald-700"
                >
                  API Docs <ExternalLink size={11} />
                </a>
                <a
                  href={API_HEALTH}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-emerald-700"
                >
                  Status <ExternalLink size={11} />
                </a>
                <a
                  href="https://github.com/devmaiter/my-store-v2"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-emerald-700"
                >
                  Código <ExternalLink size={11} />
                </a>
              </nav>
            </div>
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}
