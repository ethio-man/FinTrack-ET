import React, { useState } from 'react';
import {
  ChevronDown,
  Home,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Package,
  FileText,
  BarChart2,
  PieChart,
  ShieldCheck,
  Users,
  Bell,
  Settings,
  HelpCircle
} from 'lucide-react';

import { LanguageOpt } from '../types';

interface SidebarProps {
  selectedLanguage: LanguageOpt;
  activeItem: string;
  setActiveItem: (item: string) => void;
}

export default function Sidebar({ selectedLanguage, activeItem, setActiveItem }: SidebarProps) {
  const isAmharic = selectedLanguage.code === 'am';
  const t = {
    dashboard: isAmharic ? "ዳሽቦርድ" : "Dashboard",
    transactions: isAmharic ? "ግብይቶች" : "Transactions",
    sales: isAmharic ? "ሽያጭ" : "Sales",
    expenses: isAmharic ? "ወጪዎች" : "Expenses",
    debts: isAmharic ? "እዳዎች" : "Debts",
    dueBadge: isAmharic ? "3 የሚጠበቁ" : "3 due",
    business: isAmharic ? "ንግድ" : "Business",
    inventory: isAmharic ? "ክምችት" : "Inventory",
    lowBadge: isAmharic ? "2 ዝቅተኛ" : "2 low",
    invoices: isAmharic ? "ደረሰኞች" : "Invoices",
    reports: isAmharic ? "ሪፖርቶች" : "Reports",
    premium: isAmharic ? "ፕሪሚየም" : "Premium",
    analytics: isAmharic ? "ትንታኔ" : "Analytics",
    trustScore: isAmharic ? "የታማኝነት ነጥብ" : "Trust Score",
    team: isAmharic ? "ቡድን" : "Team",
    pro: isAmharic ? "ፕሮ" : "Pro",
    notifications: isAmharic ? "ማሳወቂያዎች" : "Notifications",
    settings: isAmharic ? "ቅንብሮች" : "Settings",
    help: isAmharic ? "እገዛ እና ድጋፍ" : "Help & Support",
  };

  const navItemClass = (name: string) => `flex items-center gap-3 font-medium text-sm py-2 px-3 rounded-lg transition-colors cursor-pointer ${activeItem === name
      ? 'bg-[#0077C5]/10 text-[#0077C5]'
      : 'text-[var(--text-sec)] hover:bg-[var(--bg-panel-inner)] hover:text-[var(--text-core)]'
    }`;

  return (
    <div className="hidden md:flex flex-col justify-between w-64 h-screen shrink-0 bg-[var(--bg-panel)] border-r border-[var(--border-core)] p-4 font-sans select-none z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="flex flex-col space-y-6 overflow-y-auto overflow-x-hidden no-scrollbar pb-4">

        {/* Business Card */}
        <div className="relative group cursor-pointer">
          <div className="flex items-center justify-between p-3 bg-[var(--bg-core)] border border-[var(--border-subtle)] rounded-xl hover:border-[#0077C5]/30 transition-all shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0077C5] to-[#005a96] text-white flex items-center justify-center font-bold text-lg shadow-inner">
                S
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-[var(--text-core)] leading-none tracking-tight">Sheger Traders</span>
                <span className="text-[10px] font-semibold text-[var(--text-mute)] mt-1">Alemayehu • Addis Ababa</span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-[var(--text-mute)] group-hover:text-[#0077C5] transition-colors" />
          </div>
        </div>

        <div className="space-y-6">
          {/* Main */}
          <nav className="flex flex-col space-y-1">
            <a onClick={() => setActiveItem('Dashboard')} className={navItemClass('Dashboard')}>
              <Home className="w-4.5 h-4.5" />
              {t.dashboard}
            </a>
          </nav>

          {/* Transactions */}
          <div>
            <p className="text-[10px] font-black text-[var(--text-mute)] uppercase tracking-widest mb-2 px-3">{t.transactions}</p>
            <nav className="flex flex-col space-y-1">
              <a onClick={() => setActiveItem('Sales')} className={navItemClass('Sales')}>
                <TrendingUp className="w-4.5 h-4.5" />
                {t.sales}
              </a>
              <a onClick={() => setActiveItem('Expenses')} className={navItemClass('Expenses')}>
                <TrendingDown className="w-4.5 h-4.5" />
                {t.expenses}
              </a>
              <a onClick={() => setActiveItem('Debts')} className={`justify-between ${navItemClass('Debts')}`}>
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4.5 h-4.5" />
                  <span>{t.debts}</span>
                </div>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">{t.dueBadge}</span>
              </a>
            </nav>
          </div>

          {/* Business */}
          <div>
            <p className="text-[10px] font-black text-[var(--text-mute)] uppercase tracking-widest mb-2 px-3">{t.business}</p>
            <nav className="flex flex-col space-y-1">
              <a onClick={() => setActiveItem('Inventory')} className={`justify-between ${navItemClass('Inventory')}`}>
                <div className="flex items-center gap-3">
                  <Package className="w-4.5 h-4.5" />
                  <span>{t.inventory}</span>
                </div>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">{t.lowBadge}</span>
              </a>
              <a onClick={() => setActiveItem('Invoices')} className={navItemClass('Invoices')}>
                <FileText className="w-4.5 h-4.5" />
                {t.invoices}
              </a>
              <a onClick={() => setActiveItem('Reports')} className={navItemClass('Reports')}>
                <BarChart2 className="w-4.5 h-4.5" />
                {t.reports}
              </a>
            </nav>
          </div>

          {/* Premium */}
          <div>
            <p className="text-[10px] font-black text-[var(--text-mute)] uppercase tracking-widest mb-2 px-3 flex items-center gap-1.5">
              {t.premium}
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
            </p>
            <nav className="flex flex-col space-y-1">
              <a onClick={() => setActiveItem('Analytics')} className={navItemClass('Analytics')}>
                <PieChart className="w-4.5 h-4.5" />
                {t.analytics}
              </a>
              <a onClick={() => setActiveItem('Trust Score')} className={navItemClass('Trust Score')}>
                <ShieldCheck className="w-4.5 h-4.5" />
                {t.trustScore}
              </a>
              <a onClick={() => setActiveItem('Team')} className={`justify-between ${navItemClass('Team')}`}>
                <div className="flex items-center gap-3">
                  <Users className="w-4.5 h-4.5" />
                  <span>{t.team}</span>
                </div>
                <span className="text-[9px] font-black text-amber-600 bg-gradient-to-r from-amber-100 to-amber-50 border border-amber-200 px-1.5 py-0.5 rounded uppercase tracking-wider">{t.pro}</span>
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Group */}
      <div className="pt-4 border-t border-[var(--border-subtle)] mt-2">
        <nav className="flex flex-col space-y-1">
          <a onClick={() => setActiveItem('Notifications')} className={`justify-between ${navItemClass('Notifications')}`}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute 0 right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--bg-panel)]"></span>
              </div>
              <span>{t.notifications}</span>
            </div>
          </a>
          <a onClick={() => setActiveItem('Settings')} className={navItemClass('Settings')}>
            <Settings className="w-4.5 h-4.5" />
            {t.settings}
          </a>
          <a onClick={() => setActiveItem('Help')} className={navItemClass('Help')}>
            <HelpCircle className="w-4.5 h-4.5" />
            {t.help}
          </a>
        </nav>
      </div>
    </div>
  );
}
