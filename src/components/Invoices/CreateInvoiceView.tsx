import React, { useState, useMemo } from 'react';
import { ArrowLeft, Maximize2, Send, Printer, Check, User, ChevronDown, Hash, Package, X, Plus, Percent, FileText } from 'lucide-react';
import { Invoice, InvoiceLine, InvoiceStatus, CONTACTS, PRODUCTS, TODAY, dueDateFromTerms, PAYMENT_TERMS, calcInvoice, fmt, fmtDate, initials } from './mockData';
import { FullScreenPreview } from './Modals';
import { InvoiceDocument } from './InvoiceDocument';
import { translations } from './translations';
import { LanguageOpt } from '../../types';

const EMPTY_LINE = (): InvoiceLine => ({ id: 'l-' + Date.now() + Math.random(), product: '', description: '', qty: 1, unitPrice: 0 });

let _counter = 1027;
function nextNum() { return `INV-${++_counter}`; }

export default function CreateInvoiceView({ onBack, onSave, language }: { onBack: () => void; onSave: (inv: Invoice) => void; language: LanguageOpt }) {
  const [customer, setCustomer] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [contactOpen, setContactOpen] = useState(false);
  
  const [date, setDate] = useState(TODAY);
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [dueDate, setDueDate] = useState(dueDateFromTerms('Net 30', TODAY));
  const [customDue, setCustomDue] = useState(false);
  
  const [items, setItems] = useState<InvoiceLine[]>([EMPTY_LINE()]);
  const [discountPct, setDiscountPct] = useState(0);
  const [vatEnabled, setVatEnabled] = useState(true);
  const [vatPct, setVatPct] = useState(15);
  const [notes, setNotes] = useState('Thank you for your business.');
  const [terms, setTerms] = useState('Payment is due within the agreed period. Late payments may incur fees.');
  
  const [fullPreview, setFullPreview] = useState(false);
  const [productOpen, setProductOpen] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const t = translations[language.code as keyof typeof translations] || translations.en;
  
  const invNumber = useMemo(() => nextNum(), []);

  const draftInv: Invoice = {
    id: 'new', number: invNumber, customer, customerPhone, customerEmail, customerAddress,
    date, dueDate, paymentTerms, status: 'draft',
    items, discountPct, vatEnabled, vatPct, notes, terms,
  };

  const { subtotal, discountAmount, vatAmount, total } = calcInvoice(draftInv);

  function setLine(id: string, key: keyof InvoiceLine, val: string | number) {
    setItems(prev => prev.map(it => it.id === id ? { ...it, [key]: val } : it));
  }
  function addLine() { setItems(prev => [...prev, EMPTY_LINE()]); }
  function removeLine(id: string) { setItems(prev => prev.filter(it => it.id !== id)); }

  function pickContact(c: typeof CONTACTS[0]) {
    setCustomer(c.name); setCustomerPhone(c.phone); setCustomerEmail(c.email); setCustomerAddress(c.address);
    setContactOpen(false);
  }

  function handleTermsChange(val: string) {
    setPaymentTerms(val);
    if (val !== 'Custom date') { setCustomDue(false); setDueDate(dueDateFromTerms(val, date)); }
    else setCustomDue(true);
  }

  function doSave(status: InvoiceStatus) {
    const inv: Invoice = { ...draftInv, id: 'iv-' + Date.now(), status };
    setSaved(true);
    setTimeout(() => { onSave(inv); onBack(); }, 800);
  }

  return (
    <>
      {fullPreview && <FullScreenPreview inv={draftInv} onClose={() => setFullPreview(false)} language={language} />}
      <div className="flex flex-col h-full bg-[var(--bg-core)]">
        {/* Sticky top bar */}
        <div className="sticky top-0 z-30 bg-[var(--bg-panel)] border-b border-[var(--border-core)] flex items-center justify-between px-6 py-4 shadow-sm">
          <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-[var(--text-sec)] hover:text-[var(--text-core)] transition-colors">
            <ArrowLeft className="w-4 h-4" /> {t.back}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--text-sec)] hidden md:block">{t.creating} {invNumber}</span>
            <button onClick={() => setFullPreview(true)} className="flex items-center gap-2 px-3 py-2 border border-[var(--border-core)] rounded-lg text-sm font-medium text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors shadow-sm ml-4">
              <Maximize2 className="w-4 h-4" /> <span className="hidden sm:inline">{t.preview}</span>
            </button>
            <button onClick={() => doSave('draft')} disabled={saved} className="px-3 py-2 border border-[var(--border-core)] rounded-lg text-sm font-medium text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors shadow-sm disabled:opacity-50">
              {t.saveDraft}
            </button>
            <button onClick={() => doSave('sent')} disabled={saved} className="flex items-center gap-2 px-4 py-2 border border-indigo-500 text-indigo-500 rounded-lg text-sm font-medium hover:bg-indigo-500/10 transition-colors shadow-sm disabled:opacity-50">
              <Send className="w-4 h-4" /> <span className="hidden sm:inline">{t.saveAndSendSms}</span>
            </button>
            <button onClick={() => { window.print(); doSave('sent'); }} disabled={saved} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50">
              <Printer className="w-4 h-4" /> <span className="hidden sm:inline">{t.saveAndPrint}</span>
            </button>
          </div>
        </div>

        {saved && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium">
            <Check className="w-4 h-4" /> {t.invoiceSaved}
          </div>
        )}

        {/* Split layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* LEFT: Form */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto space-y-6">

              {/* Customer */}
              <div className="bg-[var(--bg-panel)] rounded-xl p-5 shadow-sm border border-[var(--border-subtle)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[var(--text-core)] flex items-center gap-2"><User className="w-4 h-4 text-indigo-500" /> {t.customer}</h3>
                  <div className="relative">
                    <button onClick={() => setContactOpen(v => !v)}
                      className="flex items-center gap-1 text-xs font-medium text-indigo-500 hover:text-indigo-600 transition-colors">
                      {t.pickFromContacts} <ChevronDown className="w-3 h-3" />
                    </button>
                    {contactOpen && (
                      <div className="absolute right-0 top-full mt-1 bg-[var(--bg-panel)] border border-[var(--border-core)] rounded-xl shadow-lg py-1 z-20 w-60">
                        {CONTACTS.map(c => (
                          <button key={c.name} onClick={() => pickContact(c)}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors text-left font-medium">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs flex items-center justify-center shrink-0 shadow-sm">{initials(c.name)}</div>
                            <div>
                              <p className="text-sm text-[var(--text-core)]">{c.name}</p>
                              <p className="text-xs text-[var(--text-mute)]">{c.phone}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: t.fullName, key: 'customer', val: customer, set: setCustomer, icon: User, full: true },
                    { label: t.phone,     key: 'phone',    val: customerPhone, set: setCustomerPhone, icon: null },
                    { label: t.email,     key: 'email',    val: customerEmail, set: setCustomerEmail, icon: null },
                    { label: t.address,   key: 'address',  val: customerAddress, set: setCustomerAddress, icon: null, full: true },
                  ].map(({ label, key, val, set, full }) => (
                    <div key={key} className={full ? 'col-span-2' : ''}>
                      <label className="block text-xs font-medium text-[var(--text-sec)] mb-1.5">{label}</label>
                      <input value={val} onChange={e => set(e.target.value)} placeholder={label}
                        className="w-full px-3.5 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Invoice details */}
              <div className="bg-[var(--bg-panel)] rounded-xl p-5 shadow-sm border border-[var(--border-subtle)]">
                <h3 className="text-sm font-semibold text-[var(--text-core)] mb-4 flex items-center gap-2"><Hash className="w-4 h-4 text-indigo-500" /> {t.invoiceDetails}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-sec)] mb-1.5">{t.invoiceNumber}</label>
                    <input value={invNumber} readOnly className="w-full px-3.5 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)]/50 text-[var(--text-mute)] rounded-lg text-sm font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-sec)] mb-1.5">{t.invoiceDate}</label>
                    <input type="date" value={date} onChange={e => { setDate(e.target.value); if (!customDue) setDueDate(dueDateFromTerms(paymentTerms, e.target.value)); }}
                      className="w-full px-3.5 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-sec)] mb-1.5">{t.paymentTerms}</label>
                    <select value={paymentTerms} onChange={e => handleTermsChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                      {PAYMENT_TERMS.map(term => <option key={term}>{term}</option>)}
                    </select>
                  </div>
                  {customDue && (
                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-[var(--text-sec)] mb-1.5">{t.dueDate}</label>
                      <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                    </div>
                  )}
                  {!customDue && (
                    <div className="col-span-3">
                      <p className="text-xs font-medium text-[var(--text-mute)]">{t.dueDate}: <span className="text-[var(--text-core)]">{fmtDate(dueDate)}</span></p>
                    </div>
                  )}
                </div>
              </div>

              {/* Line items */}
              <div className="bg-[var(--bg-panel)] rounded-xl p-5 shadow-sm border border-[var(--border-subtle)]">
                <h3 className="text-sm font-semibold text-[var(--text-core)] mb-4 flex items-center gap-2"><Package className="w-4 h-4 text-indigo-500" /> {t.lineItems}</h3>
                <div className="space-y-4">
                  {items.map((it, idx) => (
                    <div key={it.id} className="group relative bg-[var(--bg-panel-inner)] rounded-xl p-4 border border-[var(--border-subtle)] transition-colors">
                      <div className="flex items-start gap-3">
                        <span className="text-xs font-bold text-[var(--text-mute)] mt-3 w-4 shrink-0">{idx + 1}.</span>
                        <div className="flex-1 grid grid-cols-12 gap-3">
                          <div className="col-span-12 sm:col-span-5 relative">
                            <div className="relative">
                              <input value={it.product} onChange={e => { setLine(it.id, 'product', e.target.value); setProductOpen(it.id); }}
                                onFocus={() => setProductOpen(it.id)}
                                placeholder={t.productName}
                                className="w-full px-3 py-2 border border-[var(--border-core)] bg-[var(--bg-panel)] text-[var(--text-core)] rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                              {productOpen === it.id && it.product.length >= 0 && (
                                <div className="absolute top-full left-0 mt-1 bg-[var(--bg-panel)] border border-[var(--border-core)] rounded-xl shadow-lg py-1.5 z-20 w-full max-h-48 overflow-y-auto">
                                  {PRODUCTS.filter(p => p.name.toLowerCase().includes(it.product.toLowerCase())).map(p => (
                                    <button key={p.name} onMouseDown={() => { setLine(it.id, 'product', p.name); setLine(it.id, 'unitPrice', p.price); setProductOpen(null); }}
                                      className="w-full flex items-center justify-between px-4 py-2 text-sm text-[var(--text-core)] hover:bg-[var(--bg-panel-inner)] transition-colors text-left font-medium">
                                      <span>{p.name}</span>
                                      <span className="text-[var(--text-sec)]">ETB {p.price}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            <input value={it.description} onChange={e => setLine(it.id, 'description', e.target.value)}
                              placeholder={t.descriptionOpt}
                              className="mt-2 w-full px-3 py-1.5 border border-[var(--border-core)] bg-[var(--bg-panel)] text-[var(--text-core)] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                          </div>
                          <div className="col-span-3 sm:col-span-2">
                            <label className="text-[11px] font-semibold text-[var(--text-mute)] uppercase tracking-wide block mb-1.5">{t.qty}</label>
                            <input type="number" min="1" value={it.qty} onChange={e => setLine(it.id, 'qty', +e.target.value)}
                              className="w-full px-3 py-2 border border-[var(--border-core)] bg-[var(--bg-panel)] text-[var(--text-core)] rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                          </div>
                          <div className="col-span-5 sm:col-span-3">
                            <label className="text-[11px] font-semibold text-[var(--text-mute)] uppercase tracking-wide block mb-1.5">{t.unitPrice}</label>
                            <input type="number" min="0" value={it.unitPrice} onChange={e => setLine(it.id, 'unitPrice', +e.target.value)}
                              className="w-full px-3 py-2 border border-[var(--border-core)] bg-[var(--bg-panel)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                          </div>
                          <div className="col-span-4 sm:col-span-2">
                            <label className="text-[11px] font-semibold text-[var(--text-mute)] uppercase tracking-wide block mb-1.5">{t.total}</label>
                            <div className="px-3 py-2 bg-indigo-500/10 rounded-lg text-sm font-semibold text-indigo-500 text-right h-[38px] flex items-center justify-end">
                              {(it.qty * it.unitPrice).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        {items.length > 1 && (
                          <button onClick={() => removeLine(it.id)} className="mt-2 p-1.5 text-[var(--text-mute)] hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors shrink-0">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={addLine} className="mt-4 w-full py-3 border-2 border-dashed border-[var(--border-core)] rounded-xl text-sm font-medium text-[var(--text-sec)] hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-500/5 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> {t.addLineItem}
                </button>
              </div>

              {/* Discount & Tax */}
              <div className="bg-[var(--bg-panel)] rounded-xl p-5 shadow-sm border border-[var(--border-subtle)]">
                <h3 className="text-sm font-semibold text-[var(--text-core)] mb-4 flex items-center gap-2"><Percent className="w-4 h-4 text-indigo-500" /> {t.discountsAndTax}</h3>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-sec)] mb-1.5">{t.globalDiscount}</label>
                    <input type="number" min="0" max="100" step="0.5" value={discountPct} onChange={e => setDiscountPct(+e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                    {discountPct > 0 && <p className="text-xs font-medium text-red-500 mt-2">- ETB {discountAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-sec)] mb-1.5">{t.vat}</label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setVatEnabled(v => !v)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${vatEnabled ? 'bg-indigo-500' : 'bg-[var(--border-core)]'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${vatEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      {vatEnabled && (
                        <input type="number" min="0" max="100" value={vatPct} onChange={e => setVatPct(+e.target.value)}
                          className="w-20 px-3.5 py-1.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                      )}
                      {vatEnabled && <span className="text-xs font-medium text-[var(--text-sec)]">{t.vatPct}</span>}
                    </div>
                  </div>
                </div>
                {/* Totals preview */}
                <div className="mt-5 bg-[var(--bg-panel-inner)] rounded-xl p-4 space-y-2 border border-[var(--border-subtle)] text-sm font-medium">
                  <div className="flex justify-between text-[var(--text-sec)]"><span>{t.subtotal}</span><span className="text-[var(--text-core)]">{fmt(subtotal)}</span></div>
                  {discountPct > 0 && <div className="flex justify-between text-red-500"><span>{t.discount} ({discountPct}%)</span><span>- {fmt(discountAmount)}</span></div>}
                  {vatEnabled && <div className="flex justify-between text-[var(--text-sec)]"><span>{t.vat} ({vatPct}%)</span><span className="text-[var(--text-core)]">{fmt(vatAmount)}</span></div>}
                  <div className="flex justify-between text-indigo-500 border-t border-[var(--border-subtle)] pt-2 mt-2 font-bold text-base"><span>{t.total}</span><span>{fmt(total)}</span></div>
                </div>
              </div>

              {/* Notes & Terms */}
              <div className="bg-[var(--bg-panel)] rounded-xl p-5 shadow-sm border border-[var(--border-subtle)]">
                <h3 className="text-sm font-semibold text-[var(--text-core)] mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-indigo-500" /> {t.notesAndTerms}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-sec)] mb-1.5">{t.notesVisible}</label>
                    <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-sec)] mb-1.5">{t.paymentTerms}</label>
                    <textarea rows={2} value={terms} onChange={e => setTerms(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Live preview */}
          <div className="hidden xl:flex flex-col w-[520px] 2xl:w-[600px] shrink-0 border-l border-[var(--border-core)] bg-[var(--bg-core)]">
            <div className="flex items-center justify-between px-6 py-4 bg-[var(--bg-panel)] border-b border-[var(--border-core)]">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-core)]">
                <Maximize2 className="w-4 h-4 text-indigo-500" />
                {t.livePreview}
              </div>
              <button onClick={() => setFullPreview(true)} className="text-xs font-medium text-indigo-500 hover:text-indigo-600 flex items-center gap-1.5 transition-colors">
                <Maximize2 className="w-3.5 h-3.5" /> {t.fullScreen}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-gray-900/20">
              <div className="shadow-2xl rounded-lg overflow-hidden transform origin-top transition-transform" style={{ transform: 'scale(0.85)', marginBottom: '-10%' }}>
                <InvoiceDocument inv={draftInv} language={language} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
