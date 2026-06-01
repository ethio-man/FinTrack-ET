import React from 'react';
import { Smartphone, MessageSquare, Building2 } from 'lucide-react';

export type PlanTier = 'free' | 'basic' | 'professional' | 'premium';

export interface BusinessProfile {
  name: string;
  logo: string | null;
  address: string;
  phone: string;
  email: string;
  tin: string;
}

export interface NotificationPrefs {
  smsAlerts: boolean;
  reminderLeadTime: number; // hours
  lowStockAlerts: boolean;
  paymentReminders: boolean;
}

export interface BillingRecord {
  id: string;
  date: string;
  plan: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  receipt: string;
}

export interface Integration {
  id: string;
  name: string;
  provider: string;
  connected: boolean;
  icon: React.ElementType;
  description: string;
}

export const PLANS: Record<PlanTier, { name: string; price: number; features: string[]; color: string }> = {
  free: {
    name: 'Free',
    price: 0,
    features: ['Up to 50 transactions/month', 'Basic reporting', '1 user', 'Email support'],
    color: '#9ca3af',
  },
  basic: {
    name: 'Basic',
    price: 499,
    features: ['Up to 500 transactions/month', 'Advanced reports', '3 users', 'Priority email support', 'Invoice templates'],
    color: '#3b82f6',
  },
  professional: {
    name: 'Professional',
    price: 1299,
    features: ['Unlimited transactions', 'Custom reports', '10 users', 'Phone & email support', 'Multi-branch', 'API access', 'Custom integrations'],
    color: '#8b5cf6',
  },
  premium: {
    name: 'Premium',
    price: 2499,
    features: ['Everything in Professional', 'Unlimited users', '24/7 dedicated support', 'White-label options', 'Advanced analytics', 'Priority feature requests'],
    color: '#f59e0b',
  },
};

export const mockBusinessProfile: BusinessProfile = {
  name: 'FinanceTrack Business',
  logo: null,
  address: 'Bole Sub-city, Addis Ababa, Ethiopia',
  phone: '+251 900 000 000',
  email: 'business@financetrack.co',
  tin: '1234567890',
};

export const mockNotificationPrefs: NotificationPrefs = {
  smsAlerts: true,
  reminderLeadTime: 24,
  lowStockAlerts: true,
  paymentReminders: true,
};

export const mockBillingHistory: BillingRecord[] = [
  { id: 'bill-1', date: '2026-05-01', plan: 'Professional', amount: 1299, status: 'paid', receipt: 'RCP-20260501-001' },
  { id: 'bill-2', date: '2026-04-01', plan: 'Professional', amount: 1299, status: 'paid', receipt: 'RCP-20260401-001' },
  { id: 'bill-3', date: '2026-03-01', plan: 'Basic', amount: 499, status: 'paid', receipt: 'RCP-20260301-001' },
];

export const mockIntegrations: Integration[] = [
  { id: 'telebirr', name: 'Telebirr', provider: 'Ethio Telecom', connected: true, icon: Smartphone, description: 'Accept mobile payments and verify transactions' },
  { id: 'sms', name: 'SMS Gateway', provider: "Africa's Talking", connected: true, icon: MessageSquare, description: 'Send SMS reminders and notifications to customers' },
  { id: 'cbe', name: 'CBE Bank', provider: 'Commercial Bank of Ethiopia', connected: false, icon: Building2, description: 'Sync transactions and verify revenue data' },
  { id: 'awash', name: 'Awash Bank', provider: 'Bank of Abyssinia', connected: false, icon: Building2, description: 'Link account for automatic reconciliation' },
];

export function fmt(n: number) { return 'ETB ' + n.toLocaleString(); }
export function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
