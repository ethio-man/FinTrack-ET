import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import {
  Users, MapPin, TrendingUp, Edit2, Eye,
  Building2, Plus, ArrowLeft, User, DollarSign,
  MoreVertical
} from 'lucide-react';

import { Role, StaffMember, Branch, ROLE_COLORS, fmt } from './mockData';
import { AddBranchModal, EditBranchModal, BranchReportModal } from './Modals';

interface BranchesViewProps {
  branches: Branch[];
  staff: StaffMember[];
  onBack: () => void;
  onBranchAdded: (b: Branch) => void;
  onBranchUpdated: (b: Branch) => void;
  t: any;
}

export function BranchesView({ branches, staff, onBack, onBranchAdded, onBranchUpdated, t }: BranchesViewProps) {
  const [modal, setModal] = useState<'add' | 'edit' | 'report' | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const comparisonData = branches.filter(b => b.monthlySales > 0).map(b => ({
    name: b.name.replace(' Branch', '').replace(' ቅርንጫፍ', ''),
    sales: b.monthlySales,
    profit: b.monthlyProfit,
  }));

  const totalSales = branches.reduce((s, b) => s + b.monthlySales, 0);
  const totalProfit = branches.reduce((s, b) => s + b.monthlyProfit, 0);
  const totalStaff = staff.length;

  function openEdit(b: Branch) {
    setSelectedBranch(b);
    setModal('edit');
  }

  function openReport(b: Branch) {
    setSelectedBranch(b);
    setModal('report');
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {modal === 'add' && <AddBranchModal onClose={() => setModal(null)} onAdd={b => { onBranchAdded(b); setModal(null); }} t={t} />}
      {modal === 'edit' && selectedBranch && (
        <EditBranchModal branch={selectedBranch} staff={staff} onClose={() => setModal(null)} onSave={b => { onBranchUpdated(b); setModal(null); }} t={t} />
      )}
      {modal === 'report' && selectedBranch && (
        <BranchReportModal branch={selectedBranch} staff={staff} onClose={() => setModal(null)} t={t} />
      )}

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
                <button onClick={() => openEdit(b)} className="p-1.5 hover:bg-[var(--bg-panel-inner)] rounded-lg transition-colors" title={t.edit}>
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
                  <button onClick={() => openEdit(b)} className="flex items-center gap-2 text-xs font-semibold text-[#0077C5] hover:text-[#005a96] transition-colors">
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
                <button onClick={() => openReport(b)} className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-[var(--border-core)] rounded-lg text-xs font-semibold text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors">
                  <Eye className="w-3.5 h-3.5" /> {t.viewReport}
                </button>
                <button onClick={() => openEdit(b)} className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-[var(--border-core)] rounded-lg text-xs font-semibold text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors">
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
