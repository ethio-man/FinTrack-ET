import React, { useState } from 'react';
import { Search, Download, Plus, AlertTriangle, TrendingUp, TrendingDown, ChevronUp, ChevronDown, Package, Box, Barcode, Star } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, Tooltip as RTooltip, ResponsiveContainer } from 'recharts';
import { Product, Category, CATEGORIES, CAT_COLORS, stockStatus, stockPct, markup, fmt } from './mockData';
import { translations } from './translations';
import { Sparkline } from './Charts';
import { AddProductModal, ScanBarcodeModal } from './Modals';
import { LanguageOpt } from '../../types';

type SortKey = 'name' | 'stock' | 'sellingPrice' | 'unitsSoldThisMonth';

export default function InventoryListView({ products, onSelect, onProductAdded, language }: {
  products: Product[];
  onSelect: (id: string) => void;
  onProductAdded: (p: Product) => void;
  language: LanguageOpt;
}) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'low' | 'out' | 'ok'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [modal, setModal] = useState<'add' | 'scan' | null>(null);
  const [lowExpanded, setLowExpanded] = useState(true);

  const t = translations[language.code as keyof typeof translations] || translations.en;

  const lowStock = products.filter(p => stockStatus(p) === 'low' || stockStatus(p) === 'out');

  const topSellers = [...products]
    .filter(p => p.status === 'active')
    .sort((a, b) => b.unitsSoldThisMonth - a.unitsSoldThisMonth)
    .slice(0, 3);

  const filtered = products
    .filter(p => {
      const q = search.toLowerCase();
      const matchSearch = p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchStatus = statusFilter === 'all' || stockStatus(p) === statusFilter;
      return matchSearch && matchCat && matchStatus;
    })
    .sort((a, b) => {
      const mult = sortAsc ? 1 : -1;
      if (sortKey === 'name') return mult * a.name.localeCompare(b.name);
      return mult * ((a as any)[sortKey] - (b as any)[sortKey]);
    });

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(v => !v);
    else { setSortKey(key); setSortAsc(true); }
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ChevronDown className="w-3.5 h-3.5 text-[var(--text-mute)]" />;
    return sortAsc ? <ChevronUp className="w-3.5 h-3.5 text-indigo-500" /> : <ChevronDown className="w-3.5 h-3.5 text-indigo-500" />;
  }

  function handleExport() {
    const rows = ['SKU,Name,Category,Stock,Unit,Buying Price,Selling Price,Markup %,Status',
      ...products.map(p => `${p.sku},"ETB {p.name}",${p.category},${p.stock},${p.unit},${p.buyingPrice},${p.sellingPrice},${markup(p)}%,${p.status}`)
    ].join('\n');
    const blob = new Blob([rows], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'inventory.csv'; a.click();
  }

  const radarData = CATEGORIES.map(cat => ({
    subject: cat.length > 10 ? cat.slice(0, 8) + '…' : cat,
    fullName: cat,
    value: products.filter(p => p.category === cat).reduce((s, p) => s + p.unitsSoldThisMonth, 0),
  }));

  const isAm = language.code === 'am';

  return (
    <div className="space-y-6">
      {modal === 'add'  && <AddProductModal onClose={() => setModal(null)} onAdd={p => { onProductAdded(p); setModal(null); }} language={language} />}
      {modal === 'scan' && <ScanBarcodeModal onClose={() => setModal(null)} language={language} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-core)] mb-1">{t.inventory}</h1>
          <p className="text-[var(--text-sec)] text-sm">{products.length} {t.products} · {products.filter(p => p.status === 'active').length} {t.active}</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <button onClick={() => setModal('scan')} className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[var(--border-core)] rounded-lg text-sm text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors">
            <Barcode className="w-4 h-4" /> <span className="hidden sm:inline">{t.scanBarcode}</span>
          </button>
          <button onClick={handleExport} className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[var(--border-core)] rounded-lg text-sm text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors">
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">{t.export}</span>
          </button>
          <button onClick={() => setModal('add')} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> {t.addProduct}
          </button>
        </div>
      </div>

      {/* Top row: top sellers + radar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Top sellers — 2 cols */}
        <div className="xl:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-[var(--text-core)] font-medium">{t.topSellersThisMonth}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topSellers.map((p, i) => (
              <div key={p.id} onClick={() => onSelect(p.id)}
                className="bg-[var(--bg-panel)] rounded-xl p-5 shadow-sm border border-[var(--border-subtle)] cursor-pointer hover:shadow-md hover:border-indigo-500/50 transition-all relative overflow-hidden group">
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                  style={{ background: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : '#b45309' }}>
                  #{i + 1}
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-3" style={{ background: CAT_COLORS[p.category] + '20', color: CAT_COLORS[p.category] }}>
                  {p.category}
                </span>
                <p className="text-sm font-medium text-[var(--text-core)] pr-8 leading-tight mb-2 group-hover:text-indigo-500 transition-colors">{p.name}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <p className="text-2xl font-bold text-indigo-500">{p.unitsSoldThisMonth}</p>
                  <span className="text-xs text-[var(--text-sec)]">{t.units}</span>
                </div>
                <p className="text-xs text-[var(--text-mute)] mb-3">{fmt(p.sellingPrice * p.unitsSoldThisMonth)} {t.revenue}</p>
                <Sparkline data={p.weeklySales} color={CAT_COLORS[p.category]} />
              </div>
            ))}
          </div>
        </div>

        {/* Category radar — 1 col */}
        <div className="bg-[var(--bg-panel)] rounded-xl p-5 shadow-sm border border-[var(--border-subtle)]">
          <p className="text-sm font-medium text-[var(--text-core)] mb-1">{t.salesByCategory}</p>
          <p className="text-xs text-[var(--text-sec)] mb-3">{t.unitsSoldThisMonth}</p>
          <ResponsiveContainer width="100%" height={190}>
            <RadarChart data={radarData} margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
              <PolarGrid stroke="var(--border-core)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'var(--text-sec)' }} />
              <Radar name={t.units} dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
              <RTooltip formatter={(v: number, _: string, p: any) => [v + ` ${t.units}`, p.payload.fullName]} contentStyle={{ fontSize: 12, borderRadius: 8, backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-core)', color: 'var(--text-core)' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl overflow-hidden">
          <button
            onClick={() => setLowExpanded(v => !v)}
            className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-amber-500/10 transition-colors"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium text-amber-600 dark:text-amber-500">
                {lowStock.length} {lowStock.length !== 1 ? t.needRestocking : t.productNeedRestocking}
              </span>
            </div>
            {lowExpanded ? <ChevronUp className="w-4 h-4 text-amber-500" /> : <ChevronDown className="w-4 h-4 text-amber-500" />}
          </button>

          {lowExpanded && (
            <div className="px-5 pb-5 overflow-x-auto">
              <div className="flex gap-4 min-w-max">
                {lowStock.map(p => {
                  const st = stockStatus(p);
                  return (
                    <div key={p.id} onClick={() => onSelect(p.id)}
                      className={`rounded-xl p-4 cursor-pointer hover:shadow-md transition-all min-w-[180px] border ${
                        st === 'out' ? 'bg-red-500/5 border-red-500/30' : 'bg-[var(--bg-panel)] border-amber-500/30'
                      }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${st === 'out' ? 'bg-red-500' : 'bg-amber-500'}`} />
                        <span className={`text-xs font-semibold ${st === 'out' ? 'text-red-500' : 'text-amber-600 dark:text-amber-500'}`}>
                          {st === 'out' ? t.outOfStock : t.lowStock}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-[var(--text-core)] leading-tight mb-2 truncate">{p.name}</p>
                      <div className="flex items-baseline gap-1.5 mb-2">
                        <span className={`text-2xl font-bold ${st === 'out' ? 'text-red-500' : 'text-amber-600 dark:text-amber-500'}`}>{p.stock}</span>
                        <span className="text-xs text-[var(--text-sec)]">{p.unit} {t.left}</span>
                      </div>
                      <div className="h-1.5 bg-[var(--bg-panel-inner)] border border-[var(--border-subtle)] rounded-full overflow-hidden mb-1.5">
                        <div className={`h-full rounded-full ${st === 'out' ? 'bg-red-500' : 'bg-amber-500'}`}
                          style={{ width: `${Math.max(3, (p.stock / p.reorderLevel) * 40)}%` }} />
                      </div>
                      <p className="text-xs text-[var(--text-mute)]">{t.reorderAt} {p.reorderLevel}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter bar */}
      <div className="bg-[var(--bg-panel)] rounded-xl p-4 shadow-sm border border-[var(--border-subtle)]">
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-mute)]" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 border border-[var(--border-core)] bg-[var(--bg-panel)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-[var(--text-mute)]" />
          </div>
          {(['all', 'ok', 'low', 'out'] as const).map(s => {
            const isSelected = statusFilter === s;
            const label = s === 'all' ? t.allStock : s === 'ok' ? t.inStock : s === 'low' ? t.lowStock : t.outOfStock;
            let colorClasses = 'border-[var(--border-core)] text-[var(--text-sec)] hover:bg-[var(--bg-panel-inner)]';
            if (isSelected) {
              if (s === 'all') colorClasses = 'bg-indigo-600 text-white border-indigo-600';
              if (s === 'ok') colorClasses = 'bg-green-600 text-white border-green-600';
              if (s === 'low') colorClasses = 'bg-amber-500 text-white border-amber-500';
              if (s === 'out') colorClasses = 'bg-red-600 text-white border-red-600';
            }
            return (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${colorClasses}`}>
                {label}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {(['All', ...CATEGORIES] as (Category | 'All')[]).map(cat => {
            const isSelected = activeCategory === cat;
            const catColor = cat !== 'All' ? CAT_COLORS[cat as Category] : '#6366f1';
            
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors`}
                style={{
                  backgroundColor: isSelected ? catColor : 'transparent',
                  color: isSelected ? '#fff' : 'var(--text-sec)',
                  borderColor: isSelected ? catColor : 'var(--border-core)'
                }}>
                {cat === 'All' && isAm ? 'ሁሉም' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product table */}
      <div className="bg-[var(--bg-panel)] rounded-xl shadow-sm border border-[var(--border-subtle)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--bg-panel-inner)] border-b border-[var(--border-subtle)]">
                <th className="px-5 py-3.5 w-8">
                  <input type="checkbox" className="rounded border-[var(--border-core)]" />
                </th>
                <th className="px-4 py-3.5">
                  <button onClick={() => toggleSort('name')} className="flex items-center gap-1 text-xs text-[var(--text-sec)] uppercase tracking-wide font-semibold hover:text-indigo-500 transition-colors">
                    {t.product} <SortIcon k="name" />
                  </button>
                </th>
                <th className="px-4 py-3.5 text-xs text-[var(--text-sec)] uppercase tracking-wide font-semibold">{t.category}</th>
                <th className="px-4 py-3.5">
                  <button onClick={() => toggleSort('stock')} className="flex items-center gap-1 text-xs text-[var(--text-sec)] uppercase tracking-wide font-semibold hover:text-indigo-500 transition-colors">
                    {t.stock} <SortIcon k="stock" />
                  </button>
                </th>
                <th className="px-4 py-3.5">
                  <button onClick={() => toggleSort('sellingPrice')} className="flex items-center gap-1 text-xs text-[var(--text-sec)] uppercase tracking-wide font-semibold hover:text-indigo-500 transition-colors">
                    {t.price} <SortIcon k="sellingPrice" />
                  </button>
                </th>
                <th className="px-4 py-3.5">
                  <button onClick={() => toggleSort('unitsSoldThisMonth')} className="flex items-center gap-1 text-xs text-[var(--text-sec)] uppercase tracking-wide font-semibold hover:text-indigo-500 transition-colors">
                    {t.soldMo} <SortIcon k="unitsSoldThisMonth" />
                  </button>
                </th>
                <th className="px-4 py-3.5 text-xs text-[var(--text-sec)] uppercase tracking-wide font-semibold">{t.status}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-[var(--text-mute)] text-sm">
                    <Package className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    {t.noProductsMatch}
                  </td>
                </tr>
              ) : filtered.map((p, idx) => {
                const st = stockStatus(p);
                const catColor = CAT_COLORS[p.category];
                return (
                  <tr key={p.id}
                    onClick={() => onSelect(p.id)}
                    className={`border-b border-[var(--border-subtle)] hover:bg-indigo-500/5 transition-colors cursor-pointer ${idx % 2 === 0 ? '' : 'bg-[var(--bg-panel-inner)]'}`}>
                    <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" className="rounded border-[var(--border-core)]" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-[var(--border-subtle)]"
                          style={{ background: catColor + '15' }}>
                          <Box className="w-4.5 h-4.5" style={{ color: catColor }} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--text-core)]">{p.name}</p>
                          <p className="text-xs text-[var(--text-mute)]">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full border border-[var(--border-subtle)]" style={{ background: catColor + '10', color: catColor }}>
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-1.5 min-w-[90px]">
                        <div className="flex items-baseline gap-1">
                          <span className={`text-sm font-bold ${st === 'out' ? 'text-red-500' : st === 'low' ? 'text-amber-500' : 'text-[var(--text-core)]'}`}>{p.stock}</span>
                          <span className="text-xs text-[var(--text-sec)]">{p.unit}</span>
                        </div>
                        <div className="h-1.5 bg-[var(--border-subtle)] rounded-full w-20 overflow-hidden">
                          <div className={`h-full rounded-full ${st === 'out' ? 'bg-red-500' : st === 'low' ? 'bg-amber-500' : 'bg-indigo-500'}`}
                            style={{ width: `${Math.max(2, stockPct(p))}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-[var(--text-core)]">{fmt(p.sellingPrice)}</p>
                      <p className="text-xs text-green-500 font-medium">+{markup(p)}% {t.markup}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-[var(--text-core)]">{p.unitsSoldThisMonth}</span>
                        {p.unitsSoldThisMonth > 50 && <TrendingUp className="w-3.5 h-3.5 text-green-500" />}
                        {p.unitsSoldThisMonth === 0 && <TrendingDown className="w-3.5 h-3.5 text-[var(--text-mute)]" />}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${p.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className={`text-xs font-medium ${p.status === 'active' ? 'text-green-500' : 'text-[var(--text-mute)]'}`}>
                          {p.status === 'active' ? t.active : t.inactive}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-5 py-3.5 bg-[var(--bg-panel-inner)] border-t border-[var(--border-subtle)] flex flex-col sm:flex-row justify-between text-xs font-medium text-[var(--text-sec)] gap-2">
            <span>{filtered.length} {t.of} {products.length} {t.products}</span>
            <span>{t.totalStockValue}: <span className="text-[var(--text-core)]">{fmt(products.reduce((s, p) => s + p.stock * p.buyingPrice, 0))}</span></span>
          </div>
        )}
      </div>
    </div>
  );
}
