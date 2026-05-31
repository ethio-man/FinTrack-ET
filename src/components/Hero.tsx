import React from "react";
import { LanguageOpt } from "../types";
import { TRANSLATIONS } from "../data/translations";

interface HeroProps {
  selectedLanguage: LanguageOpt;
  onOpenLogin: (view: "signin" | "signup") => void;
}

export default function Hero({ selectedLanguage, onOpenLogin }: HeroProps) {
  const t = TRANSLATIONS[selectedLanguage.code] || TRANSLATIONS.en;
  const h = t.hero;

  return (
    <div
      data-testid="Rw2Hero"
      data-tracking="rw2_hero"
      className="Rw2Hero_root__4dd32c7a Rw2Hero_backgroundBlue__4dd32c7a Rw2Hero_contentDefault__4dd32c7a Rw2Hero_heightDefault__4dd32c7a Rw2Hero_mblAlignCenter__4dd32c7a py-20 bg-[var(--bg-core)] text-[var(--text-core)] border-b border-[var(--border-core)] relative overflow-hidden transition-colors"
    >
      {/* Subtle background visual grid or details */}
      <div className="absolute left-10 top-1/4 select-none opacity-5 font-mono text-xs tracking-widest uppercase pointer-events-none whitespace-pre leading-loose text-[var(--text-sec)]">
        {h.engineLabel + "\n" + h.engineDb + "\n" + h.engineRegion + "\n" + h.engineStatus}
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Copy Container */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-6">
          <div className="Responsivetext_responsivetext__ccda7d66 text-[#0077C5] font-mono text-xs uppercase tracking-widest">
            {h.tag}
          </div>
          <h1 className="text-4xl lg:text-[68px] lg:leading-[0.95] font-black tracking-tighter uppercase text-[var(--text-core)] font-sans">
            {h.titleMain} <br />
            <span className="text-transparent text-outline" style={{ WebkitTextStroke: "1.5px var(--text-core)" }}>
              {h.titleHighlight}
            </span>
          </h1>
          <p className="text-base lg:text-lg text-[var(--text-sec)] max-w-xl leading-relaxed font-sans font-medium">
            {h.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => onOpenLogin("signup")}
              className="inline-block py-3.5 px-8 text-xs font-bold tracking-widest uppercase rounded-full bg-[#0077C5] text-white hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              {h.buttonStart}
            </button>
            <a
              href="#pricing-section"
              className="inline-block py-3.5 px-8 text-xs font-bold tracking-widest uppercase rounded-full border border-[var(--text-core)] text-[var(--text-core)] hover:bg-[var(--text-core)] hover:text-[var(--bg-core)] transition-all duration-300 hover:scale-105"
            >
              {h.buttonExplore}
            </a>
          </div>
        </div>

        {/* Right Asset Container */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <div className="bg-[var(--bg-panel)] p-1 rounded-2xl border border-[var(--border-core)] shadow-2xl relative overflow-hidden w-full max-w-md lg:max-w-full group hover:border-[#0077C5]/30 transition-all duration-300">
            {/* Decorative dots in panel frame */}
            <div className="flex space-x-2 px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-panel-inner)] transition-colors">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              <span className="text-[9px] font-mono tracking-widest uppercase opacity-30 ml-4 flex-1 text-right text-[var(--text-sec)]">FINTRACK_ET v1.0 PROD</span>
            </div>
            <div className="p-4 bg-[var(--bg-core)] flex justify-center items-center relative transition-colors">
              {/* Subtle light blue ambient glow */}
              <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-[#0077C5]/10 to-transparent blur-2xl pointer-events-none" />
              <img
                className="w-full h-auto object-contain rounded-lg transition-transform duration-500 group-hover:scale-[1.01] transition-all"
                style={{ filter: "var(--filter-invert)" }}
                src="../../assets/public/hero.png"
                alt="FinTrack ET financial intelligence platform display on laptop device interface"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
