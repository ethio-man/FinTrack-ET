import React, { useState, useEffect, useRef } from "react";
import { CountryOpt, LanguageOpt } from "../types";
import { TRANSLATIONS } from "../data/translations";

interface NavbarProps {
  onOpenPreferences: () => void;
  selectedCountry: CountryOpt;
  selectedLanguage: LanguageOpt;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenLogin: () => void;
}

export default function Navbar({
  onOpenPreferences,
  selectedCountry,
  selectedLanguage,
  isDarkMode,
  onToggleDarkMode,
  onOpenLogin
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [loginDropOpen, setLoginDropOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[selectedLanguage.code] || TRANSLATIONS.en;

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveSection(null);
        setLoginDropOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
    setActiveSection(null);
    setLoginDropOpen(false);
  };

  // Determine active classes for the nav container
  const navClasses = [
    "RwGlobalNav",
    mobileMenuOpen ? "RwGlobalNav_open_mobileView" : "",
    activeSection ? "RwGlobalNav_open RwGlobalNav_sectionOpen" : "",
    "!bg-[var(--bg-core)] text-[var(--text-core)] border-b border-[var(--border-core)] transition-colors"
  ].filter(Boolean).join(" ");

  return (
    <div ref={navRef}>
      <nav
        data-tracking="global_nav"
        role="navigation"
        aria-label="Main Navigation"
        className={navClasses}
      >
        <div className="RwGlobalNav_topWrapper !bg-[var(--bg-core)] transition-colors">
          <div className="RwGlobalNav_top" role="menubar" aria-label="Menu bar">
            
            {/* Header branding logo section */}
            <div className="RwGlobalNav_iconHeader">
              <a
                className="RwGlobalNav_logoIcon flex items-center py-2"
                data-tracking="logo_icon"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection(null);
                }}
              >
                <div className="flex items-center gap-2 cursor-pointer border border-[#0077C5]/20 dark:border-white/25 rounded-md px-3 py-1.5 bg-white select-none transition-all duration-300 hover:shadow-md" data-testid="RwBrand">
                  {/* FinTrack ET circular light blue and white vector logo */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36" className="w-8 h-8 flex-shrink-0 animate-pulse">
                    <path fill="#0077C5" d="M18 36c9.9411 0 18-8.0589 18-18 0-9.94114-8.0589-18-18-18C8.05886 0 0 8.05886 0 18c0 9.9411 8.05886 18 18 18Z" />
                    <path fill="white" d="M23 11H13a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V13a2 2 0 00-2-2zm-1 8h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z" />
                  </svg>
                  <div className="flex flex-col text-left leading-none font-sans">
                    <span className="text-[9px] font-black tracking-[0.16em] text-[#0077C5] uppercase">FINTRACK</span>
                    <span className="text-sm font-bold text-[#111111] tracking-tight mt-0.5 leading-none">et</span>
                  </div>
                </div>
              </a>

              {/* Mobile hamburger navigation triggers */}
              <button
                className={`RwNavButton RwGlobalNav_toggleMenu ${mobileMenuOpen ? "hidden" : "open"}`}
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open Mobile Menu"
              >
                <svg width="37" height="28" viewBox="0 0 37 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="37" height="4" rx="2" fill="#0077C5"></rect>
                  <rect y="12" width="37" height="4" rx="2" fill="#0077C5"></rect>
                  <rect x="9" y="24" width="28" height="4" rx="2" fill="#0077C5"></rect>
                </svg>
              </button>
              
              <button
                className={`RwNavButton RwGlobalNav_toggleMenu ${mobileMenuOpen ? "close" : "hidden"}`}
                onClick={handleMobileMenuClose}
                aria-label="Close Mobile Menu"
              >
                <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect y="20.7383" width="27.9163" height="3.01798" rx="1.50899" transform="rotate(-45 0 20.7383)" fill="#0077C5"></rect>
                  <rect x="2.26562" y="1.12109" width="27.9163" height="3.01798" rx="1.50899" transform="rotate(45 2.26562 1.12109)" fill="#0077C5"></rect>
                </svg>
              </button>
            </div>

            {/* Nav tabs (desktop layout & mobile drawer listing) */}
            <div className={`RwGlobalNav_sectionHeader ${mobileMenuOpen ? "flex" : ""}`}>
              {/* For Business Nav Dropdown */}
              <div className={`RwGlobalNav_navTab ${activeSection === "business" ? "active-tab" : ""}`}>
                <button
                  type="button"
                  className="RwGlobalNav_mainLink font-sans font-semibold hover:!text-[#0077C5] !text-[var(--text-sec)] transition-colors uppercase tracking-widest text-[11px] flex items-center gap-1 cursor-pointer"
                  onClick={() => toggleSection("business")}
                >
                  <span className="RwGlobalNav_label">{selectedLanguage.code === "am" ? "ባህሪያት" : "For Business"}</span>
                  <div className="MenuItem_dDropdown">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 7.71" className={`MenuItem_dDown transition-transform ${activeSection === "business" ? "rotate-180" : ""}`}>
                      <path fill="currentColor" d="M12.8.21L7 6 1.21.21a.7.7 0 00-1 0 .7.7 0 000 1L6.5 7.5a.7.7 0 001 0l6.29-6.29a.7.7 0 000-1 .69.69 0 00-.99 0z"></path>
                    </svg>
                  </div>
                </button>
                {/* Mobile list return helper */}
                <button
                  type="button"
                  className="RwNavButton RwGlobalNav_return"
                  onClick={() => toggleSection("business")}
                >
                  <span className="RwGlobalNav_label">{selectedLanguage.code === "am" ? "ባህሪያት" : "For Business"}</span>
                  <svg width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 2L2.41421 8.58579C1.63316 9.36684 1.63316 10.6332 2.41421 11.4142L9 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </button>
              </div>

              {/* Accountants Dropdown */}
              <div className={`RwGlobalNav_navTab ${activeSection === "accountants" ? "active-tab" : ""}`}>
                <button
                  type="button"
                  className="RwGlobalNav_mainLink font-sans font-semibold hover:!text-[#0077C5] !text-[var(--text-sec)] transition-colors uppercase tracking-widest text-[11px] flex items-center gap-1 cursor-pointer"
                  onClick={() => toggleSection("accountants")}
                >
                  <span className="RwGlobalNav_label">{selectedLanguage.code === "am" ? "አካውንታንቶች" : "Accountants"}</span>
                  <div className="MenuItem_dDropdown">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 7.71" className={`MenuItem_dDown transition-transform ${activeSection === "accountants" ? "rotate-180" : ""}`}>
                      <path fill="currentColor" d="M12.8.21L7 6 1.21.21a.7.7 0 00-1 0 .7.7 0 000 1L6.5 7.5a.7.7 0 001 0l6.29-6.29a.7.7 0 000-1 .69.69 0 00-.99 0z"></path>
                    </svg>
                  </div>
                </button>
                {/* Mobile list return helper */}
                <button
                  type="button"
                  className="RwNavButton RwGlobalNav_return"
                  onClick={() => toggleSection("accountants")}
                >
                  <span className="RwGlobalNav_label">{selectedLanguage.code === "am" ? "አካውንታንቶች" : "Accountants"}</span>
                  <svg width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 2L2.41421 8.58579C1.63316 9.36684 1.63316 10.6332 2.41421 11.4142L9 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </button>
              </div>

              {/* Pricing Single Link */}
              <div className="RwGlobalNav_navTab">
                <a
                  className="RwGlobalNav_mainLink font-sans font-semibold hover:!text-[#0077C5] !text-[var(--text-sec)] transition-colors uppercase tracking-widest text-[11px] cursor-pointer"
                  href="#pricing-section"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="RwGlobalNav_label">{t.navbar.pricing}</span>
                </a>
                <a
                  className="RwNavButton RwGlobalNav_return"
                  href="#pricing-section"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="RwGlobalNav_label">{t.navbar.pricing}</span>
                </a>
              </div>

              {/* Learn & Support Dropdown */}
              <div className={`RwGlobalNav_navTab ${activeSection === "support" ? "active-tab" : ""}`}>
                <button
                  type="button"
                  className="RwGlobalNav_mainLink font-sans font-semibold hover:!text-[#0077C5] !text-[var(--text-sec)] transition-colors uppercase tracking-widest text-[11px] flex items-center gap-1 cursor-pointer"
                  onClick={() => toggleSection("support")}
                >
                  <span className="RwGlobalNav_label">{selectedLanguage.code === "am" ? "ትምህርትና እገዛ" : "Learn & Support"}</span>
                  <div className="MenuItem_dDropdown">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 7.71" className={`MenuItem_dDown transition-transform ${activeSection === "support" ? "rotate-180" : ""}`}>
                      <path fill="currentColor" d="M12.8.21L7 6 1.21.21a.7.7 0 00-1 0 .7.7 0 000 1L6.5 7.5a.7.7 0 001 0l6.29-6.29a.7.7 0 000-1 .69.69 0 00-.99 0z"></path>
                    </svg>
                  </div>
                </button>
                {/* Mobile list return helper */}
                <button
                  type="button"
                  className="RwNavButton RwGlobalNav_return"
                  onClick={() => toggleSection("support")}
                >
                  <span className="RwGlobalNav_label">{selectedLanguage.code === "am" ? "ትምህርትና እገዛ" : "Learn & Support"}</span>
                  <svg width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 2L2.41421 8.58579C1.63316 9.36684 1.63316 10.6332 2.41421 11.4142L9 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Dark Mode Icon Toggle */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="relative p-2 bg-transparent hover:bg-white/5 border border-transparent hover:border-[var(--border-core)] text-[#0077C5] hover:text-[var(--text-core)] transition-all duration-300 font-mono flex items-center w-10 h-10 justify-center group cursor-pointer"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="M4.93 4.93l1.41 1.41" />
                    <path d="M17.66 17.66l1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="M6.34 17.66l-1.41 1.41" />
                    <path d="M19.07 4.93l-1.41 1.41" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                )}
              </button>
            </div>

            {/* SEARCH BUTTON LEFT TO LANGUAGE SWITCH */}
            <div className="flex items-center ml-auto mr-3">
              <div
                className="css-1j49n3m flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-transparent hover:bg-black/5 border border-transparent hover:border-[var(--border-core)] text-xs text-[var(--text-sec)] transition-all font-sans group max-w-[170px]"
              >
                <div className="flex items-center gap-1.5 text-[var(--text-sec)] transition-colors w-full">
                  <svg className="MuiSvgIcon-root MuiSvgIcon-colorPrimary MuiSvgIcon-fontSizeMedium css-lvel2e w-4 h-4 text-[#0077C5] hover:rotate-6 transition-transform flex-shrink-0" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14" fill="currentColor"></path>
                  </svg>
                  <input
                    type="text"
                    id="landing-search-input"
                    placeholder={selectedLanguage.code === "am" ? "ፈልግ…" : "Search…"}
                    onFocus={onOpenLogin}
                    className="w-full bg-transparent border-none outline-none text-[13px] font-semibold text-[var(--text-core)] placeholder:[var(--text-mute)]"
                  />
                </div>
                <kbd aria-hidden="true" className="css-vrp3oc hidden md:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono bg-black/5 dark:bg-white/10 border border-[var(--border-subtle)] text-[var(--text-mute)] rounded uppercase transition-colors group-hover:text-[var(--text-core)]">Ctrl+K</kbd>
              </div>
            </div>

            {/* Country and Amharic/English Language Switcher Trigger */}
            <div data-tracking="country_lang_menu" id="country-toggle" className="flex items-center mr-4 cursor-pointer" onClick={onOpenPreferences}>
              <div className="flex items-center gap-2 group">
                {/* Light blue circle with white '!' */}
                <div className="w-5 h-5 rounded-full bg-[#0077C5] flex items-center justify-center text-white text-[11px] font-black shadow-sm group-hover:scale-105 transition-transform select-none">
                  !
                </div>
                <div className="flex items-baseline gap-1 font-sans">
                  <span className="text-sm font-black text-[var(--text-core)] uppercase tracking-tight">
                    {selectedCountry.code || "ET"}
                  </span>
                  <span className="text-[9px] font-semibold text-[var(--text-mute)] uppercase">
                    {selectedLanguage.code || "en"}
                  </span>
                </div>
              </div>
            </div>

            {/* User Login Section Trigger */}
            <div data-tracking="sign_in_menu" className="SignInMenu_signInMenu RwGlobalNav_navSignin relative">
              <button
                data-tracking="signin_toggle"
                className="SignInMenu_menuToggle-desktop bg-transparent text-[#393a3d] dark:text-white flex items-center border border-[#393a3d] dark:border-white/50 rounded-md px-5 py-2 hover:bg-[#393a3d] hover:text-white dark:hover:bg-white dark:hover:text-black transition-all font-sans text-sm font-bold cursor-pointer"
                onClick={() => setLoginDropOpen(!loginDropOpen)}
              >
                <span className="buttonText flex items-center gap-1.5 text-xs font-bold leading-tight uppercase tracking-wider">
                  {selectedLanguage.code === "am" ? "ይግቡ" : "Login"}
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 14 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform duration-200 ${loginDropOpen ? "rotate-180" : ""}`}
                  >
                    <path
                      d="M1 1L5.58579 5.58579C6.36683 6.36683 7.63316 6.36684 8.41421 5.58579L13 1"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>
              </button>
              
              {/* Desktop Sign In dropdown links */}
              {loginDropOpen && (
                <div className="SignInMenu_listWrapper SignInMenu_right SignInMenu_open-desktop border border-[var(--border-core)] shadow-2xl rounded bg-[var(--bg-panel)] p-4 absolute mt-2 right-0 z-[2000] w-64 text-[var(--text-core)] text-left">
                  <div className="text-[10px] text-[var(--text-mute)] font-mono tracking-widest uppercase px-3 py-1.5 bg-white/5 mb-3 rounded">// FINTRACK ACCESS</div>
                  <span className="RwMenuItem SignInMenu_signinLink block hover:bg-white/5 p-2 border border-transparent hover:border-[var(--border-subtle)] transition-all rounded mb-1">
                    <a
                      className="RwMenuItem_link_RwGlobalNav_mainLink text-xs text-[var(--text-core)] opacity-90 font-bold block uppercase tracking-wider hover:text-[#0077C5]"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenLogin();
                        setLoginDropOpen(false);
                      }}
                    >
                      {selectedLanguage.code === "am" ? "የነጋዴ ዳሽቦርድ" : "Merchant Dashboard"}
                    </a>
                  </span>
                  <span className="RwMenuItem SignInMenu_signinLink block hover:bg-white/5 p-2 border border-transparent hover:border-[var(--border-subtle)] transition-all rounded">
                    <a
                      className="RwMenuItem_link_RwGlobalNav_mainLink text-xs text-[var(--text-core)] opacity-90 font-bold block uppercase tracking-wider hover:text-[#0077C5]"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenLogin();
                        setLoginDropOpen(false);
                      }}
                    >
                      {selectedLanguage.code === "am" ? "የአበዳሪ ባንክ ፖርታል" : "Lender Bank portal"}
                    </a>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* HIGH-FIDELITY EXPANDED FLYOUT CONTAINER (RwGlobalNav_bottomWrapper) */}
        <div className={`RwGlobalNav_bottomWrapper ${activeSection ? "RwGlobalNav_sectionOpen" : ""}`} data-tracking="global_nav_flyout">
          <div className="RwGlobalNav_bottom" role="menubar">
            <div className="RwGlobalNav_menuWrapper">
              
              {/* Flyout 1: For Business Menu */}
              <div 
                data-menu-number="global_nav_tab_1" 
                className={`RwGlobalNav_navMenuContent ${activeSection === "business" ? "RwGlobalNav_navTab-navMenuOpen" : "hidden"}`}
              >
                <div className="RwNavMenuContainer bg-[var(--bg-panel)] border-b lg:border border-[var(--border-core)] p-6 w-full text-[var(--text-core)] grid grid-cols-1 lg:grid-cols-12 gap-8 rounded">
                  
                  {/* Left Column: Return to list & Main Business links */}
                  <div className="lg:col-span-4 space-y-4">
                    <button 
                      type="button"
                      className="RwNavButton RwGlobalNav_return-button mb-4 text-[#0077C5] flex items-center gap-2 cursor-pointer"
                      onClick={() => setActiveSection(null)}
                    >
                      <svg width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 2L2.41421 8.58579C1.63316 9.36684 1.63316 10.6332 2.41421 11.4142L9 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                      <span className="RwNavMenu_label font-mono text-xs uppercase tracking-widest">{selectedLanguage.code === "am" ? "// ወደ ዋናው ይመለሱ" : "// Back to main"}</span>
                    </button>

                    <div className="RwNavMenuList_listWrapper space-y-4">
                      <div>
                        <span className="text-[10px] text-[var(--text-mute)] font-mono tracking-widest uppercase block mb-1">OPERATIONS</span>
                        <a href="#pricing-section" className="RwNavMenuItem_navLink font-bold hover:text-[#0077C5] transition-colors font-sans text-base block" onClick={() => setActiveSection(null)}>
                          {selectedLanguage.code === "am" ? "እቅዶች እና የዋጋ አማራጮች" : "Plans & Pricing"}
                        </a>
                        <span className="text-xs text-[var(--text-sec)] block mt-0.5 font-medium leading-relaxed">
                          {selectedLanguage.code === "am" ? "ለሱቅዎ፣ ለጅምላ ማከፋፈያዎ የሚስማማውን እቅድ ይምረጡ።" : "Find which tier best suits your kiosk, wholesale, or retail shop."}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <a href="#" className="RwNavMenuItem_navLink font-bold hover:text-[#0077C5] transition-colors font-sans text-base block" onClick={(e) => { e.preventDefault(); setActiveSection(null); }}>
                            FinTrack Pro Advanced
                          </a>
                          <span className="bg-[#0077C5] text-white text-[8px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded leading-none">NEW</span>
                        </div>
                        <span className="text-xs text-[var(--text-sec)] block mt-0.5 font-medium leading-relaxed">
                          {selectedLanguage.code === "am" ? "ለጅምላ ሻጮችና ለብዙ ሱቆች የላቀ ኦዲት ለማድረግ የተዘጋጀ።" : "Engineered for wholesalers with complex multi-shop auditing needs."}
                        </span>
                      </div>

                      <div>
                        <a href="#" className="RwNavMenuItem_navLink font-bold hover:text-[#0077C5] transition-colors font-sans text-base block" onClick={(e) => { e.preventDefault(); setActiveSection(null); }}>
                          {selectedLanguage.code === "am" ? "የነጋዴዎች ታሪኮች" : "Merchant Stories"}
                        </a>
                        <span className="text-xs text-[var(--text-sec)] block mt-0.5 font-medium leading-relaxed">
                          {selectedLanguage.code === "am" ? "በመርካቶ እና ፒያሳ ያሉ ሱቆች ዲጂታል አሰራርን እንዴት እንደተቀበሉ ይመልከቱ።" : "See how real kiosks in Mercato and Piazza transitioned away from paper records."}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Center Column: Features & Modules Grid */}
                  <div className="lg:col-span-5 space-y-4">
                    <span className="text-[10px] text-[var(--text-mute)] font-mono tracking-widest uppercase block">{selectedLanguage.code === "am" ? "// የፋይናንሻል ኢንተለጀንስ አገልግሎቶች" : "// FINANCIAL INTELLIGENCE SERVICES"}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <span className="font-bold text-sm tracking-tight text-[var(--text-core)] block hover:text-[#0077C5] transition-colors cursor-pointer">
                          {selectedLanguage.code === "am" ? "የቴሌብር እና ባንክ ትስስር" : "Telebirr & Bank Wallet Sync"}
                        </span>
                        <span className="text-xs text-[var(--text-sec)] leading-relaxed block font-medium">
                          {selectedLanguage.code === "am" ? "ጥሬ ገንዘብን እና የቴሌብር/ባንክ ማሳወቂያዎችን በቅጽበት ማመሳሰል" : "Match physical cash, Telebirr messages, and bank statement histories instantly."}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="font-bold text-sm tracking-tight text-[var(--text-core)] block hover:text-[#0077C5] transition-colors cursor-pointer">
                          {selectedLanguage.code === "am" ? "ያለ ኢንተርኔት (Offline) መመዝገቢያ" : "Offline-First Ledger"}
                        </span>
                        <span className="text-xs text-[var(--text-sec)] leading-relaxed block font-medium">
                          {selectedLanguage.code === "am" ? "ኢንተርኔት በማይኖርበት ጊዜም ግብይቶችን መመዝገብና በራስ-ሰር ደመና ላይ መጫን" : "Keep recording transactions during unstable internet connections with auto-cloud sync."}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="font-bold text-sm tracking-tight text-[var(--text-core)] block hover:text-[#0077C5] transition-colors cursor-pointer">
                          {selectedLanguage.code === "am" ? "ደረሰኝ ማዘጋጀትና ማተም" : "Invoicing & Signatures"}
                        </span>
                        <span className="text-xs text-[var(--text-sec)] leading-relaxed block font-medium">
                          {selectedLanguage.code === "am" ? "የደንበኞችን የባለቤትነት ውልና ፊርማ የያዘ ደረሰኝ ማዘጋጀት" : "Prepare printable receipts with formal customer terms and legal confirmation."}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="font-bold text-sm tracking-tight text-[var(--text-core)] block hover:text-[#0077C5] transition-colors cursor-pointer">
                          {selectedLanguage.code === "am" ? "የታክስ (VAT/TOT) ሪፖርት ማውጫ" : "VAT/TOT Reports Compiler"}
                        </span>
                        <span className="text-xs text-[var(--text-sec)] leading-relaxed block font-medium">
                          {selectedLanguage.code === "am" ? "የታክስ ግዴታዎችዎን በጥንቃቄ ይመድቡና ፈጣን ሪፖርቶችን ያውጡ" : "Categorize transactions under active Ethiopian taxes and export summaries."}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Hero Visual Promo Card */}
                  <div className="lg:col-span-3 flex flex-col justify-between border-t lg:border-t-0 pt-6 lg:pt-0 lg:border-l border-[var(--border-core)] lg:pl-6 space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] text-[var(--text-mute)] font-mono tracking-widest uppercase block">// PERSISTENT INTEGRATION</span>
                      <h4 className="text-sm font-bold text-[var(--text-core)] uppercase tracking-tight leading-tight">{selectedLanguage.code === "am" ? "የብድር ታሪክ መገንባት" : "Build Credit History"}</h4>
                      <p className="text-xs text-[var(--text-sec)] leading-relaxed font-medium">
                        {selectedLanguage.code === "am" ? "በተረጋገጠ የሽያጭ መረጃ አማካኝነት ለባንኮች የታመኑ የብድር ደረጃዎችን ያዘጋጁ።" : "Secure loan scoring consistency using your verified sales consistency data."}
                      </p>
                    </div>
                    <div className="bg-[var(--bg-panel-inner)] p-3 border border-[var(--border-core)] rounded text-xs">
                      <span className="font-mono text-[9px] text-[#0077C5] tracking-widest uppercase block mb-1">FREE DEMO ASSISTANCE</span>
                      <span className="font-bold block text-[var(--text-core)]">{selectedLanguage.code === "am" ? "ከአዲስ እገዛ ዴስክ ጋር ይነጋገሩ" : "Talk to Addis Helpdesk"}</span>
                      <span className="text-[var(--text-sec)] block mt-0.5 leading-relaxed font-semibold">+251 900 123 456</span>
                      <span className="text-[10px] text-[var(--text-mute)] block mt-0.5">{selectedLanguage.code === "am" ? "ሰኞ-አርብ (ከጠዋቱ 2:00 - ከሰዓት 12:00)" : "Monday-Friday (8:00 AM - 6:00 PM)"}</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Flyout 2: Accountants Menu */}
              <div 
                data-menu-number="global_nav_tab_2" 
                className={`RwGlobalNav_navMenuContent ${activeSection === "accountants" ? "RwGlobalNav_navTab-navMenuOpen" : "hidden"}`}
              >
                <div className="RwNavMenuContainer bg-[var(--bg-panel)] border-b lg:border border-[var(--border-core)] p-6 w-full text-[var(--text-core)] grid grid-cols-1 lg:grid-cols-12 gap-8 rounded">
                  
                  {/* Left Column: Accountant Tools */}
                  <div className="lg:col-span-4 space-y-4">
                    <button 
                      type="button"
                      className="RwNavButton RwGlobalNav_return-button mb-4 text-[#0077C5] flex items-center gap-2 cursor-pointer"
                      onClick={() => setActiveSection(null)}
                    >
                      <svg width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 2L2.41421 8.58579C1.63316 9.36684 1.63316 10.6332 2.41421 11.4142L9 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                      <span className="RwNavMenu_label font-mono text-xs uppercase tracking-widest">{selectedLanguage.code === "am" ? "// ወደ ዋናው ይመለሱ" : "// Back to main"}</span>
                    </button>

                    <div className="RwNavMenuList_listWrapper space-y-4">
                      <div>
                        <span className="text-[10px] text-[var(--text-mute)] font-mono tracking-widest uppercase block mb-1">PROFESSIONAL WORKSPACE</span>
                        <a href="#" className="RwNavMenuItem_navLink font-bold hover:text-[#0077C5] transition-colors font-sans text-base block" onClick={(e) => { e.preventDefault(); setActiveSection(null); }}>
                          {selectedLanguage.code === "am" ? "የአካውንታንት አስተዳደሪያ" : "Accountant Console"}
                        </a>
                        <span className="text-xs text-[var(--text-sec)] block mt-0.5 font-medium leading-relaxed">
                          {selectedLanguage.code === "am" ? "የተገናኙ የደንበኛ ሱቆች ጠቅላላ የፋይናንስ ኦዲት ሪፖርቶች መከታተያ" : "Complete bookkeeping audit records of all connected client shops."}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <a href="#" className="RwNavMenuItem_navLink font-bold hover:text-[#0077C5] transition-colors font-sans text-base block" onClick={(e) => { e.preventDefault(); setActiveSection(null); }}>
                            FinTrack Ledger (Micro)
                          </a>
                          <span className="bg-[#0077C5] text-white text-[8px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded leading-none">NEW</span>
                        </div>
                        <span className="text-xs text-[var(--text-sec)] block mt-0.5 font-medium leading-relaxed">
                          {selectedLanguage.code === "am" ? "አነስተኛ የግብይት ቁጥር ላላቸው ጥቃቅን ኪዮስኮች የተዘጋጀ" : "For low-transacting small kiosks or local vendors with basic entry needs."}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Center Column: Security & Lending Scoring */}
                  <div className="lg:col-span-12 xl:col-span-5 space-y-4">
                    <span className="text-[10px] text-[var(--text-mute)] font-mono tracking-widest uppercase block">{selectedLanguage.code === "am" ? "// የአጋርነት ትስስሮች" : "// PARTNER INTEGRATIONS"}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <span className="font-bold text-sm tracking-tight text-[var(--text-core)] block hover:text-[#0077C5] transition-colors cursor-pointer">
                          {selectedLanguage.code === "am" ? "የቀጥታ የብድር ሁኔታ ግምገማ" : "Live Loan Risk Assessments"}
                        </span>
                        <span className="text-xs text-[var(--text-sec)] leading-relaxed block font-medium">
                          {selectedLanguage.code === "am" ? "ለንግዶች የታመኑ ደረጃዎችን ለማስላት ተከታታይ ግብይቶችን መተንተን" : "Analyze consistency metrics to calculate trustworthy merchant scores."}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="font-bold text-sm tracking-tight text-[var(--text-core)] block hover:text-[#0077C5] transition-colors cursor-pointer">
                          {selectedLanguage.code === "am" ? "በፈቃደኝነት ላይ የተመሰረተ ሪፖርት" : "Consent-Based Reporting"}
                        </span>
                        <span className="text-xs text-[var(--text-sec)] leading-relaxed block font-medium">
                          {selectedLanguage.code === "am" ? "ለአነስተኛ የብድር ተቋማት የሂሳብ መግለጫዎችን በደህንነት ማጋራት" : "Allow secure direct sharing of VAT and accounting statements with partner MFIs."}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="font-bold text-sm tracking-tight text-[var(--text-core)] block hover:text-[#0077C5] transition-colors cursor-pointer">
                          {selectedLanguage.code === "am" ? "ኦዲት እና ማጭበርበር መቆጣጠሪያ" : "Auditing & Anti-Fraud Log"}
                        </span>
                        <span className="text-xs text-[var(--text-sec)] leading-relaxed block font-medium">
                          {selectedLanguage.code === "am" ? "ደረሰኞችንና ክፍያዎችን በማመሳሰል የክፍያ ማጭበርበርን ማስቀረት" : "Halt payment frauds by cross-referencing ledger deposits symmetries."}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="font-bold text-sm tracking-tight text-[var(--text-core)] block hover:text-[#0077C5] transition-colors cursor-pointer">
                          {selectedLanguage.code === "am" ? "የቅርንጫፎች ማጠቃለያ" : "Branch Aggregations"}
                        </span>
                        <span className="text-xs text-[var(--text-sec)] leading-relaxed block font-medium">
                          {selectedLanguage.code === "am" ? "በተለያየ ቦታ ያሉ ቅርንጫፍ ሱቆችን በአንድ ማዕከላዊ መለያ መቆጣጠር" : "Consolidate operational profiles across multiple physical storefronts."}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Promo Banner Card */}
                  <div className="lg:col-span-3 flex flex-col justify-between border-t lg:border-t-0 pt-6 lg:pt-0 lg:border-l border-[var(--border-core)] lg:pl-6 space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] text-[var(--text-mute)] font-mono tracking-widest uppercase block">// COLLABORATIVE MEETS</span>
                      <h4 className="text-sm font-bold text-[var(--text-core)] uppercase tracking-tight leading-tight">{selectedLanguage.code === "am" ? "የባለሙያ አማካሪዎች አውታረ መረብ" : "Join Pro-Advisor Network"}</h4>
                      <p className="text-xs text-[var(--text-sec)] leading-relaxed font-semibold">
                        {selectedLanguage.code === "am" ? "የፊንትራክ ማረጋገጫ የምስክር ወረቀት በማግኘት የሀገር ውስጥ መደብሮችን ወደ ዘመናዊ መመዝገቢያ ያሸጋግሩ።" : "Earn FinTrack certifications to advice and transition manual retailers into secure digital bookkeeping."}
                      </p>
                    </div>
                    <div className="bg-[#0077C5] text-white p-3 rounded text-xs select-none">
                      <span className="font-mono text-[9px] tracking-widest uppercase block mb-1 opacity-90">// BANK SCORING API</span>
                      <span className="font-bold block text-sm leading-tight">{selectedLanguage.code === "am" ? "የቀጥታ የብድር ደረጃ መመርመሪያ" : "Instant Credit Scoring Sandboxes"}</span>
                      <span className="block mt-1 opacity-90 leading-relaxed font-semibold">{selectedLanguage.code === "am" ? "ለባንኮችና ለአነስተኛ ብድር ተንታኞች የተዘጋጀ የሙከራ ሲስተም።" : "Now available for Commercial Bank and micro-lender analysts."}</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Flyout 3: Learn & Support Menu */}
              <div 
                data-menu-number="global_nav_tab_4" 
                className={`RwGlobalNav_navMenuContent ${activeSection === "support" ? "RwGlobalNav_navTab-navMenuOpen" : "hidden"}`}
              >
                <div className="RwNavMenuContainer bg-[var(--bg-panel)] border-b lg:border border-[var(--border-core)] p-6 w-full text-[var(--text-core)] grid grid-cols-1 lg:grid-cols-12 gap-8 rounded">
                  
                  {/* Left Column: Quick Guides */}
                  <div className="lg:col-span-4 space-y-4">
                    <button 
                      type="button"
                      className="RwNavButton RwGlobalNav_return-button mb-4 text-[#0077C5] flex items-center gap-2 cursor-pointer"
                      onClick={() => setActiveSection(null)}
                    >
                      <svg width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 2L2.41421 8.58579C1.63316 9.36684 1.63316 10.6332 2.41421 11.4142L9 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                      <span className="RwNavMenu_label font-mono text-xs uppercase tracking-widest">{selectedLanguage.code === "am" ? "// ወደ ዋናው ይመለሱ" : "// Back to main"}</span>
                    </button>

                    <div className="RwNavMenuList_listWrapper space-y-4">
                      <div>
                        <span className="text-[10px] text-[var(--text-mute)] font-mono tracking-widest uppercase block mb-1">WALKTHROUGHS</span>
                        <a href="#" className="RwNavMenuItem_navLink font-bold hover:text-[#0077C5] transition-colors font-sans text-base block" onClick={(e) => { e.preventDefault(); setActiveSection(null); }}>
                          {selectedLanguage.code === "am" ? "ለመጀመር መመሪያ" : "Getting Started Guide"}
                        </a>
                        <span className="text-xs text-[var(--text-sec)] block mt-0.5 font-medium leading-relaxed">
                          {selectedLanguage.code === "am" ? "የእርስዎን የሱቅ መገለጫ ለመገንባት የሚያግዙ የአማርኛና የእንግሊዝኛ የቪዲዮ ትምህርቶች" : "Simple Amharic and English video tutorials on establishing your storefront profile."}
                        </span>
                      </div>

                      <div>
                        <a href="#" className="RwNavMenuItem_navLink font-bold hover:text-[#0077C5] transition-colors font-sans text-base block" onClick={(e) => { e.preventDefault(); setActiveSection(null); }}>
                          {selectedLanguage.code === "am" ? "የዕዳ አስታዋሽ የኤስኤምኤስ ማዋቀር" : "SMS Debt Reminders Setup"}
                        </a>
                        <span className="text-xs text-[var(--text-sec)] block mt-0.5 font-medium leading-relaxed">
                          {selectedLanguage.code === "am" ? "ለባለዕዳ ደንበኞችዎ በራስ-ሰር የሚሄዱ የኤስኤምኤስ ማስታወሻዎችን እንዴት እንደሚያዋቅሩ ይማሩ።" : "Learn how to configure automated notices to customers and easily retrieve overdue balances."}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Center Column: Resources list */}
                  <div className="lg:col-span-5 space-y-4 font-sans">
                    <span className="text-[10px] text-[var(--text-mute)] font-mono tracking-widest uppercase block">// EDUCATION MODULES</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <span className="font-bold text-sm tracking-tight text-[var(--text-core)] block hover:text-[#0077C5] transition-colors cursor-pointer">
                          {selectedLanguage.code === "am" ? "የቴሌብር አገልግሎት ክፍያዎች" : "Telebirr Fees Sandbox"}
                        </span>
                        <span className="text-xs text-[var(--text-sec)] leading-relaxed block font-semibold text-xs mt-0.5">
                          {selectedLanguage.code === "am" ? "በንግድ የኪስ ቦርድዎ ስር የክፍያ ተመን ማስወገጃ መንገዶች" : "How to minimize transaction charges on your business wallet collections."}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="font-bold text-sm tracking-tight text-[var(--text-core)] block hover:text-[#0077C5] transition-colors cursor-pointer">
                          {selectedLanguage.code === "am" ? "የእቃ ክምችት ትንበያ" : "Inventory and Stock Forecasting"}
                        </span>
                        <span className="text-xs text-[var(--text-sec)] leading-relaxed block font-semibold text-xs mt-0.5">
                          {selectedLanguage.code === "am" ? "ዕቃዎች እንዳይቆራረጡና ከመጠን በላይ እንዳይከማቹ መቆጣጠሪያ መንገዶች" : "Tips on avoiding supply chain stockouts or deadstock traps."}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="font-bold text-sm tracking-tight text-[var(--text-core)] block hover:text-[#0077C5] transition-colors cursor-pointer">
                          {selectedLanguage.code === "am" ? "የቫት (VAT) እና ቶት (TOT) መርሆች" : "VAT/TOT Regulations Digest"}
                        </span>
                        <span className="text-xs text-[var(--text-sec)] leading-relaxed block font-semibold text-xs mt-0.5">
                          {selectedLanguage.code === "am" ? "በኢትዮጵያ ስላለው የተርን ኦቨር ታክስ (TOT) ደንቦች ግልጽ ትንተና።" : "Easy definitions of turnover tax structures inside Ethiopia."}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="font-bold text-sm tracking-tight text-[var(--text-core)] block hover:text-[#0077C5] transition-colors cursor-pointer">
                          {selectedLanguage.code === "am" ? "የአካባቢው የቴሌግራም ቻናል" : "Regional Telegram Channel"}
                        </span>
                        <span className="text-xs text-[var(--text-sec)] leading-relaxed block font-semibold text-xs mt-0.5">
                          {selectedLanguage.code === "am" ? "ከ10 ሺ በላይ ነጋዴዎች ባሉበት የሀገር ውስጥ የግንኙነት አውታር ውስጥ ይሳተፉ።" : "Join 10k+ local sellers sharing inventory tips and transaction workflows live."}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Support Card */}
                  <div className="lg:col-span-3 flex flex-col justify-between border-t lg:border-t-0 pt-6 lg:pt-0 lg:border-l border-[var(--border-core)] lg:pl-6 space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] text-[var(--text-mute)] font-mono tracking-widest uppercase block">// SUPPORT TICKETS</span>
                      <h4 className="text-sm font-bold text-[var(--text-core)] uppercase tracking-tight leading-tight">{selectedLanguage.code === "am" ? "የቀጥታ የውይይት ዴስክ" : "Live Chat Desk"}</h4>
                      <p className="text-xs text-[var(--text-sec)] leading-relaxed font-semibold">
                        {selectedLanguage.code === "am" ? "ጥያቄዎችን በቀጥታ ከዳሽቦርድዎ ይላኩ። የቴክኒክ ቡድናችን የ24 ሰዓት እገዛ ይሰጣል።" : "Submit queries directly inside your dashboard. FinTrack certified helpdesk is available 24/7."}
                      </p>
                    </div>
                    <div className="bg-[var(--bg-panel-inner)] p-3 border border-[var(--border-core)] rounded text-xs">
                      <span className="font-mono text-[9px] text-[#0077C5] tracking-widest uppercase block mb-1">CO-OPERATIVE LENDING</span>
                      <span className="font-bold block text-[var(--text-core)]">{selectedLanguage.code === "am" ? "የአነስተኛ ብድር ሴሚናሮች" : "Micro-finance Seminars"}</span>
                      <span className="text-[var(--text-sec)] block mt-0.5 leading-relaxed font-semibold">{selectedLanguage.code === "am" ? "መዝገቦችን ተጠቅሞ ለሱቆች የሚሆን የመጫኛ ካፒታል ማግኛ ዘዴዎችን ይወቁ።" : "Learn how to leverage transaction ledgers to trigger growth capital."}</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
