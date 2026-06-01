import React, { useState } from 'react';
import { LanguageOpt } from '../../types';
import { teamTranslations } from './translations';
import { StaffMember, Branch, Role, mockStaff, mockBranches } from './mockData';
import { TeamManagementView } from './TeamManagementView';
import { BranchesView } from './BranchesView';

interface TeamPageProps {
  selectedLanguage: LanguageOpt;
}

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
  function updateBranch(b: Branch) { setBranches(prev => prev.map(branch => branch.id === b.id ? b : branch)); }

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
          onBranchUpdated={updateBranch}
          t={t}
        />
      )}
    </div>
  );
}
