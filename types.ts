
export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

export interface BusinessProfile {
  industry: string;
  companySize: string;
  targetMarket: string;
  businessGoal: string;
}

export const INDUSTRIES = [
  'SaaS / Technology',
  'Retail / E-commerce',
  'Healthcare',
  'Finance',
  'Real Estate',
  'Manufacturing',
  'Consulting',
  'Food & Beverage',
  'Education',
  'Other'
];

export const COMPANY_SIZES = [
  'Solopreneur',
  'Small (2-10)',
  'Medium (11-50)',
  'Growth (51-200)',
  'Enterprise (200+)'
];

export const SUGGESTED_PROMPTS = [
  { label: 'SWOT Analysis', prompt: 'Perform a comprehensive SWOT analysis for my business based on my profile.' },
  { label: 'Growth Strategy', prompt: 'Give me 3 actionable strategies to increase our monthly recurring revenue (MRR).' },
  { label: 'Cost Optimization', prompt: 'Identify potential areas for cost optimization without sacrificing product quality.' },
  { label: 'Sales Pitch Review', prompt: 'Help me refine my sales pitch for my target market.' }
];
