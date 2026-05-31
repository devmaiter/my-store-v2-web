import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { ToastProvider } from '@/components/Toast';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'my-store-v2',
  description: 'Storefront moderno conectado a la API my-store-v2 (Node + Express + Sequelize + JWT).',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900">
        <ToastProvider>
          <Header />
          <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
          <footer className="border-t border-neutral-200 py-6 text-center text-sm text-neutral-500">
            my-store-v2 · Stack: Next.js 16 · React 19 · Express · Postgres · JWT
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}
