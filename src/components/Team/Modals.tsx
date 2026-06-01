import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle, Send, Users, DollarSign, TrendingUp, Building2, MapPin } from 'lucide-react';
import { Role, StaffMember, Branch, ROLES, fmt } from './mockData';

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className={`bg-[var(--bg-panel)] rounded-2xl shadow-2xl w-full border border-[var(--border-core)] ${wide ? 'max-w-2xl' : 'max-w-md'}`}>
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

export function InviteStaffModal({ branches, onClose, onInvite, t }: { branches: Branch[]; onClose: () => void; onInvite: (s: StaffMember) => void; t: any }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('Cashier');
  const [branchId, setBranchId] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = t.nameRequired;
    if (!phone.trim()) e.phone = t.phoneRequired;
    return e;
  }

  function send() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSent(true);
    setTimeout(() => {
      onInvite({
        id: 's-' + Date.now(),
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || `${phone.replace(/\s+/g, '')}@placeholder.co`,
        role,
        branchId: branchId || null,
        status: 'offline',
        lastActivity: 'Never',
        joinedDate: new Date().toISOString().split('T')[0],
        avatar: name.trim().split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase(),
      });
      onClose();
    }, 1200);
  }

  return (
    <Modal title={t.inviteStaffTitle} onClose={onClose}>
      <div className="space-y-4">
        {sent && (
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 rounded-xl px-4 py-3 text-sm">
            <Check className="w-4 h-4" /> {t.inviteSentTo.replace('{phone}', phone)}
          </div>
        )}
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.fullName} <span className="text-red-500">*</span></label>
          <input value={name} onChange={e => { setName(e.target.value); setErrors(v => ({ ...v, name: '' })); }}
            placeholder={t.namePlaceholder}
            className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50" />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.phoneNumber} <span className="text-red-500">*</span></label>
          <input value={phone} onChange={e => { setPhone(e.target.value); setErrors(v => ({ ...v, phone: '' })); }}
            placeholder={t.phonePlaceholder}
            className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50" />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          <p className="text-xs text-[var(--text-mute)] mt-1">{t.otpHint}</p>
        </div>
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.emailOptional}</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
            className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50" />
        </div>
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.role}</label>
          <select value={role} onChange={e => setRole(e.target.value as Role)}
            className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50">
            {ROLES.slice(1).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.assignToBranchOptional}</label>
          <select value={branchId} onChange={e => setBranchId(e.target.value)}
            className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50">
            <option value="">{t.noBranch}</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={send} disabled={sent}
            className="flex-1 py-2.5 bg-[#0077C5] text-white rounded-xl text-sm font-bold hover:bg-[#005a96] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /> {t.sendInvite}
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 border border-[var(--border-core)] text-[var(--text-core)] rounded-xl text-sm font-medium hover:bg-[var(--bg-panel-inner)] transition-colors">
            {t.cancel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function EditRoleModal({ staff, onClose, onSave, t }: { staff: StaffMember; onClose: () => void; onSave: (role: Role) => void; t: any }) {
  const [role, setRole] = useState(staff.role);
  return (
    <Modal title={t.editRoleTitle.replace('{name}', staff.name)} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.currentRole}</label>
          <div className="px-4 py-2.5 bg-[var(--bg-panel-inner)] rounded-lg text-sm text-[var(--text-mute)]">{staff.role}</div>
        </div>
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.newRole}</label>
          <select value={role} onChange={e => setRole(e.target.value as Role)}
            className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50">
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { onSave(role); onClose(); }}
            className="flex-1 py-2.5 bg-[#0077C5] text-white rounded-xl text-sm font-bold hover:bg-[#005a96] transition-colors">
            {t.saveRole}
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 border border-[var(--border-core)] text-[var(--text-core)] rounded-xl text-sm font-medium hover:bg-[var(--bg-panel-inner)] transition-colors">
            {t.cancel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function RemoveStaffModal({ staff, onClose, onRemove, t }: { staff: StaffMember; onClose: () => void; onRemove: () => void; t: any }) {
  return (
    <Modal title={t.removeStaffTitle} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="text-sm text-red-700 dark:text-red-400">
            {t.removeStaffConfirm.replace('{name}', staff.name).replace('{role}', staff.role)}
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { onRemove(); onClose(); }}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors">
            {t.remove}
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 border border-[var(--border-core)] text-[var(--text-core)] rounded-xl text-sm font-medium hover:bg-[var(--bg-panel-inner)] transition-colors">
            {t.cancel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function AddBranchModal({ onClose, onAdd, t }: { onClose: () => void; onAdd: (b: Branch) => void; t: any }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = t.branchNameRequired;
    if (!location.trim()) e.location = t.locationRequired;
    return e;
  }

  function save() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onAdd({
      id: 'b-' + Date.now(),
      name: name.trim(),
      location: location.trim(),
      managerId: null,
      monthlySales: 0,
      monthlyProfit: 0,
      staffCount: 0,
      openedDate: new Date().toISOString().split('T')[0],
    });
    onClose();
  }

  return (
    <Modal title={t.addBranchTitle} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.branchName} <span className="text-red-500">*</span></label>
          <input value={name} onChange={e => { setName(e.target.value); setErrors(v => ({ ...v, name: '' })); }}
            placeholder={t.branchNamePlaceholder}
            className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50" />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.location} <span className="text-red-500">*</span></label>
          <input value={location} onChange={e => { setLocation(e.target.value); setErrors(v => ({ ...v, location: '' })); }}
            placeholder={t.locationPlaceholder}
            className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50" />
          {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
        </div>
        <div className="flex gap-3">
          <button onClick={save}
            className="flex-1 py-2.5 bg-[#0077C5] text-white rounded-xl text-sm font-bold hover:bg-[#005a96] transition-colors">
            {t.addBranchBtn}
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 border border-[var(--border-core)] text-[var(--text-core)] rounded-xl text-sm font-medium hover:bg-[var(--bg-panel-inner)] transition-colors">
            {t.cancel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function EditBranchModal({ branch, onClose, onSave, t, staff }: { branch: Branch; onClose: () => void; onSave: (b: Branch) => void; t: any; staff: StaffMember[] }) {
  const [name, setName] = useState(branch.name);
  const [location, setLocation] = useState(branch.location);
  const [managerId, setManagerId] = useState(branch.managerId || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableManagers = staff.filter(s => s.role === 'Manager' || s.role === 'Owner');

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = t.branchNameRequired;
    if (!location.trim()) e.location = t.locationRequired;
    return e;
  }

  function save() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({
      ...branch,
      name: name.trim(),
      location: location.trim(),
      managerId: managerId || null,
    });
    onClose();
  }

  return (
    <Modal title={t.editBranchTitle.replace('{name}', branch.name)} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.branchName} <span className="text-red-500">*</span></label>
          <input value={name} onChange={e => { setName(e.target.value); setErrors(v => ({ ...v, name: '' })); }}
            className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50" />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.location} <span className="text-red-500">*</span></label>
          <input value={location} onChange={e => { setLocation(e.target.value); setErrors(v => ({ ...v, location: '' })); }}
            className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50" />
          {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
        </div>
        <div>
          <label className="block text-sm text-[var(--text-sec)] mb-1.5">{t.branchManager}</label>
          <select value={managerId} onChange={e => setManagerId(e.target.value)}
            className="w-full px-4 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50">
            <option value="">{t.setManager}</option>
            {availableManagers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={save}
            className="flex-1 py-2.5 bg-[#0077C5] text-white rounded-xl text-sm font-bold hover:bg-[#005a96] transition-colors">
            {t.saveChanges}
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 border border-[var(--border-core)] text-[var(--text-core)] rounded-xl text-sm font-medium hover:bg-[var(--bg-panel-inner)] transition-colors">
            {t.cancel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function BranchReportModal({ branch, staff, onClose, t }: { branch: Branch; staff: StaffMember[]; onClose: () => void; t: any }) {
  const branchStaff = staff.filter(s => s.branchId === branch.id);
  const manager = branch.managerId ? staff.find(s => s.id === branch.managerId) : null;

  return (
    <Modal title={t.branchReportTitle.replace('{name}', branch.name)} onClose={onClose} wide>
      <div className="space-y-6">
        <div className="bg-[#0077C5]/10 border border-[#0077C5]/20 rounded-xl p-4 flex gap-3 text-[#0077C5]">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{t.reportComingSoon.replace('{name}', branch.name)}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--bg-panel-inner)] rounded-xl p-4 border border-[var(--border-core)]">
            <div className="flex items-center gap-2 mb-2 text-[var(--text-mute)]">
              <Building2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">{t.branchName}</span>
            </div>
            <p className="text-sm font-bold text-[var(--text-core)]">{branch.name}</p>
          </div>
          <div className="bg-[var(--bg-panel-inner)] rounded-xl p-4 border border-[var(--border-core)]">
            <div className="flex items-center gap-2 mb-2 text-[var(--text-mute)]">
              <MapPin className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">{t.location}</span>
            </div>
            <p className="text-sm font-bold text-[var(--text-core)]">{branch.location}</p>
          </div>
          <div className="bg-[var(--bg-panel-inner)] rounded-xl p-4 border border-[var(--border-core)]">
            <div className="flex items-center gap-2 mb-2 text-[var(--text-mute)]">
              <DollarSign className="w-4 h-4 text-[#3b82f6]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#3b82f6]">{t.monthlySales}</span>
            </div>
            <p className="text-sm font-bold text-[var(--text-core)]">{fmt(branch.monthlySales)}</p>
          </div>
          <div className="bg-[var(--bg-panel-inner)] rounded-xl p-4 border border-[var(--border-core)]">
            <div className="flex items-center gap-2 mb-2 text-[var(--text-mute)]">
              <TrendingUp className="w-4 h-4 text-[#10b981]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#10b981]">{t.monthlyProfit}</span>
            </div>
            <p className="text-sm font-bold text-green-600 dark:text-green-400">{fmt(branch.monthlyProfit)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[var(--bg-panel-inner)] rounded-xl p-4 border border-[var(--border-core)]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-mute)] mb-3">{t.branchManager}</h4>
            {manager ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0077C5] to-[#005a96] flex items-center justify-center text-white font-bold text-sm">
                  {manager.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--text-core)]">{manager.name}</p>
                  <p className="text-xs text-[var(--text-mute)]">{manager.phone}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[var(--text-mute)]">{t.noStaffAssigned}</p>
            )}
          </div>
          <div className="bg-[var(--bg-panel-inner)] rounded-xl p-4 border border-[var(--border-core)]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-mute)]">{t.staff}</h4>
              <span className="text-xs font-semibold text-[var(--text-sec)]">
                {branchStaff.length === 1 ? t.memberCount.replace('{count}', '1') : t.membersCount.replace('{count}', String(branchStaff.length))}
              </span>
            </div>
            {branchStaff.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {branchStaff.slice(0, 8).map(s => (
                  <div key={s.id} className="w-8 h-8 rounded-full bg-[var(--bg-panel)] border border-[var(--border-core)] flex items-center justify-center text-[var(--text-core)] text-xs font-bold" title={s.name}>
                    {s.avatar}
                  </div>
                ))}
                {branchStaff.length > 8 && (
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-panel)] border border-[var(--border-core)] flex items-center justify-center text-[var(--text-sec)] text-xs font-bold">
                    +{branchStaff.length - 8}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-[var(--text-mute)]">{t.noStaffAssigned}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button onClick={onClose} className="px-5 py-2.5 bg-[#0077C5] text-white rounded-xl text-sm font-bold hover:bg-[#005a96] transition-colors">
            {t.closeReport}
          </button>
        </div>
      </div>
    </Modal>
  );
}
