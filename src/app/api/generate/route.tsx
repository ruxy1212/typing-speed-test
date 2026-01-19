import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Function to get accuracy color based on leaderboard logic
function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 95) return '#22c55e'; // green
  if (accuracy >= 90) return '#facc15'; // yellow
  return '#a3a3a3'; // neutral gray
}

export async function POST(request: NextRequest) {
  try {
    const { wpm, accuracy, correct, incorrect } = await request.json();
    const accuracyValue = parseFloat(accuracy);
    
    // Get the base URL from the request to construct absolute image URLs
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

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
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            padding: '60px',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '48px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${baseUrl}/logo-large.svg`}
              alt="TypeSpeed"
              width={500}
              height={75}
            />
          </div>

          {/* Results Cards */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '32px', marginBottom: '48px' }}>
            {/* WPM Card */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '12px',
                padding: '32px 40px',
                border: '2px solid #404040',
                background: '#262626',
                width: '280px',
              }}
            >
              <div style={{ color: '#a3a3a3', fontSize: '32px', marginBottom: '12px', fontWeight: 700 }}>WPM:</div>
              <div style={{ fontSize: '56px', fontWeight: 800, color: '#ffffff' }}>{wpm}</div>
            </div>

            {/* Accuracy Card */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '12px',
                padding: '32px 40px',
                border: '2px solid #404040',
                background: '#262626',
                width: '280px',
              }}
            >
              <div style={{ color: '#a3a3a3', fontSize: '32px', marginBottom: '12px', fontWeight: 700 }}>Accuracy:</div>
              <div
                style={{
                  fontSize: '56px',
                  fontWeight: 800,
                  color: getAccuracyColor(accuracyValue),
                }}
              >
                {accuracy}
              </div>
            </div>

            {/* Characters Card */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '12px',
                padding: '32px 40px',
                border: '2px solid #404040',
                background: '#262626',
                width: '280px',
              }}
            >
              <div style={{ color: '#a3a3a3', fontSize: '32px', marginBottom: '12px', fontWeight: 700 }}>Characters:</div>
              <div style={{ fontSize: '56px', fontWeight: 800, display: 'flex' }}>
                <span style={{ color: '#22c55e' }}>{correct}</span>
                <span style={{ color: '#a3a3a3', marginLeft: '8px', marginRight: '8px' }}>/</span>
                <span style={{ color: '#ef4444' }}>{incorrect}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ color: '#a3a3a3', fontSize: '32px', textAlign: 'center' }}>
              Practice makes perfect! Keep typing to improve your speed.
            </div>
            <div style={{ color: '#2563eb', fontSize: '32px', fontWeight: 700 }}>
              #fm30hackathon
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 800,
      }
    );
  } catch (error) {
    console.error('Error generating image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}