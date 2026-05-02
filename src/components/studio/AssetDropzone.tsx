"use client";

import React, { useState } from 'react';

export default function AssetDropzone() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<null | { status: 'passed' | 'warning', errors: string[] }>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const simulateScan = (name: string) => {
    setFileName(name);
    setIsScanning(true);
    setScanResults(null);
    
    setTimeout(() => {
      setIsScanning(false);
      setScanResults({
        status: name.includes('4K') ? 'passed' : 'warning',
        errors: name.includes('4K') 
          ? ["Resolution Check: 4K Detected", "Color Depth: 10-bit Log", "Frame Rate: 23.976fps"]
          : ["Warning: Resolution below project standard (1080p detected)", "Alert: Color space mismatch (sRGB found, expected Rec.709)"]
      });
    }, 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* DROPZONE AREA */}
      <div 
        onClick={() => simulateScan("Cyberpunk_Final_v3_4K.mp4")}
        style={{ 
          border: '2px dashed #1E2532', 
          borderRadius: '24px', 
          padding: '60px 40px', 
          textAlign: 'center', 
          cursor: 'pointer',
          background: 'rgba(255,255,255,0.01)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#818cf8'}
        onMouseLeave={e => e.currentTarget.style.borderColor = '#1E2532'}
      >
        {isScanning && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#818cf8', animation: 'scanLine 1.5s linear infinite', boxShadow: '0 0 15px #818cf8' }}></div>
        )}

        <div style={{ fontSize: '3rem', color: '#1E2532', marginBottom: '20px' }}>
          <i className={`fa-solid ${isScanning ? 'fa-microchip animate-pulse' : 'fa-cloud-arrow-up'}`}></i>
        </div>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>{isScanning ? 'GhostPM™ Technical Scan...' : 'Drop Assets or Click to Upload'}</h4>
        <p style={{ color: '#4B5563', fontSize: '0.85rem' }}>Upload draft versions or final masters for AI QC analysis.</p>
      </div>

      {/* SCAN RESULTS PANEL */}
      {(isScanning || scanResults) && (
        <div style={{ padding: '25px', background: 'rgba(0,0,0,0.3)', border: '1px solid #1E2532', borderRadius: '24px', animation: 'fadeIn 0.5s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px' }}>
              <i className="fa-solid fa-robot" style={{ marginRight: '8px', color: '#818cf8' }}></i> AI QUALITY CONTROL
            </div>
            {scanResults && (
              <span style={{ fontSize: '0.7rem', background: scanResults.status === 'passed' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: scanResults.status === 'passed' ? '#10b981' : '#f59e0b', padding: '4px 10px', borderRadius: '12px', fontWeight: 800 }}>
                {scanResults.status.toUpperCase()}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {isScanning ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9CA3AF', fontSize: '0.85rem' }}>
                <div className="spinner-small"></div> Verifying file metadata and codec compliance...
              </div>
            ) : (
              scanResults?.errors.map((err, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: scanResults.status === 'passed' ? '#D1D5DB' : '#f59e0b' }}>
                  <i className={`fa-solid ${scanResults.status === 'passed' ? 'fa-check' : 'fa-triangle-exclamation'}`}></i>
                  {err}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ASSET LIST (SIMULATED) */}
      <div style={{ marginTop: '20px' }}>
        <h5 style={{ fontSize: '0.8rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '15px' }}>Project Assets</h5>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { name: 'Storyboard_v2.pdf', size: '12.4 MB', date: 'Oct 24' },
            { name: 'Director_Notes.txt', size: '2 KB', date: 'Oct 26' }
          ].map(asset => (
            <div key={asset.name} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1E2532', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <i className="fa-solid fa-file-pdf" style={{ color: '#ef4444' }}></i>
                <span style={{ fontSize: '0.85rem' }}>{asset.name}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#4B5563' }}>{asset.size} • {asset.date}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scanLine {
          from { top: 0; }
          to { top: 100%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .spinner-small {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.1);
          border-top-color: #818cf8;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
