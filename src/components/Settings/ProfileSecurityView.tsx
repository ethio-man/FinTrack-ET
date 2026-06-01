import React, { useState, useRef } from 'react';
import { User, Camera, Save, Lock, ChevronRight, LogOut, AlertCircle, Check } from 'lucide-react';
import { ChangePinModal } from './Modals';

export function ProfileSecurityView({ t }: { t: any }) {
  const [name, setName] = useState('Mariana Silva');
  const [phone, setPhone] = useState('+251 911 111 111');
  const [email, setEmail] = useState('mariana@financetrack.co');
  const [modal, setModal] = useState<'pin' | null>(null);
  const [saved, setSaved] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleUploadPhotoClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingPhoto(true);
      const objectUrl = URL.createObjectURL(file);
      setTimeout(() => {
        setUploadingPhoto(false);
        setPhotoPreview(objectUrl);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }, 1500);
    }
  }

  function handleSignOut(all: boolean) {
    alert(all ? "Signing out all devices..." : "Signing out this device...");
  }

  return (
    <div className="space-y-6">
      {modal === 'pin' && <ChangePinModal onClose={() => setModal(null)} onSave={() => setModal(null)} t={t} />}

      {/* Personal Details */}
      <div className="bg-[var(--bg-panel)] rounded-xl p-6 shadow-sm border border-[var(--border-core)]">
        <h3 className="text-base font-bold text-[var(--text-core)] mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-[#0077C5]" /> {t.personalDetails}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.profilePhoto}</label>
            <div className="flex items-center gap-4">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="w-16 h-16 rounded-full object-cover shadow-inner" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0077C5] to-[#005a96] flex items-center justify-center text-white text-xl font-black shadow-inner">
                  M
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
              />
              <button onClick={handleUploadPhotoClick} disabled={uploadingPhoto} className="flex items-center gap-2 px-4 py-2 border border-[var(--border-core)] rounded-lg text-sm font-medium text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors disabled:opacity-50">
                <Camera className="w-4 h-4" /> {uploadingPhoto ? '...' : t.changePhoto}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.fullName}</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.phoneNumber}</label>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.email}</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50"
              />
            </div>
          </div>

          <button onClick={handleSave} className="w-full py-2.5 bg-[#0077C5] text-white rounded-xl text-sm font-bold hover:bg-[#005a96] transition-colors flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> {t.saveProfile}
          </button>
        </div>
      </div>

      {/* Security */}
      <div className="bg-[var(--bg-panel)] rounded-xl p-6 shadow-sm border border-[var(--border-core)]">
        <h3 className="text-base font-bold text-[var(--text-core)] mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#0077C5]" /> {t.security}
        </h3>
        <div className="space-y-3">
          <button onClick={() => setModal('pin')} className="w-full flex items-center justify-between p-4 bg-[var(--bg-panel-inner)] border border-[var(--border-core)] rounded-xl hover:border-[#0077C5]/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0077C5]/10 rounded-lg">
                <Lock className="w-4 h-4 text-[#0077C5]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-[var(--text-core)]">{t.changeAccessPin}</p>
                <p className="text-xs font-medium text-[var(--text-sec)]">{t.changeAccessPinDesc}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--text-mute)]" />
          </button>

          <button onClick={() => handleSignOut(false)} className="w-full flex items-center justify-between p-4 bg-[var(--bg-panel-inner)] border border-[var(--border-core)] rounded-xl hover:border-red-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-[var(--text-core)]">{t.signOutDevice}</p>
                <p className="text-xs font-medium text-[var(--text-sec)]">{t.signOutDeviceDesc}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--text-mute)]" />
          </button>

          <button onClick={() => handleSignOut(true)} className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-red-700 dark:text-red-400">{t.signOutAll}</p>
                <p className="text-xs font-medium text-red-600 dark:text-red-500">{t.signOutAllDesc}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium z-50">
          <Check className="w-4 h-4" /> {t.profileSaved}
        </div>
      )}
    </div>
  );
}
