"use client";

import React, { useState, useEffect } from 'react';
import { CurrentUser, SmartOfferMeta } from './types';

interface ResolutionCenterProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUser;
  activeOffer: SmartOfferMeta | null;
  addToast: (text: string, icon?: string) => void;
}

export default function ResolutionCenter({ isOpen, onClose, currentUser, activeOffer, addToast }: ResolutionCenterProps) {
  const [stage, setStage] = useState<'init' | 'statement' | 'analysis' | 'suggestion' | 'finalized'>('init');
  const [issueType, setIssueType] = useState<string>('');
  const [userStatement, setUserStatement] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);

  if (!isOpen) return null;

  const isClient = currentUser.role === 'client';

  const handleStartResolution = (type: string) => {
    setIssueType(type);
    setStage('statement');
  };

  const handleAnalyze = () => {
    setStage('analysis');
    // Simulate AI analysis of chat & offer
    setTimeout(() => {
      setAiSuggestion({
        reasoning: "Based on the Smart Offer terms (3-day timeline) and the chat logs, the creator is currently 24 hours overdue on Milestone 2. However, 2 revisions have already been delivered as promised.",
        options: [
          { id: '1', title: 'Speed-Up Request', desc: 'Demand delivery within 6 hours with a $20 "Delay Credit" refund.', action: 'credit' },
          { id: '2', title: 'Neutral Cancellation', desc: 'Cancel the project with a 50% partial refund for work completed.', action: 'partial' },
          { id: '3', title: 'Extended Revision', desc: 'Allow 48 extra hours in exchange for 2 additional free revisions.', action: 'revision' }
        ]
      });
      setStage('suggestion');
    }, 2500);
  };

  const handleFinalize = (optionTitle: string) => {
    setStage('finalized');
    addToast(`Resolution Proposed: ${optionTitle}`, 'fa-gavel');
    setTimeout(onClose, 3000);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      
      <div style={{ width: '100%', maxWidth: '600px', background: '#0A0D14', border: '1px solid #1E2532', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 30px 100px rgba(0,0,0,0.8)' }}>
        
        {/* Header */}
        <div style={{ padding: '30px', borderBottom: '1px solid #1E2532', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(90deg, rgba(59,130,246,0.05) 0%, transparent 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '45px', height: '45px', background: 'rgba(59,130,246,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontSize: '1.2rem' }}>
              <i className="fa-solid fa-scale-balanced"></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>AI Resolution Center</h3>
              <div style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase' }}>Neutral GFM Mediation</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: '1.5rem', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
        </div>

        {/* Content */}
        <div style={{ padding: '40px' }}>
          
          {stage === 'init' && (
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ fontSize: '1.4rem', marginBottom: '15px' }}>How can we help resolve this?</h4>
              <p style={{ color: '#9CA3AF', marginBottom: '30px' }}>Our AI mediator will review your project terms and communication history to suggest a fair solution.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <button onClick={() => handleStartResolution('delay')} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1E2532', padding: '25px', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}>
                  <i className="fa-solid fa-clock" style={{ fontSize: '2rem', color: '#3b82f6', marginBottom: '15px', display: 'block' }}></i>
                  <div style={{ fontWeight: 700, marginBottom: '5px' }}>Delayed Delivery</div>
                  <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Timeline has been exceeded</div>
                </button>
                <button onClick={() => handleStartResolution('quality')} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1E2532', padding: '25px', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}>
                  <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize: '2rem', color: '#3b82f6', marginBottom: '15px', display: 'block' }}></i>
                  <div style={{ fontWeight: 700, marginBottom: '5px' }}>Quality Issue</div>
                  <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Not as described in offer</div>
                </button>
                <button onClick={() => handleStartResolution('communication')} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1E2532', padding: '25px', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}>
                  <i className="fa-solid fa-comment-slash" style={{ fontSize: '2rem', color: '#3b82f6', marginBottom: '15px', display: 'block' }}></i>
                  <div style={{ fontWeight: 700, marginBottom: '5px' }}>Ghosting</div>
                  <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Creator is unresponsive</div>
                </button>
                <button onClick={() => handleStartResolution('other')} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1E2532', padding: '25px', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3b82f6'}>
                  <i className="fa-solid fa-ellipsis" style={{ fontSize: '2rem', color: '#3b82f6', marginBottom: '15px', display: 'block' }}></i>
                  <div style={{ fontWeight: 700, marginBottom: '5px' }}>Something Else</div>
                  <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Other conflict types</div>
                </button>
              </div>
            </div>
          )}

          {stage === 'statement' && (
            <div>
              <button onClick={() => setStage('init')} style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: '0.8rem', cursor: 'pointer', marginBottom: '15px' }}><i className="fa-solid fa-arrow-left"></i> BACK</button>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Describe the situation</h4>
              <p style={{ color: '#9CA3AF', fontSize: '0.9rem', marginBottom: '20px' }}>Provide details on what went wrong. The AI will cross-reference this with the contract terms.</p>
              <textarea 
                placeholder="e.g., The creator promised the first draft 2 days ago but hasn't responded to my last 3 messages..."
                value={userStatement}
                onChange={(e) => setUserStatement(e.target.value)}
                style={{ width: '100%', height: '150px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1E2532', borderRadius: '16px', padding: '20px', color: 'white', outline: 'none', marginBottom: '25px', resize: 'none' }}
              />
              <button 
                onClick={handleAnalyze}
                disabled={!userStatement.trim()}
                style={{ width: '100%', background: '#3b82f6', color: 'white', padding: '18px', borderRadius: '16px', fontWeight: 700, cursor: 'pointer', border: 'none', opacity: userStatement.trim() ? 1 : 0.5 }}
              >
                Begin AI Analysis
              </button>
            </div>
          )}

          {stage === 'analysis' && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: '80px', height: '80px', margin: '0 auto 30px', position: 'relative' }}>
                 <div style={{ position: 'absolute', inset: 0, border: '4px solid rgba(59,130,246,0.1)', borderRadius: '50%' }}></div>
                 <div style={{ position: 'absolute', inset: 0, border: '4px solid transparent', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1.5s linear infinite' }}></div>
                 <i className="fa-solid fa-brain" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontSize: '2rem' }}></i>
              </div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Analyzing Project History...</h4>
              <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>Reviewing Smart Offer, Chat Logs, and Milestone statuses.</p>
            </div>
          )}

          {stage === 'suggestion' && (
            <div style={{ animation: 'fadeIn 0.5s' }}>
              <div style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)', padding: '20px', borderRadius: '16px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                  <i className="fa-solid fa-robot" style={{ color: '#3b82f6' }}></i>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#3b82f6', textTransform: 'uppercase' }}>AI Mediator Verdict</div>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#D1D5DB', lineHeight: 1.5 }}>{aiSuggestion.reasoning}</p>
              </div>

              <h5 style={{ margin: '0 0 15px 0', fontSize: '1rem' }}>Recommended Solutions:</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {aiSuggestion.options.map((opt: any) => (
                  <button 
                    key={opt.id} 
                    onClick={() => handleFinalize(opt.title)}
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1E2532', padding: '20px', borderRadius: '16px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59,130,246,0.05)'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <div style={{ fontWeight: 700, color: 'white' }}>{opt.title}</div>
                      <i className="fa-solid fa-chevron-right" style={{ color: '#4B5563', fontSize: '0.8rem' }}></i>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {stage === 'finalized' && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
               <div style={{ width: '80px', height: '80px', background: 'rgba(16,185,129,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontSize: '2.5rem', margin: '0 auto 25px', animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                  <i className="fa-solid fa-check"></i>
               </div>
               <h4 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>Proposal Sent</h4>
               <p style={{ color: '#9CA3AF', fontSize: '0.95rem' }}>We've notified the other party of this proposed resolution. If they accept, the vault status will update automatically.</p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{ padding: '20px 30px', borderTop: '1px solid #1E2532', background: 'rgba(0,0,0,0.2)', display: 'flex', gap: '15px', alignItems: 'center' }}>
          <i className="fa-solid fa-shield-halved" style={{ color: '#10b981' }}></i>
          <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
            The AI mediator is 100% neutral and follows GFM Protocol v4.2. Your funds remain secured in the Vault during this process.
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes scaleIn { 0% { transform: scale(0); } 100% { transform: scale(1); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}} />

    </div>
  );
}
