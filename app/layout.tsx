import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ExternalLink, Github, Linkedin, Mail } from 'lucide-react';
import './globals.css';
import Header from '@/components/Header';
import { ToastProvider } from '@/components/Toast';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

const API_DOCS = 'https://my-store-v2-production.up.railway.app/docs';
const API_HEALTH = 'https://my-store-v2-production.up.railway.app/health';
const LINKEDIN = 'https://www.linkedin.com/in/oscar-julian-osorio-romero/';
const GITHUB = 'https://github.com/devmaiter';
const EMAIL = 'f1000161620@gmail.com';

const SITE_URL = 'https://my-store-v2-web.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Julian Store · Storefront full-stack demo',
    template: '%s · Julian Store',
  },
  description:
    'Demo full-stack de Julian Osorio: Next.js 16 + React 19 + Tailwind + Zustand contra una API propia en Express + Postgres + JWT. Catálogo, carrito persistente, checkout autenticado y panel admin con CRUD en vivo.',
  authors: [{ name: 'Julian Osorio', url: 'https://www.linkedin.com/in/oscar-julian-osorio-romero/' }],
  creator: 'Julian Osorio',
  keywords: [
    'Next.js 16',
    'React 19',
    'Express',
    'PostgreSQL',
    'JWT',
    'Sequelize',
    'Tailwind CSS',
    'Storefront demo',
    'Julian Osorio',
    'Full-stack developer Colombia',
  ],
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: SITE_URL,
    siteName: 'Julian Store',
    title: 'Julian Store · Storefront full-stack demo',
    description:
      'Catálogo dinámico, carrito persistente, checkout autenticado con JWT y panel admin con datos en vivo de Postgres.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Julian Store · Storefront full-stack demo',
    description:
      'Next.js 16 + Express + Postgres + JWT. Tienda demo con catálogo, carrito, checkout y panel admin en vivo.',
  },
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900">
        <ToastProvider>
          <Header />
          <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
          <footer className="border-t border-neutral-200 bg-white">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.3fr_1fr_1fr]">
              {/* About */}
              <div>
                <h3 className="text-lg font-bold tracking-tight">Julian Store</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  Demo full-stack creada por <strong className="text-neutral-800">Julian Osorio</strong>,
                  desarrollador freelance basado en Colombia 🇨🇴. Disponible para proyectos remotos.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={LINKEDIN}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-[#0a66c2] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
                  >
                    <Linkedin size={14} /> LinkedIn
                  </a>
                  <a
                    href={GITHUB}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800"
                  >
                    <Github size={14} /> GitHub
                  </a>
                  <a
                    href={`mailto:${EMAIL}?subject=Hablemos%20de%20un%20proyecto`}
                    className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                  >
                    <Mail size={14} /> Contactar
                  </a>
                </div>
              </div>

              {/* Project links */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  El proyecto
                </h4>
                <ul className="mt-3 space-y-1.5 text-sm">
                  <li>
                    <a href={API_DOCS} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-neutral-700 hover:text-emerald-700">
                      Backend (Swagger) <ExternalLink size={11} />
                    </a>
                  </li>
                  <li>
                    <a href={API_HEALTH} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-neutral-700 hover:text-emerald-700">
                      API Status <ExternalLink size={11} />
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/devmaiter/my-store-v2-web" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-neutral-700 hover:text-emerald-700">
                      Repo frontend <ExternalLink size={11} />
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/devmaiter/my-store-v2" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-neutral-700 hover:text-emerald-700">
                      Repo backend <ExternalLink size={11} />
                    </a>
                  </li>
                </ul>
              </div>

              {/* Stack */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Stack</h4>
                <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                  {['Next.js 16', 'React 19', 'TypeScript', 'Tailwind 4', 'Zustand', 'Express', 'Postgres', 'Sequelize', 'JWT', 'Zod', 'Vercel', 'Railway'].map((t) => (
                    <span key={t} className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-neutral-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-neutral-100 bg-neutral-50/50 py-3 text-center text-xs text-neutral-500">
              © {new Date().getFullYear()} Julian Osorio · Hecho con ❤ en Colombia
            </div>
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}
