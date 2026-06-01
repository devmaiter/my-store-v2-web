import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Julian Store · Storefront moderno conectado a una API propia';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background:
            'linear-gradient(135deg, #10b981 0%, #059669 45%, #0f766e 100%)',
          color: 'white',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 380,
            height: 380,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.10)',
            filter: 'blur(40px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -140,
            left: -80,
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'rgba(110,231,183,0.18)',
            filter: 'blur(50px)',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
            }}
          >
            🛍
          </div>
          <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.3 }}>
            Julian Store
          </span>
          <span
            style={{
              marginLeft: 18,
              padding: '6px 14px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.16)',
              fontSize: 18,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#bbf7d0',
              }}
            />
            demo live
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              fontSize: 78,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              maxWidth: 980,
            }}
          >
            Tu tienda online, conectada de verdad.
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 400,
              color: 'rgba(236,253,245,0.9)',
              maxWidth: 920,
              lineHeight: 1.3,
            }}
          >
            Catálogo dinámico, carrito persistente, checkout autenticado con JWT y
            panel admin en tiempo real.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 22,
            color: 'rgba(236,253,245,0.85)',
          }}
        >
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <span>Next.js 16</span>
            <span>·</span>
            <span>React 19</span>
            <span>·</span>
            <span>Express</span>
            <span>·</span>
            <span>Postgres</span>
            <span>·</span>
            <span>JWT</span>
          </div>
          <span style={{ fontWeight: 600 }}>by Julian Osorio</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
