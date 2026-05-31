import React from "react";
import { LanguageOpt } from "../types";
import { TRANSLATIONS } from "../data/translations";

export default function Features({ selectedLanguage }: { selectedLanguage: LanguageOpt }) {
  const t = TRANSLATIONS[selectedLanguage.code] || TRANSLATIONS.en;
  const f = t.features;

  return (
    <div className="bg-[var(--bg-core)] py-24 text-[var(--text-core)] border-b border-[var(--border-core)] transition-colors">
      <div className="max-w-7xl mx-auto px-6 space-y-32">
        
        {/* Feature 1: Income and Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="font-mono text-xs text-[#0077C5] uppercase tracking-widest">{f.tracking.tag}</div>
            <h2 className="text-3xl lg:text-5xl font-black text-[var(--text-core)] tracking-tighter uppercase leading-[1.05]">
              {f.tracking.title}
            </h2>
            <div className="space-y-4 text-[var(--text-sec)] leading-relaxed text-sm lg:text-base font-medium font-sans">
              <p>
                {f.tracking.desc1}
              </p>
              <p>
                {f.tracking.desc2}
              </p>
            </div>
          </div>
          <div className="lg:col-span-6 flex justify-center">
            <div className="bg-[var(--bg-panel)] p-1.5 border border-[var(--border-core)] shadow-2xl rounded-none w-full max-w-lg transition-colors">
              <img
                src="../../assets/public/feature.jpg"
                alt="Ethiopian merchant registering transaction metrics on mobile interface"
                className="w-full h-auto object-cover opacity-90 rounded-none filter brightness-95"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Feature 2: Real-time inventory (with Dark styled backdrop panel) */}
        <div className="p-8 lg:p-16 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-none grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative overflow-hidden transition-colors">
          <div className="absolute right-0 top-0 text-[120px] leading-none select-none opacity-[0.03] text-[var(--text-core)] font-black tracking-tighter uppercase font-sans select-none pointer-events-none transform translate-x-12 -translate-y-12">
            STOCK
          </div>
          <div className="lg:col-span-6 lg:order-2 space-y-6">
            <div className="font-mono text-xs text-[#0077C5] uppercase tracking-widest">{f.inventory.tag}</div>
            <h2 className="text-3xl lg:text-5xl font-black text-[var(--text-core)] tracking-tighter uppercase leading-[1.05]">
              {f.inventory.title}
            </h2>
            <div className="space-y-4 text-[var(--text-sec)] leading-relaxed text-sm lg:text-base font-medium font-sans">
              <p>
                {f.inventory.desc1}
              </p>
              <p>
                {f.inventory.desc2}
              </p>
            </div>
          </div>
          <div className="lg:col-span-6 lg:order-1 flex justify-center">
            <div className="bg-[var(--bg-core)] p-1.5 border border-[var(--border-core)] shadow-2xl rounded-none w-full max-w-lg transition-colors">
              <img
                src="../../assets/public/tracking.png"
                alt="Low stock warning signs and levels dashboard illustration"
                className="w-full h-auto object-cover opacity-95 rounded-none filter brightness-95"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Feature 3: Connect with apps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="font-mono text-xs text-[#0077C5] uppercase tracking-widest">{f.ecosystem.tag}</div>
            <h2 className="text-3xl lg:text-5xl font-black text-[var(--text-core)] tracking-tighter uppercase leading-[1.05]">
              {f.ecosystem.title}
            </h2>
            <div className="space-y-4 text-[var(--text-sec)] leading-relaxed text-sm lg:text-base font-medium font-sans">
              <p>
                {f.ecosystem.desc1}
              </p>
              <p>
                {f.ecosystem.desc2}
              </p>
            </div>
          </div>
          <div className="lg:col-span-6 flex justify-center">
            <div className="bg-[var(--bg-panel)] p-1.5 border border-[var(--border-core)] shadow-2xl rounded-none w-full max-w-lg transition-colors">
              <img
                src="../../assets/public/payment.png"
                alt="Telebirr and payment gateways syncing with merchant financial books illustration"
                className="w-full h-auto object-cover opacity-90 rounded-none filter brightness-95"
                loading="lazy"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
