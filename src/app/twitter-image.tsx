import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Jonah Duckworth — Builder';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#0a0a0a',
          color: '#fafafa',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
            }}
          />
          <span style={{ fontSize: '20px', color: '#a1a1aa' }}>Calgary, AB</span>
        </div>

        <h1
          style={{
            fontSize: '72px',
            fontWeight: 700,
            lineHeight: 1.1,
            margin: 0,
            letterSpacing: '-2px',
          }}
        >
          Jonah Duckworth
        </h1>

        <p
          style={{
            fontSize: '36px',
            color: '#22c55e',
            fontWeight: 600,
            margin: '16px 0 0 0',
            letterSpacing: '-0.5px',
          }}
        >
          I build software from zero to real.
        </p>

        <p
          style={{
            fontSize: '22px',
            color: '#a1a1aa',
            marginTop: '32px',
            lineHeight: 1.5,
            maxWidth: '700px',
          }}
        >
          Developer &amp; entrepreneur. Founded Ref Buddy and HarvestingPro.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '48px',
          }}
        >
          {['React', 'Next.js', 'Rust', 'Go', 'Flutter', 'Postgres'].map(
            (tech) => (
              <span
                key={tech}
                style={{
                  fontSize: '16px',
                  color: '#71717a',
                  padding: '8px 16px',
                  border: '1px solid #27272a',
                  borderRadius: '999px',
                }}
              >
                {tech}
              </span>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
