import React, { useState } from 'react';
import { X, Barcode } from 'lucide-react';
import { Product, Category, CATEGORIES, fmt } from './mockData';
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

export function AddProductModal({ onClose, onAdd, language }: { onClose: () => void; onAdd: (p: Product) => void; language: LanguageOpt }) {
  const [f, setF] = useState({ name: '', sku: '', category: 'Electronics' as Category, unit: 'pcs', buyingPrice: '', sellingPrice: '', stock: '', reorderLevel: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const t = translations[language.code as keyof typeof translations] || translations.en;

  function set(k: string, v: string) { setF(prev => ({ ...prev, [k]: v })); setErrors(e => { const n = { ...e }; delete n[k]; return n; }); }

  function validate() {
    const e: Record<string, string> = {};
    if (!f.name.trim()) e.name = t.required;
    if (!f.sku.trim()) e.sku = t.required;
    if (!f.buyingPrice || +f.buyingPrice <= 0) e.buyingPrice = t.required;
    if (!f.sellingPrice || +f.sellingPrice <= 0) e.sellingPrice = t.required;
    if (!f.stock || +f.stock < 0) e.stock = t.required;
    if (!f.reorderLevel || +f.reorderLevel <= 0) e.reorderLevel = t.required;
    return e;
  }

  function save() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onAdd({
      id: 'PRD-' + Date.now(),
      name: f.name.trim(), sku: f.sku.trim(), category: f.category,
      unit: f.unit.trim() || 'pcs',
      buyingPrice: +f.buyingPrice, sellingPrice: +f.sellingPrice,
      stock: +f.stock, reorderLevel: +f.reorderLevel,
      status: 'active', unitsSoldThisMonth: 0, stockHistory: [], weeklySales: [],
    });
    onClose();
  }

  return (
    <Modal title={t.addNewProduct} onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: t.productName, key: 'name', colSpan: 2, placeholder: 'e.g. Premium Coffee Beans' },
          { label: t.sku, key: 'sku', placeholder: 'e.g. BEV-CB-001' },
          { label: t.unit, key: 'unit', placeholder: 'pcs / kg / box…' },
        ].map(({ label, key, placeholder, colSpan }) => (
          <div key={key} className={colSpan === 2 ? 'col-span-2' : ''}>
            <label className="block text-sm text-[var(--text-sec)] mb-1.5">{label} <span className="text-red-500">*</span></label>
            <input placeholder={placeholder} value={(f as any)[key]} onChange={e => set(key, e.target.value)}
              className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
            {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
          </div>
        ))}

        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.category}</label>
          <select value={f.category} onChange={e => set('category', e.target.value as Category)}
            className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div />

        {[
          { label: t.buyingPriceEtb, key: 'buyingPrice' },
          { label: t.sellingPriceEtb, key: 'sellingPrice' },
          { label: t.initialStockQty, key: 'stock' },
          { label: t.reorderLevel, key: 'reorderLevel' },
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="block text-sm text-[var(--text-sec)] mb-1.5">{label} <span className="text-red-500">*</span></label>
            <input type="number" min="0" value={(f as any)[key]} onChange={e => set(key, e.target.value)}
              className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
            {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-5">
        <button onClick={save} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">{t.addProduct}</button>
        <button onClick={onClose} className="flex-1 py-2.5 border border-[var(--border-core)] text-[var(--text-core)] rounded-xl text-sm hover:bg-[var(--bg-panel-inner)] transition-colors">{t.cancel}</button>
      </div>
    </Modal>
  );
}

export function AddStockModal({ product, onClose, onAdd, language }: { product: Product; onClose: () => void; onAdd: (qty: number, note: string) => void; language: LanguageOpt }) {
  const [qty, setQty] = useState('');
  const [note, setNote] = useState('');
  const [err, setErr] = useState('');

  const t = translations[language.code as keyof typeof translations] || translations.en;

  function save() {
    const n = parseInt(qty);
    if (!n || n <= 0) { setErr(t.enterValidQuantity); return; }
    onAdd(n, note || 'Manual stock addition');
    onClose();
  }

  return (
    <Modal title={`${t.addStock} — ${product.name}`} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex justify-between text-sm bg-[var(--bg-panel-inner)] border border-[var(--border-subtle)] rounded-xl p-3">
          <span className="text-[var(--text-sec)]">{t.currentStock}</span>
          <span className="text-[var(--text-core)] font-medium">{product.stock} {product.unit}</span>
        </div>
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.quantityToAdd} ({product.unit}) <span className="text-red-500">*</span></label>
          <input type="number" min="1" value={qty} onChange={e => { setQty(e.target.value); setErr(''); }}
            className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
          {err && <p className="text-xs text-red-500 mt-1">{err}</p>}
          {qty && +qty > 0 && <p className="text-xs text-[var(--text-mute)] mt-1">{t.newTotal}: {product.stock + +qty} {product.unit}</p>}
        </div>
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.note}</label>
          <input placeholder="e.g. Supplier delivery, PO #123…" value={note} onChange={e => setNote(e.target.value)}
            className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={save} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">{t.addStock}</button>
          <button onClick={onClose} className="flex-1 py-2.5 border border-[var(--border-core)] text-[var(--text-core)] rounded-xl text-sm hover:bg-[var(--bg-panel-inner)] transition-colors">{t.cancel}</button>
        </div>
      </div>
    </Modal>
  );
}

