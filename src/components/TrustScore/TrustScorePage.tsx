import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, PolarAngleAxis,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Shield, CheckCircle,
  Award, FileText, Lock, DollarSign,
  Activity, ArrowLeft, ChevronRight, Lightbulb, Star,
  Printer, Copy, Check, X, Download,
} from 'lucide-react';

import { LanguageOpt } from '../../types';
import { trustTranslations } from './translations';
import {
  mockScoreHistory, mockFactors, mockBadges, mockRevenueData,
  improvementTips, getRating, getRatingColor, fmt, fmtDate, TODAY,
} from './mockData';
import { PrintSettings, DEFAULT_PRINT_SETTINGS } from '../Reports/PrintSettingsModal';
import PrintSettingsModal from '../Reports/PrintSettingsModal';
import PrintableLenderReport from './PrintableLenderReport';

interface TrustScorePageProps {
  selectedLanguage: LanguageOpt;
}

// ─── Score Gauge ──────────────────────────────────────────────────────────────

function ScoreGauge({ score }: { score: number }) {
  const rating = getRating(score);
  const color = getRatingColor(rating);
  const data = [{ value: score, fill: color }];

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={180}>
        <RadialBarChart
          cx="50%" cy="50%"
          innerRadius={80} outerRadius={110}
          barSize={20}
          data={data}
          startAngle={180} endAngle={0}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background={{ fill: 'var(--bg-panel-inner, #f3f4f6)' }}
            dataKey="value"
            cornerRadius={10}
            fill={color}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ top: '20%' }}>
        <span className="text-5xl font-black" style={{ color }}>{score}</span>
        <span className="text-xs text-[var(--text-mute)] mt-1">/ 100</span>
        <span className="text-sm font-semibold mt-2 px-3 py-1 rounded-full" style={{ background: color + '20', color }}>
          {rating}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-[var(--text-mute)] px-2">
        <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
      </div>
    </div>
  );
}

// ─── Consent Modal ────────────────────────────────────────────────────────────

