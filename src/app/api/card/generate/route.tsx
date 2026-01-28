import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'

// Use Node.js runtime for better compatibility with blob downloads
export const runtime = 'nodejs'

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

    // Truncate headline if too long
    const displayHeadline = headline.length > 80 ? headline.substring(0, 77) + '...' : headline

    // Truncate topSin if too long
    const displayTopSin = topSin && topSin.length > 100 ? topSin.substring(0, 97) + '...' : topSin

    // Generate the image using ImageResponse
    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1a1517',
            fontFamily: 'monospace',
            padding: '60px',
            position: 'relative',
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
              position: 'relative',
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
                fontSize: '42px',
                fontWeight: 'bold',
                color: '#e8e3e3',
                textAlign: 'center',
                marginBottom: '30px',
                maxWidth: '900px',
                lineHeight: 1.3,
              }}
            >
              &quot;{displayHeadline}&quot;
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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

            {displayTopSin && (
              <div
                style={{
                  fontSize: '20px',
                  color: '#a8b2c3',
                  textAlign: 'center',
                  maxWidth: '800px',
                  borderTop: '2px solid #6e6a86',
                  paddingTop: '20px',
                  marginTop: '10px',
                }}
              >
                Top sin: {displayTopSin}
              </div>
            )}

            <div
              style={{
                position: 'absolute',
                bottom: '20px',
                fontSize: '18px',
                color: '#6e6a86',
              }}
            >
              Get roasted at proast.io
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )

    // Convert ImageResponse to array buffer and return as PNG
    const buffer = await imageResponse.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="proast-roast.png"',
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Card generation error:', errorMessage)
    return NextResponse.json({ error: 'Failed to generate card' }, { status: 500 })
  }
}
