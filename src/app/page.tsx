import { Metadata } from 'next';
import Link from 'next/link';
import MarketPulseCore from '@/components/ui/MarketPulseCore';
import CreativeGalaxy from '@/components/ui/CreativeGalaxy';
import { createClient } from '@/lib/supabase/server';
import { GFM } from '@/lib/data';
import GigCard from '@/components/ui/GigCard';
import JsonLd from '@/components/seo/JsonLd';

import { constructMetadata } from '@/lib/seo/meta';
import { SCHEMA } from '@/lib/seo/schema';
import { getCanonicalUrl } from '@/lib/seo/canonical';

export const metadata = constructMetadata({
  title: "The AI-Powered Creative Marketplace",
  description: "Connect with elite creative talent through our AI Deal Engine. Secure, automated, and high-stakes creative procurement.",
  canonical: getCanonicalUrl('/'),
});

export default async function Home() {
  const supabase = await createClient();

  const websiteSchema = SCHEMA.website();
  const orgSchema = SCHEMA.organization();

  // Fetch categories from Supabase
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('count', { ascending: false });

  // Fetch featured gigs with creator info
  const { data: gigs } = await supabase
    .from('gigs')
    .select(`
      *,
      creator:profiles(id, name, initials, cover_color)
    `)
    .eq('featured', true)
    .limit(6);

  // Fetch platform stats
  const { count: totalGigs } = await supabase.from('gigs').select('*', { count: 'exact', head: true });
  const { count: totalCreators } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'creator');

  // Use live data if available, otherwise fall back to mock data
  const displayCategories = (categories && categories.length > 0) ? categories : GFM.categories;
  const featuredGigs = (gigs && gigs.length > 0) ? gigs : GFM.gigs.filter(g => g.featured).slice(0, 6);
  const isLiveData = gigs && gigs.length > 0;

  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={orgSchema} />
      <CreativeGalaxy />
      {/* Hero Section */}
      <section className="hero-section" style={{ minHeight: '120vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'transparent' }}>
        
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="hero-content animate-fade-in">
            
            <span className="badge badge-primary" style={{ marginBottom: '20px' }}>For Creative Professionals</span>
            <h1>Where <span className="text-gradient">Creativity</span> Meets Opportunity</h1>
            <p>The premium freelance marketplace powered by a high-stakes <strong>AI Deal Engine</strong>. Secure your projects, automate negotiations, and track business growth in one cinematic workspace.</p>
            
            <div className="search-box glass-liquid premium-border" style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
              <input type="text" placeholder="What creative service are you looking for? (e.g. Video Editing)" />
              <Link href="/explore" className="btn btn-primary animate-shimmer"><i className="fa-solid fa-search"></i> Search</Link>
            </div>
            
            <div className="trusted-by">
              <span>Trusted by creators on:</span>
              <i className="fa-brands fa-youtube fa-lg"></i>
              <i className="fa-brands fa-tiktok fa-lg"></i>
              <i className="fa-brands fa-instagram fa-lg"></i>
              <i className="fa-brands fa-twitch fa-lg"></i>
            </div>
          </div>
        </div>
      </section>

      {/* AI Deal Engine Showcase Section */}
      <section className="section-padding" style={{ background: 'transparent', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)', borderRadius: '50%' }}></div>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '15px' }}>Next-Gen Infrastructure</span>
            <h2 style={{ fontSize: '2.5rem' }}>The <span className="text-gradient">GFM Protocol</span></h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '700px', margin: '20px auto 25px' }}>We don't just connect you; we protect you. Our proprietary AI layer manages the entire lifecycle of your project.</p>
            <Link href="/protocol" className="btn btn-outline" style={{ border: '1px solid #818cf8', color: '#818cf8' }}>How it Works <i className="fa-solid fa-arrow-right"></i></Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            <div className="glass-card hover-glow premium-border" style={{ padding: '40px', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(99,102,241,0.1)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', fontSize: '1.8rem', marginBottom: '25px', boxShadow: '0 0 20px rgba(129,140,248,0.2)' }}>
                <i className="fa-solid fa-brain"></i>
              </div>
              <h3 style={{ marginBottom: '15px' }}>AI Deal Engine</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>Real-time negotiation assistance, deal confidence scoring, and automated milestone creation to ensure fair pricing for everyone.</p>
            </div>

            <div className="glass-card hover-glow premium-border" style={{ padding: '40px', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(16,185,129,0.1)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontSize: '1.8rem', marginBottom: '25px', boxShadow: '0 0 20px rgba(16,185,129,0.2)' }}>
                <i className="fa-solid fa-vault"></i>
              </div>
              <h3 style={{ marginBottom: '15px' }}>GFM Vault</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>Secure asset management with neutral escrow. Funds are only released when milestones are met and deliverables are approved.</p>
            </div>

            <div className="glass-card hover-glow premium-border floating-3d" style={{ padding: '40px', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(168,85,247,0.1)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc', fontSize: '1.8rem', marginBottom: '25px', boxShadow: '0 0 20px rgba(168,85,247,0.2)' }}>
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h3 style={{ marginBottom: '15px' }}>Neutral Mediation</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>Our AI Resolution Center acts as a neutral third party to settle disputes quickly and fairly, keeping projects moving forward.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding">
        <div className="container">
          <h2>Browse by <span className="text-gradient-alt">Category</span></h2>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '10px' }}>Find exactly the creative talent you need.</p>
          
          <div className="category-grid">
            {displayCategories.map((cat: any) => {
              const colorMap: Record<string, string> = {
                'video-editing': '#818cf8',
                'photography': '#f472b6',
                'motion-graphics': '#fbbf24',
                'cinematography': '#2dd4bf',
                'color-grading': '#f87171',
                'sound-design': '#60a5fa',
                '2d-3d-animation': '#c084fc',
                'vfx': '#fb7185'
              };
              const accentColor = colorMap[cat.id] || 'var(--color-primary-light)';
              
              return (
                <Link href={`/explore?cat=${cat.id}`} key={cat.id}>
                  <div className="glass-card category-card">
                    <div className="cat-icon" style={{ color: accentColor }}>{cat.icon}</div>
                    <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '8px' }}>{cat.name}</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
                      <span style={{ color: accentColor, fontWeight: 700 }}>{cat.count}</span> creative units
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Gigs */}
      <section className="section-padding" style={{ background: 'transparent' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
            <div>
              <h2>Featured <span className="text-gradient">Gigs</span></h2>
              <p style={{ color: 'var(--color-text-muted)', marginTop: '10px' }}>
                Top-rated services from our pro creators.
                {isLiveData && <span style={{ color: 'var(--color-success)', marginLeft: '10px', fontSize: '0.85rem' }}>● Live</span>}
              </p>
            </div>
            <Link href="/explore" className="btn btn-outline">View All <i className="fa-solid fa-arrow-right"></i></Link>
          </div>
          
          <div className="gigs-grid">
            {isLiveData ? (
              featuredGigs.map((gig: any) => (
                <GigCard key={gig.id} gig={{
                  ...gig,
                  thumb: gig.thumb_color,
                  price: { basic: gig.price_basic, standard: gig.price_standard, premium: gig.price_premium },
                  reviews: gig.reviews_count,
                  delivery: { basic: gig.delivery_basic, standard: gig.delivery_standard, premium: gig.delivery_premium },
                  tags: gig.tags ?? [],
                }} creator={{
                  name: gig.creator?.name ?? 'Creator',
                  initials: gig.creator?.initials ?? '??',
                  color: gig.creator?.cover_color ?? 'var(--color-primary)',
                }} />
              ))
            ) : (
              GFM.gigs.filter(g => g.featured).slice(0, 6).map(gig => {
                const creator = GFM.creators.find(c => c.id === gig.creator);
                return <GigCard key={gig.id} gig={gig} creator={creator} />;
              })
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding stats-section">
        <div className="container">
          <div className="stats-grid">
            {GFM.stats.map((stat, i) => (
              <div className="stat-card" key={i}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.prefix || ''}{stat.value}{stat.suffix || ''}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '300px', height: '300px', background: 'rgba(99,102,241,0.03)', borderRadius: '50%' }}></div>
        <div className="container">
          <div className="cta-section">
            <h2 style={{ fontSize: '2.5rem' }}>Ready to elevate your projects?</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '20px auto 40px', lineHeight: 1.6 }}>Experience the first freelance platform where technology handles the business, so you can focus on the art.</p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/explore" className="btn btn-primary animate-shimmer" style={{ padding: '15px 40px', fontSize: '1.1rem', boxShadow: '0 10px 30px rgba(99,102,241,0.3)' }}>Find Talent</Link>
              <Link href="/register" className="btn btn-secondary" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>Become a Creator</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
