import React from "react";
import { LanguageOpt } from "../../types";

interface PlaceholderContentProps {
  activeTab: string;
  userEmail: string;
  selectedLanguage: LanguageOpt;
}

export default function PlaceholderContent({
  activeTab,
  userEmail,
  selectedLanguage,
}: PlaceholderContentProps) {
  const isAmharic = selectedLanguage.code === "am";
  const t = {
    welcomeTitle: isAmharic
      ? "ወደ ፊንትራክ ነጋዴ ዳሽቦርድ እንኳን በደህና መጡ!"
      : "Welcome to FinTrack ET Merchant Dashboard!",
    welcomeDesc: isAmharic
      ? "ዳሽቦርድዎ ለአሁኑ ባዶ ነው። የንግድዎን ሽያጭ፣ የቴሌብር ገቢዎችን፣ የእዳ መዛግብትን እና የባንክ ብድር ነጥብዎን ለማስተዳደር ከላይ ያሉትን አማራጮች ማሰስ ይችላሉ።"
      : "Your merchant interface is currently set up with an empty body as requested. Manage local revenue tracking, Telebirr records, real-time debt bookkeeping, and banking connector controls using the specialized header utilities.",
  };

  return (
    <div className="flex-grow max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-center text-center">
      <div className="max-w-xl space-y-6 select-none leading-relaxed p-8 rounded-2xl bg-[var(--bg-panel-inner)] border border-[var(--border-subtle)] shadow-inner transition-transform">
        <div className="w-16 h-16 rounded-full bg-[#0077C5]/10 text-[#0077C5] border border-[#0077C5]/20 flex items-center justify-center text-3xl mx-auto animate-bounce">
          
        </div>
        <div className="space-y-2">
          <h1 className="text-xl md:text-2xl font-black text-[var(--text-core)] tracking-tight">
            {activeTab} - {t.welcomeTitle}
          </h1>
          <p className="text-[var(--text-sec)] text-xs md:text-sm font-medium leading-relaxed font-sans">
            {t.welcomeDesc}
          </p>
        </div>
        <div className="border-t border-[var(--border-subtle)] pt-4 flex flex-wrap gap-2 justify-center text-[10px] font-mono text-[var(--text-mute)]">
          <span className="px-2 py-1 bg-[var(--bg-core)] rounded border border-[var(--border-subtle)]">
            User ID: {userEmail}
          </span>
          <span className="px-2 py-1 bg-[var(--bg-core)] rounded border border-[var(--border-subtle)]">
            Locale: {selectedLanguage.code}-ET
          </span>
          <span className="px-2 py-1 bg-[var(--bg-core)] rounded border border-[var(--border-subtle)] uppercase">
            Channel Status: Secure
          </span>
        </div>
      </div>
    </div>
  );
}
