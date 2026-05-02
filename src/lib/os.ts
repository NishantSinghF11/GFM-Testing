/**
 * GFM Advanced AI-Native Operating Systems (OS)
 * Core Logic & Data Models
 */

// --- SHARED TYPES ---

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface OSMetric {
  score: number; // 0-100
  trend: 'up' | 'down' | 'stable';
  label: string;
}

// --- SYSTEM 1: Creative OS Replay ---
export interface ProjectEvent {
  id: string;
  timestamp: string;
  type: 'decision' | 'scope_change' | 'approval' | 'feedback' | 'milestone';
  title: string;
  description: string;
  actor: 'client' | 'creator' | 'ai';
  metadata?: any;
}

// --- SYSTEM 2: Direction Drift Detector ---
export interface DriftScore {
  overall: number;
  factors: {
    visual: number;
    tone: number;
    pacing: number;
    style: number;
  };
  lastCheck: string;
}

// --- SYSTEM 3: Creative Memory Layer ---
export interface UserPreference {
  category: string;
  likes: string[];
  dislikes: string[];
  styleTendency: string; // e.g., "minimalist", "high-energy"
  revisionHabit: 'high' | 'low' | 'medium';
}

// --- SYSTEM 4: Approval Prediction Engine ---
export interface ApprovalPrediction {
  likelihood: number; // 0-100
  confidence: number;
  reasons: string[];
  risks: string[];
}

// --- SYSTEM 5: Scope Creep Firewall ---
export interface ScopeVariance {
  variancePercent: number;
  offendingElements: string[];
  suggestedAction: 'clarify' | 'add-on' | 'defer';
}

// --- SYSTEM 6: Negotiation Simulator ---
export interface NegotiationScenario {
  input: {
    price: number;
    timeline: number;
    scope: string[];
  };
  output: {
    winProbability: number;
    clientSatisfaction: number;
    creatorMargin: number;
  };
}

// --- SYSTEM 7: Brand Lock System ---
export interface BrandRules {
  colors: string[];
  typography: string[];
  toneVoice: string;
  visualMoat: string[]; // Forbidden styles
}

// --- SYSTEM 8: Creative Benchmark Engine ---
export interface BenchmarkScore {
  percentile: number;
  categoryRank: number;
  marketAlignment: number;
  potentialROI: number;
}

// --- SYSTEM 11: Creator Capacity Engine ---
export interface WorkloadHealth {
  saturation: number; // 0-100
  pressureIndex: number;
  qualityRisk: boolean;
  activeDeadlines: number;
}

// --- SYSTEM 15: Trust Ledger ---
export interface TrustEvent {
  id: string;
  date: string;
  type: 'delivery' | 'dispute' | 'payment' | 'revision';
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

// --- SYSTEM 16: GFM Talent Scout ---
export interface TalentScoutAlert {
  id: string;
  creatorId: string;
  creatorName: string;
  reason: string;
  outcomeMatch: string;
  confidence: number;
}

// --- SYSTEM 17: Ghost Project Manager ---
export interface GhostPMStatus {
  activeNudges: number;
  vaultOrganization: 'optimized' | 'pending';
  chatSummary: string;
  nextSmartStep: string;
}

// --- SYSTEM 18: Visual Vibe Matcher ---
export interface VibeSearch {
  visualTone: string;
  pacingStyle: string;
  colorMood: string;
  matches: string[]; // Creator IDs
}

// --- SYSTEM 19: Simulated Audience A/B Testing ---
export interface AudienceSimulation {
  variationId: string;
  retentionLikelihood: number;
  ctrPotential: number;
  audienceSentiment: 'positive' | 'neutral' | 'polarized';
}

// --- SYSTEM 20: Alpha Aesthetic Radar ---
export interface AlphaTrend {
  aesthetic: string;
  demandGrowth: number;
  supplyShortage: boolean;
  earlyAdopterValue: number; // 0-100
}

// --- OS ENGINE LOGIC (Expanded) ---

export const GFM_OS = {
  // Calculate Drift
  calculateDrift: (current: any, brief: any): DriftScore => ({
    overall: 12,
    factors: { visual: 8, tone: 15, pacing: 10, style: 15 },
    lastCheck: new Date().toISOString()
  }),

  // Predict Approval
  predictApproval: (draftId: string): ApprovalPrediction => ({
    likelihood: 81,
    confidence: 92,
    reasons: ['Matches brand colors', 'Timeline aligned', 'Previous feedback incorporated'],
    risks: ['Pacing is slightly faster than brief']
  }),

  // Detect Scope Creep
  detectScopeCreep: (request: string, scope: string[]): ScopeVariance => ({
    variancePercent: 22,
    offendingElements: ['Extra 15sec of animation'],
    suggestedAction: 'add-on'
  }),

  // Simulate Negotiation
  simulateNegotiation: (scenario: any): NegotiationScenario['output'] => ({
    winProbability: 74,
    clientSatisfaction: 85,
    creatorMargin: 65
  }),
  
  // Scout Talent
  scoutTalent: (): TalentScoutAlert => ({
    id: 'sc-1',
    creatorId: 'cr1',
    creatorName: 'Alex Rivera',
    reason: 'Matches high-retention requirement for Bali project.',
    outcomeMatch: '+32% Avg CTR',
    confidence: 94
  }),

  // Simulate Audience
  simulateAudience: (variationId: string): AudienceSimulation => ({
    variationId,
    retentionLikelihood: 84,
    ctrPotential: 92,
    audienceSentiment: 'positive'
  })
};
