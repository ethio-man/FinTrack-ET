import React, { useState, useEffect } from "react";
import { LanguageOpt } from "../types";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: LanguageOpt;
  initialView?: "signin" | "signup";
  onLoginSuccess?: (email: string) => void;
}

type ModalView = "signin" | "signup" | "forgot" | "success";

export default function LoginModal({ 
  isOpen, 
  onClose, 
  selectedLanguage, 
  initialView = "signin",
  onLoginSuccess
}: LoginModalProps) {
  const [view, setView] = useState<ModalView>(initialView);

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
    }
  }, [isOpen, initialView]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const isAmharic = selectedLanguage.code === "am";

  // Form Validation and Handler
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError(isAmharic ? "እባክዎን ኢሜይል ወይም ስልክ ቁጥር ያስገቡ" : "Please enter your email or phone number.");
      return;
    }
    if (!password) {
      setError(isAmharic ? "እባክዎን የይለፍ ቃል ያስገቡ" : "Please enter your password.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg(
        isAmharic
          ? `እንኳን በደህና መጡ! በ${email} በተሳካ ሁኔታ ገብተዋል። በምርት ደረጃ ይህ በኢትዮጵያ የቴሌብር/ሲቢኢ (Telebirr/CBE OTP) ማረጋገጫ ጋር ይገናኛል።`
          : `Welcome back! Signed in successfully as ${email}. Live implementation redirects to OTP verification.`
      );
      setView("success");
    }, 1200);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError(isAmharic ? "እባክዎን ሙሉ ስምዎን ያስገቡ" : "Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setError(isAmharic ? "እባክዎን የንግድ ስልክ ወይም ኢሜይል ያስገቡ" : "Please enter a merchant phone or email.");
      return;
    }
    if (!password || password.length < 6) {
      setError(
         isAmharic
           ? "የይለፍ ቃል ቢያንስ 6 ፊደላት ወይም ቁጥሮች መሆን አለበት"
           : "Password must be at least 6 characters long."
      );
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg(
        isAmharic
          ? `በተሳካ ሁኔታ ተመዝግበዋል! የፊንትራክ ነጋዴ ሂሳብዎ ተዘጋጅቷል።`
          : `Account successfully created! Your FinTrack ET merchant profile is ready.`
      );
      setView("success");
    }, 1200);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError(isAmharic ? "እባክዎን የኢሜይል አድራሻዎን ወይም ስልክዎን ያስገቡ" : "Please enter your verified email or phone number.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg(
        isAmharic
          ? `የይለፍ ቃል መቀየሪያ መመሪያ ወይም ኮድ በኤስኤምኤስ (SMS OTP) ወደ ${email} ተልኳል።`
          : `We've sent a verification OTP/instruction link to ${email}.`
      );
      setView("success");
    }, 1000);
  };

  const resetModalState = () => {
    const wasSuccess = view === "success";
    setView("signin");
    setEmail("");
    setPassword("");
    setFullName("");
    setError(null);
    setSuccessMsg("");
    onClose();
    if (wasSuccess && onLoginSuccess) {
      onLoginSuccess(email || "merchant@fintrack.et");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999999] flex items-center justify-center p-4 transition-all animate-fade-in">
      {/* Outer Click to Close */}
      <div className="absolute inset-0" onClick={resetModalState} />

      {/* LinkedIn Inspired Box adjusted for FinTrack slate/light guidelines */}
      <div className="relative bg-[var(--bg-panel)] text-[var(--text-core)] border border-[var(--border-core)] rounded-xl shadow-2xl w-full max-w-[450px] p-8 md:p-10 z-[10] transition-colors overflow-hidden">
        
        {/* Close Button Right Corner */}
        <button
          onClick={resetModalState}
          className="absolute top-5 right-5 text-[var(--text-sec)] hover:text-[var(--text-core)] hover:bg-white/5 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer font-bold font-mono text-sm leading-none"
          title="Close Dialog"
        >
          ✕
        </button>

        {/* Branding Logo Block */}
        <div className="mb-6 flex justify-start">
          <div className="flex items-center gap-2 border border-[#0077C5]/10 dark:border-white/10 rounded-lg px-3.5 py-1.5 bg-white select-none transition-shadow">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36" className="w-7 h-7 flex-shrink-0">
              <path fill="#0077C5" d="M18 36c9.9411 0 18-8.0589 18-18 0-9.94114-8.0589-18-18-18C8.05886 0 0 8.05886 0 18c0 9.9411 8.05886 18 18 18Z" />
              <path fill="white" d="M23 11H13a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V13a2 2 0 00-2-2zm-1 8h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z" />
            </svg>
            <div className="flex flex-col text-left leading-none font-sans">
              <span className="text-[8px] font-black tracking-[0.16em] text-[#0077C5] uppercase">FINTRACK</span>
              <span className="text-xs font-black text-slate-900 tracking-tight leading-none mt-0.5">et</span>
            </div>
          </div>
        </div>

        {/* Dynamic Views */}
        {view === "signin" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-[32px] font-black tracking-tight text-[var(--text-core)] leading-none">
                {isAmharic ? "ይግቡ" : "Sign in"}
              </h1>
              <p className="text-[var(--text-sec)] text-sm font-medium">
                {isAmharic ? "በራስዎ የሱቅ ሂሳብ እና ሽያጭ ወቅታዊ መረጃ ያግኙ" : "Stay updated on your store's finances"}
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 p-3 text-xs rounded-none font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email or Phone Input */}
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder={isAmharic ? "ኢሜይል ወይም ስልክ ቁጥር" : "Email or Phone Number"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--border-core)] focus:border-[#0077C5] focus:ring-1 focus:ring-[#0077C5] bg-[var(--bg-core)] text-[var(--text-core)] font-medium text-sm rounded-md outline-none transition-all placeholder:text-[var(--text-mute)]"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <input
                  type="password"
                  placeholder={isAmharic ? "የይለፍ ቃል" : "Password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--border-core)] focus:border-[#0077C5] focus:ring-1 focus:ring-[#0077C5] bg-[var(--bg-core)] text-[var(--text-core)] font-medium text-sm rounded-md outline-none transition-all placeholder:text-[var(--text-mute)]"
                />
              </div>

              <div className="text-left py-1">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setView("forgot");
                  }}
                  className="text-xs font-black text-[#0077C5] hover:underline cursor-pointer tracking-wide"
                >
                  {isAmharic ? "የይለፍ ቃል ረስተዋል?" : "Forgot Password?"}
                </button>
              </div>

              {/* Submit Sign in Button - Rounded Full like LinkedIn */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#0077C5] hover:bg-[#005FA3] text-white text-sm font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  isAmharic ? "ይግቡ" : "Sign in"
                )}
              </button>
            </form>

            <div className="text-center pt-4 border-t border-[var(--border-core)] text-xs text-[var(--text-sec)]">
              <span>{isAmharic ? "ለፊንትራክ አዲስ ነዎት? " : "New to FinTrack ET? "}</span>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setView("signup");
                }}
                className="text-[#0077C5] font-black hover:underline tracking-wide cursor-pointer"
              >
                {isAmharic ? "አሁኑኑ ይመዝገቡ" : "Join now"}
              </button>
            </div>
          </div>
        )}

        {view === "signup" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-[32px] font-black tracking-tight text-[var(--text-core)] leading-none">
                {isAmharic ? "ነጻ ይመዝገቡ" : "Join today"}
              </h1>
              <p className="text-[var(--text-sec)] text-sm font-medium">
                {isAmharic ? "የሽያጭና እዳ መከታተያ አካውንት በጥቂት ሴኮንዶች ውስጥ ይክፈቱ" : "Create your merchant account in seconds"}
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 p-3 text-xs rounded-none font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder={isAmharic ? "ሙሉ ስም" : "Full Name"}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--border-core)] focus:border-[#0077C5] focus:ring-1 focus:ring-[#0077C5] bg-[var(--bg-core)] text-[var(--text-core)] font-medium text-sm rounded-md outline-none transition-all placeholder:text-[var(--text-mute)]"
                />
              </div>

              {/* Email or Phone Input */}
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder={isAmharic ? "ኢሜይል ወይም ስልክ ቁጥር" : "Email or Phone Number"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--border-core)] focus:border-[#0077C5] focus:ring-1 focus:ring-[#0077C5] bg-[var(--bg-core)] text-[var(--text-core)] font-medium text-sm rounded-md outline-none transition-all placeholder:text-[var(--text-mute)]"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <input
                  type="password"
                  placeholder={isAmharic ? "የይለፍ ቃል (ከ 6 ፊደላት በላይ)" : "Password (6+ characters)"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--border-core)] focus:border-[#0077C5] focus:ring-1 focus:ring-[#0077C5] bg-[var(--bg-core)] text-[var(--text-core)] font-medium text-sm rounded-md outline-none transition-all placeholder:text-[var(--text-mute)]"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#0077C5] hover:bg-[#005FA3] text-white text-sm font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  isAmharic ? "ይመዝገቡ" : "Agree & Join"
                )}
              </button>
            </form>

            <div className="text-center pt-4 border-t border-[var(--border-core)] text-xs text-[var(--text-sec)]">
              <span>{isAmharic ? "ከዚህ በፊት አካውንት ነበረዎት? " : "Already on FinTrack ET? "}</span>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setView("signin");
                }}
                className="text-[#0077C5] font-black hover:underline tracking-wide cursor-pointer"
              >
                {isAmharic ? "ይግቡ" : "Sign in"}
              </button>
            </div>
          </div>
        )}

        {view === "forgot" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-[32px] font-black tracking-tight text-[var(--text-core)] leading-none">
                {isAmharic ? "የይለፍ ቃል ቀይር" : "Reset Password"}
              </h1>
              <p className="text-[var(--text-sec)] text-sm font-medium">
                {isAmharic ? "ሂሳብዎ የተዘጋጀበትን ኢሜይል ወይም ስልክ ያስገቡ" : "Enter your registered email or phone number to reset"}
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 p-3 text-xs rounded-none font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleForgot} className="space-y-4">
              {/* Email or Phone Input */}
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder={isAmharic ? "ኢሜይል ወይም ስልክ ቁጥር" : "Email or Phone Number"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--border-core)] focus:border-[#0077C5] focus:ring-1 focus:ring-[#0077C5] bg-[var(--bg-core)] text-[var(--text-core)] font-medium text-sm rounded-md outline-none transition-all placeholder:text-[var(--text-mute)]"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#0077C5] hover:bg-[#005FA3] text-white text-sm font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  isAmharic ? "ላክ" : "Send reset code"
                )}
              </button>
            </form>

            <div className="text-center pt-4 border-t border-[var(--border-core)] text-xs text-[var(--text-sec)]">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setView("signin");
                }}
                className="text-[#0077C5] font-black hover:underline tracking-wide cursor-pointer"
              >
                {isAmharic ? "ወደ መግቢያ ተመለስ" : "Back to sign in"}
              </button>
            </div>
          </div>
        )}

        {view === "success" && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 bg-[#0077C5]/10 text-[#0077C5] border border-[#0077C5]/20 rounded-full flex items-center justify-center text-3xl mx-auto animate-pulse">
              ✓
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold uppercase tracking-wider text-[var(--text-core)]">
                {isAmharic ? "ድርጊቱ ተጠናቋል" : "Success"}
              </h2>
              <p className="text-[var(--text-sec)] text-sm leading-relaxed">
                {successMsg}
              </p>
            </div>
            <button
              onClick={resetModalState}
              className="w-full py-3.5 bg-[#0077C5] hover:bg-[#005FA3] text-white text-xs font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer"
            >
              {isAmharic ? "ተረድቻለሁ ፣ ዝጋ" : "Close & Continue"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
