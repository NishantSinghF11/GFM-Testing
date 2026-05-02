"use client";

import { useState, useEffect, useMemo, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function EditGigPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const gigId = resolvedParams.id;
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('video-editing');
  const [desc, setDesc] = useState('');
  const [tags, setTags] = useState('');
  
  // Pricing State
  const [priceBasic, setPriceBasic] = useState('49');
  const [priceStandard, setPriceStandard] = useState('149');
  const [pricePremium, setPricePremium] = useState('299');
  const [nameBasic, setNameBasic] = useState('Basic');
  const [nameStandard, setNameStandard] = useState('Standard');
  const [namePremium, setNamePremium] = useState('Premium');
  const [deliveryBasic, setDeliveryBasic] = useState('3');
  const [deliveryStandard, setDeliveryStandard] = useState('5');
  const [deliveryPremium, setDeliveryPremium] = useState('7');
  const [revisionsBasic, setRevisionsBasic] = useState('1');
  const [revisionsStandard, setRevisionsStandard] = useState('3');
  const [revisionsPremium, setRevisionsPremium] = useState('unlimited');

  // Media State
  const [existingMedia, setExistingMedia] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<{ url: string, type: string }[]>([]);

  useEffect(() => {
    const fetchGig = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: gig, error } = await supabase
        .from('gigs')
        .select('*')
        .eq('id', gigId)
        .single();

      if (error || !gig) {
        setError('Gig not found');
        setLoading(false);
        return;
      }

      // Security Check: Only the owner can edit
      if (gig.creator_id !== user.id) {
        router.push('/dashboard');
        return;
      }

      // Populate Form
      setTitle(gig.title);
      setCategory(gig.category);
      setDesc(gig.description);
      setTags(gig.tags?.join(', ') || '');
      setPriceBasic(String(gig.price_basic));
      setPriceStandard(String(gig.price_standard));
      setPricePremium(String(gig.price_premium));
      setNameBasic(gig.name_basic || 'Basic');
      setNameStandard(gig.name_standard || 'Standard');
      setNamePremium(gig.name_premium || 'Premium');
      setDeliveryBasic(String(gig.delivery_basic));
      setDeliveryStandard(String(gig.delivery_standard));
      setDeliveryPremium(String(gig.delivery_premium));
      setRevisionsBasic(gig.revisions_basic || '1');
      setRevisionsStandard(gig.revisions_standard || '3');
      setRevisionsPremium(gig.revisions_premium || 'unlimited');
      setExistingMedia(gig.portfolio_urls || []);
      
      setLoading(false);
    };

    fetchGig();
  }, [gigId, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setNewFiles(prev => [...prev, ...files]);
      const previews = files.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video') ? 'video' : 'image'
      }));
      setNewPreviews(prev => [...prev, ...previews]);
    }
  };

  const removeExisting = (url: string) => {
    setExistingMedia(prev => prev.filter(item => item !== url));
  };

  const removeNew = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let finalPortfolio = [...existingMedia];
    let coverImageUrl = existingMedia.find(url => !url.includes('video')) || null;
    let videoUrl = existingMedia.find(url => url.includes('video')) || null;

    // Upload New Files
    for (const file of newFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `gig-content/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        setError("Upload Error: " + uploadError.message);
        setSaving(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      finalPortfolio.push(publicUrl);
      if (file.type.startsWith('image') && !coverImageUrl) coverImageUrl = publicUrl;
      if (file.type.startsWith('video') && !videoUrl) videoUrl = publicUrl;
    }

    const { error: updateError } = await supabase
      .from('gigs')
      .update({
        title,
        category,
        description: desc,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        price_basic: parseInt(priceBasic),
        price_standard: parseInt(priceStandard),
        price_premium: parseInt(pricePremium),
        name_basic: nameBasic,
        name_standard: nameStandard,
        name_premium: namePremium,
        delivery_basic: parseInt(deliveryBasic),
        delivery_standard: parseInt(deliveryStandard),
        delivery_premium: parseInt(deliveryPremium),
        revisions_basic: revisionsBasic,
        revisions_standard: revisionsStandard,
        revisions_premium: revisionsPremium,
        cover_image: coverImageUrl,
        video_url: videoUrl,
        portfolio_urls: finalPortfolio
      })
      .eq('id', parseInt(gigId));

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
    } else {
      router.push('/dashboard');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#05070B' }}>
        <i className="fa-solid fa-circle-notch fa-spin fa-3x" style={{ color: 'var(--color-primary)' }}></i>
      </div>
    );
  }

  return (
    <div style={{ background: '#05070B', minHeight: '100vh', color: 'white', padding: '100px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Edit Production</h1>
            <p style={{ color: '#9CA3AF' }}>Refine your creative service and maximize market velocity.</p>
          </div>
          <Link href="/dashboard" className="btn btn-outline">Cancel Changes</Link>
        </div>

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '15px', borderRadius: '12px', marginBottom: '30px', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}

        <form onSubmit={handleUpdate}>
          {/* General Info */}
          <div className="glass-card" style={{ padding: '40px', marginBottom: '30px', borderRadius: '24px' }}>
            <h3 style={{ color: 'var(--color-primary-light)', marginBottom: '25px' }}>1. Essential Intel</h3>
            <div style={{ display: 'grid', gap: '25px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: '#9CA3AF' }}>Production Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} type="text" className="form-input" style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', borderRadius: '12px', color: 'white' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: '#9CA3AF' }}>Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="form-input" style={{ width: '100%', background: '#0A0D14', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', borderRadius: '12px', color: 'white' }}>
                    <option value="video-editing">Video Production</option>
                    <option value="vfx">Visual Effects (VFX)</option>
                    <option value="color-grading">Color Grading</option>
                    <option value="sound-design">Sound Architecture</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: '#9CA3AF' }}>Tags (comma separated)</label>
                  <input value={tags} onChange={e => setTags(e.target.value)} type="text" placeholder="Cinematic, Commercial, 4K" className="form-input" style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', borderRadius: '12px', color: 'white' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: '#9CA3AF' }}>Production Description</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={6} className="form-input" style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', borderRadius: '12px', color: 'white' }}></textarea>
              </div>
            </div>
          </div>

          {/* Media Management */}
          <div className="glass-card" style={{ padding: '40px', marginBottom: '30px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
              <h3 style={{ color: 'var(--color-primary-light)' }}>2. Portfolio Vault</h3>
              <button type="button" onClick={() => document.getElementById('media-upload')?.click()} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>+ Add Media</button>
            </div>
            
            <input id="media-upload" type="file" multiple accept="image/*,video/*" style={{ display: 'none' }} onChange={handleFileChange} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
              {/* Existing Items */}
              {existingMedia.map((url, idx) => (
                <div key={idx} style={{ position: 'relative', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {url.toLowerCase().match(/\.(mp4|webm|mov)$/) || url.includes('video') ? (
                    <video src={url} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <img src={url} alt="Portfolio" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                  <button type="button" onClick={() => removeExisting(url)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(239,68,68,0.8)', border: 'none', color: 'white', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}><i className="fa-solid fa-trash-can" style={{ fontSize: '0.7rem' }}></i></button>
                </div>
              ))}
              {/* New Items */}
              {newPreviews.map((p, idx) => (
                <div key={idx} style={{ position: 'relative', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-primary)', background: 'rgba(99,102,241,0.1)' }}>
                  {p.type === 'video' ? <video src={p.url} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <img src={p.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'var(--color-primary)', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px' }}>NEW</div>
                  <button type="button" onClick={() => removeNew(idx)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(239,68,68,0.8)', border: 'none', color: 'white', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
            {/* Basic */}
            <div className="glass-card" style={{ padding: '30px', borderRadius: '24px', borderTop: '4px solid #818cf8' }}>
              <input value={nameBasic} onChange={e => setNameBasic(e.target.value)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px', width: '100%' }} />
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
                <span style={{ fontSize: '1.5rem', color: '#10b981' }}>$</span>
                <input value={priceBasic} onChange={e => setPriceBasic(e.target.value)} type="number" style={{ background: 'none', border: 'none', color: '#10b981', fontSize: '2.5rem', fontWeight: 900, width: '100px' }} />
              </div>
              <div style={{ display: 'grid', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-regular fa-clock" style={{ color: '#6B7280' }}></i>
                  <input value={deliveryBasic} onChange={e => setDeliveryBasic(e.target.value)} type="number" style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '4px 8px', width: '50px', borderRadius: '4px' }} />
                  <span style={{ fontSize: '0.8rem' }}>Days Delivery</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-arrows-rotate" style={{ color: '#6B7280' }}></i>
                  <input value={revisionsBasic} onChange={e => setRevisionsBasic(e.target.value)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '4px 8px', width: '80px', borderRadius: '4px' }} />
                  <span style={{ fontSize: '0.8rem' }}>Revisions</span>
                </div>
              </div>
            </div>

            {/* Standard */}
            <div className="glass-card" style={{ padding: '30px', borderRadius: '24px', borderTop: '4px solid var(--color-primary)', background: 'rgba(99,102,241,0.05)' }}>
              <input value={nameStandard} onChange={e => setNameStandard(e.target.value)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px', width: '100%' }} />
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
                <span style={{ fontSize: '1.5rem', color: '#10b981' }}>$</span>
                <input value={priceStandard} onChange={e => setPriceStandard(e.target.value)} type="number" style={{ background: 'none', border: 'none', color: '#10b981', fontSize: '2.5rem', fontWeight: 900, width: '100px' }} />
              </div>
              <div style={{ display: 'grid', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-regular fa-clock" style={{ color: '#6B7280' }}></i>
                  <input value={deliveryStandard} onChange={e => setDeliveryStandard(e.target.value)} type="number" style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '4px 8px', width: '50px', borderRadius: '4px' }} />
                  <span style={{ fontSize: '0.8rem' }}>Days Delivery</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-arrows-rotate" style={{ color: '#6B7280' }}></i>
                  <input value={revisionsStandard} onChange={e => setRevisionsStandard(e.target.value)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '4px 8px', width: '80px', borderRadius: '4px' }} />
                  <span style={{ fontSize: '0.8rem' }}>Revisions</span>
                </div>
              </div>
            </div>

            {/* Premium */}
            <div className="glass-card" style={{ padding: '30px', borderRadius: '24px', borderTop: '4px solid #c084fc' }}>
              <input value={namePremium} onChange={e => setNamePremium(e.target.value)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px', width: '100%' }} />
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
                <span style={{ fontSize: '1.5rem', color: '#10b981' }}>$</span>
                <input value={pricePremium} onChange={e => setPricePremium(e.target.value)} type="number" style={{ background: 'none', border: 'none', color: '#10b981', fontSize: '2.5rem', fontWeight: 900, width: '100px' }} />
              </div>
              <div style={{ display: 'grid', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-regular fa-clock" style={{ color: '#6B7280' }}></i>
                  <input value={deliveryPremium} onChange={e => setDeliveryPremium(e.target.value)} type="number" style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '4px 8px', width: '50px', borderRadius: '4px' }} />
                  <span style={{ fontSize: '0.8rem' }}>Days Delivery</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-arrows-rotate" style={{ color: '#6B7280' }}></i>
                  <input value={revisionsPremium} onChange={e => setRevisionsPremium(e.target.value)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '4px 8px', width: '80px', borderRadius: '4px' }} />
                  <span style={{ fontSize: '0.8rem' }}>Revisions</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ flex: 3, padding: '20px', fontSize: '1.1rem', borderRadius: '16px' }}>
              {saving ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Synchronizing...</> : 'Save Production Changes'}
            </button>
            <button 
              type="button" 
              onClick={async () => {
                if (confirm("CRITICAL ACTION: This will permanently decommission this production and PURGE all associated media from the GFM Vault. Proceed?")) {
                  setSaving(true);
                  const supabase = createClient();

                  // 1. Storage Cleanup (Resilient)
                  try {
                    if (existingMedia.length > 0) {
                      const pathsToRemove = existingMedia.map(url => {
                        const parts = url.split('/avatars/');
                        return parts.length > 1 ? parts[1] : null;
                      }).filter(Boolean) as string[];

                      if (pathsToRemove.length > 0) {
                        await supabase.storage.from('avatars').remove(pathsToRemove);
                      }
                    }
                  } catch (storageErr) {
                    console.error("Storage Purge Non-Critical Error:", storageErr);
                  }

                  // 2. Database Purge
                  const numericId = parseInt(gigId);
                  console.log("Attempting to purge Gig ID:", numericId);
                  
                  const { error, count } = await supabase
                    .from('gigs')
                    .delete({ count: 'exact' })
                    .eq('id', numericId);
                  
                  if (error) { 
                    alert("DATABASE REJECTION: " + error.message);
                    setError("Purge Error: " + error.message); 
                    setSaving(false); 
                  } else if (count === 0) {
                    alert("SYNC ERROR: No record found with ID " + numericId + ". Refreshing dashboard...");
                    window.location.href = '/dashboard';
                  } else {
                    console.log("Purge Successful. Rows affected:", count);
                    window.location.href = '/dashboard';
                  }
                }
              }}
              style={{ flex: 1, padding: '20px', fontSize: '1rem', borderRadius: '16px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', transition: '0.3s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
            >
              <i className="fa-solid fa-trash-can" style={{ marginRight: '10px' }}></i> Delete Production
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
