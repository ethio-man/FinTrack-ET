import React, { useState } from 'react';
import { X, Check, Send, Download, AlertTriangle } from 'lucide-react';
import { Payment, Debt, balance, fmt, formatDate, daysUntil, isOverdue, TODAY, METHOD_ICONS } from './mockData';
import { LanguageOpt } from '../../types';
import { translations } from './translations';
import { Avatar } from './DebtComponents';

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[var(--bg-panel)] rounded-2xl shadow-2xl w-full max-w-md border border-[var(--border-core)] overflow-hidden my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-panel-inner)] sticky top-0">
          <h3 className="text-base font-semibold text-[var(--text-core)]">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-[var(--border-subtle)] rounded-lg transition-colors">
            <X className="w-4 h-4 text-[var(--text-sec)]" />
          </button>
        </div>
        <div className="px-6 py-5 bg-[var(--bg-panel)] overflow-y-auto max-h-[70vh]">{children}</div>
      </div>
    </div>
  );
}

export function RecordPaymentModal({ debt, onClose, onSave, language }: { debt: Debt; onClose: () => void; onSave: (p: Payment) => void; language: LanguageOpt }) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'cash' | 'telebirr' | 'bank'>('cash');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(TODAY);
  const [err, setErr] = useState('');

  const t = translations[language.code as keyof typeof translations] || translations.en;

  function save() {
    const n = parseFloat(amount);
    if (!n || n <= 0) { setErr(t.errValidAmount); return; }
    if (n > balance(debt)) { setErr(`${t.errAmountExceeds} (${fmt(balance(debt))}).`); return; }
    onSave({ id: 'p-new-' + Date.now(), date, amount: n, method, note });
    onClose();
  }

  return (
    <Modal title={t.recordPayment} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-[var(--text-sec)]">{t.outstandingBalance}</span>
            <span className="text-red-500 font-medium">{fmt(balance(debt))}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.amountEtb} <span className="text-red-500">*</span></label>
          <input
            type="number" min="0" step="0.01" placeholder="0.00"
            value={amount} onChange={e => { setAmount(e.target.value); setErr(''); }}
            className="w-full px-4 py-2.5 border border-[var(--border-core)] rounded-lg text-sm bg-[var(--bg-panel)] text-[var(--text-core)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          {err && <p className="text-xs text-red-500 mt-1">{err}</p>}
        </div>

        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.paymentMethod}</label>
          <div className="grid grid-cols-3 gap-2">
            {(['cash', 'telebirr', 'bank'] as const).map(m => {
              const Icon = METHOD_ICONS[m];
              return (
                <button key={m}
                  onClick={() => setMethod(m)}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 text-xs capitalize transition-colors ${
                    method === m ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500' : 'border-[var(--border-core)] text-[var(--text-sec)] hover:border-[var(--border-subtle)]'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {m}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.date}</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="w-full px-4 py-2.5 border border-[var(--border-core)] rounded-lg text-sm bg-[var(--bg-panel)] text-[var(--text-core)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.noteOpt}</label>
          <input placeholder="..."
            value={note} onChange={e => setNote(e.target.value)}
            className="w-full px-4 py-2.5 border border-[var(--border-core)] rounded-lg text-sm bg-[var(--bg-panel)] text-[var(--text-core)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={save} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            {t.savePayment}
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 border border-[var(--border-core)] text-[var(--text-core)] rounded-xl text-sm hover:bg-[var(--bg-panel-inner)] transition-colors">
            {t.cancel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function SmsModal({ debt, onClose, onSend, language }: { debt: Debt; onClose: () => void; onSend: (msg: string) => void; language: LanguageOpt }) {
  const t = translations[language.code as keyof typeof translations] || translations.en;
  
  const defaultMsg = isOverdue(debt)
    ? `Dear ${debt.contactName.split(' ')[0]}, your balance of ${fmt(balance(debt))} is ${Math.abs(daysUntil(debt.dueDate))} days overdue. Please contact us to arrange payment. FinanceTrack`
    : `Dear ${debt.contactName.split(' ')[0]}, a payment of ${fmt(balance(debt))} is due on ${formatDate(debt.dueDate)}. Please arrange payment on time. FinanceTrack`;
  
  const [msg, setMsg] = useState(defaultMsg);
  const [sent, setSent] = useState(false);

  function send() {
    onSend(msg);
    setSent(true);
    setTimeout(onClose, 1200);
  }

  return (
    <Modal title={t.sendSmsReminder} onClose={onClose}>
      <div className="space-y-4">
        <div className="bg-[var(--bg-panel-inner)] rounded-xl p-3 flex items-center gap-3 border border-[var(--border-subtle)]">
          <Avatar initials={debt.contactAvatar} size="sm" />
          <div>
            <p className="text-sm font-medium text-[var(--text-core)]">{debt.contactName}</p>
            <p className="text-xs text-[var(--text-sec)]">{debt.contactPhone}</p>
          </div>
        </div>
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.message}</label>
          <textarea rows={5} value={msg} onChange={e => setMsg(e.target.value)}
            className="w-full px-4 py-2.5 border border-[var(--border-core)] rounded-lg text-sm bg-[var(--bg-panel)] text-[var(--text-core)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
          />
          <p className="text-xs text-[var(--text-mute)] mt-1">{msg.length} {t.characters}</p>
        </div>
        {sent && (
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg px-3 py-2 text-sm">
            <Check className="w-4 h-4" /> {t.smsSentTo} {debt.contactPhone}
          </div>
        )}
        <div className="flex gap-3 pt-2">
          <button onClick={send} disabled={sent}
            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 shadow-sm"
          >
            <Send className="w-4 h-4" /> {t.sendSms}
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 border border-[var(--border-core)] text-[var(--text-core)] rounded-xl text-sm hover:bg-[var(--bg-panel-inner)] transition-colors">
            {t.cancel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function AddDebtModal({ type, onClose, onAdd, language }: { type: 'receivable' | 'payable'; onClose: () => void; onAdd: (d: Debt) => void; language: LanguageOpt }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [desc, setDesc] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const t = translations[language.code as keyof typeof translations] || translations.en;

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = t.errNameReq;
    if (!amount || isNaN(+amount) || +amount <= 0) e.amount = t.errValidAmount;
    if (!dueDate) e.dueDate = t.errDueDateReq;
    return e;
  }

  function save() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const initials = name.trim().split(' ').slice(0, 2).map(w => w[0].toUpperCase()).join('');
    onAdd({
      id: 'DBT-' + Date.now(),
      type,
      contactName: name.trim(),
      contactPhone: phone.trim() || 'N/A',
      contactAvatar: initials,
      amount: parseFloat(amount),
      amountPaid: 0,
      dueDate,
      createdDate: TODAY,
      description: desc.trim() || 'No description provided.',
      paymentHistory: [],
      smsLog: [],
    });
    onClose();
  }

  const label = type === 'receivable' ? t.customerName : t.supplierName;

  return (
    <Modal title={t.addDebt} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{label} <span className="text-red-500">*</span></label>
          <input placeholder="..." value={name} onChange={e => { setName(e.target.value); setErrors(v => ({ ...v, name: '' })); }}
            className="w-full px-4 py-2.5 border border-[var(--border-core)] rounded-lg text-sm bg-[var(--bg-panel)] text-[var(--text-core)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.phoneNumber}</label>
          <input placeholder="+251 9XX XXX XXX" value={phone} onChange={e => setPhone(e.target.value)}
            className="w-full px-4 py-2.5 border border-[var(--border-core)] rounded-lg text-sm bg-[var(--bg-panel)] text-[var(--text-core)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.amountEtb} <span className="text-red-500">*</span></label>
          <input type="number" min="0" step="0.01" placeholder="0.00" value={amount}
            onChange={e => { setAmount(e.target.value); setErrors(v => ({ ...v, amount: '' })); }}
            className="w-full px-4 py-2.5 border border-[var(--border-core)] rounded-lg text-sm bg-[var(--bg-panel)] text-[var(--text-core)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
        </div>
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.dueDate} <span className="text-red-500">*</span></label>
          <input type="date" value={dueDate} onChange={e => { setDueDate(e.target.value); setErrors(v => ({ ...v, dueDate: '' })); }}
            className="w-full px-4 py-2.5 border border-[var(--border-core)] rounded-lg text-sm bg-[var(--bg-panel)] text-[var(--text-core)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>}
        </div>
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.description}</label>
          <textarea rows={2} placeholder="..." value={desc} onChange={e => setDesc(e.target.value)}
            className="w-full px-4 py-2.5 border border-[var(--border-core)] rounded-lg text-sm bg-[var(--bg-panel)] text-[var(--text-core)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={save} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            {t.addDebt}
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 border border-[var(--border-core)] text-[var(--text-core)] rounded-xl text-sm hover:bg-[var(--bg-panel-inner)] transition-colors">
            {t.cancel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function AgreementModal({ debt, onClose, language }: { debt: Debt; onClose: () => void; language: LanguageOpt }) {
  const t = translations[language.code as keyof typeof translations] || translations.en;

  return (
    <Modal title={t.paymentAgreement} onClose={onClose}>
      <div className="space-y-4">
        <div className="bg-[var(--bg-panel-inner)] rounded-xl p-5 text-sm leading-relaxed text-[var(--text-core)] border border-[var(--border-core)]" style={{ fontFamily: 'serif' }}>
          <p className="text-center mb-4 text-base font-bold">{t.paymentAgreement}</p>
          <p>{t.agreementText1} <strong>{formatDate(TODAY)}</strong> {t.between}</p>
          <br />
          <p><strong>FinanceTrack Business</strong> {t.creditor}</p>
          <p><strong>{debt.contactName}</strong> — {debt.contactPhone} {t.debtor}</p>
          <br />
          <p>{t.agreementText2} <strong>{fmt(balance(debt))}</strong> {t.by} <strong>{formatDate(debt.dueDate)}</strong>.</p>
          <br />
          <p>{t.reference} {debt.description}</p>
          <br />
          <div className="flex gap-12 mt-6">
            <div>
              <div className="border-b border-[var(--text-mute)] w-32 mb-1" />
              <p className="text-xs text-[var(--text-sec)]">{t.creditorSignature}</p>
            </div>
            <div>
              <div className="border-b border-[var(--text-mute)] w-32 mb-1" />
              <p className="text-xs text-[var(--text-sec)]">{t.debtorSignature}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={() => window.print()} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download className="w-4 h-4" /> {t.printSavePdf}
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 border border-[var(--border-core)] text-[var(--text-core)] rounded-xl text-sm hover:bg-[var(--bg-panel-inner)] transition-colors">
            {t.close}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function DeleteConfirmModal({ debt, onClose, onDelete, language }: { debt: Debt; onClose: () => void; onDelete: () => void; language: LanguageOpt }) {
  const t = translations[language.code as keyof typeof translations] || translations.en;

  return (
    <Modal title={t.deleteDebtRecord} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-500">
              {t.deleteWarning1} <strong>{debt.contactName}</strong> ({fmt(balance(debt))} {t.deleteWarning2}
            </p>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors shadow-sm">
            {t.delete}
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 border border-[var(--border-core)] text-[var(--text-core)] rounded-xl text-sm hover:bg-[var(--bg-panel-inner)] transition-colors">
            {t.cancel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
