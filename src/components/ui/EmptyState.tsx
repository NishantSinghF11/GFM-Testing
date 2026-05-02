"use client";

import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: string;
}

export default function EmptyState({ title, description, actionLabel, actionHref, icon = 'fa-folder-open' }: EmptyStateProps) {
  return (
    <div className="glass-card premium-border" style={{ padding: '60px 40px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', marginTop: '20px' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', color: '#6B7280', border: '1px solid rgba(255,255,255,0.05)' }}>
        <i className={`fa-solid ${icon} fa-2x`}></i>
      </div>
      <h3 style={{ fontSize: '1.4rem', color: 'white', marginBottom: '15px' }}>{title}</h3>
      <p style={{ color: '#9CA3AF', maxWidth: '500px', margin: '0 auto 30px', lineHeight: 1.6 }}>{description}</p>
      
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn btn-primary animate-shimmer">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
