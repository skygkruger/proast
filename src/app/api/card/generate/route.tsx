import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const { headline, score, grade, topSin, severity } = await request.json()

    // Validate input
    if (!headline || score === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Color mapping for severities
    const severityColors: Record<string, string> = {
      gentle: '#a8d8b9',
      honest: '#ffe9b0',
      brutal: '#f5a97f',
      savage: '#eb6f92'
    }

    const accentColor = severityColors[severity] || '#eb6f92'

    // Generate the image
    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1a1a2e',
            fontFamily: 'monospace',
            padding: '60px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: `4px solid ${accentColor}`,
              padding: '40px 60px',
              width: '100%',
              height: '100%',
            }}
          >
            <div
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: accentColor,
                marginBottom: '20px',
                letterSpacing: '4px',
              }}
            >
              PROAST
            </div>

            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#e8e3e3',
                textAlign: 'center',
                marginBottom: '30px',
                maxWidth: '900px',
                lineHeight: 1.2,
              }}
            >
              &ldquo;{headline}&rdquo;
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '40px',
                marginBottom: '30px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '72px', fontWeight: 'bold', color: accentColor }}>
                  {score}
                </div>
                <div style={{ fontSize: '20px', color: '#6e6a86' }}>SCORE</div>
              </div>
              <div
                style={{
                  width: '4px',
                  height: '100px',
                  backgroundColor: '#6e6a86',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '72px', fontWeight: 'bold', color: accentColor }}>
                  {grade}
                </div>
                <div style={{ fontSize: '20px', color: '#6e6a86' }}>GRADE</div>
              </div>
            </div>

            {topSin && (
              <div
                style={{
                  fontSize: '24px',
                  color: '#a8b2c3',
                  textAlign: 'center',
                  maxWidth: '800px',
                  borderTop: '2px solid #6e6a86',
                  paddingTop: '20px',
                }}
              >
                Top sin: {topSin}
              </div>
            )}

            <div
              style={{
                position: 'absolute',
                bottom: '30px',
                fontSize: '18px',
                color: '#6e6a86',
              }}
            >
              Get roasted at proast.dev
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Card generation error:', errorMessage)
    return NextResponse.json({ error: 'Failed to generate card' }, { status: 500 })
  }
}
