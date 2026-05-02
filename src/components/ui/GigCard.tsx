"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function GigCard({ gig, creator, featuredReason }: { gig: any, creator: any, featuredReason?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const thumb = gig.thumb ?? gig.thumb_color ?? 'var(--color-primary)';
  const coverImage = gig.cover_image;
  const videoUrl = gig.video_url; // Assuming this exists or can be inferred
  const basicPrice = gig.price?.basic ?? gig.price_basic ?? gig.price ?? 0;
  const rating = gig.rating ?? 0;
  const reviews = gig.reviews ?? gig.reviews_count ?? 0;
  const creatorName = creator?.name ?? 'Creator';
  const creatorInitials = creator?.initials ?? '??';
  const creatorColor = creator?.color ?? creator?.cover_color ?? 'var(--color-primary)';

  const isPro = rating >= 4.8 || reviews > 10;

  useEffect(() => {
    if (isHovered && videoUrl && videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovered, videoUrl]);

  return (
    <div style={{
      background: 'rgba(17, 24, 39, 0.7)',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${featuredReason ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255, 255, 255, 0.05)'}`,
      borderRadius: '24px',
      overflow: 'hidden',
      transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      cursor: 'pointer',
      boxShadow: featuredReason ? '0 15px 40px rgba(139, 92, 246, 0.1)' : '0 10px 30px rgba(0,0,0,0.2)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transformStyle: 'preserve-3d'
    }}
    className="gig-card-high-fidelity"
    onMouseEnter={(e) => {
      setIsHovered(true);
      e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
      e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
      e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.4), 0 0 20px rgba(139, 92, 246, 0.1)';
    }}
    onMouseLeave={(e) => {
      setIsHovered(false);
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.borderColor = featuredReason ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255, 255, 255, 0.05)';
      e.currentTarget.style.boxShadow = featuredReason ? '0 15px 40px rgba(139, 92, 246, 0.1)' : '0 10px 30px rgba(0,0,0,0.2)';
    }}
    >
      <Link href={`/gig/${gig.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        {/* Thumbnail Area - 16:9 */}
        <div style={{ 
          width: '100%',
          aspectRatio: '16/9',
          background: coverImage ? `url(${coverImage}) center/cover no-repeat` : `linear-gradient(135deg, ${thumb}, #0A0D14)`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Video Preview */}
          {videoUrl && (
            <video 
              ref={videoRef}
              src={videoUrl}
              muted
              playsInline
              loop
              style={{ 
                position: 'absolute', 
                inset: 0, 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.3s ease',
                zIndex: 2
              }}
            />
          )}

          {/* Category Chip */}
          <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', padding: '6px 12px', borderRadius: '30px', fontSize: '0.65rem', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '1px', border: '1px solid rgba(255,255,255,0.1)', zIndex: 5 }}>
            {gig.category?.replace('-', ' ') || 'Service'}
          </div>

          {/* Pro Badge */}
          {isPro && (
            <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', padding: '6px 12px', borderRadius: '30px', fontSize: '0.65rem', fontWeight: 900, color: 'white', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 15px rgba(217,119,6,0.3)', zIndex: 5 }}>
              <i className="fa-solid fa-crown"></i> PRO CREATOR
            </div>
          )}
          
          {/* AI Match Reason */}
          {featuredReason && (
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', background: 'rgba(139, 92, 246, 0.85)', backdropFilter: 'blur(12px)', padding: '10px 16px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', zIndex: 5, border: '1px solid rgba(255,255,255,0.2)' }}>
              <i className="fa-solid fa-wand-magic-sparkles" style={{ animation: 'pulse 2s infinite' }}></i> {featuredReason}
            </div>
          )}

          {/* Hover Overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(10,13,20,0.8) 0%, transparent 50%)', opacity: 1, zIndex: 1 }}></div>
        </div>

        {/* Card Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, position: 'relative' }}>
          
          {/* Creator & Trust Details */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', 
                background: creator?.avatar_url ? `url(${creator.avatar_url}) center/cover` : creatorColor, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: 'white', border: '2px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' 
              }}>
                {!creator?.avatar_url && creatorInitials}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'white' }}>{creatorName} <i className="fa-solid fa-circle-check" style={{ color: '#10b981', fontSize: '0.7rem', marginLeft: '4px' }}></i></span>
                <span style={{ fontSize: '0.65rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Level 2 Seller</span>
              </div>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <i className="fa-solid fa-star"></i> {rating > 0 ? rating : 'New'}
            </div>
          </div>

          {/* Gig Title */}
          <h3 style={{ fontSize: '1.1rem', margin: '0 0 16px 0', color: 'white', lineHeight: 1.4, flex: 1, fontWeight: 700, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', transition: 'color 0.3s' }}>
            {gig.title}
          </h3>

          {/* Footer (Price & Action) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', marginTop: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#9CA3AF', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Starting at</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'white' }}>${basicPrice}</span>
            </div>
            <div className="btn-glow-container">
              <button className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.8rem', borderRadius: '30px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 20px rgba(139, 92, 246, 0.2)' }}>
                View Project <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.7rem' }}></i>
              </button>
            </div>
          </div>

        </div>
      </Link>
    </div>
  );
}