function ConsentModal({ onClose, onConfirm, t }: { onClose: () => void; onConfirm: () => void; t: any }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-[var(--bg-panel)] rounded-2xl shadow-2xl w-full max-w-md border border-[var(--border-core)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-core)]">
          <h3 className="text-base font-bold text-[var(--text-core)]">{t.generateLenderReport}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-[var(--bg-panel-inner)] rounded-lg transition-colors">
            <X className="w-4 h-4 text-[var(--text-sec)]" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="bg-[var(--bg-panel-inner)] border border-[var(--border-core)] rounded-xl p-4 flex gap-3">
            <Shield className="w-5 h-5 text-[#0077C5] shrink-0 mt-0.5" />
            <div className="text-sm text-[var(--text-core)]">
              <p className="mb-2 font-medium">{t.reportIncludes}</p>
              <ul className="list-disc list-inside space-y-1 text-xs text-[var(--text-sec)]">
                <li>{t.includeScore}</li>
                <li>{t.includeHistory}</li>
                <li>{t.includeRevenue}</li>
                <li>{t.includeVerification}</li>
              </ul>
            </div>
          </div>

          <div className="bg-[var(--bg-panel-inner)] rounded-xl p-4">
            <h4 className="text-sm font-semibold text-[var(--text-core)] mb-2">{t.consentDeclaration}</h4>
            <p className="text-xs text-[var(--text-sec)] leading-relaxed mb-3">
              {t.consentText}
            </p>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 rounded"
              />
              <span className="text-xs text-[var(--text-sec)]">{t.agreeText}</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { onConfirm(); onClose(); }}
              disabled={!agreed}
              className="flex-1 py-2.5 bg-[#0077C5] text-white rounded-xl text-sm font-bold hover:bg-[#005a96] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.generateReportBtn}
            </button>
            <button onClick={onClose} className="flex-1 py-2.5 border border-[var(--border-core)] text-[var(--text-core)] rounded-xl text-sm font-medium hover:bg-[var(--bg-panel-inner)] transition-colors">
              {t.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Trust Score Overview ─────────────────────────────────────────────────────

function TrustScoreView({ onViewReport, t }: { onViewReport: () => void; t: any }) {
  const currentScore = mockScoreHistory[mockScoreHistory.length - 1].score;
  const prevScore = mockScoreHistory[mockScoreHistory.length - 2].score;
  const change = currentScore - prevScore;
  const rating = getRating(currentScore);
  const color = getRatingColor(rating);

  const verifiedCount = mockBadges.filter(b => b.verified).length;
  const potentialBoost = mockBadges.filter(b => !b.verified).reduce((s, b) => s + b.boost, 0);

  const [consentOpen, setConsentOpen] = useState(false);

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {consentOpen && <ConsentModal onClose={() => setConsentOpen(false)} onConfirm={onViewReport} t={t} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-core)] mb-1">{t.pageTitle}</h1>
          <p className="text-[var(--text-sec)] text-sm">{t.pageSubtitle}</p>
        </div>
        <button
          onClick={() => setConsentOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0077C5] text-white rounded-lg text-sm font-bold hover:bg-[#005a96] transition-colors"
        >
          <FileText className="w-4 h-4" /> {t.generateReport}
        </button>
      </div>

      {/* Hero: Score + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-[var(--bg-panel)] rounded-2xl p-6 shadow-sm border border-[var(--border-core)]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-[var(--text-core)]">{t.yourTrustScore}</h3>
            <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold ${change >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
              {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {change >= 0 ? '+' : ''}{change} {t.thisMonth}
            </div>
          </div>
          <ScoreGauge score={currentScore} />
          <p className="text-xs text-center text-[var(--text-mute)] mt-4">{t.updated} {fmtDate(TODAY)}</p>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {[
            { label: t.scoreRating, value: rating, sub: t.topMerchants.replace('{pct}', currentScore >= 85 ? '10' : currentScore >= 75 ? '20' : '40'), icon: Star, color: color, bg: color + '15' },
            { label: t.potentialBoost, value: `+${potentialBoost}`, sub: t.completeVerifications.replace('{n}', String(mockBadges.length - verifiedCount)), icon: TrendingUp, color: '#6366f1', bg: '#6366f115' },
            { label: t.verifications, value: `${verifiedCount}/${mockBadges.length}`, sub: t.accountsVerified, icon: Shield, color: '#10b981', bg: '#10b98115' },
            { label: t.monthlyTrend, value: change >= 0 ? `+${change}` : String(change), sub: t.pointsThisMonth, icon: Activity, color: change >= 0 ? '#10b981' : '#ef4444', bg: change >= 0 ? '#10b98115' : '#ef444415' },
          ].map(({ label, value, sub, icon: Icon, color: c, bg }) => (
            <div key={label} className="bg-[var(--bg-panel)] rounded-xl p-5 shadow-sm border border-[var(--border-core)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-lg" style={{ background: bg }}>
                  <Icon className="w-5 h-5" style={{ color: c }} />
                </div>
                <span className="text-xs text-[var(--text-mute)] font-medium">{label}</span>
              </div>
              <p className="text-2xl font-black" style={{ color: c }}>{value}</p>
              <p className="text-xs text-[var(--text-mute)] mt-1">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Score History */}
      <div className="bg-[var(--bg-panel)] rounded-xl p-6 shadow-sm border border-[var(--border-core)] mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-core)]">{t.scoreHistory}</h3>
            <p className="text-xs text-[var(--text-mute)] mt-0.5">{t.monthlyTrustTrend}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-mute)]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded" style={{ background: color }} />
              {t.trustScore}
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={mockScoreHistory} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="trustScoreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle, #f3f4f6)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-mute, #9ca3af)' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-mute, #9ca3af)' }} axisLine={false} tickLine={false} width={30} />
            <RTooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border-core, #e5e7eb)', fontSize: 12, background: 'var(--bg-panel, #fff)' }}
              formatter={(v: number) => [v, 'Score']} />
            <Line type="monotone" dataKey="score" stroke={color} strokeWidth={3}
              dot={{ fill: color, r: 5, strokeWidth: 0 }} activeDot={{ r: 7 }} fill="url(#trustScoreGrad)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Two columns: Factors + Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Score Breakdown */}
        <div className="bg-[var(--bg-panel)] rounded-xl p-6 shadow-sm border border-[var(--border-core)]">
          <h3 className="text-sm font-semibold text-[var(--text-core)] mb-1">{t.scoreBreakdown}</h3>
          <p className="text-xs text-[var(--text-mute)] mb-4">{t.weightedFactors}</p>
          <div className="space-y-4">
            {mockFactors.map(f => {
              const statusColor = f.status === 'excellent' ? '#10b981' : f.status === 'good' ? '#22c55e' : '#f59e0b';
              return (
                <div key={f.nameKey}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[var(--text-core)]">{(t as any)[f.nameKey]}</span>
                      <span className="text-xs text-[var(--text-mute)]">({f.weight}%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{ color: statusColor }}>{f.score}</span>
                      <div className="w-2 h-2 rounded-full" style={{ background: statusColor }} />
                    </div>
                  </div>
                  <div className="h-2 bg-[var(--bg-panel-inner)] rounded-full overflow-hidden mb-1">
                    <div className="h-full rounded-full transition-all" style={{ width: `${f.score}%`, background: statusColor }} />
                  </div>
                  <p className="text-xs text-[var(--text-mute)]">{(t as any)[f.impactKey]}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verification Badges */}
        <div className="bg-[var(--bg-panel)] rounded-xl p-6 shadow-sm border border-[var(--border-core)]">
          <h3 className="text-sm font-semibold text-[var(--text-core)] mb-1">{t.verificationBadges}</h3>
          <p className="text-xs text-[var(--text-mute)] mb-4">{t.connectAccounts}</p>
          <div className="space-y-3">
            {mockBadges.map(badge => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.id}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all ${
                    badge.verified
                      ? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                      : 'border-[var(--border-core)] bg-[var(--bg-panel-inner)] hover:border-[#0077C5]/30'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${badge.verified ? 'bg-green-100 dark:bg-green-800/30' : 'bg-[var(--bg-panel)]'}`}>
                    <Icon className={`w-5 h-5 ${badge.verified ? 'text-green-600' : 'text-[var(--text-mute)]'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-[var(--text-core)]">{(t as any)[badge.nameKey]}</span>
                      {badge.verified && <CheckCircle className="w-3.5 h-3.5 text-green-600" />}
                    </div>
                    <p className="text-xs text-[var(--text-mute)]">{(t as any)[badge.descKey]}</p>
                  </div>
                  <div className="text-right">
                    {badge.verified ? (
                      <span className="text-xs font-bold text-green-600">+{badge.boost}</span>
                    ) : (
                      <button className="text-xs font-semibold text-[#0077C5] hover:text-[#005a96] transition-colors">
                        {t.verify}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Improvement Tips */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl p-6 border border-blue-100 dark:border-blue-800/30">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-[#0077C5]" />
          <h3 className="text-sm font-bold text-[var(--text-core)]">{t.improvementTitle}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {improvementTips.map(tip => {
            const Icon = tip.icon;
            const priorityBg = tip.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-blue-100 dark:bg-blue-900/30';
            const priorityColor = tip.priority === 'high' ? 'text-orange-600' : 'text-blue-600';
            return (
              <div key={tip.titleKey} className="bg-[var(--bg-panel)] rounded-xl p-4 shadow-sm border border-[var(--border-core)]">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-[#0077C5]/10 rounded-lg shrink-0">
                    <Icon className="w-4 h-4 text-[#0077C5]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-[var(--text-core)]">{(t as any)[tip.titleKey]}</h4>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${priorityBg} ${priorityColor}`}>
                        +{tip.boost}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-sec)] mb-3">{(t as any)[tip.descKey]}</p>
                    <button className="flex items-center gap-1 text-xs font-semibold text-[#0077C5] hover:text-[#005a96] transition-colors">
                      {(t as any)[tip.actionKey]} <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Lender Report View (on-screen preview) ─────────────────────────────────

function LenderReportView({ onBack, t }: { onBack: () => void; t: any }) {
  const currentScore = mockScoreHistory[mockScoreHistory.length - 1].score;
  const rating = getRating(currentScore);
  const color = getRatingColor(rating);
  const verifiedCount = mockBadges.filter(b => b.verified).length;

  const totalRevenue = mockRevenueData.reduce((s, m) => s + m.revenue, 0);
  const avgRevenue = totalRevenue / mockRevenueData.length;
  const totalTransactions = mockRevenueData.reduce((s, m) => s + m.transactions, 0);
  const revenueGrowth = ((mockRevenueData[mockRevenueData.length - 1].revenue - mockRevenueData[0].revenue) / mockRevenueData[0].revenue) * 100;

  const [copied, setCopied] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [printSettings, setPrintSettings] = useState<PrintSettings>({
    ...DEFAULT_PRINT_SETTINGS,
    reportTitle: 'Business Trust Score Report',
  });

  function handleCopy() {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handlePrint() {
    setPrintModalOpen(false);
    setTimeout(() => {
      window.print();
    }, 300);
  }

  return (
    <div className="min-h-screen">
      <PrintSettingsModal
        open={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        settings={printSettings}
        onChange={setPrintSettings}
        onPrint={handlePrint}
      />
      <PrintableLenderReport settings={printSettings} />

      {/* Action bar */}
      <div className="sticky top-0 z-30 bg-[var(--bg-panel)] border-b border-[var(--border-core)] flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-3 shadow-sm gap-3">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[var(--text-sec)] hover:text-[var(--text-core)] transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> {t.backToTrustScore}
        </button>
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 border border-[var(--border-core)] rounded-lg text-sm text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors font-medium">
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            {copied ? t.copied : t.copyLink}
          </button>
          <button
            onClick={() => setPrintModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0077C5] text-white rounded-lg text-sm font-bold hover:bg-[#005a96] transition-colors"
          >
            <Printer className="w-4 h-4" /> {t.printReport}
          </button>
        </div>
      </div>

      {/* Report Document */}
      <div className="p-4 sm:p-8 max-w-4xl mx-auto">
        <div className="bg-[var(--bg-panel)] rounded-2xl shadow-xl border border-[var(--border-core)] overflow-hidden">
          {/* Header band */}
          <div className="px-8 py-6 text-white" style={{ background: 'linear-gradient(135deg, #0077C5, #005a96)' }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-6 h-6" />
                  <h1 className="text-2xl font-black">{t.businessTrustScoreReport}</h1>
                </div>
                <p className="text-blue-100 text-sm">{t.lenderReadyAssessment}</p>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-xs mb-1">{t.reportId}</p>
                <p className="text-white text-sm font-mono">TR-{Date.now().toString().slice(-8)}</p>
                <p className="text-blue-100 text-xs mt-2">{t.generated}: {fmtDate(TODAY)}</p>
              </div>
            </div>
          </div>

          {/* Business Info */}
          <div className="px-8 py-6 border-b border-[var(--border-core)]">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-[var(--text-mute)] mb-1">{t.businessName}</p>
                <p className="text-sm font-semibold text-[var(--text-core)]">Sheger Traders</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-mute)] mb-1">{t.businessOwner}</p>
                <p className="text-sm font-semibold text-[var(--text-core)]">Alemayehu Tadesse (Admin)</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-mute)] mb-1">{t.registration}</p>
                <p className="text-sm font-semibold text-[var(--text-core)]">{t.activeSince}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-mute)] mb-1">{t.verificationStatus}</p>
                <p className="text-sm font-semibold text-green-600">{verifiedCount} {t.ofVerified.replace('{total}', String(mockBadges.length))}</p>
              </div>
            </div>
          </div>

          {/* Trust Score Certificate */}
          <div className="px-8 py-8 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-800/30 dark:to-blue-900/10">
            <div className="text-center mb-6">
              <p className="text-xs text-[var(--text-mute)] mb-2 uppercase tracking-wide font-bold">{t.verifiedTrustScore}</p>
              <div className="inline-flex items-baseline gap-2">
                <span className="text-6xl font-black" style={{ color }}>{currentScore}</span>
                <span className="text-2xl text-[var(--text-mute)] font-bold">/ 100</span>
              </div>
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: color + '20', color }}>
                <Award className="w-4 h-4" />
                <span className="text-sm font-bold">{rating} {t.ratingLabel}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
              {[
                { label: t.sixMonthAvgRevenue, value: fmt(Math.round(avgRevenue)) },
                { label: t.totalTransactions, value: totalTransactions.toLocaleString() },
                { label: t.revenueGrowth, value: `${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth.toFixed(1)}%` },
              ].map(({ label, value }) => (
                <div key={label} className="text-center bg-[var(--bg-panel)] rounded-xl p-3 shadow-sm border border-[var(--border-core)]">
                  <p className="text-xs text-[var(--text-mute)] mb-1">{label}</p>
                  <p className="text-sm font-bold text-[var(--text-core)]">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Consistency Chart */}
          <div className="px-8 py-6 border-t border-[var(--border-core)]">
            <h3 className="text-sm font-semibold text-[var(--text-core)] mb-1">{t.revenueConsistency}</h3>
            <p className="text-xs text-[var(--text-mute)] mb-4">{t.revenueConsistencyDesc}</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={mockRevenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="lenderBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0077C5" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#005a96" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle, #f3f4f6)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-mute, #9ca3af)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-mute, #9ca3af)' }} axisLine={false} tickLine={false} width={50}
                  tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
                <RTooltip
                  contentStyle={{ borderRadius: 10, border: '1px solid var(--border-core, #e5e7eb)', fontSize: 12, background: 'var(--bg-panel, #fff)' }}
                  formatter={(v: number, n: string) => [n === 'revenue' ? fmt(v) : v + ' txns', n === 'revenue' ? 'Revenue' : 'Transactions']}
                />
                <Bar dataKey="revenue" fill="url(#lenderBarGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-3 mt-3 text-xs text-[var(--text-mute)]">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ background: 'linear-gradient(180deg, #0077C5, #005a96)' }} />
                {t.monthlyRevenue}
              </div>
            </div>
          </div>

          {/* Score Factors Summary */}
          <div className="px-8 py-6 border-t border-[var(--border-core)]">
            <h3 className="text-sm font-semibold text-[var(--text-core)] mb-4">{t.scoreComponents}</h3>
            <div className="grid grid-cols-2 gap-4">
              {mockFactors.map(f => (
                <div key={f.nameKey} className="bg-[var(--bg-panel-inner)] rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[var(--text-core)] font-medium">{(t as any)[f.nameKey]}</span>
                    <span className="text-xs font-bold text-[#0077C5]">{f.score}/100</span>
                  </div>
                  <div className="h-1.5 bg-[var(--bg-panel)] rounded-full overflow-hidden">
                    <div className="h-full bg-[#0077C5] rounded-full" style={{ width: `${f.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verifications */}
          <div className="px-8 py-6 border-t border-[var(--border-core)]">
            <h3 className="text-sm font-semibold text-[var(--text-core)] mb-4">{t.verifiedAccounts}</h3>
            <div className="flex flex-wrap gap-3">
              {mockBadges.filter(b => b.verified).map(badge => {
                const Icon = badge.icon;
                return (
                  <div key={badge.id} className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                    <Icon className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium text-green-900 dark:text-green-300">{(t as any)[badge.nameKey]}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Consent Declaration */}
          <div className="px-8 py-6 bg-[var(--bg-panel-inner)] border-t border-[var(--border-core)]">
            <div className="flex gap-3">
              <Lock className="w-5 h-5 text-[var(--text-mute)] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-core)] mb-2">{t.merchantConsentDeclaration}</h3>
                <p className="text-xs text-[var(--text-sec)] leading-relaxed mb-3">{t.consentReportText}</p>
                <div className="flex items-center justify-between pt-3 border-t border-[var(--border-core)]">
                  <div>
                    <p className="text-xs text-[var(--text-mute)]">{t.authorizedBy}</p>
                    <p className="text-sm font-semibold text-[var(--text-core)] mt-0.5">Alemayehu Tadesse (Admin)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[var(--text-mute)]">{t.date}</p>
                    <p className="text-sm font-semibold text-[var(--text-core)] mt-0.5">{fmtDate(TODAY)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-900 text-gray-400 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>{t.financeTrackSystem}</span>
              </div>
              <span>{t.reportGeneratedOn} {fmtDate(TODAY)}</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
          <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
            <strong>{t.lenderNote}</strong> {t.lenderNoteText}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function TrustScorePage({ selectedLanguage }: TrustScorePageProps) {
  const [view, setView] = useState<'overview' | 'report'>('overview');
  const lang = selectedLanguage.code === 'am' ? 'am' : 'en';
  const t = trustTranslations[lang];

  return (
    <div className="min-h-screen">
      {view === 'overview' && <TrustScoreView onViewReport={() => setView('report')} t={t} />}
      {view === 'report' && <LenderReportView onBack={() => setView('overview')} t={t} />}
    </div>
  );
}
