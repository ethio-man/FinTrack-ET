import React, { useState } from 'react';
import { Invoice, mockInvoices } from './mockData';
import InvoicesListView from './InvoicesListView';
import CreateInvoiceView from './CreateInvoiceView';
import InvoiceDetailView from './InvoiceDetailView';
import { LanguageOpt } from '../../types';

interface InvoicesPageProps {
  selectedLanguage?: LanguageOpt;
}

const defaultLanguage: LanguageOpt = { code: 'en', name: 'English' };

export default function InvoicesPage({ selectedLanguage }: InvoicesPageProps) {
  const language = selectedLanguage ?? defaultLanguage;
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [view, setView] = useState<'list' | 'new' | 'detail'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = selectedId ? invoices.find(inv => inv.id === selectedId) : null;

  function addInvoice(inv: Invoice) { 
    setInvoices(prev => [inv, ...prev]); 
  }
  
  function deleteInvoice(id: string) { 
    setInvoices(prev => prev.filter(inv => inv.id !== id)); 
  }

  return (
    <div className="p-6 w-full h-full min-h-[calc(100vh-64px)]">
      {view === 'list' && (
        <InvoicesListView
          invoices={invoices}
          onNew={() => setView('new')}
          onView={id => { setSelectedId(id); setView('detail'); }}
          language={language}
        />
      )}
      {view === 'new' && (
        <CreateInvoiceView
          onBack={() => setView('list')}
          onSave={inv => { addInvoice(inv); setView('list'); }}
          language={language}
        />
      )}
      {view === 'detail' && selected && (
        <InvoiceDetailView
          inv={selected}
          onBack={() => setView('list')}
          onEdit={() => setView('new')}
          onDelete={id => { deleteInvoice(id); setView('list'); }}
          language={language}
        />
      )}
    </div>
  );
}
