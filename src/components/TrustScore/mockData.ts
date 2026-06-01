import React from 'react';
import { Smartphone, Building2, Receipt, DollarSign, Award } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ScoreRating = 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';

export interface ScoreHistory {
  month: string;
  score: number;
  change: number;
}

export interface ScoreFactor {
  nameKey: string;
  impactKey: string;
  score: number;
  weight: number;
  status: 'excellent' | 'good' | 'needs-work';
}

export interface VerificationBadge {
  id: string;
  nameKey: string;
  descKey: string;
  verified: boolean;
  icon: React.ElementType;
  boost: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  transactions: number;
}

export interface ImprovementTip {
  titleKey: string;
  descKey: string;
  actionKey: string;
  icon: React.ElementType;
  boost: number;
  priority: 'high' | 'medium';
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const mockScoreHistory: ScoreHistory[] = [
  { month: 'Dec 25', score: 62, change: 0 },
  { month: 'Jan 26', score: 68, change: 6 },
  { month: 'Feb 26', score: 71, change: 3 },
  { month: 'Mar 26', score: 76, change: 5 },
  { month: 'Apr 26', score: 78, change: 2 },
  { month: 'May 26', score: 82, change: 4 },
];

export const mockFactors: ScoreFactor[] = [
  {
    nameKey: 'transactionConsistency',
    impactKey: 'transactionConsistencyImpact',
    score: 88,
    weight: 30,
    status: 'excellent',
  },
  {
    nameKey: 'revenueVolume',
    impactKey: 'revenueVolumeImpact',
    score: 82,
    weight: 25,
    status: 'excellent',
  },
  {
    nameKey: 'paymentTrackRecord',
    impactKey: 'paymentTrackRecordImpact',
    score: 75,
    weight: 20,
    status: 'good',
  },
  {
    nameKey: 'accountVerification',
    impactKey: 'accountVerificationImpact',
    score: 90,
    weight: 15,
    status: 'excellent',
  },
  {
    nameKey: 'businessAge',
    impactKey: 'businessAgeImpact',
    score: 65,
    weight: 10,
    status: 'needs-work',
  },
];

export const mockBadges: VerificationBadge[] = [
  { id: 'telebirr', nameKey: 'telebirrVerified', descKey: 'telebirrDesc', verified: true, icon: Smartphone, boost: 10 },
  { id: 'bank', nameKey: 'bankLinked', descKey: 'bankDesc', verified: true, icon: Building2, boost: 15 },
  { id: 'invoice', nameKey: 'invoiceConfirmed', descKey: 'invoiceDesc', verified: true, icon: Receipt, boost: 8 },
  { id: 'revenue', nameKey: 'revenueVerified', descKey: 'revenueDesc', verified: false, icon: DollarSign, boost: 12 },
  { id: 'identity', nameKey: 'businessIdVerified', descKey: 'businessIdDesc', verified: false, icon: Award, boost: 10 },
];

export const mockRevenueData: MonthlyRevenue[] = [
  { month: 'Dec 25', revenue: 42500, transactions: 128 },
  { month: 'Jan 26', revenue: 48200, transactions: 145 },
  { month: 'Feb 26', revenue: 51300, transactions: 156 },
  { month: 'Mar 26', revenue: 55800, transactions: 172 },
  { month: 'Apr 26', revenue: 58400, transactions: 184 },
  { month: 'May 26', revenue: 62100, transactions: 198 },
];

export const improvementTips: ImprovementTip[] = [
  {
    titleKey: 'completeBusinessVerification',
    descKey: 'completeBusinessVerificationDesc',
    actionKey: 'verifyNow',
    icon: Award,
    boost: 10,
    priority: 'high',
  },
  {
    titleKey: 'linkRevenueVerification',
    descKey: 'linkRevenueVerificationDesc',
    actionKey: 'connect',
    icon: DollarSign,
    boost: 12,
    priority: 'high',
  },
  {
    titleKey: 'issueMoreInvoices',
    descKey: 'issueMoreInvoicesDesc',
    actionKey: 'createInvoice',
    icon: Receipt,
    boost: 5,
    priority: 'medium',
  },
  {
    titleKey: 'maintainPaymentSchedule',
    descKey: 'maintainPaymentScheduleDesc',
    actionKey: 'viewDebts',
    icon: Award,
    boost: 8,
    priority: 'medium',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getRating(score: number): ScoreRating {
  if (score >= 85) return 'Excellent';
  if (score >= 75) return 'Very Good';
  if (score >= 65) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Poor';
}

export function getRatingColor(rating: ScoreRating): string {
  const map: Record<ScoreRating, string> = {
    Excellent: '#10b981',
    'Very Good': '#22c55e',
    Good: '#84cc16',
    Fair: '#f59e0b',
    Poor: '#ef4444',
  };
  return map[rating];
}

export function fmt(n: number) {
  return 'ETB ' + n.toLocaleString();
}

export function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export const TODAY = '2026-05-31';
