"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import OfferCountdown from '@/components/ui/OfferCountdown';
import CheckoutPreview from '@/components/ui/CheckoutPreview';

import CreatorDashboard from '@/components/messaging/CreatorDashboard';
import ClientDashboard from '@/components/messaging/ClientDashboard';
import GfmVault from '@/components/messaging/GfmVault';
import { Message, Conversation } from '@/components/messaging/types';

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Advanced State 
  const [pipelineStage, setPipelineStage] = useState<'inquiry' | 'negotiation' | 'offer' | 'accepted'>('negotiation');
  const [clientActivity, setClientActivity] = useState<string>('typing...');
  const [dealConfidence, setDealConfidence] = useState(60);
  
  // Interactive Composer States
  const [showOfferComposer, setShowOfferComposer] = useState(false);
  const [offerPrice, setOfferPrice] = useState('$500');
  const [offerTimeline, setOfferTimeline] = useState('3 Days');
  const [offerDeliverables, setOfferDeliverables] = useState('2 Cinematic Reels');
  const [offerRevisions, setOfferRevisions] = useState('2');
  const [showComparison, setShowComparison] = useState(false);
  const [showAIReasoning, setShowAIReasoning] = useState(false);
  const [activeVariant, setActiveVariant] = useState<'custom' | 'economy' | 'recommended' | 'express'>('custom');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCheckoutPreview, setShowCheckoutPreview] = useState(false);
  const [selectedOfferForCheckout, setSelectedOfferForCheckout] = useState<any>(null);
  const [currentUserRole, setCurrentUserRole] = useState<'client' | 'creator'>('creator');
  const [showVault, setShowVault] = useState(false);
  
  // Micro-feedback Toasts
  const [toasts, setToasts] = useState<{id: number, text: string, icon: string}[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const addToast = (text: string, icon: string = 'fa-check-circle') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, text, icon }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  useEffect(() => {
    if (messages.some(m => m.type === 'smart_offer' && m.meta?.status !== 'accepted')) {
      setPipelineStage('offer');
    } else {
      setPipelineStage('negotiation');
    }
    const activities = ['Online', 'Typing...', 'Comparing offers...', 'Viewed your profile'];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % activities.length;
      setClientActivity(activities[i]);
    }, 6000);
    return () => clearInterval(interval);
  }, [messages, activeConversation]);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setCurrentUser(user);

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (profile?.role) setCurrentUserRole(profile.role as any);

      const { data: msgs } = await supabase
        .from('messages')
        .select('*, sender:profiles!messages_sender_id_fkey(id, name, initials, cover_color), receiver:profiles!messages_receiver_id_fkey(id, name, initials, cover_color)')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (msgs) {
        const convMap = new Map<string, Conversation>();
        msgs.forEach((msg: any, idx: number) => {
          const isMe = msg.sender_id === user.id;
          const otherProfile = isMe ? msg.receiver : msg.sender;
          if (!otherProfile) return;
          const key = otherProfile.id;
          if (!convMap.has(key)) {
            convMap.set(key, {
              user_id: otherProfile.id,
              name: otherProfile.name ?? 'User',
              initials: otherProfile.initials ?? '??',
              cover_color: otherProfile.cover_color ?? '#6366f1',
              last_message: msg.content,
              last_time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              unread: (!isMe && !msg.is_read) ? 1 : 0,
              heat: idx % 3 === 0 ? 'hot' : 'cold',
              tags: idx % 2 === 0 ? ['High Value'] : ['Negotiation'],
              emotion: idx % 3 === 0 ? 'positive' : 'neutral'
            });
          }
        });
        const convList = Array.from(convMap.values());
        setConversations(convList);
        const targetId = searchParams.get('with');
        const target = targetId ? convList.find(c => c.user_id === targetId) : convList[0];
        if (target) setActiveConversation(target);
      }
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!activeConversation || !currentUser) return;
    
    // Initial fetch
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${activeConversation.user_id}),and(sender_id.eq.${activeConversation.user_id},receiver_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: true });

      const processed = (data || []).map(m => {
        if (m.content && (m.content.includes('smart_offer') || m.content.includes('"type":"smart_offer"'))) {
          try {
            const str = m.content.substring(m.content.indexOf('{'), m.content.lastIndexOf('}') + 1);
            const parsed = JSON.parse(str);
            return { ...m, type: 'smart_offer', meta: parsed.meta, content: '' };
          } catch(e) {}
        }
        return { ...m, type: 'text' };
      });
      setMessages(processed as Message[]);
    };
    fetchMessages();

    // Real-time subscription
    const channel = supabase.channel(`room-${activeConversation.user_id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `or(receiver_id.eq.${currentUser.id},sender_id.eq.${currentUser.id})`
      }, async (payload) => {
        const msg = payload.new;
        if (
          (msg.sender_id === currentUser.id && msg.receiver_id === activeConversation.user_id) ||
          (msg.sender_id === activeConversation.user_id && msg.receiver_id === currentUser.id)
        ) {
          let processed: Message = { ...msg, type: 'text' } as Message;
          if (msg.content && (msg.content.includes('smart_offer') || msg.content.includes('"type":"smart_offer"'))) {
            try {
              const str = msg.content.substring(msg.content.indexOf('{'), msg.content.lastIndexOf('}') + 1);
              const parsed = JSON.parse(str);
              processed = { ...msg, type: 'smart_offer', meta: parsed.meta, content: '' } as Message;
            } catch(e) {}
          }
          setMessages(prev => {
            if (prev.some(m => m.id === msg.id)) return prev;
            return [...prev, processed as Message];
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversation, currentUser]);

  const sendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const text = customText || newMessage;
    if (!text.trim() || !activeConversation || !currentUser) return;
    
    setNewMessage(''); // Clear input immediately for UX
    
    const { data } = await supabase.from('messages').insert({
      sender_id: currentUser.id, receiver_id: activeConversation.user_id, content: text
    }).select().single();
    
    if (data) {
      setMessages(prev => {
        if (prev.some(m => m.id === data.id)) return prev;
        return [...prev, { ...data, type: 'text' } as Message];
      });
    }
  };

  const handleSendSmartOffer = async () => {
    if (!activeConversation || !currentUser) return;
    const meta = { price: offerPrice, timeline: offerTimeline, title: offerDeliverables, revisions: offerRevisions, status: 'pending', expires_at: new Date(Date.now() + 86400000).toISOString() };
    const content = JSON.stringify({ type: 'smart_offer', meta });
    const { data } = await supabase.from('messages').insert({
      sender_id: currentUser.id, receiver_id: activeConversation.user_id, content
    }).select().single();
    if (data) {
      setMessages(prev => {
        if (prev.some(m => m.id === data.id)) return prev;
        return [...prev, { ...data, type: 'smart_offer', meta, content: '' } as Message];
      });
      setShowOfferComposer(false);
      addToast('Offer Sent Successfully');
    }
  };

  const handleVariantChange = (v: any) => {
    setActiveVariant(v);
    if (v === 'economy') { setOfferPrice('$400'); setOfferTimeline('7 Days'); }
    else if (v === 'recommended') { setOfferPrice('$500'); setOfferTimeline('3 Days'); }
    else if (v === 'express') { setOfferPrice('$750'); setOfferTimeline('24 Hours'); }
  };

  const handleGenerateAIVariants = () => {
    setIsGenerating(true);
    setTimeout(() => { setIsGenerating(false); handleVariantChange('recommended'); }, 1000);
  };

  const dashboardProps = {
    currentUser, conversations, activeConversation, setActiveConversation,
    messages, setMessages, newMessage, setNewMessage, sendMessage, handleSendSmartOffer,
    pipelineStage, setPipelineStage, clientActivity, setClientActivity,
    dealConfidence, setDealConfidence, showOfferComposer, setShowOfferComposer,
    offerPrice, setOfferPrice, offerTimeline, setOfferTimeline,
    offerDeliverables, setOfferDeliverables, offerRevisions, setOfferRevisions,
    toasts, addToast, handleVariantChange, handleGenerateAIVariants,
    isGenerating, activeVariant, showComparison, setShowComparison,
    showAIReasoning, setShowAIReasoning, showCheckoutPreview, setShowCheckoutPreview,
    setSelectedOfferForCheckout, showVault, setShowVault
  };

  if (loading) return <div style={{ minHeight: '100vh', background: '#05070B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-solid fa-circle-notch fa-spin fa-2x" style={{ color: '#6366f1' }}></i></div>;

  return (
    <>
      {currentUserRole === 'creator' ? (
        <CreatorDashboard {...dashboardProps} />
      ) : (
        <ClientDashboard {...dashboardProps} />
      )}
      
      {showCheckoutPreview && selectedOfferForCheckout && (
        <CheckoutPreview 
          isOpen={showCheckoutPreview}
          offer={selectedOfferForCheckout} 
          onClose={() => setShowCheckoutPreview(false)} 
          onConfirm={() => {
            setShowCheckoutPreview(false);
            router.push(`/checkout?gig=1&package=standard&amount=${selectedOfferForCheckout?.price.replace('$', '')}`);
          }}
        />
      )}

      <GfmVault 
        isOpen={showVault} 
        onClose={() => setShowVault(false)} 
        currentUser={currentUser} 
        addToast={addToast}
      />
    </>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
