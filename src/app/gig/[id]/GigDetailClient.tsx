"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import MessageButton from '@/components/ui/MessageButton';

interface GigDetailClientProps {
  initialGig: any;
  initialCreator: any;
}

export default function GigDetailClient({ initialGig, initialCreator }: GigDetailClientProps) {
  const [gig] = useState<any>(initialGig);
  const [creator] = useState<any>(initialCreator);
  
  const [activeTab, setActiveTab] = useState<'basic' | 'standard' | 'premium'>('basic');
  const [isRetainer, setIsRetainer] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const mediaItems = useMemo(() => {
    const items: { url: string, type: 'image' | 'video' }[] = [];
    
    // Add portfolio items if they exist
    if (gig?.portfolio_urls && Array.isArray(gig.portfolio_urls)) {
      gig.portfolio_urls.forEach((url: string) => {
        const isVideo = url.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) || url.includes('video');
        items.push({ url, type: isVideo ? 'video' : 'image' });
      });
    }
    
    // Fallback/Add cover and video_url if not in portfolio
    if (items.length === 0 && gig) {
      if (gig?.cover_image) items.push({ url: gig.cover_image, type: 'image' });
      if (gig?.video_url) items.push({ url: gig.video_url, type: 'video' });
    }
    
    return items;
  }, [gig]);

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <i key={i} className={`fa-solid fa-star ${i < Math.floor(rating) ? '' : 'fa-regular'}`} style={{ color: i < Math.floor(rating) ? 'var(--color-accent)' : 'var(--color-text-muted)' }}></i>
    ));
  };

  const getPrice = (pkgPrice: number) => {
    return isRetainer ? (pkgPrice * 0.9).toFixed(2) + '/mo' : pkgPrice;
  };

  const nextMedia = () => setActiveMediaIndex((prev) => (prev + 1) % mediaItems.length);
  const prevMedia = () => setActiveMediaIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);

  return (
    <div className="container detail-layout" id="gig-content">
      <main>
        <div className="gig-header">
          <div className="breadcrumb">
            <Link href="/explore">Explore</Link> <span>/</span>
            <Link href={`/explore?cat=${gig.category}`} style={{textTransform: 'capitalize'}}>{gig.category?.replace('-', ' ')}</Link>
          </div>
          
          <h1 className="gig-main-title">{gig.title}</h1>
          
          <div className="creator-brief">
            <Link href={`/profile/${creator?.id}`}>
              <div className="avatar" style={{ 
                background: creator?.avatar_url ? `url(${creator.avatar_url}) center/cover` : (creator?.cover_color || 'var(--color-primary)'),
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', overflow: 'hidden'
              }}>
                {!creator?.avatar_url && (creator?.initials || '??')}
              </div>
            </Link>
            <div>
              <Link href={`/profile/${creator?.id}`} className="name">{creator?.name}</Link>
              <span style={{ color: 'var(--color-text-muted)', margin: '0 5px' }}>|</span>
              <span style={{ color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{creator?.role === 'client' ? 'Creator' : (creator?.role || 'Creator')}</span>
            </div>
            <div className="rating">
              {renderStars(gig.rating || 0)}
              <span style={{ color: 'white', fontWeight: 'bold', marginLeft: '5px' }}>{gig.rating || 0}</span>
              <span style={{ color: 'var(--color-text-muted)' }}>({gig.reviews_count || 0} reviews)</span>
            </div>
          </div>
        </div>
        
        {/* Cinematic Media Slider */}
        <div className="gig-gallery-slider" style={{ 
          position: 'relative', 
          width: '100%', 
          aspectRatio: '16/9', 
          borderRadius: '24px', 
          overflow: 'hidden', 
          background: '#0A0D14',
          marginBottom: '20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          {mediaItems.length > 0 ? (
            <>
              {/* Media Content */}
              <div style={{ width: '100%', height: '100%', transition: 'all 0.5s ease' }}>
                {mediaItems[activeMediaIndex].type === 'video' ? (
                  <video 
                    src={mediaItems[activeMediaIndex].url} 
                    controls 
                    autoPlay 
                    muted 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <img 
                    src={mediaItems[activeMediaIndex].url} 
                    alt="Gig Portfolio" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </div>

              {/* Slider Controls */}
              {mediaItems.length > 1 && (
                <>
                  <button onClick={prevMedia} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}>
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <button onClick={nextMedia} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}>
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>

                  {/* Dot Navigation */}
                  <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
                    {mediaItems.map((_, i) => (
                      <div key={i} onClick={() => setActiveMediaIndex(i)} style={{ width: i === activeMediaIndex ? '24px' : '8px', height: '8px', background: i === activeMediaIndex ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.3s' }}></div>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${gig.thumb_color || 'var(--color-primary)'}, var(--color-bg-darkest))` }}>
              <i className="fa-solid fa-photo-film fa-4x" style={{ opacity: 0.2 }}></i>
            </div>
          )}
        </div>

        {/* AI Style Matchmaker Widget */}
        <div style={{ 
          background: 'linear-gradient(90deg, rgba(139,92,246,0.1), rgba(139,92,246,0.02))', 
          border: '1px solid rgba(139,92,246,0.2)', 
          borderRadius: '24px', 
          padding: '24px', 
          marginBottom: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px'
        }}>
           <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                 <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#818cf8', fontSize: '1.2rem' }}></i>
                 <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'white', letterSpacing: '1px' }}>AI STYLE MATCHMAKER</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#D1D5DB', margin: 0 }}>
                Upload your reference image or describe your vision to see how perfectly it aligns with this creator's signature style.
              </p>
           </div>
           <button className="btn btn-primary" style={{ padding: '12px 24px', whiteSpace: 'nowrap' }}>
              <i className="fa-solid fa-microchip" style={{ marginRight: '8px' }}></i> Sync with AI
           </button>
        </div>

        {/* Interactive Production Roadmap */}
        <h3 className="section-title">Production Journey</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '60px', position: 'relative', padding: '0 20px' }}>
           <div style={{ position: 'absolute', top: '15px', left: '40px', right: '40px', height: '2px', background: 'rgba(255,255,255,0.05)', zIndex: 0 }}>
              <div style={{ width: '40%', height: '100%', background: 'linear-gradient(90deg, #818cf8, #10b981)', borderRadius: '2px' }}></div>
           </div>
           {[
             { step: 1, icon: 'fa-file-invoice', title: 'Order & Brief', desc: 'Secure checkout and brief submission.' },
             { step: 2, icon: 'fa-brain', title: 'Conceptualization', desc: 'AI-assisted style mapping.' },
             { step: 3, icon: 'fa-clapperboard', title: 'First Draft', desc: 'Initial cinematic preview.' },
             { step: 4, icon: 'fa-wand-magic', title: 'Refinement', desc: 'Polishing based on your feedback.' },
             { step: 5, icon: 'fa-check-double', title: 'Final Delivery', desc: 'High-res source file handover.' }
           ].map((phase, i) => (
             <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '120px', zIndex: 1, position: 'relative' }}>
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  background: i === 0 ? '#818cf8' : (i === 1 ? '#10b981' : '#1E2532'), 
                  border: '4px solid #05070B',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', marginBottom: '15px'
                }}>
                  <i className={`fa-solid ${phase.icon}`}></i>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'white', marginBottom: '5px' }}>{phase.title}</div>
                <div style={{ fontSize: '0.6rem', color: '#6B7280', lineHeight: 1.4 }}>{phase.desc}</div>
             </div>
           ))}
        </div>
        
        <h3 className="section-title">About This Gig</h3>
        <div className="gig-description" style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#D1D5DB' }}>
          <p>{gig.description || 'No description provided.'}</p>
        </div>

        {/* Technical Specifications HUD */}
        <div style={{ margin: '40px 0', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '30px' }}>
          <h4 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-microchip" style={{ color: '#818cf8' }}></i> Technical Specifications
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 800, marginBottom: '5px' }}>RESOLUTION</div>
              <div style={{ color: 'white', fontWeight: 700 }}>Up to 4K (Ultra HD)</div>
            </div>
            <div style={{ padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 800, marginBottom: '5px' }}>FILE FORMATS</div>
              <div style={{ color: 'white', fontWeight: 700 }}>MP4, MOV, PRORES</div>
            </div>
            <div style={{ padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 800, marginBottom: '5px' }}>ASPECT RATIO</div>
              <div style={{ color: 'white', fontWeight: 700 }}>16:9, 9:16, 4:5</div>
            </div>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <h3 className="section-title">Compare Packages</h3>
        <div style={{ overflowX: 'auto', marginBottom: '40px' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
            <thead>
              <tr style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>
                <th style={{ textAlign: 'left', padding: '15px' }}>Feature</th>
                <th style={{ padding: '15px' }}>Basic</th>
                <th style={{ padding: '15px' }}>Standard</th>
                <th style={{ padding: '15px' }}>Premium</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Turnaround Time', basic: `${gig.delivery_basic} Days`, standard: `${gig.delivery_standard} Days`, premium: `${gig.delivery_premium} Days` },
                { name: 'Revisions', basic: '1', standard: '3', premium: 'Unlimited' },
                { name: 'Resolution', basic: '1080p', standard: '2K', premium: '4K' },
                { name: 'Source Files', basic: 'No', standard: 'No', premium: 'Yes' },
                { name: 'Sound Design', basic: 'No', standard: 'Yes', premium: 'Yes' }
              ].map((row, i) => (
                <tr key={i} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                  <td style={{ padding: '15px', color: 'white', fontWeight: 600, borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>{row.name}</td>
                  <td style={{ padding: '15px', textAlign: 'center', color: '#D1D5DB' }}>{row.basic}</td>
                  <td style={{ padding: '15px', textAlign: 'center', color: '#D1D5DB' }}>{row.standard}</td>
                  <td style={{ padding: '15px', textAlign: 'center', color: 'white', fontWeight: 700, borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>{row.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQ Section */}
        <h3 className="section-title">Frequently Asked Questions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '60px' }}>
          {[
            { q: "What references do I need to provide?", a: "To get the best result, please provide a brief description of your project, any specific style references (links or files), and your preferred color palette." },
            { q: "Do you offer custom package pricing?", a: "Yes! If none of the standard tiers fit your needs, click the 'Message' button to discuss a tailored solution for your specific requirements." },
            { q: "Is commercial use included?", a: "Commercial use is included in our Premium 'Elite' package. For Basic and Standard tiers, a commercial license can be added as an extra." }
          ].map((faq, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontWeight: 700, color: 'white', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fa-solid fa-circle-question" style={{ color: '#818cf8' }}></i> {faq.q}
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '0.95rem', lineHeight: '1.6' }}>{faq.a}</div>
            </div>
          ))}
        </div>

        <h3 className="section-title">Reviews (0)</h3>
        <div className="reviews-list">
           <p style={{ color: 'var(--color-text-muted)' }}>No reviews yet.</p>
        </div>
      </main>
      
      <aside className="pricing-sidebar">
        {/* Real-time Confidence Badge */}
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '16px', padding: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
           <div style={{ position: 'relative' }}>
             <i className="fa-solid fa-shield-halved" style={{ color: '#10b981', fontSize: '1.5rem' }}></i>
             <div style={{ position: 'absolute', inset: 0, background: '#10b981', filter: 'blur(10px)', opacity: 0.3, zIndex: -1 }}></div>
           </div>
           <div>
             <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#10b981', letterSpacing: '0.5px' }}>NEURAL VERIFIED</div>
             <div style={{ fontSize: '0.7rem', color: '#D1D5DB' }}>Identity & Quality Vetted by AI</div>
           </div>
        </div>

        <div className="pricing-card">
          <div style={{ padding: '15px 15px 0' }}>
            <div className="subscription-toggle">
              <div className={`sub-option ${!isRetainer ? 'active' : ''}`} onClick={() => setIsRetainer(false)}>One-off</div>
              <div className={`sub-option ${isRetainer ? 'active' : ''}`} onClick={() => setIsRetainer(true)}>Retainer <span style={{ fontSize: '0.7rem', color: 'var(--color-success)' }}>(-10%)</span></div>
            </div>
          </div>
          <div className="pricing-tabs">
            <div className={`pricing-tab ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')}>Basic</div>
            <div className={`pricing-tab ${activeTab === 'standard' ? 'active' : ''}`} onClick={() => setActiveTab('standard')}>Standard</div>
            <div className={`pricing-tab ${activeTab === 'premium' ? 'active' : ''}`} onClick={() => setActiveTab('premium')}>Premium</div>
          </div>
          
          <div className="pricing-content">
            {activeTab === 'basic' && (
              <div className="pkg-detail">
                <div className="package-price">${getPrice(gig.price_basic)}</div>
                <h4 style={{ marginBottom: '10px' }}>Starter Package</h4>
                <p className="package-desc">Essential services for small projects. Perfect for getting started.</p>
                <div className="package-meta">
                  <span><i className="fa-regular fa-clock"></i> {gig.delivery_basic} Days Delivery</span>
                  <span><i className="fa-solid fa-arrows-rotate"></i> 1 Revision</span>
                </div>
                <ul className="package-features">
                  <li><i className="fa-solid fa-check" style={{color: 'var(--color-success)'}}></i> High Quality Output</li>
                  <li><i className="fa-solid fa-check" style={{color: 'var(--color-success)'}}></i> Color Correction</li>
                  <li style={{ opacity: 0.3 }}><i className="fa-solid fa-xmark"></i> Source Files</li>
                  <li style={{ opacity: 0.3 }}><i className="fa-solid fa-xmark"></i> Commercial Use</li>
                </ul>
                <Link href={`/checkout?gig=${gig.id}&pkg=basic`} className="btn btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>Continue (${getPrice(gig.price_basic)})</Link>
              </div>
            )}

            {activeTab === 'standard' && (
              <div className="pkg-detail">
                <div className="package-price">${getPrice(gig.price_standard)}</div>
                <h4 style={{ marginBottom: '10px' }}>Pro Package</h4>
                <p className="package-desc">Professional quality with standard features for most client needs.</p>
                <div className="package-meta">
                  <span><i className="fa-regular fa-clock"></i> {gig.delivery_standard} Days Delivery</span>
                  <span><i className="fa-solid fa-arrows-rotate"></i> 3 Revisions</span>
                </div>
                <ul className="package-features">
                  <li><i className="fa-solid fa-check" style={{color: 'var(--color-success)'}}></i> High Quality Output</li>
                  <li><i className="fa-solid fa-check" style={{color: 'var(--color-success)'}}></i> Color Correction</li>
                  <li><i className="fa-solid fa-check" style={{color: 'var(--color-success)'}}></i> Sound Design</li>
                  <li style={{ opacity: 0.3 }}><i className="fa-solid fa-xmark"></i> Source Files</li>
                </ul>
                <Link href={`/checkout?gig=${gig.id}&pkg=standard`} className="btn btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>Continue (${getPrice(gig.price_standard)})</Link>
              </div>
            )}

            {activeTab === 'premium' && (
              <div className="pkg-detail">
                <div className="package-price">${getPrice(gig.price_premium)}</div>
                <h4 style={{ marginBottom: '10px' }}>Elite Package</h4>
                <p className="package-desc">The ultimate package. VIP support, source files, and commercial rights.</p>
                <div className="package-meta">
                  <span><i className="fa-regular fa-clock"></i> {gig.delivery_premium} Days Delivery</span>
                  <span><i className="fa-solid fa-arrows-rotate"></i> Unlimited Revisions</span>
                </div>
                <ul className="package-features">
                  <li><i className="fa-solid fa-check" style={{color: 'var(--color-success)'}}></i> Ultra HD 4K Output</li>
                  <li><i className="fa-solid fa-check" style={{color: 'var(--color-success)'}}></i> Advanced Color & Sound</li>
                  <li><i className="fa-solid fa-check" style={{color: 'var(--color-success)'}}></i> Source Files Included</li>
                  <li><i className="fa-solid fa-check" style={{color: 'var(--color-success)'}}></i> Commercial Use License</li>
                </ul>
                <Link href={`/checkout?gig=${gig.id}&pkg=premium`} className="btn btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>Continue (${getPrice(gig.price_premium)})</Link>
              </div>
            )}
          </div>
        </div>

        {/* GFM ESCROW PROTECTION HUD */}
        <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '20px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <i className="fa-solid fa-lock" style={{ color: '#818cf8' }}></i>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'white' }}>GFM Escrow Protected</span>
           </div>
           <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0, lineHeight: 1.5 }}>
             Your payment is held securely in our vault and only released when you approve the final production. 100% Satisfaction Guaranteed.
           </p>
        </div>

        <div className="creator-card">
          <Link href={`/profile/${creator?.id}`}>
            <div className="avatar" style={{ 
              background: creator?.avatar_url ? `url(${creator.avatar_url}) center/cover` : (creator?.cover_color || 'var(--color-primary)'), 
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', borderRadius: '50%', 
              margin: '0 auto 15px', width: '100px', height: '100px', fontSize: '2rem', overflow: 'hidden', border: '4px solid #1E2532' 
            }}>
              {!creator?.avatar_url && (creator?.initials || '??')}
            </div>
          </Link>
          <h3 style={{ marginBottom: '5px' }}>{creator?.name}</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '15px', textTransform: 'capitalize' }}>{creator?.role === 'client' ? 'Creator' : (creator?.role || 'Creator')}</p>
          <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>{(creator?.bio && creator.bio.length > 80) ? creator.bio.substring(0, 80) + '...' : (creator?.bio || '')}</p>
          <Link href={`/profile/${creator?.id}`} className="btn btn-outline" style={{ width: '100%', marginBottom: '10px', display: 'block', textAlign: 'center' }}>View Profile</Link>
          {creator && <MessageButton receiverId={String(creator?.id)} receiverName={creator?.name} className="btn btn-secondary" style={{ width: '100%' }} />}
        </div>
      </aside>
    </div>
  );
}
