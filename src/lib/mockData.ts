import { Tender, Bid } from './tenders';
import { GFM } from './data';

export const MOCK_DATA = {
  ...GFM,
  tenders: [
    {
      id: 't1',
      client_id: 'c1',
      client_name: 'Stellar Studios',
      title: 'Cinematic Travel Reel for Bali Tourism',
      description: 'We need a high-end 60-second travel reel. Footage is already shot in 4K 10-bit. We need professional color grading, sound design, and a viral-style edit.',
      category: 'Video Editing',
      budget_range: '$800 - $1,500',
      deadline: '2026-05-15T18:00:00Z',
      status: 'open',
      match_score: 95,
      bid_count: 14,
      tags: ['4K', 'Color Grading', 'Sound Design'],
      heat_score: 92,
      urgency_level: 'hot',
      analytics: {
        average_bid: 1150,
        price_spread: 400,
        strongest_match_id: 'b1',
        lowest_risk_bid_id: 'b2'
      }
    },
    {
      id: 't2',
      client_id: 'c2',
      client_name: 'TechFlow Corp',
      title: 'Product Launch Animation (3D)',
      description: 'Looking for a 3D artist to create a 30-second product reveal for a new mechanical keyboard. High focus on texture and lighting.',
      category: '3D Animation',
      budget_range: '$2,000 - $3,500',
      deadline: '2026-06-01T12:00:00Z',
      status: 'open',
      match_score: 72,
      bid_count: 4,
      tags: ['3D Modeling', 'Octane Render', 'C4D'],
      heat_score: 45,
      urgency_level: 'low'
    }
  ] as Tender[],
  
  bids: [
    {
      id: 'b1',
      tender_id: 't1',
      creator_id: 'cr1',
      creator_name: 'Alex Rivera',
      creator_trust_score: 98,
      amount: 1200,
      timeline: '4 days',
      proposal: 'I have edited 50+ travel reels. My color grading style perfectly matches the Bali aesthetic.',
      status: 'pending',
      delivery_confidence: 96,
      success_probability: 94,
      risk_level: 'low',
      rank_score: 98,
      expires_at: '2026-05-02T10:00:00Z',
      availability_window: 'Immediate'
    },
    {
      id: 'b2',
      tender_id: 't1',
      creator_id: 'cr2',
      creator_name: 'Sarah Chen',
      creator_trust_score: 92,
      amount: 950,
      timeline: '6 days',
      proposal: 'Excellent quality at a competitive price. I use DaVinci Resolve for all my color work.',
      status: 'pending',
      delivery_confidence: 88,
      success_probability: 90,
      risk_level: 'low',
      rank_score: 92,
      expires_at: '2026-05-03T15:00:00Z',
      availability_window: 'Starts Monday'
    }
  ] as Bid[],

  // --- OS ENGINE DATA ---
  projectEvents: [
    { id: 'e1', timestamp: '2026-04-20T10:00:00Z', type: 'decision', title: 'Visual Direction Locked', description: 'Client approved the moodboard for the Bali Reel.', actor: 'client' },
    { id: 'e2', timestamp: '2026-04-22T14:30:00Z', type: 'scope_change', title: 'Scope Expansion', description: 'Added 4K color export requirement.', actor: 'client' },
    { id: 'e3', timestamp: '2026-04-25T09:00:00Z', type: 'approval', title: 'First Draft Approved', description: 'V1 accepted with minor notes.', actor: 'client' }
  ],

  userPreferences: {
    'c1': {
      category: 'Video Production',
      likes: ['Minimalist titles', 'High-contrast grading'],
      dislikes: ['Loud SFX', 'Comic Sans'],
      styleTendency: 'Premium Cinematic',
      revisionHabit: 'low'
    }
  },

  // --- AGENCY & COLLABORATION DATA ---
  agencies: [
    { id: 'a1', name: 'Infinite Frame Agency', members: ['cr1', 'cr2'], shared_vault: 'v1' }
  ],

  sharedMemory: [
    { id: 'sm1', agency_id: 'a1', title: 'Preferred Cinematic Mood', value: 'Low-key lighting with anamorphic flares', votes: 12 },
    { id: 'sm2', agency_id: 'a1', title: 'Hook Strategy', value: 'First 2 seconds must show final result', votes: 8 }
  ]
};
