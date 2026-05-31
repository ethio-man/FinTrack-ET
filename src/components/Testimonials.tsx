import React from "react";
import { LanguageOpt } from "../types";
import { TRANSLATIONS } from "../data/translations";

export default function Testimonials({ selectedLanguage }: { selectedLanguage: LanguageOpt }) {
  const t = TRANSLATIONS[selectedLanguage.code] || TRANSLATIONS.en;
  const test = t.testimonials;

  return (
    <div className="bg-[var(--bg-core)] py-24 text-[var(--text-core)] border-b border-[var(--border-core)] transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="font-mono text-xs text-[#0077C5] uppercase tracking-widest mb-3">{test.tag}</div>
          <h2 className="text-3xl lg:text-5xl font-black text-[var(--text-core)] tracking-tighter uppercase leading-[1.05]">
            {test.title}
          </h2>
          <p className="text-[var(--text-sec)] mt-4 text-sm font-medium">
            {test.subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {test.items.map((item: any, idx: number) => (
            <div
              key={idx}
              className="bg-[var(--bg-panel)] p-8 rounded-none border border-[var(--border-subtle)] flex flex-col justify-between h-full transition-all hover:border-[#0077C5]/30 duration-300"
            >
              {/* Star graphics */}
              <div className="mb-6">
                <div role="img" aria-label="5 stars" className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, sIdx) => (
                    <svg
                      key={sIdx}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-[#0077C5] fill-current"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <p className="text-[var(--text-sec)] text-sm leading-relaxed mb-8 flex-1 italic font-sans font-medium">
                "{item.quote}"
              </p>

              {/* Customer Author */}
              <div className="flex items-center gap-3 border-t border-[var(--border-core)] pt-4">
                <div className="w-10 h-10 rounded-none bg-white/5 border border-[var(--border-core)] flex items-center justify-center font-mono font-bold text-[var(--text-core)] text-xs">
                  {item.customer.split(" ").map((n: string) => n[0]).join("")}
                </div>
                <div>
                  <h4 className="font-bold text-[var(--text-core)] text-xs uppercase tracking-wider">{item.customer}</h4>
                  <p className="text-[10px] text-[#0077C5] font-mono tracking-widest uppercase">{item.business}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
