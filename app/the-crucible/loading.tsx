export default function Loading() {
  return (
    <div style={{ minHeight: '100vh', background: '#050507', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#7c3aed',
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
