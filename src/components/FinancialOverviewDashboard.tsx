import { LanguageOpt } from '../types';
import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Wallet, CreditCard, ShoppingCart, AlertTriangle, Bell, Plus, FileText, ArrowUpRight, ArrowDownRight, MoreVertical } from 'lucide-react';

// Mock Data
const kpiData = {
  todaysSales: { value: 12426, change: 36, isPositive: true },
  profit: { value: 8945, change: 24, isPositive: true },
  expenses: { value: 3481, change: 14, isPositive: false },
  cashBalance: { value: 45280, change: 12, isPositive: true }
};

const weeklyProfitData = [
  { day: 'Mon', profit: 3200, revenue: 5400 },
  { day: 'Tue', profit: 2800, revenue: 4900 },
  { day: 'Wed', profit: 4100, revenue: 6200 },
  { day: 'Thu', profit: 3600, revenue: 5800 },
  { day: 'Fri', profit: 4800, revenue: 7100 },
  { day: 'Sat', profit: 5200, revenue: 7800 },
  { day: 'Sun', profit: 3900, revenue: 6400 }
];

const recentTransactions = [
  { id: 1, type: 'sale', description: 'Product Sale - Invoice #1234', amount: 450.00, date: 'May 31, 2026', status: 'completed', customer: 'ABC Corp' },
  { id: 2, type: 'expense', description: 'Office Supplies', amount: -125.50, date: 'May 31, 2026', status: 'completed', vendor: 'Office Depot' },
  { id: 3, type: 'sale', description: 'Service Payment - INV #1235', amount: 890.00, date: 'May 30, 2026', status: 'completed', customer: 'XYZ Ltd' },
  { id: 4, type: 'expense', description: 'Utility Bills', amount: -340.00, date: 'May 30, 2026', status: 'completed', vendor: 'Electric Co' },
  { id: 5, type: 'sale', description: 'Product Sale - Invoice #1236', amount: 620.00, date: 'May 29, 2026', status: 'completed', customer: 'Tech Solutions' }
];

const topDebtors = [
  { id: 1, name: 'Jenny Wilson', email: 'j.wilson@example.com', amount: 11234, location: 'Austin', overdueDays: 15 },
  { id: 2, name: 'Devon Lane', email: 'dst.roberts@example.com', amount: 11159, location: 'New York', overdueDays: 8 },
  { id: 3, name: 'Jane Cooper', email: 'jgraham@example.com', amount: 10483, location: 'Toledo', overdueDays: 22 },
  { id: 4, name: 'Robert Fox', email: 'robert.f@example.com', amount: 9875, location: 'Chicago', overdueDays: 5 }
];

const lowStockAlerts = [
  { id: 1, product: 'Premium Coffee Beans', currentStock: 12, reorderLevel: 50, category: 'Beverages' },
  { id: 2, product: 'Printer Paper A4', currentStock: 8, reorderLevel: 30, category: 'Office Supplies' },
  { id: 3, product: 'Hand Sanitizer 500ml', currentStock: 5, reorderLevel: 25, category: 'Health & Safety' },
  { id: 4, product: 'USB Flash Drives 32GB', currentStock: 15, reorderLevel: 40, category: 'Electronics' }
];

const remindersToday = [
  { id: 1, customer: 'ABC Corporation', amount: 2500, time: '10:00 AM', type: 'Payment Due', priority: 'high' },
  { id: 2, customer: 'Smith & Associates', amount: 1800, time: '2:00 PM', type: 'Follow-up Call', priority: 'medium' },
  { id: 3, customer: 'Global Tech Inc', amount: 3200, time: '4:30 PM', type: 'Payment Due', priority: 'high' }
];

const expenseBreakdown = [
  { name: 'Operations', value: 50, color: '#3b82f6' },
  { name: 'Marketing', value: 30, color: '#10b981' },
  { name: 'Admin', value: 20, color: '#f59e0b' }
];

