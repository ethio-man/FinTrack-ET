import React, { useState, useEffect } from "react";
import { LanguageOpt } from "../types";
import Sidebar from "./Sidebar";
import MobileBottomNav from "./MobileBottomNav";
import FinancialOverviewDashboard from "./FinancialOverviewDashboard";
import DashboardHeader from "./Dashboard/DashboardHeader";
import MobileSearchOverlay from "./Dashboard/MobileSearchOverlay";
import PlaceholderContent from "./Dashboard/PlaceholderContent";
import SalesPage from "./SalesPage";
import ExpensesPage from "./Expenses/ExpensesPage";
import DebtsPage from "./Debts/DebtsPage";
import InventoryPage from "./Inventory/InventoryPage";

interface DashboardHomeProps {
  userEmail: string;
  selectedLanguage: LanguageOpt;
  onSelectLanguage: (lang: LanguageOpt) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
}

export default function DashboardHome({
  userEmail,
  selectedLanguage,
  onSelectLanguage,
  isDarkMode,
  onToggleDarkMode,
  onLogout,
}: DashboardHomeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");

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

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--bg-core)] text-[var(--text-core)] transition-colors duration-300 font-sans" id="dashboard-main">
      <Sidebar selectedLanguage={selectedLanguage} activeItem={activeTab} setActiveItem={setActiveTab} />
      
      <div className="flex-1 flex flex-col h-full relative overflow-y-auto pb-16 md:pb-0">
        <DashboardHeader
          userEmail={userEmail}
          selectedLanguage={selectedLanguage}
          onSelectLanguage={onSelectLanguage}
          isDarkMode={isDarkMode}
          onToggleDarkMode={onToggleDarkMode}
          onLogout={onLogout}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchFocused={searchFocused}
          setSearchFocused={setSearchFocused}
          setMobileSearchOpen={setMobileSearchOpen}
        />

        {mobileSearchOpen && (
          <MobileSearchOverlay
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchFocused={searchFocused}
            setSearchFocused={setSearchFocused}
            setMobileSearchOpen={setMobileSearchOpen}
            selectedLanguage={selectedLanguage}
          />
        )}

        {/* MAIN CONTENT AREA */}
        {activeTab === "Dashboard" ? (
          <FinancialOverviewDashboard selectedLanguage={selectedLanguage} />
        ) : activeTab === "Sales" ? (
          <SalesPage selectedLanguage={selectedLanguage} />
        ) : activeTab === "Expenses" ? (
          <ExpensesPage language={selectedLanguage} />
        ) : activeTab === "Debts" ? (
          <DebtsPage selectedLanguage={selectedLanguage} />
        ) : activeTab === "Inventory" ? (
          <InventoryPage selectedLanguage={selectedLanguage} />
        ) : (
          <PlaceholderContent
            activeTab={activeTab}
            userEmail={userEmail}
            selectedLanguage={selectedLanguage}
          />
        )}
      </div>

      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
