import React, { useState } from 'react';
import {
  Users, UserPlus, Shield, MapPin,
  Clock, Check, X, Edit2, Trash2,
  Building2, Award, Activity,
  MoreVertical, Search
} from 'lucide-react';

import { Role, StaffStatus, StaffMember, Branch, ROLES, STATUS_META, ROLE_COLORS, rolePermissions } from './mockData';
import { Modal, InviteStaffModal, EditRoleModal, RemoveStaffModal } from './Modals';

interface TeamManagementViewProps {
  staff: StaffMember[];
  branches: Branch[];
  onViewBranches: () => void;
  onStaffAdded: (s: StaffMember) => void;
  onStaffUpdated: (id: string, role: Role) => void;
  onStaffRemoved: (id: string) => void;
  t: any;
}

export function TeamManagementView({ staff, branches, onViewBranches, onStaffAdded, onStaffUpdated, onStaffRemoved, t }: TeamManagementViewProps) {
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
