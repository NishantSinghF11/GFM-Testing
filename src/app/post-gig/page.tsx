"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function PostGigPage() {
  const router = useRouter();
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAutoGenerate = () => {
    setDesc("Are you looking for a cinematic video editor to bring your footage to life? Look no further!\n\nWith over 5 years of experience in Premiere Pro and DaVinci Resolve, I specialize in crafting visually stunning narratives. My workflow includes advanced color grading, seamless transitions, and professional sound design.\n\nLet's create something amazing together!");
  };

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [priceBasic, setPriceBasic] = useState('49');
  const [priceStandard, setPriceStandard] = useState('149');
  const [pricePremium, setPricePremium] = useState('299');
  const [deliveryBasic, setDeliveryBasic] = useState('3');
  const [deliveryStandard, setDeliveryStandard] = useState('5');
  const [deliveryPremium, setDeliveryPremium] = useState('7');
  
  const [nameBasic, setNameBasic] = useState('Standard Edit');
  const [nameStandard, setNameStandard] = useState('Pro Edit');
  const [namePremium, setNamePremium] = useState('Full Production');
  
  const [revisionsBasic, setRevisionsBasic] = useState('1');
  const [revisionsStandard, setRevisionsStandard] = useState('3');
  const [revisionsPremium, setRevisionsPremium] = useState('unlimited');

  const [isOptimizing, setIsOptimizing] = useState(false);

  // --- AI OPTIMIZATION LOGIC ---
  const aiScore = useMemo(() => {
    let score = 20;
    if (title.length > 20) score += 20;
    if (desc.length > 200) score += 20;
    if (category) score += 10;
    if (tags.split(',').length >= 3) score += 15;
    if (priceBasic && priceStandard && pricePremium) score += 15;
    return Math.min(score, 100);
  }, [title, desc, category, tags, priceBasic, priceStandard, pricePremium]);

  const marketInsights = useMemo(() => {
    const insights = {
      priceRange: "$50 - $150",
      demand: "High",
      suggestions: ["Add more tags", "Increase description length"]
    };
    if (category === 'video-editing') {
      insights.priceRange = "$75 - $300";
      insights.demand = "Exceptional 🔥";
    }
    return insights;
  }, [category]);

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<{ url: string, type: string }[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setMediaFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video') ? 'video' : 'image'
      }));
      setMediaPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    let coverImageUrl = null;
    let videoUrl = null;
    const portfolioUrls: string[] = [];

    // 1. Upload All Media
    for (const file of mediaFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `gig-content/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars') // Using same bucket for consistency
        .upload(filePath, file);

      if (uploadError) {
        setError("Upload Error: " + uploadError.message);
        setLoading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      portfolioUrls.push(publicUrl);

      // Set first image as cover and first video as video_url
      if (file.type.startsWith('image') && !coverImageUrl) {
        coverImageUrl = publicUrl;
      }
      if (file.type.startsWith('video') && !videoUrl) {
        videoUrl = publicUrl;
      }
    }

    const { error: insertError } = await supabase.from('gigs').insert({
      creator_id: user.id,
      title,
      category,
      description: desc,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      price_basic: parseInt(priceBasic) || 49,
      price_standard: parseInt(priceStandard) || 149,
      price_premium: parseInt(pricePremium) || 299,
      delivery_basic: parseInt(deliveryBasic) || 3,
      delivery_standard: parseInt(deliveryStandard) || 5,
      delivery_premium: parseInt(deliveryPremium) || 7,
      name_basic: nameBasic,
      name_standard: nameStandard,
      name_premium: namePremium,
      revisions_basic: revisionsBasic,
      revisions_standard: revisionsStandard,
      revisions_premium: revisionsPremium,
      thumb_color: '#8B5CF6',
      cover_image: coverImageUrl,
      video_url: videoUrl,
      portfolio_urls: portfolioUrls,
      featured: false,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="container" style={{ padding: '120px 20px 60px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Post a New <span className="text-gradient">Gig</span></h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '40px' }}>Create a compelling gig to attract clients and showcase your creative skills.</p>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '14px 18px', marginBottom: '25px', color: 'var(--color-danger)' }}>
            <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '8px' }}></i>{error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Overview */}
          <div className="glass-card" style={{ padding: '40px', marginBottom: '30px', borderRadius: 'var(--border-radius-lg)' }}>
            <h3 style={{ marginBottom: '25px', color: 'var(--color-primary-light)' }}>1. Overview</h3>

            <div className="form-group">
              <label htmlFor="gig-title">Gig Title</label>
              <input type="text" id="gig-title" className="form-control" placeholder="I will edit your cinematic travel video..." required value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="form-group">
              <label htmlFor="gig-category">Category</label>
              <select id="gig-category" className="form-control" required value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="" disabled>Select a category</option>
                <option value="video-editing">Video Editing</option>
                <option value="cinematography">Cinematography</option>
                <option value="motion-graphics">Motion Graphics</option>
                <option value="vfx">VFX & Effects</option>
                <option value="color-grading">Color Grading</option>
                <option value="sound-design">Sound Design</option>
                <option value="photography">Photography</option>
                <option value="2d-3d-animation">2D/3D Animation</option>
              </select>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
                <label style={{ marginBottom: 0 }}>Description</label>
                <button type="button" className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.8rem', gap: '5px' }} onClick={handleAutoGenerate}>
                  <i className="fa-solid fa-wand-magic-sparkles"></i> Auto-Generate with AI
                </button>
              </div>
              <textarea
                name="description"
                className="form-control"
                rows={5}
                placeholder="Briefly describe what you offer, your process, and why clients should choose you..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="gig-tags">Search Tags</label>
              <input type="text" id="gig-tags" className="form-control" placeholder="e.g. premiere pro, cinematic, youtube edit, vlog" value={tags} onChange={(e) => setTags(e.target.value)} />
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>Separate tags with commas.</p>
            </div>
          </div>

          {/* Media Gallery */}
          <div className="glass-card" style={{ padding: '40px', marginBottom: '30px', borderRadius: 'var(--border-radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
              <div>
                <h3 style={{ color: 'var(--color-primary-light)', marginBottom: '5px' }}>2. Media Gallery</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Upload high-fidelity thumbnails and video showreels.</p>
              </div>
              <button 
                type="button" 
                className="btn btn-outline" 
                style={{ fontSize: '0.75rem', padding: '6px 15px' }}
                onClick={() => document.getElementById('gig-media')?.click()}
              >
                <i className="fa-solid fa-plus" style={{ marginRight: '8px' }}></i> Add More
              </button>
            </div>
            
            <input 
              type="file" 
              id="gig-media" 
              style={{ display: 'none' }} 
              accept="image/*,video/*" 
              multiple
              onChange={handleFileChange} 
            />
            
            {mediaPreviews.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {mediaPreviews.map((preview, idx) => (
                  <div key={idx} className="preview-item" style={{ position: 'relative', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: '#0A0D14' }}>
                    {preview.type === 'video' ? (
                      <video src={preview.url} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <img src={preview.url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                    
                    {/* Overlay Type Badge */}
                    <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.6rem', color: 'white', textTransform: 'uppercase', zIndex: 5 }}>
                      {preview.type}
                    </div>

                    {/* Remove Action */}
                    <button 
                      type="button" 
                      onClick={() => removeFile(idx)}
                      style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(239,68,68,0.8)', border: 'none', width: '24px', height: '24px', borderRadius: '50%', color: 'white', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <i className="fa-solid fa-xmark" style={{ fontSize: '0.8rem' }}></i>
                    </button>
                  </div>
                ))}
                
                {/* Minimal Add Trigger */}
                <div 
                  onClick={() => document.getElementById('gig-media')?.click()}
                  style={{ aspectRatio: '16/9', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-muted)', transition: '0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                >
                  <i className="fa-solid fa-plus" style={{ fontSize: '1.5rem', marginBottom: '10px' }}></i>
                  <span style={{ fontSize: '0.75rem' }}>Upload More</span>
                </div>
              </div>
            ) : (
              <div 
                className="upload-area" 
                onClick={() => document.getElementById('gig-media')?.click()}
                style={{ 
                  border: '2px dashed var(--glass-border)',
                  padding: '50px 20px',
                  textAlign: 'center',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: '0.3s'
                }}
              >
                <i className="fa-solid fa-photo-film" style={{ fontSize: '3.5rem', color: 'var(--color-primary)', marginBottom: '15px' }}></i>
                <h4 style={{ marginBottom: '10px' }}>Drag & drop your creative work</h4>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>Select multiple images and videos (MP4, PNG, JPG)</p>
                <button type="button" className="btn btn-secondary">Browse Showreels & Stills</button>
              </div>
            )}
          </div>

          {/* Pricing Packages */}
          <div className="glass-card" style={{ padding: '40px', marginBottom: '40px', borderRadius: 'var(--border-radius-lg)' }}>
            <h3 style={{ marginBottom: '25px', color: 'var(--color-primary-light)' }}>3. Pricing Packages</h3>

            <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {/* Basic */}
              <div className="pricing-tier" style={{ background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '16px', border: '1px solid #1E2532' }}>
                <h4 style={{ marginBottom: '20px', textAlign: 'center', opacity: 0.7 }}>Basic</h4>
                
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Package Name</label>
                  <input type="text" value={nameBasic} onChange={e => setNameBasic(e.target.value)} className="form-control" placeholder="e.g. Starter Edit" />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Price ($)</label>
                  <input type="number" value={priceBasic} onChange={e => setPriceBasic(e.target.value)} className="form-control" />
                </div>
                
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Delivery (Days)</label>
                  <input type="number" value={deliveryBasic} onChange={e => setDeliveryBasic(e.target.value)} className="form-control" />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Revisions</label>
                  <select value={revisionsBasic} onChange={e => setRevisionsBasic(e.target.value)} className="form-control">
                    <option value="1">1 Revision</option>
                    <option value="2">2 Revisions</option>
                    <option value="3">3 Revisions</option>
                    <option value="unlimited">Unlimited</option>
                  </select>
                </div>
              </div>

              {/* Standard - Recommended */}
              <div className="pricing-tier" style={{ background: 'rgba(139, 92, 246, 0.03)', padding: '25px', borderRadius: '16px', border: '2px solid #8B5CF6', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#8B5CF6', color: 'white', fontSize: '0.65rem', padding: '4px 12px', borderRadius: '20px', fontWeight: 800, letterSpacing: '1px', boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)' }}>RECOMMENDED</div>
                <h4 style={{ marginBottom: '20px', textAlign: 'center', color: 'white' }}>Standard</h4>
                
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Package Name</label>
                  <input type="text" value={nameStandard} onChange={e => setNameStandard(e.target.value)} className="form-control" style={{ borderColor: 'rgba(139, 92, 246, 0.3)' }} />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Price ($)</label>
                  <input type="number" value={priceStandard} onChange={e => setPriceStandard(e.target.value)} className="form-control" style={{ borderColor: 'rgba(139, 92, 246, 0.3)' }} />
                </div>
                
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Delivery (Days)</label>
                  <input type="number" value={deliveryStandard} onChange={e => setDeliveryStandard(e.target.value)} className="form-control" style={{ borderColor: 'rgba(139, 92, 246, 0.3)' }} />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Revisions</label>
                  <select value={revisionsStandard} onChange={e => setRevisionsStandard(e.target.value)} className="form-control" style={{ borderColor: 'rgba(139, 92, 246, 0.3)' }}>
                    <option value="1">1 Revision</option>
                    <option value="2">2 Revisions</option>
                    <option value="3">3 Revisions</option>
                    <option value="5">5 Revisions</option>
                    <option value="unlimited">Unlimited</option>
                  </select>
                </div>
              </div>

              {/* Premium */}
              <div className="pricing-tier" style={{ background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '16px', border: '1px solid #1E2532' }}>
                <h4 style={{ marginBottom: '20px', textAlign: 'center', opacity: 0.7 }}>Premium</h4>
                
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Package Name</label>
                  <input type="text" value={namePremium} onChange={e => setNamePremium(e.target.value)} className="form-control" />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Price ($)</label>
                  <input type="number" value={pricePremium} onChange={e => setPricePremium(e.target.value)} className="form-control" />
                </div>
                
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Delivery (Days)</label>
                  <input type="number" value={deliveryPremium} onChange={e => setDeliveryPremium(e.target.value)} className="form-control" />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Revisions</label>
                  <select value={revisionsPremium} onChange={e => setRevisionsPremium(e.target.value)} className="form-control">
                    <option value="3">3 Revisions</option>
                    <option value="5">5 Revisions</option>
                    <option value="10">10 Revisions</option>
                    <option value="unlimited">Unlimited</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
            <Link href="/dashboard" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.1rem' }} disabled={loading}>
              {loading ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Publishing...</> : 'Publish Gig'}
            </button>
          </div>
        </form>
      </div>

      {/* AI OPTIMIZER SIDEBAR */}
      <aside style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
        <div className="glass-card" style={{ padding: '25px', border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(10,13,20,0.8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#818cf8', boxShadow: '0 0 10px #818cf8' }}></div>
            <h3 style={{ fontSize: '1rem', color: 'white', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>AI Gig Optimizer</h3>
          </div>

          {/* Quality Gauge */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle cx="60" cy="60" r="54" fill="none" stroke="#818cf8" strokeWidth="8" strokeDasharray="339.29" strokeDashoffset={339.29 * (1 - aiScore / 100)} style={{ transition: 'stroke-dashoffset 0.5s ease-out' }} />
              </svg>
              <div style={{ position: 'absolute' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{aiScore}%</div>
                <div style={{ fontSize: '0.6rem', color: '#9CA3AF', textTransform: 'uppercase' }}>Quality</div>
              </div>
            </div>
          </div>

          {/* Market Insights */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '12px' }}>Market Benchmark</div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Price Range</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>{marketInsights.priceRange}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Category Demand</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b' }}>{marketInsights.demand}</span>
              </div>
            </div>
          </div>

          {/* AI SEO Suggestions */}
          <div>
            <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '12px' }}>SEO Suggestions</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['4K', 'Cinematic', 'Viral', 'YouTube', 'Fast Delivery'].map(tag => (
                <div key={tag} onClick={() => setTags(prev => prev ? `${prev}, ${tag}` : tag)} style={{ fontSize: '0.7rem', padding: '4px 10px', background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)', borderRadius: '20px', color: '#818cf8', cursor: 'pointer', transition: 'all 0.2s' }}>
                  + {tag}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '25px', padding: '15px', background: 'rgba(16,185,129,0.05)', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.1)', fontSize: '0.75rem', color: '#D1D5DB', lineHeight: 1.5 }}>
            <i className="fa-solid fa-circle-info" style={{ color: '#10b981', marginRight: '8px' }}></i>
            Gigs with a <strong>90%+ score</strong> convert 3x faster than average.
          </div>
        </div>
      </aside>
      </div>
    </div>
  );
}
