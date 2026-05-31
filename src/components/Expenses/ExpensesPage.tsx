import React, { useState } from 'react';
import ExpensesListView from './ExpensesListView';
import RecordExpenseView from './RecordExpenseView';
import { LanguageOpt } from '../../types';

interface ExpensesPageProps {
  language: LanguageOpt;
}

export default function ExpensesPage({ language }: ExpensesPageProps) {
  const [view, setView] = useState<'list' | 'new'>('list');

  return (
    <div className="min-h-screen bg-[var(--bg-core)] transition-colors p-4 md:p-8">
      {view === 'list' && <ExpensesListView onNew={() => setView('new')} language={language} />}
      {view === 'new'  && <RecordExpenseView onBack={() => setView('list')} selectedLanguage={language} />}
    </div>
  );
}
