import React, { useState } from 'react';
import { Search, Filter, Download, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { Category, CATEGORIES, CATEGORY_META, mockExpenses, buildChartData, fmt } from './mockData';
import MultiRingDonut from './MultiRingDonut';
import { LanguageOpt } from '../../types';

interface ExpensesListViewProps {
  onNew: () => void;
  language: LanguageOpt;
}

const translations = {
  en: {
    expenses: 'Expenses',
    description: 'Track and manage all business expenditures',
    exportCsv: 'Export CSV',
    recordExpense: 'Record Expense',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    thisYear: 'This Year',
    totalExpensesPeriod: 'Total expenses this period',
    vsPrevPeriod: 'vs prev period',
    searchExpenses: 'Search expenses...',
    filters: 'Filters',
    all: 'All',
    date: 'Date',
    category: 'Category',
    desc: 'Description',
    amount: 'Amount',
    noExpenses: 'No expenses match your filters.',
    byCategory: 'By Category',
    expensePlural: 'expenses',
    expenseSingular: 'expense'
  },
  am: {
    expenses: 'ወጪዎች',
    description: 'ሁሉንም የንግድ ወጪዎች ይከታተሉ እና ያስተዳድሩ',
    exportCsv: 'CSV ላክ',
    recordExpense: 'ወጪ መዝግብ',
    today: 'ዛሬ',
    thisWeek: 'ይህ ሳምንት',
    thisMonth: 'ይህ ወር',
    thisYear: 'ይህ ዓመት',
    totalExpensesPeriod: 'የዚህ ጊዜ ጠቅላላ ወጪዎች',
    vsPrevPeriod: 'ካለፈው ጊዜ ጋር ሲነጻጸር',
    searchExpenses: 'ወጪዎችን ይፈልጉ...',
    filters: 'ማጣሪያዎች',
    all: 'ሁሉ',
    date: 'ቀን',
    category: 'ምድብ',
    desc: 'መግለጫ',
    amount: 'መጠን',
    noExpenses: 'ከማጣሪያዎችዎ ጋር የሚዛመዱ ወጪዎች የሉም።',
    byCategory: 'በምድብ',
    expensePlural: 'ወጪዎች',
    expenseSingular: 'ወጪ'
  }
};

const categoryTranslations = {
  en: {
    Rent: 'Rent',
    Salary: 'Salary',
    Transport: 'Transport',
    Utilities: 'Utilities',
    Other: 'Other'
  },
  am: {
    Rent: 'ኪራይ',
    Salary: 'ደመወዝ',
    Transport: 'ትራንስፖርት',
    Utilities: 'መገልገያዎች',
    Other: 'ሌላ'
  }
};

export default function ExpensesListView({ onNew, language }: ExpensesListViewProps) {
  const t = translations[language.code as keyof typeof translations] || translations.en;
  const catT = categoryTranslations[language.code as keyof typeof categoryTranslations] || categoryTranslations.en;

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [period, setPeriod] = useState(t.thisMonth);

  const filtered = mockExpenses.filter(e => {
    const matchCat = activeCategory === 'All' || e.category === activeCategory;
    const matchSearch = e.description.toLowerCase().includes(search.toLowerCase()) ||
                        catT[e.category].toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const total = filtered.reduce((s, e) => s + e.amount, 0);
  const prevTotal = 71450;
  const pctChange = ((total - prevTotal) / prevTotal) * 100;

  const chartData = buildChartData(filtered);

  function handleExport() {
    const rows = ['Date,Category,Description,Amount (ETB)',
      ...filtered.map(e => `${e.date},${e.category},"ETB {e.description}",${e.amount}`)
    ].join('\n');
    const blob = new Blob([rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'expenses.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-core)] mb-1">{t.expenses}</h1>
          <p className="text-[var(--text-sec)] text-sm">{t.description}</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={handleExport}
            className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2.5 border border-[var(--border-core)] rounded-lg text-sm text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{t.exportCsv}</span>
          </button>
          <button
            onClick={onNew}
            className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {t.recordExpense}
          </button>
        </div>
      </div>

      {/* Total strip */}
      <div className="bg-[var(--bg-panel)] rounded-xl p-5 shadow-sm border border-[var(--border-subtle)]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 flex-wrap">
          {/* Period selector */}
          <div className="flex gap-1 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto hide-scrollbar">
            {[t.today, t.thisWeek, t.thisMonth, t.thisYear].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap ${
                  period === p ? 'bg-indigo-600 text-white shadow-sm' : 'text-[var(--text-sec)] hover:bg-[var(--bg-panel-inner)]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="lg:ml-auto flex items-baseline gap-3 w-full lg:w-auto">
            <span className="text-sm text-[var(--text-sec)]">{t.totalExpensesPeriod}</span>
            <span className="text-2xl font-bold text-[var(--text-core)]">{fmt(total)}</span>
            <span className={`flex items-center gap-1 text-sm font-medium ${pctChange >= 0 ? 'text-red-600 dark:text-red-500' : 'text-green-600 dark:text-green-500'}`}>
              {pctChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {pctChange >= 0 ? '+' : ''}{pctChange.toFixed(1)}% {t.vsPrevPeriod}
            </span>
          </div>
        </div>
      </div>

      {/* Main grid: table + chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: table (2 cols wide) */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          {/* Search & filter bar */}
          <div className="bg-[var(--bg-panel)] rounded-xl p-4 shadow-sm border border-[var(--border-subtle)]">
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-mute)]" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={t.searchExpenses}
                  className="w-full pl-9 pr-4 py-2 border border-[var(--border-core)] bg-transparent dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                />
              </div>
              <button
                onClick={() => setShowFilters(v => !v)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors ${
                  showFilters ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10' : 'border-[var(--border-core)] text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)]'
                }`}
              >
                <Filter className="w-4 h-4" />
                {t.filters}
              </button>
            </div>

            {/* Category chips */}
            {showFilters && (
               <div className="flex gap-2 mt-3 flex-wrap animate-fade-in">
                 {(['All', ...CATEGORIES] as (Category | 'All')[]).map(cat => {
                   const label = cat === 'All' ? t.all : catT[cat];
                   return (
                     <button
                       key={cat}
                       onClick={() => setActiveCategory(cat)}
                       className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                         activeCategory === cat
                           ? 'bg-indigo-600 text-white border-indigo-600'
                           : 'border-[var(--border-core)] text-[var(--text-sec)] hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400'
                       }`}
                     >
                       {label}
                     </button>
                   );
                 })}
               </div>
            )}
          </div>

          {/* Table */}
          <div className="bg-[var(--bg-panel)] rounded-xl shadow-sm border border-[var(--border-subtle)] overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-panel-inner)]">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-[var(--text-sec)] uppercase tracking-wider">{t.date}</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-[var(--text-sec)] uppercase tracking-wider">{t.category}</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-[var(--text-sec)] uppercase tracking-wider">{t.desc}</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-[var(--text-sec)] uppercase tracking-wider">{t.amount}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-[var(--text-mute)] text-sm">
                      {t.noExpenses}
                    </td>
                  </tr>
                ) : filtered.map(exp => {
                  const meta = CATEGORY_META[exp.category];
                  const Icon = meta.icon;
                  return (
                    <tr key={exp.id} className="hover:bg-[var(--bg-panel-inner)] transition-colors">
                      <td className="px-5 py-4">
                        <div className="text-sm font-medium text-[var(--text-core)]">{exp.date}</div>
                        <div className="text-xs text-[var(--text-sec)] mt-0.5">{exp.id}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium dark:bg-opacity-10 dark:text-opacity-90 ${meta.bg}`}>
                          <Icon className="w-3.5 h-3.5" />
                          {catT[exp.category]}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                        {exp.description}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-sm font-medium text-red-600 dark:text-red-500">- ETB {exp.amount.toLocaleString()}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {filtered.length > 0 && (
                <tfoot>
                  <tr className="bg-[var(--bg-panel-inner)] border-t border-[var(--border-subtle)]">
                    <td colSpan={3} className="px-5 py-3.5 text-sm font-medium text-[var(--text-core)]">
                      {filtered.length} {filtered.length !== 1 ? t.expensePlural : t.expenseSingular}
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm font-bold text-red-600 dark:text-red-500">
                      - ETB {total.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

        {/* Right: donut chart (1 col) */}
        <div className="flex flex-col gap-4">
          <MultiRingDonut data={chartData} language={language} />

          {/* Category breakdown list */}
          <div className="bg-[var(--bg-panel)] rounded-xl p-5 shadow-sm border border-[var(--border-subtle)]">
            <h3 className="text-sm font-semibold text-[var(--text-core)] mb-4">{t.byCategory}</h3>
            <div className="space-y-4">
              {buildChartData(mockExpenses)
                .sort((a, b) => b.rawAmount - a.rawAmount)
                .map(d => (
                  <div key={d.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} />
                        <span className="text-sm font-medium text-[var(--text-core)]">{catT[d.name as Category] || d.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-[var(--text-core)]">ETB {d.rawAmount.toLocaleString()}</span>
                        <span className="text-xs font-medium text-[var(--text-mute)] ml-2">{d.value}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${d.value}%`, background: d.fill }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
