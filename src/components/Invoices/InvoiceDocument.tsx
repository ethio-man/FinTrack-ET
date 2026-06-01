import React from 'react';
import { Invoice, calcInvoice, fmtDate, STATUS_META } from './mockData';
import { translations } from './translations';
import { LanguageOpt } from '../../types';

export function InvoiceDocument({ inv, full = false, language }: { inv: Invoice; full?: boolean; language: LanguageOpt }) {
  const { subtotal, discountAmount, vatAmount, total } = calcInvoice(inv);
  const isOverdue = inv.status === 'overdue';
  const isPaid    = inv.status === 'paid';

  const t = translations[language.code as keyof typeof translations] || translations.en;

  return (
    <div className={`bg-white relative ${full ? '' : 'text-xs'}`} style={{ fontFamily: 'sans-serif', color: '#111' }}>
      {/* Status watermark */}
      {(isPaid || isOverdue) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          style={{ transform: 'rotate(-30deg)' }}>
          <span className={`text-6xl select-none ${isPaid ? 'text-green-200' : 'text-red-200'}`}
            style={{ opacity: 0.35, fontWeight: 900, letterSpacing: 4 }}>
            {isPaid ? t.paid.toUpperCase() : t.overdue.toUpperCase()}
          </span>
        </div>
      )}

      {/* Header band */}
      <div className="flex items-start justify-between p-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold" style={{ fontSize: 12 }}>
              FT
            </div>
            <div>
              <p className={`${full ? 'text-base' : 'text-xs'} text-gray-900 font-semibold`}>FinanceTrack Business</p>
              <p className="text-gray-500" style={{ fontSize: full ? 11 : 9 }}>business@financetrack.co · +251 900 000 000</p>
            </div>
          </div>
          <p className="text-gray-500" style={{ fontSize: full ? 11 : 9 }}>Bole Sub-city, Addis Ababa, Ethiopia</p>
        </div>
        <div className="text-right">
          <p className={`${full ? 'text-3xl' : 'text-lg'} text-indigo-600 font-bold tracking-widest`}>{t.invoicePreviewTitle?.split(' ')[0]?.toUpperCase() || 'INVOICE'}</p>
          <p className={`text-gray-600 mt-1 ${full ? 'text-sm' : 'text-xs'}`}>{inv.number || 'INV-XXXX'}</p>
          <div className={`mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium ${STATUS_META[inv.status].bg} ${STATUS_META[inv.status].text}`} style={{ fontSize: full ? 11 : 9 }}>
            {t[inv.status] || inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="flex justify-end gap-6 px-6 pt-4 pb-2">
        {[
          { label: t.invoiceDate, val: fmtDate(inv.date) },
          { label: t.paymentTerms, val: inv.paymentTerms || '—' },
          { label: t.dueDate, val: fmtDate(inv.dueDate) },
        ].map(({ label, val }) => (
          <div key={label} className="text-right">
            <p className="text-gray-400 font-medium uppercase tracking-wide" style={{ fontSize: full ? 10 : 8 }}>{label}</p>
            <p className={`text-gray-800 font-medium ${full ? 'text-sm' : 'text-xs'}`}>{val}</p>
          </div>
        ))}
      </div>

      {/* Bill From / Bill To */}
      <div className="grid grid-cols-2 gap-4 px-6 py-4 bg-gray-50/80">
        <div>
          <p className="text-gray-400 font-medium uppercase tracking-wide mb-1" style={{ fontSize: full ? 10 : 8 }}>{t.from}</p>
          <p className={`text-gray-800 font-semibold ${full ? 'text-sm' : 'text-xs'}`}>FinanceTrack Business</p>
          <p className="text-gray-500" style={{ fontSize: full ? 11 : 9 }}>Bole Sub-city, Addis Ababa</p>
          <p className="text-gray-500" style={{ fontSize: full ? 11 : 9 }}>TIN: 1234567890</p>
        </div>
        <div>
          <p className="text-gray-400 font-medium uppercase tracking-wide mb-1" style={{ fontSize: full ? 10 : 8 }}>{t.billTo}</p>
          <p className={`text-gray-800 font-semibold ${full ? 'text-sm' : 'text-xs'}`}>{inv.customer || t.customer}</p>
          {inv.customerPhone && <p className="text-gray-500" style={{ fontSize: full ? 11 : 9 }}>{inv.customerPhone}</p>}
          {inv.customerEmail && <p className="text-gray-500" style={{ fontSize: full ? 11 : 9 }}>{inv.customerEmail}</p>}
          {inv.customerAddress && <p className="text-gray-500" style={{ fontSize: full ? 11 : 9 }}>{inv.customerAddress}</p>}
        </div>
      </div>

      {/* Line items */}
      <div className="px-6 pt-4 min-h-[160px]">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '2px solid #6366f1' }}>
              {['#', t.productName, t.qty, t.unitPrice, t.total].map((h, i) => (
                <th key={h} className={`pb-2 text-indigo-700 font-semibold ${i === 1 ? 'text-left' : 'text-right'} ${i === 0 ? 'text-left w-6' : ''}`}
                  style={{ fontSize: full ? 11 : 9 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inv.items.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-6 italic" style={{ fontSize: full ? 12 : 10 }}>{t.addItemsPrompt}</td>
              </tr>
            ) : inv.items.map((it, idx) => (
              <tr key={it.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td className="py-2.5 text-gray-400 font-medium" style={{ fontSize: full ? 11 : 9 }}>{idx + 1}</td>
                <td className="py-2.5 text-left">
                  <p className="text-gray-800 font-medium" style={{ fontSize: full ? 12 : 10 }}>{it.product || t.productName}</p>
                  {it.description && <p className="text-gray-500" style={{ fontSize: full ? 10 : 8 }}>{it.description}</p>}
                </td>
                <td className="py-2.5 text-right text-gray-700 font-medium" style={{ fontSize: full ? 11 : 9 }}>{it.qty}</td>
                <td className="py-2.5 text-right text-gray-700 font-medium" style={{ fontSize: full ? 11 : 9 }}>{it.unitPrice.toLocaleString()}</td>
                <td className="py-2.5 text-right text-gray-900 font-semibold" style={{ fontSize: full ? 11 : 9 }}>{(it.qty * it.unitPrice).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals block */}
      <div className="px-6 pt-4 pb-6 flex justify-end">
        <div className="w-56 space-y-2">
          <div className="flex justify-between text-gray-600" style={{ fontSize: full ? 12 : 9 }}>
            <span>{t.subtotal}</span><span className="font-medium">{subtotal.toLocaleString()}</span>
          </div>
          {inv.discountPct > 0 && (
            <div className="flex justify-between text-red-500" style={{ fontSize: full ? 12 : 9 }}>
              <span>{t.discount} ({inv.discountPct}%)</span><span className="font-medium">-{discountAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          )}
          {inv.vatEnabled && (
            <div className="flex justify-between text-gray-600" style={{ fontSize: full ? 12 : 9 }}>
              <span>{t.vat} ({inv.vatPct}%)</span><span className="font-medium">{vatAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          )}
          <div className="flex justify-between text-indigo-700 pt-2 mt-1" style={{ fontSize: full ? 14 : 11, borderTop: '2px solid #6366f1' }}>
            <span className="font-bold">{t.total} (ETB)</span><span className="font-bold">{total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
        </div>
      </div>

      {/* Notes / Terms */}
      {(inv.notes || inv.terms) && (
        <div className="px-6 pb-6 grid grid-cols-2 gap-6 border-t border-gray-100 pt-4">
          {inv.notes && (
            <div>
              <p className="text-gray-400 font-medium uppercase tracking-wide mb-1" style={{ fontSize: full ? 10 : 8 }}>{t.notesTitle}</p>
              <p className="text-gray-600 leading-relaxed" style={{ fontSize: full ? 11 : 9 }}>{inv.notes}</p>
            </div>
          )}
          {inv.terms && (
            <div>
              <p className="text-gray-400 font-medium uppercase tracking-wide mb-1" style={{ fontSize: full ? 10 : 8 }}>{t.paymentTerms.toUpperCase()}</p>
              <p className="text-gray-600 leading-relaxed" style={{ fontSize: full ? 11 : 9 }}>{inv.terms}</p>
            </div>
          )}
        </div>
      )}

      {/* Footer bar */}
      <div className="h-1.5 w-full mt-auto" style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
    </div>
  );
}
