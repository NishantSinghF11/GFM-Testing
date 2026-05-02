"use client";

import React, { useState } from 'react';

interface AiBlogAssistantProps {
  content: string;
  title: string;
  onApplyExcerpt: (excerpt: string) => void;
  onApplyTags: (tags: string[]) => void;
  onApplyTitle: (title: string) => void;
}

export default function AiBlogAssistant({ content, title, onApplyExcerpt, onApplyTags, onApplyTitle }: AiBlogAssistantProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{
    excerpt: string;
    tags: string[];
    title: string;
  } | null>(null);

  const generateSuggestions = async () => {
    if (!content) return;
    setIsProcessing(true);
    
    // Mocking AI response logic
    setTimeout(() => {
      const summary = content.split('.').slice(0, 2).join('.') + '...';
      setAiSuggestions({
        excerpt: summary,
        tags: ['AI', 'Future', 'Workflow', 'Creative OS'],
        title: `Optimized: ${title || 'The Future of Creative Direction'}`
      });
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div style={{
      marginTop: '40px',
      padding: '40px',
      background: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(10, 13, 20, 0.4) 100%)',
      backdropFilter: 'blur(20px)',
      border: '1px solid #4B5563',
      borderRadius: '32px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
            <i className="fa-solid fa-brain" style={{ color: 'white', fontSize: '1.2rem' }}></i>
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>Neural Co-Pilot</h3>
            <p style={{ color: '#9CA3AF', fontSize: '0.85rem', margin: 0 }}>Strategic content optimization engine</p>
          </div>
        </div>
        {!aiSuggestions && (
          <button 
            onClick={generateSuggestions}
            disabled={!content || isProcessing}
            style={{
              padding: '12px 30px',
              borderRadius: '15px',
              background: isProcessing ? 'transparent' : 'rgba(99,102,241,0.1)',
              border: isProcessing ? '1px solid #4B5563' : '1px solid #6366f1',
              color: isProcessing ? '#4B5563' : '#818cf8',
              fontWeight: 700,
              cursor: content ? 'pointer' : 'not-allowed',
              opacity: content ? 1 : 0.5,
              transition: 'all 0.3s'
            }}
          >
            {isProcessing ? (
              <><i className="fa-solid fa-circle-notch fa-spin"></i> Analyzing...</>
            ) : (
              <><i className="fa-solid fa-bolt"></i> Generate Insights</>
            )}
          </button>
        )}
      </div>

      {aiSuggestions ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '20px', border: '1px solid #374151', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '1px' }}>Strategic Excerpt</span>
              <p style={{ fontSize: '0.85rem', color: '#D1D5DB', marginTop: '10px', fontStyle: 'italic', lineHeight: 1.5 }}>"{aiSuggestions.excerpt}"</p>
            </div>
            <button onClick={() => onApplyExcerpt(aiSuggestions.excerpt)} style={{ marginTop: '15px', width: '100%', padding: '8px', borderRadius: '10px', background: 'rgba(52,211,153,0.1)', border: '1px solid #34d399', color: '#34d399', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>Apply Suggestion</button>
          </div>

          <div className="glass-card" style={{ padding: '20px', border: '1px solid #374151', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '1px' }}>SEO Title</span>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginTop: '10px', lineHeight: 1.4 }}>{aiSuggestions.title}</p>
            </div>
            <button onClick={() => onApplyTitle(aiSuggestions.title)} style={{ marginTop: '15px', width: '100%', padding: '8px', borderRadius: '10px', background: 'rgba(52,211,153,0.1)', border: '1px solid #34d399', color: '#34d399', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>Apply Title</button>
          </div>

          <div className="glass-card" style={{ padding: '20px', border: '1px solid #374151', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '1px' }}>Neural Tags</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                {aiSuggestions.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '0.7rem', color: '#9CA3AF', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '6px' }}>#{tag}</span>
                ))}
              </div>
            </div>
            <button onClick={() => onApplyTags(aiSuggestions.tags)} style={{ marginTop: '15px', width: '100%', padding: '8px', borderRadius: '10px', background: 'rgba(52,211,153,0.1)', border: '1px solid #34d399', color: '#34d399', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>Apply Tags</button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px', border: '1px dashed #374151', borderRadius: '20px', color: '#6B7280', fontSize: '0.9rem' }}>
          {content ? 'Ready to analyze your content. Click "Generate Insights" to start.' : 'Start writing to enable Neural analysis.'}
        </div>
      )}
      
      {aiSuggestions && (
        <button 
          onClick={() => setAiSuggestions(null)}
          style={{ marginTop: '20px', color: '#4B5563', fontSize: '0.8rem', cursor: 'pointer', border: 'none', background: 'none', textDecoration: 'underline' }}
        >
          Reset Suggestions
        </button>
      )}
    </div>
  );
}
