# Julian Store · Storefront

Storefront moderno construido con **Next.js 16 + React 19 + Tailwind 4 + Zustand**, conectado a una API REST propia (Express + Postgres + JWT). Catálogo público, carrito persistente, checkout autenticado y panel admin con CRUD en vivo.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=000)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=fff)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=fff)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel)

---

## 🌐 Demo en vivo

| | |
|---|---|
| **Storefront** | https://my-store-v2-web.vercel.app |
| **Backend API** | https://my-store-v2-production.up.railway.app/docs |
| **Repositorio API** | https://github.com/devmaiter/my-store-v2 |

**Credenciales demo** (pre-rellenadas en el form de login):

| Rol | Email | Password |
|---|---|---|
| **Admin** | `admin@store.com` | `superSecret123` |
| **Customer** | `customer@store.com` | `customer123` |

---

## ✨ Features

- **Catálogo público** con búsqueda, filtro por categoría, orden por precio/nombre, paginación
- **Carrito local persistente** (Zustand + localStorage) — sobrevive a recargas
- **Checkout autenticado** con JWT, transacción atómica de orden + items
- **Panel admin** (`/admin`) protegido por rol con:
  - Dashboard con KPIs y accesos rápidos
  - CRUD de productos y categorías (con vista previa en vivo)
  - **Datos en vivo** (`/admin/data`) — tablas crudas de Postgres con auto-refresh cada 5s
  - Link directo al servicio Postgres en Railway para queries SQL
- **UX moderna:** toasts, skeletons, animaciones fade/scale escalonadas, dark hover states
- **Rol-aware UI:** customer solo ve y compra · admin además gestiona inline desde cada card (✏️ + 🗑️ sobre productos/categorías sin salir del catálogo)
- **Responsive** y accesible, con sticky header + navegación móvil

---

## 🛠 Stack

- **Framework:** Next.js 16 (App Router, Server Components, Turbopack)
- **UI:** React 19 + Tailwind CSS v4 + lucide-react icons
- **Estado:** Zustand con `persist` middleware
- **Tipos:** TypeScript 5
- **Auth:** JWT (almacenado en zustand persistente)
- **Deploy:** Vercel (auto-deploy desde `master`)

---

## 🏗 Arquitectura

```
app/
├── layout.tsx               # Header + Footer + ToastProvider
├── page.tsx                 # Home: hero auth-aware + categorías + destacados
├── products/
│   ├── page.tsx             # Listado con filtros y paginación
│   └── [id]/page.tsx        # Detalle + relacionados + admin edit
├── categories/
│   ├── page.tsx
│   └── [id]/page.tsx
├── cart/page.tsx            # Carrito con resumen sticky
├── checkout/page.tsx        # Crea orden via JWT
├── login + register
├── orders/page.tsx          # "Mis órdenes"
└── admin/
    ├── layout.tsx           # Guard role=admin + sidebar
    ├── page.tsx             # Dashboard
    ├── products/            # list + new + [id] (forms reutilizan ProductForm)
    ├── categories/          # list + new + [id]
    └── data/page.tsx        # Viewer Postgres en vivo con tabs
components/
├── Header.tsx               # Sticky + role-aware nav + Backend/Postgres CTAs
├── ProductCard.tsx          # Con admin overlay (edit/delete)
├── Toast.tsx                # Provider + hook
└── Skeleton.tsx
lib/
├── api.ts                   # Cliente typed; CRUD products/categories/orders + admin
├── auth-store.ts            # Zustand persistido
├── cart-store.ts            # Zustand persistido
├── format.ts                # money(COP)
└── types.ts
```

---

## 🚀 Quick start (local)

Requisitos: **Node 20+** y la [API backend](https://github.com/devmaiter/my-store-v2) corriendo en `:3010`.

```bash
git clone https://github.com/devmaiter/my-store-v2-web
cd my-store-v2-web
npm install
cp .env.local.example .env.local   # ajusta NEXT_PUBLIC_API_URL
npm run dev                        # http://localhost:3030
```

`.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3010/api/v1
# o para apuntar a la API ya desplegada:
# NEXT_PUBLIC_API_URL=https://my-store-v2-production.up.railway.app/api/v1
```

---

## 🌍 Deploy

Está desplegado en **Vercel** vía integración con GitHub. Cada push a `master` redeploya automáticamente.

Variables en Vercel:

```
NEXT_PUBLIC_API_URL=https://my-store-v2-production.up.railway.app/api/v1
```

---

## 👤 Autor

**Julian Osorio** · Desarrollador full-stack freelance · Colombia 🇨🇴

- 🌐 LinkedIn: [oscar-julian-osorio-romero](https://www.linkedin.com/in/oscar-julian-osorio-romero/)
- 💼 GitHub: [devmaiter](https://github.com/devmaiter)
- 📧 f1000161620@gmail.com

¿Buscas un dev para tu próximo proyecto? Hablemos 👋
