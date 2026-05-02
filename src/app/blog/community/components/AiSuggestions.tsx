"use client";

import React, { useState } from 'react';

interface AiSuggestionsProps {
  content: string;
  title: string;
  onApplyExcerpt: (excerpt: string) => void;
  onApplyTags: (tags: string[]) => void;
  onApplyTitle: (title: string) => void;
}

export default function AiSuggestions({ content, title, onApplyExcerpt, onApplyTags, onApplyTitle }: AiSuggestionsProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState<{
    excerpt: string;
    tags: string[];
    title: string;
  } | null>(null);

  const generateSuggestions = async () => {
    if (!content) return;
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/blog/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      });
      
      const data = await response.json();
      if (data.suggestions) {
        setSuggestions({
          excerpt: data.suggestions.excerpt,
          tags: data.suggestions.tags,
          title: data.suggestions.titles[0] // Use first suggestion
        });
      }
    } catch (err) {
      console.error('AI Fetch Error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '140px' }}>
      <div style={{ padding: '20px', border: '1px solid #4B5563', borderRadius: '24px', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#818cf8' }}></i>
          <span style={{ fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Suggestions</span>
        </div>

        {!suggestions ? (
          <button 
            onClick={generateSuggestions}
            disabled={!content || isProcessing}
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: '16px',
              background: isProcessing ? 'transparent' : 'rgba(99,102,241,0.1)',
              border: '1px solid #6366f1',
              color: '#818cf8',
              fontWeight: 700,
              cursor: content ? 'pointer' : 'not-allowed',
              opacity: content ? 1 : 0.5
            }}
          >
            {isProcessing ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Analyze Content'}
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Title */}
            <div style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid #374151' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 700 }}>BETTER TITLE</span>
                <button onClick={() => onApplyTitle(suggestions.title)} style={{ color: '#34d399', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}>APPLY</button>
              </div>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white', margin: 0 }}>{suggestions.title}</p>
            </div>

            {/* Excerpt */}
            <div style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid #374151' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 700 }}>STRATEGIC EXCERPT</span>
                <button onClick={() => onApplyExcerpt(suggestions.excerpt)} style={{ color: '#34d399', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}>APPLY</button>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#D1D5DB', margin: 0, fontStyle: 'italic' }}>"{suggestions.excerpt}"</p>
            </div>

            {/* Tags */}
            <div style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid #374151' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 700 }}>OPTIMIZED TAGS</span>
                <button onClick={() => onApplyTags(suggestions.tags)} style={{ color: '#34d399', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}>APPLY</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {suggestions.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '0.7rem', color: '#9CA3AF', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '4px' }}>#{tag}</span>
                ))}
              </div>
            </div>

            <button onClick={() => setSuggestions(null)} style={{ fontSize: '0.75rem', color: '#4B5563', border: 'none', background: 'none', cursor: 'pointer', marginTop: '10px' }}>Clear Suggestions</button>
          </div>
        )}
      </div>

      <div style={{ padding: '20px', background: 'rgba(52,211,153,0.05)', borderRadius: '24px', border: '1px dashed #059669' }}>
        <p style={{ color: '#34d399', fontSize: '0.8rem', margin: 0, lineHeight: 1.5 }}>
          <i className="fa-solid fa-circle-info"></i> These suggestions are optimized for GFM Protocol authority and reach.
        </p>
      </div>
    </div>
  );
}
