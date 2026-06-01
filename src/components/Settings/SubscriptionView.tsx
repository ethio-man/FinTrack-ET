import React, { useState } from 'react';
import { CreditCard, TrendingUp, Download } from 'lucide-react';
import { PlanTier, BillingRecord, PLANS, fmt, fmtDate } from './mockData';
import { UpgradePlanModal } from './Modals';

export function SubscriptionView({ currentPlan: initialPlan, billingHistory, t }: { currentPlan: PlanTier; billingHistory: BillingRecord[]; t: any }) {
  const [currentPlan, setCurrentPlan] = useState(initialPlan);
  const [modal, setModal] = useState<'upgrade' | null>(null);

  const planData = PLANS[currentPlan];

  return (
    <div className="space-y-6">
      {modal === 'upgrade' && <UpgradePlanModal currentPlan={currentPlan} onClose={() => setModal(null)} onUpgrade={plan => { setCurrentPlan(plan); setModal(null); }} t={t} />}

      {/* Current Plan */}
      <div className="bg-gradient-to-br from-[#0077C5] to-[#005a96] rounded-2xl p-6 text-white shadow-md">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-blue-100 text-sm font-semibold mb-1 uppercase tracking-wider">{t.currentPlan}</p>
            <h2 className="text-3xl font-black">{planData.name}</h2>
            <p className="text-blue-100 text-sm mt-2 font-medium">
              {currentPlan === 'free' ? 'Free forever' : `${fmt(planData.price)} ${t.perMonth}`}
            </p>
          </div>
          <div className="px-3 py-1.5 bg-white/20 rounded-full text-xs font-bold text-white tracking-wider">{t.active}</div>
        </div>
        <div className="flex gap-3">
          {currentPlan !== 'premium' && (
            <button onClick={() => setModal('upgrade')} className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#0077C5] rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors shadow-sm">
              <TrendingUp className="w-4 h-4" /> {t.upgradePlan}
            </button>
          )}
          {currentPlan !== 'free' && (
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-colors border border-white/20">
              {t.cancelPlan}
            </button>
          )}
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="bg-[var(--bg-panel)] rounded-xl p-6 shadow-sm border border-[var(--border-core)]">
        <h3 className="text-base font-bold text-[var(--text-core)] mb-4">{t.comparePlans}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-core)]">
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-mute)] uppercase tracking-wider">{t.feature}</th>
                {(['free', 'basic', 'professional', 'premium'] as PlanTier[]).map(plan => (
                  <th key={plan} className="text-center py-3 px-4">
                    <div className="text-sm font-bold text-[var(--text-core)]">{PLANS[plan].name}</div>
                    <div className="text-xs font-medium text-[var(--text-sec)] mt-0.5">{plan === 'free' ? 'Free' : fmt(PLANS[plan].price)}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Monthly Transactions', free: '50', basic: '500', pro: 'Unlimited', premium: 'Unlimited' },
                { label: 'Users', free: '1', basic: '3', pro: '10', premium: 'Unlimited' },
                { label: 'Branches', free: '—', basic: '—', pro: 'Multi', premium: 'Multi' },
                { label: 'Reports', free: 'Basic', basic: 'Advanced', pro: 'Custom', premium: 'Advanced' },
                { label: 'Support', free: 'Email', basic: 'Email', pro: 'Phone + Email', premium: '24/7 Dedicated' },
                { label: 'API Access', free: '—', basic: '—', pro: '✓', premium: '✓' },
              ].map(({ label, free, basic, pro, premium }) => (
                <tr key={label} className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-panel-inner)] transition-colors">
                  <td className="py-3 px-4 text-[var(--text-sec)] font-medium">{label}</td>
                  <td className="text-center py-3 px-4 text-[var(--text-sec)]">{free}</td>
                  <td className="text-center py-3 px-4 text-[var(--text-sec)]">{basic}</td>
                  <td className="text-center py-3 px-4 text-[var(--text-sec)]">{pro}</td>
                  <td className="text-center py-3 px-4 text-[var(--text-sec)]">{premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-[var(--bg-panel)] rounded-xl p-6 shadow-sm border border-[var(--border-core)]">
        <h3 className="text-base font-bold text-[var(--text-core)] mb-4">{t.billingHistory}</h3>
        {billingHistory.length === 0 ? (
          <p className="text-sm text-[var(--text-mute)] text-center py-8">{t.noBillingRecords}</p>
        ) : (
          <div className="space-y-3">
            {billingHistory.map(bill => (
              <div key={bill.id} className="flex items-center justify-between p-4 bg-[var(--bg-panel-inner)] border border-[var(--border-core)] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#0077C5]/10 rounded-lg">
                    <CreditCard className="w-4 h-4 text-[#0077C5]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-core)]">{bill.plan} Plan</p>
                    <p className="text-xs text-[var(--text-sec)] font-medium">{fmtDate(bill.date)} · {t.receipt} {bill.receipt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[var(--text-core)]">{fmt(bill.amount)}</span>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    bill.status === 'paid' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                    bill.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {bill.status}
                  </span>
                  <button className="p-1.5 hover:bg-[var(--border-core)] rounded-lg transition-colors">
                    <Download className="w-4 h-4 text-[var(--text-mute)] hover:text-[#0077C5]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
