import React from 'react';
import { CheckCircle, AlertTriangle, Clock, MessageSquare, ChevronRight } from 'lucide-react';
import { Debt, isSettled, isOverdue, daysUntil, balance, fmt, formatDate } from './mockData';
import { LanguageOpt } from '../../types';

export function Avatar({ initials, size = 'md', color = 'indigo' }: { initials: string; size?: 'sm' | 'md' | 'lg'; color?: string }) {
  const sz = size === 'lg' ? 'w-14 h-14 text-lg' : size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
  const grad = color === 'red'
    ? 'from-red-400 to-rose-600'
    : 'from-indigo-500 to-purple-600';
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white shrink-0`}>
      {initials}
    </div>
  );
}

export function StatusBadge({ debt, language }: { debt: Debt; language: LanguageOpt }) {
  const isAm = language.code === 'am';
  const t = {
    settled: isAm ? 'ተከፍሏል' : 'Settled',
    overdue: isAm ? 'ቀናት አልፏል' : 'overdue',
    dueIn: isAm ? 'በ ቀናት ውስጥ' : 'Due in',
  };

  if (isSettled(debt)) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
        <CheckCircle className="w-3 h-3" /> {t.settled}
      </span>
    );
  }
  if (isOverdue(debt)) {
    const days = Math.abs(daysUntil(debt.dueDate));
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700">
        <AlertTriangle className="w-3 h-3" /> {days}d {t.overdue}
      </span>
    );
  }
  const d = daysUntil(debt.dueDate);
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
      <Clock className="w-3 h-3" /> {isAm ? `${d} ${t.dueIn}` : `${t.dueIn} ${d}d`}
    </span>
  );
}

export function ProgressBar({ paid, total, overdue }: { paid: number; total: number; overdue: boolean }) {
  const pct = Math.min(100, total > 0 ? (paid / total) * 100 : 0);
  return (
    <div className="h-1.5 bg-[var(--bg-panel-inner)] rounded-full overflow-hidden w-full max-w-[200px]">
      <div
        className={`h-full rounded-full transition-all ${overdue ? 'bg-red-400' : 'bg-indigo-500'}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function DebtRow({ debt, onClick, onSms, language }: { key?: React.Key; debt: Debt; onClick: () => void; onSms: () => void; language: LanguageOpt }) {
  const settled = isSettled(debt);
  const overdue = isOverdue(debt);
  const bal = balance(debt);
  
  const isAm = language.code === 'am';
  const t = {
    paid: isAm ? 'ተከፍሏል' : 'paid',
    due: isAm ? 'የሚከፈልበት ቀን' : 'Due',
    sendSms: isAm ? 'SMS ላክ' : 'Send SMS'
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 px-5 py-4 border-b border-[var(--border-subtle)] hover:bg-[var(--bg-panel-inner)] transition-colors cursor-pointer group ${
        overdue && !settled ? 'border-l-4 border-l-red-400' : 'border-l-4 border-l-transparent'
      }`}
    >
      <Avatar initials={debt.contactAvatar} color={overdue && !settled ? 'red' : 'indigo'} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm text-[var(--text-core)]">{debt.contactName}</span>
          <StatusBadge debt={debt} language={language} />
        </div>
        <p className="text-xs text-[var(--text-sec)] truncate max-w-xs">{debt.description}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <ProgressBar paid={debt.amountPaid} total={debt.amount} overdue={overdue && !settled} />
          <span className="text-xs text-[var(--text-mute)] shrink-0">
            {Math.round(debt.amount > 0 ? (debt.amountPaid / debt.amount) * 100 : 0)}% {t.paid}
          </span>
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className={`text-sm font-medium ${settled ? 'text-green-600' : overdue ? 'text-red-600' : 'text-[var(--text-core)]'}`}>
          {fmt(bal)}
        </p>
        <p className="text-xs text-[var(--text-mute)]">{t.due} {formatDate(debt.dueDate)}</p>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
        <button
          onClick={onSms}
          title={t.sendSms}
          className="p-1.5 hover:bg-indigo-500/10 rounded-lg transition-colors text-indigo-500"
        >
          <MessageSquare className="w-4 h-4" />
        </button>
        <ChevronRight className="w-4 h-4 text-[var(--text-mute)]" />
      </div>
    </div>
  );
}
