export interface Tender {
  id: string;
  client_id: string;
  client_name: string;
  title: string;
  description: string;
  category: string;
  budget_range: string;
  deadline: string; // ISO Date
  status: 'open' | 'shortlisting' | 'interviewing' | 'closed' | 'in_progress';
  match_score?: number;
  bid_count: number;
  tags: string[];
  
  // ADVANCED INTELLIGENCE
  heat_score: number; // 0-100
  urgency_level: 'hot' | 'competitive' | 'low';
  analytics?: {
    average_bid: number;
    price_spread: number;
    strongest_match_id: string;
    lowest_risk_bid_id: string;
  };
}

export interface Bid {
  id: string;
  tender_id: string;
  creator_id: string;
  creator_name: string;
  creator_avatar?: string;
  creator_trust_score: number; // 0-100
  amount: number;
  timeline: string;
  proposal: string;
  status: 'pending' | 'shortlisted' | 'accepted' | 'rejected';
  
  // BID INTELLIGENCE
  delivery_confidence: number; // 0-100%
  success_probability: number; // 0-100%
  risk_level: 'low' | 'medium' | 'high';
  rank_score: number; // Calculated by AI
  
  // COMMITMENT SIGNALS
  expires_at: string;
  availability_window: string;
}

export const mockTenders: Tender[] = [
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
];

export const mockBids: Bid[] = [
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
  },
  {
    id: 'b3',
    tender_id: 't1',
    creator_id: 'cr3',
    creator_name: 'Jordan Smith',
    creator_trust_score: 75,
    amount: 1500,
    timeline: '3 days',
    proposal: 'Super fast delivery. I can have the first draft ready in 24 hours.',
    status: 'pending',
    delivery_confidence: 70,
    success_probability: 65,
    risk_level: 'medium',
    rank_score: 78,
    expires_at: '2026-05-02T08:00:00Z',
    availability_window: 'Fully available'
  }
];
