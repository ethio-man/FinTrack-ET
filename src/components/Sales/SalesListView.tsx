import React, { useState } from 'react';
import { LanguageOpt } from '../../types';
import { mockSales, mockProducts, mockCustomers, periodComparisonData } from './mockData';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import { Search, Filter, Download, FileText, Plus, ChevronDown, TrendingUp, TrendingDown, Eye, Wallet, Smartphone, Building2, CreditCard, MoreVertical } from 'lucide-react';

export default // Sales List View
function SalesListView({ onNewSale, onViewSale, selectedLanguage }: { onNewSale: () => void; onViewSale: (id: string) => void; selectedLanguage?: LanguageOpt }) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filters, setFilters] = useState({
    dateRange: 'all',
    paymentMethod: 'all',
    status: 'all',
    minAmount: '',
    maxAmount: ''
  });

  const thisPeriodTotal = 25680;
  const lastPeriodTotal = 21600;
  const percentChange = ((thisPeriodTotal - lastPeriodTotal) / lastPeriodTotal) * 100;

  const transactions = mockSales.length;
  const transactionsLastPeriod = 1520;
  const isAmharic = selectedLanguage?.code === 'am';
  const t = {
    title: isAmharic ? 'ሽያጭ' : 'Sales',
    desc: isAmharic ? 'ሁሉንም የሽያጭ ግብይቶች ያስተዳድሩ እና ይከታተሉ' : 'Manage and track all sales transactions',
    all: isAmharic ? 'ሁሉም' : 'All',
    revenue: isAmharic ? 'ገቢ' : 'Revenue',
    transactions: isAmharic ? 'ግብይቶች' : 'Transactions',
    refunds: isAmharic ? 'ተመላሾች' : 'Refunds',
    comparedTo: isAmharic ? 'ከዚህ ጋር ሲነፃፀር' : 'Compared to',
    prevMonth: isAmharic ? 'ያለፈው ወር' : 'Previous month',
    vsLastPeriod: isAmharic ? 'ካለፈው ጊዜ ጋር ሲነፃፀር' : 'vs last period',
    searchPh: isAmharic ? 'በደንበኛ፣ በመታወቂያ ወይም በምርት ይፈልጉ...' : 'Search sales by customer, ID, or product...',
    filter: isAmharic ? 'አጣራ' : 'Filter',
    exportCsv: isAmharic ? 'CSV ላክ' : 'Export CSV',
    exportPdf: isAmharic ? 'PDF ላክ' : 'Export PDF',
    recordSale: isAmharic ? 'ሽያጭ መዝግብ' : 'Record Sale',
    dateRange: isAmharic ? 'የቀን ክልል' : 'Date Range',
    paymentMethod: isAmharic ? 'የክፍያ ዘዴ' : 'Payment Method',
    status: isAmharic ? 'ሁኔታ' : 'Status',
    minAmount: isAmharic ? 'አነስተኛ መጠን' : 'Min Amount',
    maxAmount: isAmharic ? 'ከፍተኛ መጠን' : 'Max Amount',
    id: isAmharic ? 'መታወቂያ' : 'ID',
    customer: isAmharic ? 'ደንበኛ' : 'Customer',
    date: isAmharic ? 'ቀን' : 'Date',
    items: isAmharic ? 'ዕቃዎች' : 'Items',
    total: isAmharic ? 'ጠቅላላ' : 'Total',
    payment: isAmharic ? 'ክፍያ' : 'Payment',
    view: isAmharic ? 'እይ' : 'View',
    showing: isAmharic ? 'እያሳየ ያለው' : 'Showing',
    to: isAmharic ? 'እስከ' : 'to',
    of: isAmharic ? 'ከ' : 'of',
    sales: isAmharic ? 'ሽያጮች' : 'sales',
    previous: isAmharic ? 'የቀድሞው' : 'Previous',
    next: isAmharic ? 'ቀጣይ' : 'Next',
    cash: isAmharic ? 'ጥሬ ገንዘብ' : 'Cash',
    telebirr: isAmharic ? 'ቴሌብር' : 'Telebirr',
    chartRevenue: isAmharic ? 'ገቢ' : 'Revenue',
    chartTx: isAmharic ? 'ግቢይቶች' : 'Transactions',
    chartRefunds: isAmharic ? 'ተመላሾች' : 'Refunds',
  };
  const transactionsChange = ((transactions - transactionsLastPeriod) / transactionsLastPeriod) * 100;

  const refunds = 3260;
  const refundsLastPeriod = 3330;
  const refundsChange = ((refunds - refundsLastPeriod) / refundsLastPeriod) * 100;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl mb-1">{t.title}</h1>
        <p className="text-[var(--text-sec)] text-sm">{t.desc}</p>
      </div>

      {/* Summary Strip */}
      <div className="bg-[var(--bg-panel-inner)] rounded-xl p-6 shadow-sm border border-[var(--border-subtle)] mb-6">
        <div className="flex items-center gap-4 mb-6">
          <button className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg">{t.all}</button>
          <button className="px-3 py-1.5 text-sm text-[var(--text-sec)] hover:bg-[var(--bg-panel)] rounded-lg">{t.chartRevenue}</button>
          <button className="px-3 py-1.5 text-sm text-[var(--text-sec)] hover:bg-[var(--bg-panel)] rounded-lg">{t.chartTx}</button>
          <button className="px-3 py-1.5 text-sm text-[var(--text-sec)] hover:bg-[var(--bg-panel)] rounded-lg">{t.chartRefunds}</button>
          <button className="px-3 py-1.5 text-sm text-[var(--text-sec)] hover:bg-[var(--bg-panel)] rounded-lg">{t.comparedTo}</button>
          <button className="px-3 py-1.5 text-sm text-[var(--text-sec)] hover:bg-[var(--bg-panel)] rounded-lg flex items-center gap-1">
            {t.prevMonth} <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm text-[var(--text-sec)]">{t.revenue}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl">${thisPeriodTotal.toLocaleString()}</h3>
              <span className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +{percentChange.toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-[var(--text-mute)] mt-1">{t.vsLastPeriod}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-[var(--text-sec)]">{t.transactions}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl">${18420}</h3>
              <span className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +{transactionsChange.toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-[var(--text-mute)] mt-1">{t.vsLastPeriod}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-sm text-[var(--text-sec)]">{t.refunds}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl">${refunds.toLocaleString()}</h3>
              <span className="text-sm text-red-600 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                {refundsChange.toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-[var(--text-mute)] mt-1">{t.vsLastPeriod}</p>
          </div>
        </div>

        {/* Period Comparison Chart */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={periodComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#9ca3af"
                style={{ fontSize: '11px' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis hide />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line
                key="line-revenue"
                type="monotone"
                dataKey="revenue"
                stroke="#a855f7"
                strokeWidth={2}
                dot={{ fill: '#a855f7', r: 3 }}
                activeDot={{ r: 5 }}
                name={t.chartRevenue}
              />
              <Line
                key="line-transactions"
                type="monotone"
                dataKey="transactions"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 3 }}
                activeDot={{ r: 5 }}
                name={t.chartTx}
              />
              <Line
                key="line-refunds"
                type="monotone"
                dataKey="refunds"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ fill: '#f97316', r: 3 }}
                activeDot={{ r: 5 }}
                name={t.chartRefunds}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-[var(--bg-panel-inner)] rounded-xl p-4 shadow-sm border border-[var(--border-subtle)] mb-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-mute)]" />
            <input
              type="text"
              placeholder={t.searchPh}
              className="w-full pl-10 pr-4 py-2 border border-[var(--border-core)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              showFilters ? 'bg-indigo-600 text-white' : 'bg-[var(--bg-panel)] text-[var(--text-sec)] hover:bg-[var(--bg-panel)]'
            }`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />{t.filter}</button>
          <button className="px-4 py-2 bg-[var(--bg-panel)] text-[var(--text-sec)] rounded-lg flex items-center gap-2 hover:bg-[var(--bg-panel)]">
            <Download className="w-4 h-4" />{t.exportCsv}</button>
          <button className="px-4 py-2 bg-[var(--bg-panel)] text-[var(--text-sec)] rounded-lg flex items-center gap-2 hover:bg-[var(--bg-panel)]">
            <FileText className="w-4 h-4" />{t.exportPdf}</button>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700"
            onClick={onNewSale}
          >
            <Plus className="w-4 h-4" />{t.recordSale}</button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-[var(--border-core)] grid grid-cols-5 gap-4">
            <div>
              <label className="block text-sm text-[var(--text-sec)] mb-2">{t.dateRange}</label>
              <select
                className="w-full px-3 py-2 border border-[var(--border-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[var(--text-sec)] mb-2">{t.paymentMethod}</label>
              <select
                className="w-full px-3 py-2 border border-[var(--border-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.paymentMethod}
                onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
              >
                <option value="all">All Methods</option>
                <option value="cash">{t.cash}</option>
                <option value="telebirr">{t.telebirr}</option>
                <option value="bank">Bank Transfer</option>
                <option value="credit">Credit Card</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[var(--text-sec)] mb-2">{t.status}</label>
              <select
                className="w-full px-3 py-2 border border-[var(--border-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="all">All Status</option>
                <option value="complete">Complete</option>
                <option value="pending">Pending</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[var(--text-sec)] mb-2">{t.minAmount}</label>
              <input
                type="number"
                placeholder="$0"
                className="w-full px-3 py-2 border border-[var(--border-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.minAmount}
                onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-sec)] mb-2">{t.maxAmount}</label>
              <input
                type="number"
                placeholder="$10000"
                className="w-full px-3 py-2 border border-[var(--border-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.maxAmount}
                onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Sales Table */}
      <div className="bg-[var(--bg-panel-inner)] rounded-xl shadow-sm border border-[var(--border-subtle)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--bg-core)] border-b border-[var(--border-subtle)]">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button className="flex items-center gap-2 text-sm text-[var(--text-sec)] hover:text-[var(--text-core)]">{t.id}<ChevronDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button className="flex items-center gap-2 text-sm text-[var(--text-sec)] hover:text-[var(--text-core)]">{t.customer}<ChevronDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button className="flex items-center gap-2 text-sm text-[var(--text-sec)] hover:text-[var(--text-core)]">{t.date}<ChevronDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button className="flex items-center gap-2 text-sm text-[var(--text-sec)] hover:text-[var(--text-core)]">{t.items}<ChevronDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button className="flex items-center gap-2 text-sm text-[var(--text-sec)] hover:text-[var(--text-core)]">{t.total}<ChevronDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button className="flex items-center gap-2 text-sm text-[var(--text-sec)] hover:text-[var(--text-core)]">{t.payment}<ChevronDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button className="flex items-center gap-2 text-sm text-[var(--text-sec)] hover:text-[var(--text-core)]">{t.status}<ChevronDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {mockSales.map((sale, index) => (
                <tr
                  key={sale.id}
                  className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-core)] transition-colors"
                >
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => onViewSale(sale.id)}
                      className="text-indigo-600 hover:text-indigo-700 hover:underline"
                    >
                      {sale.id}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                        index % 4 === 0 ? 'bg-pink-500' : index % 4 === 1 ? 'bg-green-500' : index % 4 === 2 ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}>
                        {sale.customer.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm">{sale.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--text-sec)]">{sale.date}</td>
                  <td className="px-6 py-4 text-sm text-[var(--text-sec)]">{sale.items.length} item(s)</td>
                  <td className="px-6 py-4 text-sm">${sale.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--bg-panel)] text-[var(--text-sec)] rounded-md text-xs capitalize">
                      {sale.paymentMethod === 'cash' && <Wallet className="w-3 h-3" />}
                      {sale.paymentMethod === 'telebirr' && <Smartphone className="w-3 h-3" />}
                      {sale.paymentMethod === 'bank' && <Building2 className="w-3 h-3" />}
                      {sale.paymentMethod === 'credit' && <CreditCard className="w-3 h-3" />}
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs capitalize ${
                      sale.status === 'complete' ? 'bg-green-100 text-green-700' :
                      sale.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                      'bg-[var(--bg-panel)] text-[var(--text-sec)]'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        sale.status === 'complete' ? 'bg-green-500' :
                        sale.status === 'pending' ? 'bg-orange-500' :
                        'bg-gray-500'
                      }`}></div>
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewSale(sale.id)}
                        className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100"
                      >{t.view}</button>
                      <button
                        className="text-[var(--text-mute)] hover:text-[var(--text-sec)]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
          <p className="text-sm text-[var(--text-sec)]">{t.showing} 1 {t.to} {mockSales.length} {t.of} {mockSales.length} {t.sales}</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-[var(--border-core)] rounded-lg text-sm hover:bg-[var(--bg-core)]">{t.previous}</button>
            <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-1.5 border border-[var(--border-core)] rounded-lg text-sm hover:bg-[var(--bg-core)]">2</button>
            <button className="px-3 py-1.5 border border-[var(--border-core)] rounded-lg text-sm hover:bg-[var(--bg-core)]">3</button>
            <button className="px-3 py-1.5 border border-[var(--border-core)] rounded-lg text-sm hover:bg-[var(--bg-core)]">{t.next}</button>
          </div>
        </div>
      </div>
    </div>
  );
}