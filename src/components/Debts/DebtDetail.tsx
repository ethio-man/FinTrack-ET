import React, { useState } from 'react';
import {
  ArrowLeft, CreditCard, Send, FileText, Trash2, MoreVertical,
  Clock, CheckCircle, AlertTriangle, Phone, Plus, Bell, Calendar
} from 'lucide-react';
import { Debt, SmsEntry, Payment, isSettled, isOverdue, balance, daysUntil, fmt, formatDate, TODAY, METHOD_ICONS } from './mockData';
import { RecordPaymentModal, SmsModal, AgreementModal, DeleteConfirmModal } from './Modals';
import { LanguageOpt } from '../../types';
import { translations } from './translations';

interface DebtDetailProps {
  debt: Debt;
  onBack: () => void;
  onDelete: (id: string) => void;
  language: LanguageOpt;
}

export default function DebtDetail({ debt: initialDebt, onBack, onDelete, language }: DebtDetailProps) {
  const [debt, setDebt] = useState(initialDebt);
  const [modal, setModal] = useState<'payment' | 'sms' | 'agreement' | 'delete' | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const t = translations[language.code as keyof typeof translations] || translations.en;

  const settled = isSettled(debt);
  const overdue = isOverdue(debt);
  const bal = balance(debt);
  const pct = debt.amount > 0 ? Math.round((debt.amountPaid / debt.amount) * 100) : 0;

  const isAm = language.code === 'am';

  function addPayment(p: Payment) {
    setDebt(d => ({ ...d, amountPaid: d.amountPaid + p.amount, paymentHistory: [p, ...d.paymentHistory] }));
  }

  function addSms(msg: string) {
    const entry: SmsEntry = {
      id: 'sms-' + Date.now(),
      date: TODAY,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      message: msg,
      status: 'sent',
    };
    setDebt(d => ({ ...d, smsLog: [entry, ...d.smsLog] }));
  }

  const heroGradient = overdue && !settled
    ? 'bg-gradient-to-br from-red-600 to-rose-800'
    : settled
    ? 'bg-gradient-to-br from-green-600 to-emerald-800'
    : 'bg-gradient-to-br from-indigo-600 to-purple-800';

  return (
    <div className="space-y-6">
      {modal === 'payment'   && <RecordPaymentModal debt={debt} onClose={() => setModal(null)} onSave={addPayment} language={language} />}
      {modal === 'sms'       && <SmsModal debt={debt} onClose={() => setModal(null)} onSend={addSms} language={language} />}
      {modal === 'agreement' && <AgreementModal debt={debt} onClose={() => setModal(null)} language={language} />}
      {modal === 'delete'    && (
        <DeleteConfirmModal debt={debt} onClose={() => setModal(null)} onDelete={() => { onDelete(debt.id); onBack(); }} language={language} />
      )}

      {/* Back + Actions */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[var(--text-sec)] hover:text-[var(--text-core)] transition-colors">
          <ArrowLeft className="w-4 h-4" /> {isAm ? 'ወደ ኋላ' : 'Back to Debts'}
        </button>
        <div className="flex gap-2 items-center">
          {!settled && (
            <button onClick={() => setModal('payment')}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-sm">
              <CreditCard className="w-4 h-4" /> {t.recordPayment}
            </button>
          )}
          <button onClick={() => setModal('sms')}
            className="flex items-center gap-2 px-4 py-2.5 border border-[var(--border-core)] rounded-lg text-sm text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors">
            <Send className="w-4 h-4" /> {t.sendReminder}
          </button>
          <div className="relative">
            <button onClick={() => setMenuOpen(v => !v)}
              className="p-2.5 border border-[var(--border-core)] rounded-lg hover:bg-[var(--bg-panel-inner)] transition-colors">
              <MoreVertical className="w-4 h-4 text-[var(--text-sec)]" />
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 top-full mt-1 bg-[var(--bg-panel)] border border-[var(--border-core)] rounded-xl shadow-xl py-1 z-10 w-48"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button onClick={() => { setModal('agreement'); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors">
                  <FileText className="w-4 h-4" /> {isAm ? 'ስምምነት አፍጥር' : 'Generate Agreement'}
                </button>
                <button onClick={() => { setModal('delete'); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                  <Trash2 className="w-4 h-4" /> {t.deleteRecord}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact hero card */}
      <div className={`rounded-2xl p-6 text-white ${heroGradient}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-xl font-semibold text-white backdrop-blur-sm">
              {debt.contactAvatar}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{debt.contactName}</h2>
              <div className="flex items-center gap-1.5 mt-1 text-white/70 text-sm">
                <Phone className="w-3.5 h-3.5" /> {debt.contactPhone}
              </div>
              <div className="mt-2">
                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
                  {settled
                    ? <><CheckCircle className="w-3 h-3" /> {isAm ? 'ሙሉ በሙሉ ተከፍሏል' : 'Fully Settled'}</>
                    : overdue
                    ? <><AlertTriangle className="w-3 h-3" /> {Math.abs(daysUntil(debt.dueDate))} {isAm ? 'ቀናት አልፏል' : 'days overdue'}</>
                    : <><Clock className="w-3 h-3" /> {isAm ? `${daysUntil(debt.dueDate)} ቀናት ቀርቷል` : `Due in ${daysUntil(debt.dueDate)} days`}</>
                  }
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-xs mb-1">{t.outstandingBalance}</p>
            <p className="text-3xl font-semibold text-white">{fmt(bal)}</p>
            <p className="text-white/60 text-xs mt-1">{isAm ? 'ከ' : 'of'} {fmt(debt.amount)} {isAm ? 'ጠቅላላ' : 'total'}</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex justify-between text-xs text-white/60 mb-1.5">
            <span>{isAm ? 'የክፍያ ሂደት' : 'Payment progress'}</span>
            <span>{pct}% {isAm ? 'ተከፍሏል' : 'paid'}</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-5">
          {/* Debt details card */}
          <div className="bg-[var(--bg-panel)] rounded-xl p-5 shadow-sm border border-[var(--border-subtle)]">
            <h3 className="text-sm font-semibold text-[var(--text-core)] mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" /> {isAm ? 'የእዳ ዝርዝሮች' : 'Debt Details'}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-sec)]">{isAm ? 'ዓይነት' : 'Type'}</span>
                <span className="text-[var(--text-core)]">
                  {debt.type === 'receivable'
                    ? (isAm ? '↑ የሚሰበሰብ (እነሱ ያለብኝ)' : '↑ Receivable (they owe me)')
                    : (isAm ? '↓ የሚከፈል (ኔ ያለብኝ)' : '↓ Payable (I owe them)')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-sec)]">{isAm ? 'መጀመሪያ መጠን' : 'Original amount'}</span>
                <span className="text-[var(--text-core)] font-medium">{fmt(debt.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-sec)]">{t.paidSoFar}</span>
                <span className="text-green-500 font-medium">{fmt(debt.amountPaid)}</span>
              </div>
              <div className="flex justify-between border-t border-[var(--border-subtle)] pt-3">
                <span className="text-[var(--text-sec)]">{isAm ? 'ቀሪ ዕዳ' : 'Balance due'}</span>
                <span className={`font-medium ${bal > 0 ? 'text-red-500' : 'text-green-500'}`}>{fmt(bal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-sec)]">{t.dueDate}</span>
                <span className={`font-medium ${overdue && !settled ? 'text-red-500' : 'text-[var(--text-core)]'}`}>
                  {formatDate(debt.dueDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-sec)]">{isAm ? 'የተፈጠረበት' : 'Created'}</span>
                <span className="text-[var(--text-core)]">{formatDate(debt.createdDate)}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-[var(--bg-panel-inner)] rounded-lg border border-[var(--border-subtle)]">
              <p className="text-xs text-[var(--text-mute)] mb-0.5">{t.description}</p>
              <p className="text-sm text-[var(--text-core)]">{debt.description}</p>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-[var(--bg-panel)] rounded-xl p-5 shadow-sm border border-[var(--border-subtle)]">
            <h3 className="text-sm font-semibold text-[var(--text-core)] mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-500" /> {t.paymentHistory}
              <span className="ml-auto text-xs bg-[var(--bg-panel-inner)] text-[var(--text-sec)] px-2 py-0.5 rounded-full">
                {debt.paymentHistory.length}
              </span>
            </h3>

            {debt.paymentHistory.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-mute)]">
                <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm">{t.noPayments}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {debt.paymentHistory.map(p => {
                  const Icon = METHOD_ICONS[p.method];
                  return (
                    <div key={p.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-[var(--text-core)] capitalize font-medium">{p.method}</p>
                            {p.note && <p className="text-xs text-[var(--text-sec)] mt-0.5">{p.note}</p>}
                          </div>
                          <div className="text-right shrink-0 ml-3">
                            <p className="text-sm text-green-500 font-medium">{fmt(p.amount)}</p>
                            <p className="text-xs text-[var(--text-mute)]">{formatDate(p.date)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!settled && (
              <button onClick={() => setModal('payment')}
                className="mt-4 w-full py-2 border-2 border-dashed border-[var(--border-core)] rounded-xl text-sm text-[var(--text-sec)] hover:border-indigo-500/50 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> {isAm ? 'ክፍያ መዝግብ' : 'Record a payment'}
              </button>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Payment Schedule */}
          <div className="bg-[var(--bg-panel)] rounded-xl p-5 shadow-sm border border-[var(--border-subtle)]">
            <h3 className="text-sm font-semibold text-[var(--text-core)] mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" /> {isAm ? 'የክፍያ መርሃ ግብር' : 'Payment Schedule'}
            </h3>
            <div className="space-y-3">
              <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                settled ? 'border-green-500/30 bg-green-500/10' : overdue ? 'border-red-500/30 bg-red-500/10' : 'border-indigo-500/30 bg-indigo-500/10'
              }`}>
                <div>
                  <p className={`text-sm font-medium ${settled ? 'text-green-500' : overdue ? 'text-red-500' : 'text-indigo-500'}`}>
                    {settled ? (isAm ? 'ሙሉ ተከፍሏል' : 'Fully settled') : overdue ? (isAm ? 'ጊዜ ያለፈበት' : 'OVERDUE') : (isAm ? 'የሚከፈልበት ቀን' : 'Due date')}
                  </p>
                  <p className={`text-xs mt-0.5 ${settled ? 'text-green-500/70' : overdue ? 'text-red-500/70' : 'text-indigo-500/70'}`}>
                    {formatDate(debt.dueDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${settled ? 'text-green-500' : overdue ? 'text-red-500' : 'text-indigo-500'}`}>
                    {settled ? '✓ ' : ''}{fmt(bal)}
                  </p>
                  <p className={`text-xs mt-0.5 ${settled ? 'text-green-500/70' : overdue ? 'text-red-500/70' : 'text-indigo-500/70'}`}>
                    {isAm ? 'ቀሪ' : 'remaining'}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-3 text-xs text-[var(--text-mute)] mb-2">
                  <span>{isAm ? 'ተፈጠረ' : 'Created'} {formatDate(debt.createdDate)}</span>
                  <div className="flex-1 h-px bg-[var(--border-subtle)]" />
                  <span className={overdue && !settled ? 'text-red-500' : ''}>
                    {isAm ? 'ቀን' : 'Due'} {formatDate(debt.dueDate)}
                  </span>
                </div>
                <div className="relative h-2 bg-[var(--bg-panel-inner)] rounded-full overflow-hidden">
                  {(() => {
                    const start = new Date(debt.createdDate).getTime();
                    const end   = new Date(debt.dueDate).getTime();
                    const now   = new Date(TODAY).getTime();
                    const elapsed = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
                    return (
                      <>
                        <div className={`absolute h-full rounded-full ${overdue && !settled ? 'bg-red-400' : 'bg-indigo-400'}`}
                          style={{ width: `${elapsed}%` }} />
                        <div className="absolute h-full rounded-full bg-green-500"
                          style={{ width: `${pct}%`, opacity: 0.7 }} />
                      </>
                    );
                  })()}
                </div>
                <div className="flex justify-between text-xs text-[var(--text-mute)] mt-1">
                  <span>{isAm ? 'ያለፈ ጊዜ' : 'Time elapsed'}</span>
                  <span>{isAm ? 'ተከፍሏል' : 'Paid'} {pct}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* SMS Log */}
          <div className="bg-[var(--bg-panel)] rounded-xl p-5 shadow-sm border border-[var(--border-subtle)]">
            <h3 className="text-sm font-semibold text-[var(--text-core)] mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-500" /> {t.smsRemindersLog}
              <span className="ml-auto text-xs bg-[var(--bg-panel-inner)] text-[var(--text-sec)] px-2 py-0.5 rounded-full">
                {debt.smsLog.length}
              </span>
            </h3>

            {debt.smsLog.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-mute)]">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm">{t.noSms}</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {debt.smsLog.map(sms => (
                  <div key={sms.id} className="bg-[var(--bg-panel-inner)] rounded-xl p-3 border border-[var(--border-subtle)]">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          sms.status === 'delivered' ? 'bg-green-500' :
                          sms.status === 'sent'      ? 'bg-blue-400' : 'bg-red-400'
                        }`} />
                        <span className="text-xs text-[var(--text-sec)] capitalize">{sms.status}</span>
                      </div>
                      <span className="text-xs text-[var(--text-mute)]">{sms.date} · {sms.time}</span>
                    </div>
                    <p className="text-xs text-[var(--text-core)] leading-relaxed">{sms.message}</p>
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => setModal('sms')}
              className="mt-4 w-full py-2 border-2 border-dashed border-[var(--border-core)] rounded-xl text-sm text-[var(--text-sec)] hover:border-indigo-500/50 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2">
              <Bell className="w-4 h-4" /> {t.sendReminder}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
