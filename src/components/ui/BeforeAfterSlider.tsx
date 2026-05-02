"use client";

import { useState, useRef, useEffect } from 'react';

export default function BeforeAfterSlider({ beforeImage, afterImage, beforeLabel = 'Before', afterLabel = 'After' }: { beforeImage: string, afterImage: string, beforeLabel?: string, afterLabel?: string }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) handleMove(e.touches[0].clientX);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      className="ba-slider-container" 
      ref={containerRef}
      onMouseDown={(e) => { setIsDragging(true); handleMove(e.clientX); }}
      onTouchStart={(e) => { setIsDragging(true); handleMove(e.touches[0].clientX); }}
      style={{ userSelect: 'none' }}
    >
      <div className="ba-img-after">
        <img src={afterImage} alt="After" draggable={false} />
        <span className="ba-label after">{afterLabel}</span>
      </div>
      <div className="ba-img-before" style={{ width: `${sliderPosition}%` }}>
        <img src={beforeImage} alt="Before" draggable={false} />
        <span className="ba-label before">{beforeLabel}</span>
      </div>
      <div className="ba-slider-handle" style={{ left: `${sliderPosition}%` }}>
        <div className="ba-slider-button">
          <i className="fa-solid fa-arrows-left-right"></i>
        </div>
      </div>
    </div>
  );
}
