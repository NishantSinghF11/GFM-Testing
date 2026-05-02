"use client";

import { useState } from 'react';
import Link from 'next/link';
import GigCard from '@/components/ui/GigCard';
import BeforeAfterSlider from '@/components/ui/BeforeAfterSlider';
import MessageButton from '@/components/ui/MessageButton';
import TalentIntelligenceHUD from '../components/TalentIntelligenceHUD';

import Breadcrumbs from '@/components/ui/Breadcrumbs';

interface ProfileClientProps {
  creator: any;
  creatorGigs: any[];
  creatorBlogs?: any[];
  isOwnProfile: boolean;
  breadcrumbItems: any[];
}

export default function ProfileClient({ creator, creatorGigs, creatorBlogs = [], isOwnProfile, breadcrumbItems }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState<'gigs' | 'portfolio' | 'insights'>('gigs');

  // format date
  const memberSince = creator.created_at ? new Date(creator.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently';

  return (
    <div id="profile-content">
      {/* ... previous code remains the same until main ... */}
      <div className="profile-hero">
        <div className="profile-cover" style={{ background: `linear-gradient(135deg, ${creator.cover_color || 'var(--color-primary)'}, var(--color-bg-darkest))` }}></div>
        
        <div className="container profile-container" style={{ paddingTop: '120px' }}>
          <div style={{ marginBottom: '20px' }}>
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          <div className="profile-header-card">
            <div className="profile-avatar" style={{ 
              background: creator.avatar_url ? `url(${creator.avatar_url}) center/cover` : (creator.cover_color || 'var(--color-primary)'), 
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', overflow: 'hidden'
            }}>
              {!creator.avatar_url && (creator.initials || '')}
            </div>
            
            <div className="profile-info">
              <h1 className="profile-name">
                {creator.name} 
                {creator.role === 'creator' && <i className="fa-solid fa-circle-check verified-badge" title="Verified Creator"></i>}
              </h1>
              <div className="profile-role" style={{textTransform: 'capitalize'}}>{creator.role || 'Member'}</div>
              
              <div className="profile-stats">
                <div className="profile-stat">
                  <span className="stat-val"><i className="fa-solid fa-star" style={{ color: 'var(--color-accent)', fontSize: '1rem', marginRight: '5px' }}></i>{creator.rating || 0}</span>
                  <span className="stat-label">{creator.reviews_count || 0} Reviews</span>
                </div>
                {!isOwnProfile && (
                  <div className="profile-stat" style={{ border: '1px solid rgba(139, 92, 246, 0.3)', padding: '4px 10px', borderRadius: '30px', background: 'rgba(139, 92, 246, 0.05)' }}>
                    <span className="stat-val" style={{ color: '#818cf8' }}>94%</span>
                    <span className="stat-label" style={{ color: '#818cf8' }}>Synergy Score</span>
                  </div>
                )}
              </div>
              
              <p className="profile-bio">{creator.bio || 'This user has not added a bio yet.'}</p>
              
              <div style={{ marginTop: '25px', display: 'flex', gap: '15px' }}>
                {isOwnProfile ? (
                  <Link href="/settings" className="btn btn-outline"><i className="fa-solid fa-pen-to-square"></i> Edit Profile</Link>
                ) : (
                  <>
                    <MessageButton receiverId={String(creator.id)} receiverName={creator.name} />
                    <button className="btn btn-secondary"><i className="fa-solid fa-plus"></i> Follow</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container profile-layout">
        <aside>
          <div className="sidebar-section">
            <h3 className="sidebar-title">About</h3>
            <div className="info-list">
              <div className="info-item">
                <span className="label"><i className="fa-solid fa-location-dot"></i> From</span>
                <span style={{ fontWeight: 500 }}>{creator.location || 'Anywhere'}</span>
              </div>
              <div className="info-item">
                <span className="label"><i className="fa-solid fa-user"></i> Member since</span>
                <span style={{ fontWeight: 500 }}>{memberSince}</span>
              </div>
              <div className="info-item">
                <span className="label"><i className="fa-solid fa-bolt"></i> Availability</span>
                <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>
                    {creator.availability === 'available' && <span style={{color: 'var(--color-success)'}}>🟢 Available</span>}
                    {creator.availability === 'busy' && <span style={{color: 'var(--color-warning)'}}>🟡 Busy</span>}
                    {creator.availability === 'unavailable' && <span style={{color: 'var(--color-danger)'}}>🔴 Unavailable</span>}
                    {!creator.availability && <span style={{color: 'var(--color-success)'}}>🟢 Available</span>}
                </span>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Intelligence</h3>
            <TalentIntelligenceHUD creator={creator} />
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Skills</h3>
            <div className="skills-wrapper">
              {creator.skills && creator.skills.length > 0 ? creator.skills.map((skill: string, idx: number) => (
                <span key={idx} className="skill-chip">{skill}</span>
              )) : <span style={{color: 'var(--color-text-muted)', fontSize: '0.9rem'}}>No skills listed.</span>}
            </div>
          </div>
        </aside>
        
        <main>
          <div className="content-tabs">
            <div className={`content-tab ${activeTab === 'gigs' ? 'active' : ''}`} onClick={() => setActiveTab('gigs')}>
              Active Gigs ({creatorGigs.length})
            </div>
            <div className={`content-tab ${activeTab === 'insights' ? 'active' : ''}`} onClick={() => setActiveTab('insights')}>
              Insights ({creatorBlogs.length})
            </div>
            <div className={`content-tab ${activeTab === 'portfolio' ? 'active' : ''}`} onClick={() => setActiveTab('portfolio')}>
              Portfolio (6)
            </div>
          </div>
          
          {activeTab === 'gigs' && (
            <div id="tab-gigs" className="tab-content">
                {creatorGigs.length > 0 ? (
                    <div className="gigs-grid">
                        {creatorGigs.map(gig => (
                        <GigCard key={gig.id} gig={gig} creator={creator} />
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center', background: 'var(--color-bg-surface)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--glass-border)' }}>
                        <i className="fa-solid fa-briefcase fa-3x" style={{ color: 'var(--color-text-muted)', marginBottom: '15px', opacity: 0.5 }}></i>
                        <h3>No gigs available</h3>
                        <p style={{ color: 'var(--color-text-muted)' }}>This creator hasn't posted any gigs yet.</p>
                        {isOwnProfile && <Link href="/post-gig" className="btn btn-primary" style={{marginTop: '20px'}}>Create Your First Gig</Link>}
                    </div>
                )}
            </div>
          )}

          {activeTab === 'insights' && (
            <div id="tab-insights" className="tab-content">
              {creatorBlogs.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
                  {creatorBlogs.map(blog => (
                    <Link key={blog.id} href={`/blog/${blog.slug}`} className="glass-card hover-glow" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <div style={{ aspectRatio: '16/10', position: 'relative' }}>
                        <img src={blog.cover_image} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: '10px', fontSize: '0.7rem', color: '#818cf8', fontWeight: 700 }}>
                          <i className="fa-solid fa-eye"></i> {blog.views?.toLocaleString() || 0}
                        </div>
                      </div>
                      <div style={{ padding: '20px' }}>
                        <span style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px', display: 'block' }}>{blog.category}</span>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '10px', lineHeight: 1.4 }}>{blog.title}</h4>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          {new Date(blog.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', background: 'var(--color-bg-surface)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--glass-border)' }}>
                  <i className="fa-solid fa-pen-nib fa-3x" style={{ color: 'var(--color-text-muted)', marginBottom: '15px', opacity: 0.5 }}></i>
                  <h3>No insights shared</h3>
                  <p style={{ color: 'var(--color-text-muted)' }}>This creator hasn't published any articles yet.</p>
                  {isOwnProfile && <Link href="/blog/community" className="btn btn-primary" style={{marginTop: '20px'}}>Write Your First Insight</Link>}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'portfolio' && (
            <div id="tab-portfolio" className="tab-content">
              {/* Before/After Slider */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ marginBottom: '15px' }}>Color Grading Example</h3>
                <BeforeAfterSlider 
                  afterImage="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80"
                  beforeImage="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80&sat=-100&bri=-20"
                  afterLabel="Color Graded"
                  beforeLabel="RAW LOG"
                />
              </div>
              
              <div className="portfolio-grid">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="portfolio-item" style={{ background: `url(https://images.unsplash.com/photo-1516280440502-61a7ebf4f134?auto=format&fit=crop&w=400&q=80) center/cover`, aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                    <div className="portfolio-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s' }}>
                      <i className="fa-solid fa-play fa-2x" style={{ color: 'white' }}></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
