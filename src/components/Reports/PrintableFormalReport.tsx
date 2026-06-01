import React from 'react';
import { PrintSettings } from './PrintSettingsModal';
import {
  profitLossData, monthlyProfitLoss, debtAgingData, debtCollectionSummary,
  taxSummary, taxBreakdown, expensesByCategory, cashFlowSummary, cashFlowData,
  topDebtors, topExpenseVendors
} from './mockData';

interface Props {
  settings: PrintSettings;
  selectedReport: string;
}

// --- Cover Page ---
const CoverPage = ({ settings }: { settings: PrintSettings }) => {
  const accent = settings.accentColor;
  return (
    <div className="report-page cover-page" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <div className="cover-top-bar" style={{ backgroundColor: accent }}>
        <div className="cover-accent-block" style={{ backgroundColor: accent }}>
          <div className="cover-accent-inner" style={{ borderColor: accent, opacity: 0.3 }} />
        </div>
      </div>
      <div className="cover-body">
        <div className="cover-logo-area">
          <div className="cover-logo-box" style={{ borderColor: accent, color: accent }}>
            {settings.companyName.charAt(0).toUpperCase()}
          </div>
          <span className="cover-logo-text" style={{ color: accent }}>[COMPANY'S LOGO]</span>
        </div>
        <div className="cover-title-block">
          <h1 className="cover-title" style={{ color: accent }}>
            {settings.reportTitle.toUpperCase()}
          </h1>
          <div className="cover-year" style={{ color: accent }}>[{settings.year}]</div>
          <div className="cover-company-info">
            <div className="cover-company-name">{settings.companyName}</div>
            <div className="cover-company-detail">{settings.companyAddress}</div>
            <div className="cover-company-detail">{settings.companyContact}</div>
            <div className="cover-company-detail">{settings.companyEmail}</div>
          </div>
        </div>
      </div>
      <div className="cover-footer" style={{ backgroundColor: accent }}>
        <div className="cover-footer-col">
          <div className="cover-footer-label">Prepared by:</div>
          <div className="cover-footer-name">[{settings.preparedByName}]</div>
          <div className="cover-footer-detail">{settings.preparedByTitle}</div>
          <div className="cover-footer-detail">{settings.preparedByContact}</div>
        </div>
        <div className="cover-footer-col">
          <div className="cover-footer-label">Prepared for:</div>
          <div className="cover-footer-name">[{settings.preparedForName}]</div>
          <div className="cover-footer-detail">{settings.preparedForTitle}</div>
          <div className="cover-footer-detail">{settings.preparedForContact}</div>
        </div>
      </div>
    </div>
  );
};

const fmt = (n: number) => `ETB ${n.toLocaleString()}`;

// --- Generic PFS Template ---
const PfsTemplate = ({ 
  settings, 
  title, 
  leftTitle, 
  leftRows, 
  leftTotalLabel, 
  leftTotal, 
  rightTitle, 
  rightRows, 
  rightTotalLabel, 
  rightTotal 
}: any) => {
  const maxRows = Math.max(leftRows.length, rightRows.length);
  const normalizedLeftRows = [...leftRows];
  const normalizedRightRows = [...rightRows];

  // Pad the shorter array with empty objects so the grid aligns perfectly
  while (normalizedLeftRows.length < maxRows) normalizedLeftRows.push({ label: '', value: '' });
  while (normalizedRightRows.length < maxRows) normalizedRightRows.push({ label: '', value: '' });

  return (
    <div className="report-page pfs-page">
      <div className="pfs-header">
        <h1>{title.toUpperCase()}</h1>
      </div>

      <div className="pfs-meta">
        <div><span>Submitted To:</span> <strong>{settings.preparedForName}</strong></div>
        <div><span>Date:</span> <strong>{new Date().toLocaleDateString()}</strong></div>
      </div>

      <div className="pfs-info-grid">
        <div className="pfs-info-col">
          <div className="pfs-info-header">Company Details</div>
          <div className="pfs-info-row"><span>Name :</span> <span>{settings.companyName}</span></div>
          <div className="pfs-info-row"><span>Address :</span> <span>{settings.companyAddress}</span></div>
          <div className="pfs-info-row"><span>Contact No :</span> <span>{settings.companyContact}</span></div>
          <div className="pfs-info-row"><span>Email :</span> <span>{settings.companyEmail}</span></div>
          <div className="pfs-info-row"><span>Period :</span> <span>{settings.year}</span></div>
          <div className="pfs-info-row"><span>Type :</span> <span>Business Profile</span></div>
        </div>
        <div className="pfs-info-col">
          <div className="pfs-info-header">Prepared By</div>
          <div className="pfs-info-row"><span>Name :</span> <span>{settings.preparedByName}</span></div>
          <div className="pfs-info-row"><span>Title :</span> <span>{settings.preparedByTitle}</span></div>
          <div className="pfs-info-row"><span>Contact No :</span> <span>{settings.preparedByContact}</span></div>
          <div className="pfs-info-row"><span>Client/For :</span> <span>{settings.preparedForName}</span></div>
          <div className="pfs-info-row"><span>Date Generated :</span> <span>{new Date().toLocaleDateString()}</span></div>
          <div className="pfs-info-row"><span>Signature :</span> <span className="border-b border-black w-24 inline-block"></span></div>
        </div>
      </div>

      <div className="pfs-data-table">
        <div className="pfs-data-header">
          <div className="pfs-col-header"><span>{leftTitle}</span> <span className="pfs-amount-col">Amount</span></div>
          <div className="pfs-col-header"><span>{rightTitle}</span> <span className="pfs-amount-col">Amount</span></div>
        </div>
        
        {Array.from({ length: maxRows }).map((_, i) => (
          <div className="pfs-data-row" key={i}>
            <div className="pfs-cell-group">
              <div className="pfs-cell-label">{normalizedLeftRows[i].label}</div>
              <div className="pfs-cell-value">{normalizedLeftRows[i].value}</div>
            </div>
            <div className="pfs-cell-group">
              <div className="pfs-cell-label">{normalizedRightRows[i].label}</div>
              <div className="pfs-cell-value">{normalizedRightRows[i].value}</div>
            </div>
          </div>
        ))}

        <div className="pfs-data-footer">
          <div className="pfs-footer-group">
            <span className="pfs-footer-label">{leftTotalLabel}</span>
            <span className="pfs-footer-value">{leftTotal}</span>
          </div>
          <div className="pfs-footer-group">
            <span className="pfs-footer-label">{rightTotalLabel}</span>
            <span className="pfs-footer-value">{rightTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Report Data Mappers ---

const getProfitLossData = (settings: PrintSettings) => {
  const leftRows = monthlyProfitLoss.map(m => ({ label: `${m.month} Revenue`, value: fmt(m.revenue) }));
  const rightRows = expensesByCategory.map(e => ({ label: e.name, value: fmt(e.amount) }));
  
  return (
    <PfsTemplate 
      settings={settings}
      title="PROFIT & LOSS STATEMENT"
      leftTitle="Revenue Breakdown"
      leftRows={leftRows}
      leftTotalLabel="Total Revenue"
      leftTotal={fmt(profitLossData.revenue)}
      rightTitle="Operating Expenses"
      rightRows={rightRows}
      rightTotalLabel="Total Expenses"
      rightTotal={fmt(profitLossData.expenses)}
    />
  );
};

const getDebtData = (settings: PrintSettings) => {
  const leftRows = debtAgingData.map(d => ({ label: `Receivables: ${d.category}`, value: fmt(d.amount) }));
  const rightRows = topDebtors.map(d => ({ label: `${d.name} (${d.daysOverdue} days)`, value: fmt(d.amount) }));
  
  return (
    <PfsTemplate 
      settings={settings}
      title="DEBT & RECEIVABLES STATEMENT"
      leftTitle="Aging Schedule"
      leftRows={leftRows}
      leftTotalLabel="Total Receivables"
      leftTotal={fmt(debtCollectionSummary.totalReceivables)}
      rightTitle="Top Outstanding Debtors"
      rightRows={rightRows}
      rightTotalLabel="Net Position"
      rightTotal={fmt(debtCollectionSummary.netPosition)}
    />
  );
};

const getTaxData = (settings: PrintSettings) => {
  const leftRows = [
    { label: 'Gross Sales / Revenue', value: fmt(taxSummary.totalSales) },
    { label: 'Less: Exemptions', value: fmt(taxSummary.totalSales - taxSummary.taxableAmount) },
    { label: 'Net Taxable Amount', value: fmt(taxSummary.taxableAmount) }
  ];
  const rightRows = taxBreakdown.map(t => ({ label: t.category, value: fmt(t.amount) }));
  
  return (
    <PfsTemplate 
      settings={settings}
      title="TAX & LIABILITY STATEMENT"
      leftTitle="Income Assessment"
      leftRows={leftRows}
      leftTotalLabel="Total Taxable"
      leftTotal={fmt(taxSummary.taxableAmount)}
      rightTitle="Tax Obligations"
      rightRows={rightRows}
      rightTotalLabel="Total Tax Liability"
      rightTotal={fmt(taxSummary.totalTaxLiability)}
    />
  );
};

const getExpenseData = (settings: PrintSettings) => {
  const leftRows = expensesByCategory.map(e => ({ label: e.name, value: fmt(e.amount) }));
  const rightRows = topExpenseVendors.map(v => ({ label: `${v.name} (${v.category})`, value: fmt(v.amount) }));
  const totalExpenses = expensesByCategory.reduce((sum, e) => sum + e.amount, 0);

  return (
    <PfsTemplate 
      settings={settings}
      title="OPERATING EXPENSE STATEMENT"
      leftTitle="Expenses by Category"
      leftRows={leftRows}
      leftTotalLabel="Total Categorized"
      leftTotal={fmt(totalExpenses)}
      rightTitle="Top Vendors/Suppliers"
      rightRows={rightRows}
      rightTotalLabel="Total Vendor Spend"
      rightTotal={fmt(topExpenseVendors.reduce((sum, v) => sum + v.amount, 0))}
    />
  );
};

const getCashFlowData = (settings: PrintSettings) => {
  const leftRows = cashFlowData.map(c => ({ label: `${c.day} Cash Inflow`, value: fmt(c.cashIn) }));
  const rightRows = cashFlowData.map(c => ({ label: `${c.day} Cash Outflow`, value: fmt(c.cashOut) }));

  return (
    <PfsTemplate 
      settings={settings}
      title="CASH FLOW STATEMENT"
      leftTitle="Cash Inflows"
      leftRows={leftRows}
      leftTotalLabel="Total Cash In"
      leftTotal={fmt(cashFlowSummary.totalCashIn)}
      rightTitle="Cash Outflows"
      rightRows={rightRows}
      rightTotalLabel="Total Cash Out"
      rightTotal={fmt(cashFlowSummary.totalCashOut)}
    />
  );
};

// --- Main Printable Report ---
export default function PrintableFormalReport({ settings, selectedReport }: Props) {
  const reportPage = () => {
    switch (selectedReport) {
      case 'profit-loss': return getProfitLossData(settings);
      case 'debt': return getDebtData(settings);
      case 'tax': return getTaxData(settings);
      case 'expense': return getExpenseData(settings);
      case 'cashflow': return getCashFlowData(settings);
      default: return getProfitLossData(settings);
    }
  };

  return (
    <div id="formal-report-print" className="formal-report-container">
      <CoverPage settings={settings} />
      {reportPage()}
    </div>
  );
}
