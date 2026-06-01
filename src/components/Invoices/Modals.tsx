import React, { useState } from 'react';
import { X, Send, Check, Printer } from 'lucide-react';
import { Invoice, calcInvoice, fmt, fmtDate, initials } from './mockData';
import { InvoiceDocument } from './InvoiceDocument';
import { translations } from './translations';
import { LanguageOpt } from '../../types';

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`bg-[var(--bg-panel)] rounded-2xl shadow-2xl w-full ${wide ? 'max-w-2xl' : 'max-w-md'} border border-[var(--border-core)] overflow-hidden my-auto`}>
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

export function SendSmsModal({ inv, onClose, language }: { inv: Invoice; onClose: () => void; language: LanguageOpt }) {
  const { total } = calcInvoice(inv);
  const t = translations[language.code as keyof typeof translations] || translations.en;
  const initialMsg = language.code === 'am' 
    ? `ውድ ${inv.customer.split(' ')[0]}፣ የደረሰኝ ቁጥር ${inv.number} መጠን ${fmt(total)} ክፍያ ቀን ${fmtDate(inv.dueDate)} ነው። እባክዎ ክፍያውን ይፈጽሙ። FinanceTrack`
    : `Dear ${inv.customer.split(' ')[0]}, invoice ${inv.number} for ${fmt(total)} is due on ${fmtDate(inv.dueDate)}. Please arrange payment. FinanceTrack`;
    
  const [msg, setMsg] = useState(initialMsg);
  const [sent, setSent] = useState(false);

  return (
    <Modal title={t.sendSmsToCustomer} onClose={onClose}>
      <div className="space-y-4">
        <div className="bg-[var(--bg-panel-inner)] rounded-xl p-3 flex items-center gap-3 border border-[var(--border-subtle)]">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">{initials(inv.customer)}</div>
          <div>
            <p className="text-sm font-medium text-[var(--text-core)]">{inv.customer}</p>
            <p className="text-xs text-[var(--text-sec)]">{inv.customerPhone}</p>
          </div>
        </div>
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.message}</label>
          <textarea rows={4} value={msg} onChange={e => setMsg(e.target.value)}
            className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none" />
          <p className="text-xs text-[var(--text-mute)] mt-1">{msg.length} {t.chars}</p>
        </div>
        {sent && <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-600 rounded-lg px-3 py-2 text-sm font-medium"><Check className="w-4 h-4" /> {t.smsSent}</div>}
        <div className="flex gap-3">
          <button onClick={() => { setSent(true); setTimeout(onClose, 1200); }} disabled={sent}
            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
            <Send className="w-4 h-4" /> {t.sendSms}
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 border border-[var(--border-core)] text-[var(--text-core)] rounded-xl text-sm font-medium hover:bg-[var(--bg-panel-inner)] transition-colors">{t.cancel}</button>
        </div>
      </div>
    </Modal>
  );
}

export function FullScreenPreview({ inv, onClose, language }: { inv: Invoice; onClose: () => void; language: LanguageOpt }) {
  const t = translations[language.code as keyof typeof translations] || translations.en;
  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/90 backdrop-blur-sm flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 bg-gray-950 border-b border-gray-800">
        <p className="text-white text-sm font-medium">{t.invoicePreviewTitle} — {inv.number}</p>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            <Printer className="w-4 h-4" /> {t.printOrPdf}
          </button>
          <button onClick={onClose} className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"><X className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-8 flex justify-center">
        <div className="w-full max-w-2xl shadow-2xl">
          <InvoiceDocument inv={inv} full language={language} />
        </div>
      </div>
    </div>
  );
}
