import React from "react";
import { LanguageOpt } from "../types";
import { TRANSLATIONS } from "../data/translations";

export default function Footer({ selectedLanguage }: { selectedLanguage: LanguageOpt }) {
  const t = TRANSLATIONS[selectedLanguage.code] || TRANSLATIONS.en;
  const f = t.footer;

  const cols = [
    {
      title: f.operatingTiers,
      links: [
        { text: f.starter, href: "#pricing-section" },
        { text: f.monthly, href: "#pricing-section" },
        { text: f.annual, href: "#pricing-section" }
      ]
    },
    {
      title: f.coreCapabilities,
      links: [
        { text: f.salesTrack, href: "#" },
        { text: f.customerDebt, href: "#" },
        { text: f.inventoryAlerts, href: "#" },
        { text: f.telebirrSync, href: "#" },
        { text: f.vatTotReports, href: "#" }
      ]
    },
    {
      title: f.lendingPartner,
      links: [
        { text: f.trustScore, href: "#" },
        { text: f.consentReporting, href: "#" },
        { text: f.scoreAnalytics, href: "#" }
      ]
    },
    {
      title: f.helpDesk,
      links: [
        { text: f.verifyScheme, href: "#" },
        { text: f.telebirrGuide, href: "#" },
        { text: f.cbeSettings, href: "#" },
        { text: f.exportGuide, href: "#" },
        { text: f.amharicSupport, href: "#" }
      ]
    }
  ];

  const toolsTitle = selectedLanguage.code === "am" ? "ለነጋዴዎች የሚሆኑ የሂሳብ መሳሪያዎች" : "MERCHANT HELP TOOLS";
  const toolsDesc = selectedLanguage.code === "am" 
    ? "ሽያጮችን ለመከታተልና የታክስ ተመኖችን ለማስላት የሚረዱ ነጻ ቀጥታ መገልገያዎች።" 
    : "Free templates and micro-tools to calculate fees, structure rosters, and track your daily sales.";

  const t1 = selectedLanguage.code === "am" ? "የቴሌብር አገልግሎት ክፍያ ማስያ" : "Telebirr Fee Calculator";
  const t2 = selectedLanguage.code === "am" ? "የሱቅ ወጪ ማቀጃ" : "Shop Expense Planner";
  const t3 = selectedLanguage.code === "am" ? "የዕለት ተዕለት የትርፍ መዝገብ" : "Daily Profit Ledger";
  const t4 = selectedLanguage.code === "am" ? "ነጻ የደረሰኝ ማውጫ" : "Free Receipt Generator";
  const t5 = selectedLanguage.code === "am" ? "የሰራተኞች የደመወዝ ክፍያ ወረቀት" : "Kiosk Employee Payslip";
  const t6 = selectedLanguage.code === "am" ? "የመዝገብ ማመሳሰያ ቅጾች" : "Cash drawer reconciling sheets";
  const t7 = selectedLanguage.code === "am" ? "የቫት (VAT) እና ቶት (TOT) መመሪያ" : "VAT & TOT Guide";
  const t8 = selectedLanguage.code === "am" ? "የሂሳብ ሚዛን መግለጫ" : "Balance Sheet Template";
  const t9 = selectedLanguage.code === "am" ? "ሊታተሙ የሚችሉ የዕዳ መዝገቦች" : "Printable Debt Ledgers";

  return (
    <footer role="contentinfo" data-testid="footer" data-tracking="footer" className="Footer_container__ee4db7bf bg-[var(--bg-panel-inner)] text-[var(--text-core)] pt-24 pb-12 border-t border-[var(--border-core)] transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Sitemap columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-16 border-b border-[var(--border-core)]">
          {cols.map((group, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="text-[var(--text-core)] font-mono text-xs uppercase tracking-widest font-black">
                // {group.title.toUpperCase()}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a
                      href={link.href}
                      className="text-[var(--text-sec)] hover:text-[#0077C5] text-[10px] font-mono uppercase tracking-wider transition-colors block"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Tools and Templates horizontal strip */}
        <div className="py-12 border-b border-[var(--border-core)] grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="space-y-2">
            <h4 className="text-[var(--text-core)] font-mono text-[10px] uppercase tracking-widest font-black">
              // {toolsTitle}
            </h4>
            <p className="text-[var(--text-mute)] text-[11px] leading-relaxed font-mono uppercase tracking-wide">
              {toolsDesc}
            </p>
          </div>
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <a href="#" className="text-xs text-[var(--text-sec)] hover:text-[#0077C5] transition-colors block font-mono text-[10px] uppercase tracking-wider">{t1}</a>
              <a href="#" className="text-xs text-[var(--text-sec)] hover:text-[#0077C5] transition-colors block font-mono text-[10px] uppercase tracking-wider">{t2}</a>
              <a href="#" className="text-xs text-[var(--text-sec)] hover:text-[#0077C5] transition-colors block font-mono text-[10px] uppercase tracking-wider">{t3}</a>
            </div>
            <div className="space-y-2">
              <a href="#" className="text-xs text-[var(--text-sec)] hover:text-[#0077C5] transition-colors block font-mono text-[10px] uppercase tracking-wider">{t4}</a>
              <a href="#" className="text-xs text-[var(--text-sec)] hover:text-[#0077C5] transition-colors block font-mono text-[10px] uppercase tracking-wider">{t5}</a>
              <a href="#" className="text-xs text-[var(--text-sec)] hover:text-[#0077C5] transition-colors block font-mono text-[10px] uppercase tracking-wider">{t6}</a>
            </div>
            <div className="space-y-2">
              <a href="#" className="text-xs text-[var(--text-sec)] hover:text-[#0077C5] transition-colors block font-mono text-[10px] uppercase tracking-wider">{t7}</a>
              <a href="#" className="text-xs text-[var(--text-sec)] hover:text-[#0077C5] transition-colors block font-mono text-[10px] uppercase tracking-wider">{t8}</a>
              <a href="#" className="text-xs text-[var(--text-sec)] hover:text-[#0077C5] transition-colors block font-mono text-[10px] uppercase tracking-wider">{t9}</a>
            </div>
          </div>
        </div>

        {/* Brands block & Social Links */}
        <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-base font-black tracking-tighter uppercase text-[var(--text-core)]">FINTRACK ET</span>
              <span className="text-[9px] font-mono tracking-widest text-[#0077C5] uppercase">
                {selectedLanguage.code === "am" ? "// ዲጂታል የንግድ ታማኝነት" : "// DIGITAL BUSINESS INTEGRITY"}
              </span>
            </div>
          </div>
        </div>

        {/* Legal & Compliance footer block */}
        <div className="pt-8 border-t border-[var(--border-core)] text-left flex flex-col lg:flex-row justify-between gap-8 text-[10px] text-[var(--text-sec)] font-mono">
          <div className="space-y-3 max-w-3xl">
            <p className="text-[var(--text-core)] opacity-85 font-mono">{f.copyright}</p>
            <p className="text-[var(--text-mute)] leading-relaxed uppercase">
              {f.disclaimer}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex gap-4">
              <span className="hover:underline text-[var(--text-sec)] hover:text-[#0077C5] cursor-pointer">
                {selectedLanguage.code === "am" ? "መርሆዎች" : "Terms"}
              </span>
              <span className="hover:underline text-[var(--text-sec)] hover:text-[#0077C5] cursor-pointer">
                {selectedLanguage.code === "am" ? "ምስጢራዊነት" : "Privacy Policy"}
              </span>
              <span className="hover:underline text-[var(--text-sec)] hover:text-[#0077C5] cursor-pointer">
                {selectedLanguage.code === "am" ? "የደህንነት ደረጃዎች" : "Security Standards"}
              </span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
