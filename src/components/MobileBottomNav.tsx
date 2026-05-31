import React, { useState } from 'react';
import { Home, TrendingUp, CreditCard, FileText, Menu, X } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function MobileBottomNav({ activeTab, setActiveTab }: MobileBottomNavProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItemClass = (name: string) => `flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
    activeTab === name || (name === 'More' && drawerOpen)
      ? 'text-[#0077C5]' 
      : 'text-[var(--text-mute)] hover:text-[var(--text-core)]'
  }`;

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[var(--bg-panel)] border-t border-[var(--border-core)] z-50 flex justify-between px-2 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
        <button onClick={() => { setActiveTab('Dashboard'); setDrawerOpen(false); }} className={navItemClass('Dashboard')}>
          <Home className={`w-5 h-5 ${activeTab === 'Dashboard' ? 'fill-[#0077C5]/10' : ''}`} />
          <span className="text-[10px] font-semibold">Home</span>
        </button>
        <button onClick={() => { setActiveTab('Sales'); setDrawerOpen(false); }} className={navItemClass('Sales')}>
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Sales</span>
        </button>
        <button onClick={() => { setActiveTab('Debts'); setDrawerOpen(false); }} className={navItemClass('Debts')}>
          <div className="relative">
            <CreditCard className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-[var(--bg-panel)] animate-pulse"></span>
          </div>
          <span className="text-[10px] font-semibold">Debts</span>
        </button>
        <button onClick={() => { setActiveTab('Invoices'); setDrawerOpen(false); }} className={navItemClass('Invoices')}>
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Invoices</span>
        </button>
        <button onClick={() => setDrawerOpen(!drawerOpen)} className={navItemClass('More')}>
          {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          <span className="text-[10px] font-semibold">More</span>
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[var(--bg-core)] pb-16 animate-fade-in flex flex-col justify-end">
          <div className="bg-[var(--bg-panel)] h-[85vh] rounded-t-3xl border-t border-[var(--border-core)] shadow-2xl p-6 overflow-y-auto flex flex-col space-y-6 animate-slide-up">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-[var(--text-core)]">All Menu</h2>
              <button onClick={() => setDrawerOpen(false)} className="p-2 bg-[var(--bg-core)] rounded-full text-[var(--text-sec)]">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Drawer Content - We can reuse the structure from Sidebar here, simplified for mobile */}
            <div className="space-y-6 pb-8">
               <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[var(--bg-core)] p-4 rounded-2xl border border-[var(--border-subtle)] flex flex-col gap-2">
                    <span className="p-2 bg-amber-500/10 text-amber-600 rounded-lg w-fit"><CreditCard className="w-5 h-5" /></span>
                    <span className="font-bold text-sm">Debts</span>
                    <span className="text-xs text-red-500 font-semibold">3 items due</span>
                  </div>
                  <div className="bg-[var(--bg-core)] p-4 rounded-2xl border border-[var(--border-subtle)] flex flex-col gap-2">
                    <span className="p-2 bg-blue-500/10 text-blue-600 rounded-lg w-fit"><FileText className="w-5 h-5" /></span>
                    <span className="font-bold text-sm">Inventory</span>
                    <span className="text-xs text-amber-500 font-semibold">2 items low</span>
                  </div>
               </div>

               <div>
                 <p className="text-xs font-bold text-[var(--text-mute)] uppercase mb-3">Premium Features</p>
                 <div className="space-y-2">
                    <button className="w-full flex items-center justify-between p-3 bg-[var(--bg-core)] rounded-xl border border-[var(--border-subtle)]">
                      <span className="font-semibold text-sm">Analytics</span>
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">PRO</span>
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-[var(--bg-core)] rounded-xl border border-[var(--border-subtle)]">
                      <span className="font-semibold text-sm">Trust Score</span>
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">PRO</span>
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-[var(--bg-core)] rounded-xl border border-[var(--border-subtle)]">
                      <span className="font-semibold text-sm">Team Management</span>
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">PRO</span>
                    </button>
                 </div>
               </div>
               
               <div>
                 <p className="text-xs font-bold text-[var(--text-mute)] uppercase mb-3">Settings & Support</p>
                 <div className="space-y-2">
                    <button className="w-full flex items-center justify-between p-3 bg-[var(--bg-core)] rounded-xl border border-[var(--border-subtle)]">
                      <span className="font-semibold text-sm">Notifications</span>
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-[var(--bg-core)] rounded-xl border border-[var(--border-subtle)]">
                      <span className="font-semibold text-sm">Preferences</span>
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-[var(--bg-core)] rounded-xl border border-[var(--border-subtle)]">
                      <span className="font-semibold text-sm">Help Desk</span>
                    </button>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
