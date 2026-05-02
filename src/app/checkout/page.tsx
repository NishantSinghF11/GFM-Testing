"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gigId = searchParams.get('gig') ? parseInt(searchParams.get('gig')!) : null;
  const packageType = (searchParams.get('package') ?? 'standard') as 'basic' | 'standard' | 'premium';

  const [gig, setGig] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isMilestone, setIsMilestone] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [fetchingGig, setFetchingGig] = useState(true);

  // Processing state for the Razorpay simulation modal
  const [processingState, setProcessingState] = useState<'idle' | 'initializing' | 'processing' | 'securing' | 'success'>('idle');

  const priceField = `price_${packageType}` as 'price_basic' | 'price_standard' | 'price_premium';
  const basePrice = gig?.[priceField] ?? (packageType === 'basic' ? 50 : packageType === 'standard' ? 150 : 300);
  const serviceFee = Math.round(basePrice * 0.05);
  const total = basePrice + serviceFee;

  useEffect(() => {
    const fetchGig = async () => {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      if (gigId) {
        const { data } = await supabase
          .from('gigs')
          .select('*, creator:profiles(id, name, initials, rating)')
          .eq('id', gigId)
          .single();
        setGig(data);
      }
      setFetchingGig(false);
    };
    fetchGig();
  }, [gigId]);

  const handleConfirm = async () => {
    try {
      setProcessingState('initializing');
      
      // Load Razorpay Script
      const loadScript = () => {
        return new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const isLoaded = await loadScript();
      if (!isLoaded) {
        alert('Razorpay SDK failed to load. Are you online?');
        setProcessingState('idle');
        return;
      }

      // Create Order on Server
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: isMilestone ? (total / 2) * 80 : total * 80, // Amount in INR
          currency: 'INR',
          receipt: `receipt_${Date.now()}`
        })
      });

      const orderData = await res.json();
      if (orderData.error) throw new Error(orderData.error);

      setProcessingState('processing');

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'GigsForMe',
        description: `Payment for ${gigTitle}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          // Success Callback
          setProcessingState('securing');
          
          const { createClient } = await import('@/lib/supabase/client');
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();

          if (user && gig) {
            await supabase.from('orders').insert({
              gig_id: gig.id,
              client_id: user.id,
              creator_id: gig.creator_id,
              package: packageType,
              status: 'funds_secured',
              total_price: isMilestone ? total / 2 : total,
              is_retainer: isMilestone,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });
          }

          setProcessingState('success');
          setTimeout(() => router.push('/dashboard'), 2000);
        },
        prefill: {
          name: 'GFM User',
          email: 'user@example.com'
        },
        theme: { color: '#6366f1' },
        modal: {
          ondismiss: function() {
            setProcessingState('idle');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      console.error(err);
      alert(`Payment Initialization Failed: ${err.message}`);
      setProcessingState('idle');
    }
  };

  const gigTitle = gig?.title ?? 'Cinematic Travel Video Edit';
  const packageLabel = packageType.charAt(0).toUpperCase() + packageType.slice(1);
  const creatorName = gig?.creator?.name ?? 'Alex Creative';
  const creatorRating = gig?.creator?.rating ?? 4.9;

  return (
    <div style={{ background: '#05070B', minHeight: '100vh', padding: '100px 20px 80px', color: 'white', position: 'relative', overflow: 'hidden' }}>
      
      {/* BACKGROUND QUANTUM FIELDS */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
      
      {/* PROCESSING MODAL OVERLAY */}
      {processingState !== 'idle' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'linear-gradient(180deg, #0A0D14 0%, #05070B 100%)', border: '1px solid #1E2532', borderRadius: '24px', padding: '40px', width: '400px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            
            <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 30px' }}>
              {processingState === 'success' ? (
                <div style={{ width: '80px', height: '80px', background: 'rgba(16,185,129,0.1)', border: '2px solid #10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontSize: '2.5rem', animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                  <i className="fa-solid fa-check"></i>
                </div>
              ) : (
                <>
                  <div style={{ position: 'absolute', inset: 0, border: '4px solid rgba(99,102,241,0.2)', borderRadius: '50%' }}></div>
                  <div style={{ position: 'absolute', inset: 0, border: '4px solid transparent', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', fontSize: '1.5rem' }}>
                    {processingState === 'initializing' && <i className="fa-solid fa-server"></i>}
                    {processingState === 'processing' && <i className="fa-brands fa-razorpay"></i>}
                    {processingState === 'securing' && <i className="fa-solid fa-shield-halved"></i>}
                  </div>
                </>
              )}
            </div>

            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>
              {processingState === 'initializing' && 'Initializing Secure Gateway...'}
              {processingState === 'processing' && 'Processing Payment...'}
              {processingState === 'securing' && 'Securing Funds in GFM Vault...'}
              {processingState === 'success' && 'Funds Secured!'}
            </h3>
            
            <p style={{ color: '#9CA3AF', fontSize: '0.95rem', margin: 0 }}>
              {processingState === 'initializing' && 'Connecting to Razorpay API.'}
              {processingState === 'processing' && 'Authorizing transaction with your bank.'}
              {processingState === 'securing' && 'Locking payment in escrow. Do not close this window.'}
              {processingState === 'success' && 'Redirecting to your project dashboard...'}
            </p>

          </div>
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', fontFamily: 'var(--font-heading)' }}>
          Secure Checkout <i className="fa-solid fa-lock" style={{ color: '#10b981', fontSize: '1.8rem', marginLeft: '10px' }}></i>
        </h1>
        <p style={{ color: '#9CA3AF', fontSize: '1.1rem', marginBottom: '40px' }}>Powered by Razorpay & GFM Vault™</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'start' }}>
          
          {/* LEFT COLUMN: Trust & Vault Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            {/* The GFM Vault Explanation */}
            <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(168,85,247,0.05) 100%)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '24px', padding: '30px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', borderRadius: '50%' }}></div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', boxShadow: '0 10px 20px rgba(99,102,241,0.3)' }}>
                  <i className="fa-solid fa-vault"></i>
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.3rem', fontFamily: 'var(--font-heading)' }}>GFM Vault™ Protection</h2>
                  <div style={{ color: '#818cf8', fontSize: '0.85rem', fontWeight: 600 }}>100% Escrow Guarantee</div>
                </div>
              </div>

              <p style={{ color: '#D1D5DB', lineHeight: 1.6, marginBottom: '25px' }}>
                Your money is <strong>never</strong> sent directly to the creator. It is held securely in our Razorpay-backed vault until you approve the final deliverables.
              </p>

              <div style={{ display: 'flex', gap: '15px', background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <i className="fa-solid fa-credit-card" style={{ color: '#9CA3AF', fontSize: '1.2rem', marginBottom: '10px' }}></i>
                  <div style={{ fontSize: '0.8rem', color: 'white', fontWeight: 600 }}>1. You Pay</div>
                </div>
                <div style={{ color: '#6366f1', display: 'flex', alignItems: 'center' }}><i className="fa-solid fa-arrow-right"></i></div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <i className="fa-solid fa-shield-halved" style={{ color: '#10b981', fontSize: '1.2rem', marginBottom: '10px' }}></i>
                  <div style={{ fontSize: '0.8rem', color: 'white', fontWeight: 600 }}>2. Vault Holds</div>
                </div>
                <div style={{ color: '#6366f1', display: 'flex', alignItems: 'center' }}><i className="fa-solid fa-arrow-right"></i></div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <i className="fa-solid fa-check-circle" style={{ color: '#a855f7', fontSize: '1.2rem', marginBottom: '10px' }}></i>
                  <div style={{ fontSize: '0.8rem', color: 'white', fontWeight: 600 }}>3. You Approve</div>
                </div>
              </div>
            </div>

            {/* AI Security Insights & Live HUD */}
            <div style={{ background: '#0A0D14', border: '1px solid #1E2532', borderRadius: '24px', padding: '25px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-brain" style={{ color: '#3b82f6' }}></i> Neural Security HUD
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 800 }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', animation: 'pulse 1.5s infinite' }}></div>
                  GATEWAY: SECURE
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', padding: '15px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600, marginBottom: '5px' }}>SUCCESS RATE</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>98.4%</div>
                  <div style={{ fontSize: '0.7rem', color: '#6B7280', marginTop: '5px' }}>Verified Deliveries</div>
                </div>
                <div style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)', padding: '15px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600, marginBottom: '5px' }}>SCAN INTEGRITY</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>100%</div>
                  <div style={{ fontSize: '0.7rem', color: '#6B7280', marginTop: '5px' }}>TLS 1.3 Encryption</div>
                </div>
              </div>

              {/* Live Scan Ticker */}
              <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '12px', fontSize: '0.7rem', color: '#4B5563', fontFamily: 'monospace', overflow: 'hidden' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ color: '#818cf8' }}>[SCAN]</span>
                  <span style={{ animation: 'typing 3s steps(40) infinite' }}>Checking Razorpay endpoints... OK</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <span style={{ color: '#10b981' }}>[AUTH]</span>
                  <span>Escrow handshake initialized...</span>
                </div>
              </div>
            </div>

            {/* Creator Trust Card */}
            <div style={{ background: '#0A0D14', border: '1px solid #1E2532', borderRadius: '24px', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#1F2937', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700, color: '#D1D5DB' }}>
                {creatorName.substring(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>{creatorName}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#9CA3AF', marginTop: '4px' }}>
                  <span style={{ color: '#fbbf24' }}><i className="fa-solid fa-star"></i> {creatorRating}</span>
                  <span>•</span>
                  <span><i className="fa-solid fa-shield-check" style={{ color: '#10b981' }}></i> Verified Partner</span>
                </div>
              </div>
            </div>

          </div>


          {/* RIGHT COLUMN: Payment & Razorpay UI */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            {/* Order Summary Box */}
            <div style={{ background: '#0A0D14', border: '1px solid #1E2532', borderRadius: '24px', padding: '30px' }}>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', paddingBottom: '25px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '80px', height: '60px', borderRadius: '10px', background: `linear-gradient(135deg, ${gig?.thumb_color ?? '#6366f1'}, #1E2532)`, flexShrink: 0 }}></div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '5px', color: 'white' }}>{gigTitle}</div>
                  <div style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 600 }}>{packageLabel} Package</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#D1D5DB', fontSize: '0.95rem' }}>
                <span>Package Escrow</span>
                <span style={{ fontWeight: 600, color: 'white' }}>₹{(basePrice * 80).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', color: '#D1D5DB', fontSize: '0.95rem' }}>
                <span>Vault Service Fee (5%)</span>
                <span style={{ fontWeight: 600, color: 'white' }}>₹{(serviceFee * 80).toLocaleString()}</span>
              </div>

              {/* Escrow Milestone Toggle */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '15px', marginBottom: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'white' }}>Payment Structure</div>
                  <div style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8', fontSize: '0.7rem', padding: '4px 8px', borderRadius: '10px', fontWeight: 700 }}>NEW</div>
                </div>
                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', padding: '4px' }}>
                  <button onClick={() => setIsMilestone(false)} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '6px', background: !isMilestone ? 'rgba(255,255,255,0.1)' : 'transparent', color: !isMilestone ? 'white' : '#6B7280', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>Pay in Full</button>
                  <button onClick={() => setIsMilestone(true)} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '6px', background: isMilestone ? 'rgba(255,255,255,0.1)' : 'transparent', color: isMilestone ? 'white' : '#6B7280', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>Milestone (50/50)</button>
                </div>
                {isMilestone && <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '10px', textAlign: 'center' }}>You will be charged ₹{((total / 2) * 80).toLocaleString()} now, and the rest upon milestone 1 approval.</div>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '1.1rem', color: 'white', fontWeight: 600 }}>Total Due</span>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>₹{isMilestone ? ((total / 2) * 80).toLocaleString() : (total * 80).toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method Selector (Razorpay Mock) */}
            <div style={{ background: '#0A0D14', border: '1px solid #1E2532', borderRadius: '24px', padding: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Payment Method</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 600 }}>
                  <i className="fa-solid fa-lock" style={{ color: '#10b981' }}></i> Secured by Razorpay
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                <div onClick={() => setPaymentMethod('upi')} style={{ border: `1px solid ${paymentMethod === 'upi' ? '#6366f1' : '#1E2532'}`, background: paymentMethod === 'upi' ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${paymentMethod === 'upi' ? '#6366f1' : '#4B5563'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {paymentMethod === 'upi' && <div style={{ width: '10px', height: '10px', background: '#6366f1', borderRadius: '50%' }}></div>}
                  </div>
                  <i className="fa-brands fa-google-pay" style={{ fontSize: '1.8rem', color: 'white' }}></i>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>UPI (GPay, PhonePe, Paytm)</div>
                </div>

                <div onClick={() => setPaymentMethod('card')} style={{ border: `1px solid ${paymentMethod === 'card' ? '#6366f1' : '#1E2532'}`, background: paymentMethod === 'card' ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${paymentMethod === 'card' ? '#6366f1' : '#4B5563'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {paymentMethod === 'card' && <div style={{ width: '10px', height: '10px', background: '#6366f1', borderRadius: '50%' }}></div>}
                  </div>
                  <i className="fa-solid fa-credit-card" style={{ fontSize: '1.4rem', color: '#9CA3AF' }}></i>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Credit / Debit Card</div>
                </div>

                <div onClick={() => setPaymentMethod('netbanking')} style={{ border: `1px solid ${paymentMethod === 'netbanking' ? '#6366f1' : '#1E2532'}`, background: paymentMethod === 'netbanking' ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${paymentMethod === 'netbanking' ? '#6366f1' : '#4B5563'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {paymentMethod === 'netbanking' && <div style={{ width: '10px', height: '10px', background: '#6366f1', borderRadius: '50%' }}></div>}
                  </div>
                  <i className="fa-solid fa-building-columns" style={{ fontSize: '1.4rem', color: '#9CA3AF' }}></i>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>NetBanking</div>
                </div>
              </div>

              <button 
                onClick={handleConfirm} 
                disabled={processingState !== 'idle' || fetchingGig}
                style={{ 
                  width: '100%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', border: 'none', borderRadius: '16px', padding: '20px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 25px rgba(99,102,241,0.4)', transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Secure Payment in GFM Vault
                <i className="fa-solid fa-arrow-right"></i>
              </button>
              
              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#6B7280', marginTop: '15px' }}>
                By proceeding, you agree to the Escrow Auto-Release Policy.
              </div>
            </div>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scaleIn {
          0% { transform: scale(0); }
          80% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
      `}} />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#05070B' }}><i className="fa-solid fa-circle-notch fa-spin fa-3x" style={{ color: '#6366f1' }}></i></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
