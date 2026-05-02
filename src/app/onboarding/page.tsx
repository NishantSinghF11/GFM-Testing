"use client";

import React, { useState } from 'react';
import Link from 'next/link';

type Step = 'role' | 'taste' | 'intelligence' | 'verification' | 'complete';

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<'client' | 'creator' | null>(null);
  const [progress, setProgress] = useState(25);

  const nextStep = (next: Step, newProgress: number) => {
    setStep(next);
    setProgress(newProgress);
  };

  const renderStep = () => {
    switch (step) {
      case 'role':
        return (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Welcome to the <span className="text-gradient">Creative OS</span></h2>
            <p style={{ color: '#9CA3AF', marginBottom: '40px' }}>To personalize your intelligence hub, tell us how you'll be using GigsForMe.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', maxWidth: '700px', margin: '0 auto' }}>
              <div 
                onClick={() => { setRole('client'); nextStep('taste', 50); }}
                className="glass-card" 
                style={{ padding: '40px', borderRadius: '32px', cursor: 'pointer', border: role === 'client' ? '1px solid #818cf8' : '1px solid #1E2532', background: role === 'client' ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.02)', transition: 'all 0.3s' }}
              >
                <i className="fa-solid fa-user-tie fa-3x" style={{ color: '#818cf8', marginBottom: '20px' }}></i>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>I'm a Client</h3>
                <p style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>I want to hire elite creative talent and scale my vision.</p>
              </div>
              <div 
                onClick={() => { setRole('creator'); nextStep('taste', 50); }}
                className="glass-card" 
                style={{ padding: '40px', borderRadius: '32px', cursor: 'pointer', border: role === 'creator' ? '1px solid #10b981' : '1px solid #1E2532', background: role === 'creator' ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)', transition: 'all 0.3s' }}
              >
                <i className="fa-solid fa-palette fa-3x" style={{ color: '#10b981', marginBottom: '20px' }}></i>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>I'm a Creator</h3>
                <p style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>I want to find high-fidelity projects that match my style.</p>
              </div>
            </div>
          </div>
        );

      case 'taste':
        return (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>Initialize your <span className="text-gradient">Taste Graph™</span></h2>
            <p style={{ color: '#9CA3AF', marginBottom: '40px' }}>{role === 'client' ? 'What visual styles define your brand?' : 'What artistic directions do you excel in?'}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '40px' }}>
              {['Cinematic', 'Minimalist', 'Cyberpunk', 'High-Fashion', 'Noir', 'Vibrant', 'Gritty', 'Surreal', 'Corporate'].map(style => (
                <div key={style} style={{ padding: '15px', border: '1px solid #1E2532', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.02)', fontSize: '0.85rem' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#818cf8'} onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1E2532'}>
                  {style}
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(99,102,241,0.03)', border: '1px dashed #374151', padding: '30px', borderRadius: '20px', textAlign: 'center', marginBottom: '30px' }}>
              <i className="fa-solid fa-cloud-arrow-up fa-2x" style={{ color: '#4B5563', marginBottom: '10px' }}></i>
              <div style={{ fontSize: '0.9rem', color: '#9CA3AF' }}>Upload 3-5 inspiration images / portfolio pieces</div>
              <div style={{ fontSize: '0.7rem', color: '#4B5563', marginTop: '5px' }}>AI will analyze Visual DNA for matching</div>
            </div>

            <button onClick={() => nextStep('intelligence', 75)} className="btn btn-primary" style={{ width: '100%', padding: '15px' }}>Calibrate AI Matchmaker</button>
          </div>
        );

      case 'intelligence':
        return (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>Neural <span className="text-gradient">Calibration</span></h2>
            <p style={{ color: '#9CA3AF', marginBottom: '40px' }}>Adjust the precision of your AI-mediated workspace.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginBottom: '40px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Match Precision</span>
                  <span style={{ fontSize: '0.8rem', color: '#818cf8' }}>Ultra-High</span>
                </div>
                <div style={{ height: '6px', background: '#1E2532', borderRadius: '3px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, width: '85%', height: '100%', background: '#818cf8', borderRadius: '3px' }}></div>
                  <div style={{ position: 'absolute', left: '85%', top: '50%', transform: 'translate(-50%, -50%)', width: '18px', height: '18px', background: 'white', borderRadius: '50%', border: '4px solid #818cf8' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>GhostPM™ Autonomy</span>
                  <span style={{ fontSize: '0.8rem', color: '#10b981' }}>Semi-Autonomous</span>
                </div>
                <div style={{ height: '6px', background: '#1E2532', borderRadius: '3px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, width: '50%', height: '100%', background: '#10b981', borderRadius: '3px' }}></div>
                  <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '18px', height: '18px', background: 'white', borderRadius: '50%', border: '4px solid #10b981' }}></div>
                </div>
              </div>
            </div>

            <div style={{ padding: '25px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1E2532', borderRadius: '24px', marginBottom: '30px' }}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <i className="fa-solid fa-robot" style={{ color: '#818cf8', fontSize: '1.2rem' }}></i>
                <div style={{ fontSize: '0.85rem', color: '#9CA3AF', lineHeight: 1.5 }}>
                  AI will prioritize <strong>"Taste-Similarity"</strong> over <strong>"Price-Competition"</strong> to ensure high-fidelity outcomes.
                </div>
              </div>
            </div>

            <button onClick={() => nextStep('verification', 100)} className="btn btn-primary" style={{ width: '100%', padding: '15px' }}>Verify Identity</button>
          </div>
        );

      case 'verification':
        return (
          <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 30px' }}>
              <i className="fa-solid fa-fingerprint"></i>
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>Biometric <span className="text-gradient">Verification</span></h2>
            <p style={{ color: '#9CA3AF', marginBottom: '40px' }}>GigsForMe maintains a 100% verified network. Please complete a quick identity check.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px' }}>
              <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '15px' }}>
                <i className="fa-solid fa-mobile-screen"></i> Verify with GFM Mobile App
              </button>
              <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '15px' }}>
                <i className="fa-solid fa-passport"></i> Upload Government ID
              </button>
            </div>

            <button onClick={() => nextStep('complete', 100)} className="btn btn-primary" style={{ width: '100%', padding: '15px', fontWeight: 800 }}>Complete Onboarding</button>
          </div>
        );

      case 'complete':
        return (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ width: '100px', height: '100px', background: 'rgba(99,102,241,0.1)', color: '#818cf8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 30px', animation: 'scaleUp 0.5s ease-out' }}>
              <i className="fa-solid fa-check"></i>
            </div>
            <h2 style={{ fontSize: '3rem', marginBottom: '20px' }}>Neural Link <span className="text-gradient">Active</span></h2>
            <p style={{ color: '#9CA3AF', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 40px' }}>
              Your Taste Graph has been initialized. The AI Matchmaker is now curating projects that match your Visual DNA.
            </p>
            <Link href="/dashboard" className="btn btn-primary" style={{ padding: '18px 40px', fontSize: '1.1rem' }}>Enter the Workspace</Link>
          </div>
        );
    }
  };

  return (
    <main style={{ background: '#05070B', minHeight: '100vh', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.05) 0%, transparent 80%)', pointerEvents: 'none' }}></div>
      
      <div className="container" style={{ maxWidth: '900px', position: 'relative' }}>
        
        {/* PROGRESS INDICATOR */}
        {step !== 'complete' && (
          <div style={{ marginBottom: '60px', maxWidth: '600px', margin: '0 auto 60px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: '#4B5563', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '1px' }}>
              <span>Step: {step}</span>
              <span>{progress}% Optimized</span>
            </div>
            <div style={{ height: '4px', background: '#1E2532', borderRadius: '2px' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #10b981)', borderRadius: '2px', transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
            </div>
          </div>
        )}

        <section className="glass-card" style={{ padding: '60px 40px', borderRadius: '48px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
          {renderStep()}
        </section>

      </div>

      <style jsx>{`
        @keyframes scaleUp {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </main>
  );
}
