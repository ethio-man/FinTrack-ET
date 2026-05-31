import { Home, Users, Car, Zap, MoreHorizontal } from 'lucide-react';
import React from 'react';

export interface Expense {
  id: string;
  date: string;
  category: Category;
  description: string;
  amount: number;
  receipt?: string;
}

export type Category = 'Rent' | 'Salary' | 'Transport' | 'Utilities' | 'Other';

export const CATEGORIES: Category[] = ['Rent', 'Salary', 'Transport', 'Utilities', 'Other'];

export const CATEGORY_META: Record<Category, { color: string; ring: string; icon: React.ElementType; bg: string }> = {
  Rent:      { color: '#7c3aed', ring: '#7c3aed', icon: Home,          bg: 'bg-violet-100 text-violet-700' },
  Salary:    { color: '#f97316', ring: '#f97316', icon: Users,         bg: 'bg-orange-100 text-orange-700' },
  Transport: { color: '#14b8a6', ring: '#14b8a6', icon: Car,           bg: 'bg-teal-100 text-teal-700'   },
  Utilities: { color: '#3b82f6', ring: '#3b82f6', icon: Zap,           bg: 'bg-blue-100 text-blue-700'   },
  Other:     { color: '#ec4899', ring: '#ec4899', icon: MoreHorizontal, bg: 'bg-pink-100 text-pink-700'  },
};

export const mockExpenses: Expense[] = [
  { id: 'EXP-001', date: '31 May, 2026',  category: 'Rent',      description: 'Monthly office rent – June',          amount: 18000 },
  { id: 'EXP-002', date: '30 May, 2026',  category: 'Salary',    description: 'Staff salaries – May payroll',         amount: 42000 },
  { id: 'EXP-003', date: '29 May, 2026',  category: 'Transport', description: 'Fuel & delivery – week 4',             amount: 3400  },
  { id: 'EXP-004', date: '28 May, 2026',  category: 'Utilities', description: 'Electricity bill – May',               amount: 2800  },
  { id: 'EXP-005', date: '27 May, 2026',  category: 'Other',     description: 'Office supplies & stationery',         amount: 1250  },
  { id: 'EXP-006', date: '26 May, 2026',  category: 'Transport', description: 'Vehicle maintenance',                  amount: 4200  },
  { id: 'EXP-007', date: '25 May, 2026',  category: 'Utilities', description: 'Internet & phone – May',               amount: 1100  },
  { id: 'EXP-008', date: '24 May, 2026',  category: 'Salary',    description: 'Freelance contractor fee',             amount: 8500  },
  { id: 'EXP-009', date: '22 May, 2026',  category: 'Other',     description: 'Marketing materials printing',         amount: 2100  },
  { id: 'EXP-010', date: '20 May, 2026',  category: 'Rent',      description: 'Storage unit – 3 months prepay',      amount: 4500  },
];

export function buildChartData(expenses: Expense[]) {
  const totals: Record<Category, number> = { Rent: 0, Salary: 0, Transport: 0, Utilities: 0, Other: 0 };
  expenses.forEach(e => { totals[e.category] += e.amount; });
  const grand = Object.values(totals).reduce((a, b) => a + b, 0) || 1;
  return CATEGORIES.map((cat, i) => ({
    name: cat,
    value: Math.round((totals[cat] / grand) * 100),
    rawAmount: totals[cat],
    fill: CATEGORY_META[cat].color,
    innerRadius: 55 + i * 22,
    outerRadius: 70 + i * 22,
  }));
}

export function fmt(n: number) {
  return 'ETB ' + n.toLocaleString();
}

export function today() {
  return new Date().toISOString().split('T')[0];
}
