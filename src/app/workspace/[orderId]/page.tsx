"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

import LeftPanel from '../components/LeftPanel';
import MainCanvas from '../components/MainCanvas';
import RightPanel from '../components/RightPanel';
import PortfolioModal from '../components/PortfolioModal';

import { generateQuantumFileName, getPredictedVersion } from '@/lib/namingEngine';

export default function WorkspacePage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = use(params);
  const orderId = parseInt(resolvedParams.orderId);
  const router = useRouter();
  const supabase = createClient();

  // State
  const [order, setOrder] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentType, setCommentType] = useState('general');
  const [timecode, setTimecode] = useState('');
  
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [seekToTime, setSeekToTime] = useState<number | null>(null);

  // System 16.5: Collaborative Workspace Sync
  const [isGhosting, setIsGhosting] = useState(false);
  const [ghostSliderPos, setGhostSliderPos] = useState(50);
  
  // System 19: Peer Presence
  const [presence, setPresence] = useState<any[]>([]);

  // System 55.2: Annotation Snapshots
  const [pendingAnnotation, setPendingAnnotation] = useState<string | null>(null);

  // System 60: Post-Approval Command Center
  const [justCompleted, setJustCompleted] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [supportDaysLeft, setSupportDaysLeft] = useState(7);

  // System 48: Quantum Toast System
  const [toasts, setToasts] = useState<any[]>([]);
  const addToast = (text: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    const icon = type === 'success' ? 'fa-circle-check' : type === 'info' ? 'fa-circle-info' : type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-exclamation';
    const color = type === 'success' ? '#10b981' : type === 'info' ? '#818cf8' : type === 'warning' ? '#f59e0b' : '#ef4444';
    
    setToasts(prev => [...prev, { id, text, icon, color }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Load Data
  useEffect(() => {
    const loadWorkspace = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setCurrentUser(user);

      // Fetch Order
      const { data: orderData } = await supabase
        .from('orders')
        .select('*, gig:gigs(title), client:profiles!orders_client_id_fkey(id, name, initials, cover_color), creator:profiles!orders_creator_id_fkey(id, name, initials, cover_color)')
        .eq('id', orderId)
        .single();
        
      if (!orderData) {
        setLoading(false);
        return;
      }
      setOrder(orderData);

      // Fetch Comments
      const { data: commentsData } = await supabase
        .from('workspace_comments')
        .select('*, author:profiles(id, name, initials, cover_color)')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });
      if (commentsData) setComments(commentsData);

      // Fetch Files
      const { data: filesData } = await supabase
        .from('workspace_files')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });
      if (filesData) setFiles(filesData);

      setLoading(false);
    };

    loadWorkspace();

    // Subscribe to realtime
    const channel = supabase
      .channel(`workspace_${orderId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'workspace_comments', filter: `order_id=eq.${orderId}` }, async (payload) => {
        const { data: authorData } = await supabase.from('profiles').select('id, name, initials, cover_color').eq('id', payload.new.author_id).single();
        const newComment = { ...payload.new, author: authorData };
        setComments(prev => [...prev, newComment]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` }, (payload) => {
        setOrder((prev: any) => ({ ...prev, ...payload.new }));
      })
      .on('broadcast', { event: 'sync_state' }, ({ payload }) => {
        // System 16.5 Sync Listener
        if (payload.isGhosting !== undefined) setIsGhosting(payload.isGhosting);
        if (payload.ghostSliderPos !== undefined) setGhostSliderPos(payload.ghostSliderPos);
        if (payload.deletedFileId !== undefined) {
          setFiles(prev => prev.filter(f => f.id !== payload.deletedFileId));
        }
        if (payload.restoredFile !== undefined) {
          setFiles(prev => {
            if (prev.find(f => f.id === payload.restoredFile.id)) return prev;
            return [...prev, payload.restoredFile];
          });
        }
        if (payload.selectedFileId !== undefined) {
          const file = files.find(f => f.id === payload.selectedFileId);
          if (file) setSelectedFile(file);
        }
      })
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const users = Object.values(newState).flat().map((p: any) => p.user);
        setPresence(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        // Presence updated silently
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        // Presence updated silently
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && currentUser) {
          await channel.track({
            user: {
              id: currentUser.id,
              name: currentUser.user_metadata?.full_name || 'Anonymous',
              initials: (currentUser.user_metadata?.full_name || 'A').slice(0, 2).toUpperCase(),
              color: '#818cf8'
            }
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, files]);

  const handleBroadcast = (payload: any) => {
    supabase.channel(`workspace_${orderId}`).send({
      type: 'broadcast',
      event: 'sync_state',
      payload
    });
  };

  const [recoveryStack, setRecoveryStack] = useState<any[]>([]);
  const [activeTimeouts, setActiveTimeouts] = useState<Record<number, any>>({});

  const handleDeleteFile = async (fileId: number, fileUrl: string) => {
    // System 52: Gentle Recovery Workflow
    const fileToPurge = files.find(f => f.id === fileId);
    if (!fileToPurge) return;

    // 1. Store in Recovery Stack & Optimistic UI
    setRecoveryStack(prev => [...prev, fileToPurge]);
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (selectedFile?.id === fileId) setSelectedFile(null);
    handleBroadcast({ deletedFileId: fileId });

    // 2. Setup Delayed Purge (6 seconds)
    const timeoutId = setTimeout(async () => {
      try {
        const parts = fileUrl.split('workspace_files/');
        const path = parts.length > 1 ? parts.pop() : null;
        if (path) {
          await supabase.storage.from('workspace_files').remove([decodeURIComponent(path)]);
        }
        await supabase.from('workspace_files').delete().eq('id', fileId);
        
        // Remove from recovery stack once permanently gone
        setRecoveryStack(prev => prev.filter(f => f.id !== fileId));
        setActiveTimeouts(prev => {
          const next = { ...prev };
          delete next[fileId];
          return next;
        });
      } catch (err) {
        console.error("Delayed purge failed", err);
      }
    }, 6000);

    setActiveTimeouts(prev => ({ ...prev, [fileId]: timeoutId }));

    // 3. Show Recovery Prompt
    addToast(
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span>File purged from repository</span>
        <button 
          onClick={() => handleUndoDelete(fileId)}
          style={{ 
            background: '#818cf8', color: 'white', border: 'none', 
            padding: '4px 10px', borderRadius: '4px', fontSize: '0.65rem', 
            fontWeight: 800, cursor: 'pointer', boxShadow: '0 0 10px rgba(129,140,248,0.4)' 
          }}
        >
          UNDO
        </button>
      </div> as any, 
      "info"
    );
  };

  const handleUndoDelete = (fileId: number) => {
    const recoveredFile = recoveryStack.find(f => f.id === fileId);
    if (!recoveredFile) return;

    // 1. Cancel Delayed Purge
    if (activeTimeouts[fileId]) {
      clearTimeout(activeTimeouts[fileId]);
    }

    // 2. Restore State
    setFiles(prev => [...prev, recoveredFile]);
    setRecoveryStack(prev => prev.filter(f => f.id !== fileId));
    setActiveTimeouts(prev => {
      const next = { ...prev };
      delete next[fileId];
      return next;
    });

    // 3. Broadcast Restoration
    handleBroadcast({ restoredFile: recoveredFile });
    
    addToast("Asset restored via Quantum Recovery", "success");
  };

  // Handlers
  const handlePostComment = async () => {
    if ((!commentText.trim() && !pendingAnnotation) || !currentUser) return;
    setSending(true);

    try {
      let annotationUrl = null;

      // 1. Upload Annotation if exists (System 55.2)
      if (pendingAnnotation) {
        const base64Data = pendingAnnotation.split(',')[1];
        const blob = await (await fetch(pendingAnnotation)).blob();
        const fileName = `annotation_${Date.now()}.png`;
        const { data, error: uploadError } = await supabase.storage
          .from('workspace_files') // Using same bucket for now
          .upload(`${orderId}/annotations/${fileName}`, blob);
        
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('workspace_files').getPublicUrl(data.path);
        annotationUrl = publicUrl;
      }

      // 2. Save Comment (Safe Mode: Minimalist Schema)
      const commentPayload = {
        order_id: orderId,
        author_id: currentUser.id,
        text: annotationUrl ? `${commentText}\n\n[ANNOTATION:${annotationUrl}]` : commentText,
        timecode: timecode || null
      };

      const { data, error } = await supabase.from('workspace_comments').insert(commentPayload).select().single();

      if (error) throw error;
      
      setCommentText('');
      setPendingAnnotation(null);
      addToast("Feedback intelligence synchronized", "success");
    } catch (err: any) {
      addToast("Failed to post: " + err.message, "error");
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop() || '';
    
    // System 42: Auto Naming Engine
    const nextVersion = getPredictedVersion(files);
    const quantumName = generateQuantumFileName({
      projectName: order.gig?.title || 'project',
      version: nextVersion,
      isRevision: order.status === 'revision',
      isFinal: order.status === 'completed',
      extension: fileExt
    });

    const filePath = `${orderId}/${Math.random()}_${quantumName}`;

    const { error: uploadError } = await supabase.storage.from('workspace_files').upload(filePath, file);

    if (uploadError) {
      alert('Error uploading file: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('workspace_files').getPublicUrl(filePath);

    const newFileData = {
      order_id: orderId,
      uploader_id: currentUser.id,
      file_url: publicUrl,
      file_name: quantumName,
      file_type: file.type,
      file_size: file.size,
      version: nextVersion
    };

    const { data: insertedFile, error: dbError } = await supabase.from('workspace_files').insert(newFileData).select().single();

    if (dbError) {
      alert('Failed to save file info to database: ' + dbError.message);
    } else if (insertedFile) {
      setFiles(prev => [insertedFile, ...prev]);
      setSelectedFile(insertedFile); // Auto select new file
    }

    setUploading(false);
  };

  const updateOrderStatus = async (newStatus: string) => {
    setUpdatingStatus(true);
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (!error && newStatus === 'completed') {
      setJustCompleted(true);
      setShowPortfolioModal(true);
      addToast("MISSION COMPLETE: Command Center Active", "success");
    }
    setUpdatingStatus(false);
  };

  const handleTimecodeClick = (tc: string) => {
    const parts = tc.split(':');
    if (parts.length === 2) {
      const sec = parseInt(parts[0]) * 60 + parseInt(parts[1]);
      setSeekToTime(sec);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Rendering
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#05070B' }}>
        <i className="fa-solid fa-circle-notch fa-spin fa-3x" style={{ color: 'var(--color-primary)' }}></i>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#05070B', color: 'white' }}>
        <h1>Project Not Found</h1>
        <button onClick={() => router.push('/dashboard')} className="btn btn-primary" style={{ marginTop: '20px' }}>Go to Dashboard</button>
      </div>
    );
  }

  const displayFile = selectedFile || files[0];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#05070B', color: 'white', fontFamily: 'var(--font-inter)' }}>
      
      {/* System 19: Simplified Participant Status */}
      {order && currentUser && (
        <div style={{ position: 'fixed', top: '15px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
          {(() => {
            const isClient = currentUser.id === order.client_id;
            const peerId = isClient ? order.creator_id : order.client_id;
            const peerProfile = isClient ? order.creator : order.client;
            const isOnline = presence.some(p => p.id === peerId);
            const peerRole = isClient ? 'CREATOR' : 'CLIENT';

            return (
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '10px', 
                background: 'rgba(10,13,20,0.85)', padding: '6px 14px', borderRadius: '20px', 
                border: `1px solid ${isOnline ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.05)'}`, 
                backdropFilter: 'blur(10px)', boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                transition: 'all 0.3s'
              }}>
                <div style={{ 
                  width: '8px', height: '8px', borderRadius: '50%', 
                  background: isOnline ? '#22c55e' : '#4B5563', 
                  boxShadow: isOnline ? '0 0 10px #22c55e' : 'none',
                  animation: isOnline ? 'pulse 2s infinite' : 'none'
                }}></div>
                <span style={{ fontSize: '0.65rem', fontWeight: 900, color: isOnline ? 'white' : '#6B7280', letterSpacing: '1px' }}>
                  {peerProfile?.name?.toUpperCase() || peerRole} • {isOnline ? 'ACTIVE' : 'OFFLINE'}
                </span>
              </div>
            );
          })()}
        </div>
      )}

      {/* Left Panel: Files & Progress */}
      <LeftPanel 
        order={order}
        files={files}
        selectedFile={displayFile}
        setSelectedFile={setSelectedFile}
        handleFileUpload={handleFileUpload}
        handleDeleteFile={handleDeleteFile}
        uploading={uploading}
        currentUser={currentUser}
        updateOrderStatus={updateOrderStatus}
        updatingStatus={updatingStatus}
        comments={comments}
      />

      {/* Main Canvas: Viewer & Timeline */}
      <MainCanvas 
        displayFile={displayFile}
        files={files}
        comments={comments}
        onTimeUpdate={(time) => setTimecode(formatTime(time))}
        seekToTime={seekToTime}
        addToast={addToast}
        isGhosting={isGhosting}
        setIsGhosting={setIsGhosting}
        ghostSliderPos={ghostSliderPos}
        setGhostSliderPos={setGhostSliderPos}
        onBroadcast={handleBroadcast}
        onSaveAnnotation={(dataUrl) => setPendingAnnotation(dataUrl || null)}
        isCompleted={order?.status === 'completed'}
      />

      {/* Right Panel: Smart Chat */}
      <RightPanel 
        order={order}
        comments={comments}
        currentUser={currentUser}
        timecode={timecode}
        setTimecode={setTimecode}
        commentText={commentText}
        setCommentText={setCommentText}
        commentType={commentType}
        setCommentType={setCommentType}
        handlePostComment={handlePostComment}
        onTimecodeClick={handleTimecodeClick}
        pendingAnnotation={pendingAnnotation}
        setPendingAnnotation={setPendingAnnotation}
        sending={sending}
      />

      {/* System 48: Toast Container */}
      <div style={{ position: 'fixed', bottom: '30px', right: '400px', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 10000 }}>
        {toasts.map(toast => (
          <div key={toast.id} className="animate-fade-in" style={{ 
            padding: '12px 20px', background: 'rgba(10,13,20,0.95)', border: `1px solid ${toast.color}44`, borderLeft: `4px solid ${toast.color}`, borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', color: 'white', fontSize: '0.85rem', fontWeight: 600, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' 
          }}>
            <i className={`fa-solid ${toast.icon}`} style={{ color: toast.color }}></i>
            {toast.text}
          </div>
        ))}
      </div>

      <PortfolioModal 
        isOpen={showPortfolioModal} 
        onClose={() => setShowPortfolioModal(false)} 
        creatorName={order.creator?.name || 'the Creator'} 
      />

    </div>
  );
}
