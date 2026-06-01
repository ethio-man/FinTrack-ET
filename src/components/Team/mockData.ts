import { Activity, DollarSign, CreditCard, FileText, Package, Users } from 'lucide-react';

export type Role = 'Owner' | 'Manager' | 'Cashier' | 'Sales Rep' | 'Inventory Clerk';
export type StaffStatus = 'active' | 'away' | 'offline';

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: Role;
  branchId: string | null;
  status: StaffStatus;
  lastActivity: string;
  joinedDate: string;
  avatar: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  managerId: string | null;
  monthlySales: number;
  monthlyProfit: number;
  staffCount: number;
  openedDate: string;
}

export interface Permission {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export type RolePermissions = Record<Role, Permission[]>;

export const ROLES: Role[] = ['Owner', 'Manager', 'Cashier', 'Sales Rep', 'Inventory Clerk'];

export const STATUS_META: Record<StaffStatus, { labelKey: string; color: string; bg: string; dot: string }> = {
  active:  { labelKey: 'active',  color: 'text-green-700 dark:text-green-400',  bg: 'bg-green-100 dark:bg-green-900/30',  dot: 'bg-green-500'  },
  away:    { labelKey: 'away',    color: 'text-amber-700 dark:text-amber-400',  bg: 'bg-amber-100 dark:bg-amber-900/30',  dot: 'bg-amber-500'  },
  offline: { labelKey: 'offline', color: 'text-[var(--text-sec)]', bg: 'bg-[var(--bg-panel-inner)]', dot: 'bg-[var(--text-mute)]'   },
};

export const ROLE_COLORS: Record<Role, string> = {
  Owner:            '#7c3aed',
  Manager:          '#3b82f6',
  Cashier:          '#10b981',
  'Sales Rep':      '#f59e0b',
  'Inventory Clerk': '#ec4899',
};

export const MODULES = [
  { name: 'Dashboard',  icon: Activity },
  { name: 'Sales',      icon: DollarSign },
  { name: 'Expenses',   icon: CreditCard },
  { name: 'Debts',      icon: FileText },
  { name: 'Inventory',  icon: Package },
  { name: 'Invoices',   icon: FileText },
  { name: 'Team',       icon: Users },
];

export const mockStaff: StaffMember[] = [
  {
    id: 's1', name: 'Mariana Silva',     phone: '+251 911 111 111', email: 'mariana@financetrack.co', role: 'Owner',
    branchId: null, status: 'active', lastActivity: '2 minutes ago', joinedDate: '2025-01-01', avatar: 'MS',
  },
  {
    id: 's2', name: 'James Dorgan',      phone: '+251 911 234 567', email: 'james@financetrack.co', role: 'Manager',
    branchId: 'b1', status: 'active', lastActivity: '10 minutes ago', joinedDate: '2025-02-15', avatar: 'JD',
  },
  {
    id: 's3', name: 'Savannah Nguyen',   phone: '+251 911 345 678', email: 'savannah@financetrack.co', role: 'Cashier',
    branchId: 'b1', status: 'active', lastActivity: '1 hour ago', joinedDate: '2025-03-10', avatar: 'SN',
  },
  {
    id: 's4', name: 'Dianne Russell',    phone: '+251 911 456 789', email: 'dianne@financetrack.co', role: 'Sales Rep',
    branchId: 'b2', status: 'away', lastActivity: '3 hours ago', joinedDate: '2025-04-05', avatar: 'DR',
  },
  {
    id: 's5', name: 'Robert Fox',        phone: '+251 911 567 890', email: 'robert@financetrack.co', role: 'Inventory Clerk',
    branchId: 'b2', status: 'active', lastActivity: '30 minutes ago', joinedDate: '2025-04-20', avatar: 'RF',
  },
  {
    id: 's6', name: 'Jane Cooper',       phone: '+251 911 678 901', email: 'jane@financetrack.co', role: 'Cashier',
    branchId: 'b3', status: 'offline', lastActivity: '1 day ago', joinedDate: '2025-05-01', avatar: 'JC',
  },
  {
    id: 's7', name: 'Annette Black',     phone: '+251 911 789 012', email: 'annette@financetrack.co', role: 'Sales Rep',
    branchId: 'b3', status: 'active', lastActivity: '15 minutes ago', joinedDate: '2025-05-10', avatar: 'AB',
  },
];

export const mockBranches: Branch[] = [
  { id: 'b1', name: 'Bole Branch',       location: 'Bole Sub-city, Addis Ababa',      managerId: 's2', monthlySales: 125000, monthlyProfit: 42000, staffCount: 5, openedDate: '2025-01-15' },
  { id: 'b2', name: 'Piassa Branch',     location: 'Piassa, Addis Ababa',             managerId: null, monthlySales: 98000,  monthlyProfit: 31000, staffCount: 3, openedDate: '2025-03-01' },
  { id: 'b3', name: 'Kazanchis Branch',  location: 'Kazanchis, Addis Ababa',          managerId: null, monthlySales: 78000,  monthlyProfit: 24000, staffCount: 2, openedDate: '2025-04-10' },
  { id: 'b4', name: 'CMC Branch',        location: 'CMC, Addis Ababa',                managerId: null, monthlySales: 0,      monthlyProfit: 0,     staffCount: 0, openedDate: '2026-06-01' },
];

export const rolePermissions: RolePermissions = {
  Owner: MODULES.map(m => ({ module: m.name, view: true, create: true, edit: true, delete: true })),
  Manager: [
    { module: 'Dashboard',  view: true, create: false, edit: false, delete: false },
    { module: 'Sales',      view: true, create: true,  edit: true,  delete: true  },
    { module: 'Expenses',   view: true, create: true,  edit: true,  delete: false },
    { module: 'Debts',      view: true, create: true,  edit: true,  delete: false },
    { module: 'Inventory',  view: true, create: true,  edit: true,  delete: false },
    { module: 'Invoices',   view: true, create: true,  edit: true,  delete: false },
    { module: 'Team',       view: true, create: false, edit: false, delete: false },
  ],
  Cashier: [
    { module: 'Dashboard',  view: true, create: false, edit: false, delete: false },
    { module: 'Sales',      view: true, create: true,  edit: false, delete: false },
    { module: 'Expenses',   view: true, create: false, edit: false, delete: false },
    { module: 'Debts',      view: true, create: false, edit: false, delete: false },
    { module: 'Inventory',  view: true, create: false, edit: false, delete: false },
    { module: 'Invoices',   view: true, create: true,  edit: false, delete: false },
    { module: 'Team',       view: false, create: false, edit: false, delete: false },
  ],
  'Sales Rep': [
    { module: 'Dashboard',  view: true, create: false, edit: false, delete: false },
    { module: 'Sales',      view: true, create: true,  edit: false, delete: false },
    { module: 'Expenses',   view: false, create: false, edit: false, delete: false },
    { module: 'Debts',      view: true, create: false, edit: false, delete: false },
    { module: 'Inventory',  view: true, create: false, edit: false, delete: false },
    { module: 'Invoices',   view: true, create: true,  edit: false, delete: false },
    { module: 'Team',       view: false, create: false, edit: false, delete: false },
  ],
  'Inventory Clerk': [
    { module: 'Dashboard',  view: true,  create: false, edit: false, delete: false },
    { module: 'Sales',      view: true,  create: false, edit: false, delete: false },
    { module: 'Expenses',   view: false, create: false, edit: false, delete: false },
    { module: 'Debts',      view: false, create: false, edit: false, delete: false },
    { module: 'Inventory',  view: true,  create: true,  edit: true,  delete: false },
    { module: 'Invoices',   view: false, create: false, edit: false, delete: false },
    { module: 'Team',       view: false, create: false, edit: false, delete: false },
  ],
};

export function fmt(n: number) { return 'ETB ' + n.toLocaleString(); }
export function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
