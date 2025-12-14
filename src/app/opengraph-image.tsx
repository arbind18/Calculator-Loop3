import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Calculator Loop - 300+ Free Online Calculators'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage() {
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
        {/* Decorative circles */}
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

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 30,
            zIndex: 1,
          }}
        >
          {/* Logo/Icon */}
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

          {/* Title */}
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

          {/* Subtitle */}
          <div
            style={{
              fontSize: 36,
              color: '#94A3B8',
              textAlign: 'center',
              maxWidth: 900,
            }}
          >
            300+ Free Online Calculators
          </div>

          {/* Features */}
          <div
            style={{
              fontSize: 24,
              color: '#64748B',
              textAlign: 'center',
              display: 'flex',
              gap: 40,
            }}
          >
            <span>💰 Financial</span>
            <span>❤️ Health</span>
            <span>📊 Math</span>
            <span>📅 Date & Time</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
