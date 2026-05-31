import React, { useState } from "react";
import { PRICING_PLANS } from "../data/pricingPlans";
import { LanguageOpt } from "../types";
import { TRANSLATIONS } from "../data/translations";

interface PricingCardsProps {
  onSelectPlan: (planName: string) => void;
  currencyCode?: string;
  currencySymbol?: string;
  selectedLanguage: LanguageOpt;
}

export default function PricingCards({
  onSelectPlan,
  currencyCode = "ETB",
  currencySymbol = "ETB",
  selectedLanguage
}: PricingCardsProps) {
  // Mobile features list show/hide states map (indexed by plan ID)
  const [expandedPlan, setExpandedPlan] = useState<Record<string, boolean>>({
    starter: true,
    monthly: true,
    annual: true
  });

  const toggleExpand = (planId: string) => {
    setExpandedPlan((prev) => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  const t = TRANSLATIONS[selectedLanguage.code] || TRANSLATIONS.en;
  const p = t.pricing;

  return (
    <div className="bg-[var(--bg-core)] py-24 text-[var(--text-core)] border-b border-[var(--border-core)] transition-colors" id="pricing-section">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="font-mono text-xs text-[#0077C5] uppercase tracking-widest mb-3">// {p.tag}</div>
          <h2 className="text-3xl lg:text-5xl font-black text-[var(--text-core)] tracking-tighter uppercase leading-[1.05]">
            {p.title}
          </h2>
          <p className="text-[var(--text-sec)] mt-4 text-sm font-medium">
            {p.subtitle}
          </p>
        </div>

        {/* Outer Container properties */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-none p-6 lg:p-12 max-w-6xl mx-auto transition-colors">
          {/* Currency Display Notice */}
          <div className="text-center py-2.5 px-6 bg-white/5 text-[#0077C5] text-[10px] font-mono tracking-widest uppercase rounded-none mb-10 max-w-lg mx-auto border border-[var(--border-core)]">
            {p.notice}
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {PRICING_PLANS.map((plan) => {
              const showList = expandedPlan[plan.id];
              const transPlan = p.plans && p.plans[plan.id];
              const nameToShow = transPlan ? transPlan.name : plan.name;
              const featuresToShow = transPlan ? transPlan.features : plan.features;

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col justify-between p-6 rounded-none border bg-black/40 transition-all duration-300 group hover:border-white/20 ${
                    plan.isPopular
                      ? "border-[#0077C5]/60 ring-1 ring-[#0077C5]/20"
                      : "border-[var(--border-core)]"
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-[#0077C5] text-white text-[9px] font-mono font-black px-3.5 py-1 rounded-none uppercase tracking-widest border border-[var(--bg-core)] leading-none">
                      {p.popularBadge || "Best Value"}
                    </div>
                  )}

                  {/* Plan Identification */}
                  <div className="space-y-4">
                    <div className="text-sm font-bold tracking-widest text-[var(--text-core)] uppercase font-mono">{nameToShow}</div>
                    <div className="border-t border-[var(--border-core)] my-2" />

                    {/* Price Block */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono text-[var(--text-mute)] line-through tracking-wider">
                        {currencySymbol} {plan.basePrice.toLocaleString()}
                      </div>
                      <div className="flex items-baseline gap-1 text-[var(--text-core)]">
                        <span className="text-[11px] font-mono text-[var(--text-sec)] uppercase">{currencySymbol}</span>
                        <span className="text-3xl font-black tracking-tight font-sans">
                          {Math.floor(plan.discountPrice).toLocaleString()}
                        </span>
                        <span className="text-[11px] font-mono text-[var(--text-sec)]">{p.monthlyLabel || "/mo"}</span>
                      </div>
                      {plan.savedAmount > 0 && (
                        <div className="text-[10px] font-mono text-[#0077C5] bg-[#0077C5]/10 border border-[#0077C5]/20 px-2 py-1 rounded-none inline-block mt-2 tracking-wide font-semibold">
                          {p.saveText || "Save"} {currencySymbol} {plan.savedAmount.toLocaleString()}{p.monthlyLabel || "/mo"}
                        </div>
                      )}
                    </div>

                    {/* Selector & Trial button */}
                    <div className="pt-4 space-y-2">
                      <button
                        onClick={() => onSelectPlan(nameToShow)}
                        className="w-full py-3.5 text-xs font-bold uppercase tracking-widest text-white bg-[#0077C5] hover:bg-[var(--text-core)] hover:text-[var(--bg-core)] transition-all cursor-pointer rounded-none border border-[#0077C5] hover:border-[var(--text-core)]"
                      >
                        {plan.discountPrice === 0 ? (p.buttonFree || "Get Started Free") : (p.buttonSelect || "Select Plan")}
                      </button>
                    </div>

                    {/* Show/Hide details button for mobile */}
                    <button
                      onClick={() => toggleExpand(plan.id)}
                      className="flex lg:hidden w-full items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[var(--text-sec)] border-t border-b border-dashed border-[var(--border-core)] py-2.5 mt-4"
                    >
                      <span>{showList ? (selectedLanguage.code === "am" ? "ዝርዝሮችን ደብቅ" : "Hide Details") : (selectedLanguage.code === "am" ? "ዝርዝሮችን አሳይ" : "View Details")}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 14 7.71"
                        className={`w-3 h-3 text-[#0077C5] transition-transform ${showList ? "rotate-180" : ""}`}
                      >
                        <path fill="currentColor" d="M12.8.21L7 6 1.21.21a.7.7 0 00-1 0 .7.7 0 000 1L6.5 7.5a.7.7 0 001 0l6.29-6.29a.7.7 0 000-1 .69.69 0 00-.99 0z"></path>
                      </svg>
                    </button>

                    {/* Features list */}
                    {showList && (
                      <ul className="space-y-3 pt-5 border-t lg:border-t-0 border-[var(--border-core)] text-xs font-medium">
                        {featuresToShow.map((feature: string, fIdx: number) => (
                          <li key={fIdx} className="flex items-start gap-2 text-[var(--text-sec)] hover:text-[var(--text-core)] transition-colors">
                            <svg
                              width="12"
                              height="8"
                              viewBox="0 0 12 8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="mt-1 flex-shrink-0"
                            >
                              <path
                                id="Vector"
                                d="M10.3637 1L4.36375 7L1.63647 4.27273"
                                stroke="#0077C5"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                            </svg>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
