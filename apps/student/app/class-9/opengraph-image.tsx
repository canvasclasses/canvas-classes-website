/**
 * OG image for the /class-9 landing page.
 * When someone shares canvasclasses.in/class-9 on WhatsApp or Twitter,
 * this is the preview they see.
 */

import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Class 9 NCERT New Syllabus — Live Books by Canvas Classes';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px 88px',
          background: 'linear-gradient(135deg, #050505 0%, #0B0F15 60%, #1a2040 100%)',
          fontFamily: 'sans-serif',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #f97316, #fbbf24)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              fontWeight: 800,
              color: '#0B0F15',
            }}
          >
            C
          </div>
          <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.3 }}>
            Canvas Classes · Live Books
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              display: 'flex',
              padding: '12px 22px',
              borderRadius: 999,
              background: 'rgba(249,115,22,0.14)',
              border: '1px solid rgba(249,115,22,0.4)',
              color: '#fdba74',
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              alignSelf: 'flex-start',
            }}
          >
            NCERT · New Syllabus
          </div>
          <span
            style={{
              fontSize: 96,
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1.0,
              color: 'white',
            }}
          >
            Class 9
          </span>
          <span
            style={{
              fontSize: 38,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.78)',
              maxWidth: 920,
              lineHeight: 1.25,
            }}
          >
            Science · Mathematics · Physics — read the updated syllabus as
            interactive live books.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: '#f97316' }} />
          <span style={{ fontSize: 24, color: 'rgba(255,255,255,0.72)', fontWeight: 500 }}>
            Simulations · Worked examples · Hinglish mode · Free
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
