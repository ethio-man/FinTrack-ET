import React, { useState } from 'react';
import { X, MessageCircle, Phone, Mail, FileText, ChevronRight, Check } from 'lucide-react';
import { LanguageOpt } from '../types';

interface HelpModalProps {
  onClose: () => void;
  selectedLanguage: LanguageOpt;
}

export default function HelpModal({ onClose, selectedLanguage }: HelpModalProps) {
  const isAmharic = selectedLanguage.code === 'am';
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState('');

  const t = {
    title: isAmharic ? 'እገዛ እና ድጋፍ' : 'Help & Support',
    subtitle: isAmharic ? 'እንዴት ልንረዳዎ እንችላለን?' : 'How can we help you?',
    faqs: isAmharic ? 'ተደጋጋሚ ጥያቄዎች' : 'Frequently Asked Questions',
    contactUs: isAmharic ? 'ያግኙን' : 'Contact Us',
    sendMessage: isAmharic ? 'መልዕክት ይላኩልን' : 'Send us a message',
    messagePlaceholder: isAmharic ? 'ችግርዎን እዚህ ይጻፉ...' : 'Describe your issue here...',
    send: isAmharic ? 'ላክ' : 'Send',
    sentMsg: isAmharic ? 'መልዕክትዎ በተሳካ ሁኔታ ተልኳል! በቅርቡ እናገኝዎታለን።' : 'Your message has been sent! We will get back to you shortly.',
    
    faqItems: [
      {
        q: isAmharic ? 'የይለፍ ቃል እንዴት መቀየር እችላለሁ?' : 'How do I change my PIN?',
        a: isAmharic ? 'ወደ ቅንብሮች > መገለጫ ይሂዱ እና "የመዳረሻ ፒን ቀይር" ን ጠቅ ያድርጉ።' : 'Go to Settings > Profile and click "Change Access PIN".'
      },
      {
        q: isAmharic ? 'አዲስ ቅርንጫፍ እንዴት መጨመር እችላለሁ?' : 'How do I add a new branch?',
        a: isAmharic ? 'በቡድን ገጽ ውስጥ "ቅርንጫፎች" የሚለውን ትር ይምረጡ እና "አዲስ ቅርንጫፍ" ን ጠቅ ያድርጉ። (ፕሪሚየም ያስፈልገዋል)' : 'In the Team page, select the Branches tab and click "New Branch". (Requires Premium)'
      },
      {
        q: isAmharic ? 'ሪፖርቶችን እንዴት ማውረድ እችላለሁ?' : 'How do I download reports?',
        a: isAmharic ? 'ወደ ሪፖርቶች ገጽ ይሂዱ፣ የሚፈልጉትን የጊዜ ገደብ ይምረጡ እና የውርድ አዶውን ጠቅ ያድርጉ።' : 'Go to the Reports page, select your desired date range, and click the download icon.'
      }
    ],
    supportChannels: [
      { icon: Phone, label: isAmharic ? 'ስልክ ይደውሉ' : 'Call Support', detail: '+251 900 000 000' },
      { icon: Mail, label: isAmharic ? 'ኢሜይል ይላኩ' : 'Email Us', detail: 'support@financetrack.co' },
      { icon: MessageCircle, label: isAmharic ? 'የቴሌግራም ድጋፍ' : 'Telegram Support', detail: '@FinTrackSupport' }
    ]
  };

  function handleSend() {
    if (!message.trim()) return;
    setSent(true);
    setTimeout(() => {
      onClose();
    }, 2500);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-[var(--bg-panel)] rounded-2xl shadow-2xl w-full max-w-2xl border border-[var(--border-core)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-core)] bg-[var(--bg-core)]">
          <div>
            <h3 className="text-lg font-bold text-[var(--text-core)]">{t.title}</h3>
            <p className="text-xs text-[var(--text-sec)] font-medium mt-0.5">{t.subtitle}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[var(--bg-panel-inner)] rounded-xl transition-colors">
            <X className="w-5 h-5 text-[var(--text-sec)]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* FAQs */}
          <div>
            <h4 className="text-sm font-bold text-[var(--text-core)] uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0077C5]" /> {t.faqs}
            </h4>
            <div className="space-y-3">
              {t.faqItems.map((faq, i) => (
                <div key={i} className="group p-4 bg-[var(--bg-panel-inner)] border border-[var(--border-core)] rounded-xl hover:border-[#0077C5]/50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-[var(--text-core)] mb-1">{faq.q}</p>
                      <p className="text-sm text-[var(--text-sec)]">{faq.a}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--text-mute)] group-hover:text-[#0077C5] transition-colors shrink-0 mt-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Direct Contact */}
            <div>
              <h4 className="text-sm font-bold text-[var(--text-core)] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#0077C5]" /> {t.contactUs}
              </h4>
              <div className="space-y-3">
                {t.supportChannels.map((channel, i) => (
                  <button key={i} className="w-full flex items-center gap-4 p-3 bg-[var(--bg-panel-inner)] border border-[var(--border-core)] rounded-xl hover:bg-[var(--border-core)] transition-colors text-left">
                    <div className="p-2.5 bg-[#0077C5]/10 text-[#0077C5] rounded-lg">
                      <channel.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--text-core)]">{channel.label}</p>
                      <p className="text-xs text-[var(--text-sec)] font-medium">{channel.detail}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Form */}
            <div>
              <h4 className="text-sm font-bold text-[var(--text-core)] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0077C5]" /> {t.sendMessage}
              </h4>
              {sent ? (
                <div className="h-full min-h-[140px] flex flex-col items-center justify-center text-center p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-3">
                    <Check className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-green-800 dark:text-green-300">{t.sentMsg}</p>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.messagePlaceholder}
                    className="w-full h-32 px-4 py-3 border border-[var(--border-core)] bg-[var(--bg-panel-inner)] text-[var(--text-core)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0077C5]/50 resize-none mb-3"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="w-full py-3 bg-[#0077C5] text-white rounded-xl text-sm font-bold hover:bg-[#005a96] transition-colors disabled:opacity-50 mt-auto"
                  >
                    {t.send}
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
