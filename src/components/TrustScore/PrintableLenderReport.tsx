import React from 'react';
import { PrintSettings } from '../Reports/PrintSettingsModal';
import {
  mockScoreHistory, mockFactors, mockBadges, mockRevenueData,
  getRating, getRatingColor, fmt, fmtDate, TODAY
} from './mockData';

interface Props {
  settings: PrintSettings;
}

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
            BUSINESS TRUST SCORE REPORT
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

// Page 2: Trust Score Certificate with company details
const TrustScoreCertificatePage = ({ settings }: { settings: PrintSettings }) => {
  const currentScore = mockScoreHistory[mockScoreHistory.length - 1].score;
  const rating = getRating(currentScore);
  const color = getRatingColor(rating);
  const verifiedCount = mockBadges.filter(b => b.verified).length;
  const totalRevenue = mockRevenueData.reduce((s, m) => s + m.revenue, 0);
  const avgRevenue = totalRevenue / mockRevenueData.length;
  const totalTransactions = mockRevenueData.reduce((s, m) => s + m.transactions, 0);
  const revenueGrowth = ((mockRevenueData[mockRevenueData.length - 1].revenue - mockRevenueData[0].revenue) / mockRevenueData[0].revenue) * 100;

  return (
    <div className="report-page pfs-page">
      <div className="pfs-header">
        <h1>TRUST SCORE CERTIFICATE</h1>
      </div>

      <div className="pfs-meta">
        <div><span>Submitted To:</span> <strong>{settings.preparedForName}</strong></div>
        <div><span>Date:</span> <strong>{new Date().toLocaleDateString()}</strong></div>
      </div>

      <div className="pfs-info-grid">
        <div className="pfs-info-col">
          <div className="pfs-info-header">Business Information</div>
          <div className="pfs-info-row"><span>Name :</span> <span>{settings.companyName}</span></div>
          <div className="pfs-info-row"><span>Address :</span> <span>{settings.companyAddress}</span></div>
          <div className="pfs-info-row"><span>Contact No :</span> <span>{settings.companyContact}</span></div>
          <div className="pfs-info-row"><span>Email :</span> <span>{settings.companyEmail}</span></div>
          <div className="pfs-info-row"><span>Registration :</span> <span>Active since Jan 2025</span></div>
          <div className="pfs-info-row"><span>Report Date :</span> <span>{fmtDate(TODAY)}</span></div>
        </div>
        <div className="pfs-info-col">
          <div className="pfs-info-header">Score Summary</div>
          <div className="pfs-info-row"><span>Trust Score :</span> <span style={{ color, fontWeight: 700 }}>{currentScore} / 100</span></div>
          <div className="pfs-info-row"><span>Rating :</span> <span style={{ color }}>{rating}</span></div>
          <div className="pfs-info-row"><span>Verifications :</span> <span>{verifiedCount} of {mockBadges.length} verified</span></div>
          <div className="pfs-info-row"><span>6-Mo Avg Revenue :</span> <span>{fmt(Math.round(avgRevenue))}</span></div>
          <div className="pfs-info-row"><span>Total Transactions :</span> <span>{totalTransactions.toLocaleString()}</span></div>
          <div className="pfs-info-row"><span>Revenue Growth :</span> <span>{revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}%</span></div>
        </div>
      </div>

      <div className="pfs-data-table">
        <div className="pfs-data-header">
          <div className="pfs-col-header"><span>Score Component</span> <span className="pfs-amount-col">Score</span></div>
          <div className="pfs-col-header"><span>Verified Account</span> <span className="pfs-amount-col">Status</span></div>
        </div>

        {Array.from({ length: Math.max(mockFactors.length, mockBadges.length) }).map((_, i) => {
          const factor = mockFactors[i];
          const badge = mockBadges[i];
          return (
            <div className="pfs-data-row" key={i}>
              <div className="pfs-cell-group">
                <div className="pfs-cell-label">{factor ? `${factor.nameKey.replace(/([A-Z])/g, ' ETB 1').replace(/^./, s => s.toUpperCase())} (${factor.weight}%)` : ''}</div>
                <div className="pfs-cell-value">{factor ? `${factor.score}/100` : ''}</div>
              </div>
              <div className="pfs-cell-group">
                <div className="pfs-cell-label">{badge ? badge.nameKey.replace(/([A-Z])/g, ' ETB 1').replace(/^./, s => s.toUpperCase()) : ''}</div>
                <div className="pfs-cell-value" style={{ color: badge ? (badge.verified ? '#16a34a' : '#9ca3af') : undefined }}>
                  {badge ? (badge.verified ? '✓ Verified' : 'Pending') : ''}
                </div>
              </div>
            </div>
          );
        })}

        <div className="pfs-data-footer">
          <div className="pfs-footer-group">
            <span className="pfs-footer-label">Overall Trust Score</span>
            <span className="pfs-footer-value" style={{ color }}>{currentScore}/100</span>
          </div>
          <div className="pfs-footer-group">
            <span className="pfs-footer-label">Verified Total</span>
            <span className="pfs-footer-value">{verifiedCount}/{mockBadges.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Page 3: Revenue Consistency table
const RevenueConsistencyPage = ({ settings }: { settings: PrintSettings }) => {
  const totalRevenue = mockRevenueData.reduce((s, m) => s + m.revenue, 0);
  const totalTransactions = mockRevenueData.reduce((s, m) => s + m.transactions, 0);

  const leftRows = mockRevenueData.map(m => ({
    label: m.month,
    value: fmt(m.revenue),
  }));

  const rightRows = mockRevenueData.map(m => ({
    label: m.month,
    value: `${m.transactions} txns`,
  }));

  const maxRows = Math.max(leftRows.length, rightRows.length);

  return (
    <div className="report-page pfs-page">
      <div className="pfs-header">
        <h1>6-MONTH REVENUE CONSISTENCY</h1>
      </div>

      <div className="pfs-data-table" style={{ margin: '6mm 15mm 0' }}>
        <div className="pfs-data-header">
          <div className="pfs-col-header"><span>Monthly Revenue</span> <span className="pfs-amount-col">Amount</span></div>
          <div className="pfs-col-header"><span>Transaction Volume</span> <span className="pfs-amount-col">Count</span></div>
        </div>

        {Array.from({ length: maxRows }).map((_, i) => (
          <div className="pfs-data-row" key={i}>
            <div className="pfs-cell-group">
              <div className="pfs-cell-label">{leftRows[i]?.label || ''}</div>
              <div className="pfs-cell-value">{leftRows[i]?.value || ''}</div>
            </div>
            <div className="pfs-cell-group">
              <div className="pfs-cell-label">{rightRows[i]?.label || ''}</div>
              <div className="pfs-cell-value">{rightRows[i]?.value || ''}</div>
            </div>
          </div>
        ))}

        <div className="pfs-data-footer">
          <div className="pfs-footer-group">
            <span className="pfs-footer-label">Total Revenue</span>
            <span className="pfs-footer-value">{fmt(totalRevenue)}</span>
          </div>
          <div className="pfs-footer-group">
            <span className="pfs-footer-label">Total Transactions</span>
            <span className="pfs-footer-value">{totalTransactions.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Consent Declaration */}
      <div style={{ margin: '10mm 15mm 0', padding: '5mm', border: '1px solid #d1d5db', fontSize: '8.5pt', lineHeight: 1.6, color: '#374151' }}>
        <div style={{ fontWeight: 700, marginBottom: '3mm', color: '#1e40af', fontSize: '9pt' }}>Merchant Consent Declaration</div>
        <p style={{ margin: 0 }}>
          I, the authorized representative of <strong>{settings.companyName}</strong>, consent to sharing the information
          contained in this report with financial institutions for the purpose of credit assessment and loan evaluation.
          This report is valid for 30 days from the date of generation and contains information verified as of {fmtDate(TODAY)}.
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6mm', paddingTop: '3mm', borderTop: '1px solid #e5e7eb' }}>
          <div>
            <div style={{ fontSize: '8pt', color: '#6b7280' }}>Authorized by</div>
            <div style={{ fontWeight: 600 }}>{settings.preparedByName}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '8pt', color: '#6b7280' }}>Date</div>
            <div style={{ fontWeight: 600 }}>{fmtDate(TODAY)}</div>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div style={{ margin: '6mm 15mm 0', padding: '4mm', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '2mm', fontSize: '7.5pt', color: '#1e40af', lineHeight: 1.5 }}>
        <strong>Note for Lenders:</strong> This Trust Score is a predictive creditworthiness metric based on verified business
        transaction data, payment history, and account verifications. It is not a guarantee of creditworthiness or loan approval.
        Lenders should conduct their own due diligence. Valid for 30 days from generation date.
      </div>
    </div>
  );
};

export default function PrintableLenderReport({ settings }: Props) {
  return (
    <div id="lender-report-print" className="formal-report-container">
      <CoverPage settings={settings} />
      <TrustScoreCertificatePage settings={settings} />
      <RevenueConsistencyPage settings={settings} />
    </div>
  );
}
