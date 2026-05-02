"use client";

import React, { useState } from 'react';

export default function GhostVault() {
  const [wips] = useState([
    { id: 'w1', name: 'Rough Cut v1.mp4', time: '2 hours ago', status: 'Pending Review', thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=200&h=120&fit=crop' },
    { id: 'w2', name: 'Color Grade Test.jpg', time: '5 hours ago', status: 'In Discussion', thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=120&fit=crop' }
  ]);

  return (
    <div style={{ marginTop: '30px', animation: 'slideInRight 0.4s ease-out' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <i className="fa-solid fa-ghost" style={{ color: '#9CA3AF' }}></i>
        <h3 style={{ fontSize: '0.9rem', color: 'white', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Ghost Revision Buffer</h3>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem', color: '#9CA3AF', lineHeight: 1.4 }}>
          Upload watermarked WIPs here for informal feedback before formal milestone submission.
        </div>

        <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {wips.map(wip => (
            <div key={wip.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '60px', height: '40px', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                <img src={wip.thumbnail} alt={wip.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: 'white', fontWeight: 800, textTransform: 'uppercase', transform: 'rotate(-15deg)', pointerEvents: 'none' }}>WIP</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.8rem', color: '#E5E7EB', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{wip.name}</div>
                <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>{wip.time} • {wip.status}</div>
              </div>
              <button style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontSize: '0.9rem' }}>
                <i className="fa-solid fa-comment-dots"></i>
              </button>
            </div>
          ))}

          <button style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', border: '1px dashed rgba(99,102,241,0.3)', color: '#818cf8', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <i className="fa-solid fa-cloud-arrow-up"></i> Upload WIP
          </button>
        </div>
      </div>
    </div>
  );
}
