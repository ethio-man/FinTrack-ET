import React from 'react';
import { Edit2, Send, CheckCircle, AlertTriangle } from 'lucide-react';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface InvoiceLine {
  id: string;
  product: string;
  description: string;
  qty: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  number: string;
  customer: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  date: string;
  dueDate: string;
  paymentTerms: string;
  status: InvoiceStatus;
  items: InvoiceLine[];
  discountPct: number;
  vatEnabled: boolean;
  vatPct: number;
  notes: string;
  terms: string;
}

export const STATUS_META: Record<InvoiceStatus, { label: string; bg: string; text: string; accent: string; icon: React.ElementType; hex: string }> = {
  draft:   { label: 'Draft',   bg: 'bg-gray-500/10',   text: 'text-gray-600 dark:text-gray-400',   accent: 'bg-gray-400',   icon: Edit2,         hex: '#9ca3af' },
  sent:    { label: 'Sent',    bg: 'bg-blue-500/10',   text: 'text-blue-600 dark:text-blue-400',   accent: 'bg-blue-500',   icon: Send,          hex: '#3b82f6' },
  paid:    { label: 'Paid',    bg: 'bg-green-500/10',  text: 'text-green-600 dark:text-green-400',  accent: 'bg-green-500',  icon: CheckCircle,   hex: '#10b981' },
  overdue: { label: 'Overdue', bg: 'bg-red-500/10',    text: 'text-red-600 dark:text-red-400',    accent: 'bg-red-500',    icon: AlertTriangle, hex: '#ef4444' },
};

export const PAYMENT_TERMS = ['Due on receipt', 'Net 7', 'Net 15', 'Net 30', 'Net 60', 'Custom date'];

export const CONTACTS = [
  { name: 'James Dorgan',    phone: '+251 911 234 567', email: 'james@dorgan.co', address: 'Bole, Addis Ababa' },
  { name: 'Savannah Nguyen', phone: '+251 911 345 678', email: 'savannah@nguyen.co', address: 'Piassa, Addis Ababa' },
  { name: 'Dianne Russell',  phone: '+251 911 456 789', email: 'dianne@russell.co', address: 'Kazanchis, Addis Ababa' },
  { name: 'Annette Black',   phone: '+251 911 567 890', email: 'annette@black.co', address: 'Megenagna, Addis Ababa' },
  { name: 'Jane Cooper',     phone: '+251 911 678 901', email: 'jane@cooper.co', address: 'CMC, Addis Ababa' },
  { name: 'Robert Fox',      phone: '+251 911 789 012', email: 'robert@fox.co', address: 'Sarbet, Addis Ababa' },
];

export const PRODUCTS = [
  { name: 'Premium Coffee Beans', price: 450 },
  { name: 'Office Chair Deluxe',  price: 1200 },
  { name: 'Wireless Mouse',       price: 320 },
  { name: 'Laptop Stand',         price: 850 },
  { name: 'Desk Organizer',       price: 450 },
  { name: 'USB-C Cable 2m',       price: 180 },
  { name: 'Notebook A5',          price: 120 },
  { name: 'Ceramic Mug Set',      price: 250 },
];

export const TODAY = '2026-05-31';

