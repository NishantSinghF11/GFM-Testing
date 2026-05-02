"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AssetDropzone from '@/components/studio/AssetDropzone';

interface Task {
  id: string;
  title: string;
  status: 'done' | 'active' | 'pending';
  assignee: string;
}

export default function ProjectStudioPage() {
  const [activeTab, setActiveTab] = useState<'workflow' | 'assets' | 'brief'>('workflow');
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Import Raw Footage (4K 10-bit)', status: 'done', assignee: 'Alex V.' },
    { id: '2', title: 'Neural Color Grading - First Pass', status: 'active', assignee: 'Alex V.' },
    { id: '3', title: 'VFX Tracking (Drone Shots)', status: 'pending', assignee: 'Sarah K.' },
    { id: '4', title: 'Sound Design & SFX Mix', status: 'pending', assignee: 'Sound Team' },
  ]);

  const [aiAnalysis, setAiAnalysis] = useState<string>("Analyzing workflow efficiency...");

  useEffect(() => {
    const timer = setTimeout(() => {
      setAiAnalysis("Predicted completion: Nov 28 (On Track). GhostPM suggests prioritizing the VFX tracking to avoid weekend rendering bottlenecks.");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main style={{ background: '#05070B', minHeight: '100vh', color: 'white', padding: '120px 20px 80px' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* TOP COMMAND BAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '50px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <Link href="/dashboard" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '0.9rem' }}><i className="fa-solid fa-arrow-left"></i> Workspace</Link>
              <div style={{ width: '1px', height: '14px', background: '#1E2532' }}></div>
              <span style={{ fontSize: '0.9rem', color: '#818cf8', fontWeight: 800 }}>PROJ-2241</span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', margin: 0 }}>Cyberpunk 2077 <span className="text-gradient">Fan Film</span></h1>
            <p style={{ color: '#9CA3AF', marginTop: '5px' }}>Director's Studio & Asset Command</p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
             <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-link"></i> Generate Review Link
            </button>
            <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-paper-plane"></i> Submit to Client
            </button>
          </div>
        </div>

        {/* STUDIO NAVIGATION */}
        <div style={{ display: 'flex', gap: '30px', borderBottom: '1px solid #1E2532', marginBottom: '40px' }}>
          {['workflow', 'assets', 'brief'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab as any)}
              style={{ 
                padding: '15px 0', 
                background: 'none', 
                border: 'none', 
                color: activeTab === tab ? '#818cf8' : '#6B7280', 
                fontSize: '0.9rem', 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                letterSpacing: '1px',
                cursor: 'pointer',
                borderBottom: activeTab === tab ? '2px solid #818cf8' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px' }}>
          
          {/* LEFT: WORKFLOW / ASSETS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {activeTab === 'workflow' && (
              <>
                {/* PREDICTIVE TIMELINE */}
                <div className="glass-card" style={{ padding: '35px', borderRadius: '32px', border: '1px solid #1E2532' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Project Velocity</h3>
                    <div style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 800 }}>84% COMPLETE</div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden', marginBottom: '40px' }}>
                    <div style={{ width: '40%', background: '#6366f1' }}></div>
                    <div style={{ width: '25%', background: '#818cf8' }}></div>
                    <div style={{ width: '19%', background: '#4f46e5' }}></div>
                    <div style={{ width: '16%', background: 'rgba(255,255,255,0.1)' }}></div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {tasks.map(task => (
                      <div key={task.id} style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1E2532', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: task.status === 'done' ? 'none' : '2px solid #374151', background: task.status === 'done' ? '#10b981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {task.status === 'done' && <i className="fa-solid fa-check" style={{ fontSize: '0.7rem', color: 'white' }}></i>}
                            {task.status === 'active' && <div style={{ width: '8px', height: '8px', background: '#818cf8', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: task.status === 'done' ? '#6B7280' : 'white' }}>{task.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#4B5563' }}>Assigned to: {task.assignee}</div>
                          </div>
                        </div>
                        {task.status === 'active' && <span style={{ fontSize: '0.7rem', background: 'rgba(129,140,248,0.1)', color: '#818cf8', padding: '4px 10px', borderRadius: '12px', fontWeight: 800 }}>IN PROGRESS</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'assets' && (
              <div className="glass-card" style={{ padding: '40px', borderRadius: '32px', border: '1px solid #1E2532' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '30px' }}>Asset Command</h3>
                <AssetDropzone />
              </div>
            )}

            {activeTab === 'brief' && (
              <div className="glass-card" style={{ padding: '40px', borderRadius: '32px', border: '1px solid #1E2532' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Project Brief & DNA</h3>
                <div style={{ fontSize: '0.95rem', color: '#9CA3AF', lineHeight: 1.8 }}>
                  <p>Building a high-fidelity fan film inspired by the Cyberpunk 2077 universe. Key focus on night-time cinematography, neon lighting, and advanced VFX integration.</p>
                  <ul style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <li><strong>Aesthetic:</strong> Gritty, High-Tech, Low-Life</li>
                    <li><strong>References:</strong> Blade Runner 2049, Ghost in the Shell</li>
                    <li><strong>Deliverables:</strong> 4K Master, HDR Color Grade, Behind the Scenes</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: GHOSTPM AI AGENT */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* AI AGENT WIDGET */}
            <div style={{ padding: '30px', background: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.2)', borderRadius: '32px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(129,140,248,0.1) 0%, transparent 70%)' }}></div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '10px', height: '10px', background: '#818cf8', borderRadius: '50%', boxShadow: '0 0 10px #818cf8' }}></div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#818cf8', letterSpacing: '1px', margin: 0 }}>GHOSTPM™ AGENT</h4>
              </div>

              <div style={{ background: '#0A0D14', border: '1px solid #1E2532', borderRadius: '16px', padding: '20px', fontSize: '0.85rem', color: '#D1D5DB', lineHeight: 1.6, marginBottom: '25px' }}>
                {aiAnalysis}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700 }}>RECOMMENDED ACTIONS</div>
                <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.75rem', textAlign: 'left', padding: '12px' }}>
                  <i className="fa-solid fa-clock" style={{ marginRight: '10px', color: '#818cf8' }}></i> Auto-schedule VFX Review
                </button>
                <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.75rem', textAlign: 'left', padding: '12px' }}>
                  <i className="fa-solid fa-microchip" style={{ marginRight: '10px', color: '#10b981' }}></i> Run AI Technical QC on Draft 3
                </button>
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="glass-card" style={{ padding: '25px', borderRadius: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Current Phase</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>POST-PRODUCTION</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Vault Status</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>$4,500 SECURED</span>
              </div>
              <div style={{ height: '4px', background: '#1E2532', borderRadius: '2px' }}>
                <div style={{ width: '60%', height: '100%', background: '#10b981', borderRadius: '2px' }}></div>
              </div>
            </div>

          </aside>

        </div>

      </div>
    </main>
  );
}
