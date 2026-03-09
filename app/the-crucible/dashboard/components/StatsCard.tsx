'use client';

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  change?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  color: string;
}

export default function StatsCard({ icon, label, value, change, color }: StatsCardProps) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16,
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background gradient */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 100,
        height: 100,
        background: `radial-gradient(circle, ${color}20, transparent)`,
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: 8,
        }}>
          {label}
        </div>
        <div style={{
          fontSize: 36,
          fontWeight: 900,
          color: '#fff',
          marginBottom: 4,
          fontFamily: 'monospace',
        }}>
          {value}
        </div>
        {change && (
          <div style={{
            fontSize: 12,
            fontWeight: 600,
            color: change.direction === 'up' ? '#34d399' : change.direction === 'down' ? '#f87171' : 'rgba(255,255,255,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            {change.direction === 'up' && '↑'}
            {change.direction === 'down' && '↓'}
            {change.value > 0 ? '+' : ''}{change.value}% this week
          </div>
        )}
      </div>
    </div>
  );
}
