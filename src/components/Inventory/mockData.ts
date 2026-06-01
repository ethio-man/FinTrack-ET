export type StockEventType = 'addition' | 'sale' | 'adjustment' | 'return';

export interface StockEvent {
  id: string;
  date: string;
  type: StockEventType;
  qty: number;
  note: string;
  balanceAfter: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: Category;
  unit: string;
  buyingPrice: number;
  sellingPrice: number;
  stock: number;
  reorderLevel: number;
  status: 'active' | 'inactive';
  unitsSoldThisMonth: number;
  stockHistory: StockEvent[];
  weeklySales: { week: string; units: number; revenue: number }[];
}

export type Category = 'Beverages' | 'Electronics' | 'Furniture' | 'Office Supplies' | 'Stationery' | 'Health & Safety' | 'Kitchen';

export const mockProducts: Product[] = [
  {
    id: 'PRD-001', name: 'Premium Coffee Beans', sku: 'BEV-CB-001', category: 'Beverages',
    unit: 'kg', buyingPrice: 280, sellingPrice: 450, stock: 12, reorderLevel: 50,
    status: 'active', unitsSoldThisMonth: 148,
    stockHistory: [
      { id: 'sh1', date: '2026-05-01', type: 'addition',   qty: 100,  note: 'Monthly restock',       balanceAfter: 112 },
      { id: 'sh2', date: '2026-05-05', type: 'sale',       qty: -30,  note: 'Sales deduction',        balanceAfter: 82  },
      { id: 'sh3', date: '2026-05-12', type: 'sale',       qty: -40,  note: 'Sales deduction',        balanceAfter: 42  },
      { id: 'sh4', date: '2026-05-20', type: 'sale',       qty: -20,  note: 'Sales deduction',        balanceAfter: 22  },
      { id: 'sh5', date: '2026-05-28', type: 'sale',       qty: -10,  note: 'Sales deduction',        balanceAfter: 12  },
    ],
    weeklySales: [
      { week: 'Wk 1', units: 30, revenue: 13500 },
      { week: 'Wk 2', units: 40, revenue: 18000 },
      { week: 'Wk 3', units: 58, revenue: 26100 },
      { week: 'Wk 4', units: 20, revenue: 9000  },
    ],
  },
  {
    id: 'PRD-002', name: 'Office Chair Deluxe', sku: 'FRN-OC-002', category: 'Furniture',
    unit: 'pcs', buyingPrice: 800, sellingPrice: 1200, stock: 25, reorderLevel: 10,
    status: 'active', unitsSoldThisMonth: 62,
    stockHistory: [
      { id: 'sh1', date: '2026-04-15', type: 'addition',   qty: 50,   note: 'Supplier delivery',      balanceAfter: 87  },
      { id: 'sh2', date: '2026-05-03', type: 'sale',       qty: -18,  note: 'Sales deduction',        balanceAfter: 69  },
      { id: 'sh3', date: '2026-05-14', type: 'sale',       qty: -26,  note: 'Bulk order – Corp',      balanceAfter: 43  },
      { id: 'sh4', date: '2026-05-22', type: 'sale',       qty: -18,  note: 'Sales deduction',        balanceAfter: 25  },
    ],
    weeklySales: [
      { week: 'Wk 1', units: 18, revenue: 21600 },
      { week: 'Wk 2', units: 26, revenue: 31200 },
      { week: 'Wk 3', units: 12, revenue: 14400 },
      { week: 'Wk 4', units: 6,  revenue: 7200  },
    ],
  },
  {
    id: 'PRD-003', name: 'Wireless Mouse', sku: 'ELC-WM-003', category: 'Electronics',
    unit: 'pcs', buyingPrice: 180, sellingPrice: 320, stock: 120, reorderLevel: 30,
    status: 'active', unitsSoldThisMonth: 95,
    stockHistory: [
      { id: 'sh1', date: '2026-05-01', type: 'addition',   qty: 150,  note: 'Restock order',          balanceAfter: 215 },
      { id: 'sh2', date: '2026-05-08', type: 'sale',       qty: -35,  note: 'Sales deduction',        balanceAfter: 180 },
      { id: 'sh3', date: '2026-05-16', type: 'sale',       qty: -40,  note: 'Sales deduction',        balanceAfter: 140 },
      { id: 'sh4', date: '2026-05-24', type: 'sale',       qty: -20,  note: 'Sales deduction',        balanceAfter: 120 },
    ],
    weeklySales: [
      { week: 'Wk 1', units: 35, revenue: 11200 },
      { week: 'Wk 2', units: 40, revenue: 12800 },
      { week: 'Wk 3', units: 14, revenue: 4480  },
      { week: 'Wk 4', units: 6,  revenue: 1920  },
    ],
  },
  {
    id: 'PRD-004', name: 'Laptop Stand', sku: 'ELC-LS-004', category: 'Electronics',
    unit: 'pcs', buyingPrice: 450, sellingPrice: 850, stock: 45, reorderLevel: 20,
    status: 'active', unitsSoldThisMonth: 38,
    stockHistory: [
      { id: 'sh1', date: '2026-05-02', type: 'addition',   qty: 60,   note: 'Purchase order #88',    balanceAfter: 83  },
      { id: 'sh2', date: '2026-05-10', type: 'sale',       qty: -18,  note: 'Sales deduction',        balanceAfter: 65  },
      { id: 'sh3', date: '2026-05-18', type: 'adjustment', qty: -2,   note: 'Damage write-off',       balanceAfter: 63  },
      { id: 'sh4', date: '2026-05-27', type: 'sale',       qty: -18,  note: 'Sales deduction',        balanceAfter: 45  },
    ],
    weeklySales: [
      { week: 'Wk 1', units: 18, revenue: 15300 },
      { week: 'Wk 2', units: 12, revenue: 10200 },
      { week: 'Wk 3', units: 5,  revenue: 4250  },
      { week: 'Wk 4', units: 3,  revenue: 2550  },
    ],
  },
  {
    id: 'PRD-005', name: 'Printer Paper A4', sku: 'OFF-PP-005', category: 'Office Supplies',
    unit: 'ream', buyingPrice: 120, sellingPrice: 180, stock: 8, reorderLevel: 30,
    status: 'active', unitsSoldThisMonth: 72,
    stockHistory: [
      { id: 'sh1', date: '2026-05-01', type: 'addition',   qty: 80,   note: 'Monthly restock',       balanceAfter: 80  },
      { id: 'sh2', date: '2026-05-07', type: 'sale',       qty: -25,  note: 'Sales deduction',        balanceAfter: 55  },
      { id: 'sh3', date: '2026-05-15', type: 'sale',       qty: -30,  note: 'Sales deduction',        balanceAfter: 25  },
      { id: 'sh4', date: '2026-05-25', type: 'sale',       qty: -17,  note: 'Sales deduction',        balanceAfter: 8   },
    ],
    weeklySales: [
      { week: 'Wk 1', units: 25, revenue: 4500  },
      { week: 'Wk 2', units: 30, revenue: 5400  },
      { week: 'Wk 3', units: 11, revenue: 1980  },
      { week: 'Wk 4', units: 6,  revenue: 1080  },
    ],
  },
  {
    id: 'PRD-006', name: 'Desk Organizer', sku: 'OFF-DO-006', category: 'Office Supplies',
    unit: 'pcs', buyingPrice: 200, sellingPrice: 450, stock: 60, reorderLevel: 15,
    status: 'active', unitsSoldThisMonth: 29,
    stockHistory: [
      { id: 'sh1', date: '2026-04-10', type: 'addition',   qty: 80,   note: 'Supplier delivery',      balanceAfter: 89  },
      { id: 'sh2', date: '2026-05-06', type: 'sale',       qty: -14,  note: 'Sales deduction',        balanceAfter: 75  },
      { id: 'sh3', date: '2026-05-20', type: 'sale',       qty: -15,  note: 'Sales deduction',        balanceAfter: 60  },
    ],
    weeklySales: [
      { week: 'Wk 1', units: 14, revenue: 6300  },
      { week: 'Wk 2', units: 9,  revenue: 4050  },
      { week: 'Wk 3', units: 4,  revenue: 1800  },
      { week: 'Wk 4', units: 2,  revenue: 900   },
    ],
  },
  {
    id: 'PRD-007', name: 'Hand Sanitizer 500ml', sku: 'HLT-HS-007', category: 'Health & Safety',
    unit: 'bottle', buyingPrice: 80, sellingPrice: 150, stock: 5, reorderLevel: 25,
    status: 'active', unitsSoldThisMonth: 110,
    stockHistory: [
      { id: 'sh1', date: '2026-05-01', type: 'addition',   qty: 120,  note: 'Monthly restock',       balanceAfter: 115 },
      { id: 'sh2', date: '2026-05-10', type: 'sale',       qty: -50,  note: 'Sales deduction',        balanceAfter: 65  },
      { id: 'sh3', date: '2026-05-18', type: 'sale',       qty: -40,  note: 'Sales deduction',        balanceAfter: 25  },
      { id: 'sh4', date: '2026-05-28', type: 'sale',       qty: -20,  note: 'Sales deduction',        balanceAfter: 5   },
    ],
    weeklySales: [
      { week: 'Wk 1', units: 50, revenue: 7500  },
      { week: 'Wk 2', units: 40, revenue: 6000  },
      { week: 'Wk 3', units: 14, revenue: 2100  },
      { week: 'Wk 4', units: 6,  revenue: 900   },
    ],
  },
  {
    id: 'PRD-008', name: 'USB-C Cable 2m', sku: 'ELC-UC-008', category: 'Electronics',
    unit: 'pcs', buyingPrice: 80, sellingPrice: 180, stock: 200, reorderLevel: 50,
    status: 'active', unitsSoldThisMonth: 56,
    stockHistory: [
      { id: 'sh1', date: '2026-05-01', type: 'addition',   qty: 200,  note: 'Bulk order',             balanceAfter: 256 },
      { id: 'sh2', date: '2026-05-12', type: 'sale',       qty: -36,  note: 'Sales deduction',        balanceAfter: 220 },
      { id: 'sh3', date: '2026-05-25', type: 'sale',       qty: -20,  note: 'Sales deduction',        balanceAfter: 200 },
    ],
    weeklySales: [
      { week: 'Wk 1', units: 36, revenue: 6480  },
      { week: 'Wk 2', units: 12, revenue: 2160  },
      { week: 'Wk 3', units: 6,  revenue: 1080  },
      { week: 'Wk 4', units: 2,  revenue: 360   },
    ],
  },
  {
    id: 'PRD-009', name: 'Notebook A5', sku: 'STN-NB-009', category: 'Stationery',
    unit: 'pcs', buyingPrice: 60, sellingPrice: 120, stock: 300, reorderLevel: 80,
    status: 'active', unitsSoldThisMonth: 41,
    stockHistory: [
      { id: 'sh1', date: '2026-04-20', type: 'addition',   qty: 300,  note: 'Quarterly restock',     balanceAfter: 341 },
      { id: 'sh2', date: '2026-05-05', type: 'sale',       qty: -20,  note: 'Sales deduction',        balanceAfter: 321 },
      { id: 'sh3', date: '2026-05-20', type: 'sale',       qty: -21,  note: 'Sales deduction',        balanceAfter: 300 },
    ],
    weeklySales: [
      { week: 'Wk 1', units: 20, revenue: 2400  },
      { week: 'Wk 2', units: 12, revenue: 1440  },
      { week: 'Wk 3', units: 6,  revenue: 720   },
      { week: 'Wk 4', units: 3,  revenue: 360   },
    ],
  },
  {
    id: 'PRD-010', name: 'Ceramic Mug Set', sku: 'KTC-CM-010', category: 'Kitchen',
    unit: 'set', buyingPrice: 150, sellingPrice: 250, stock: 80, reorderLevel: 20,
    status: 'inactive', unitsSoldThisMonth: 0,
    stockHistory: [
      { id: 'sh1', date: '2026-03-10', type: 'addition',   qty: 80,   note: 'Initial stock',         balanceAfter: 80  },
    ],
    weeklySales: [
      { week: 'Wk 1', units: 0, revenue: 0 },
      { week: 'Wk 2', units: 0, revenue: 0 },
      { week: 'Wk 3', units: 0, revenue: 0 },
      { week: 'Wk 4', units: 0, revenue: 0 },
    ],
  },
];

