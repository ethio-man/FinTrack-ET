import React, { useState } from "react";
import { LanguageOpt } from "../types";
import { TRANSLATIONS } from "../data/translations";

export default function FAQAccordion({ selectedLanguage }: { selectedLanguage: LanguageOpt }) {
  const [openId, setOpenId] = useState<number | null>(0);

  const t = TRANSLATIONS[selectedLanguage.code] || TRANSLATIONS.en;
  const f = t.faqs;

  const toggleFAQ = (index: number) => {
    setOpenId(openId === index ? null : index);
  };

  return (
    <div
      data-testid="RwAccordion"
      data-tracking="accordion"
      className="RwAccordion_accordion__88285ba2 py-24 bg-[var(--bg-core)] border-b border-[var(--border-core)] transition-colors"
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="font-mono text-xs text-[#0077C5] uppercase tracking-widest mb-3">// {f.tag}</div>
          <h3 className="text-3xl lg:text-5xl font-black text-[var(--text-core)] tracking-tighter uppercase leading-[1.05]">
            {f.title}
          </h3>
          <p className="text-[var(--text-sec)] mt-4 text-sm font-medium">
            {f.subtitle}
          </p>
        </div>

        <div data-testid="accordion" className="Accordion_accordion__789fe71b space-y-2">
          {f.items.map((faq: any, index: number) => {
            const isOpen = openId === index;

            return (
              <div
                key={index}
                className="border-b border-[var(--border-core)]"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center py-6 text-left text-sm md:text-base font-bold text-[var(--text-core)] hover:text-[#0077C5] transition-colors focus:outline-none uppercase tracking-wide font-sans cursor-pointer group"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span className={`ml-4 transform transition-transform duration-200 text-[#0077C5] font-bold ${isOpen ? "rotate-180" : ""}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 14 7.71"
                      className="w-4 h-4 fill-current"
                    >
                      <path d="M12.8.21L7 6 1.21.21a.7.7 0 00-1 0 .7.7 0 000 1L6.5 7.5a.7.7 0 001 0l6.29-6.29a.7.7 0 000-1 .69.69 0 00-.99 0z"></path>
                    </svg>
                  </span>
                </button>

                {/* Answer transition */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96 opacity-100 mb-6" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-[var(--text-sec)] text-xs sm:text-sm leading-relaxed pl-1 font-medium font-sans">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
