export default function Loading() {
  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at center, #1a0e00 0%, #0a0700 45%, #050507 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 0, position: 'relative', overflow: 'hidden' }}>
      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-60%)', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(180,100,0,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />

      {/* Om symbol */}
      <div style={{ fontSize: 52, color: 'rgba(160,100,20,0.55)', marginBottom: 24, fontFamily: 'serif', lineHeight: 1 }}>ॐ</div>

      {/* Decorative line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <div style={{ width: 80, height: 1, background: 'linear-gradient(to right, transparent, rgba(200,140,30,0.5))' }} />
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(200,140,30,0.7)' }} />
        <div style={{ width: 80, height: 1, background: 'linear-gradient(to left, transparent, rgba(200,140,30,0.5))' }} />
      </div>

      {/* Sanskrit shloka — large gradient text */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <p style={{ fontSize: 'clamp(32px,7vw,52px)', fontWeight: 900, fontFamily: 'serif', lineHeight: 1.35, margin: 0, background: 'linear-gradient(180deg, #fde68a 0%, #f59e0b 50%, #b45309 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          उद्यमेन हि सिध्यन्ति
        </p>
        <p style={{ fontSize: 'clamp(32px,7vw,52px)', fontWeight: 900, fontFamily: 'serif', lineHeight: 1.35, margin: 0, background: 'linear-gradient(180deg, #fde68a 0%, #f59e0b 50%, #b45309 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          कार्याणि न मनोरथैः
        </p>
      </div>

      {/* Decorative line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <div style={{ width: 80, height: 1, background: 'linear-gradient(to right, transparent, rgba(200,140,30,0.5))' }} />
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(200,140,30,0.7)' }} />
        <div style={{ width: 80, height: 1, background: 'linear-gradient(to left, transparent, rgba(200,140,30,0.5))' }} />
      </div>

      {/* Translation */}
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.14em', textAlign: 'center', maxWidth: 340, lineHeight: 1.8, fontStyle: 'italic' }}>
        Tasks are accomplished through effort,<br />not by mere wishes.
      </p>

      {/* Loading dots */}
      <div style={{ display: 'flex', gap: 8, marginTop: 36 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#d97706',
            animation: `dot-pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes dot-pulse {
          0%, 80%, 100% { opacity: 0.25; transform: scale(0.75); }
          40% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