export const CATEGORIES: Category[] = ['Beverages', 'Electronics', 'Furniture', 'Office Supplies', 'Stationery', 'Health & Safety', 'Kitchen'];

export const CAT_COLORS: Record<Category, string> = {
  Beverages:        '#f97316',
  Electronics:      '#6366f1',
  Furniture:        '#8b5cf6',
  'Office Supplies': '#3b82f6',
  Stationery:       '#14b8a6',
  'Health & Safety': '#10b981',
  Kitchen:          '#ec4899',
};

import { ArrowUp, ArrowDown, Minus, RefreshCw } from 'lucide-react';
import React from 'react';

export const EVENT_META: Record<StockEventType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  addition:   { label: 'Stock Added',    icon: ArrowUp,   color: 'text-green-600',  bg: 'bg-green-100'  },
  sale:       { label: 'Sale Deducted',  icon: ArrowDown, color: 'text-red-600',    bg: 'bg-red-100'    },
  adjustment: { label: 'Adjustment',     icon: Minus,     color: 'text-amber-600',  bg: 'bg-amber-100'  },
  return:     { label: 'Return',         icon: RefreshCw, color: 'text-blue-600',   bg: 'bg-blue-100'   },
};

export const TODAY = '2026-05-31';

export function fmt(n: number) { return 'ETB ' + n.toLocaleString(); }

export function stockStatus(p: Product): 'out' | 'low' | 'ok' {
  if (p.stock === 0) return 'out';
  if (p.stock <= p.reorderLevel) return 'low';
  return 'ok';
}

export function stockPct(p: Product) {
  const max = p.reorderLevel * 4;
  return Math.min(100, (p.stock / max) * 100);
}

export function markup(p: Product) {
  return Math.round(((p.sellingPrice - p.buyingPrice) / p.buyingPrice) * 100);
}
