import React from 'react';

interface TalentIntelligenceProps {
  creator: any;
}

export default function TalentIntelligenceHUD({ creator }: TalentIntelligenceProps) {
  const stats = [
    { label: 'Delivery Speed', value: '48h Avg', icon: 'fa-bolt-lightning', color: '#818cf8', progress: 92 },
    { label: 'Revision Rate', value: '1.2/proj', icon: 'fa-rotate', color: '#f59e0b', progress: 88 },
    { label: 'Client Retention', value: '84%', icon: 'fa-heart-pulse', color: '#ef4444', progress: 84 },
    { label: 'Market Demand', value: 'Critical', icon: 'fa-fire-flame-curved', color: '#10b981', progress: 95 }
  ];

  return (
    <div className="glass-card neural-active" style={{ padding: '28px', borderRadius: '24px', background: 'rgba(10, 13, 20, 0.6)', border: '1px solid rgba(139, 92, 246, 0.3)', position: 'relative' }}>
      {/* Decorative Scan Line */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, #818cf8, transparent)', animation: 'shimmer 3s infinite', opacity: 0.3 }}></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 900, letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
            Neural Intelligence
          </div>
          <div style={{ fontSize: '0.65rem', color: '#4B5563', fontFamily: 'monospace' }}>DOSSIER ID: GFM-{creator?.id?.slice(0,8).toUpperCase() || 'UNKN'}</div>
        </div>
        <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981', animation: 'ghost-glow 2s infinite' }}></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '18px' }}>
        {stats.map(stat => (
          <div key={stat.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#9CA3AF', fontWeight: 500 }}>
                <i className={`fa-solid ${stat.icon}`} style={{ color: stat.color, width: '16px' }}></i>
                {stat.label}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>{stat.value}</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${stat.progress}%`, background: `linear-gradient(90deg, ${stat.color}88, ${stat.color})`, boxShadow: `0 0 10px ${stat.color}44` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Quantum Skill Graph (Enhanced Radar UI) */}
      <div style={{ marginTop: '35px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '25px' }}>
        <div style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: 800, marginBottom: '25px', textAlign: 'center', letterSpacing: '1px' }}>SKILL DEPTH SYNTHESIS</div>
        <div style={{ position: 'relative', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Radial Grid */}
          {[1, 0.7, 0.4].map(scale => (
            <div key={scale} style={{ 
              width: `${140 * scale}px`, height: `${140 * scale}px`, 
              border: '1px solid rgba(139, 92, 246, 0.1)', borderRadius: '50%', position: 'absolute' 
            }}></div>
          ))}
          
          {/* Skill Nodes & Connections */}
          <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
            <polygon 
              points={[
                { angle: 0, val: 0.9 },
                { angle: 72, val: 0.8 },
                { angle: 144, val: 0.95 },
                { angle: 216, val: 0.85 },
                { angle: 288, val: 0.7 }
              ].map(n => {
                const r = 70 * n.val;
                const x = 90 + r * Math.sin(n.angle * Math.PI / 180);
                const y = 90 - r * Math.cos(n.angle * Math.PI / 180);
                return `${x},${y}`;
              }).join(' ')}
              fill="rgba(129, 140, 248, 0.15)"
              stroke="#818cf8"
              strokeWidth="1.5"
            />
          </svg>

          {[
            { angle: 0, label: 'VFX', val: 0.9 },
            { angle: 72, label: 'Color', val: 0.8 },
            { angle: 144, label: 'Edit', val: 0.95 },
            { angle: 216, label: 'Story', val: 0.85 },
            { angle: 288, label: 'Sound', val: 0.7 }
          ].map(node => {
            const r = 70 * node.val;
            return (
              <div key={node.label} style={{ 
                position: 'absolute',
                transform: `rotate(${node.angle}deg) translateY(${-r}px)`,
                width: '10px', height: '10px', background: '#818cf8', borderRadius: '50%',
                boxShadow: '0 0 15px #818cf8',
                zIndex: 10
              }}>
                <div style={{ 
                  position: 'absolute', top: '15px', left: '50%', transform: `translateX(-50%) rotate(${-node.angle}deg)`, 
                  fontSize: '0.65rem', color: '#E5E7EB', fontWeight: 700, whiteSpace: 'nowrap' 
                }}>{node.label}</div>
              </div>
            );
          })}
          
          <div className="ghost-active" style={{ width: '4px', height: '4px', background: 'white', borderRadius: '50%', boxShadow: '0 0 20px rgba(129, 140, 248, 0.5)' }}></div>
        </div>
      </div>
    </div>
  );
}
