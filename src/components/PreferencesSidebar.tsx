import React, { useMemo } from "react";
import { LANGUAGES } from "../data/countries";
import { CountryOpt, LanguageOpt } from "../types";

interface PreferencesSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCountry: CountryOpt;
  setSelectedCountry: (c: CountryOpt) => void;
  selectedLanguage: LanguageOpt;
  setSelectedLanguage: (l: LanguageOpt) => void;
}

export default function PreferencesSidebar({
  isOpen,
  onClose,
  selectedLanguage,
  setSelectedLanguage
}: PreferencesSidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Background Overlay */}
      <div
        id="country-switcher-bg"
        className="active cursor-pointer"
        onClick={onClose}
      />

      {/* Preferences Sidebar Slide-in */}
      <div
        id="country-selector-sidebar"
        className="active"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          top: "15%",
          width: "90%",
          maxWidth: "400px",
          position: "fixed",
          pointerEvents: "auto",
        }}
      >
        <div className="country-selector-container bg-[#111111] border border-white/10 shadow-2xl rounded-none">
          {/* Header */}
          <div className="top-section rounded-none relative !bg-black text-white p-6 border-b border-white/10">
            <strong className="country-selector-container__heading text-xs font-mono tracking-widest uppercase block text-[#0077C5]">
              // PLATFORM CONFIGURATION
            </strong>
            <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider block mt-1">
              Select System Language • ቋንቋ ይምረጡ
            </span>
            <button
              onClick={onClose}
              className="toggle-close absolute top-5 right-5 text-[#0077C5] hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.158 11.8519C18.9158 11.6097 18.5873 11.4737 18.2448 11.4737C17.9023 11.4737 17.5738 11.6097 17.3316 11.8519L15.5 13.6731L13.6787 11.8429C13.5598 11.7193 13.4174 11.6207 13.2599 11.5528C13.1024 11.4849 12.9329 11.4491 12.7614 11.4473C12.59 11.4456 12.4198 11.478 12.261 11.5428C12.1022 11.6075 11.9578 11.7032 11.8364 11.8243C11.7149 11.9454 11.6188 12.0895 11.5537 12.2481C11.4885 12.4068 11.4556 12.5768 11.4568 12.7483C11.458 12.9198 11.4934 13.0893 11.5609 13.247C11.6284 13.4047 11.7265 13.5474 11.8497 13.6667L13.6736 15.4996L11.8446 17.3208C11.721 17.4398 11.6224 17.5822 11.5545 17.7397C11.4866 17.8972 11.4508 18.0666 11.449 18.2381C11.4473 18.4096 11.4798 18.5797 11.5445 18.7385C11.6092 18.8974 11.7049 19.0417 11.826 19.1632C11.9471 19.2846 12.0912 19.3807 12.2498 19.4459C12.4085 19.5111 12.5785 19.544 12.75 19.5427C12.9215 19.5415 13.091 19.5061 13.2487 19.4387C13.4064 19.3712 13.5491 19.273 13.6684 19.1498L15.5 17.326L17.3212 19.155C17.4402 19.2785 17.5826 19.3771 17.7401 19.445C17.8976 19.5129 18.067 19.5488 18.2385 19.5505C18.41 19.5522 18.5801 19.5198 18.739 19.4551C18.8978 19.3903 19.0421 19.2946 19.1636 19.1735C19.285 19.0524 19.3811 18.9084 19.4463 18.7497C19.5115 18.5911 19.5444 18.421 19.5432 18.2495C19.5419 18.078 19.5065 17.9085 19.4391 17.7508C19.3716 17.5931 19.2734 17.4505 19.1502 17.3311L17.3264 15.4996L19.1554 13.6783C19.3979 13.4364 19.5344 13.1081 19.5349 12.7656C19.5354 12.4231 19.3998 12.0945 19.158 11.8519Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
          </div>

          {/* Body Content */}
          <div className="bottom-section p-5 rounded-none" style={{ backgroundColor: "#ffffff" }}>
            <div className="lang-tab active flex flex-col h-40 w-full">
              <div className="lang-select-list overflow-y-auto flex-1 divide-y divide-gray-100 space-y-1">
                {LANGUAGES.map((l) => (
                  <div
                    key={l.code}
                    onClick={() => setSelectedLanguage(l)}
                    className={`lang-select-item p-3 flex items-center justify-between text-xs transition-colors cursor-pointer rounded-none ${
                      selectedLanguage.code === l.code 
                        ? "bg-[#0077C5]/10 !text-[#0077C5] font-bold" 
                        : "!text-black hover:bg-gray-100"
                    }`}
                  >
                    <span>{l.name}</span>
                    {selectedLanguage.code === l.code && (
                      <span className="text-[#0077C5] font-bold text-sm">✓</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="button-wrapper mt-4">
                <button
                  onClick={onClose}
                  className="choose-language w-full py-3 px-4 rounded-none bg-[#0077C5] text-white font-mono uppercase tracking-widest text-xs font-black hover:bg-black hover:text-white transition-all cursor-pointer"
                >
                  Save preferences / ምርጫዎች አስቀምጥ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
