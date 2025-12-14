import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
          borderRadius: '40px',
        }}
      >
        <div
          style={{
            fontSize: 100,
            fontWeight: 'bold',
            color: 'white',
            fontFamily: 'sans-serif',
          }}
        >
          C
        </div>
        <div
          style={{
            fontSize: 20,
            color: 'white',
            fontFamily: 'sans-serif',
            marginTop: -10,
            opacity: 0.9,
          }}
        >
          Loop
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
