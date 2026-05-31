import React from "react";
import { LanguageOpt } from "../types";
import { TRANSLATIONS } from "../data/translations";

export default function Invoicing({ selectedLanguage }: { selectedLanguage: LanguageOpt }) {
  const t = TRANSLATIONS[selectedLanguage.code] || TRANSLATIONS.en;
  const inv = t.invoicing;

  return (
    <div className="bg-[var(--bg-core)] py-24 text-[var(--text-core)] border-b border-[var(--border-core)] transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="font-mono text-xs text-[#0077C5] uppercase tracking-widest mb-3">{inv.tag}</div>
          <h2 className="text-3xl lg:text-5xl font-black text-[var(--text-core)] tracking-tighter uppercase leading-[1.05]">
            {inv.title}
          </h2>
          <p className="text-[var(--text-sec)] mt-4 text-sm font-medium">
            {inv.subtitle}
          </p>
        </div>

        {/* 3-Column Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-[var(--bg-panel)] p-8 rounded-none border border-[var(--border-subtle)] flex flex-col items-center text-center space-y-6 hover:border-[#0077C5]/30 transition-all duration-300">
            <div className="w-24 h-24 flex items-center justify-center bg-[#0077C5]/10 border border-[#0077C5]/20 rounded-full transition-transform duration-300 group-hover:scale-110">
              <img
                src="https://quickbooks.intuit.com/oidam/intuit/sbseg/en_row/quickbooks/web/image/other/sbseg-en_row-send-custom-invoices-from-anywhere-anytime.svg"
                alt="Direct custom instant invoice sender icon"
                className="w-14 h-14 transition-all duration-300"
                style={{ filter: "var(--filter-invert)" }}
              />
            </div>
            <h3 className="text-base font-bold text-[var(--text-core)] uppercase tracking-wider">
              {inv.card1Title}
            </h3>
            <p className="text-[var(--text-sec)] text-xs leading-relaxed font-medium">
              {inv.card1Desc}
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[var(--bg-panel)] p-8 rounded-none border border-[var(--border-subtle)] flex flex-col items-center text-center space-y-6 hover:border-[#0077C5]/30 transition-all duration-300">
            <div className="w-24 h-24 flex items-center justify-center bg-[#0077C5]/10 border border-[#0077C5]/20 rounded-full transition-transform duration-300 group-hover:scale-110">
              <img
                src="https://quickbooks.intuit.com/oidam/intuit/sbseg/en_row/quickbooks/web/image/other/sbseg-en_row-estimate-convert-to-invoice-feature-qbo-us.svg"
                alt="Automatic conversion reminder icon"
                className="w-14 h-14 transition-all duration-300"
                style={{ filter: "var(--filter-invert)" }}
              />
            </div>
            <h3 className="text-base font-bold text-[var(--text-core)] uppercase tracking-wider">
              {inv.card2Title}
            </h3>
            <p className="text-[var(--text-sec)] text-xs leading-relaxed font-medium">
              {inv.card2Desc}
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[var(--bg-panel)] p-8 rounded-none border border-[var(--border-subtle)] flex flex-col items-center text-center space-y-6 hover:border-[#0077C5]/30 transition-all duration-300">
            <div className="w-24 h-24 flex items-center justify-center bg-[#0077C5]/10 border border-[#0077C5]/20 rounded-full transition-transform duration-300 group-hover:scale-110">
              <img
                src="https://quickbooks.intuit.com/oidam/intuit/sbseg/en_row/quickbooks/web/image/other/sbseg-recurring-invoice-feature-qbo-advanced-us.svg"
                alt="Recurring invoice scheduler icon"
                className="w-14 h-14 transition-all duration-300"
                style={{ filter: "var(--filter-invert)" }}
                onError={(e) => {
                  e.currentTarget.src = "https://quickbooks.intuit.com/oidam/intuit/sbseg/en_row/quickbooks/web/image/other/sbseg-en_row-recurring-invoice-feature-qbo-advanced-us.svg";
                }}
              />
            </div>
            <h3 className="text-base font-bold text-[var(--text-core)] uppercase tracking-wider">
              {inv.card3Title}
            </h3>
            <p className="text-[var(--text-sec)] text-xs leading-relaxed font-medium">
              {inv.card3Desc}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
