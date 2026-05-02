import React from 'react';

export interface SmartOfferMeta {
  title: string;
  price: string;
  timeline: string;
  revisions: string;
  status: 'pending' | 'accepted' | 'declined' | 'withdrawn';
  expires_at?: string;
  icon?: string;
}

export interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  type?: 'text' | 'system_timeline' | 'ai_nudge' | 'smart_offer'; 
  meta?: SmartOfferMeta; 
}

export interface Conversation {
  user_id: string;
  name: string;
  initials: string;
  cover_color: string;
  last_message: string;
  last_time: string;
  unread: number;
  heat: 'hot' | 'warm' | 'cold';
  tags: string[];
  emotion: 'positive' | 'neutral' | 'frustrated';
}

export interface CurrentUser {
  id: string;
  email?: string;
  name?: string;
  initials?: string;
  full_name?: string;
  avatar_url?: string;
  role?: 'client' | 'creator';
}

export interface VaultItem {
  id: string;
  name: string;
  size: string;
  type: string;
  status: 'draft' | 'review' | 'approved';
  uploaded_at: string;
  version: number;
}

export interface Milestone {
  id: string;
  title: string;
  amount: string;
  status: 'pending' | 'funded' | 'released';
  due_date: string;
}

export interface DashboardProps {
  currentUser: CurrentUser;
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (conv: Conversation) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (e?: React.FormEvent, customText?: string) => Promise<void>;
  handleSendSmartOffer: () => Promise<void>;
  pipelineStage: 'inquiry' | 'negotiation' | 'offer' | 'accepted';
  setPipelineStage: (stage: 'inquiry' | 'negotiation' | 'offer' | 'accepted') => void;
  clientActivity: string;
  setClientActivity: (activity: string) => void;
  dealConfidence: number;
  setDealConfidence: (val: number) => void;
  showOfferComposer: boolean;
  setShowOfferComposer: (val: boolean) => void;
  offerPrice: string;
  setOfferPrice: (val: string) => void;
  offerTimeline: string;
  setOfferTimeline: (val: string) => void;
  offerDeliverables: string;
  setOfferDeliverables: (val: string) => void;
  offerRevisions: string;
  setOfferRevisions: (val: string) => void;
  toasts: {id: number, text: string, icon: string}[];
  addToast: (text: string, icon?: string) => void;
  handleVariantChange: (v: 'custom' | 'economy' | 'recommended' | 'express') => void;
  handleGenerateAIVariants: () => void;
  isGenerating: boolean;
  activeVariant: 'custom' | 'economy' | 'recommended' | 'express';
  showComparison: boolean;
  setShowComparison: (val: boolean) => void;
  showAIReasoning: boolean;
  setShowAIReasoning: (val: boolean) => void;
  showCheckoutPreview: boolean;
  setShowCheckoutPreview: (val: boolean) => void;
  setSelectedOfferForCheckout: (offer: SmartOfferMeta | null) => void;
  // Vault Props
  showVault: boolean;
  setShowVault: (val: boolean) => void;
}
