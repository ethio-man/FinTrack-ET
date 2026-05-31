import React from "react";
import { Search, X } from "lucide-react";
import { LanguageOpt } from "../../types";

interface MobileSearchOverlayProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFocused: boolean;
  setSearchFocused: (focused: boolean) => void;
  setMobileSearchOpen: (open: boolean) => void;
  selectedLanguage: LanguageOpt;
}

export default function MobileSearchOverlay({
  searchQuery,
  setSearchQuery,
  searchFocused,
  setSearchFocused,
  setMobileSearchOpen,
  selectedLanguage,
}: MobileSearchOverlayProps) {
  const isAmharic = selectedLanguage.code === "am";
  const searchPlaceholder = isAmharic
    ? "ለመፈለግ Ctrl+K ይጫኑ..."
    : "Search dashboard (Ctrl+K)...";

  return (
    <div className="md:hidden absolute inset-0 bg-[var(--bg-panel)] z-[2000] flex flex-col p-4 animate-fade-in border-b border-[var(--border-core)]">
      <div className="flex items-center gap-3">
        <div
          className={`relative flex-1 flex items-center bg-[var(--bg-core)] border rounded-lg transition-all ${
            searchFocused
              ? "border-[#0077C5] ring-1 ring-[#0077C5]/30 shadow-sm"
              : "border-[var(--border-core)]"
          }`}
        >
          <span className="pl-3.5 text-[var(--text-sec)]">
            <Search className="w-4 h-4" />
          </span>
          <input
            id="mobile-search-input"
            type="text"
            placeholder={searchPlaceholder}
            className="w-full pl-2.5 pr-4 py-2.5 text-sm font-medium bg-transparent border-0 outline-none placeholder:text-[var(--text-mute)]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
          />
        </div>
        <button
          onClick={() => {
            setMobileSearchOpen(false);
            setSearchFocused(false);
          }}
          className="p-2 text-[var(--text-sec)] hover:bg-[var(--bg-core)] rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search Dropdown Results inside the overlay */}
      {searchFocused && (
        <div className="mt-4 bg-[var(--bg-panel-inner)] rounded-xl p-2 border border-[var(--border-subtle)] text-sm text-left shadow-lg">
          <span className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-[var(--text-mute)] px-2 mb-2 pt-1">
            Quick Ledger Commands
          </span>
          <button
            onMouseDown={() => {
              setSearchQuery("New Sale Journey");
              setMobileSearchOpen(false);
              alert(
                isAmharic
                  ? "አዲስ የሽያጭ ደረሰኝ መመዝገቢያ ማስጀመሪያ!"
                  : "Initializing simulated sales ledger form..."
              );
            }}
            className="w-full text-left px-3 py-3 hover:bg-[#0077C5]/10 rounded-lg flex items-center justify-between text-[var(--text-core)]"
          >
            <span>
              🆕 {isAmharic ? "አዲስ ሽያጭ መመዝገብ" : "Record New Sale Receipt"}
            </span>
          </button>
          <button
            onMouseDown={() => {
              setSearchQuery("Telebirr Sync Log");
              setMobileSearchOpen(false);
              alert(
                isAmharic
                  ? "የቴሌብር ሂሳብ ማመሳሰሉ ንቁ ነው!"
                  : "Connecting to simulated Telebirr APIs..."
              );
            }}
            className="w-full text-left px-3 py-3 hover:bg-[#0077C5]/10 rounded-lg flex items-center justify-between text-[var(--text-core)]"
          >
            <span>
              📲 {isAmharic ? "የቴሌብር ዲጂታል ሪፖርት" : "Verify Telebirr Transactions"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
