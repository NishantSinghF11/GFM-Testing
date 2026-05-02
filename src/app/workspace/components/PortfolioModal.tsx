import React from 'react';

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorName: string;
}

export default function PortfolioModal({ isOpen, onClose, creatorName }: PortfolioModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(5, 7, 11, 0.8)', backdropFilter: 'blur(10px)'
    }}>
      <div className="glass-card" style={{
        width: '450px', padding: '30px', background: 'rgba(10, 13, 20, 0.95)',
        border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        animation: 'modalSlideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ 
            width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px'
          }}>
            <i className="fa-solid fa-earth-americas" style={{ color: '#818cf8', fontSize: '1.8rem' }}></i>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'white', marginBottom: '8px' }}>Asset Visibility Rights</h2>
          <p style={{ fontSize: '0.85rem', color: '#9CA3AF', lineHeight: 1.6 }}>
            The mission is complete! How would you like <strong>{creatorName}</strong> to showcase this project in their professional portfolio?
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {[
            { id: 'public', label: 'Full Public Showcase', desc: 'Visible on creator profile and GFM marketplace.', icon: 'fa-eye' },
            { id: 'private', label: 'Private Case Study', desc: 'Only visible via direct link for prospective clients.', icon: 'fa-lock-open' },
            { id: 'hidden', label: 'Keep Hidden (NDA)', desc: 'Project remains strictly confidential.', icon: 'fa-shield-halved' }
          ].map(opt => (
            <button key={opt.id} onClick={onClose} style={{
              display: 'flex', alignItems: 'center', gap: '15px', padding: '16px',
              background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '12px', color: 'white', cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.2s'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
            }}>
              <i className={`fa-solid ${opt.icon}`} style={{ color: '#818cf8', fontSize: '1.1rem' }}></i>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{opt.label}</div>
                <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>{opt.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <button onClick={onClose} style={{
          width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--color-primary)',
          color: 'white', border: 'none', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
        }}>
          CONFIRM SETTINGS
        </button>

        <style>{`
          @keyframes modalSlideUp {
            from { opacity: 0; transform: translateY(40px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}
