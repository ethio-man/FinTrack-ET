import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Zap, CreditCard, Building2 } from 'lucide-react';
import { LanguageOpt } from '../../types';
import { settingsTranslations } from './translations';
import { mockBusinessProfile, mockNotificationPrefs, mockBillingHistory, mockIntegrations } from './mockData';
import { BusinessSettingsView } from './BusinessSettingsView';
import { SubscriptionView } from './SubscriptionView';
import { IntegrationsView } from './IntegrationsView';
import { ProfileSecurityView } from './ProfileSecurityView';

interface SettingsPageProps {
  selectedLanguage: LanguageOpt;
}

export default function SettingsPage({ selectedLanguage }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<'business' | 'subscription' | 'integrations' | 'profile'>('business');

  const lang = selectedLanguage.code === 'am' ? 'am' : 'en';
  const t = settingsTranslations[lang];

  const tabs = [
    { id: 'business' as const,      label: t.business,      icon: Building2 },
    { id: 'subscription' as const,  label: t.subscription,  icon: CreditCard },
    { id: 'integrations' as const,  label: t.integrations,  icon: Zap },
    { id: 'profile' as const,       label: t.profile,       icon: User },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-[var(--text-core)] mb-1 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-[#0077C5]" /> {t.settings}
          </h1>
          <p className="text-[var(--text-sec)] text-sm">{t.settingsDesc}</p>
        </div>

        {/* Tabs */}
        <div className="bg-[var(--bg-panel)] rounded-xl shadow-sm border border-[var(--border-core)] mb-6">
          <div className="flex overflow-x-auto border-b border-[var(--border-subtle)] no-scrollbar">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#0077C5] text-[#0077C5]'
                      : 'border-transparent text-[var(--text-sec)] hover:text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'business' && <BusinessSettingsView profile={mockBusinessProfile} prefs={mockNotificationPrefs} t={t} />}
          {activeTab === 'subscription' && <SubscriptionView currentPlan="professional" billingHistory={mockBillingHistory} t={t} />}
          {activeTab === 'integrations' && <IntegrationsView integrations={mockIntegrations} t={t} />}
          {activeTab === 'profile' && <ProfileSecurityView t={t} />}
        </div>
      </div>
    </div>
  );
}
