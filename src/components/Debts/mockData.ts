import React from 'react';
import { Wallet, Smartphone, Building2 } from 'lucide-react';

export interface Payment {
  id: string;
  date: string;
  amount: number;
  method: 'cash' | 'telebirr' | 'bank';
  note: string;
}

export interface SmsEntry {
  id: string;
  date: string;
  time: string;
  message: string;
  status: 'delivered' | 'sent' | 'failed';
}

export interface Debt {
  id: string;
  type: 'receivable' | 'payable';
  contactName: string;
  contactPhone: string;
  contactAvatar: string;
  amount: number;
  amountPaid: number;
  dueDate: string;
  createdDate: string;
  description: string;
  paymentHistory: Payment[];
  smsLog: SmsEntry[];
}

export const TODAY = '2026-05-31';

export function isOverdue(d: Debt) {
  return d.dueDate < TODAY && d.amountPaid < d.amount;
}
export function isSettled(d: Debt) {
  return d.amountPaid >= d.amount;
}
export function balance(d: Debt) {
  return Math.max(0, d.amount - d.amountPaid);
}

export const mockDebts: Debt[] = [
  {
    id: 'DBT-001',
    type: 'receivable',
    contactName: 'James Dorgan',
    contactPhone: '+251 911 234 567',
    contactAvatar: 'JD',
    amount: 11234,
    amountPaid: 3000,
    dueDate: '2026-05-15',
    createdDate: '2026-04-01',
    description: 'Outstanding payment for office supplies delivery — Invoice #1201',
    paymentHistory: [
      { id: 'p1', date: '2026-04-20', amount: 2000, method: 'telebirr', note: 'First partial payment' },
      { id: 'p2', date: '2026-05-05', amount: 1000, method: 'cash',     note: 'Second instalment' },
    ],
    smsLog: [
      { id: 's1', date: '2026-05-16', time: '9:00 AM',  message: 'Dear James, your balance of ETB 8,234 was due May 15. Please settle at your earliest. FinanceTrack', status: 'delivered' },
      { id: 's2', date: '2026-05-23', time: '10:30 AM', message: 'Reminder: ETB 8,234 still outstanding on invoice #1201. Contact us to arrange payment. FinanceTrack', status: 'delivered' },
    ],
  },
  {
    id: 'DBT-002',
    type: 'receivable',
    contactName: 'Savannah Nguyen',
    contactPhone: '+251 911 345 678',
    contactAvatar: 'SN',
    amount: 8500,
    amountPaid: 0,
    dueDate: '2026-06-15',
    createdDate: '2026-05-01',
    description: 'Service contract payment — web design project phase 2',
    paymentHistory: [],
    smsLog: [],
  },
  {
    id: 'DBT-003',
    type: 'receivable',
    contactName: 'Jane Cooper',
    contactPhone: '+251 911 456 789',
    contactAvatar: 'JC',
    amount: 5800,
    amountPaid: 5800,
    dueDate: '2026-05-20',
    createdDate: '2026-03-15',
    description: 'Product sale — ceramic furniture set, Invoice #1185',
    paymentHistory: [
      { id: 'p1', date: '2026-04-01', amount: 3000, method: 'bank',     note: 'Bank transfer partial' },
      { id: 'p2', date: '2026-05-18', amount: 2800, method: 'telebirr', note: 'Final settlement' },
    ],
    smsLog: [
      { id: 's1', date: '2026-04-25', time: '11:00 AM', message: 'Hi Jane, your balance of ETB 2,800 is due May 20. FinanceTrack', status: 'delivered' },
    ],
  },
  {
    id: 'DBT-004',
    type: 'receivable',
    contactName: 'Robert Fox',
    contactPhone: '+251 911 567 890',
    contactAvatar: 'RF',
    amount: 3200,
    amountPaid: 0,
    dueDate: '2026-06-30',
    createdDate: '2026-05-20',
    description: 'Equipment rental deposit — 3 months advance',
    paymentHistory: [],
    smsLog: [],
  },
  {
    id: 'DBT-005',
    type: 'receivable',
    contactName: 'Annette Black',
    contactPhone: '+251 911 678 901',
    contactAvatar: 'AB',
    amount: 15000,
    amountPaid: 4500,
    dueDate: '2026-05-10',
    createdDate: '2026-03-01',
    description: 'Bulk merchandise purchase on credit — electronics batch',
    paymentHistory: [
      { id: 'p1', date: '2026-03-30', amount: 4500, method: 'cash', note: 'Down payment' },
    ],
    smsLog: [
      { id: 's1', date: '2026-05-11', time: '8:30 AM',  message: 'Dear Annette, ETB 10,500 is overdue since May 10. Please contact us immediately. FinanceTrack', status: 'delivered' },
      { id: 's2', date: '2026-05-18', time: '9:00 AM',  message: 'Final notice: ETB 10,500 outstanding. Legal action may be initiated. FinanceTrack', status: 'delivered' },
      { id: 's3', date: '2026-05-25', time: '10:00 AM', message: 'Reminder: ETB 10,500 still unpaid. Please call us to discuss repayment. FinanceTrack', status: 'sent' },
    ],
  },
  {
    id: 'DBT-006',
    type: 'payable',
    contactName: 'ABC Supplies Co.',
    contactPhone: '+251 922 111 222',
    contactAvatar: 'AS',
    amount: 22000,
    amountPaid: 10000,
    dueDate: '2026-06-05',
    createdDate: '2026-05-01',
    description: 'Raw materials — monthly stock replenishment order',
    paymentHistory: [
      { id: 'p1', date: '2026-05-15', amount: 10000, method: 'bank', note: 'Partial advance payment' },
    ],
    smsLog: [],
  },
  {
    id: 'DBT-007',
    type: 'payable',
    contactName: 'Fresh Goods Ltd',
    contactPhone: '+251 922 333 444',
    contactAvatar: 'FG',
    amount: 8900,
    amountPaid: 0,
    dueDate: '2026-05-28',
    createdDate: '2026-05-10',
    description: 'Perishable goods supply — weekly standing order',
    paymentHistory: [],
    smsLog: [],
  },
  {
    id: 'DBT-008',
    type: 'payable',
    contactName: 'Tech Solutions Inc.',
    contactPhone: '+251 922 555 666',
    contactAvatar: 'TS',
    amount: 4500,
    amountPaid: 0,
    dueDate: '2026-07-01',
    createdDate: '2026-05-25',
    description: 'Annual software licence renewal — accounting suite',
    paymentHistory: [],
    smsLog: [],
  },
];

export function fmt(n: number) {
  return 'ETB ' + n.toLocaleString();
}

export function daysUntil(dateStr: string) {
  const d = new Date(dateStr).getTime() - new Date(TODAY).getTime();
  return Math.round(d / 86400000);
}

export function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export const METHOD_ICONS: Record<string, React.ElementType> = {
  cash: Wallet, telebirr: Smartphone, bank: Building2,
};
