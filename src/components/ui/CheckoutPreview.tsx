"use client";

import React from 'react';

interface CheckoutPreviewProps {
  offer: any;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CheckoutPreview({ offer, isOpen, onClose, onConfirm }: CheckoutPreviewProps) {
  if (!isOpen) return null;

  const price = parseInt(offer.price.replace('$', '')) || 0;
  const serviceFee = Math.round(price * 0.05);
  const total = price + serviceFee;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#0A0D14', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '24px', width: '100%', maxWidth: '500px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 40px rgba(16,185,129,0.1)' }}>
        
        {/* Header */}
        <div style={{ background: 'rgba(16,185,129,0.05)', padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', background: 'rgba(16,185,129,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontSize: '1.5rem', margin: '0 auto 15px' }}>
            <i className="fa-solid fa-shield-check"></i>
          </div>
          <h3 style={{ margin: 0, color: 'white', fontSize: '1.3rem' }}>Secure Checkout Preview</h3>
          <p style={{ color: '#9CA3AF', fontSize: '0.85rem', marginTop: '8px' }}>Your payment is protected by GFM Escrow</p>
        </div>

        {/* Breakdown */}
        <div style={{ padding: '30px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#D1D5DB' }}>
              <span>{offer.title}</span>
              <span style={{ color: 'white', fontWeight: 600 }}>${price}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#D1D5DB' }}>
              <span>GFM Service Fee (5%)</span>
              <span style={{ color: 'white', fontWeight: 600 }}>+${serviceFee}</span>
            </div>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '5px 0' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontSize: '1.2rem', fontWeight: 700 }}>
              <span>Total to Pay</span>
              <span style={{ color: '#10b981' }}>${total}</span>
            </div>
          </div>

          {/* Trust Box */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1E2532', borderRadius: '16px', padding: '16px', marginBottom: '30px' }}>
             <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <i className="fa-solid fa-lock" style={{ color: '#fbbf24', marginTop: '3px' }}></i>
                <div>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>Escrow Guarantee</div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#9CA3AF', lineHeight: 1.5 }}>Funds are held securely in GFM Vault and only released after you approve the final delivery. You can request revisions or a refund if expectations aren't met.</p>
                </div>
             </div>
          </div>

          {/* Roadmap */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '30px' }}>
             <div style={{ textAlign: 'center', opacity: 1, color: '#10b981' }}>
                <div style={{ fontWeight: 800 }}>1. Review</div>
                <div style={{ fontSize: '0.6rem' }}>COMPLETED</div>
             </div>
             <i className="fa-solid fa-chevron-right" style={{ marginTop: '10px' }}></i>
             <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, color: 'white' }}>2. Fund</div>
                <div style={{ fontSize: '0.6rem' }}>NEXT STEP</div>
             </div>
             <i className="fa-solid fa-chevron-right" style={{ marginTop: '10px' }}></i>
             <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800 }}>3. Create</div>
                <div style={{ fontSize: '0.6rem' }}>PENDING</div>
             </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={onClose} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid #374151', color: 'white', padding: '14px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            <button onClick={onConfirm} style={{ flex: 1, background: '#10b981', border: 'none', color: 'white', padding: '14px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 20px rgba(16,185,129,0.3)' }}>Confirm & Pay</button>
          </div>
        </div>

      </div>
    </div>
  );
}
