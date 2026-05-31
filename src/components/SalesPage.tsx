import { LanguageOpt } from '../types';
import React, { useState } from 'react';
import SalesListView from './Sales/SalesListView';
import NewSaleView from './Sales/NewSaleView';
import SaleDetailView from './Sales/SaleDetailView';

// Main Sales Component
export default function Sales({ selectedLanguage }: { selectedLanguage?: LanguageOpt }) {
  const [currentView, setCurrentView] = useState<'list' | 'new' | 'detail'>('list');
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);

  const handleViewSale = (saleId: string) => {
    setSelectedSaleId(saleId);
    setCurrentView('detail');
  };

  const handleNewSale = () => {
    setCurrentView('new');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedSaleId(null);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-core)]">
      {currentView === 'list' && <SalesListView onNewSale={handleNewSale} onViewSale={handleViewSale}  selectedLanguage={selectedLanguage} />}
      {currentView === 'new' && <NewSaleView onBack={handleBackToList}  selectedLanguage={selectedLanguage} />}
      {currentView === 'detail' && selectedSaleId && (
        <SaleDetailView saleId={selectedSaleId} onBack={handleBackToList} onEdit={() => setCurrentView('new')} selectedLanguage={selectedLanguage} />
      )}
    </div>
  );
}