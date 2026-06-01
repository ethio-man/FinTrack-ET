import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Integration } from './mockData';
import { ConnectIntegrationModal } from './Modals';

export function IntegrationsView({ integrations: initialIntegrations, t }: { integrations: Integration[]; t: any }) {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [modal, setModal] = useState<Integration | null>(null);
  const [testingSms, setTestingSms] = useState(false);
  const [smsSuccess, setSmsSuccess] = useState(false);

  function handleConnect(id: string) {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: true } : i));
  }

  function handleTestSms() {
    setTestingSms(true);
    setTimeout(() => {
      setTestingSms(false);
      setSmsSuccess(true);
      setTimeout(() => setSmsSuccess(false), 2500);
    }, 1500);
  }

  return (
    <div className="space-y-6">
      {modal && <ConnectIntegrationModal integration={modal} onClose={() => setModal(null)} onConnect={() => { handleConnect(modal.id); setModal(null); }} t={t} />}

      <div className="bg-[var(--bg-panel)] rounded-xl p-6 shadow-sm border border-[var(--border-core)]">
        <h3 className="text-base font-bold text-[var(--text-core)] mb-4">{t.connectedServices}</h3>
        <div className="space-y-3">
          {integrations.map(int => {
            const Icon = int.icon;
            return (
              <div key={int.id} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                int.connected ? 'border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-900/10' : 'border-[var(--border-core)] bg-[var(--bg-panel-inner)]'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${int.connected ? 'bg-green-100 dark:bg-green-800/30' : 'bg-[var(--border-core)]'}`}>
                    <Icon className={`w-5 h-5 ${int.connected ? 'text-green-600 dark:text-green-400' : 'text-[var(--text-mute)]'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold text-[var(--text-core)]">{int.name}</p>
                      {int.connected && <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />}
                    </div>
                    <p className="text-xs text-[var(--text-sec)] font-medium">{int.description}</p>
                    <p className="text-xs text-[var(--text-mute)] mt-0.5">{t.provider}: {int.provider}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {int.connected ? (
                    <>
                      <button onClick={() => setIntegrations(prev => prev.map(i => i.id === int.id ? { ...i, connected: false } : i))} className="px-3 py-1.5 border border-[var(--border-core)] rounded-lg text-xs font-semibold text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors">
                        {t.disconnect}
                      </button>
                      {int.id === 'sms' && (
                        <button onClick={handleTestSms} disabled={testingSms} className="px-3 py-1.5 bg-[#0077C5] text-white rounded-lg text-xs font-bold hover:bg-[#005a96] transition-colors disabled:opacity-50">
                          {testingSms ? '...' : t.testSms}
                        </button>
                      )}
                    </>
                  ) : (
                    <button onClick={() => setModal(int)} className="px-3 py-1.5 bg-[#0077C5] text-white rounded-lg text-xs font-bold hover:bg-[#005a96] transition-colors">
                      {t.connect}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {smsSuccess && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium z-50">
          <Check className="w-4 h-4" /> SMS sent successfully!
        </div>
      )}
    </div>
  );
}
