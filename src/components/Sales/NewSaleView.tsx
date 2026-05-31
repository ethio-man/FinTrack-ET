import React, { useState } from 'react';
import { LanguageOpt } from '../../types';
import { mockProducts, mockCustomers, LineItem } from './mockData';
import { Search, Plus, X, Calendar, User, ShoppingBag, CreditCard, Smartphone, Building2, Wallet, Send, Printer, ArrowLeft } from 'lucide-react';

export default // New Sale View
function NewSaleView({ onBack, selectedLanguage }: { onBack: () => void; selectedLanguage?: LanguageOpt }) {
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [searchProduct, setSearchProduct] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'telebirr' | 'bank' | 'credit'>('cash');
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [saleTime, setSaleTime] = useState(new Date().toTimeString().split(' ')[0].slice(0, 5));

  const addLineItem = (product: typeof mockProducts[0]) => {
    const existing = lineItems.find(item => item.product === product.name);
    if (existing) {
      setLineItems(lineItems.map(item =>
        item.product === product.name
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unitPrice }
          : item
      ));
    } else {
      setLineItems([...lineItems, {
        id: String(Date.now()),
        product: product.name,
        quantity: 1,
        unitPrice: product.price,
        subtotal: product.price
      }]);
    }
    setSearchProduct('');
  };

  const updateQuantity = (id: string, quantity: number) => {
    setLineItems(lineItems.map(item =>
      item.id === id
        ? { ...item, quantity, subtotal: quantity * item.unitPrice }
        : item
    ));
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const subtotal = lineItems.reduce((sum, item) => sum + item.subtotal, 0);
  const isAmharic = selectedLanguage?.code === 'am';
  const t = {
    create: isAmharic ? 'አዲስ ሽያጭ ፍጠር' : 'Create New Sale',
    desc: isAmharic ? 'አዲስ የሽያጭ ግብይት ይመዝግቡ' : 'Record a new sales transaction',
    saleDetails: isAmharic ? 'የሽያጭ ዝርዝሮች' : 'Sale Details',
    customer: isAmharic ? 'ደንበኛ *' : 'Customer *',
    dateTime: isAmharic ? 'ቀን እና ሰዓት' : 'Date & Time',
    addProducts: isAmharic ? 'ምርቶችን ያክሉ' : 'Add Products',
    searchProdPh: isAmharic ? 'ለማከል ምርቶችን ይፈልጉ...' : 'Search products to add...',
    product: isAmharic ? 'ምርት' : 'Product',
    qty: isAmharic ? 'ብዛት' : 'Qty',
    unitPrice: isAmharic ? 'የአንዱ ዋጋ' : 'Unit Price',
    subtotal: isAmharic ? 'ንዑስ ድምር' : 'Subtotal',
    paymentMethod: isAmharic ? 'የክፍያ ዘዴ' : 'Payment Method',
    cash: isAmharic ? 'ጥሬ ገንዘብ' : 'Cash',
    telebirr: isAmharic ? 'ቴሌብር' : 'Telebirr',
    bank: isAmharic ? 'ባንክ' : 'Bank',
    credit: isAmharic ? 'ክሬዲት' : 'Credit',
    orderSummary: isAmharic ? 'የትዕዛዝ ማጠቃለያ' : 'Order Summary',
    discount: isAmharic ? 'ቅናሽ' : 'Discount',
    total: isAmharic ? 'ጠቅላላ' : 'Total',
    notes: isAmharic ? 'ማስታወሻዎች' : 'Notes',
    addNotesPh: isAmharic ? 'ማንኛውም ተጨማሪ ማስታወሻዎች ወይም መመሪያዎች...' : 'Any additional notes or instructions...',
    cancel: isAmharic ? 'ሰርዝ' : 'Cancel',
    completeSale: isAmharic ? 'ሽያጩን አጠናቅ' : 'Complete Sale',
    selectExistingCustomer: isAmharic ? 'ነባር ደንበኛ ይምረጡ' : 'Select existing customer',
    orTypeNewCustomer: isAmharic ? 'ወይም አዲስ የደንበኛ ስም ይተይቡ' : 'Or type new customer name',
    summary: isAmharic ? 'ማጠቃለያ' : 'Summary',
    savePrintReceipt: isAmharic ? 'አስቀምጥ እና ደረሰኝ አትም' : 'Save & Print Receipt',
    saveSendSms: isAmharic ? 'አስቀምጥ እና ኤስኤምኤስ ላክ' : 'Save & Send SMS',
    saveDraft: isAmharic ? 'እንደ ረቂቅ አስቀምጥ' : 'Save Draft',
    tipText: isAmharic ? 'በመፈለግ ወይም ባርኮዶችን በመቃኘት ምርቶችን ማከል ይችላሉ። ቀኑ ወደ አሁን ነባሪ ይሆናል ነገር ግን ላለፉት ሽያጮች ሊለወጥ ይችላል።' : 'You can add products by searching or scanning barcodes. The date defaults to now but can be changed for past sales.',
    tipLabel: isAmharic ? 'ጠቃሚ ምክር:' : 'Tip:',
  };
  const finalAmount = subtotal - discount;

  const filteredProducts = mockProducts.filter(p =>
    p.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-[var(--bg-panel)] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl">{t.create}</h1>
          <p className="text-[var(--text-sec)] text-sm">{t.desc}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="col-span-2 space-y-6">
          {/* Customer & Date */}
          <div className="bg-[var(--bg-panel-inner)] rounded-xl p-6 shadow-sm border border-[var(--border-subtle)]">
            <h3 className="mb-4">{t.saleDetails}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--text-sec)] mb-2">{t.customer}</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-mute)]" />
                  <select
                    className="w-full pl-10 pr-4 py-2.5 border border-[var(--border-core)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                  >
                    <option value="">{t.selectExistingCustomer}</option>
                    {mockCustomers.map(customer => (
                      <option key={customer} value={customer}>{customer}</option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  placeholder={t.orTypeNewCustomer}
                  className="w-full mt-2 px-3 py-2.5 border border-[var(--border-core)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-sec)] mb-2">{t.dateTime}</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-mute)]" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-3 py-2.5 border border-[var(--border-core)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={saleDate}
                      onChange={(e) => setSaleDate(e.target.value)}
                    />
                  </div>
                  <input
                    type="time"
                    className="w-full px-3 py-2.5 border border-[var(--border-core)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={saleTime}
                    onChange={(e) => setSaleTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Selector */}
          <div className="bg-[var(--bg-panel-inner)] rounded-xl p-6 shadow-sm border border-[var(--border-subtle)]">
            <h3 className="mb-4">{t.addProducts}</h3>
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-mute)]" />
              <input
                type="text"
                placeholder={t.searchProdPh}
                className="w-full pl-10 pr-4 py-2.5 border border-[var(--border-core)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
              />
            </div>

            {searchProduct && filteredProducts.length > 0 && (
              <div className="mb-4 border border-[var(--border-core)] rounded-lg max-h-48 overflow-y-auto">
                {filteredProducts.map(product => (
                  <button
                    key={product.id}
                    className="w-full px-4 py-3 hover:bg-[var(--bg-core)] text-left flex items-center justify-between border-b border-[var(--border-subtle)] last:border-0"
                    onClick={() => addLineItem(product)}
                  >
                    <div>
                      <p className="text-sm">{product.name}</p>
                      <p className="text-xs text-[var(--text-mute)]">{product.category} • {product.stock} in stock</p>
                    </div>
                    <span className="text-sm">${product.price}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Line Items */}
            {lineItems.length > 0 && (
              <div className="border border-[var(--border-core)] rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[var(--bg-core)] border-b border-[var(--border-core)]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-[var(--text-sec)]">{t.product}</th>
                      <th className="px-4 py-3 text-left text-xs text-[var(--text-sec)]">{t.qty}</th>
                      <th className="px-4 py-3 text-left text-xs text-[var(--text-sec)]">{t.unitPrice}</th>
                      <th className="px-4 py-3 text-left text-xs text-[var(--text-sec)]">{t.subtotal}</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map(item => (
                      <tr key={item.id} className="border-b border-[var(--border-subtle)] last:border-0">
                        <td className="px-4 py-3 text-sm">{item.product}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 px-2 py-1 border border-[var(--border-core)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm">${item.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm">${item.subtotal.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => removeLineItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-[var(--bg-panel-inner)] rounded-xl p-6 shadow-sm border border-[var(--border-subtle)]">
            <h3 className="mb-4">{t.paymentMethod}</h3>
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-[var(--border-core)] hover:border-[var(--border-subtle)]'
                }`}
              >
                <Wallet className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'cash' ? 'text-indigo-600' : 'text-[var(--text-mute)]'}`} />
                <p className="text-sm text-center">{t.cash}</p>
              </button>
              <button
                onClick={() => setPaymentMethod('telebirr')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'telebirr'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-[var(--border-core)] hover:border-[var(--border-subtle)]'
                }`}
              >
                <Smartphone className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'telebirr' ? 'text-indigo-600' : 'text-[var(--text-mute)]'}`} />
                <p className="text-sm text-center">{t.telebirr}</p>
              </button>
              <button
                onClick={() => setPaymentMethod('bank')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'bank'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-[var(--border-core)] hover:border-[var(--border-subtle)]'
                }`}
              >
                <Building2 className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'bank' ? 'text-indigo-600' : 'text-[var(--text-mute)]'}`} />
                <p className="text-sm text-center">{t.bank}</p>
              </button>
              <button
                onClick={() => setPaymentMethod('credit')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'credit'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-[var(--border-core)] hover:border-[var(--border-subtle)]'
                }`}
              >
                <CreditCard className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'credit' ? 'text-indigo-600' : 'text-[var(--text-mute)]'}`} />
                <p className="text-sm text-center">{t.credit}</p>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-[var(--bg-panel-inner)] rounded-xl p-6 shadow-sm border border-[var(--border-subtle)]">
            <h3 className="mb-4">Notes (Optional)</h3>
            <textarea
              placeholder="Add memo or reference number..."
              className="w-full px-4 py-3 border border-[var(--border-core)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Totals Panel */}
          <div className="bg-[var(--bg-panel-inner)] rounded-xl p-6 shadow-sm border border-[var(--border-subtle)] sticky top-6">
            <h3 className="mb-4">{t.summary}</h3>

            <div className="space-y-3 mb-4 pb-4 border-b border-[var(--border-core)]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-sec)]">{t.subtotal}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-sec)]">{t.discount}</span>
                <input
                  type="number"
                  min="0"
                  max={subtotal}
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-24 px-2 py-1 border border-[var(--border-core)] rounded text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <span className="text-lg">{t.total}</span>
              <span className="text-2xl">${finalAmount.toFixed(2)}</span>
            </div>

            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2">
                <Printer className="w-4 h-4" />
                {t.savePrintReceipt}
              </button>
              <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                {t.saveSendSms}
              </button>
              <button className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                {t.saveDraft}
              </button>
              <button
                onClick={onBack}
                className="w-full px-4 py-3 border border-[var(--border-subtle)] text-[var(--text-sec)] rounded-lg hover:bg-[var(--bg-core)]"
              >{t.cancel}</button>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-sm text-blue-900">
              <span className="font-medium">{t.tipLabel}</span> {t.tipText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}