// Components
const KPICard = ({ title, value, change, isPositive, icon: Icon, color, vsLabel }: any) => {
  return (
    <div className="bg-[var(--bg-panel)] rounded-xl p-6 shadow-sm border border-[var(--border-core)] hover:border-[#0077C5]/30 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[var(--text-sec)] text-sm mb-1 font-semibold">{title}</p>
          <h3 className="text-3xl mt-2 mb-3 font-black text-[var(--text-core)]">${value.toLocaleString()}</h3>
          <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{isPositive ? '+' : '-'}{Math.abs(change)}%</span>
            <span className="text-[var(--text-mute)] font-medium ml-1">{vsLabel || 'vs yesterday'}</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

const TransactionItem = ({ transaction }: any) => {
  const isIncome = transaction.type === 'sale';
  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)] last:border-0">
      <div className="flex items-center gap-3 flex-1">
        <div className={`p-2 rounded-lg ${isIncome ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
          {isIncome ? (
            <ArrowUpRight className={`w-4 h-4 ${isIncome ? 'text-green-500' : 'text-red-500'}`} />
          ) : (
            <ArrowDownRight className={`w-4 h-4 text-red-500`} />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-core)]">{transaction.description}</p>
          <p className="text-xs text-[var(--text-sec)]">{transaction.date}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-sm font-bold ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
          {isIncome ? '+' : ''}{transaction.amount < 0 ? transaction.amount : `$${transaction.amount.toLocaleString()}`}
        </span>
        <div className={`w-2 h-2 rounded-full ${isIncome ? 'bg-green-500' : 'bg-red-500'}`}></div>
      </div>
    </div>
  );
};

const DebtorCard = ({ debtor }: any) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)] last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
          {debtor.name.split(' ').map((n: string) => n[0]).join('')}
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-core)]">{debtor.name}</p>
          <p className="text-xs text-[var(--text-sec)]">{debtor.email}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-[var(--text-core)]">${debtor.amount.toLocaleString()}</p>
        <p className="text-xs text-[var(--text-sec)]">{debtor.location}</p>
      </div>
    </div>
  );
};

const StockAlertItem = ({ item }: any) => {
  const urgency = item.currentStock < item.reorderLevel * 0.3 ? 'high' : 'medium';
  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)] last:border-0">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${urgency === 'high' ? 'bg-red-500/10' : 'bg-orange-500/10'}`}>
          <AlertTriangle className={`w-4 h-4 ${urgency === 'high' ? 'text-red-500' : 'text-orange-500'}`} />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-core)]">{item.product}</p>
          <p className="text-xs text-[var(--text-sec)]">{item.category}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-red-500">{item.currentStock} units</p>
        <p className="text-xs text-[var(--text-sec)]">Min: {item.reorderLevel}</p>
      </div>
    </div>
  );
};

const ReminderItem = ({ reminder }: any) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)] last:border-0">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${reminder.priority === 'high' ? 'bg-red-500/10' : 'bg-blue-500/10'}`}>
          <Bell className={`w-4 h-4 ${reminder.priority === 'high' ? 'text-red-500' : 'text-blue-500'}`} />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-core)]">{reminder.customer}</p>
          <p className="text-xs text-[var(--text-sec)]">{reminder.type} - {reminder.time}</p>
        </div>
      </div>
      <span className="text-sm font-bold text-[var(--text-core)]">${reminder.amount.toLocaleString()}</span>
    </div>
  );
};

const QuickActionButton = ({ icon: Icon, label, color }: any) => {
  return (
    <button className={`flex items-center gap-2 px-4 py-3 rounded-lg ${color} text-white hover:opacity-90 hover:-translate-y-0.5 transition-all w-full justify-center shadow-sm cursor-pointer`}>
      <Icon className="w-5 h-5" />
      <span className="text-sm font-bold">{label}</span>
    </button>
  );
};

