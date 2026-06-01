import React, { useState } from 'react';
import { ArrowLeft, Plus, Tag, MoreVertical, Edit2, ToggleLeft, AlertTriangle, TrendingUp, DollarSign, Star, Layers } from 'lucide-react';
import { ComposedChart, Bar, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer } from 'recharts';
import { Product, StockEvent, EVENT_META, CAT_COLORS, stockStatus, fmt } from './mockData';
import { translations } from './translations';
import { StockGauge } from './Charts';
import { AddStockModal, AdjustPriceModal } from './Modals';
import { LanguageOpt } from '../../types';

export default function ProductDetail({ product: initialProduct, onBack, onUpdate, language }: {
  product: Product;
  onBack: () => void;
  onUpdate: (p: Product) => void;
  language: LanguageOpt;
}) {
  const [product, setProduct] = useState(initialProduct);
  const [modal, setModal] = useState<'stock' | 'price' | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const t = translations[language.code as keyof typeof translations] || translations.en;

  const st = stockStatus(product);
  const mu = Math.round(((product.sellingPrice - product.buyingPrice) / product.buyingPrice) * 100);
  const profitPerUnit = product.sellingPrice - product.buyingPrice;
  const monthlyRevenue = product.sellingPrice * product.unitsSoldThisMonth;
  const catColor = CAT_COLORS[product.category];

  function addStock(qty: number, note: string) {
    const newEvent: StockEvent = {
      id: 'sh-' + Date.now(), date: '2026-05-31', type: 'addition',
      qty, note, balanceAfter: product.stock + qty,
    };
    const updated = { ...product, stock: product.stock + qty, stockHistory: [newEvent, ...product.stockHistory] };
    setProduct(updated);
    onUpdate(updated);
  }

  function adjustPrice(buy: number, sell: number) {
    const updated = { ...product, buyingPrice: buy, sellingPrice: sell };
    setProduct(updated);
    onUpdate(updated);
  }

  function toggleStatus() {
    const updated = { ...product, status: product.status === 'active' ? 'inactive' as const : 'active' as const };
    setProduct(updated);
    onUpdate(updated);
  }

  const stockChartData = [...product.stockHistory].reverse().map(e => ({ date: e.date.slice(5), balance: e.balanceAfter, change: e.qty }));

  return (
    <div className="space-y-6">
      {modal === 'stock' && <AddStockModal product={product} onClose={() => setModal(null)} onAdd={addStock} language={language} />}
      {modal === 'price' && <AdjustPriceModal product={product} onClose={() => setModal(null)} onSave={adjustPrice} language={language} />}

      {/* Back + actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[var(--text-sec)] hover:text-[var(--text-core)] transition-colors bg-[var(--bg-panel)] px-4 py-2.5 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-panel-inner)] shadow-sm">
          <ArrowLeft className="w-4 h-4" /> {t.backToInventory}
        </button>
        <div className="flex gap-2 relative w-full sm:w-auto">
          <button onClick={() => setModal('stock')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> {t.addStock}
          </button>
          <button onClick={() => setModal('price')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-[var(--border-core)] rounded-lg text-sm font-medium text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors shadow-sm">
            <Tag className="w-4 h-4" /> {t.adjustPrice}
          </button>
          <div className="relative">
            <button onClick={() => setMenuOpen(v => !v)} className="p-2.5 border border-[var(--border-core)] rounded-lg hover:bg-[var(--bg-panel-inner)] transition-colors shadow-sm h-full">
              <MoreVertical className="w-4 h-4 text-[var(--text-sec)]" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 bg-[var(--bg-panel)] border border-[var(--border-core)] rounded-xl shadow-xl py-1.5 z-10 w-48" onMouseLeave={() => setMenuOpen(false)}>
                <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors font-medium">
                  <Edit2 className="w-4 h-4 text-[var(--text-sec)]" /> {t.editProduct}
                </button>
                <button onClick={() => { toggleStatus(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors font-medium">
                  <ToggleLeft className="w-4 h-4 text-[var(--text-sec)]" /> {product.status === 'active' ? t.deactivate : t.reactivate}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero banner */}
      <div className="rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden shadow-lg border border-[var(--border-subtle)]"
        style={{ background: `linear-gradient(135deg, ${catColor}ee 0%, ${catColor}cc 100%)` }}>
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'white', transform: 'translate(20%, -20%)' }} />
        <div className="absolute left-0 bottom-0 w-32 h-32 rounded-full opacity-10"
          style={{ background: 'white', transform: 'translate(-30%, 30%)' }} />
        
        <div className="flex flex-col md:flex-row md:items-start justify-between relative gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm shadow-sm">{product.category}</span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm shadow-sm ${product.status === 'active' ? 'bg-green-400/30 text-white' : 'bg-white/20 text-white/70'}`}>
                {product.status === 'active' ? t.active : t.inactive}
              </span>
              {st === 'low' && <span className="bg-amber-400/30 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10 backdrop-blur-sm shadow-sm"><AlertTriangle className="w-3.5 h-3.5" />{t.lowStock}</span>}
              {st === 'out' && <span className="bg-red-500/40 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10 backdrop-blur-sm shadow-sm"><AlertTriangle className="w-3.5 h-3.5" />{t.outOfStock}</span>}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight drop-shadow-sm">{product.name}</h2>
            <p className="text-white/80 text-sm font-medium">SKU: {product.sku} <span className="mx-2 opacity-50">•</span> {t.unit}: {product.unit}</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl shrink-0">
            <StockGauge product={product} language={language} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/20">
          {[
            { label: t.sellingPrice, value: fmt(product.sellingPrice) },
            { label: t.buyingPrice, value: fmt(product.buyingPrice) },
            { label: t.profitPerUnit, value: fmt(profitPerUnit) },
            { label: t.markup, value: `${mu}%` },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-white/70 text-xs font-medium mb-1 uppercase tracking-wider">{label}</p>
              <p className="text-white text-lg font-bold tracking-tight">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: t.unitsSoldThisMonth, value: product.unitsSoldThisMonth, suffix: ` ${t.units}`, icon: TrendingUp, iconColor: 'text-green-500', bg: 'bg-green-500/10' },
          { label: t.monthlyRevenue, value: monthlyRevenue, prefix: 'ETB ', icon: DollarSign, iconColor: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { label: t.monthlyProfit, value: profitPerUnit * product.unitsSoldThisMonth, prefix: 'ETB ', icon: Star, iconColor: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map(({ label, value, prefix, suffix, icon: Icon, iconColor, bg }) => (
          <div key={label} className="bg-[var(--bg-panel)] rounded-xl p-6 shadow-sm border border-[var(--border-subtle)] hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-xl ${bg}`}><Icon className={`w-5 h-5 ${iconColor}`} /></div>
              <span className="text-sm font-medium text-[var(--text-sec)]">{label}</span>
            </div>
            <p className="text-3xl font-bold text-[var(--text-core)] tracking-tight">{prefix ?? ''}{value.toLocaleString()}{suffix ?? ''}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Sales trend — ComposedChart (Bar + Line) */}
        <div className="bg-[var(--bg-panel)] rounded-xl p-6 shadow-sm border border-[var(--border-subtle)]">
          <p className="text-base font-semibold text-[var(--text-core)] mb-1">{t.weeklySalesTrend}</p>
          <p className="text-xs font-medium text-[var(--text-mute)] mb-6">{t.unitsSoldAndRevenue}</p>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={product.weeklySales} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={catColor} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={catColor} stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'var(--text-sec)' }} axisLine={false} tickLine={false} dy={10} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: 'var(--text-sec)' }} axisLine={false} tickLine={false} width={30} dx={-10} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: 'var(--text-sec)' }} axisLine={false} tickLine={false} width={40} dx={10}
                tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
              <RTooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--border-core)', backgroundColor: 'var(--bg-panel)', color: 'var(--text-core)', fontSize: 13, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(v: number, n: string) => [n === 'revenue' ? fmt(v) : v + ` ${t.units}`, n === 'revenue' ? t.revenue : t.units]} />
              <Bar yAxisId="left" dataKey="units" fill="url(#barGrad)" radius={[6, 6, 0, 0]} maxBarSize={40} />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 4, strokeWidth: 2, stroke: 'var(--bg-panel)' }} activeDot={{ r: 6, strokeWidth: 0 }} />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="flex gap-5 mt-4 pt-4 border-t border-[var(--border-subtle)] text-xs font-medium text-[var(--text-sec)]">
            <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded shadow-sm" style={{ background: catColor }} />{t.unitsBars}</div>
            <div className="flex items-center gap-2"><div className="w-4 h-1 bg-indigo-500 rounded-full" />{t.revenueLine}</div>
          </div>
        </div>

        {/* Stock history chart — AreaChart */}
        <div className="bg-[var(--bg-panel)] rounded-xl p-6 shadow-sm border border-[var(--border-subtle)]">
          <p className="text-base font-semibold text-[var(--text-core)] mb-1">{t.stockLevelHistory}</p>
          <p className="text-xs font-medium text-[var(--text-mute)] mb-6">{t.balanceOverTime}</p>
          {stockChartData.length > 1 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={stockChartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-sec)' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-sec)' }} axisLine={false} tickLine={false} width={30} dx={-10} />
                <RTooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--border-core)', backgroundColor: 'var(--bg-panel)', color: 'var(--text-core)', fontSize: 13, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(v: number) => [v + ' ' + product.unit, t.balance]} />
                <Area type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={3}
                  fill="url(#stockGrad)" dot={{ fill: '#6366f1', r: 4, strokeWidth: 2, stroke: 'var(--bg-panel)' }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[240px] flex items-center justify-center text-[var(--text-mute)] text-sm font-medium bg-[var(--bg-panel-inner)] rounded-xl border border-dashed border-[var(--border-subtle)]">{t.notEnoughHistory}</div>
          )}
        </div>

        {/* Stock event log */}
        <div className="bg-[var(--bg-panel)] rounded-xl p-6 shadow-sm border border-[var(--border-subtle)] xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-base font-semibold text-[var(--text-core)] mb-1">{t.stockHistoryLog}</p>
              <p className="text-xs font-medium text-[var(--text-mute)]">{t.allStockEvents}</p>
            </div>
            <span className="text-xs font-semibold bg-[var(--bg-panel-inner)] text-[var(--text-sec)] px-3 py-1 rounded-full border border-[var(--border-subtle)]">{product.stockHistory.length} {t.events}</span>
          </div>

          {product.stockHistory.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-mute)] bg-[var(--bg-panel-inner)] rounded-xl border border-dashed border-[var(--border-subtle)]">
              <Layers className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">{t.noStockEvents}</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[var(--bg-panel-inner)] border-b border-[var(--border-subtle)]">
                    <th className="px-5 py-3.5 text-xs text-[var(--text-sec)] uppercase tracking-wide font-semibold">{t.date}</th>
                    <th className="px-5 py-3.5 text-xs text-[var(--text-sec)] uppercase tracking-wide font-semibold">{t.event}</th>
                    <th className="px-5 py-3.5 text-xs text-[var(--text-sec)] uppercase tracking-wide font-semibold">{t.note}</th>
                    <th className="text-right px-5 py-3.5 text-xs text-[var(--text-sec)] uppercase tracking-wide font-semibold">{t.change}</th>
                    <th className="text-right px-5 py-3.5 text-xs text-[var(--text-sec)] uppercase tracking-wide font-semibold">{t.balance}</th>
                  </tr>
                </thead>
                <tbody>
                  {product.stockHistory.map((e, idx) => {
                    const meta = EVENT_META[e.type];
                    const Icon = meta.icon;
                    return (
                      <tr key={e.id} className={`border-b border-[var(--border-subtle)] hover:bg-[var(--bg-panel-inner)] transition-colors ${idx % 2 === 0 ? '' : 'bg-[var(--bg-panel-inner)]/50'}`}>
                        <td className="px-5 py-4 text-sm font-medium text-[var(--text-sec)] whitespace-nowrap">{e.date}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${meta.bg} ${meta.color} bg-opacity-20`}>
                            <Icon className="w-3.5 h-3.5" /> {t[e.type] || meta.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-[var(--text-core)] max-w-xs truncate" title={e.note}>{e.note}</td>
                        <td className={`px-5 py-4 text-right text-sm font-bold whitespace-nowrap ${e.qty > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {e.qty > 0 ? '+' : ''}{e.qty} <span className="text-xs font-normal opacity-70 ml-1">{product.unit}</span>
                        </td>
                        <td className="px-5 py-4 text-right text-sm font-bold text-[var(--text-core)] whitespace-nowrap">
                          {e.balanceAfter} <span className="text-xs font-medium text-[var(--text-sec)] ml-1">{product.unit}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <button onClick={() => setModal('stock')}
            className="mt-6 w-full py-3 border-2 border-dashed border-[var(--border-core)] rounded-xl text-sm font-medium text-[var(--text-sec)] hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-500/5 transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> {t.addStock}
          </button>
        </div>
      </div>
    </div>
  );
}
