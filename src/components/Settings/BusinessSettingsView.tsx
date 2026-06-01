import React, { useState, useRef } from 'react';
import { Building2, Upload, Bell, DollarSign, Check, Save } from 'lucide-react';
import { BusinessProfile, NotificationPrefs } from './mockData';

interface BusinessSettingsViewProps {
  profile: BusinessProfile;
  prefs: NotificationPrefs;
  t: any;
}

export function BusinessSettingsView({ profile: initialProfile, prefs: initialPrefs, t }: BusinessSettingsViewProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [prefs, setPrefs] = useState(initialPrefs);
  const [saved, setSaved] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialProfile.logo || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleUploadLogoClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingLogo(true);
      
      // Create a local preview URL
      const objectUrl = URL.createObjectURL(file);
      
      setTimeout(() => {
        setUploadingLogo(false);
        setLogoPreview(objectUrl);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }, 1500);
    }
  }

  return (
    <div className="space-y-6">
      {/* Business Profile */}
      <div className="bg-[var(--bg-panel)] rounded-xl p-6 shadow-sm border border-[var(--border-core)]">
        <h3 className="text-base font-bold text-[var(--text-core)] mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#0077C5]" /> {t.businessProfile}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.businessLogo}</label>
            <div className="flex items-center gap-4">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-20 h-20 rounded-xl object-cover shadow-inner" />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-[#0077C5] to-[#005a96] rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-inner">
                  FT
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
              />
              <button onClick={handleUploadLogoClick} disabled={uploadingLogo} className="flex items-center gap-2 px-4 py-2 border border-[var(--border-core)] rounded-lg text-sm font-medium text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors disabled:opacity-50">
                <Upload className="w-4 h-4" /> {uploadingLogo ? '...' : t.uploadLogo}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.businessName}</label>
              <input
                value={profile.name}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.address}</label>
              <input
                value={profile.address}
                onChange={e => setProfile(p => ({ ...p, address: e.target.value }))}
                className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.phone}</label>
              <input
                value={profile.phone}
                onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.email}</label>
              <input
                type="email"
                value={profile.email}
                onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.tin}</label>
              <input
                value={profile.tin}
                onChange={e => setProfile(p => ({ ...p, tin: e.target.value }))}
                className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[var(--bg-panel)] rounded-xl p-6 shadow-sm border border-[var(--border-core)]">
        <h3 className="text-base font-bold text-[var(--text-core)] mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#0077C5]" /> {t.notificationPrefs}
        </h3>
        <div className="space-y-4">
          {[
            { key: 'smsAlerts' as const, label: t.smsAlerts, desc: t.smsAlertsDesc },
            { key: 'lowStockAlerts' as const, label: t.lowStockAlerts, desc: t.lowStockAlertsDesc },
            { key: 'paymentReminders' as const, label: t.paymentReminders, desc: t.paymentRemindersDesc },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)] last:border-0">
              <div>
                <p className="text-sm font-semibold text-[var(--text-core)]">{label}</p>
                <p className="text-xs text-[var(--text-mute)] mt-0.5">{desc}</p>
              </div>
              <button
                onClick={() => setPrefs(p => ({ ...p, [key]: !p[key] }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${prefs[key] ? 'bg-[#0077C5]' : 'bg-[var(--border-core)]'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${prefs[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}

          <div className="pt-3">
            <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.reminderLeadTime}</label>
            <select
              value={prefs.reminderLeadTime}
              onChange={e => setPrefs(p => ({ ...p, reminderLeadTime: +e.target.value }))}
              className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50"
            >
              <option value={12}>{t.hoursBefore.replace('{hours}', '12')}</option>
              <option value={24}>{t.hoursBefore.replace('{hours}', '24')}</option>
              <option value={48}>{t.hoursBefore.replace('{hours}', '48')}</option>
              <option value={72}>{t.hoursBefore.replace('{hours}', '72')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Currency */}
      <div className="bg-[var(--bg-panel)] rounded-xl p-6 shadow-sm border border-[var(--border-core)]">
        <h3 className="text-base font-bold text-[var(--text-core)] mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-[#0077C5]" /> {t.currencySettings}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.currency}</label>
            <div className="px-4 py-2.5 bg-[var(--bg-panel-inner)] border border-[var(--border-core)] rounded-lg text-sm text-[var(--text-mute)] font-medium">
              Ethiopian Birr (ETB)
            </div>
            <p className="text-xs text-[var(--text-mute)] mt-1">{t.currencyLocked}</p>
          </div>
          <div>
            <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.decimalPlaces}</label>
            <select className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50">
              <option>2 (e.g. 1,234.56)</option>
              <option>0 (e.g. 1,235)</option>
            </select>
          </div>
        </div>
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium z-50">
          <Check className="w-4 h-4" /> {t.settingsSaved}
        </div>
      )}

      <button onClick={handleSave} className="w-full py-3 bg-[#0077C5] text-white rounded-xl text-sm font-bold hover:bg-[#005a96] transition-colors flex items-center justify-center gap-2">
        <Save className="w-4 h-4" /> {t.saveChanges}
      </button>
    </div>
  );
}
