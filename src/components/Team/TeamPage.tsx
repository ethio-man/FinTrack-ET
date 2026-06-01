import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import {
  Users, UserPlus, Shield, MapPin, TrendingUp, TrendingDown,
  Clock, Check, X, Edit2, Trash2, Send, Eye,
  Building2, AlertCircle, Award, Activity,
  MoreVertical, Search, Plus, ArrowLeft,
  User, DollarSign,
} from 'lucide-react';

import { LanguageOpt } from '../../types';
import { teamTranslations } from './translations';
import {
  Role, StaffStatus, StaffMember, Branch, RolePermissions,
  ROLES, STATUS_META, ROLE_COLORS, mockStaff, mockBranches, rolePermissions,
  fmt, fmtDate
} from './mockData';

interface TeamPageProps {
  selectedLanguage: LanguageOpt;
}

// ─── Modals ───────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
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

function InviteStaffModal({ branches, onClose, onInvite, t }: { branches: Branch[]; onClose: () => void; onInvite: (s: StaffMember) => void; t: any }) {
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

function EditRoleModal({ staff, onClose, onSave, t }: { staff: StaffMember; onClose: () => void; onSave: (role: Role) => void; t: any }) {
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

function RemoveStaffModal({ staff, onClose, onRemove, t }: { staff: StaffMember; onClose: () => void; onRemove: () => void; t: any }) {
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

function AddBranchModal({ onClose, onAdd, t }: { onClose: () => void; onAdd: (b: Branch) => void; t: any }) {
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

// ─── Team Management View ─────────────────────────────────────────────────────

function TeamManagementView({ staff, branches, onViewBranches, onStaffAdded, onStaffUpdated, onStaffRemoved, t }: {
  staff: StaffMember[];
  branches: Branch[];
  onViewBranches: () => void;
  onStaffAdded: (s: StaffMember) => void;
  onStaffUpdated: (id: string, role: Role) => void;
  onStaffRemoved: (id: string) => void;
  t: any;
}) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<StaffStatus | 'all'>('all');
  const [modal, setModal] = useState<'invite' | 'edit' | 'remove' | 'permissions' | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [permRole, setPermRole] = useState<Role>('Manager');

  const filtered = staff.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All' || s.role === roleFilter;
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const roleCounts: Record<string, number> = { All: staff.length };
  ROLES.forEach(r => { roleCounts[r] = staff.filter(s => s.role === r).length; });

  function openEdit(s: StaffMember) { setSelectedStaff(s); setModal('edit'); }
  function openRemove(s: StaffMember) { setSelectedStaff(s); setModal('remove'); }

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {modal === 'invite' && <InviteStaffModal branches={branches} onClose={() => setModal(null)} onInvite={s => { onStaffAdded(s); setModal(null); }} t={t} />}
      {modal === 'edit' && selectedStaff && (
        <EditRoleModal staff={selectedStaff} onClose={() => setModal(null)} onSave={role => { onStaffUpdated(selectedStaff.id, role); setModal(null); }} t={t} />
      )}
      {modal === 'remove' && selectedStaff && (
        <RemoveStaffModal staff={selectedStaff} onClose={() => setModal(null)} onRemove={() => { onStaffRemoved(selectedStaff.id); setModal(null); }} t={t} />
      )}
      {modal === 'permissions' && (
        <Modal title={t.permissionsMatrix} onClose={() => setModal(null)} wide>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--text-sec)] mb-2">{t.viewPermissionsFor}</label>
              <div className="flex gap-2 flex-wrap">
                {ROLES.map(r => (
                  <button key={r} onClick={() => setPermRole(r)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                      permRole === r ? 'border-[#0077C5] bg-[#0077C5] text-white' : 'border-[var(--border-core)] text-[var(--text-sec)] hover:border-[#0077C5]/50 hover:text-[var(--text-core)]'
                    }`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-core)]">
                    <th className="text-left py-2 px-3 text-xs text-[var(--text-mute)] uppercase">{t.module}</th>
                    <th className="text-center py-2 px-3 text-xs text-[var(--text-mute)] uppercase">{t.view}</th>
                    <th className="text-center py-2 px-3 text-xs text-[var(--text-mute)] uppercase">{t.create}</th>
                    <th className="text-center py-2 px-3 text-xs text-[var(--text-mute)] uppercase">{t.edit}</th>
                    <th className="text-center py-2 px-3 text-xs text-[var(--text-mute)] uppercase">{t.delete}</th>
                  </tr>
                </thead>
                <tbody>
                  {rolePermissions[permRole].map(p => (
                    <tr key={p.module} className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-panel-inner)] transition-colors">
                      <td className="py-2.5 px-3 text-[var(--text-core)]">{p.module}</td>
                      <td className="text-center py-2.5 px-3">{p.view   ? <Check className="w-4 h-4 text-green-600 mx-auto" /> : <X className="w-4 h-4 text-[var(--text-mute)] mx-auto" />}</td>
                      <td className="text-center py-2.5 px-3">{p.create ? <Check className="w-4 h-4 text-green-600 mx-auto" /> : <X className="w-4 h-4 text-[var(--text-mute)] mx-auto" />}</td>
                      <td className="text-center py-2.5 px-3">{p.edit   ? <Check className="w-4 h-4 text-green-600 mx-auto" /> : <X className="w-4 h-4 text-[var(--text-mute)] mx-auto" />}</td>
                      <td className="text-center py-2.5 px-3">{p.delete ? <Check className="w-4 h-4 text-green-600 mx-auto" /> : <X className="w-4 h-4 text-[var(--text-mute)] mx-auto" />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={() => setModal(null)} className="w-full py-2.5 border border-[var(--border-core)] text-[var(--text-core)] rounded-xl text-sm font-medium hover:bg-[var(--bg-panel-inner)] transition-colors">
              {t.close}
            </button>
          </div>
        </Modal>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-core)] mb-1">{t.teamManagement}</h1>
          <p className="text-[var(--text-sec)] text-sm">{t.staffAndBranches.replace('{staffCount}', String(staff.length)).replace('{branchesCount}', String(branches.length))}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={onViewBranches} className="flex items-center gap-2 px-4 py-2 border border-[var(--border-core)] rounded-lg text-sm text-[var(--text-core)] font-medium hover:bg-[var(--bg-panel-inner)] transition-colors">
            <Building2 className="w-4 h-4" /> {t.branches}
          </button>
          <button onClick={() => setModal('permissions')} className="flex items-center gap-2 px-4 py-2 border border-[var(--border-core)] rounded-lg text-sm text-[var(--text-core)] font-medium hover:bg-[var(--bg-panel-inner)] transition-colors">
            <Shield className="w-4 h-4" /> {t.permissions}
          </button>
          <button onClick={() => setModal('invite')} className="flex items-center gap-2 px-4 py-2 bg-[#0077C5] text-white rounded-lg text-sm font-bold hover:bg-[#005a96] transition-colors">
            <UserPlus className="w-4 h-4" /> {t.inviteStaff}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: t.totalStaff, value: staff.length, icon: Users, color: '#0077C5', bg: '#0077C515' },
          { label: t.activeNow, value: staff.filter(s => s.status === 'active').length, icon: Activity, color: '#10b981', bg: '#10b98115' },
          { label: t.totalBranches, value: branches.length, icon: Building2, color: '#8b5cf6', bg: '#8b5cf615' },
          { label: t.roles, value: ROLES.length, icon: Award, color: '#f59e0b', bg: '#f59e0b15' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-[var(--bg-panel)] rounded-xl p-5 shadow-sm border border-[var(--border-core)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-lg" style={{ background: bg }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <span className="text-xs font-medium text-[var(--text-mute)]">{label}</span>
            </div>
            <p className="text-2xl font-black" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[var(--bg-panel)] rounded-xl p-4 shadow-sm border border-[var(--border-core)] mb-4">
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-mute)]" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50" />
          </div>
          {(['all', 'active', 'away', 'offline'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                statusFilter === s ? 'border-[#0077C5] bg-[#0077C5] text-white' : 'border-[var(--border-core)] text-[var(--text-sec)] hover:bg-[var(--bg-panel-inner)] hover:text-[var(--text-core)]'
              }`}>
              {s === 'all' ? t.allStatuses : (t as any)[s]}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {(['All', ...ROLES] as (Role | 'All')[]).map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-colors ${
                roleFilter === r ? 'bg-[#0077C5] text-white border-[#0077C5]' : 'border-[var(--border-core)] text-[var(--text-sec)] hover:border-[#0077C5]/50 hover:text-[var(--text-core)]'
              }`}
              style={roleFilter !== r && r !== 'All' ? { borderColor: ROLE_COLORS[r] + '60', color: ROLE_COLORS[r] } : {}}>
              {r === 'All' ? t.allRoles : r} ({roleCounts[r]})
            </button>
          ))}
        </div>
      </div>

      {/* Staff table */}
      <div className="bg-[var(--bg-panel)] rounded-xl shadow-sm border border-[var(--border-core)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-[var(--bg-panel-inner)] border-b border-[var(--border-core)]">
                <th className="text-left px-5 py-3.5 text-xs text-[var(--text-mute)] font-semibold uppercase tracking-wider">{t.staffMember}</th>
                <th className="text-left px-5 py-3.5 text-xs text-[var(--text-mute)] font-semibold uppercase tracking-wider">{t.role}</th>
                <th className="text-left px-5 py-3.5 text-xs text-[var(--text-mute)] font-semibold uppercase tracking-wider">{t.branch}</th>
                <th className="text-left px-5 py-3.5 text-xs text-[var(--text-mute)] font-semibold uppercase tracking-wider">{t.lastActivity}</th>
                <th className="text-left px-5 py-3.5 text-xs text-[var(--text-mute)] font-semibold uppercase tracking-wider">{t.status}</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-[var(--text-mute)] text-sm"><Users className="w-10 h-10 mx-auto mb-3 opacity-30" />{t.noStaffFound}</td></tr>
              ) : filtered.map(s => {
                const br = s.branchId ? branches.find(b => b.id === s.branchId) : null;
                const statusMeta = STATUS_META[s.status];
                return (
                  <tr key={s.id} className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-panel-inner)] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0077C5] to-[#005a96] flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {s.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[var(--text-core)]">{s.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs text-[var(--text-mute)]">{s.phone}</p>
                            {s.email && <span className="text-xs text-[var(--text-mute)] opacity-50">·</span>}
                            {s.email && <p className="text-xs text-[var(--text-mute)]">{s.email}</p>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border-2"
                        style={{ borderColor: ROLE_COLORS[s.role] + '40', color: ROLE_COLORS[s.role], background: ROLE_COLORS[s.role] + '10' }}>
                        {s.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {br ? (
                        <div className="flex items-center gap-1.5 text-sm text-[var(--text-sec)]">
                          <MapPin className="w-3.5 h-3.5 text-[var(--text-mute)]" />
                          {br.name}
                        </div>
                      ) : (
                        <span className="text-xs text-[var(--text-mute)]">{t.headOffice}</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-[var(--text-sec)]">
                        <Clock className="w-3.5 h-3.5 text-[var(--text-mute)]" />
                        {s.lastActivity}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusMeta.bg} ${statusMeta.color}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
                        {(t as any)[statusMeta.labelKey]}
                      </span>
                    </td>
                    <td className="pr-4">
                      <div className="relative">
                        <button onClick={() => setMenuOpen(menuOpen === s.id ? null : s.id)}
                          className="p-1.5 hover:bg-[var(--border-core)] rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4 text-[var(--text-mute)]" />
                        </button>
                        {menuOpen === s.id && (
                          <div className="absolute right-0 top-full mt-1 bg-[var(--bg-panel)] border border-[var(--border-core)] rounded-xl shadow-lg py-1 z-20 w-40" onMouseLeave={() => setMenuOpen(null)}>
                            <button onClick={() => { openEdit(s); setMenuOpen(null); }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors">
                              <Edit2 className="w-3.5 h-3.5" /> {t.editRole}
                            </button>
                            <button onClick={() => { openRemove(s); setMenuOpen(null); }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" /> {t.remove}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Branches View ────────────────────────────────────────────────────────────

function BranchesView({ branches: initialBranches, staff, onBack, onBranchAdded, t }: {
  branches: Branch[];
  staff: StaffMember[];
  onBack: () => void;
  onBranchAdded: (b: Branch) => void;
  t: any;
}) {
  const [branches, setBranches] = useState(initialBranches);
  const [modal, setModal] = useState<'add' | null>(null);

  const comparisonData = branches.filter(b => b.monthlySales > 0).map(b => ({
    name: b.name.replace(' Branch', ''),
    sales: b.monthlySales,
    profit: b.monthlyProfit,
  }));

  const totalSales = branches.reduce((s, b) => s + b.monthlySales, 0);
  const totalProfit = branches.reduce((s, b) => s + b.monthlyProfit, 0);
  const totalStaff = staff.length;

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {modal === 'add' && <AddBranchModal onClose={() => setModal(null)} onAdd={b => { onBranchAdded(b); setBranches(prev => [...prev, b]); setModal(null); }} t={t} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-[var(--text-sec)] hover:text-[var(--text-core)] transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t.backToTeam}
        </button>
        <button onClick={() => setModal('add')} className="flex items-center gap-2 px-4 py-2.5 bg-[#0077C5] text-white rounded-lg text-sm font-bold hover:bg-[#005a96] transition-colors">
          <Plus className="w-4 h-4" /> {t.addBranch}
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: t.totalBranches, value: branches.length, icon: Building2, color: '#0077C5', bg: '#0077C515' },
          { label: t.totalStaff, value: totalStaff, icon: Users, color: '#10b981', bg: '#10b98115' },
          { label: t.combinedSales, value: fmt(totalSales), icon: DollarSign, color: '#3b82f6', bg: '#3b82f615' },
          { label: t.combinedProfit, value: fmt(totalProfit), icon: TrendingUp, color: '#8b5cf6', bg: '#8b5cf615' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-[var(--bg-panel)] rounded-xl p-5 shadow-sm border border-[var(--border-core)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-lg" style={{ background: bg }}><Icon className="w-5 h-5" style={{ color }} /></div>
              <span className="text-xs font-medium text-[var(--text-mute)]">{label}</span>
            </div>
            <p className="text-xl font-black" style={{ color }}>{typeof value === 'string' ? value : value}</p>
          </div>
        ))}
      </div>

      {/* Branch comparison chart */}
      {comparisonData.length > 0 && (
        <div className="bg-[var(--bg-panel)] rounded-xl p-6 shadow-sm border border-[var(--border-core)] mb-6">
          <h3 className="text-sm font-bold text-[var(--text-core)] mb-1">{t.branchPerformance}</h3>
          <p className="text-xs text-[var(--text-mute)] mb-4">{t.monthlySalesProfitByBranch}</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={comparisonData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle, #f3f4f6)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-mute, #9ca3af)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-mute, #9ca3af)' }} axisLine={false} tickLine={false} width={50}
                tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
              <RTooltip
                contentStyle={{ borderRadius: 10, border: '1px solid var(--border-core, #e5e7eb)', fontSize: 12, background: 'var(--bg-panel, #fff)' }}
                formatter={(v: number, n: string) => [fmt(v), n === 'sales' ? t.sales : t.profit]}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} formatter={(value) => value === 'sales' ? t.sales : t.profit} />
              <Bar dataKey="sales" fill="#0077C5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Branch cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {branches.map(b => {
          const branchStaff = staff.filter(s => s.branchId === b.id);
          const manager = b.managerId ? staff.find(s => s.id === b.managerId) : null;
          const roleCounts: Record<string, number> = {};
          branchStaff.forEach(s => { roleCounts[s.role] = (roleCounts[s.role] || 0) + 1; });

          return (
            <div key={b.id} className="bg-[var(--bg-panel)] rounded-xl p-5 shadow-sm border border-[var(--border-core)] hover:border-[#0077C5]/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0077C5] to-[#005a96] flex items-center justify-center text-white shrink-0 shadow-sm">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--text-core)]">{b.name}</h3>
                    <p className="text-xs text-[var(--text-sec)] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[var(--text-mute)]" /> {b.location}
                    </p>
                  </div>
                </div>
                <button className="p-1.5 hover:bg-[var(--bg-panel-inner)] rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4 text-[var(--text-mute)]" />
                </button>
              </div>

              {/* Manager */}
              <div className="mb-4 pb-4 border-b border-[var(--border-subtle)]">
                {manager ? (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0077C5] to-[#005a96] flex items-center justify-center text-white text-xs font-bold">
                      {manager.avatar}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[var(--text-mute)] uppercase tracking-wider">{t.branchManager}</p>
                      <p className="text-sm font-semibold text-[var(--text-core)]">{manager.name}</p>
                    </div>
                  </div>
                ) : (
                  <button className="flex items-center gap-2 text-xs font-semibold text-[#0077C5] hover:text-[#005a96] transition-colors">
                    <User className="w-3.5 h-3.5" /> {t.setManager}
                  </button>
                )}
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[var(--bg-panel-inner)] rounded-lg p-3">
                  <p className="text-[10px] font-bold text-[var(--text-mute)] uppercase tracking-wider mb-0.5">{t.monthlySales}</p>
                  <p className="text-sm font-bold text-[var(--text-core)]">{b.monthlySales > 0 ? fmt(b.monthlySales) : '—'}</p>
                </div>
                <div className="bg-[var(--bg-panel-inner)] rounded-lg p-3">
                  <p className="text-[10px] font-bold text-[var(--text-mute)] uppercase tracking-wider mb-0.5">{t.monthlyProfit}</p>
                  <p className="text-sm font-bold text-green-600 dark:text-green-400">{b.monthlyProfit > 0 ? fmt(b.monthlyProfit) : '—'}</p>
                </div>
              </div>

              {/* Staff breakdown */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold text-[var(--text-mute)] uppercase tracking-wider">{t.staff}</p>
                  <span className="text-xs font-semibold text-[var(--text-sec)]">
                    {branchStaff.length === 1 ? t.memberCount.replace('{count}', '1') : t.membersCount.replace('{count}', String(branchStaff.length))}
                  </span>
                </div>
                {Object.keys(roleCounts).length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(roleCounts).map(([role, count]) => (
                      <span key={role} className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                        style={{ borderColor: ROLE_COLORS[role as Role] + '40', color: ROLE_COLORS[role as Role], background: ROLE_COLORS[role as Role] + '10' }}>
                        {count} {role}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[var(--text-mute)]">{t.noStaffAssigned}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-[var(--border-core)] rounded-lg text-xs font-semibold text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors">
                  <Eye className="w-3.5 h-3.5" /> {t.viewReport}
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-[var(--border-core)] rounded-lg text-xs font-semibold text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors">
                  <Edit2 className="w-3.5 h-3.5" /> {t.edit}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function TeamPage({ selectedLanguage }: TeamPageProps) {
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
  const [branches, setBranches] = useState<Branch[]>(mockBranches);
  const [view, setView] = useState<'team' | 'branches'>('team');

  const lang = selectedLanguage.code === 'am' ? 'am' : 'en';
  const t = teamTranslations[lang];

  function addStaff(s: StaffMember) { setStaff(prev => [...prev, s]); }
  function updateStaff(id: string, role: Role) { setStaff(prev => prev.map(s => s.id === id ? { ...s, role } : s)); }
  function removeStaff(id: string) { setStaff(prev => prev.filter(s => s.id !== id)); }
  function addBranch(b: Branch) { setBranches(prev => [...prev, b]); }

  return (
    <div className="min-h-screen">
      {view === 'team' && (
        <TeamManagementView
          staff={staff}
          branches={branches}
          onViewBranches={() => setView('branches')}
          onStaffAdded={addStaff}
          onStaffUpdated={updateStaff}
          onStaffRemoved={removeStaff}
          t={t}
        />
      )}
      {view === 'branches' && (
        <BranchesView
          branches={branches}
          staff={staff}
          onBack={() => setView('team')}
          onBranchAdded={addBranch}
          t={t}
        />
      )}
    </div>
  );
}
