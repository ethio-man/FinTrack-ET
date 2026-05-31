import React, { useState, useEffect } from "react";
import { LanguageOpt } from "../types";
import { Globe, Cloud, Bell, HelpCircle, Search, User, LogOut, Moon, Sun, RefreshCw, CheckCircle, AlertOctagon, X } from "lucide-react";
import Sidebar from "./Sidebar";
import MobileBottomNav from "./MobileBottomNav";
interface DashboardHomeProps {
  userEmail: string;
  selectedLanguage: LanguageOpt;
  onSelectLanguage: (lang: LanguageOpt) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
}

type SyncState = "online" | "syncing" | "offline";

export default function DashboardHome({
  userEmail,
  selectedLanguage,
  onSelectLanguage,
  isDarkMode,
  onToggleDarkMode,
  onLogout,
}: DashboardHomeProps) {
  const [syncState, setSyncState] = useState<SyncState>("online");
  const [searchQuery, setSearchQuery] = useState("");
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Translate labels for localized text
  const isAmharic = selectedLanguage.code === "am";
  const t = {
    planBadge: isAmharic ? "ነጻ ጅማሮ (Free Starter)" : "Free Starter Plan",
    syncStatus: isAmharic ? "የማመሳሰል ሁኔታ" : "Sync Status",
    syncOnline: isAmharic ? "የተገናኘ እና የተመሳሰለ" : "Online & Synced",
    syncRunning: isAmharic ? "በማመሳሰል ላይ..." : "Syncing records...",
    syncOffline: isAmharic ? "ከመስመር ውጭ (የተጠራቀሙ ለውጦች አሉ)" : "Offline (Queued changes)",
    notifications: isAmharic ? "ማሳወቂያዎች" : "Notifications",
    helpDesk: isAmharic ? "እርዳታ እና መመሪያ" : "FinTrack Help",
    placeholderUser: isAmharic ? "የነጋዴ መግቢያ" : "Merchant Account",
    searchPlaceholder: isAmharic ? "ለመፈለግ Ctrl+K ይጫኑ..." : "Search dashboard (Ctrl+K)...",
    logout: isAmharic ? "ውጣ" : "Sign out",
    welcomeTitle: isAmharic ? "ወደ ፊንትራክ ነጋዴ ዳሽቦርድ እንኳን በደህና መጡ!" : "Welcome to FinTrack ET Merchant Dashboard!",
    welcomeDesc: isAmharic 
      ? "ዳሽቦርድዎ ለአሁኑ ባዶ ነው። የንግድዎን ሽያጭ፣ የቴሌብር ገቢዎችን፣ የእዳ መዛግብትን እና የባንክ ብድር ነጥብዎን ለማስተዳደር ከላይ ያሉትን አማራጮች ማሰስ ይችላሉ።"
      : "Your merchant interface is currently set up with an empty body as requested. Manage local revenue tracking, Telebirr records, real-time debt bookkeeping, and banking connector controls using the specialized header utilities.",
  };

  // Keyboard shortcut listener for Ctrl+K search focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("global-search-input");
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Notifications Mock Data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: isAmharic ? "ክፍያ ተፈጽሟል" : "Telebirr Deposit Received",
      desc: isAmharic ? "ከደንበኛ ዮሐንስ ቁጥር 1,450 ብር በቴሌብር ገብቷል።" : "1,450 ETB transferred successfully from customer Johanes.",
      time: isAmharic ? "ከ2 ደቂቃ በፊት" : "2m ago",
      read: false,
    },
    {
      id: 2,
      title: isAmharic ? "የባንክ ብድር ደረጃ ማሻሻያ" : "Credit Rating Updated",
      desc: isAmharic ? "የእርስዎ የክሬዲት ነጥብ ስኬት ወደ A+ አድጓል። የባንክ አበዳሪዎች መገምገም ይችላሉ።" : "FinTrack Scoring Model evaluated merchant tier: A+ Premium Status.",
      time: isAmharic ? "ከ1 ሰዓት በፊት" : "1h ago",
      read: false,
    },
    {
      id: 3,
      title: isAmharic ? "ምትኬ ተጠናቋል" : "Cloud Backup Completed",
      desc: isAmharic ? "ሁሉም የሽያጭ እና ወጪ መዛግብት ወደ ደመና የአገልጋይ ምትኬ ተደርገዋል።" : "Automated ledger backups successfully synchronized with cloud servers.",
      time: isAmharic ? "ከዛሬ ጠዋት" : "Today am",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Handle cycles or switches through Sync States for interactive demonstration
  const handleSyncChange = (state: SyncState) => {
    setSyncState(state);
    setSyncOpen(false);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--bg-core)] text-[var(--text-core)] transition-colors duration-300 font-sans" id="dashboard-main">
      <Sidebar selectedLanguage={selectedLanguage} />
      <div className="flex-1 flex flex-col h-full relative overflow-y-auto pb-16 md:pb-0">
      
      {/* 
        PREMIUM HEAD STICKY DECORATED HEADER
        Using the structured elements inspired by the raw CoreUI format but fully customized/designed for the FinTrack ET system.
      */}
      <div 
        className="header header-sticky mb-5 border-b border-[var(--border-core)] bg-[var(--bg-panel)] shadow-md select-none sticky top-0 z-[1000] transition-colors"
        id="dashboard-header"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-4">
          
          {/* LEFT SIDE: Brand Logo and Responsive Menu Toggler */}
          <div className="flex items-center gap-3">
            {/* Nav toggler button */}
            <button 
              type="button" 
              className="header-toggler text-[var(--text-sec)] hover:text-[#0077C5] transition-colors outline-none cursor-pointer p-1.5 hidden" 
              aria-label="Toggle Navigation Stack"
              onClick={() => alert(isAmharic ? "የዳሽቦርድ መቆጣጠሪያ ፓነል" : "FinTrack system dashboard menu is optimized for single screen experience.")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5" role="img" aria-hidden="true">
                <path fill="currentColor" d="M80 96h352v32H80zm0 144h352v32H80zm0 144h352v32H80z"></path>
              </svg>
            </button>

            {/* Logo brand block */}
            <a 
              className="header-brand flex items-center gap-2 border border-[#0077C5]/10 dark:border-white/10 rounded-lg px-3 py-1 bg-[var(--bg-core)] shadow-inner" 
              aria-label="FinTrack Portal Home" 
              href="#"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36" className="w-6 h-6 flex-shrink-0 animate-pulse">
                <path fill="#0077C5" d="M18 36c9.9411 0 18-8.0589 18-18 0-9.94114-8.0589-18-18-18C8.05886 0 0 8.05886 0 18c0 9.9411 8.05886 18 18 18Z" />
                <path fill="white" d="M23 11H13a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V13a2 2 0 00-2-2zm-1 8h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z" />
              </svg>
              <div className="flex flex-col text-left leading-none font-sans">
                <span className="text-[7px] font-black tracking-[0.16em] text-[#0077C5] uppercase">FINTRACK</span>
                <span className="text-xs font-black text-[var(--text-core)] tracking-tight leading-none mt-0.5">et</span>
              </div>
            </a>

            {/* Plan Badge - Displays starter tier prominently to build credibility */}
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-[#0077C5]/10 text-[#0077C5] uppercase tracking-wider border border-[#0077C5]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0077C5]" />
              {t.planBadge}
            </span>
          </div>

          {/* MIDDLE SIDE: Centered global search engine with simulated smart command menu */}
          <div className="docs-search flex-1 max-w-md relative hidden md:block">
            <div className={`relative flex items-center w-full bg-[var(--bg-core)] border rounded-lg transition-all ${searchFocused ? "border-[#0077C5] ring-1 ring-[#0077C5]/30 shadow-sm" : "border-[var(--border-core)]"}`}>
              <span className="pl-3.5 text-[var(--text-sec)]">
                <Search className="w-4 h-4" />
              </span>
              <input 
                id="global-search-input"
                type="text" 
                placeholder={t.searchPlaceholder} 
                className="w-full pl-2.5 pr-14 py-2 text-xs font-medium bg-transparent border-0 outline-none placeholder:text-[var(--text-mute)]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-0.5 text-[9px] font-mono select-none px-1.5 py-0.5 bg-[var(--bg-panel-inner)] border border-[var(--border-subtle)] text-[var(--text-sec)] rounded uppercase">
                <kbd>Ctrl</kbd>
                <span>+</span>
                <kbd>K</kbd>
              </span>
            </div>

            {/* Interactive Quick Search Drops showing customized ledger commands */}
            {searchFocused && (
              <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-[var(--bg-panel)] border border-[var(--border-core)] shadow-xl rounded-lg p-2.5 text-xs text-left z-[1000] animate-fade-in space-y-1.5">
                <span className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-[var(--text-mute)] px-2 mb-1">Quick Ledger Commands</span>
                <button 
                  onMouseDown={() => {
                    setSearchQuery("New Sale Journey"); 
                    alert(isAmharic ? "አዲስ የሽያጭ ደረሰኝ መመዝገቢያ ማስጀመሪያ!" : "Initializing simulated sales ledger form...");
                  }} 
                  className="w-full text-left px-2 py-1.5 hover:bg-[#0077C5]/10 rounded flex items-center justify-between text-[var(--text-core)]"
                >
                  <span>🆕 {isAmharic ? "አዲስ ሽያጭ መመዝገብ" : "Record New Sale Receipt"}</span>
                  <span className="text-[10px] text-[var(--text-sec)] font-mono">/sale</span>
                </button>
                <button 
                  onMouseDown={() => {
                    setSearchQuery("Telebirr Sync Log"); 
                    alert(isAmharic ? "የቴሌብር ሂሳብ ማመሳሰሉ ንቁ ነው!" : "Connecting to simulated Telebirr APIs...");
                  }} 
                  className="w-full text-left px-2 py-1.5 hover:bg-[#0077C5]/10 rounded flex items-center justify-between text-[var(--text-core)]"
                >
                  <span>📲 {isAmharic ? "የቴሌብር ዲጂታል ሪፖርት" : "Verify Telebirr Transactions"}</span>
                  <span className="text-[10px] text-[var(--text-sec)] font-mono">/telebirr</span>
                </button>
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Action Controls including language, interactive sync widget, notifications panel, help desk, profile avatar */}
          <div className="flex items-center gap-2.5">
            

            {/* LANGUAGE TOGGLE CONTROL */}
            <div className="relative hidden md:block">
              <button 
                onClick={() => onSelectLanguage(selectedLanguage.code === "en" ? { code: "am", name: "አማርኛ" } : { code: "en", name: "English" })}
                className="w-10 h-10 rounded-lg bg-[var(--bg-core)] hover:bg-[var(--bg-panel-inner)] border border-[var(--border-core)] flex items-center justify-center text-xs font-black tracking-tighter text-[var(--text-core)] transition-all cursor-pointer shadow-sm relative group"
                title={`${isAmharic ? "Switch to English" : "ወደ አማርኛ ለመቀየር ጠቅ ያድርጉ"}`}
              >
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#0077C5] animate-ping" />
                <Globe className="w-4 h-4 opacity-75 group-hover:rotate-12 transition-transform" />
                <span className="absolute -bottom-1 -right-1 text-[8px] font-extrabold bg-[#0077C5] text-white px-1 py-[0.5px] rounded">
                  {selectedLanguage.code === "en" ? "EN" : "አማ"}
                </span>
              </button>
            </div>

            {/* INTERACTIVE SYNC STATUS INDICATOR: Clicking changes visual states & shows merchant queue reports */}
            <div className="relative hidden md:block">
              <button 
                onClick={() => {
                  setSyncOpen(!syncOpen);
                  setNotificationsOpen(false);
                  setAvatarOpen(false);
                  setHelpOpen(false);
                }}
                className={`w-10 h-10 rounded-lg bg-[var(--bg-core)] hover:bg-[var(--bg-panel-inner)] border flex items-center justify-center transition-all cursor-pointer shadow-sm relative group ${
                  syncState === "online" ? "border-green-500/20" : syncState === "syncing" ? "border-amber-500/20" : "border-red-500/20"
                }`}
                title={t.syncStatus}
              >
                {syncState === "online" && (
                  <>
                    <Cloud className="w-5 h-5 text-green-500" />
                    <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[var(--bg-core)]" />
                  </>
                )}
                {syncState === "syncing" && (
                  <>
                    <RefreshCw className="w-4 h-4 text-amber-500 animate-spin" />
                    <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-[var(--bg-core)] animate-ping" />
                  </>
                )}
                {syncState === "offline" && (
                  <>
                    <AlertOctagon className="w-5 h-5 text-red-500 animate-bounce" />
                    <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[var(--bg-core)]" />
                    <span className="absolute -top-1 -right-1 text-[8px] font-bold bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center">
                      4
                    </span>
                  </>
                )}
              </button>

              {/* Sync interactive selection popup panel */}
              {syncOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 w-64 bg-[var(--bg-panel)] border border-[var(--border-core)] rounded-xl shadow-2xl p-4 z-[2000] text-left animate-fade-in space-y-3">
                  <div className="pb-2 border-b border-[var(--border-subtle)]">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-mute)] block mb-0.5">{t.syncStatus}</span>
                    <span className="text-xs font-bold text-[var(--text-core)]">{isAmharic ? "ሁኔታውን ይምረጡ" : "Simulate Connection State"}</span>
                  </div>

                  <div className="space-y-1">
                    <button 
                      onClick={() => handleSyncChange("online")}
                      className={`w-full text-left p-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${syncState === "online" ? "bg-green-500/10 text-green-500 font-extrabold" : "hover:bg-[var(--bg-core)]"}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                        {t.syncOnline}
                      </span>
                      {syncState === "online" && <CheckCircle className="w-3.5 h-3.5" />}
                    </button>
                    <button 
                      onClick={() => handleSyncChange("syncing")}
                      className={`w-full text-left p-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${syncState === "syncing" ? "bg-amber-500/10 text-amber-500 font-extrabold" : "hover:bg-[var(--bg-core)]"}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" />
                        {t.syncRunning}
                      </span>
                      {syncState === "syncing" && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    </button>
                    <button 
                      onClick={() => handleSyncChange("offline")}
                      className={`w-full text-left p-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${syncState === "offline" ? "bg-red-500/10 text-red-500 font-extrabold" : "hover:bg-[var(--bg-core)]"}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                        {t.syncOffline}
                      </span>
                      {syncState === "offline" && <AlertOctagon className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <p className="text-[10px] text-[var(--text-sec)] leading-relaxed italic border-t border-[var(--border-subtle)] pt-2.5">
                    {syncState === "offline" 
                      ? (isAmharic ? "መተግበሪያው ከመስመር ውጭ ሲሆን ግብይቶችን በቁልፍ ያከማቻል፣ ሲገናኝ በቀጥታ ያመሳስላል።" : " Ledger has 4 local offline sales queued. Reconnect simulation to flush.") 
                      : (isAmharic ? "መረጃው በሰዓቱ ከቴሌብርና ሲቢኢ (Telebirr/CBE) ጋር ተመሳስሏል።" : "Active merchant channel linked to centralized cloud accounting nodes.")}
                  </p>
                </div>
              )}
            </div>

            {/* NOTIFICATIONS BELL: With a dynamic counts badge & informative drop-down list */}
            <div className="relative hidden md:block">
              <button 
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setSyncOpen(false);
                  setAvatarOpen(false);
                  setHelpOpen(false);
                }}
                className="w-10 h-10 rounded-lg bg-[var(--bg-core)] hover:bg-[var(--bg-panel-inner)] border border-[var(--border-core)] flex items-center justify-center text-[var(--text-sec)] hover:text-[#0077C5] transition-all cursor-pointer shadow-sm relative"
                title={t.notifications}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-[#0077C5] text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-bounce shadow-md">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications drop down widget */}
              {notificationsOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 w-80 bg-[var(--bg-panel)] border border-[var(--border-core)] rounded-xl shadow-2xl overflow-hidden z-[2000] text-left animate-fade-in">
                  <div className="p-4 bg-[var(--bg-panel-inner)] border-b border-[var(--border-subtle)] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-mute)] block mb-0.5">{t.notifications}</span>
                      <span className="text-xs font-bold text-[var(--text-core)]">Recent Alerts</span>
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-[10px] font-black text-[#0077C5] hover:underline cursor-pointer"
                      >
                        {isAmharic ? "ሁሉንም አንብብ" : "Mark all read"}
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-[var(--border-subtle)] max-h-72 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-3.5 text-xs transition-colors hover:bg-[var(--bg-core)] ${!n.read ? "bg-[#0077C5]/5 border-l-2 border-[#0077C5]" : ""}`}>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-extrabold text-[var(--text-core)]">{n.title}</span>
                          <span className="text-[9px] font-mono text-[var(--text-mute)]">{n.time}</span>
                        </div>
                        <p className="text-[var(--text-sec)] text-[11px] leading-relaxed select-text">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* HELP DESK: Customized helper modal containing merchant videos & contacts */}
            <div className="relative hidden md:block">
              <button 
                onClick={() => {
                  setHelpOpen(!helpOpen);
                  setSyncOpen(false);
                  setNotificationsOpen(false);
                  setAvatarOpen(false);
                }}
                className="w-10 h-10 rounded-lg bg-[var(--bg-core)] hover:bg-[var(--bg-panel-inner)] border border-[var(--border-core)] flex items-center justify-center text-[var(--text-sec)] hover:text-[#0077C5] transition-all cursor-pointer shadow-sm"
                title={t.helpDesk}
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {/* Help desk drop-down card */}
              {helpOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 w-72 bg-[var(--bg-panel)] border border-[var(--border-core)] rounded-xl shadow-2xl p-4 z-[2000] text-left animate-fade-in space-y-3">
                  <div className="pb-2 border-b border-[var(--border-subtle)]">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-mute)] block mb-0.5">{t.helpDesk}</span>
                    <span className="text-xs font-bold text-[var(--text-core)]">{isAmharic ? "ያግኙን እና ፈጣን እገዛ" : "Ethiopian Merchant Hotline"}</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="bg-[var(--bg-core)] p-2.5 border border-[var(--border-subtle)] rounded-lg">
                      <span className="font-extrabold block mb-0.5">{isAmharic ? "📞 የስልክ ድጋፍ መስመር" : "📞 Domestic Hotline"}</span>
                      <a href="tel:9312" className="text-[#0077C5] font-black text-sm block">9312 (Toll-Free / ነጻ)</a>
                      <span className="text-[10px] text-[var(--text-sec)] block mt-0.5">{isAmharic ? "ከሰኞ እስከ ቅዳሜ ከቀኑ 2፡00 - 12፡00 ሰዓት" : "Mon-Sat 8:00 AM - 6:00 PM Local Time"}</span>
                    </div>
                    <div className="space-y-1 pl-1">
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); alert(isAmharic ? "የቴሌብር (Telebirr App SDK) ማስተካከያ ቪዲዮ መጫኛ..." : "Loading SDK integrations tutorial..."); }}
                        className="text-[#0077C5] hover:underline block font-semibold"
                      >
                        🎥 Telebirr API Setup Video
                      </a>
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); alert(isAmharic ? "ለመጀመሪያ ጊዜ ተጠቃሚዎች የቪዲዮ መመሪያ ማሳያ..." : "Opening merchant onboarding manual..."); }}
                        className="text-[#0077C5] hover:underline block font-semibold"
                      >
                        🎥 Onboarding Video Guide
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MOBILE ONLY SEARCH ICON */}
            <button 
              onClick={() => {
                setMobileSearchOpen(true);
                setTimeout(() => document.getElementById('mobile-search-input')?.focus(), 100);
              }}
              className="md:hidden w-10 h-10 rounded-full bg-[var(--bg-core)] border border-[var(--border-core)] flex items-center justify-center text-[var(--text-sec)] shadow-sm"
            >
               <Search className="w-4 h-4" />
            </button>

            {/* USER PROFILE DRAG & DROPS (Avatar): Houses dark mode & logout controls */}
            <div className="relative">
              <button 
                onClick={() => {
                  setAvatarOpen(!avatarOpen);
                  setSyncOpen(false);
                  setNotificationsOpen(false);
                  setHelpOpen(false);
                }}
                className="w-10 h-10 rounded-full bg-[#0077C5]/10 border border-[#0077C5]/30 flex items-center justify-center text-[#0077C5] hover:border-[#0077C5] hover:scale-105 transition-all text-sm font-bold tracking-wider cursor-pointer shadow-sm relative overflow-hidden"
              >
                <User className="w-4 h-4 text-[#0077C5]" />
              </button>

              {/* Avatar menu action item list */}
              {avatarOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 w-64 bg-[var(--bg-panel)] border border-[var(--border-core)] rounded-xl shadow-2xl z-[2000] text-left overflow-hidden animate-fade-in select-none">
                  
                  {/* Account Header info */}
                  <div className="p-4 bg-[var(--bg-panel-inner)] border-b border-[var(--border-subtle)] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#0077C5] block">{t.placeholderUser}</span>
                    <span className="text-xs font-black text-[var(--text-core)] block tracking-tight truncate select-text">{userEmail}</span>
                    <span className="inline-flex text-[9px] font-medium bg-green-500/15 text-green-500 px-1.5 py-0.5 rounded uppercase font-mono mt-1">Verified Merchant</span>
                  </div>

                  <div className="p-2 space-y-0.5">
                    
                    {/* Dark/Light mode quick widget in profile workspace */}
                    <button 
                      onClick={onToggleDarkMode}
                      className="w-full text-left px-3 py-2.5 hover:bg-[var(--bg-core)] rounded-lg flex items-center justify-between text-xs transition-colors text-[var(--text-core)] cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-semibold">
                        {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-[#0077C5]" />}
                        {isDarkMode ? (isAmharic ? "ብርሃን ገጽታ" : "Light Canvas") : (isAmharic ? "ጨለማ ገጽታ" : "Dark Canvas")}
                      </span>
                      <span className="text-[9px] font-bold tracking-widest text-[var(--text-mute)] uppercase">{isDarkMode ? "Light" : "Dark"}</span>
                    </button>

                    {/* Sign out button */}
                    <button 
                      onClick={onLogout}
                      className="w-full text-left px-3 py-2.5 hover:bg-red-500/10 text-red-500 font-extrabold rounded-lg flex items-center gap-2 text-xs transition-colors cursor-pointer border border-transparent hover:border-red-500/20"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.logout}
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

        {/* MOBILE SEARCH OVERLAY */}
        {mobileSearchOpen && (
          <div className="md:hidden absolute inset-0 bg-[var(--bg-panel)] z-[2000] flex flex-col p-4 animate-fade-in border-b border-[var(--border-core)]">
            <div className="flex items-center gap-3">
              <div className={`relative flex-1 flex items-center bg-[var(--bg-core)] border rounded-lg transition-all ${searchFocused ? "border-[#0077C5] ring-1 ring-[#0077C5]/30 shadow-sm" : "border-[var(--border-core)]"}`}>
                <span className="pl-3.5 text-[var(--text-sec)]">
                  <Search className="w-4 h-4" />
                </span>
                <input 
                  id="mobile-search-input"
                  type="text" 
                  placeholder={t.searchPlaceholder} 
                  className="w-full pl-2.5 pr-4 py-2.5 text-sm font-medium bg-transparent border-0 outline-none placeholder:text-[var(--text-mute)]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                />
              </div>
              <button 
                onClick={() => { setMobileSearchOpen(false); setSearchFocused(false); }}
                className="p-2 text-[var(--text-sec)] hover:bg-[var(--bg-core)] rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Dropdown Results inside the overlay */}
            {searchFocused && (
              <div className="mt-4 bg-[var(--bg-panel-inner)] rounded-xl p-2 border border-[var(--border-subtle)] text-sm text-left shadow-lg">
                <span className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-[var(--text-mute)] px-2 mb-2 pt-1">Quick Ledger Commands</span>
                <button 
                  onMouseDown={() => {
                    setSearchQuery("New Sale Journey"); 
                    setMobileSearchOpen(false);
                    alert(isAmharic ? "አዲስ የሽያጭ ደረሰኝ መመዝገቢያ ማስጀመሪያ!" : "Initializing simulated sales ledger form...");
                  }} 
                  className="w-full text-left px-3 py-3 hover:bg-[#0077C5]/10 rounded-lg flex items-center justify-between text-[var(--text-core)]"
                >
                  <span>🆕 {isAmharic ? "አዲስ ሽያጭ መመዝገብ" : "Record New Sale Receipt"}</span>
                </button>
                <button 
                  onMouseDown={() => {
                    setSearchQuery("Telebirr Sync Log"); 
                    setMobileSearchOpen(false);
                    alert(isAmharic ? "የቴሌብር ሂሳብ ማመሳሰሉ ንቁ ነው!" : "Connecting to simulated Telebirr APIs...");
                  }} 
                  className="w-full text-left px-3 py-3 hover:bg-[#0077C5]/10 rounded-lg flex items-center justify-between text-[var(--text-core)]"
                >
                  <span>📲 {isAmharic ? "የቴሌብር ዲጂታል ሪፖርት" : "Verify Telebirr Transactions"}</span>
                </button>
              </div>
            )}
          </div>
        )}

      {/* 
        EMPTY BODY ACCORDING TO REQUIREMENTS ("for now lets create it with empty body except only header")
        With an elegant, high-contrast, atmospheric presentation greeting the authenticated merchant.
      */}
      <div className="flex-grow max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-center text-center">
        <div className="max-w-xl space-y-6 select-none leading-relaxed p-8 rounded-2xl bg-[var(--bg-panel-inner)] border border-[var(--border-subtle)] shadow-inner transition-transform">
          <div className="w-16 h-16 rounded-full bg-[#0077C5]/10 text-[#0077C5] border border-[#0077C5]/20 flex items-center justify-center text-3xl mx-auto animate-bounce">
            
          </div>
          <div className="space-y-2">
            <h1 className="text-xl md:text-2xl font-black text-[var(--text-core)] tracking-tight">
              {t.welcomeTitle}
            </h1>
            <p className="text-[var(--text-sec)] text-xs md:text-sm font-medium leading-relaxed font-sans">
              {t.welcomeDesc}
            </p>
          </div>
          <div className="border-t border-[var(--border-subtle)] pt-4 flex flex-wrap gap-2 justify-center text-[10px] font-mono text-[var(--text-mute)]">
            <span className="px-2 py-1 bg-[var(--bg-core)] rounded border border-[var(--border-subtle)]">User ID: {userEmail}</span>
            <span className="px-2 py-1 bg-[var(--bg-core)] rounded border border-[var(--border-subtle)]">Locale: {selectedLanguage.code}-ET</span>
            <span className="px-2 py-1 bg-[var(--bg-core)] rounded border border-[var(--border-subtle)] uppercase">Channel Status: Secure</span>
          </div>
        </div>
      </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}
