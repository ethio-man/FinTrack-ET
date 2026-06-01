import React, { useState } from 'react';
import { ArrowLeft, Maximize2, MessageSquare, Printer, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Invoice, InvoiceStatus, STATUS_META, calcInvoice, fmt, fmtDate } from './mockData';
import { SendSmsModal, FullScreenPreview } from './Modals';
import { InvoiceDocument } from './InvoiceDocument';
import { translations } from './translations';
import { LanguageOpt } from '../../types';

export default function InvoiceDetailView({ inv: initialInv, onBack, onEdit, onDelete, language }: {
  inv: Invoice; onBack: () => void; onEdit: () => void; onDelete: (id: string) => void; language: LanguageOpt;
}) {
  const [inv, setInv] = useState(initialInv);
  const [smsOpen, setSmsOpen] = useState(false);
  const [fullPreview, setFullPreview] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const t = translations[language.code as keyof typeof translations] || translations.en;
  const { total } = calcInvoice(inv);
  const meta = STATUS_META[inv.status];

  function markAs(status: InvoiceStatus) {
    setInv(v => ({ ...v, status }));
    setMenuOpen(false);
  }

  return (
    <>
      {smsOpen && <SendSmsModal inv={inv} onClose={() => setSmsOpen(false)} language={language} />}
      {fullPreview && <FullScreenPreview inv={inv} onClose={() => setFullPreview(false)} language={language} />}

      <div className="max-w-[900px] mx-auto space-y-6">
        {/* Back + actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-[var(--text-sec)] hover:text-[var(--text-core)] transition-colors bg-[var(--bg-panel)] px-4 py-2.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-panel-inner)] shadow-sm">
            <ArrowLeft className="w-4 h-4" /> {t.backToInvoices}
          </button>
          <div className="flex flex-wrap gap-2 relative w-full sm:w-auto">
            <button onClick={() => setFullPreview(true)} className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[var(--border-core)] rounded-lg text-sm font-medium text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors shadow-sm flex-1 sm:flex-none">
              <Maximize2 className="w-4 h-4" /> <span className="hidden sm:inline">{t.preview}</span>
            </button>
            <button onClick={() => setSmsOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[var(--border-core)] rounded-lg text-sm font-medium text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors shadow-sm flex-1 sm:flex-none">
              <MessageSquare className="w-4 h-4 text-blue-500" /> <span className="hidden sm:inline">{t.sendSms}</span>
            </button>
            <button onClick={() => window.print()} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm flex-1 sm:flex-none">
              <Printer className="w-4 h-4" /> <span className="hidden sm:inline">{t.printPdf}</span>
            </button>
            <div className="relative">
              <button onClick={() => setMenuOpen(v => !v)} className="p-2.5 border border-[var(--border-core)] rounded-lg hover:bg-[var(--bg-panel-inner)] transition-colors shadow-sm h-full bg-[var(--bg-panel)]">
                <MoreVertical className="w-4 h-4 text-[var(--text-sec)]" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-[var(--bg-panel)] border border-[var(--border-core)] rounded-xl shadow-xl py-1.5 z-20 w-48" onMouseLeave={() => setMenuOpen(false)}>
                  <p className="px-4 py-2 text-[11px] font-bold text-[var(--text-mute)] uppercase tracking-wide">{t.markAs}</p>
                  {(['draft', 'sent', 'paid', 'overdue'] as InvoiceStatus[]).filter(s => s !== inv.status).map(s => (
                    <button key={s} onClick={() => markAs(s)}
                      className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-[var(--bg-panel-inner)] transition-colors font-medium ${STATUS_META[s].text}`}>
                      {React.createElement(STATUS_META[s].icon, { className: 'w-4 h-4' })} {t[s as keyof typeof t] || STATUS_META[s].label}
                    </button>
                  ))}
                  <div className="border-t border-[var(--border-subtle)] my-1 pt-1">
                    <button onClick={onEdit} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors font-medium">
                      <Edit2 className="w-4 h-4 text-[var(--text-sec)]" /> {t.edit}
                    </button>
                    <button onClick={() => { onDelete(inv.id); onBack(); }} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors font-medium">
                      <Trash2 className="w-4 h-4" /> {t.delete}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status + amount header */}
        <div className={`rounded-2xl p-6 lg:p-8 flex items-center justify-between shadow-sm border border-[var(--border-subtle)] ${meta.bg}`} style={{ borderLeft: `6px solid ${meta.hex}` }}>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border bg-[var(--bg-panel)] shadow-sm`} style={{ borderColor: meta.hex + '40', color: meta.hex }}>
                {React.createElement(meta.icon, { className: 'w-4 h-4' })} {t[inv.status as keyof typeof t] || meta.label}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-core)] tracking-tight">{inv.number}</h2>
            <p className="text-sm font-medium text-[var(--text-sec)] mt-1.5">{inv.customer} · <span className="opacity-70">{t.due}</span> {fmtDate(inv.dueDate)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-[var(--text-mute)] uppercase tracking-wide mb-1.5">Invoice Total</p>
            <p className="text-3xl lg:text-4xl font-bold text-[var(--text-core)] tracking-tight">{fmt(total)}</p>
          </div>
        </div>

        {/* Invoice document */}
        <div className="shadow-2xl rounded-2xl overflow-hidden border border-[var(--border-subtle)]">
          <InvoiceDocument inv={inv} full language={language} />
        </div>
      </div>
    </>
  );
}
