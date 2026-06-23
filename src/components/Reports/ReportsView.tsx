import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Printer, TrendingUp, TrendingDown, DollarSign, AlertCircle, Clock, FileSpreadsheet, Wallet } from 'lucide-react';
import { 
  profitLossData, monthlyProfitLoss, debtAgingData, debtCollectionSummary, 
  taxSummary, taxBreakdown, expensesByCategory, monthlyExpenseTrend, 
  cashFlowData, cashFlowSummary, topDebtors, topExpenseVendors 
} from './mockData';
import { translations } from './translations';
import { LanguageOpt } from '../../types';
import PrintSettingsModal, { PrintSettings, DEFAULT_PRINT_SETTINGS } from './PrintSettingsModal';
import PrintableFormalReport from './PrintableFormalReport';

const PeriodPicker = ({ selectedPeriod, onPeriodChange, t }: { selectedPeriod: string; onPeriodChange: (period: string) => void; t: any }) => {
  const periods = [
    { id: 'Today', label: t.today },
    { id: 'Week', label: t.week },
    { id: 'Month', label: t.month },
    { id: 'Custom', label: t.custom }
  ];
  return (
    <div className="flex items-center gap-2 bg-[var(--bg-panel)] rounded-lg border border-[var(--border-subtle)] p-1">
      {periods.map((period) => (
        <button
          key={period.id}
          onClick={() => onPeriodChange(period.id)}
          className={`px-4 py-2 rounded-md text-sm transition-colors font-medium ${
            selectedPeriod === period.id
              ? 'bg-[#0077C5]/10 text-[#0077C5]'
              : 'text-[var(--text-sec)] hover:bg-[var(--bg-panel-inner)] hover:text-[var(--text-core)]'
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
};

const ExportBar = ({ t, selectedReport, onOpenPrintModal }: { t: any; selectedReport: string; onOpenPrintModal: () => void }) => {
  const handleExportExcel = () => {
    let csv = '';
    const dateStr = new Date().toISOString().split('T')[0];
    if (selectedReport === 'profit-loss') {
      csv = 'Month,Revenue,Expenses,Profit\n' + monthlyProfitLoss.map(r => `${r.month},${r.revenue},${r.expenses},${r.profit}`).join('\n');
    } else if (selectedReport === 'debt') {
      csv = 'Category,Amount,Count\n' + debtAgingData.map(r => `${r.category},${r.amount},${r.count}`).join('\n');
    } else if (selectedReport === 'tax') {
      csv = 'Category,Amount,Percentage\n' + taxBreakdown.map(r => `${r.category},${r.amount},${r.percentage}`).join('\n');
    } else if (selectedReport === 'expense') {
      csv = 'Category,Amount,Percentage\n' + expensesByCategory.map(r => `${r.name},${r.amount},${r.percentage}`).join('\n');
    } else if (selectedReport === 'cashflow') {
      csv = 'Day,CashIn,CashOut,Net\n' + cashFlowData.map(r => `${r.day},${r.cashIn},${r.cashOut},${r.net}`).join('\n');
    }
    if (!csv) return;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `fintrack_${selectedReport}_report_${dateStr}.csv`;
    link.click();
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={onOpenPrintModal}
        className="flex items-center gap-2 px-4 py-2 bg-[#0077C5] text-white rounded-lg hover:bg-[#005a96] transition-colors text-sm font-semibold shadow-sm"
      >
        <FileText className="w-4 h-4" />
        {t.exportPdf}
      </button>
      <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-panel)] border border-[var(--border-core)] rounded-lg hover:bg-[var(--bg-panel-inner)] text-[var(--text-core)] transition-colors text-sm font-medium shadow-sm">
        <FileSpreadsheet className="w-4 h-4 text-green-600" />
        {t.exportExcel}
      </button>
      <button onClick={onOpenPrintModal} className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-panel)] border border-[var(--border-core)] rounded-lg hover:bg-[var(--bg-panel-inner)] text-[var(--text-core)] transition-colors text-sm font-medium shadow-sm">
        <Printer className="w-4 h-4 text-[var(--text-sec)]" />
        {t.print}
      </button>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, icon: Icon, trend, color }: any) => {
  return (
    <div className="bg-[var(--bg-panel)] rounded-xl p-6 border border-[var(--border-subtle)] shadow-sm hover:border-[#0077C5]/30 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-bold ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
      <p className="text-[var(--text-sec)] text-sm mb-1 font-semibold">{title}</p>
      <h3 className="text-2xl font-bold mb-1 text-[var(--text-core)] tracking-tight">{value}</h3>
      {subtitle && <p className="text-xs text-[var(--text-mute)] font-medium">{subtitle}</p>}
    </div>
  );
};

const ProfitLossReport = ({ t }: { t: any }) => {
  const revenueChange = ((profitLossData.revenue - profitLossData.previousRevenue) / profitLossData.previousRevenue * 100).toFixed(1);
  const expenseChange = ((profitLossData.expenses - profitLossData.previousExpenses) / profitLossData.previousExpenses * 100).toFixed(1);
  const profitChange = ((profitLossData.netProfit - profitLossData.previousProfit) / profitLossData.previousProfit * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t.totalRevenue}
          value={`ETB ${profitLossData.revenue.toLocaleString()}`}
          subtitle={t.fromAllSales}
          icon={DollarSign}
          color="bg-gradient-to-br from-green-500 to-emerald-600"
          trend={{ value: revenueChange, isPositive: Number(revenueChange) > 0 }}
        />
        <StatCard
          title={t.totalExpenses}
          value={`ETB ${profitLossData.expenses.toLocaleString()}`}
          subtitle={t.allCategories}
          icon={TrendingDown}
          color="bg-gradient-to-br from-red-500 to-rose-600"
          trend={{ value: expenseChange, isPositive: Number(expenseChange) < 0 }}
        />
        <StatCard
          title={t.netProfit}
          value={`ETB ${profitLossData.netProfit.toLocaleString()}`}
          subtitle={t.revMinusExp}
          icon={TrendingUp}
          color="bg-gradient-to-br from-indigo-500 to-purple-600"
          trend={{ value: profitChange, isPositive: Number(profitChange) > 0 }}
        />
        <StatCard
          title={t.profitMargin}
          value={`${profitLossData.profitMargin}%`}
          subtitle={t.operatingEfficiency}
          icon={FileText}
          color="bg-gradient-to-br from-[#0077C5] to-[#005a96]"
        />
      </div>

      <div className="bg-[var(--bg-panel)] rounded-xl p-6 border border-[var(--border-subtle)] shadow-sm">
        <h3 className="text-lg font-bold text-[var(--text-core)] mb-6">{t.monthlyPlTrend}</h3>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={monthlyProfitLoss}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-sec)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: 'var(--text-sec)' }} axisLine={false} tickLine={false} />
            <RechartsTooltip
              contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-core)', backgroundColor: 'var(--bg-panel)', color: 'var(--text-core)' }}
              formatter={(value: any) => `ETB ${value.toLocaleString()}`}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Area type="monotone" dataKey="revenue" name={t.totalRevenue} fill="#3b82f6" fillOpacity={0.1} stroke="none" />
            <Bar dataKey="revenue" name={t.totalRevenue} fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="expenses" name={t.totalExpenses} fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Line type="monotone" dataKey="profit" name={t.netProfit} stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: 'var(--bg-panel)' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[var(--bg-panel)] rounded-xl p-6 border border-[var(--border-subtle)] shadow-sm max-w-2xl">
        <h3 className="text-lg font-bold text-[var(--text-core)] mb-4">{t.detailedBreakdown}</h3>
        <div className="space-y-3 font-medium">
          <div className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)]">
            <span className="text-sm text-[var(--text-sec)]">{t.grossRevenue}</span>
            <span className="text-sm text-[var(--text-core)]">ETB ${profitLossData.revenue.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)]">
            <span className="text-sm text-[var(--text-sec)]">{t.totalOperatingExp}</span>
            <span className="text-sm text-red-500">-ETB ${profitLossData.expenses.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between py-3 pt-3 border-t-2 border-[var(--border-core)]">
            <span className="text-sm text-[var(--text-core)]">{t.netProfit}</span>
            <span className="text-lg text-green-500 font-bold">ETB ${profitLossData.netProfit.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const DebtReport = ({ t }: { t: any }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t.totalReceivables}
          value={`ETB ${debtCollectionSummary.totalReceivables.toLocaleString()}`}
          subtitle={t.amountOwedToUs}
          icon={TrendingUp}
          color="bg-gradient-to-br from-green-500 to-emerald-600"
        />
        <StatCard
          title={t.totalPayables}
          value={`ETB ${debtCollectionSummary.totalPayables.toLocaleString()}`}
          subtitle={t.amountWeOwe}
          icon={TrendingDown}
          color="bg-gradient-to-br from-red-500 to-rose-600"
        />
        <StatCard
          title={t.netPosition}
          value={`ETB ${debtCollectionSummary.netPosition.toLocaleString()}`}
          subtitle={t.recMinusPay}
          icon={DollarSign}
          color="bg-gradient-to-br from-indigo-500 to-purple-600"
        />
        <StatCard
          title={t.collectionRate}
          value={`${debtCollectionSummary.collectionRate}%`}
          subtitle={t.avgDaysToCollect.replace('{days}', debtCollectionSummary.averageDaysToCollect)}
          icon={Clock}
          color="bg-gradient-to-br from-[#0077C5] to-[#005a96]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-panel)] rounded-xl p-6 border border-[var(--border-subtle)] shadow-sm">
          <h3 className="text-lg font-bold text-[var(--text-core)] mb-6">{t.agingSchedule}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={debtAgingData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: 'var(--text-sec)' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="category" type="category" tick={{ fontSize: 12, fill: 'var(--text-core)', fontWeight: 500 }} width={80} axisLine={false} tickLine={false} />
              <RechartsTooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-core)', backgroundColor: 'var(--bg-panel)', color: 'var(--text-core)' }}
                formatter={(value: any) => `ETB ${value.toLocaleString()}`}
              />
              <Bar dataKey="amount" fill="#3b82f6" radius={[0, 4, 4, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[var(--bg-panel)] rounded-xl p-6 border border-[var(--border-subtle)] shadow-sm">
          <h3 className="text-lg font-bold text-[var(--text-core)] mb-4">{t.topDebtors}</h3>
          <div className="space-y-3">
            {topDebtors.map((debtor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[var(--bg-panel-inner)] rounded-lg border border-[var(--border-subtle)]">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[var(--text-core)]">{debtor.name}</p>
                  <p className="text-xs text-[var(--text-mute)] mt-0.5">{debtor.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[var(--text-core)]">ETB ${debtor.amount.toLocaleString()}</p>
                  <p className="text-xs text-red-500 font-medium mt-0.5">{debtor.daysOverdue} {t.daysOverdue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-panel)] rounded-xl p-6 border border-[var(--border-subtle)] shadow-sm">
        <h3 className="text-lg font-bold text-[var(--text-core)] mb-4">{t.debtDistribution}</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {debtAgingData.map((item, index) => (
            <div key={index} className="text-center p-4 bg-[var(--bg-panel-inner)] rounded-xl border border-[var(--border-subtle)]">
              <p className="text-xs font-semibold text-[var(--text-sec)] uppercase tracking-wider mb-2">{item.category}</p>
              <p className="text-lg font-bold text-[var(--text-core)] mb-1">ETB ${item.amount.toLocaleString()}</p>
              <p className="text-xs text-[var(--text-mute)] font-medium">{item.count} {t.invoicesCount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TaxReport = ({ t }: { t: any }) => {
  const taxChange = ((taxSummary.totalTaxLiability - taxSummary.previousMonthTax) / taxSummary.previousMonthTax * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t.totalSales}
          value={`ETB ${taxSummary.totalSales.toLocaleString()}`}
          subtitle={t.grossSalesAmount}
          icon={DollarSign}
          color="bg-gradient-to-br from-[#0077C5] to-[#005a96]"
        />
        <StatCard
          title={t.taxableAmount}
          value={`ETB ${taxSummary.taxableAmount.toLocaleString()}`}
          subtitle={t.afterExemptions}
          icon={FileText}
          color="bg-gradient-to-br from-indigo-500 to-purple-600"
        />
        <StatCard
          title={t.vatCollected}
          value={`ETB ${taxSummary.vatCollected.toLocaleString()}`}
          subtitle={t.vat15}
          icon={TrendingUp}
          color="bg-gradient-to-br from-green-500 to-emerald-600"
        />
        <StatCard
          title={t.totCollected}
          value={`ETB ${taxSummary.totCollected.toLocaleString()}`}
          subtitle={t.tot5}
          icon={TrendingUp}
          color="bg-gradient-to-br from-orange-500 to-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-panel)] rounded-xl p-6 border border-[var(--border-subtle)] shadow-sm">
          <h3 className="text-lg font-bold text-[var(--text-core)] mb-6">{t.taxBreakdown}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taxBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="amount"
              >
                {taxBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#f59e0b'} />
                ))}
              </Pie>
              <RechartsTooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-core)', backgroundColor: 'var(--bg-panel)', color: 'var(--text-core)' }}
                formatter={(value: any) => `ETB ${value.toLocaleString()}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[var(--bg-panel)] rounded-xl p-6 border border-[var(--border-subtle)] shadow-sm">
          <h3 className="text-lg font-bold text-[var(--text-core)] mb-4">{t.taxSummary}</h3>
          <div className="space-y-4">
            <div className="p-5 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[var(--text-sec)]">{t.totalTaxLiability}</span>
                <div className={`flex items-center gap-1 text-xs font-bold ${Number(taxChange) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {Number(taxChange) > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{Math.abs(Number(taxChange))}%</span>
                </div>
              </div>
              <p className="text-3xl font-black text-blue-500 tracking-tight">ETB ${taxSummary.totalTaxLiability.toLocaleString()}</p>
              <p className="text-xs text-[var(--text-mute)] font-medium mt-1">{t.vsLastMonth.replace('{amount}', `ETB ${taxSummary.previousMonthTax.toLocaleString()}`)}</p>
            </div>

            <div className="space-y-3 pt-2">
              {taxBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[var(--bg-panel-inner)] rounded-lg border border-[var(--border-subtle)]">
                  <span className="text-sm font-medium text-[var(--text-core)]">{item.category}</span>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[var(--text-core)]">ETB ${item.amount.toLocaleString()}</p>
                    <p className="text-xs text-[var(--text-mute)] font-medium mt-0.5">{item.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[var(--border-core)]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--text-sec)]">{t.effectiveTaxRate}</span>
                <span className="text-sm font-bold text-[var(--text-core)]">{((taxSummary.totalTaxLiability / taxSummary.totalSales) * 100).toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-panel)] rounded-xl p-6 border border-[var(--border-subtle)] shadow-sm">
        <h3 className="text-lg font-bold text-[var(--text-core)] mb-4">{t.taxCalcDetails}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-core)]">
                <th className="py-3 px-4 text-xs font-bold text-[var(--text-mute)] uppercase tracking-wider">{t.description}</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-[var(--text-mute)] uppercase tracking-wider">{t.amount}</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-[var(--text-mute)] uppercase tracking-wider">{t.rate}</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-[var(--text-mute)] uppercase tracking-wider">{t.tax}</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              <tr className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-panel-inner)] transition-colors">
                <td className="py-3 px-4 text-[var(--text-core)]">{t.totalSales}</td>
                <td className="py-3 px-4 text-right text-[var(--text-core)]">ETB ${taxSummary.totalSales.toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-[var(--text-sec)]">-</td>
                <td className="py-3 px-4 text-right text-[var(--text-sec)]">-</td>
              </tr>
              <tr className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-panel-inner)] transition-colors">
                <td className="py-3 px-4 text-[var(--text-core)]">VAT (Value Added Tax)</td>
                <td className="py-3 px-4 text-right text-[var(--text-core)]">ETB ${taxSummary.taxableAmount.toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-[var(--text-sec)]">15%</td>
                <td className="py-3 px-4 text-right text-[var(--text-core)]">ETB ${taxSummary.vatCollected.toLocaleString()}</td>
              </tr>
              <tr className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-panel-inner)] transition-colors">
                <td className="py-3 px-4 text-[var(--text-core)]">TOT (Turnover Tax)</td>
                <td className="py-3 px-4 text-right text-[var(--text-core)]">ETB ${taxSummary.totalSales.toLocaleString()}</td>
                <td className="py-3 px-4 text-right text-[var(--text-sec)]">5%</td>
                <td className="py-3 px-4 text-right text-[var(--text-core)]">ETB ${taxSummary.totCollected.toLocaleString()}</td>
              </tr>
              <tr className="bg-[var(--bg-panel-inner)] font-bold">
                <td className="py-4 px-4 text-[var(--text-core)]">{t.totalTaxLiability}</td>
                <td className="py-4 px-4 text-right text-[var(--text-sec)]">-</td>
                <td className="py-4 px-4 text-right text-[var(--text-sec)]">-</td>
                <td className="py-4 px-4 text-right text-indigo-500">ETB ${taxSummary.totalTaxLiability.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ExpenseReport = ({ t }: { t: any }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t.totalExpenses}
          value={`ETB ${expensesByCategory.reduce((sum, cat) => sum + cat.amount, 0).toLocaleString()}`}
          subtitle={t.allCategories}
          icon={TrendingDown}
          color="bg-gradient-to-br from-red-500 to-rose-600"
        />
        <StatCard
          title={t.topCategory}
          value="Salaries"
          subtitle={`ETB ${expensesByCategory.find(c => c.name === 'Salaries & Wages')?.amount.toLocaleString()}`}
          icon={DollarSign}
          color="bg-gradient-to-br from-purple-500 to-pink-600"
        />
        <StatCard
          title={t.categories}
          value={expensesByCategory.length.toString()}
          subtitle={t.trackedCategories}
          icon={FileText}
          color="bg-gradient-to-br from-[#0077C5] to-[#005a96]"
        />
        <StatCard
          title={t.avgPerCategory}
          value={`ETB ${(expensesByCategory.reduce((sum, cat) => sum + cat.amount, 0) / expensesByCategory.length).toLocaleString()}`}
          subtitle={t.monthlyAverage}
          icon={AlertCircle}
          color="bg-gradient-to-br from-orange-500 to-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-panel)] rounded-xl p-6 border border-[var(--border-subtle)] shadow-sm">
          <h3 className="text-lg font-bold text-[var(--text-core)] mb-6">{t.expenseDistribution}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expensesByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${percentage.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="amount"
              >
                {expensesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-core)', backgroundColor: 'var(--bg-panel)', color: 'var(--text-core)' }}
                formatter={(value: any) => `ETB ${value.toLocaleString()}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[var(--bg-panel)] rounded-xl p-6 border border-[var(--border-subtle)] shadow-sm">
          <h3 className="text-lg font-bold text-[var(--text-core)] mb-4">{t.categoryBreakdown}</h3>
          <div className="space-y-4">
            {expensesByCategory.map((category, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="flex items-center gap-2 text-[var(--text-core)]">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                    {category.name}
                  </span>
                  <span className="text-[var(--text-core)]">ETB ${category.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-[var(--border-core)] rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${category.percentage}%`, backgroundColor: category.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-panel)] rounded-xl p-6 border border-[var(--border-subtle)] shadow-sm">
        <h3 className="text-lg font-bold text-[var(--text-core)] mb-6">{t.monthlyExpTrend}</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={monthlyExpenseTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-sec)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: 'var(--text-sec)' }} axisLine={false} tickLine={false} />
            <RechartsTooltip
              contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-core)', backgroundColor: 'var(--bg-panel)', color: 'var(--text-core)' }}
              formatter={(value: any) => `ETB ${value.toLocaleString()}`}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="rent" stackId="a" fill="#3b82f6" maxBarSize={40} />
            <Bar dataKey="salaries" stackId="a" fill="#10b981" maxBarSize={40} />
            <Bar dataKey="marketing" stackId="a" fill="#f59e0b" maxBarSize={40} />
            <Bar dataKey="supplies" stackId="a" fill="#ef4444" maxBarSize={40} />
            <Bar dataKey="transport" stackId="a" fill="#8b5cf6" maxBarSize={40} />
            <Bar dataKey="misc" stackId="a" fill="#ec4899" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[var(--bg-panel)] rounded-xl p-6 border border-[var(--border-subtle)] shadow-sm">
        <h3 className="text-lg font-bold text-[var(--text-core)] mb-4">{t.topVendors}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-core)]">
                <th className="py-3 px-4 text-xs font-bold text-[var(--text-mute)] uppercase tracking-wider">{t.vendor}</th>
                <th className="py-3 px-4 text-xs font-bold text-[var(--text-mute)] uppercase tracking-wider">{t.category}</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-[var(--text-mute)] uppercase tracking-wider">{t.transactions}</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-[var(--text-mute)] uppercase tracking-wider">{t.totalAmount}</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {topExpenseVendors.map((vendor, index) => (
                <tr key={index} className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-panel-inner)] transition-colors">
                  <td className="py-3 px-4 text-[var(--text-core)]">{vendor.name}</td>
                  <td className="py-3 px-4 text-[var(--text-sec)]">{vendor.category}</td>
                  <td className="py-3 px-4 text-right text-[var(--text-sec)]">{vendor.transactions}</td>
                  <td className="py-3 px-4 text-right text-[var(--text-core)]">ETB ${vendor.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const CashFlowReport = ({ t }: { t: any }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t.totalCashIn}
          value={`ETB ${cashFlowSummary.totalCashIn.toLocaleString()}`}
          subtitle={t.allInflows}
          icon={TrendingUp}
          color="bg-gradient-to-br from-green-500 to-emerald-600"
        />
        <StatCard
          title={t.totalCashOut}
          value={`ETB ${cashFlowSummary.totalCashOut.toLocaleString()}`}
          subtitle={t.allOutflows}
          icon={TrendingDown}
          color="bg-gradient-to-br from-red-500 to-rose-600"
        />
        <StatCard
          title={t.netCashFlow}
          value={`ETB ${cashFlowSummary.netCashFlow.toLocaleString()}`}
          subtitle={t.inMinusOut}
          icon={DollarSign}
          color="bg-gradient-to-br from-indigo-500 to-purple-600"
          trend={{ value: cashFlowSummary.cashFlowGrowth, isPositive: true }}
        />
        <StatCard
          title={t.closingBalance}
          value={`ETB ${cashFlowSummary.closingBalance.toLocaleString()}`}
          subtitle={t.fromOpening.replace('{amount}', `ETB ${cashFlowSummary.openingBalance.toLocaleString()}`)}
          icon={Wallet}
          color="bg-gradient-to-br from-[#0077C5] to-[#005a96]"
        />
      </div>

      <div className="bg-[var(--bg-panel)] rounded-xl p-6 border border-[var(--border-subtle)] shadow-sm">
        <h3 className="text-lg font-bold text-[var(--text-core)] mb-6">{t.dailyCashFlow}</h3>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={cashFlowData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--text-sec)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: 'var(--text-sec)' }} axisLine={false} tickLine={false} />
            <RechartsTooltip
              contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-core)', backgroundColor: 'var(--bg-panel)', color: 'var(--text-core)' }}
              formatter={(value: any) => `ETB ${value.toLocaleString()}`}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="cashIn" name={t.totalCashIn} fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30} />
            <Bar dataKey="cashOut" name={t.totalCashOut} fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={30} />
            <Line type="monotone" dataKey="net" name={t.netCashFlow} stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: 'var(--bg-panel)' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-panel)] rounded-xl p-6 border border-[var(--border-subtle)] shadow-sm">
          <h3 className="text-lg font-bold text-[var(--text-core)] mb-4">{t.cashFlowSummary}</h3>
          <div className="space-y-3 font-medium">
            <div className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)]">
              <span className="text-sm text-[var(--text-sec)]">{t.openingBalance}</span>
              <span className="text-sm text-[var(--text-core)]">ETB ${cashFlowSummary.openingBalance.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)]">
              <span className="text-sm text-[var(--text-sec)]">{t.totalCashIn}</span>
              <span className="text-sm text-green-500">+${cashFlowSummary.totalCashIn.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)]">
              <span className="text-sm text-[var(--text-sec)]">{t.totalCashOut}</span>
              <span className="text-sm text-red-500">-ETB ${cashFlowSummary.totalCashOut.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)]">
              <span className="text-sm text-[var(--text-sec)]">{t.netCashFlow}</span>
              <span className="text-sm text-[#0077C5]">ETB ${cashFlowSummary.netCashFlow.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-3 pt-3 border-t-2 border-[var(--border-core)]">
              <span className="text-sm text-[var(--text-core)]">{t.closingBalance}</span>
              <span className="text-lg text-blue-500 font-bold">ETB ${cashFlowSummary.closingBalance.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-panel)] rounded-xl p-6 border border-[var(--border-subtle)] shadow-sm">
          <h3 className="text-lg font-bold text-[var(--text-core)] mb-4">{t.dailyPerformance}</h3>
          <div className="space-y-3">
            {cashFlowData.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[var(--bg-panel-inner)] border border-[var(--border-subtle)] rounded-lg font-medium">
                <span className="text-sm text-[var(--text-core)]">{day.day}</span>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-green-500">+${day.cashIn.toLocaleString()}</span>
                  <span className="text-xs text-red-500">-ETB ${day.cashOut.toLocaleString()}</span>
                  <span className={`text-sm font-bold ${day.net > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${day.net.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ReportsView({ language }: { language: LanguageOpt }) {
  const [selectedReport, setSelectedReport] = useState<'profit-loss' | 'debt' | 'tax' | 'expense' | 'cashflow'>('profit-loss');
  const [selectedPeriod, setSelectedPeriod] = useState('Month');
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [printSettings, setPrintSettings] = useState<PrintSettings>(DEFAULT_PRINT_SETTINGS);

  const t = translations[language.code as keyof typeof translations] || translations.en;

  const handlePrint = () => {
    setPrintModalOpen(false);
    // Small delay to let the modal close before printing
    setTimeout(() => window.print(), 100);
  };

  const reportTabs = [
    { id: 'profit-loss', label: t.profitLoss, icon: TrendingUp },
    { id: 'debt', label: t.debtReport, icon: Clock },
    { id: 'tax', label: t.taxReport, icon: FileText },
    { id: 'expense', label: t.expenseReport, icon: TrendingDown },
    { id: 'cashflow', label: t.cashFlow, icon: DollarSign }
  ];

  return (
    <div id="printable-invoice" className="h-full overflow-y-auto p-4 md:p-8 space-y-6 bg-[var(--bg-core)]">
      {/* Header */}
      <div className="bg-[var(--bg-panel)] border border-[var(--border-core)] rounded-2xl shadow-sm p-6 print:border-none print:shadow-none">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-core)] mb-1 tracking-tight">{t.reportsHub}</h1>
            <p className="text-sm font-medium text-[var(--text-sec)]">{t.reportsDesc}</p>
          </div>
          <ExportBar t={t} selectedReport={selectedReport} onOpenPrintModal={() => setPrintModalOpen(true)} />
        </div>

        {/* Report Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6 print:hidden">
          {reportTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedReport === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedReport(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all font-medium ${
                  isSelected
                    ? 'bg-[#0077C5]/10 text-[#0077C5] border border-[#0077C5]/30 shadow-sm'
                    : 'bg-[var(--bg-panel-inner)] border border-[var(--border-core)] text-[var(--text-sec)] hover:text-[var(--text-core)] hover:border-[var(--border-subtle)]'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Period Picker */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-[var(--border-subtle)] gap-4 print:hidden">
          <PeriodPicker selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} t={t} />
          <div className="text-sm font-medium text-[var(--text-sec)] bg-[var(--bg-panel-inner)] px-4 py-2 rounded-lg border border-[var(--border-core)]">
            {t.showingDataFor} <span className="text-[var(--text-core)] font-bold">{selectedPeriod === 'Month' ? `${t.june} 2026` : selectedPeriod}</span>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="print:hidden">
        {selectedReport === 'profit-loss' && <ProfitLossReport t={t} />}
        {selectedReport === 'debt' && <DebtReport t={t} />}
        {selectedReport === 'tax' && <TaxReport t={t} />}
        {selectedReport === 'expense' && <ExpenseReport t={t} />}
        {selectedReport === 'cashflow' && <CashFlowReport t={t} />}
      </div>

      {/* Print Settings Modal */}
      <PrintSettingsModal
        open={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        settings={printSettings}
        onChange={setPrintSettings}
        onPrint={handlePrint}
      />

      {/* Hidden Formal Print Document — revealed only during window.print() */}
      <PrintableFormalReport settings={printSettings} selectedReport={selectedReport} />
    </div>
  );
}
