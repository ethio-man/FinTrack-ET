import React from 'react';
import { LanguageOpt } from '../../types';
import { mockSales } from './mockData';
import { Printer, Send, Edit2, Trash2, ArrowLeft, ShoppingBag, Wallet, Smartphone, Building2, CreditCard } from 'lucide-react';

export default // Sale Detail View
function SaleDetailView({ saleId, onBack, onEdit, selectedLanguage }: { saleId: string; onBack: () => void; onEdit: () => void; selectedLanguage?: LanguageOpt }) {
  const isAmharic = selectedLanguage?.code === 'am';
  const t = {
    back: isAmharic ? 'ወደ ሽያጭ ዝርዝር ተመለስ' : 'Back to Sales List',
    saleDetail: isAmharic ? 'የሽያጭ ዝርዝር' : 'Sale Detail',
    edit: isAmharic ? 'አርም' : 'Edit',
    sendReceipt: isAmharic ? 'ደረሰኝ ላክ' : 'Send Receipt',
    print: isAmharic ? 'አትም' : 'Print',
    invoice: isAmharic ? 'ደረሰኝ' : 'Invoice',
    billTo: isAmharic ? 'ተቀባዩ' : 'BILL TO',
    item: isAmharic ? 'ዕቃ' : 'ITEM',
    qty: isAmharic ? 'ብዛት' : 'QTY',
    unitPrice: isAmharic ? 'የአንዱ ዋጋ' : 'UNIT PRICE',
    amount: isAmharic ? 'ድምር' : 'AMOUNT',
    subtotal: isAmharic ? 'ንዑስ ድምር' : 'Subtotal',
    discount: isAmharic ? 'ቅናሽ' : 'Discount',
    total: isAmharic ? 'ጠቅላላ' : 'Total',
    notes: isAmharic ? 'ማስታወሻዎች' : 'NOTES',
    paymentInfo: isAmharic ? 'የክፍያ መረጃ' : 'Payment Information',
    paymentMethod: isAmharic ? 'የክፍያ ዘዴ' : 'Payment Method',
    amountPaid: isAmharic ? 'የተከፈለ መጠን' : 'Amount Paid',
    balanceDue: isAmharic ? 'ቀሪ ሂሳብ' : 'Balance Due',
    status: isAmharic ? 'ሁኔታ' : 'Status',
    quickActions: isAmharic ? 'ፈጣን እርምጃዎች' : 'Quick Actions',
    convertDebt: isAmharic ? 'ወደ እዳ ቀይር' : 'Convert to Debt',
    notFound: isAmharic ? 'ሽያጩ አልተገኘም' : 'Sale not found',
    goBack: isAmharic ? 'ወደ ኋላ ሂድ' : 'Go back',
    customerStatus: isAmharic ? 'የደንበኛ ሁኔታ' : 'Customer Status',
    noDebts: isAmharic ? 'ምንም ቀሪ ዕዳ የለም' : 'No outstanding debts',
    saleTitle: isAmharic ? 'ሽያጭ' : 'Sale',
    invoiceNumber: isAmharic ? 'የደረሰኝ ቁጥር' : 'Invoice Number',
    dateLabel: isAmharic ? 'ቀን' : 'Date',
    deleteBtn: isAmharic ? 'ሰርዝ' : 'Delete',
  };
  const sale = mockSales.find(s => s.id === saleId);

  if (!sale) {
    return (
      <div className="p-6">
        <p>{t.notFound}</p>
        <button onClick={onBack} className="text-indigo-600 hover:underline">{t.goBack}</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-[var(--bg-panel)] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl">{t.saleTitle} {sale.id}</h1>
            <p className="text-[var(--text-sec)] text-sm">{sale.date} at {sale.time}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="px-4 py-2 bg-[var(--bg-panel)] text-[var(--text-sec)] rounded-lg flex items-center gap-2 hover:bg-[var(--bg-panel)]">
            <Printer className="w-4 h-4" />
            {t.print}
          </button>
          <button className="px-4 py-2 bg-[var(--bg-panel)] text-[var(--text-sec)] rounded-lg flex items-center gap-2 hover:bg-[var(--bg-panel)]">
            <Send className="w-4 h-4" />
            {t.sendReceipt}
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-[var(--bg-panel)] text-[var(--text-sec)] rounded-lg flex items-center gap-2 hover:bg-[var(--bg-panel)]"
          >
            <Edit2 className="w-4 h-4" />
            {t.edit}
          </button>
          <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg flex items-center gap-2 hover:bg-red-200">
            <Trash2 className="w-4 h-4" />
            {t.deleteBtn}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Invoice Details */}
        <div className="col-span-2 space-y-6">
          {/* Invoice Preview */}
          <div id="printable-invoice" className="bg-[var(--bg-panel-inner)] rounded-xl p-8 shadow-sm border border-[var(--border-subtle)]">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-xl mb-1">{t.invoice.toUpperCase()}</h2>
                <p className="text-sm text-[var(--text-sec)]">{t.invoiceNumber}: {sale.id}</p>
                <p className="text-sm text-[var(--text-sec)]">{t.dateLabel}: {sale.date}</p>
              </div>
              <div className="w-16 h-16 bg-indigo-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Business Info */}
            <div className="mb-8 pb-8 border-b border-[var(--border-core)]">
              <p className="text-sm mb-1">My Business Name</p>
              <p className="text-xs text-[var(--text-sec)]">123 Business Street</p>
              <p className="text-xs text-[var(--text-sec)]">Addis Ababa, Ethiopia</p>
              <p className="text-xs text-[var(--text-sec)]">+251 911 123456</p>
            </div>

            {/* Customer Info */}
            <div className="mb-8">
              <p className="text-xs text-[var(--text-sec)] mb-2">{t.billTo}</p>
              <p className="text-sm mb-1">{sale.customer}</p>
              {sale.customerPhone && <p className="text-xs text-[var(--text-sec)]">{sale.customerPhone}</p>}
            </div>

            {/* Line Items */}
            <div className="mb-8">
              <table className="w-full">
                <thead className="border-b border-[var(--border-core)]">
                  <tr>
                    <th className="text-left py-3 text-xs text-[var(--text-sec)]">{t.item}</th>
                    <th className="text-right py-3 text-xs text-[var(--text-sec)]">{t.qty}</th>
                    <th className="text-right py-3 text-xs text-[var(--text-sec)]">{t.unitPrice}</th>
                    <th className="text-right py-3 text-xs text-[var(--text-sec)]">{t.amount}</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.items.map(item => (
                    <tr key={item.id} className="border-b border-[var(--border-subtle)]">
                      <td className="py-3 text-sm">{item.product}</td>
                      <td className="py-3 text-sm text-right">{item.quantity}</td>
                      <td className="py-3 text-sm text-right">ETB ${item.unitPrice.toFixed(2)}</td>
                      <td className="py-3 text-sm text-right">ETB ${item.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-sec)]">{t.subtotal}</span>
                  <span>ETB ${sale.subtotal.toFixed(2)}</span>
                </div>
                {sale.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-sec)]">{t.discount}</span>
                    <span className="text-red-600">-ETB ${sale.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-[var(--border-core)]">
                  <span className="text-lg">{t.total}</span>
                  <span className="text-lg">ETB ${sale.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {sale.notes && (
              <div className="mt-8 pt-8 border-t border-[var(--border-core)]">
                <p className="text-xs text-[var(--text-sec)] mb-2">{t.notes}</p>
                <p className="text-sm text-[var(--text-sec)]">{sale.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Info & Actions */}
        <div className="space-y-6">
          {/* Payment Info */}
          <div className="bg-[var(--bg-panel-inner)] rounded-xl p-6 shadow-sm border border-[var(--border-subtle)]">
            <h3 className="mb-4">{t.paymentInfo}</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-[var(--text-sec)] mb-1">{t.paymentMethod}</p>
                <div className="flex items-center gap-2">
                  {sale.paymentMethod === 'cash' && <Wallet className="w-4 h-4 text-[var(--text-sec)]" />}
                  {sale.paymentMethod === 'telebirr' && <Smartphone className="w-4 h-4 text-[var(--text-sec)]" />}
                  {sale.paymentMethod === 'bank' && <Building2 className="w-4 h-4 text-[var(--text-sec)]" />}
                  {sale.paymentMethod === 'credit' && <CreditCard className="w-4 h-4 text-[var(--text-sec)]" />}
                  <span className="text-sm capitalize">{sale.paymentMethod}</span>
                </div>
              </div>
              <div className="pt-3 border-t border-[var(--border-core)]">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[var(--text-sec)]">{t.amountPaid}</span>
                  <span className="text-green-600">ETB ${sale.amountPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-sec)]">{t.balanceDue}</span>
                  <span className={sale.balanceDue > 0 ? 'text-red-600' : 'text-[var(--text-core)]'}>
                    ${sale.balanceDue.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-[var(--bg-panel-inner)] rounded-xl p-6 shadow-sm border border-[var(--border-subtle)]">
            <h3 className="mb-4">{t.status}</h3>
            <div>
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm capitalize ${
                sale.status === 'complete' ? 'bg-green-100 text-green-700' :
                sale.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                'bg-[var(--bg-panel)] text-[var(--text-sec)]'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  sale.status === 'complete' ? 'bg-green-500' :
                  sale.status === 'pending' ? 'bg-orange-500' :
                  'bg-gray-500'
                }`}></div>
                {sale.status}
              </span>
            </div>
          </div>

          {/* Actions */}
          {sale.status === 'complete' && sale.balanceDue > 0 && (
            <div className="bg-[var(--bg-panel-inner)] rounded-xl p-6 shadow-sm border border-[var(--border-subtle)]">
              <h3 className="mb-4">{t.quickActions}</h3>
              <button className="w-full px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                {t.convertDebt}
              </button>
            </div>
          )}

          {/* Customer Debt Status */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <p className="text-sm text-amber-900">
              <span className="font-medium">{t.customerStatus}:</span> {t.noDebts}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
