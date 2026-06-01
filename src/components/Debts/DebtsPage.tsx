import React, { useState } from 'react';
import { mockDebts, Debt } from './mockData';
import DebtsOverview from './DebtsOverview';
import DebtDetail from './DebtDetail';
import { LanguageOpt } from '../../types';

interface DebtsPageProps {
  selectedLanguage?: LanguageOpt;
}

const defaultLanguage: LanguageOpt = { code: 'en', name: 'English' };

export default function DebtsPage({ selectedLanguage }: DebtsPageProps) {
  const language = selectedLanguage ?? defaultLanguage;
  const [debts, setDebts] = useState<Debt[]>(mockDebts);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedDebt = selectedId ? debts.find(d => d.id === selectedId) : null;

  function addDebt(d: Debt) {
    setDebts(prev => [d, ...prev]);
  }

  function deleteDebt(id: string) {
    setDebts(prev => prev.filter(d => d.id !== id));
    setSelectedId(null);
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {selectedDebt ? (
        <DebtDetail
          debt={selectedDebt}
          onBack={() => setSelectedId(null)}
          onDelete={deleteDebt}
          language={language}
        />
      ) : (
        <DebtsOverview
          debts={debts}
          onSelect={setSelectedId}
          onDebtAdded={addDebt}
          language={language}
        />
      )}
    </div>
  );
}
