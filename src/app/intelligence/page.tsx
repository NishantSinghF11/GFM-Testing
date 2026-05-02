"use client";

import React, { useState, useEffect } from 'react';
import CreativeOSIntelligence from '@/components/os/CreativeOSIntelligence';
import CreatorOSIntelligence from '@/components/os/CreatorOSIntelligence';
import AssetIntelligence from '@/components/os/AssetIntelligence';
import MarketIntelligence from '@/components/os/MarketIntelligence';
import TrustIntelligence from '@/components/os/TrustIntelligence';
import ShadowDraftViewer from '@/components/os/ShadowDraftViewer';
import AdvancedTalentGraph from '@/components/os/AdvancedTalentGraph';
import GhostChat from '@/components/messaging/GhostChat';
import AgencyPortal from '@/components/os/AgencyPortal';

import LiveIntelligenceDashboard from '@/components/os/LiveIntelligenceDashboard';

export default function IntelligenceHubPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isInitializing, setIsInitializing] = useState(true);
  const [initProgress, setInitProgress] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    // System Initialization Sequence
    const timer = setInterval(() => {
      setInitProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsInitializing(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(timer);
    };
  }, []);

  const spatialStyle = (intensity = 1) => ({
    transform: `rotateY(${mousePos.x * intensity}deg) rotateX(${-mousePos.y * intensity}deg)`,
    transition: 'transform 0.1s ease-out',
    transformStyle: 'preserve-3d' as const
  });
  return (
    <main style={{ minHeight: '100vh', padding: '120px 20px 60px', background: 'var(--color-bg-darkest)', position: 'relative', overflow: 'hidden' }}>
      
      {/* GLOBAL EFFICIENCY TICKER */}
      <div style={{ position: 'fixed', top: '70px', left: 0, right: 0, background: 'rgba(16,185,129,0.05)', borderBottom: '1px solid rgba(16,185,129,0.1)', padding: '8px 20px', zIndex: 100, backdropFilter: 'blur(10px)', display: 'flex', gap: '40px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', whiteSpace: 'nowrap', animation: 'marquee 30s linear infinite' }}>
          {[
            { label: 'GLOBAL VELOCITY', val: '14.8x', icon: 'fa-bolt', color: '#10b981' },
            { label: 'NEURAL NODES', val: '1,240 ACTIVE', icon: 'fa-brain', color: '#818cf8' },
            { label: 'ESCROW LIQUIDITY', val: '$2.4M SECURED', icon: 'fa-vault', color: '#f59e0b' },
            { label: 'TALENT SYNERGY', val: '98.2%', icon: 'fa-user-group', color: '#ec4899' }
          ].map((stat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.65rem', fontWeight: 800, color: '#9CA3AF' }}>
              <i className={`fa-solid ${stat.icon}`} style={{ color: stat.color }}></i>
              <span style={{ color: 'white' }}>{stat.label}:</span> {stat.val}
              <span style={{ margin: '0 20px', color: 'rgba(255,255,255,0.1)' }}>|</span>
            </div>
          ))}
          {/* Duplicate for seamless marquee */}
          {[
            { label: 'GLOBAL VELOCITY', val: '14.8x', icon: 'fa-bolt', color: '#10b981' },
            { label: 'NEURAL NODES', val: '1,240 ACTIVE', icon: 'fa-brain', color: '#818cf8' },
            { label: 'ESCROW LIQUIDITY', val: '$2.4M SECURED', icon: 'fa-vault', color: '#f59e0b' },
            { label: 'TALENT SYNERGY', val: '98.2%', icon: 'fa-user-group', color: '#ec4899' }
          ].map((stat, i) => (
            <div key={i+4} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.65rem', fontWeight: 800, color: '#9CA3AF' }}>
              <i className={`fa-solid ${stat.icon}`} style={{ color: stat.color }}></i>
              <span style={{ color: 'white' }}>{stat.label}:</span> {stat.val}
              <span style={{ margin: '0 20px', color: 'rgba(255,255,255,0.1)' }}>|</span>
            </div>
          ))}
        </div>
      </div>

      {/* SYSTEM INITIALIZATION OVERLAY */}
      {isInitializing && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#05070B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div style={{ width: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: 900, letterSpacing: '2px' }}>NEURAL LAYERS BOOTING...</span>
              <span style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: 900 }}>{initProgress}%</span>
            </div>
            <div style={{ height: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '1px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${initProgress}%`, background: '#818cf8', boxShadow: '0 0 20px #818cf8', transition: 'width 0.1s linear' }}></div>
            </div>
            <div style={{ marginTop: '15px', fontSize: '0.6rem', color: '#4B5563', textAlign: 'center', fontFamily: 'monospace' }}>
              {initProgress < 30 && 'Connecting to Global Talent Graph...'}
              {initProgress >= 30 && initProgress < 60 && 'Synthesizing Market Intelligence...'}
              {initProgress >= 60 && initProgress < 90 && 'Encrypting Vault Escrow Handshakes...'}
              {initProgress >= 90 && 'Activating GhostPM Autonomous OS...'}
            </div>
          </div>
        </div>
      )}

      <div className="container" style={{ opacity: isInitializing ? 0 : 1, transition: 'opacity 1s ease' }}>
        <header style={{ marginBottom: '50px', textAlign: 'center' }}>
          <span className="badge badge-primary" style={{ marginBottom: '15px' }}>GFM Creative OS</span>
          <h1 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-heading)' }}>The <span className="text-gradient">Intelligence Hub</span></h1>
          <p style={{ color: '#9CA3AF', maxWidth: '700px', margin: '20px auto', fontSize: '1.1rem' }}>
            A predictive, AI-native operating system for high-stakes creative execution. 
            Welcome to the future of measurable, defensible, and intelligent creative work.
          </p>
        </header>

        <div style={{ marginBottom: '40px' }}>
          <LiveIntelligenceDashboard />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px', perspective: '2000px' }}>
          {/* Execution Layer */}
          <section style={spatialStyle(0.5)}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#818cf8', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '2px' }}>Execution & Flow</div>
            <CreativeOSIntelligence />
            <div style={{ marginTop: '30px' }}></div>
            <AgencyPortal />
          </section>

          {/* Decision Layer */}
          <section style={spatialStyle(0.8)}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#818cf8', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '2px' }}>Decision & Prediction</div>
            <CreatorOSIntelligence />
          </section>

          {/* Quality Layer */}
          <section style={spatialStyle(1.2)}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#c084fc', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '2px' }}>Quality & Consistency</div>
            <AssetIntelligence />
            <div style={{ marginTop: '30px' }}></div>
            <ShadowDraftViewer />
          </section>

          {/* Market Layer */}
          <section style={spatialStyle(0.6)}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '2px' }}>Market & Discovery</div>
            <AdvancedTalentGraph />
            <div style={{ marginTop: '30px' }}></div>
            <MarketIntelligence />
          </section>

          {/* Trust Layer */}
          <section style={spatialStyle(1.5)}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ef4444', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '2px' }}>Trust & Integrity</div>
            <TrustIntelligence />
            <div style={{ marginTop: '30px' }}></div>
            <GhostChat />
          </section>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </main>
  );
}
