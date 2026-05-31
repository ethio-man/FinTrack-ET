import React, { useState, useRef } from 'react';
import { ArrowLeft, Check, Plus, Calendar, X, Upload, Camera, FileText } from 'lucide-react';
import { Category, CATEGORIES, CATEGORY_META, today } from './mockData';
import { LanguageOpt } from '../../types';

export default function RecordExpenseView({ onBack, selectedLanguage }: { onBack: () => void; selectedLanguage?: LanguageOpt }) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    category: '' as Category | '',
    customCategory: '',
    useCustom: false,
    date: today(),
    amount: '',
    description: '',
    receipt: null as File | null,
    receiptPreview: '' as string,
  });

  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isAmharic = selectedLanguage?.code === 'am';
  const t = {
    title: isAmharic ? 'ወጪ መዝግብ' : 'Record Expense',
    desc: isAmharic ? 'አዲስ የንግድ ወጪ ያክሉ' : 'Add a new business expense',
    success: isAmharic ? 'ወጪው በተሳካ ሁኔታ ተቀምጧል! ወደ ኋላ በመመለስ ላይ...' : 'Expense saved successfully! Returning…',
    categoryLabel: isAmharic ? 'ምድብ' : 'Category',
    customCat: isAmharic ? 'ብጁ ምድብ' : 'Custom category',
    customCatPh: isAmharic ? 'ለምሳሌ መድን፣ ጥገናዎች...' : 'e.g. Insurance, Repairs…',
    dateLabel: isAmharic ? 'ቀን' : 'Date',
    amountLabel: isAmharic ? 'መጠን' : 'Amount',
    descLabel: isAmharic ? 'መግለጫ / ማስታወሻ' : 'Description / Memo',
    descPh: isAmharic ? 'ይህ ወጪ ለምን ነበር?' : 'What was this expense for?',
    receiptLabel: isAmharic ? 'ደረሰኝ (አማራጭ)' : 'Receipt (optional)',
    uploadPhoto: isAmharic ? 'ፎቶ ስቀል' : 'Upload photo',
    takePhoto: isAmharic ? 'ፎቶ አንሳ' : 'Take photo',
    recordingExp: isAmharic ? 'ወጪ እየመዘገቡ ነው' : 'You are recording an expense of',
    saveBtn: isAmharic ? 'ወጪ አስቀምጥ' : 'Save Expense',
    savingBtn: isAmharic ? 'በማስቀመጥ ላይ...' : 'Saving…',
    cancelBtn: isAmharic ? 'ሰርዝ' : 'Cancel',
    errCategory: isAmharic ? 'እባክዎ ምድብ ይምረጡ ወይም ያስገቡ።' : 'Please select or enter a category.',
    errAmount: isAmharic ? 'ትክክለኛ መጠን ያስገቡ።' : 'Enter a valid amount.',
    errDesc: isAmharic ? 'መግለጫ ያስፈልጋል።' : 'Description is required.',
  };

  function translateCategory(cat: string) {
    if (!isAmharic) return cat;
    const map: Record<string, string> = {
      'Rent': 'ኪራይ',
      'Salary': 'ደመወዝ',
      'Transport': 'ትራንስፖርት',
      'Utilities': 'መገልገያዎች',
      'Other': 'ሌሎች'
    };
    return map[cat] || cat;
  }

  function set(key: string, val: unknown) {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  }

  function handleFile(file: File | null) {
    if (!file) return;
    set('receipt', file);
    const reader = new FileReader();
    reader.onload = e => set('receiptPreview', e.target?.result as string);
    reader.readAsDataURL(file);
  }

  function validate() {
    const errs: Record<string, string> = {};
    const cat = form.useCustom ? form.customCategory.trim() : form.category;
    if (!cat) errs.category = t.errCategory;
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      errs.amount = t.errAmount;
    if (!form.description.trim()) errs.description = t.errDesc;
    return errs;
  }

  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaved(true);
    setTimeout(onBack, 1200);
  }

  const parsedAmount = parseFloat(form.amount) || 0;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-[var(--bg-panel)] rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-[var(--text-sec)]" />
        </button>
        <div>
          <h1 className="text-2xl text-[var(--text-core)]">{t.title}</h1>
          <p className="text-[var(--text-sec)] text-sm">{t.desc}</p>
        </div>
      </div>

      {saved && (
        <div className="mb-4 flex items-center gap-2 bg-green-50/10 border border-green-500/30 text-green-600 rounded-xl px-4 py-3 text-sm">
          <Check className="w-4 h-4" />
          {t.success}
        </div>
      )}

      <div className="bg-[var(--bg-panel-inner)] rounded-xl shadow-sm border border-[var(--border-subtle)] p-6 space-y-6">

        {/* Category picker */}
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-2">{t.categoryLabel} <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
            {CATEGORIES.map(cat => {
              const meta = CATEGORY_META[cat];
              const Icon = meta.icon;
              const active = !form.useCustom && form.category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => { set('category', cat); set('useCustom', false); }}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-xs ${
                    active
                      ? 'border-indigo-500 bg-indigo-50/10 text-indigo-500'
                      : 'border-[var(--border-core)] text-[var(--text-sec)] hover:border-[var(--border-subtle)]'
                  }`}
                >
                  <Icon className="w-4 h-4" style={{ color: active ? '#4f46e5' : meta.color }} />
                  {translateCategory(cat)}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => { set('useCustom', !form.useCustom); set('category', ''); }}
            className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-colors ${
              form.useCustom ? 'border-indigo-400 text-indigo-500 bg-indigo-50/10' : 'border-[var(--border-core)] text-[var(--text-sec)] hover:border-[var(--border-subtle)]'
            }`}
          >
            <Plus className="w-3 h-3" />
            {t.customCat}
          </button>
          {form.useCustom && (
            <input
              placeholder={t.customCatPh}
              value={form.customCategory}
              onChange={e => set('customCategory', e.target.value)}
              className="mt-2 w-full px-4 py-2.5 border border-[var(--border-core)] rounded-lg text-sm bg-transparent text-[var(--text-core)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}
          {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-2">{t.dateLabel}</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-mute)] pointer-events-none" />
            <input
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[var(--border-core)] rounded-lg text-sm bg-transparent text-[var(--text-core)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-2">{t.amountLabel} <span className="text-red-500">*</span></label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-mute)] select-none">ETB</span>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
              className="w-full pl-14 pr-4 py-2.5 border border-[var(--border-core)] rounded-lg text-sm bg-transparent text-[var(--text-core)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {parsedAmount > 0 && (
            <p className="text-xs text-[var(--text-sec)] mt-1">
              ETB {parsedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          )}
          {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-2">{t.descLabel} <span className="text-red-500">*</span></label>
          <textarea
            rows={3}
            placeholder={t.descPh}
            value={form.description}
            onChange={e => set('description', e.target.value)}
            className="w-full px-4 py-2.5 border border-[var(--border-core)] rounded-lg text-sm bg-transparent text-[var(--text-core)] focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
        </div>

        {/* Receipt upload */}
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-2">{t.receiptLabel}</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => handleFile(e.target.files?.[0] ?? null)}
          />
          {form.receiptPreview ? (
            <div className="relative inline-block">
              <img
                src={form.receiptPreview}
                alt="Receipt preview"
                className="w-32 h-32 object-cover rounded-xl border border-[var(--border-core)]"
              />
              <button
                onClick={() => { set('receipt', null); set('receiptPreview', ''); }}
                className="absolute -top-2 -right-2 bg-[var(--bg-core)] border border-[var(--border-core)] rounded-full p-0.5 hover:bg-red-500/10 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-[var(--text-sec)]" />
              </button>
              <p className="text-xs text-[var(--text-sec)] mt-1">{form.receipt?.name}</p>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-[var(--border-core)] rounded-xl text-sm text-[var(--text-sec)] hover:border-indigo-500 hover:text-indigo-500 transition-colors"
              >
                <Upload className="w-4 h-4" />
                {t.uploadPhoto}
              </button>
              <button
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-[var(--border-core)] rounded-xl text-sm text-[var(--text-sec)] hover:border-indigo-500 hover:text-indigo-500 transition-colors"
              >
                <Camera className="w-4 h-4" />
                {t.takePhoto}
              </button>
            </div>
          )}
        </div>

        {/* Summary card */}
        {parsedAmount > 0 && (
          <div className="bg-[var(--bg-core)] rounded-xl p-4 border border-[var(--border-subtle)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--text-sec)]">{t.recordingExp}</p>
                <p className="text-xl text-red-600 mt-0.5">- ETB {parsedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <FileText className="w-8 h-8 text-[var(--text-mute)]" />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saved}
            className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60"
          >
            {saved ? t.savingBtn : t.saveBtn}
          </button>
          <button
            onClick={onBack}
            className="flex-1 py-3 border border-[var(--border-core)] text-[var(--text-core)] rounded-xl text-sm hover:bg-[var(--bg-core)] transition-colors"
          >
            {t.cancelBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
