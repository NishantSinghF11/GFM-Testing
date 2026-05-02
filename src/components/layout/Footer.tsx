"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  
  if (pathname?.startsWith('/workspace') || pathname?.startsWith('/messages')) {
    return null;
  }

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="logo">
              <img src="/assets/logo.png" alt="GFM Logo" />
              <span>Gigs<span style={{ 
                background: 'linear-gradient(135deg, #04aafa, #3555c5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 800
              }}>For</span>Me</span>
            </Link>
            <p>The next-generation Creative Operating System where top talent meets ambitious vision. Create. Connect. Scale.</p>
            <div style={{ marginTop: '25px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#10b981' }}>
              <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981', animation: 'pulse 2s infinite' }}></div>
              <span style={{ fontWeight: 600, letterSpacing: '0.5px' }}>SYSTEM OPERATIONAL</span>
            </div>
          </div>
          <div className="footer-links">
            <h4><i className="fa-solid fa-users-gear" style={{ marginRight: '10px', fontSize: '0.9rem', opacity: 0.7 }}></i> For Clients</h4>
            <ul>
              <li><Link href="/ai-matchmaker">AI Matchmaker</Link></li>
              <li><Link href="/blog">GFM Journal</Link></li>
              <li><Link href="/community">Community Hub</Link></li>
              <li><Link href="/help">Help Center</Link></li>
              <li><Link href="/docs">Platform Docs</Link></li>
              <li><Link href="/explore">Browse Talent</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4><i className="fa-solid fa-palette" style={{ marginRight: '10px', fontSize: '0.9rem', opacity: 0.7 }}></i> For Creators</h4>
            <ul>
              <li><Link href="/register">Join the Network</Link></li>
              <li><Link href="/dashboard">Creator Dashboard</Link></li>
              <li><Link href="/community">Community Hub</Link></li>
              <li><Link href="/blog">GFM Journal</Link></li>
              <li><Link href="/vault">GFM Vault & Payouts</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4><i className="fa-solid fa-layer-group" style={{ marginRight: '10px', fontSize: '0.9rem', opacity: 0.7 }}></i> Categories</h4>
            <ul>
              <li><Link href="/explore?cat=video-editing">Video Editing</Link></li>
              <li><Link href="/explore?cat=cinematography">Cinematography</Link></li>
              <li><Link href="/explore?cat=motion-graphics">Motion Graphics</Link></li>
              <li><Link href="/explore?cat=vfx">VFX & Effects</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div style={{ display: 'flex', gap: '20px' }}>
            <p>&copy; {new Date().getFullYear()} GigsForMe. All rights reserved.</p>
            <Link href="/privacy-safety" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/protocol" style={{ color: 'inherit', textDecoration: 'none' }}>Protocol</Link>
          </div>
          <div className="social-links">
            <Link href="#" aria-label="Twitter"><i className="fa-brands fa-twitter"></i></Link>
            <Link href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></Link>
            <Link href="#" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
