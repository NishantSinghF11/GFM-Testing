"use client";

import React, { useState, useEffect } from 'react';

interface OfferCountdownProps {
  expiresAt: string;
  onExpire?: () => void;
}

export default function OfferCountdown({ expiresAt, onExpire }: OfferCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isNearExpiry, setIsNearExpiry] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(expiresAt).getTime() - new Date().getTime();
      const seconds = Math.max(0, Math.floor(difference / 1000));
      setTimeLeft(seconds);
      setIsNearExpiry(seconds > 0 && seconds < 900); // Less than 15 minutes
      
      if (seconds <= 0 && onExpire) {
        onExpire();
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onExpire]);

  if (timeLeft <= 0) {
    return (
      <div style={{ color: '#ef4444', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
        <i className="fa-solid fa-clock-rotate-left"></i> Expired
      </div>
    );
  }

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  return (
    <div style={{ 
      color: isNearExpiry ? '#ef4444' : '#fbbf24', 
      fontSize: '0.7rem', 
      fontWeight: 700, 
      display: 'flex', 
      alignItems: 'center', 
      gap: '4px',
      animation: isNearExpiry ? 'pulse-text 1.5s infinite' : 'none'
    }}>
      <i className={`fa-solid ${isNearExpiry ? 'fa-triangle-exclamation' : 'fa-hourglass-half'}`}></i> 
      Expires in {formatTime(timeLeft)}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-text {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}} />
    </div>
  );
}