export function AdjustPriceModal({ product, onClose, onSave, language }: { product: Product; onClose: () => void; onSave: (buy: number, sell: number) => void; language: LanguageOpt }) {
  const [buy, setBuy] = useState(String(product.buyingPrice));
  const [sell, setSell] = useState(String(product.sellingPrice));

  const t = translations[language.code as keyof typeof translations] || translations.en;

  const newMarkup = +sell > 0 && +buy > 0 ? Math.round(((+sell - +buy) / +buy) * 100) : 0;

  function save() {
    if (+buy <= 0 || +sell <= 0) return;
    onSave(+buy, +sell);
    onClose();
  }

  return (
    <Modal title={`${t.adjustPrice} — ${product.name}`} onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.buyingPriceEtb}</label>
            <input type="number" min="0" value={buy} onChange={e => setBuy(e.target.value)}
              className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
          </div>
          <div>
            <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.sellingPriceEtb}</label>
            <input type="number" min="0" value={sell} onChange={e => setSell(e.target.value)}
              className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-[var(--bg-panel-inner)] border border-[var(--border-subtle)] rounded-xl p-3">
            <p className="text-xs text-[var(--text-sec)]">{t.profitPerUnit}</p>
            <p className="text-base text-green-500 font-medium mt-1">{fmt(+sell - +buy)}</p>
          </div>
          <div className="bg-[var(--bg-panel-inner)] border border-[var(--border-subtle)] rounded-xl p-3">
            <p className="text-xs text-[var(--text-sec)]">{t.markup}</p>
            <p className={`text-base font-medium mt-1 ${newMarkup >= 30 ? 'text-green-500' : 'text-amber-500'}`}>{newMarkup}%</p>
          </div>
          <div className="bg-[var(--bg-panel-inner)] border border-[var(--border-subtle)] rounded-xl p-3">
            <p className="text-xs text-[var(--text-sec)]">{t.monthlyProfit}</p>
            <p className="text-base text-indigo-500 font-medium mt-1">{fmt((+sell - +buy) * product.unitsSoldThisMonth)}</p>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={save} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">{t.savePrices}</button>
          <button onClick={onClose} className="flex-1 py-2.5 border border-[var(--border-core)] text-[var(--text-core)] rounded-xl text-sm hover:bg-[var(--bg-panel-inner)] transition-colors">{t.cancel}</button>
        </div>
      </div>
    </Modal>
  );
}

export function ScanBarcodeModal({ onClose, language }: { onClose: () => void; language: LanguageOpt }) {
  const t = translations[language.code as keyof typeof translations] || translations.en;
  
  return (
    <Modal title={t.scanBarcode} onClose={onClose}>
      <div className="text-center py-4">
        <div className="w-40 h-40 mx-auto border-2 border-dashed border-indigo-400/50 rounded-2xl flex flex-col items-center justify-center gap-2 bg-indigo-500/5">
          <Barcode className="w-12 h-12 text-indigo-400" />
          <p className="text-xs text-indigo-500 font-medium">{t.scanCameraPreview}</p>
        </div>
        <p className="text-sm text-[var(--text-sec)] mt-4">{t.scanPointCamera}</p>
        <p className="text-xs text-[var(--text-mute)] mt-1">{t.scanNoCameraAccess}</p>
        <div className="mt-6 flex items-center gap-2">
          <input placeholder={t.searchBarcodeManual}
            className="flex-1 px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
          <button className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">{t.search}</button>
        </div>
        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
          <button onClick={onClose} className="w-full py-2.5 border border-[var(--border-core)] text-[var(--text-core)] rounded-xl text-sm hover:bg-[var(--bg-panel-inner)] transition-colors">{t.close}</button>
        </div>
      </div>
    </Modal>
  );
}
