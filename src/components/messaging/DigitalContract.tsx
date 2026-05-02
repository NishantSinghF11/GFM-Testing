"use client";

import React from 'react';
import { CurrentUser, SmartOfferMeta } from './types';

interface DigitalContractProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUser;
  offerData: SmartOfferMeta | null;
}

export default function DigitalContract({ isOpen, onClose, currentUser, offerData }: DigitalContractProps) {
  if (!isOpen) return null;

  // Mock data if none provided (for demo)
  const defaultData = {
    price: '$500',
    timeline: '5 Days',
    deliverables: [
      '4K Cinematic Video (3-5 mins)',
      'Color Grading & Sound Design',
      '2 Social Media Teasers',
      'Raw Footage Handover'
    ],
    revisions: 3,
    id: 'GFM-X82-K91-Z'
  };
  const data = {
    ...defaultData,
    ...offerData,
    deliverables: offerData?.title ? [offerData.title] : defaultData.deliverables,
    revisions: Number(offerData?.revisions ?? defaultData.revisions),
    id: defaultData.id
  };

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', zIndex: 10002, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      
      <div style={{ width: '100%', maxWidth: '800px', height: '90vh', background: 'white', color: '#111827', borderRadius: '8px', overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: '0 50px 100px rgba(0,0,0,0.5)' }}>
        
        {/* Close Button (Fixed) */}
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: '#f3f4f6', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#4b5563' }}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Contract Content */}
        <div style={{ padding: '60px 80px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <img src="/assets/logo.png" alt="GFM" style={{ height: '30px', filter: 'invert(1)' }} />
                <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#000' }}>
                  Gigs<span style={{ 
                    background: 'linear-gradient(135deg, #04aafa, #3555c5)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: 900
                  }}>For</span>Me
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6B7280', letterSpacing: '2px', fontWeight: 700 }}>SECURE TRANSACTION DEED</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '4px' }}>CONTRACT ID</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'monospace' }}>{data.id}</div>
            </div>
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '40px', borderBottom: '2px solid #E5E7EB', paddingBottom: '20px', fontFamily: 'var(--font-heading)' }}>Deal Specification Sheet</h1>

          {/* Parties */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '50px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase' }}>Service Provider</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{currentUser.role === 'creator' ? currentUser.name : 'Verified GFM Creator'}</div>
              <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Electronic Signature Verified via GFM</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase' }}>Service Recipient</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{currentUser.role === 'client' ? currentUser.name : 'Verified GFM Client'}</div>
              <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>Electronic Signature Verified via GFM</div>
            </div>
          </div>

          {/* Terms */}
          <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '30px', marginBottom: '50px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Agreed Terms & Scope</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <div style={{ background: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: '0.7rem', color: '#9CA3AF', fontWeight: 700, marginBottom: '5px' }}>TOTAL CONSIDERATION</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>{data.price} <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 400 }}>(USD)</span></div>
              </div>
              <div style={{ background: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: '0.7rem', color: '#9CA3AF', fontWeight: 700, marginBottom: '5px' }}>DELIVERY TIMELINE</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{data.timeline}</div>
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <div style={{ fontSize: '0.7rem', color: '#9CA3AF', fontWeight: 700, marginBottom: '10px' }}>SCOPE OF WORK / DELIVERABLES</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data.deliverables.map((item: string, idx: number) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: '#374151' }}>
                    <span style={{ color: '#8B5CF6', fontWeight: 700 }}>•</span> {item}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: '#9CA3AF', fontWeight: 700, marginBottom: '5px' }}>REVISION ENTITLEMENT</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Up to {data.revisions} Rounds of Feedback</div>
            </div>
          </div>

          {/* Legal Clauses (Mini) */}
          <div style={{ marginBottom: '60px' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '15px', textTransform: 'uppercase' }}>GFM Protection Clauses</h3>
            <div style={{ fontSize: '0.8rem', color: '#6B7280', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p><strong>1. Escrow Guarantee:</strong> All funds are held by GFM Vault and will only be released upon formal approval of the deliverables by the Recipient, or as specified in the Milestone Schedule.</p>
              <p><strong>2. Intellectual Property:</strong> Upon final release of funds, all intellectual property rights associated with the deliverables are transferred from the Provider to the Recipient in full.</p>
              <p><strong>3. Neutral Mediation:</strong> In case of disputes, both parties agree to first engage with the GFM AI Resolution Center as a neutral mediator.</p>
            </div>
          </div>

          {/* Signatures */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', paddingTop: '40px', borderTop: '2px solid #F3F4F6' }}>
            <div>
              <div style={{ fontFamily: '"Great Vibes", cursive', fontSize: '2rem', marginBottom: '10px', color: '#1F2937' }}>{currentUser.role === 'creator' ? currentUser.name : 'Alex Creative'}</div>
              <div style={{ borderTop: '1px solid #000', paddingTop: '10px', fontSize: '0.75rem', fontWeight: 700 }}>PROVIDER SIGNATURE</div>
              <div style={{ fontSize: '0.65rem', color: '#9CA3AF', marginTop: '4px' }}>IP ADDRESS: 192.168.1.XXX • TIMESTAMP: {today}</div>
            </div>
            <div>
              <div style={{ fontFamily: '"Great Vibes", cursive', fontSize: '2rem', marginBottom: '10px', color: '#1F2937' }}>{currentUser.role === 'client' ? currentUser.name : 'Verified Client'}</div>
              <div style={{ borderTop: '1px solid #000', paddingTop: '10px', fontSize: '0.75rem', fontWeight: 700 }}>RECIPIENT SIGNATURE</div>
              <div style={{ fontSize: '0.65rem', color: '#9CA3AF', marginTop: '4px' }}>IP ADDRESS: 45.23.11.XXX • TIMESTAMP: {today}</div>
            </div>
          </div>

          {/* Branding Seal */}
          <div style={{ marginTop: '80px', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', border: '4px double #E5E7EB', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E5E7EB', fontSize: '2.5rem' }}>
              <i className="fa-solid fa-stamp"></i>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>This document is cryptographically secured by GigsForMe</div>
          </div>

        </div>

        {/* Action Bar (Fixed) */}
        <div style={{ marginTop: 'auto', padding: '20px 80px', background: '#F9FAFB', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#6B7280' }}>
            <i className="fa-solid fa-file-pdf" style={{ fontSize: '1.2rem' }}></i> GFM_Contract_{data.id}.pdf
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button style={{ padding: '10px 20px', background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}><i className="fa-solid fa-print"></i> Print</button>
            <button onClick={() => alert('Downloading secure PDF...')} style={{ padding: '10px 20px', background: '#111827', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}><i className="fa-solid fa-download"></i> Download PDF</button>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
      `}} />
    </div>
  );
}
