"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudioIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to a default project for demo purposes
    router.push('/studio/proj-2241');
  }, [router]);

  return (
    <div style={{ background: '#05070B', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: '#818cf8', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
        <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>Initializing GhostPM™ Studio...</p>
      </div>
      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
