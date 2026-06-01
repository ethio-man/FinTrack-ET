import React, { useState } from 'react';
import { X, Printer, FileText, User, Building2, Calendar, ChevronDown } from 'lucide-react';

export interface PrintSettings {
  reportTitle: string;
  year: string;
  companyName: string;
  companyAddress: string;
  companyContact: string;
  companyEmail: string;
  preparedByName: string;
  preparedByTitle: string;
  preparedByContact: string;
  preparedForName: string;
  preparedForTitle: string;
  preparedForContact: string;
  accentColor: string;
}

export const DEFAULT_PRINT_SETTINGS: PrintSettings = {
  reportTitle: 'Annual Financial Report',
  year: new Date().getFullYear().toString(),
  companyName: 'Sheger Traders',
  companyAddress: 'Addis Ababa, Ethiopia',
  companyContact: '+251 911 000 000',
  companyEmail: 'info@shegertraders.com',
  preparedByName: 'Alemayehu Tadesse',
  preparedByTitle: 'Financial Manager',
  preparedByContact: '+251 911 000 001',
  preparedForName: 'Board of Directors',
  preparedForTitle: 'Management Team',
  preparedForContact: 'board@shegertraders.com',
  accentColor: '#0077C5',
};

const ACCENT_COLORS = [
  { label: 'Ocean Blue', value: '#0077C5' },
  { label: 'Teal', value: '#0d9488' },
  { label: 'Forest Green', value: '#16a34a' },
  { label: 'Indigo', value: '#4f46e5' },
  { label: 'Slate', value: '#475569' },
  { label: 'Rose Gold', value: '#e11d48' },
];

interface Props {
  open: boolean;
  onClose: () => void;
  settings: PrintSettings;
  onChange: (s: PrintSettings) => void;
  onPrint: () => void;
  reportTitle?: string;
}

export default function PrintSettingsModal({ open, onClose, settings, onChange, onPrint, reportTitle }: Props) {
  if (!open) return null;

  const field = (label: string, key: keyof PrintSettings, placeholder = '') => (
    <div>
      <label className="block text-xs font-semibold text-[var(--text-sec)] mb-1.5 uppercase tracking-wider">{label}</label>
      <input
        value={settings[key] as string}
        onChange={e => onChange({ ...settings, [key]: e.target.value })}
        placeholder={placeholder || label}
        className="w-full px-3.5 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50"
      />
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-8 pb-8 px-4 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[var(--bg-panel)] rounded-2xl shadow-2xl w-full max-w-2xl border border-[var(--border-core)] my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-core)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0077C5]/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#0077C5]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-core)]">Print Settings</h2>
              <p className="text-xs text-[var(--text-mute)] font-medium mt-0.5">Customize your report cover page</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[var(--bg-panel-inner)] rounded-lg transition-colors">
            <X className="w-5 h-5 text-[var(--text-sec)]" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Report Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-[#0077C5]" />
              <h3 className="text-sm font-bold text-[var(--text-core)] uppercase tracking-wider">Report Details</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {field('Report Title', 'reportTitle', 'Annual Financial Report')}
              {field('Year / Period', 'year', new Date().getFullYear().toString())}
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-sec)] mb-3 uppercase tracking-wider">Accent Color</label>
            <div className="flex flex-wrap gap-3">
              {ACCENT_COLORS.map(c => (
                <button
                  key={c.value}
                  onClick={() => onChange({ ...settings, accentColor: c.value })}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-xs font-medium transition-all ${
                    settings.accentColor === c.value
                      ? 'border-[var(--text-core)] shadow-sm'
                      : 'border-[var(--border-core)] hover:border-[var(--border-subtle)]'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: c.value }} />
                  <span className="text-[var(--text-sec)]">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-4 h-4 text-[#0077C5]" />
              <h3 className="text-sm font-bold text-[var(--text-core)] uppercase tracking-wider">Company Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {field('Company Name', 'companyName')}
              {field('Address', 'companyAddress')}
              {field('Contact Number', 'companyContact')}
              {field('Email Address', 'companyEmail')}
            </div>
          </div>

          {/* Prepared By / For */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-[#0077C5]" />
                <h3 className="text-sm font-bold text-[var(--text-core)] uppercase tracking-wider">Prepared By</h3>
              </div>
              <div className="space-y-4">
                {field('Name', 'preparedByName')}
                {field('Title / Role', 'preparedByTitle')}
                {field('Contact', 'preparedByContact')}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-[#0077C5]" />
                <h3 className="text-sm font-bold text-[var(--text-core)] uppercase tracking-wider">Prepared For</h3>
              </div>
              <div className="space-y-4">
                {field('Name', 'preparedForName')}
                {field('Title / Role', 'preparedForTitle')}
                {field('Contact', 'preparedForContact')}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-[var(--border-core)] bg-[var(--bg-panel-inner)] rounded-b-2xl">
          <button
            onClick={onPrint}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#0077C5] text-white rounded-xl text-sm font-bold hover:bg-[#005a96] transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Generate & Print
          </button>
          <button onClick={onClose} className="flex-1 py-3 border border-[var(--border-core)] text-[var(--text-core)] rounded-xl text-sm font-medium hover:bg-[var(--bg-panel)] transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