export default function FinancialOverviewDashboard({ selectedLanguage }: { selectedLanguage?: LanguageOpt }) {
  const isAmharic = selectedLanguage?.code === 'am';
  const t = {
    greeting: isAmharic ? 'ሰላም ማሪያና - ዛሬ በሱቅዎ ውስጥ የሆነው ይሄ ነው' : 'Hey Mariana - here\'s what\'s happening with your store today',
    overview: isAmharic ? 'የፋይናንስ አጠቃላይ እይታ' : 'Financial Overview Dashboard',
    sales: isAmharic ? 'የዛሬ ሽያጭ' : 'TODAY\'S SALES',
    profit: isAmharic ? 'ትርፍ' : 'PROFIT',
    expenses: isAmharic ? 'ወጪዎች' : 'EXPENSES',
    balance: isAmharic ? 'ጥሬ ገንዘብ ቀሪ' : 'CASH BALANCE',
    weeklyReport: isAmharic ? 'ሳምንታዊ የትርፍ ሪፖርት' : 'Weekly Profit Report',
    days7: isAmharic ? '7 ቀናት' : '7 Days',
    days30: isAmharic ? '30 ቀናት' : '30 Days',
    expenseBreakdown: isAmharic ? 'የወጪ ዝርዝር' : 'Expense Breakdown',
    recentTx: isAmharic ? 'የቅርብ ጊዜ ግብይቶች' : 'Recent Transactions',
    seeAll: isAmharic ? 'ሁሉንም አሳይ' : 'SEE ALL',
    topDebtors: isAmharic ? 'ዋና ባለዕዳዎች' : 'Top Debtors',
    lowStock: isAmharic ? 'አነስተኛ ክምችት ማስጠንቀቂያ' : 'Low Stock Alerts',
    items: isAmharic ? 'ዕቃዎች' : 'ITEMS',
    reminders: isAmharic ? 'የዛሬ ማስታወሻዎች' : 'Reminders Due Today',
    pending: isAmharic ? 'የሚጠበቁ' : 'PENDING',
    quickActions: isAmharic ? 'ፈጣን እርምጃዎች' : 'Quick Actions',
    vsYday: isAmharic ? 'ከትናንት ጋር ሲነፃፀር' : 'vs yesterday',
    quickSale: isAmharic ? 'ፈጣን ሽያጭ' : 'Quick Sale',
    recExpense: isAmharic ? 'ወጪ መዝግብ' : 'Record Expense',
    addDebt: isAmharic ? 'እዳ ጨምር' : 'Add Debt',
    viewReports: isAmharic ? 'ሪፖርቶችን እይ' : 'View Reports',
    last7: isAmharic ? 'ባለፈው 7 ቀናት' : 'Last 7 days',
    last30: isAmharic ? 'ባለፈው 30 ቀናት' : 'Last 30 days',
    chartRevenue: isAmharic ? 'ገቢ' : 'Revenue',
    chartProfit: isAmharic ? 'ትርፉ' : 'Profit',
  };

  const [timeFilter, setTimeFilter] = useState('7days');

  return (
    <div className="w-full h-full p-4 md:p-6 animate-fade-in text-left">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tight text-[var(--text-core)] mb-1">{t.greeting}</h1>
          <p className="text-[var(--text-sec)] text-sm font-medium">{t.overview}</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title={t.sales}
            value={kpiData.todaysSales.value}
            change={kpiData.todaysSales.change}
            isPositive={kpiData.todaysSales.isPositive}
            icon={ShoppingCart}
            color="bg-indigo-600"
            vsLabel={t.vsYday}
          />
          <KPICard
            title={t.profit}
            value={kpiData.profit.value}
            change={kpiData.profit.change}
            isPositive={kpiData.profit.isPositive}
            icon={TrendingUp}
            color="bg-green-600"
            vsLabel={t.vsYday}
          />
          <KPICard
            title={t.expenses}
            value={kpiData.expenses.value}
            change={kpiData.expenses.change}
            isPositive={kpiData.expenses.isPositive}
            icon={CreditCard}
            color="bg-orange-600"
            vsLabel={t.vsYday}
          />
          <KPICard
            title={t.balance}
            value={kpiData.cashBalance.value}
            change={kpiData.cashBalance.change}
            isPositive={kpiData.cashBalance.isPositive}
            icon={Wallet}
            color="bg-blue-600"
            vsLabel={t.vsYday}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Weekly Profit Chart - Spans 2 columns */}
          <div className="lg:col-span-2 bg-[var(--bg-panel)] rounded-xl p-6 shadow-sm border border-[var(--border-core)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[var(--text-core)]">{t.weeklyReport}</h2>
              <div className="flex gap-2 bg-[var(--bg-panel-inner)] p-1 rounded-lg border border-[var(--border-subtle)]">
                <button className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${timeFilter === '7days' ? 'bg-[#0077C5] text-white shadow-sm' : 'text-[var(--text-sec)] hover:text-[var(--text-core)]'}`} onClick={() => setTimeFilter('7days')}>{t.days7}</button>
                <button className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${timeFilter === '30days' ? 'bg-[#0077C5] text-white shadow-sm' : 'text-[var(--text-sec)] hover:text-[var(--text-core)]'}`} onClick={() => setTimeFilter('30days')}>{t.days30}</button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyProfitData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0077C5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0077C5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a5b4fc" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a5b4fc" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--text-mute)" style={{ fontSize: '12px' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="var(--text-mute)" style={{ fontSize: '12px' }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-core)', borderRadius: '8px', color: 'var(--text-core)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#a5b4fc" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name={t.chartRevenue} />
                <Area type="monotone" dataKey="profit" stroke="#0077C5" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" name={t.chartProfit} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-[var(--bg-panel)] rounded-xl p-6 shadow-sm border border-[var(--border-core)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text-core)]">{t.expenseBreakdown}</h2>
              <select className="text-xs bg-[var(--bg-panel-inner)] border border-[var(--border-core)] text-[var(--text-core)] rounded-lg px-2 py-1.5 outline-none cursor-pointer">
              <option>{t.last30}</option>
                <option>{t.last7}</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-core)', borderRadius: '8px', color: 'var(--text-core)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-3">
              {expenseBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                    <span className="text-[var(--text-sec)] font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-[var(--text-core)]">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Transactions */}
          <div className="bg-[var(--bg-panel)] rounded-xl p-6 shadow-sm border border-[var(--border-core)]">
            <div className="flex items-center justify-between mb-6 border-b border-[var(--border-subtle)] pb-4">
              <h2 className="text-lg font-bold text-[var(--text-core)]">{t.recentTx}</h2>
              <button className="text-xs font-black tracking-wider text-[#0077C5] hover:text-[#005a96] flex items-center gap-1 cursor-pointer transition-colors">
                SEE ALL
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div>
              {recentTransactions.map(transaction => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
          </div>

          {/* Top Debtors */}
          <div className="bg-[var(--bg-panel)] rounded-xl p-6 shadow-sm border border-[var(--border-core)]">
            <div className="flex items-center justify-between mb-6 border-b border-[var(--border-subtle)] pb-4">
              <h2 className="text-lg font-bold text-[var(--text-core)]">{t.topDebtors}</h2>
              <button className="text-[var(--text-mute)] hover:text-[var(--text-core)] cursor-pointer transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <div>
              {topDebtors.map(debtor => (
                <DebtorCard key={debtor.id} debtor={debtor} />
              ))}
            </div>
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Low Stock Alerts */}
          <div className="bg-[var(--bg-panel)] rounded-xl p-6 shadow-sm border border-[var(--border-core)]">
            <div className="flex items-center justify-between mb-6 border-b border-[var(--border-subtle)] pb-4">
              <h2 className="text-lg font-bold text-[var(--text-core)]">{t.lowStock}</h2>
              <span className="text-[10px] font-black bg-red-500/10 text-red-500 px-2 py-1 rounded border border-red-500/20">{lowStockAlerts.length} ITEMS</span>
            </div>
            <div>
              {lowStockAlerts.map(item => (
                <StockAlertItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Reminders Due Today */}
          <div className="bg-[var(--bg-panel)] rounded-xl p-6 shadow-sm border border-[var(--border-core)]">
            <div className="flex items-center justify-between mb-6 border-b border-[var(--border-subtle)] pb-4">
              <h2 className="text-lg font-bold text-[var(--text-core)]">{t.reminders}</h2>
              <span className="text-[10px] font-black bg-blue-500/10 text-blue-500 px-2 py-1 rounded border border-blue-500/20">{remindersToday.length} PENDING</span>
            </div>
            <div>
              {remindersToday.map(reminder => (
                <ReminderItem key={reminder.id} reminder={reminder} />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[var(--bg-panel)] rounded-xl p-6 shadow-sm border border-[var(--border-core)]">
          <h2 className="text-lg font-bold text-[var(--text-core)] mb-4">{t.quickActions}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionButton icon={Plus} label={t.quickSale} color="bg-indigo-600" />
            <QuickActionButton icon={CreditCard} label={t.recExpense} color="bg-orange-600" />
            <QuickActionButton icon={DollarSign} label={t.addDebt} color="bg-green-600" />
            <QuickActionButton icon={FileText} label={t.viewReports} color="bg-[#0077C5]" />
          </div>
        </div>
      </div>
    </div>
  );
}
