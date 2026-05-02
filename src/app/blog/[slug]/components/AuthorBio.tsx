"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import VerifiedBadge from '@/components/ui/VerifiedBadge';

interface AuthorBioProps {
  authorId: string;
  author: {
    name: string;
    initials: string;
    avatar_url: string | null;
    bio: string | null;
    is_verified?: boolean;
    authority_level?: string;
  };
}

export default function AuthorBio({ authorId, author }: AuthorBioProps) {
  const [isHoveredImg, setIsHoveredImg] = useState(false);
  const [isHoveredName, setIsHoveredName] = useState(false);

  return (
    <footer style={{ marginTop: '100px', padding: '50px', background: 'rgba(255,255,255,0.02)', borderRadius: '40px', border: '1px solid #4B5563', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
      <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        <Link href={`/profile/${authorId}`} style={{ textDecoration: 'none' }}>
          <div 
            style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: '#6366f1', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 700, 
              fontSize: '1.5rem', 
              flexShrink: 0,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              transform: isHoveredImg ? 'scale(1.05)' : 'scale(1)',
              border: '2px solid rgba(255,255,255,0.1)'
            }} 
            onMouseEnter={() => setIsHoveredImg(true)} 
            onMouseLeave={() => setIsHoveredImg(false)}
          >
            {author.avatar_url ? (
              <img src={author.avatar_url} alt={author.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              author.initials
            )}
          </div>
        </Link>
        <div>
          <h4 style={{ fontSize: '0.9rem', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px', fontWeight: 800 }}>Contributor Profile</h4>
          <Link href={`/profile/${authorId}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
            <div 
              style={{ 
                fontWeight: 800, 
                fontSize: '1.6rem', 
                marginBottom: '8px', 
                cursor: 'pointer',
                transition: 'color 0.2s',
                color: isHoveredName ? '#A5B4FC' : 'white',
                display: 'flex',
                alignItems: 'center'
              }} 
              onMouseEnter={() => setIsHoveredName(true)} 
              onMouseLeave={() => setIsHoveredName(false)}
            >
              {author.name}
              {author.is_verified && <VerifiedBadge level={author.authority_level} size={20} />}
            </div>
          </Link>
          <p style={{ color: '#D1D5DB', fontSize: '1.1rem', lineHeight: 1.7, margin: 0, maxWidth: '600px' }}>{author.bio || 'Expert contributor to the GFM intelligence network.'}</p>
        </div>
      </div>
    </footer>
  );
}
