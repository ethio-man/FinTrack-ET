import React, { useState } from 'react';
import { Check, X, Clock, EyeOff, Eye, AlertCircle, Smartphone, Building2 } from 'lucide-react';
import { Integration, PlanTier, PLANS, fmt } from './mockData';

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
      <div className={`bg-[var(--bg-panel)] rounded-2xl shadow-2xl w-full border border-[var(--border-core)] ${wide ? 'max-w-3xl' : 'max-w-md'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-core)]">
          <h3 className="text-base font-bold text-[var(--text-core)]">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-[var(--bg-panel-inner)] rounded-lg transition-colors">
            <X className="w-4 h-4 text-[var(--text-sec)]" />
          </button>
        </div>
        <div className="px-6 py-5 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export function UpgradePlanModal({ currentPlan, onClose, onUpgrade, t }: { currentPlan: PlanTier; onClose: () => void; onUpgrade: (plan: PlanTier) => void; t: any }) {
  const [selected, setSelected] = useState<PlanTier>('professional');
  const [paymentMethod, setPaymentMethod] = useState<'telebirr' | 'bank'>('telebirr');
  const [processing, setProcessing] = useState(false);

  function handleUpgrade() {
    setProcessing(true);
    setTimeout(() => {
      onUpgrade(selected);
      onClose();
    }, 1500);
  }

  const planData = PLANS[selected];
  const amount = planData.price;

  return (
    <Modal title={t.upgradePlanTitle} onClose={onClose} wide>
      <div className="space-y-5">
        {/* Plan selector */}
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-3">{t.selectPlan}</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(['basic', 'professional', 'premium'] as PlanTier[]).map(plan => {
              const p = PLANS[plan];
              const isCurrent = plan === currentPlan;
              return (
                <button
                  key={plan}
                  onClick={() => setSelected(plan)}
                  disabled={isCurrent}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    isCurrent
                      ? 'border-[var(--border-subtle)] bg-[var(--bg-panel-inner)] opacity-50 cursor-not-allowed'
                      : selected === plan
                      ? 'border-[#0077C5] bg-[#0077C5]/10'
                      : 'border-[var(--border-core)] hover:border-[#0077C5]/50 hover:bg-[var(--bg-panel-inner)]'
                  }`}
                >
                  <p className="text-sm font-bold text-[var(--text-core)]">{p.name}</p>
                  <p className="text-xl font-black mt-1" style={{ color: p.color }}>{fmt(p.price)}</p>
                  <p className="text-xs text-[var(--text-mute)] mt-0.5">{t.perMonth}</p>
                  {isCurrent && <p className="text-xs font-semibold text-green-600 dark:text-green-400 mt-2">{t.currentPlan}</p>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Features */}
        <div className="bg-[var(--bg-panel-inner)] border border-[var(--border-core)] rounded-xl p-4">
          <p className="text-sm font-semibold text-[var(--text-core)] mb-2">{t.whatYouGet.replace('{plan}', planData.name)}</p>
          <ul className="space-y-1.5">
            {planData.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-[var(--text-sec)]">
                <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Payment method */}
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-2">{t.paymentMethod}</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'telebirr' as const, label: 'Telebirr', icon: Smartphone },
              { id: 'bank' as const, label: t.bankTransfer, icon: Building2 },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setPaymentMethod(id)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  paymentMethod === id ? 'border-[#0077C5] bg-[#0077C5]/10' : 'border-[var(--border-core)] hover:border-[#0077C5]/50'
                }`}
              >
                <Icon className="w-5 h-5 text-[#0077C5]" />
                <span className="text-sm font-semibold text-[var(--text-core)]">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="bg-[#0077C5]/10 border border-[#0077C5]/30 rounded-xl p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-[#0077C5]">{t.totalDue}</span>
          <span className="text-xl font-black text-[#0077C5]">{fmt(amount)}</span>
        </div>

        {processing && (
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 rounded-xl px-4 py-3 text-sm font-medium">
            <Clock className="w-4 h-4 animate-spin" /> {t.processingPayment}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleUpgrade}
            disabled={processing}
            className="flex-1 py-3 bg-[#0077C5] text-white rounded-xl text-sm font-bold hover:bg-[#005a96] transition-colors disabled:opacity-60"
          >
            {processing ? t.processingPayment : `${t.upgradePlan} - ${planData.name}`}
          </button>
          <button onClick={onClose} className="flex-1 py-3 border border-[var(--border-core)] text-[var(--text-core)] font-medium rounded-xl text-sm hover:bg-[var(--bg-panel-inner)] transition-colors">
            {t.cancel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function ChangePinModal({ onClose, onSave, t }: { onClose: () => void; onSave: () => void; t: any }) {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function validate() {
    if (currentPin.length !== 8) return 'Current PIN must be 8 digits';
    if (newPin.length !== 8) return 'New PIN must be 8 digits';
    if (newPin !== confirmPin) return 'PINs do not match';
    return null;
  }

  function save() {
    const err = validate();
    if (err) { setError(err); return; }
    setSuccess(true);
    setTimeout(() => { onSave(); onClose(); }, 1200);
  }

  return (
    <Modal title={t.changePinTitle} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.currentPin}</label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              maxLength={8}
              value={currentPin}
              onChange={e => { setCurrentPin(e.target.value.replace(/\D/g, '')); setError(''); }}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-mute)] hover:text-[var(--text-core)]"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.newPin}</label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              maxLength={8}
              value={newPin}
              onChange={e => { setNewPin(e.target.value.replace(/\D/g, '')); setError(''); }}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNew(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-mute)] hover:text-[var(--text-core)]"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.confirmNewPin}</label>
          <input
            type="password"
            maxLength={8}
            value={confirmPin}
            onChange={e => { setConfirmPin(e.target.value.replace(/\D/g, '')); setError(''); }}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl px-4 py-3 text-sm font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl px-4 py-3 text-sm font-medium">
            <Check className="w-4 h-4" /> {t.pinChanged}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={save} disabled={success} className="flex-1 py-2.5 bg-[#0077C5] text-white rounded-xl text-sm font-bold hover:bg-[#005a96] transition-colors disabled:opacity-60">
            {t.changePin}
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 border border-[var(--border-core)] text-[var(--text-core)] font-medium rounded-xl text-sm hover:bg-[var(--bg-panel-inner)] transition-colors">
            {t.cancel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function ConnectIntegrationModal({ integration, onClose, onConnect, t }: {
  integration: Integration;
  onClose: () => void;
  onConnect: () => void;
  t: any;
}) {
  const [apiKey, setApiKey] = useState('');
  const [phone, setPhone] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [testing, setTesting] = useState(false);
  const [connected, setConnected] = useState(false);

  const Icon = integration.icon;
  const isTelebirr = integration.id === 'telebirr';
  const isSms = integration.id === 'sms';
  const isBank = integration.id.includes('cbe') || integration.id.includes('awash');

  function handleConnect() {
    setTesting(true);
    setTimeout(() => {
      setConnected(true);
      setTimeout(() => {
        onConnect();
        onClose();
      }, 1000);
    }, 1500);
  }

  return (
    <Modal title={t.connectIntegrationTitle.replace('{name}', integration.name)} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-start gap-3 bg-[#0077C5]/10 border border-[#0077C5]/20 rounded-xl p-4">
          <Icon className="w-5 h-5 text-[#0077C5] shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="mb-1 font-semibold text-[var(--text-core)]">{integration.description}</p>
            <p className="text-xs text-[#0077C5] font-medium">{t.provider}: {integration.provider}</p>
          </div>
        </div>

        {isTelebirr && (
          <div>
            <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.telebirrNumber}</label>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+251 9XX XXX XXX"
              className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50"
            />
            <p className="text-xs text-[var(--text-mute)] mt-1">{t.telebirrHint}</p>
          </div>
        )}

        {isSms && (
          <div>
            <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.apiKey}</label>
            <input
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder={t.apiKeyHint}
              className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50"
            />
          </div>
        )}

        {isBank && (
          <>
            <div>
              <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.accountNumber}</label>
              <input
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                placeholder={t.accountNumber}
                className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.accountHolderName}</label>
              <input
                placeholder={t.accountHolderName}
                className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50"
              />
            </div>
          </>
        )}

        {testing && (
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 rounded-xl px-4 py-3 text-sm font-medium">
            <Clock className="w-4 h-4 animate-spin" /> {t.testingConnection}
          </div>
        )}

        {connected && (
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl px-4 py-3 text-sm font-medium">
            <Check className="w-4 h-4" /> {t.connectedSuccessfully}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={handleConnect} disabled={testing || connected} className="flex-1 py-2.5 bg-[#0077C5] text-white rounded-xl text-sm font-bold hover:bg-[#005a96] transition-colors disabled:opacity-60">
            {testing ? t.testingConnection : connected ? t.connectedSuccessfully : t.connect}
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 border border-[var(--border-core)] text-[var(--text-core)] font-medium rounded-xl text-sm hover:bg-[var(--bg-panel-inner)] transition-colors">
            {t.cancel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
