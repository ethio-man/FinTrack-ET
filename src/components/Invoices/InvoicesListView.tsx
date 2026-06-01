import React, { useState, useMemo } from 'react';
import { Search, Download, Plus, FileText, CheckCircle, Clock, AlertTriangle, Eye, MessageSquare, MoreVertical, Edit2, Copy, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer } from 'recharts';
import { Invoice, InvoiceStatus, STATUS_META, calcInvoice, fmt, fmtDate, initials } from './mockData';
import { SendSmsModal, FullScreenPreview } from './Modals';
import { translations } from './translations';
import { LanguageOpt } from '../../types';

function InvoiceRow({ inv, onClick, onSms, onPreview, language }: { key?: React.Key; inv: Invoice; onClick: () => void; onSms: () => void; onPreview: () => void; language: LanguageOpt }) {
  const { total } = calcInvoice(inv);
  const meta = STATUS_META[inv.status];
  const Icon = meta.icon;
  const [menuOpen, setMenuOpen] = useState(false);
  const t = translations[language.code as keyof typeof translations] || translations.en;

  return (
    <div onClick={onClick}
      className="relative flex items-center gap-4 px-5 py-4 border-b border-[var(--border-subtle)] hover:bg-[var(--bg-panel-inner)] transition-colors cursor-pointer group"
      style={{ borderLeft: `4px solid ${meta.hex}` }}>

      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium shrink-0 shadow-sm">{initials(inv.customer)}</div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-medium text-[var(--text-core)] truncate">{inv.customer}</span>
          <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${meta.bg} ${meta.text}`}>
            <Icon className="w-3 h-3" />{t[inv.status] || meta.label}
          </span>
        </div>
        <p className="text-xs text-[var(--text-mute)]">{inv.number} · {t.due} {fmtDate(inv.dueDate)}</p>
      </div>

      {/* Amount */}
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-[var(--text-core)]">{fmt(total)}</p>
        <p className="text-xs text-[var(--text-sec)]">{fmtDate(inv.date)}</p>
      </div>

      {/* Hover actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" onClick={e => e.stopPropagation()}>
        <button title={t.preview} onClick={onPreview} className="p-1.5 hover:bg-indigo-500/10 rounded-lg text-indigo-500 transition-colors"><Eye className="w-4 h-4" /></button>
        <button title={t.sendSms} onClick={onSms} className="p-1.5 hover:bg-blue-500/10 rounded-lg text-blue-500 transition-colors"><MessageSquare className="w-4 h-4" /></button>
        <div className="relative">
          <button onClick={() => setMenuOpen(v => !v)} className="p-1.5 hover:bg-[var(--border-subtle)] rounded-lg text-[var(--text-sec)] transition-colors"><MoreVertical className="w-4 h-4" /></button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 bg-[var(--bg-panel)] border border-[var(--border-core)] rounded-xl shadow-xl py-1.5 z-20 w-36" onMouseLeave={() => setMenuOpen(false)}>
              <button onClick={() => setMenuOpen(false)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors font-medium"><Edit2 className="w-4 h-4 text-[var(--text-sec)]" /> {t.edit}</button>
              <button onClick={() => setMenuOpen(false)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors font-medium"><Copy className="w-4 h-4 text-[var(--text-sec)]" /> {t.duplicate}</button>
              <div className="border-t border-[var(--border-subtle)] my-1" />
              <button onClick={() => setMenuOpen(false)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors font-medium"><Trash2 className="w-4 h-4" /> {t.delete}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InvoicesListView({ invoices, onNew, onView, language }: { invoices: Invoice[]; onNew: () => void; onView: (id: string) => void; language: LanguageOpt }) {
  const [activeTab, setActiveTab] = useState<InvoiceStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [smsInv, setSmsInv] = useState<Invoice | null>(null);
  const [previewInv, setPreviewInv] = useState<Invoice | null>(null);

  const t = translations[language.code as keyof typeof translations] || translations.en;

  const filtered = invoices.filter(inv => {
    const matchTab = activeTab === 'all' || inv.status === activeTab;
    const q = search.toLowerCase();
    const matchSearch = inv.customer.toLowerCase().includes(q) || inv.number.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const totals = useMemo(() => {
    const all = invoices.map(inv => ({ ...inv, ...calcInvoice(inv) }));
    const totalInvoiced = all.reduce((s, inv) => s + inv.total, 0);
    const totalPaid     = all.filter(inv => inv.status === 'paid').reduce((s, inv) => s + inv.total, 0);
    const outstanding   = all.filter(inv => inv.status === 'sent' || inv.status === 'overdue').reduce((s, inv) => s + inv.total, 0);
    const overdue       = all.filter(inv => inv.status === 'overdue').reduce((s, inv) => s + inv.total, 0);
    const collectionPct = totalInvoiced > 0 ? (totalPaid / totalInvoiced) * 100 : 0;
    return { totalInvoiced, totalPaid, outstanding, overdue, collectionPct };
  }, [invoices]);

  const tabCounts: Record<string, number> = useMemo(() => {
    const counts: Record<string, number> = { all: invoices.length };
    (['draft', 'sent', 'paid', 'overdue'] as InvoiceStatus[]).forEach(s => {
      counts[s] = invoices.filter(inv => inv.status === s).length;
    });
    return counts;
  }, [invoices]);

  const barData = [{ name: 'Invoices', ...tabCounts }];

  function handleExport() {
    const rows = ['Number,Customer,Date,Due Date,Status,Total',
      ...invoices.map(inv => {
        const { total } = calcInvoice(inv);
        return `${inv.number},"${inv.customer}",${inv.date},${inv.dueDate},${inv.status},${total.toFixed(2)}`;
      })
    ].join('\n');
    const blob = new Blob([rows], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'invoices.csv'; a.click();
  }

  const COLS = ['draft', 'sent', 'paid', 'overdue'];

  return (
    <div className="space-y-6">
      {smsInv && <SendSmsModal inv={smsInv} onClose={() => setSmsInv(null)} language={language} />}
      {previewInv && <FullScreenPreview inv={previewInv} onClose={() => setPreviewInv(null)} language={language} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-core)] mb-1">{t.invoices}</h1>
          <p className="text-[var(--text-sec)] text-sm">{invoices.length} {t.invoices.toLowerCase()} · {tabCounts.paid} {t.paid.toLowerCase()}</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <button onClick={handleExport} className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[var(--border-core)] rounded-lg text-sm text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors">
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">{t.export}</span>
          </button>
          <button onClick={onNew} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> {t.createInvoice}
          </button>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Metric cards */}
        <div className="xl:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: t.totalInvoiced, value: totals.totalInvoiced, color: 'text-[var(--text-core)]', bg: 'bg-[var(--border-subtle)]', icon: FileText, iconColor: 'text-[var(--text-sec)]' },
            { label: t.collected,     value: totals.totalPaid,     color: 'text-green-500',          bg: 'bg-green-500/10',           icon: CheckCircle, iconColor: 'text-green-500' },
            { label: t.outstanding,   value: totals.outstanding,   color: 'text-blue-500',           bg: 'bg-blue-500/10',            icon: Clock, iconColor: 'text-blue-500' },
            { label: t.overdue,       value: totals.overdue,       color: 'text-red-500',            bg: 'bg-red-500/10',             icon: AlertTriangle, iconColor: 'text-red-500' },
          ].map(({ label, value, color, bg, icon: Icon, iconColor }) => (
            <div key={label} className="bg-[var(--bg-panel)] rounded-xl p-5 shadow-sm border border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-2.5 rounded-xl ${bg}`}><Icon className={`w-4 h-4 ${iconColor}`} /></div>
                <span className="text-xs font-medium text-[var(--text-sec)]">{label}</span>
              </div>
              <p className={`text-2xl font-bold tracking-tight ${color}`}>ETB {(value / 1000).toFixed(1)}k</p>
            </div>
          ))}
        </div>

        {/* Status distribution — horizontal bar chart */}
        <div className="bg-[var(--bg-panel)] rounded-xl p-6 shadow-sm border border-[var(--border-subtle)]">
          <p className="text-sm font-semibold text-[var(--text-core)] mb-0.5">{t.statusDistribution}</p>
          <p className="text-xs font-medium text-[var(--text-mute)] mb-4">{t.invoicesByStatus}</p>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" hide />
              <RTooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--border-core)', backgroundColor: 'var(--bg-panel)', color: 'var(--text-core)', fontSize: 12 }}
                formatter={(v: number, n: string) => [v, t[n as keyof typeof t] || STATUS_META[n as InvoiceStatus]?.label || n]} cursor={{ fill: 'transparent' }} />
              {COLS.map(s => (
                <Bar key={s} dataKey={s} stackId="a" fill={STATUS_META[s as InvoiceStatus].hex} radius={s === 'draft' ? [4, 0, 0, 4] : s === 'overdue' ? [0, 4, 4, 0] : [0, 0, 0, 0]} barSize={32} />
              ))}
            </BarChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-2">
            {COLS.map(s => (
              <div key={s} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded shadow-sm" style={{ background: STATUS_META[s as InvoiceStatus].hex }} />
                <span className="text-xs font-medium text-[var(--text-sec)]">{t[s as keyof typeof t] || STATUS_META[s as InvoiceStatus].label} ({tabCounts[s]})</span>
              </div>
            ))}
          </div>

          {/* Collection progress */}
          <div className="mt-5 pt-5 border-t border-[var(--border-subtle)]">
            <div className="flex justify-between text-xs font-medium text-[var(--text-sec)] mb-2">
              <span>{t.collectionRate}</span>
              <span className="text-indigo-500 font-bold">{totals.collectionPct.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-[var(--border-subtle)] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-green-500 rounded-full transition-all"
                style={{ width: `${totals.collectionPct}%` }} />
            </div>
            <p className="text-xs font-medium text-[var(--text-mute)] mt-2 text-center">ETB {(totals.totalPaid / 1000).toFixed(1)}k {t.of} ETB {(totals.totalInvoiced / 1000).toFixed(1)}k {t.collectedSuffix}</p>
          </div>
        </div>
      </div>

      {/* Tabs + search + Table */}
      <div className="bg-[var(--bg-panel)] rounded-xl shadow-sm border border-[var(--border-subtle)] overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between px-5 border-b border-[var(--border-subtle)] gap-4 py-2 sm:py-0">
          <div className="flex overflow-x-auto w-full sm:w-auto">
            {(['all', 'draft', 'sent', 'paid', 'overdue'] as const).map(tab => {
              const isSelected = activeTab === tab;
              const label = tab === 'all' ? t.all : (t[tab as keyof typeof t] || STATUS_META[tab].label);
              return (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 py-4 text-sm whitespace-nowrap border-b-2 transition-colors font-medium ${
                    isSelected ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-[var(--text-sec)] hover:text-[var(--text-core)]'
                  }`}>
                  {label}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isSelected ? 'bg-indigo-500/10 text-indigo-500' : 'bg-[var(--border-subtle)] text-[var(--text-mute)]'}`}>
                    {tabCounts[tab]}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="relative w-full sm:w-auto shrink-0 mb-3 sm:mb-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-mute)]" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full sm:w-56 pl-9 pr-4 py-2 border border-[var(--border-core)] bg-[var(--bg-panel)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
          </div>
        </div>

        {/* Invoice rows */}
        <div>
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-[var(--text-mute)] bg-[var(--bg-panel-inner)]">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium">{t.noInvoicesFound}</p>
            </div>
          ) : filtered.map(inv => (
            <InvoiceRow key={inv.id} inv={inv}
              onClick={() => onView(inv.id)}
              onSms={() => { setSmsInv(inv); }}
              onPreview={() => { setPreviewInv(inv); }}
              language={language}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
