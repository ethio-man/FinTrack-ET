import React, { useState } from 'react';
import { Plus, Filter, Check, TrendingUp, TrendingDown, Wallet, AlertTriangle, CheckCircle } from 'lucide-react';
import { Debt, isOverdue, isSettled, balance, fmt } from './mockData';
import { DebtRow } from './DebtComponents';
import { SmsModal, AddDebtModal } from './Modals';
import { LanguageOpt } from '../../types';
import { translations } from './translations';

interface DebtsOverviewProps {
  debts: Debt[];
  onSelect: (id: string) => void;
  onDebtAdded: (d: Debt) => void;
  language: LanguageOpt;
}

export default function DebtsOverview({ debts, onSelect, onDebtAdded, language }: DebtsOverviewProps) {
  const [activeTab, setActiveTab] = useState<'receivable' | 'payable'>('receivable');
  const [filterOverdue, setFilterOverdue] = useState(false);
  const [smsDebt, setSmsDebt] = useState<Debt | null>(null);
  const [addModal, setAddModal] = useState<'receivable' | 'payable' | null>(null);
  const [smsSent, setSmsSent] = useState(false);

  const t = translations[language.code as keyof typeof translations] || translations.en;

  const receivables = debts.filter(d => d.type === 'receivable' && !isSettled(d));
  const payables    = debts.filter(d => d.type === 'payable'    && !isSettled(d));

  const totalReceivable = receivables.reduce((s, d) => s + balance(d), 0);
  const totalPayable    = payables.reduce((s, d) => s + balance(d), 0);
  const netBalance      = totalReceivable - totalPayable;

  const overdueReceivable = receivables.filter(isOverdue).reduce((s, d) => s + balance(d), 0);
  const overduePayable    = payables.filter(isOverdue).reduce((s, d) => s + balance(d), 0);

  const list = debts.filter(d => {
    if (d.type !== activeTab) return false;
    if (filterOverdue && !isOverdue(d)) return false;
    return true;
  });

  function handleSmsSend(_msg: string) {
    setSmsSent(true);
    setTimeout(() => setSmsSent(false), 3000);
  }

  return (
    <div className="space-y-6">
      {smsDebt && <SmsModal debt={smsDebt} onClose={() => setSmsDebt(null)} onSend={handleSmsSend} language={language} />}
      {addModal && (
        <AddDebtModal
          type={addModal}
          onClose={() => setAddModal(null)}
          onAdd={d => { onDebtAdded(d); setAddModal(null); }}
          language={language}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-core)] mb-1">{t.debtsAndCredit}</h1>
          <p className="text-[var(--text-sec)] text-sm">{t.manageDebts}</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={() => setAddModal('payable')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-[var(--border-core)] rounded-lg text-sm text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors"
          >
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">{t.addSupplierDebt}</span><span className="sm:hidden">Supplier</span>
          </button>
          <button
            onClick={() => setAddModal('receivable')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">{t.addCustomerDebt}</span><span className="sm:hidden">Customer</span>
          </button>
        </div>
      </div>

      {smsSent && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl px-4 py-3 text-sm">
          <Check className="w-4 h-4" /> SMS reminder sent successfully.
        </div>
      )}

      {/* Balance summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--bg-panel)] rounded-xl p-5 shadow-sm border border-[var(--border-subtle)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-green-500/10 rounded-lg"><TrendingUp className="w-5 h-5 text-green-500" /></div>
            <span className="text-sm text-[var(--text-sec)]">{t.totalReceivable}</span>
          </div>
          <p className="text-2xl font-semibold text-green-600">{fmt(totalReceivable)}</p>
          {overdueReceivable > 0 && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {fmt(overdueReceivable)} {t.overdue}
            </p>
          )}
        </div>

        <div className="bg-[var(--bg-panel)] rounded-xl p-5 shadow-sm border border-[var(--border-subtle)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-red-500/10 rounded-lg"><TrendingDown className="w-5 h-5 text-red-500" /></div>
            <span className="text-sm text-[var(--text-sec)]">{t.totalPayable}</span>
          </div>
          <p className="text-2xl font-semibold text-red-600">{fmt(totalPayable)}</p>
          {overduePayable > 0 && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {fmt(overduePayable)} {t.overdue}
            </p>
          )}
        </div>

        <div className={`rounded-xl p-5 shadow-sm border ${netBalance >= 0 ? 'bg-indigo-600 border-indigo-500' : 'bg-orange-600 border-orange-500'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-white/20 rounded-lg"><Wallet className="w-5 h-5 text-white" /></div>
            <span className="text-sm text-white/80">{t.netPosition}</span>
          </div>
          <p className="text-2xl font-semibold text-white">{netBalance >= 0 ? '+' : ''}{fmt(netBalance)}</p>
          <p className="text-xs text-white/60 mt-1">{netBalance >= 0 ? t.netCreditor : t.netDebtor}</p>
        </div>
      </div>

      {/* Tabs + list */}
      <div className="bg-[var(--bg-panel)] rounded-xl shadow-sm border border-[var(--border-subtle)] overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between px-5 border-b border-[var(--border-subtle)] gap-3 py-2 sm:py-0">
          <div className="flex overflow-x-auto w-full sm:w-auto no-scrollbar">
            {(['receivable', 'payable'] as const).map(tab => {
              const count = debts.filter(d => d.type === tab && !isSettled(d)).length;
              const overdueCount = debts.filter(d => d.type === tab && isOverdue(d)).length;
              const label = tab === 'receivable' ? t.receivables : t.payables;
              return (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-3 sm:py-4 text-sm border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab ? 'border-indigo-600 text-indigo-500' : 'border-transparent text-[var(--text-sec)] hover:text-[var(--text-core)]'
                  }`}
                >
                  {label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                    activeTab === tab ? 'bg-indigo-500/10 text-indigo-500' : 'bg-[var(--bg-panel-inner)] text-[var(--text-sec)]'
                  }`}>{count}</span>
                  {overdueCount > 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500 whitespace-nowrap">{overdueCount} {t.overdue}</span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setFilterOverdue(v => !v)}
            className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors shrink-0 w-full sm:w-auto ${
              filterOverdue ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-[var(--bg-panel-inner)] text-[var(--text-sec)] hover:bg-[var(--border-subtle)]'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            {filterOverdue ? t.overdueOnly : t.filterOverdue}
          </button>
        </div>

        <div>
          {list.length === 0 ? (
            <div className="text-center py-16 text-[var(--text-mute)]">
              <CheckCircle className="w-10 h-10 mx-auto mb-3 text-green-400/40" />
              <p className="text-sm">
                {filterOverdue ? t.noOverdue : t.no}
                {activeTab === 'receivable' ? t.receivables.toLowerCase() : t.payables.toLowerCase()}
                {t.found}
              </p>
            </div>
          ) : (
            list.map(d => (
              <DebtRow
                key={d.id}
                debt={d}
                onClick={() => onSelect(d.id)}
                onSms={() => { setSmsDebt(d); }}
                language={language}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
