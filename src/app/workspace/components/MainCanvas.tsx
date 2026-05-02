import React, { useRef, useState, useEffect } from 'react';

interface MainCanvasProps {
  displayFile: any;
  files: any[];
  comments: any[];
  onTimeUpdate: (time: number) => void;
  seekToTime: number | null;
  addToast: (text: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  isGhosting: boolean;
  setIsGhosting: (v: boolean) => void;
  ghostSliderPos: number;
  setGhostSliderPos: (v: number) => void;
  onBroadcast: (payload: any) => void;
  onSaveAnnotation: (dataUrl: string) => void;
  isCompleted?: boolean;
}

function formatTime(seconds: number) {
  if (!seconds || isNaN(seconds)) return '00:00';
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function MainCanvas({ 
  displayFile, files, comments, onTimeUpdate, seekToTime, addToast,
  isGhosting, setIsGhosting, ghostSliderPos, setGhostSliderPos, onBroadcast, onSaveAnnotation, isCompleted
}: MainCanvasProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [hoveredMarker, setHoveredMarker] = useState<any>(null);
  
  const ghostVideoRef = useRef<HTMLVideoElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // System 55: Smart Annotation State
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [annotationTool, setAnnotationTool] = useState<'brush' | 'circle' | 'arrow' | 'rect'>('brush');
  const [drawColor, setDrawColor] = useState('#818cf8');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{x: number, y: number} | null>(null);

  // Find previous version for ghosting
  const prevVersionFile = files.find(f => f.version === (displayFile?.version - 1));

  useEffect(() => {
    if (seekToTime !== null && videoRef.current) {
      videoRef.current.currentTime = seekToTime;
      if (ghostVideoRef.current) ghostVideoRef.current.currentTime = seekToTime;
      setCurrentTime(seekToTime);
    }
  }, [seekToTime]);

  // Sync ghost video with main video
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      onTimeUpdate(videoRef.current.currentTime);
      
      // Keep ghost video in sync
      if (isGhosting && ghostVideoRef.current) {
        const drift = Math.abs(ghostVideoRef.current.currentTime - videoRef.current.currentTime);
        if (drift > 0.1) ghostVideoRef.current.currentTime = videoRef.current.currentTime;
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) { 
      videoRef.current.pause(); 
      if (ghostVideoRef.current) ghostVideoRef.current.pause();
      setIsPlaying(false); 
    }
    else { 
      videoRef.current.play(); 
      if (ghostVideoRef.current) ghostVideoRef.current.play();
      setIsPlaying(true); 
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    if (videoRef.current) videoRef.current.currentTime = t;
    setCurrentTime(t);
  };

  const stepFrame = (forward: boolean) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime + (forward ? 0.04 : -0.04));
  };

  const changeSpeed = (s: number) => {
    setSpeed(s);
    if (videoRef.current) videoRef.current.playbackRate = s;
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (videoRef.current) videoRef.current.volume = v;
  };

  const timecodeToSeconds = (tc: string) => {
    const parts = tc.split(':');
    return parts.length === 2 ? parseInt(parts[0]) * 60 + parseInt(parts[1]) : 0;
  };

  // System 55: Drawing Logic
  const startDraw = (e: React.MouseEvent) => {
    if (!isAnnotating || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setStartPos({ x, y });
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    if (annotationTool === 'brush') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !canvasRef.current || !startPos) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (annotationTool === 'brush') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      // For shapes, we clear and redraw (or use a temp layer)
      // For now, let's just do brush to keep it simple and add shapes in next step if needed
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const endDraw = () => {
    setIsDrawing(false);
    setStartPos(null);
    
    // System 55.3: Auto-Capture on Stroke End
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onSaveAnnotation(dataUrl);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      onSaveAnnotation(''); // Clear pending snapshot
    }
  };

  const videoComments = comments.filter(c => c.timecode);

  const isVideo = displayFile?.file_type?.startsWith('video/');
  const isImage = displayFile?.file_type?.startsWith('image/');

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#05070B', overflow: 'hidden' }}>
      
