"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface GfmNotification {
  id: string;
  type: 'deal' | 'vault' | 'payment' | 'message' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  link?: string;
  icon?: string;
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const [notifications, setNotifications] = useState<GfmNotification[]>([
    { 
      id: '1', type: 'deal', title: 'New Smart Offer', 
      message: 'Alex Creative sent a recommended offer for your video project.', 
      time: '2 mins ago', isRead: false, link: '/messages', icon: 'fa-bolt' 
    },
    { 
      id: '2', type: 'vault', title: 'Deliverable Uploaded', 
      message: 'New version of "Cinematic_Reel_V1" is ready for review.', 
      time: '1 hour ago', isRead: false, link: '/messages', icon: 'fa-vault' 
    },
    { 
      id: '3', type: 'payment', title: 'Funds Secured', 
      message: 'Payment of $250 has been locked in GFM Vault.', 
      time: '3 hours ago', isRead: true, link: '/dashboard', icon: 'fa-shield-check' 
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on navigation
  useEffect(() => setIsOpen(false), [pathname]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const filteredNotifs = activeFilter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Bell Icon */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: 'relative', background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer', padding: '10px', transition: 'all 0.2s' }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#818cf8'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
      >
        <i className={`fa-${unreadCount > 0 ? 'solid' : 'regular'} fa-bell`}></i>
        {unreadCount > 0 && (
          <span style={{ position: 'absolute', top: '8px', right: '6px', background: '#ef4444', color: 'white', fontSize: '0.65rem', fontWeight: 800, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0A0A0F', animation: 'pulse 2s infinite' }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div style={{ position: 'absolute', top: '50px', right: '-10px', width: '380px', background: 'rgba(10, 13, 20, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', overflow: 'hidden', zIndex: 10000, animation: 'dropdownFade 0.2s ease-out' }}>
          
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes dropdownFade {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes pulse {
              0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
              70% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
              100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
            }
          `}} />

          {/* Header */}
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Activity Center</h4>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <button onClick={markAllAsRead} style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>Mark all as read</button>
            </div>
          </div>

          {/* Filters */}
          <div style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.02)', display: 'flex', gap: '10px' }}>
            {['all', 'unread'].map(f => (
              <button 
                key={f} 
                onClick={() => setActiveFilter(f as any)}
                style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', background: activeFilter === f ? 'rgba(129,140,248,0.1)' : 'transparent', color: activeFilter === f ? '#818cf8' : '#6B7280', border: '1px solid', borderColor: activeFilter === f ? 'rgba(129,140,248,0.3)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* List */}
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {filteredNotifs.length > 0 ? filteredNotifs.map(n => (
              <div 
                key={n.id} 
                onClick={() => markAsRead(n.id)}
                style={{ padding: '15px 20px', borderBottom: '1px solid rgba(255,255,255,0.03)', display: 'flex', gap: '15px', cursor: 'pointer', transition: 'all 0.2s', background: n.isRead ? 'transparent' : 'rgba(99,102,241,0.03)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = n.isRead ? 'transparent' : 'rgba(99,102,241,0.03)'}
              >
                <div style={{ width: '40px', height: '40px', background: n.type === 'deal' ? 'rgba(99,102,241,0.1)' : n.type === 'vault' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: n.type === 'deal' ? '#818cf8' : n.type === 'vault' ? '#10b981' : '#f59e0b', fontSize: '1rem', flexShrink: 0 }}>
                  <i className={`fa-solid ${n.icon}`}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>{n.title}</div>
                    <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>{n.time}</div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#9CA3AF', lineHeight: 1.4, marginBottom: '8px' }}>{n.message}</div>
                  {n.link && (
                    <Link href={n.link} style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      View Details <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.6rem' }}></i>
                    </Link>
                  )}
                </div>
                {!n.isRead && <div style={{ width: '8px', height: '8px', background: '#818cf8', borderRadius: '50%', marginTop: '5px' }}></div>}
              </div>
            )) : (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6B7280' }}>
                <i className="fa-solid fa-ghost" style={{ fontSize: '2rem', marginBottom: '15px', display: 'block' }}></i>
                <div style={{ fontSize: '0.9rem' }}>No notifications yet</div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', background: 'rgba(0,0,0,0.2)' }}>
            <Link href="/dashboard" style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600 }}>See all activity</Link>
          </div>
        </div>
      )}
    </div>
  );
}
