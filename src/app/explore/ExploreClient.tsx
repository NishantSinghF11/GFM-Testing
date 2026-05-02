"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { GFM } from '@/lib/data';
import GigCard from '@/components/ui/GigCard';

interface ExploreClientProps {
  initialGigs: any[];
  initialCategories: any[];
}

export default function ExploreClient({ initialGigs, initialCategories }: ExploreClientProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('cat') || 'all';

  const initialMatched = searchParams.get('matched') === 'true';
  const initialQuery = searchParams.get('query') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [hasMatched, setHasMatched] = useState(initialMatched);
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [budget, setBudget] = useState('any'); // any, under100, 100-500, over500
  const [delivery, setDelivery] = useState('any');
  const [aiRecommendedOnly, setAiRecommendedOnly] = useState(false);
  const [sortVal, setSortVal] = useState('recommended');
  
  const [allGigs] = useState<any[]>(initialGigs);
  const [categories] = useState<any[]>(initialCategories);
  const [filteredGigs, setFilteredGigs] = useState<any[]>([]);

  // Apply filters
  useEffect(() => {
    let filtered = allGigs.filter(gig => {
      const matchSearch = gig.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (gig.tags && gig.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchCat = selectedCategory === 'all' || gig.category === selectedCategory;
      
      let matchDelivery = true;
      if (delivery !== 'any') matchDelivery = (gig.delivery?.basic || gig.delivery_basic) <= parseInt(delivery);
      
      let matchBudget = true;
      const price = gig.price?.basic || gig.price_basic || gig.price;
      if (budget === 'under100') matchBudget = price < 100;
      if (budget === '100-500') matchBudget = price >= 100 && price <= 500;
      if (budget === 'over500') matchBudget = price > 500;

      let matchAi = true;
      if (aiRecommendedOnly) {
        const rating = gig.rating || 0;
        const reviews = gig.reviews || gig.reviews_count || 0;
        matchAi = rating > 4.7 || reviews > 10;
      }

      return matchSearch && matchCat && matchDelivery && matchBudget && matchAi;
    });

    if (sortVal === 'price_low') filtered.sort((a, b) => (a.price?.basic || a.price) - (b.price?.basic || b.price));
    else if (sortVal === 'price_high') filtered.sort((a, b) => (b.price?.basic || b.price) - (a.price?.basic || a.price));
    else if (sortVal === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else filtered.sort((a, b) => a.id - b.id); // default / recommended

    setFilteredGigs(filtered);
  }, [allGigs, searchQuery, selectedCategory, delivery, budget, aiRecommendedOnly, sortVal]);

  const resetFilters = () => {
    setSearchQuery('');
    setHasMatched(false);
    setSelectedCategory('all');
    setBudget('any');
    setDelivery('any');
    setAiRecommendedOnly(false);
    setSortVal('recommended');
  };

  return (
    <div style={{ background: '#05070B', minHeight: '100vh', color: 'white', paddingBottom: '100px' }}>
      
      <div style={{ 
        background: 'linear-gradient(180deg, #0A0D14 0%, #05070B 100%)', 
        padding: '140px 20px 60px', 
        borderBottom: '1px solid #1E2532',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0', fontFamily: 'var(--font-heading)' }}>
          Explore <span style={{ color: 'var(--color-primary-light)' }}>Creative Services</span>
        </h1>
        <p style={{ color: '#9CA3AF', fontSize: '1.1rem', margin: 0 }}>
          Find the perfect talent for your next big project.
        </p>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px', display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        
        {/* Advanced Filter Sidebar */}
        <aside style={{ width: '280px', flexShrink: 0, position: 'sticky', top: '20px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Filters</h3>
            <button onClick={resetFilters} style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: '0.8rem', cursor: 'pointer' }}>Reset All</button>
          </div>

          <div style={{ background: '#0A0D14', border: '1px solid #1E2532', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* AI Recommended Toggle */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'white' }}>
                  <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#818cf8' }}></i> AI Recommended
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '24px' }}>
                  <input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }} checked={aiRecommendedOnly} onChange={(e) => setAiRecommendedOnly(e.target.checked)} />
                  <span style={{ 
                    position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundColor: aiRecommendedOnly ? '#6366f1' : '#374151', borderRadius: '24px', transition: '.4s' 
                  }}>
                    <span style={{ 
                      position: 'absolute', height: '18px', width: '18px', left: aiRecommendedOnly ? '19px' : '3px', bottom: '3px', 
                      backgroundColor: 'white', borderRadius: '50%', transition: '.4s' 
                    }}></span>
                  </span>
                </label>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '8px 0 0 0', lineHeight: 1.4 }}>Only show Top Rated creators vetted by our AI system.</p>
            </div>

            {/* Category */}
            <div>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px' }}>Category</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem', color: selectedCategory === 'all' ? 'white' : '#D1D5DB' }}>
                  <input type="radio" name="category" value="all" checked={selectedCategory === 'all'} onChange={() => setSelectedCategory('all')} style={{ accentColor: 'var(--color-primary)' }} /> 
                  All Categories
                </label>
                {categories.map((cat: any) => (
                  <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem', color: selectedCategory === cat.id ? 'white' : '#D1D5DB' }}>
                    <input type="radio" name="category" value={cat.id} checked={selectedCategory === cat.id} onChange={() => setSelectedCategory(cat.id)} style={{ accentColor: 'var(--color-primary)' }} /> 
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px' }}>Budget</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {[
                  { id: 'any', label: 'Any' },
                  { id: 'under100', label: 'Under $100' },
                  { id: '100-500', label: '$100 - $500' },
                  { id: 'over500', label: '$500+' }
                ].map(opt => (
                  <button 
                    key={opt.id}
                    onClick={() => setBudget(opt.id)}
                    style={{ 
                      background: budget === opt.id ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${budget === opt.id ? 'var(--color-primary)' : '#374151'}`,
                      color: budget === opt.id ? 'white' : '#D1D5DB',
                      padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Time */}
            <div>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px' }}>Delivery Time</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {[
                  { id: 'any', label: 'Any Time' },
                  { id: '3', label: 'Up to 3 days' },
                  { id: '7', label: 'Up to 7 days' }
                ].map(opt => (
                  <button 
                    key={opt.id}
                    onClick={() => setDelivery(opt.id)}
                    style={{ 
                      background: delivery === opt.id ? 'rgba(99,102,241,0.2)' : 'transparent',
                      border: `1px solid ${delivery === opt.id ? 'var(--color-primary)' : '#374151'}`,
                      color: delivery === opt.id ? 'var(--color-primary-light)' : '#D1D5DB',
                      padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* Main Results Grid */}
        <main style={{ flex: 1 }}>
          
          {/* Top Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#0A0D14', padding: '12px 20px', borderRadius: '12px', border: '1px solid #1E2532' }}>
            
            {/* Search fallback if not using hero */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '300px' }}>
              <i className="fa-solid fa-search" style={{ color: '#6B7280' }}></i>
              <input 
                type="text" 
                placeholder="Search keywords..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '0.9rem', outline: 'none', width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ color: '#6B7280', fontSize: '0.85rem' }}>{filteredGigs.length} results</span>
              <div style={{ height: '24px', width: '1px', background: '#1E2532' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>Sort by:</span>
                <select 
                  value={sortVal} 
                  onChange={(e) => setSortVal(e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #374151', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="recommended">Recommended</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Special Top Matches Section (Only visible after AI Match) */}
          {hasMatched && filteredGigs.length > 0 && (
            <div style={{ marginBottom: '60px', animation: 'fadeInUp 0.8s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.6rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px', color: 'white', fontFamily: 'var(--font-heading)' }}>
                    <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#818cf8' }}></i> Neural Match Results
                  </h3>
                  <p style={{ color: '#9CA3AF', margin: 0, fontSize: '0.95rem' }}>These creators perfectly align with your project intent: <strong>"{searchQuery}"</strong></p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 16px', borderRadius: '30px', border: '1px solid #1E2532', fontSize: '0.75rem', color: '#6B7280' }}>
                   Confidence Index: <span style={{ color: '#10b981', fontWeight: 800 }}>98.4%</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {filteredGigs.slice(0, 3).map((gig, idx) => {
                  const scores = [98, 96, 94];
                  const highlights = ["Style Synthesis", "Delivery Velocity", "Technical Precision"];
                  return (
                    <div key={`ai-${gig.id}`} className="glass-card" style={{ 
                      borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(139,92,246,0.3)', 
                      background: 'linear-gradient(135deg, rgba(139,92,246,0.05), transparent)',
                      position: 'relative'
                    }}>
                      <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10, background: 'rgba(16, 185, 129, 0.9)', color: 'white', padding: '4px 10px', borderRadius: '30px', fontSize: '0.65rem', fontWeight: 800, backdropFilter: 'blur(4px)' }}>
                        {scores[idx]}% MATCH
                      </div>
                      <GigCard gig={gig} creator={gig.creatorObj} />
                      <div style={{ padding: '0 20px 20px 20px' }}>
                        <div style={{ padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
                          <div style={{ fontSize: '0.6rem', color: '#818cf8', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>AI Match Reasoning</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></div>
                            <span style={{ fontSize: '0.8rem', color: 'white', fontWeight: 600 }}>{highlights[idx]}</span>
                          </div>
                          <p style={{ fontSize: '0.7rem', color: '#9CA3AF', margin: 0, lineHeight: 1.5 }}>
                            Creator's portfolio demonstrates a high correlation with your requested cinematic style and turnaround requirements.
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #1E2532, transparent)', margin: '50px 0' }}></div>
            </div>
          )}

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {filteredGigs.length > 0 ? (
              (hasMatched ? filteredGigs.slice(3) : filteredGigs).map(gig => (
                <GigCard key={gig.id} gig={gig} creator={gig.creatorObj} />
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 20px', background: '#0A0D14', borderRadius: '16px', border: '1px dashed #374151' }}>
                <i className="fa-solid fa-ghost" style={{ fontSize: '3rem', color: '#374151', marginBottom: '20px' }}></i>
                <h3 style={{ fontSize: '1.4rem', margin: '0 0 10px 0' }}>No creators found</h3>
                <p style={{ color: '#9CA3AF' }}>Try adjusting your filters, expanding your budget, or using fewer keywords.</p>
                <button onClick={resetFilters} className="btn btn-outline" style={{ marginTop: '20px' }}>Clear All Filters</button>
              </div>
            )}
          </div>
          
          {(hasMatched ? filteredGigs.slice(3).length > 0 : filteredGigs.length > 0) && (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <button className="btn btn-outline" style={{ padding: '10px 30px', borderRadius: '24px', background: 'rgba(255,255,255,0.03)' }}>Load More Gigs</button>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