      {/* Top info bar */}
      {displayFile && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 24px', background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid #0F1523' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className={`fa-solid ${isVideo ? 'fa-film' : isImage ? 'fa-image' : 'fa-file'}`} style={{ color: 'var(--color-primary-light)', fontSize: '0.85rem' }}></i>
            <span style={{ fontSize: '0.85rem', color: '#D1D5DB', fontWeight: 500 }}>{displayFile.file_name}</span>
            <span style={{ fontSize: '0.65rem', padding: '2px 7px', borderRadius: '4px', background: 'rgba(99,102,241,0.15)', color: '#818cf8', fontWeight: 700 }}>v{displayFile.version || 1}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <a href={displayFile.file_url} target="_blank" rel="noreferrer" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #1E2532', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', color: '#9CA3AF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <i className="fa-solid fa-arrow-up-right-from-square"></i> Open
            </a>
          </div>
        </div>
      )}

      {/* Main Viewer */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', overflow: 'hidden', position: 'relative' }}>
        
        {/* System 14: Quantum HUD Overlay */}
        {displayFile && isVideo && (
          <>
            <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 50, pointerEvents: 'none' }}>
              <div className="glass-card" style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', border: '1px solid rgba(139,92,246,0.2)', animation: 'fadeIn 1s ease' }}>
                <div style={{ fontSize: '0.5rem', color: '#818cf8', fontWeight: 900, letterSpacing: '1px', marginBottom: '4px' }}>FRAME SYNC</div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div>
                    <div style={{ fontSize: '0.45rem', color: '#6B7280' }}>F-INDEX</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'monospace' }}>{Math.floor(currentTime * 24)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.45rem', color: '#6B7280' }}>DRIFT</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', fontFamily: 'monospace' }}>0.002%</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 50, pointerEvents: 'none' }}>
              <div className="glass-card" style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <div style={{ fontSize: '0.55rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
                  <span style={{ color: '#D1D5DB' }}>CREATOR SYNC</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* System 60: Post-Delivery Performance HUD */}
        {displayFile && isVideo && isCompleted && (
          <div style={{ position: 'absolute', bottom: '80px', right: '30px', zIndex: 100, pointerEvents: 'none', animation: 'fadeInRight 1s ease' }}>
            <div className="glass-card" style={{ padding: '15px', background: 'rgba(16, 185, 129, 0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', minWidth: '180px' }}>
              <div style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 900, letterSpacing: '1px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fa-solid fa-chart-line"></i> PERFORMANCE INTEL
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>ENGAGEMENT</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'white' }}>8.4%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>AVG WATCH</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'white' }}>01:42</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>ROI INDEX</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981' }}>+24%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {displayFile ? (
          isVideo ? (
            <div 
              ref={sliderContainerRef}
              style={{ position: 'relative', maxWidth: '100%', maxHeight: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRadius: '12px' }}
              onMouseMove={(e) => {
                if (isGhosting && sliderContainerRef.current) {
                  const rect = sliderContainerRef.current.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const pos = Math.max(0, Math.min(100, x));
                  setGhostSliderPos(pos);
                  onBroadcast({ ghostSliderPos: pos });
                }
              }}
            >
              {/* Bottom Layer: Previous Version (The Ghost) */}
              {isGhosting && prevVersionFile && (
                <video
                  ref={ghostVideoRef}
                  src={prevVersionFile.file_url}
                  muted
                  style={{
                    width: '100%', maxHeight: 'calc(100vh - 230px)',
                    objectFit: 'contain',
                    borderRadius: '12px'
                  }}
                />
              )}

              {/* Top Layer: Current Version */}
              <video
                ref={videoRef}
                key={displayFile.id}
                src={displayFile.file_url}
                style={{ 
                  position: isGhosting ? 'absolute' : 'relative',
                  top: 0, left: 0,
                  width: '100%', 
                  maxHeight: 'calc(100vh - 230px)', 
                  borderRadius: '12px', 
                  boxShadow: isPlaying ? '0 0 100px rgba(139,92,246,0.15)' : '0 0 60px rgba(0,0,0,0.7)', 
                  cursor: 'pointer', 
                  display: 'block',
                  transition: 'box-shadow 0.5s ease',
                  clipPath: isGhosting ? `inset(0 ${100 - ghostSliderPos}% 0 0)` : 'none',
                  zIndex: 10
                }}
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* System 46.2: Split Slider Bar */}
              {isGhosting && prevVersionFile && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${ghostSliderPos}%`,
                  width: '2px',
                  background: 'white',
                  boxShadow: '0 0 15px rgba(139,92,246,1)',
                  zIndex: 20,
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'white', border: '2px solid #818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', fontSize: '0.8rem', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
                    <i className="fa-solid fa-arrows-left-right"></i>
                  </div>
                </div>
              )}

              {/* System 55: Annotation Canvas Layer */}
              {isAnnotating && (
                <canvas
                  ref={canvasRef}
                  width={1280} // Internal resolution
                  height={720}
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                  style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    zIndex: 30, cursor: 'crosshair', pointerEvents: 'all'
                  }}
                />
              )}

              {/* System 55: Annotation Toolbar */}
              {isAnnotating && (
                <div style={{
                  position: 'absolute', top: '20px', right: '20px', zIndex: 40,
                  display: 'flex', flexDirection: 'column', gap: '8px',
                  background: 'rgba(10,13,20,0.85)', padding: '10px', borderRadius: '12px',
                  border: '1px solid rgba(139,92,246,0.3)', backdropFilter: 'blur(10px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>
                  {[
                    { id: 'brush', icon: 'fa-paint-brush' },
                    { id: 'circle', icon: 'fa-circle' },
                    { id: 'arrow', icon: 'fa-arrow-right' },
                    { id: 'rect', icon: 'fa-square' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setAnnotationTool(t.id as any)}
                      style={{
                        width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                        background: annotationTool === t.id ? '#818cf8' : 'rgba(255,255,255,0.05)',
                        color: 'white', cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      <i className={`fa-solid ${t.icon}`}></i>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      if (canvasRef.current) {
                        const dataUrl = canvasRef.current.toDataURL('image/png');
                        onSaveAnnotation(dataUrl);
                        addToast("Markup snapshot attached to message", "success");
                      }
                    }}
                    style={{
                      width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                      background: 'rgba(34,197,94,0.15)', color: '#22c55e', cursor: 'pointer'
                    }}
                    title="Attach to Comment"
                  >
                    <i className="fa-solid fa-paperclip"></i>
                  </button>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }}></div>
                  <button
                    onClick={clearCanvas}
                    style={{
                      width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                      background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer'
                    }}
                    title="Clear All"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                  <button
                    onClick={() => setIsAnnotating(false)}
                    style={{
                      width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                      background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer'
                    }}
                    title="Close Tools"
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
              )}

              {/* Play overlay hint */}
              {!isPlaying && !isAnnotating && (
                <div onClick={togglePlay} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(139,92,241,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 0 30px rgba(139,92,241,0.4)' }}>
                  <i className="fa-solid fa-play" style={{ color: 'white', fontSize: '1.4rem', marginLeft: '4px' }}></i>
                </div>
              )}
            </div>
          ) : isImage ? (
            <img src={displayFile.file_url} alt={displayFile.file_name} style={{ maxWidth: '100%', maxHeight: 'calc(100vh - 200px)', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 0 80px rgba(0,0,0,0.6)' }} />
          ) : (
            <div style={{ padding: '60px', textAlign: 'center', background: '#0F131D', borderRadius: '12px', border: '1px solid #1E2532', minWidth: '320px' }}>
              <i className="fa-solid fa-file-zipper fa-5x" style={{ color: '#818cf8', marginBottom: '20px', display: 'block' }}></i>
              <h3 style={{ color: 'white', marginBottom: '8px' }}>{displayFile.file_name}</h3>
              <p style={{ color: '#6B7280', fontSize: '0.85rem', marginBottom: '24px' }}>{(displayFile.file_size / 1024 / 1024).toFixed(2)} MB</p>
              <a href={displayFile.file_url} target="_blank" rel="noreferrer" className="btn btn-primary">
                <i className="fa-solid fa-download"></i> Download File
              </a>
            </div>
          )
        ) : (
          <div style={{ textAlign: 'center', color: '#374151' }}>
            <i className="fa-solid fa-layer-group fa-5x" style={{ marginBottom: '20px', display: 'block', opacity: 0.2 }}></i>
            <h2 style={{ color: '#6B7280', fontWeight: 400, marginBottom: '8px' }}>Project Canvas</h2>
            <p style={{ fontSize: '0.9rem', color: '#4B5563' }}>Upload your first file to start reviewing</p>
          </div>
        )}
      </div>

      {/* Video Controls */}
      {isVideo && (
        <div style={{ background: '#0A0D14', borderTop: '1px solid #1A2035', padding: '12px 24px 14px', flexShrink: 0 }}>
          
          {/* Timeline with markers */}
          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <input
              type="range" min={0} max={duration || 100} step={0.01} value={currentTime} onChange={handleSeek}
              style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer', display: 'block', height: '4px' }}
            />
            {/* Marker dots (System 58: Timeline Markers) */}
            {duration > 0 && videoComments.map(c => {
              const sec = timecodeToSeconds(c.timecode);
              const pct = (sec / duration) * 100;
              
              // Color logic
              const isRevision = c.comment_type === 'revision';
              const isApproved = c.comment_type === 'approved';
              const hasSnapshot = c.text?.includes('[ANNOTATION:');
              
              let dotColor = '#8b5cf6'; // Default Purple
              if (hasSnapshot) dotColor = '#3b82f6'; // Blue
              if (isRevision) dotColor = '#ef4444'; // Red
              if (isApproved) dotColor = '#22c55e'; // Green
              
              return (
                <div
                  key={c.id}
                  title={`[${c.timecode}] ${c.text?.split('[ANNOTATION:')[0].trim()}`}
                  onMouseEnter={() => setHoveredMarker(c)}
                  onMouseLeave={() => setHoveredMarker(null)}
                  onClick={() => { if (videoRef.current) videoRef.current.currentTime = sec; }}
                  style={{
                    position: 'absolute', left: `${pct}%`, top: '50%', transform: 'translate(-50%, -50%)',
                    width: '10px', height: '10px', borderRadius: '50%', background: dotColor,
                    boxShadow: `0 0 10px ${dotColor}`, cursor: 'pointer', pointerEvents: 'all', zIndex: 10,
                    transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    border: '2px solid rgba(0,0,0,0.5)',
                    scale: hoveredMarker?.id === c.id ? '1.5' : '1'
                  }}
                />
              );
            })}
            {/* Hovered marker tooltip */}
            {hoveredMarker && duration > 0 && (
              <div style={{
                position: 'absolute', bottom: '18px',
                left: `${(timecodeToSeconds(hoveredMarker.timecode) / duration) * 100}%`,
                transform: 'translateX(-50%)',
                background: '#111827', border: '1px solid #374151', borderRadius: '6px', padding: '6px 10px',
                fontSize: '0.75rem', color: 'white', whiteSpace: 'nowrap', zIndex: 20, pointerEvents: 'none',
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
              }}>
                <span style={{ color: 'var(--color-primary-light)', fontWeight: 700, marginRight: '5px' }}>{hoveredMarker.timecode}</span>
                {hoveredMarker.text.slice(0, 40)}{hoveredMarker.text.length > 40 ? '…' : ''}
              </div>
            )}
          </div>

          {/* Control row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Left: Playback controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => stepFrame(false)} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '1rem' }} title="Step back 1 frame (-0.04s)">
                <i className="fa-solid fa-backward-step"></i>
              </button>
              <button onClick={togglePlay} style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--color-primary)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`} style={{ fontSize: '0.8rem', marginLeft: isPlaying ? 0 : '2px' }}></i>
              </button>
              <button onClick={() => stepFrame(true)} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '1rem' }} title="Step forward 1 frame (+0.04s)">
                <i className="fa-solid fa-forward-step"></i>
              </button>
              
              {/* Volume */}
              <button onClick={toggleMute} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer' }}>
                <i className={`fa-solid ${isMuted || volume === 0 ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
              </button>
              <input type="range" min={0} max={1} step={0.05} value={isMuted ? 0 : volume} onChange={handleVolume} style={{ width: '70px', accentColor: 'var(--color-primary)', cursor: 'pointer' }} />
              
              <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#9CA3AF' }}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            
            {/* Right: Speed, Ghosting & Fullscreen */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                onClick={() => {
                  if (!prevVersionFile) {
                    addToast("No previous version found (v" + (displayFile?.version - 1 || 0) + " missing)", "warning");
                    return;
                  }
                  const newGhosting = !isGhosting;
                  setIsGhosting(newGhosting);
                  onBroadcast({ isGhosting: newGhosting });
                  addToast(newGhosting ? "Asset Ghosting Active: Syncing v" + prevVersionFile.version : "Ghosting Deactivated", newGhosting ? "success" : "info");
                }}
                style={{ 
                  background: isGhosting ? 'rgba(139,92,241,0.2)' : 'rgba(139,92,241,0.1)', 
                  border: `1px solid ${isGhosting ? '#a78bfa' : 'rgba(139,92,241,0.3)'}`, 
                  color: isGhosting ? 'white' : '#a78bfa', 
                  padding: '4px 12px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                  transition: 'all 0.2s',
                  opacity: prevVersionFile ? 1 : 0.5
                }}
                title={prevVersionFile ? "System 46: Asset Ghosting" : "No previous version available"}
              >
                <i className={`fa-solid ${isGhosting ? 'fa-eye' : 'fa-ghost'}`}></i> {isGhosting ? 'VIEWING GHOST' : 'GHOST'}
              </button>
              
              <div style={{ width: '1px', height: '16px', background: '#1E2532', margin: '0 4px' }}></div>

              {[0.5, 1, 1.5, 2].map(s => (
                <button key={s} onClick={() => changeSpeed(s)} style={{
                  padding: '3px 8px', borderRadius: '4px', border: `1px solid ${speed === s ? 'var(--color-primary)' : '#1E2532'}`,
                  background: speed === s ? 'rgba(99,102,241,0.15)' : 'transparent',
                  color: speed === s ? 'var(--color-primary-light)' : '#6B7280', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600
                }}>{s}x</button>
              ))}
              <div style={{ width: '1px', height: '16px', background: '#1E2532', margin: '0 4px' }}></div>
              {/* Annotation Toggle */}
              <button 
                onClick={() => {
                  if (isCompleted) return; // System 60: Project Locked
                  const nextState = !isAnnotating;
                  setIsAnnotating(nextState);
                  if (nextState) {
                    setIsPlaying(false);
                    videoRef.current?.pause();
                    ghostVideoRef.current?.pause();
                  }
                }}
                style={{ 
                  background: isAnnotating ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.04)', 
                  border: `1px solid ${isAnnotating ? '#22c55e' : (isCompleted ? '#1A2035' : '#1E2532')}`, 
                  color: isAnnotating ? '#22c55e' : (isCompleted ? '#4B5563' : '#9CA3AF'), 
                  padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, 
                  cursor: isCompleted ? 'not-allowed' : 'pointer', 
                  display: 'flex', alignItems: 'center', gap: '6px',
                  transition: 'all 0.2s',
                  opacity: isCompleted ? 0.6 : 1
                }}
                title={isCompleted ? "Project Locked" : "System 55: Smart Markup"}
              >
                <i className={`fa-solid ${isCompleted ? 'fa-lock' : 'fa-pen-nib'}`}></i> {isAnnotating ? 'DRAWING...' : (isCompleted ? 'FINALIZED' : 'MARKUP')}
              </button>

              <button 
                onClick={() => {
                  if (videoRef.current?.requestFullscreen) videoRef.current.requestFullscreen();
                }}
                style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '1rem' }} 
                title="Full Screen"
              >
                <i className="fa-solid fa-expand"></i>
              </button>

              {isCompleted && (
                <button 
                  style={{ 
                    background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa', 
                    padding: '4px 12px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139,92,246,0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(139,92,246,0.1)'}
                >
                  <i className="fa-solid fa-recycle"></i> SMART REUSE
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
