"use client";

import React, { useState } from 'react';

export default function SocialShare({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = (platform: string) => {
    let url = '';
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);

    switch (platform) {
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
    }
    if (url) window.open(url, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ marginTop: '60px', display: 'flex', alignItems: 'center', gap: '25px', padding: '35px', background: 'rgba(255,255,255,0.04)', borderRadius: '28px', border: '1px solid #4B5563', boxShadow: '0 15px 40px rgba(0,0,0,0.2)' }}>
      <span style={{ fontWeight: 800, color: '#D1D5DB', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1.5px' }}>Share this Insight</span>
      
      <div style={{ display: 'flex', gap: '15px' }}>
        <button 
          onClick={() => handleShare('linkedin')}
          style={{ width: '50px', height: '50px', borderRadius: '15px', background: '#0A0D14', border: '1px solid #4B5563', color: '#FFFFFF', cursor: 'pointer', transition: 'all 0.3s', fontSize: '1.1rem' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#0077b5'; e.currentTarget.style.borderColor = '#0077b5'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.borderColor = '#4B5563'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <i className="fa-brands fa-linkedin-in"></i>
        </button>

        <button 
          onClick={() => handleShare('twitter')}
          style={{ width: '50px', height: '50px', borderRadius: '15px', background: '#0A0D14', border: '1px solid #4B5563', color: '#FFFFFF', cursor: 'pointer', transition: 'all 0.3s', fontSize: '1.1rem' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#1DA1F2'; e.currentTarget.style.borderColor = '#1DA1F2'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.borderColor = '#4B5563'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <i className="fa-brands fa-x-twitter"></i>
        </button>

        <button 
          onClick={copyToClipboard}
          style={{ padding: '0 25px', height: '50px', borderRadius: '15px', background: '#0A0D14', border: '1px solid #4B5563', color: copied ? '#34d399' : '#FFFFFF', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', fontWeight: 700 }}
          onMouseEnter={(e) => { if(!copied) { e.currentTarget.style.borderColor = '#818cf8'; e.currentTarget.style.transform = 'translateY(-3px)'; } }}
          onMouseLeave={(e) => { if(!copied) { e.currentTarget.style.borderColor = '#4B5563'; e.currentTarget.style.transform = 'translateY(0)'; } }}
        >
          <i className={`fa-solid ${copied ? 'fa-check' : 'fa-link'}`}></i>
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
}