export const mockInvoices: Invoice[] = [
  {
    id: 'iv1', number: 'INV-1001', customer: 'James Dorgan',
    customerPhone: '+251 911 234 567', customerEmail: 'james@dorgan.co', customerAddress: 'Bole, Addis Ababa',
    date: '2026-05-01', dueDate: '2026-05-31', paymentTerms: 'Net 30', status: 'paid',
    items: [
      { id: 'l1', product: 'Premium Coffee Beans', description: 'Monthly supply — 10 kg', qty: 10, unitPrice: 450 },
      { id: 'l2', product: 'Ceramic Mug Set',      description: 'Branded mugs x4',        qty: 4,  unitPrice: 250 },
    ],
    discountPct: 5, vatEnabled: true, vatPct: 15,
    notes: 'Thank you for your continued business.',
    terms: 'Payment is due within 30 days of invoice date.',
  },
  {
    id: 'iv2', number: 'INV-1002', customer: 'Savannah Nguyen',
    customerPhone: '+251 911 345 678', customerEmail: 'savannah@nguyen.co', customerAddress: 'Piassa, Addis Ababa',
    date: '2026-05-10', dueDate: '2026-06-10', paymentTerms: 'Net 30', status: 'sent',
    items: [
      { id: 'l1', product: 'Office Chair Deluxe', description: 'Executive ergonomic chair', qty: 3, unitPrice: 1200 },
      { id: 'l2', product: 'Desk Organizer',       description: 'Desktop organizer set',     qty: 3, unitPrice: 450  },
    ],
    discountPct: 0, vatEnabled: true, vatPct: 15,
    notes: 'Delivery included. Installation service available on request.',
    terms: 'Payment due within 30 days. Bank transfer preferred.',
  },
  {
    id: 'iv3', number: 'INV-1003', customer: 'Dianne Russell',
    customerPhone: '+251 911 456 789', customerEmail: 'dianne@russell.co', customerAddress: 'Kazanchis, Addis Ababa',
    date: '2026-04-15', dueDate: '2026-05-15', paymentTerms: 'Net 30', status: 'overdue',
    items: [
      { id: 'l1', product: 'Laptop Stand', description: 'Adjustable aluminium stand', qty: 2, unitPrice: 850 },
      { id: 'l2', product: 'Wireless Mouse', description: 'Ergonomic wireless mouse', qty: 2, unitPrice: 320 },
    ],
    discountPct: 10, vatEnabled: false, vatPct: 15,
    notes: 'Please settle this invoice at your earliest convenience.',
    terms: 'Late payment may incur a 2% monthly fee.',
  },
  {
    id: 'iv4', number: 'INV-1004', customer: 'Annette Black',
    customerPhone: '+251 911 567 890', customerEmail: 'annette@black.co', customerAddress: 'Megenagna, Addis Ababa',
    date: '2026-05-20', dueDate: '2026-06-20', paymentTerms: 'Net 30', status: 'draft',
    items: [
      { id: 'l1', product: 'USB-C Cable 2m', description: 'High-speed charging cable', qty: 20, unitPrice: 180 },
      { id: 'l2', product: 'Notebook A5',    description: 'Hardcover notebook',         qty: 20, unitPrice: 120 },
    ],
    discountPct: 0, vatEnabled: true, vatPct: 15,
    notes: '',
    terms: 'Payment is due within 30 days of invoice date.',
  },
  {
    id: 'iv5', number: 'INV-1005', customer: 'Jane Cooper',
    customerPhone: '+251 911 678 901', customerEmail: 'jane@cooper.co', customerAddress: 'CMC, Addis Ababa',
    date: '2026-05-05', dueDate: '2026-05-20', paymentTerms: 'Net 15', status: 'paid',
    items: [
      { id: 'l1', product: 'Desk Organizer', description: 'Office desk organizer', qty: 5, unitPrice: 450 },
    ],
    discountPct: 0, vatEnabled: true, vatPct: 15,
    notes: 'Thank you!',
    terms: 'Payment is due within 15 days.',
  },
  {
    id: 'iv6', number: 'INV-1006', customer: 'Robert Fox',
    customerPhone: '+251 911 789 012', customerEmail: 'robert@fox.co', customerAddress: 'Sarbet, Addis Ababa',
    date: '2026-05-28', dueDate: '2026-06-28', paymentTerms: 'Net 30', status: 'sent',
    items: [
      { id: 'l1', product: 'Wireless Mouse',       description: 'Wireless ergonomic mouse', qty: 5,  unitPrice: 320 },
      { id: 'l2', product: 'USB-C Cable 2m',       description: 'Charging cable bundle',    qty: 10, unitPrice: 180 },
      { id: 'l3', product: 'Premium Coffee Beans', description: 'Premium blend',            qty: 5,  unitPrice: 450 },
    ],
    discountPct: 5, vatEnabled: true, vatPct: 15,
    notes: 'Bundle pricing applied.',
    terms: 'Payment due within 30 days.',
  },
];

export function calcInvoice(inv: Pick<Invoice, 'items' | 'discountPct' | 'vatEnabled' | 'vatPct'>) {
  const subtotal = inv.items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
  const discountAmount = subtotal * (inv.discountPct / 100);
  const afterDiscount = subtotal - discountAmount;
  const vatAmount = inv.vatEnabled ? afterDiscount * (inv.vatPct / 100) : 0;
  const total = afterDiscount + vatAmount;
  return { subtotal, discountAmount, afterDiscount, vatAmount, total };
}

export function fmt(n: number) { return 'ETB ' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
export function fmtDate(d: string) {
  if (!d) return '—';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
export function initials(name: string) { return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase(); }

export function dueDateFromTerms(terms: string, fromDate: string): string {
  const base = new Date(fromDate + 'T00:00:00');
  const days = terms === 'Net 7' ? 7 : terms === 'Net 15' ? 15 : terms === 'Net 30' ? 30 : terms === 'Net 60' ? 60 : 0;
  if (!days) return fromDate;
  base.setDate(base.getDate() + days);
  return base.toISOString().split('T')[0];
}
