"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TenderAnalytics from '@/components/tenders/TenderAnalytics';
import NicheMastery from '@/components/ui/NicheMastery';

interface TenderDetailClientProps {
  tender: any;
  bids: any[];
}

export default function TenderDetailClient({ tender, bids }: TenderDetailClientProps) {
  const router = useRouter();
  
  // Simulation: Toggle between Client and Creator view for demo purposes
  const [isClientView, setIsClientView] = useState(true);
  
  // State for Bidding (Creator)
  const [bidAmount, setBidAmount] = useState('');
  const [proposal, setProposal] = useState('');

  // State for Management (Client)
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState(false);

  // ADVANCED MULTI-WEIGHTED RANKING ENGINE
  const rankedBids = useMemo(() => {
    return [...bids].sort((a, b) => {
      const avgBid = bids.reduce((acc, x) => acc + x.amount, 0) / (bids.length || 1);
      
      // Calculate individual factor scores (0-100)
      const trustWeight = a.creator_trust_score * 0.3;
      const confidenceWeight = a.delivery_confidence * 0.4;
      const velocityWeight = (a.timeline.includes('day') ? 80 : 60) * 0.2; // Mocked velocity score
      const priceWeight = (a.amount <= avgBid ? 90 : 60) * 0.1; // Competitive pricing bonus

      const scoreA = trustWeight + confidenceWeight + velocityWeight + priceWeight;

      // Repeat for B
      const trustWeightB = b.creator_trust_score * 0.3;
      const confidenceWeightB = b.delivery_confidence * 0.4;
      const velocityWeightB = (b.timeline.includes('day') ? 80 : 60) * 0.2;
      const priceWeightB = (b.amount <= avgBid ? 90 : 60) * 0.1;
      
      const scoreB = trustWeightB + confidenceWeightB + velocityWeightB + priceWeightB;

      return scoreB - scoreA;
    });
  }, [bids]);

  const toggleShortlist = (bidId: string) => {
    setShortlistedIds(prev => 
      prev.includes(bidId) ? prev.filter(i => i !== bidId) : [...prev, bidId]
    );
  };

  return (
    <div style={{ background: '#05070B', minHeight: '100vh', color: 'white', padding: '120px 20px 60px' }}>
      
      {/* VIEW TOGGLE (DEMO ONLY) */}
      <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 1000, background: 'rgba(0,0,0,0.8)', padding: '10px', borderRadius: '12px', border: '1px solid #374151', display: 'flex', gap: '10px' }}>
        <button onClick={() => setIsClientView(true)} style={{ background: isClientView ? '#6366f1' : 'transparent', border: 'none', color: 'white', padding: '5px 15px', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer' }}>Client View</button>
        <button onClick={() => setIsClientView(false)} style={{ background: !isClientView ? '#6366f1' : 'transparent', border: 'none', color: 'white', padding: '5px 15px', borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer' }}>Creator View</button>
      </div>

      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px' }}>
        
        {/* Left Side: Details & Bids */}
        <div>
          <Link href="/tenders" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#6B7280', fontSize: '0.9rem', marginBottom: '30px' }}>
            <i className="fa-solid fa-arrow-left"></i> Back to Hub
          </Link>

          {/* Tender Header */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <span className={`badge ${tender.urgency_level === 'hot' ? 'badge-accent' : 'badge-primary'}`}>
                {tender.urgency_level === 'hot' && <i className="fa-solid fa-fire" style={{ marginRight: '6px' }}></i>}
                {tender.urgency_level.toUpperCase()}
              </span>
              <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>
                <i className="fa-solid fa-hourglass-half" style={{ marginRight: '6px' }}></i> Closes in 4d 12h
              </span>
            </div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{tender.title}</h1>
            <p style={{ fontSize: '1.1rem', color: '#D1D5DB', lineHeight: 1.8 }}>{tender.description}</p>
          </div>

          {isClientView ? (
            /* CLIENT VIEW: BID MANAGEMENT */
            <div style={{ marginTop: '60px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '1.5rem' }}>AI-Ranked Proposals <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>({bids.length})</span></h2>
                <button onClick={() => setCompareMode(!compareMode)} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
                  <i className="fa-solid fa-columns"></i> Compare Shortlist ({shortlistedIds.length})
                </button>
              </div>

              {compareMode && shortlistedIds.length > 1 ? (
                /* COMPARISON VIEW */
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${shortlistedIds.length}, 1fr)`, gap: '20px', marginBottom: '40px' }}>
                  {shortlistedIds.map(sid => {
                    const b = bids.find(x => x.id === sid)!;
                    return (
                      <div key={sid} className="glass-card premium-border" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ fontWeight: 700, marginBottom: '15px', color: '#818cf8' }}>{b.creator_name}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem', color: '#9CA3AF' }}>
                          <div><i className="fa-solid fa-dollar-sign"></i> ${b.amount}</div>
                          <div><i className="fa-solid fa-clock"></i> {b.timeline}</div>
                          <div><i className="fa-solid fa-shield-check"></i> {b.delivery_confidence}% Confidence</div>
                          <div><i className="fa-solid fa-brain"></i> {b.rank_score}% AI Match</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* NORMAL LIST VIEW */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {rankedBids.map((bid, idx) => (
                    <div key={bid.id} className="glass-card premium-border" style={{ padding: '25px', display: 'grid', gridTemplateColumns: '60px 1fr 150px', gap: '20px', alignItems: 'center', position: 'relative', opacity: bid.risk_level === 'high' ? 0.7 : 1 }}>
                      {idx === 0 && <div style={{ position: 'absolute', top: '-10px', left: '20px', background: 'linear-gradient(90deg, #818cf8, #c084fc)', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase', boxShadow: '0 0 10px rgba(129,140,248,0.5)' }}>ALGORITHM PICK</div>}
                      {bid.delivery_confidence > 95 && <div style={{ position: 'absolute', top: '-10px', left: idx === 0 ? '140px' : '20px', background: '#10b981', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase' }}>RELIABILITY LEADER</div>}
                      {bid.amount < 1000 && <div style={{ position: 'absolute', top: '-10px', left: bid.delivery_confidence > 95 ? (idx === 0 ? '280px' : '160px') : '20px', background: '#6366f1', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase' }}>MARKET VALUE</div>}
                      
                      <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700, color: '#818cf8' }}>
                        {bid.creator_name[0]}
                      </div>
                      
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{bid.creator_name}</span>
                          <span style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '2px 8px', borderRadius: '8px' }}>{bid.creator_trust_score} Trust</span>
                        </div>
                        <NicheMastery />
                        <p style={{ color: '#9CA3AF', fontSize: '0.85rem', lineHeight: 1.5, marginTop: '15px', marginBottom: '15px' }}>{bid.proposal}</p>
                        <div style={{ display: 'flex', gap: '20px', fontSize: '0.8rem', color: '#6B7280' }}>
                          <span><i className="fa-solid fa-dollar-sign" style={{ color: '#10b981' }}></i> SEALED</span>
                          <span><i className="fa-solid fa-clock"></i> {bid.timeline}</span>
                          <span><i className="fa-solid fa-brain" style={{ color: '#818cf8' }}></i> {bid.rank_score}% Match</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button onClick={() => toggleShortlist(bid.id)} className={`btn ${shortlistedIds.includes(bid.id) ? 'btn-primary' : 'btn-secondary'}`} style={{ fontSize: '0.75rem', padding: '8px' }}>
                          {shortlistedIds.includes(bid.id) ? 'Shortlisted' : 'Shortlist'}
                        </button>
                        <button className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '8px' }}>Clarify</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* CREATOR VIEW: THE PROJECT BRIEF */
            <div style={{ marginTop: '40px' }}>
              <h3 style={{ fontSize: '1rem', color: 'white', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Project Requirements</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                {tender.tags.map((tag: string) => (
                  <div key={tag} style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fa-solid fa-circle-check" style={{ color: '#818cf8' }}></i>
                    <span style={{ fontSize: '0.9rem' }}>{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Intelligence & Actions */}
        <aside>
          {isClientView ? (
            /* CLIENT INTELLIGENCE SIDEBAR */
            <TenderAnalytics tender={tender} bids={bids} />
          ) : (
            /* CREATOR BIDDING SIDEBAR */
            <div className="glass-card premium-border" style={{ padding: '30px', background: 'rgba(10,13,20,0.8)', position: 'sticky', top: '120px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 10px #f59e0b' }}></div>
                <h3 style={{ fontSize: '0.9rem', color: 'white', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>High Stakes Bidding</h3>
              </div>

              <div className="form-group">
                <label>Bid Amount ($)</label>
                <input type="number" className="form-control glass-liquid premium-border" placeholder="Your competitive price" value={bidAmount} onChange={e => setBidAmount(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Delivery Timeline</label>
                <input type="text" className="form-control glass-liquid premium-border" placeholder="e.g. 5 business days" required />
              </div>

              <div className="form-group">
                <label>Bid Expiry (Urgency)</label>
                <select className="form-control glass-liquid premium-border">
                  <option>Expires in 24 Hours</option>
                  <option>Expires in 48 Hours</option>
                  <option>Valid for 7 Days</option>
                </select>
              </div>

              <button className="btn btn-primary animate-shimmer" style={{ width: '100%', padding: '15px', marginTop: '10px' }}>Submit Sealed Bid</button>

              <div style={{ marginTop: '25px', padding: '15px', background: 'rgba(245,158,11,0.05)', borderRadius: '12px', border: '1px solid rgba(245,158,11,0.2)', fontSize: '0.75rem', color: '#D1D5DB', lineHeight: 1.5 }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ color: '#f59e0b', marginRight: '8px' }}></i>
                <strong>High Competition:</strong> 14 creators are bidding. Focus on your unique style to win.
              </div>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
}
