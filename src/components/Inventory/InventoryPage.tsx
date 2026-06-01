import React, { useState } from 'react';
import { Product, mockProducts } from './mockData';
import InventoryListView from './InventoryListView';
import ProductDetail from './ProductDetail';
import { LanguageOpt } from '../../types';

interface InventoryPageProps {
  selectedLanguage?: LanguageOpt;
}

const defaultLanguage: LanguageOpt = { code: 'en', name: 'English' };

export default function InventoryPage({ selectedLanguage }: InventoryPageProps) {
  const language = selectedLanguage ?? defaultLanguage;
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = selectedId ? products.find(p => p.id === selectedId) : null;

  function addProduct(p: Product) { 
    setProducts(prev => [p, ...prev]); 
  }

  function updateProduct(updated: Product) {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    setSelectedId(updated.id);
  }

  return (
    <div className="p-6 w-full h-full">
      {selected ? (
        <ProductDetail 
          product={selected} 
          onBack={() => setSelectedId(null)} 
          onUpdate={updateProduct} 
          language={language}
        />
      ) : (
        <InventoryListView 
          products={products} 
          onSelect={setSelectedId} 
          onProductAdded={addProduct} 
          language={language}
        />
      )}
    </div>
  );
}
