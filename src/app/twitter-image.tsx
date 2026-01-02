import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Calculator Loop - Free Online Calculators'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0A0E27 0%, #1A1F3A 100%)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '10%',
            right: '15%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(139, 92, 246, 0.15)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '15%',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(0, 212, 255, 0.15)',
            filter: 'blur(60px)',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 28,
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 30,
              background: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 80,
              fontWeight: 'bold',
              color: 'white',
              boxShadow: '0 20px 60px rgba(0, 212, 255, 0.4)',
            }}
          >
            C
          </div>

          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textAlign: 'center',
            }}
          >
            Calculator Loop
          </div>

          <div
            style={{
              fontSize: 34,
              color: '#94A3B8',
              textAlign: 'center',
              maxWidth: 920,
            }}
          >
            Free Online Calculators
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
