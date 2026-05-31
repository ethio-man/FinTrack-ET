import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import PreferencesSidebar from "./components/PreferencesSidebar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Invoicing from "./components/Invoicing";
import Testimonials from "./components/Testimonials";
import PricingCards from "./components/PricingCards";
import FAQAccordion from "./components/FAQAccordion";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import DashboardHome from "./components/DashboardHome";
import { CountryOpt, LanguageOpt } from "./types";
import { COUNTRIES, LANGUAGES } from "./data/countries";

export default function App() {
  // Global States for preferences, starts with high-fidelity defaults matching the user's initial state
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalInitialView, setLoginModalInitialView] = useState<"signin" | "signup">("signin");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleOpenLogin = (view: "signin" | "signup" = "signin") => {
    setLoginModalInitialView(view);
    setLoginModalOpen(true);
  };

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
  };

  // Sync state with HTML class for utility CSS variables
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
    }
  }, [isDarkMode]);
  const [selectedCountry, setSelectedCountry] = useState<CountryOpt>(
    COUNTRIES.find((c) => c.code === "ET") || {
      code: "ET",
      name: "Ethiopia",
      flag: "🇪🇹",
      redirect: "global",
      currency: "ETB"
    }
  );
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOpt>(
    LANGUAGES.find((l) => l.code === "en") || { code: "en", name: "English" }
  );

  // Modal / Toast Notification for Plan selection feedback
  const [notification, setNotification] = useState<string | null>(null);

  const handleSelectPlan = (planName: string) => {
    const isFree = planName.toLowerCase().includes("free") || planName.toLowerCase().includes("starter") || planName.includes("በነጻ");
    if (isFree) {
      handleOpenLogin("signup");
      return;
    }

    const isAmharic = selectedLanguage.code === "am";
    if (isAmharic) {
      setNotification(
        `እቅዱን መርጠዋል: ${planName}! በአምራችነት አካባቢ፣ ይህ በኢትዮጵያ የሀገር ውስጥ ዲጂታል የኪስ ቦርሳ እና ባንኮች (ቴሌብር፣ ሲቢኢ ብር) ላይ የተመሰረተውን መተግበሪያ በመክፈት ክፍያዎችን በቀጥታ በብር እንዲፈጽሙ ያስችልዎታል። የተመረጠው ምርጫ: ${selectedLanguage.code}-${selectedCountry.code} ነው።`
      );
    } else {
      setNotification(
        `You selected the ${planName} plan! In production, this redirects to the payment activation portal tailored for Ethiopia's digital wallet & banking networks (Telebirr, CBE Birr) and configured for locale: ${selectedLanguage.code}-${selectedCountry.code}.`
      );
    }
  };

  return isLoggedIn ? (
    <DashboardHome
      userEmail={userEmail}
      selectedLanguage={selectedLanguage}
      onSelectLanguage={setSelectedLanguage}
      isDarkMode={isDarkMode}
      onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      onLogout={handleLogout}
    />
  ) : (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col justify-between overflow-x-hidden" id="main">
      


      {/* 2. NAVIGATION BAR */}
      <Navbar
        onOpenPreferences={() => setPreferencesOpen(true)}
        selectedCountry={selectedCountry}
        selectedLanguage={selectedLanguage}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenLogin={() => handleOpenLogin("signin")}
      />

      {/* 3. BREADCRUMBS STRIP */}
      <div className="breadcrumbs show bg-[var(--bg-panel-inner)] border-b border-[var(--border-subtle)] py-3 text-xs text-[var(--text-sec)] transition-colors">
        <div className="breadcrumbs__wrapper max-w-7xl mx-auto px-6 flex items-center gap-1.5">
          <a href="#" className="hover:underline opacity-80 hover:opacity-100">
            {selectedLanguage.code === "am" ? "መነሻ" : "Home"}
          </a>
          <span className="opacity-40 font-bold">&gt;</span>
          <span className="text-[var(--text-core)] font-semibold">
            {selectedLanguage.code === "am" ? "የንግድ ስራ ማሻሻያ ሶፍትዌር" : "Business Intelligence Software"} ({selectedCountry.name})
          </span>
        </div>
      </div>

      {/* 4. MAIN LANDING HERO */}
      <Hero 
        selectedLanguage={selectedLanguage} 
        onOpenLogin={handleOpenLogin}
      />

      {/* 5. ACCOUNTING FEATURES */}
      <Features selectedLanguage={selectedLanguage} />

      {/* 6. INVOICING CARDS */}
      <Invoicing selectedLanguage={selectedLanguage} />

      {/* 7. CUSTOMER TESTIMONIALS */}
      <Testimonials selectedLanguage={selectedLanguage} />

      {/* 8. PLANS AND PRICING CARDS */}
      <PricingCards
        onSelectPlan={handleSelectPlan}
        currencyCode={selectedCountry.currency || "ETB"}
        currencySymbol={selectedCountry.currency || "ETB"}
        selectedLanguage={selectedLanguage}
      />

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <FAQAccordion selectedLanguage={selectedLanguage} />

      {/* 10. LOWER PROMO GREEN BANNER */}
      <div className="w-full bg-[#66B2FF] py-12 px-6 text-center select-none" id="rw-green-banner">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#0d333f] leading-tight">
            {selectedLanguage.code === "am"
              ? "ፊንትራክ ኢቲ ለንግድዎ እንዴት ሊረዳዎት እንደሚችል ይመልከቱ"
              : "See how FinTrack ET can work for your business"}
          </h2>
          <div>
            <a
              href="#pricing-section"
              className="inline-block py-3.5 px-8 font-bold bg-[#0d333f] text-white rounded-lg hover:bg-white hover:text-[#0d333f] transition-all cursor-pointer shadow-md text-sm border-2 border-[#0d333f]"
            >
              {selectedLanguage.code === "am" ? "እቅዶችንና ዋጋዎችን ይመልከቱ" : "See plans & pricing"}
            </a>
          </div>
        </div>
      </div>

      {/* 11. SITEMAP FOOTER */}
      <Footer selectedLanguage={selectedLanguage} />

      {/* 12. FLOATING PREFERENCES SIDEBAR (MODAL FORMAT) */}
      <PreferencesSidebar
        isOpen={preferencesOpen}
        onClose={() => setPreferencesOpen(false)}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />

      {/* Elegant Customized Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        selectedLanguage={selectedLanguage}
        initialView={loginModalInitialView}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Elegant Checkout Feedback Modal */}
      {notification && (
        <div className="fixed inset-0 bg-black/75 z-[99999] flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-[var(--bg-panel)] rounded-none p-8 max-w-md w-full shadow-2xl space-y-6 border border-[var(--border-core)] relative text-[var(--text-core)]">
            <button
              onClick={() => setNotification(null)}
              className="absolute top-4 right-4 text-[var(--text-mute)] hover:text-[var(--text-core)] font-bold transition-all text-sm font-mono"
            >
              ✕
            </button>
            <div className="w-12 h-12 bg-[#0077C5]/10 text-[#0077C5] border border-[#0077C5]/20 rounded-full flex items-center justify-center font-bold text-xl mx-auto">
              ✓
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-base font-black uppercase tracking-wider text-[var(--text-core)]">
                {selectedLanguage.code === "am" ? "ወደ ክፍያ መሸጋገሪያ" : "Checkout Redirection"}
              </h3>
              <p className="text-[var(--text-sec)] text-xs leading-relaxed font-sans">{notification}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="w-full py-3 bg-[#0077C5] text-white text-xs font-mono font-black uppercase tracking-widest hover:bg-[var(--text-core)] hover:text-[var(--bg-core)] transition-all cursor-pointer rounded-none"
            >
              {selectedLanguage.code === "am" ? "ተረድቻለሁ ፣ ዝጋ" : "Understand & Close"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
