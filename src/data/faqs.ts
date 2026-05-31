import { FAQItem } from "../types";

export const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "What is FinTrack ET?",
    answer: "FinTrack ET is a financial intelligence and business management platform designed specifically for Ethiopian small business owners, wholesalers, kiosks, shops, and merchants. It acts like a digital accountant and business advisor, helping merchants transition securely from manual notebooks or paper records to digital tracking."
  },
  {
    id: "faq-2",
    question: "How does FinTrack ET help recover customer debts faster?",
    answer: "One of FinTrack's most popular features is its automated Debt & Credit Management. When a customer buys on credit, you can set payment due dates. The platform automatically or manually triggers tailored SMS Payment Reminders through our integrated gateway directly to the debtor's phone, which significantly improves repayment speeds."
  },
  {
    id: "faq-3",
    question: "Can I use FinTrack ET in Amharic?",
    answer: "Yes! Since accessibility is our core priority, FinTrack ET offers a complete bilingual experience supporting both English and Amharic (and Afaan Oromo in upcoming phases). The interface is simple, intuitive, and designed to be mastered in minutes even by non-technical shop managers."
  },
  {
    id: "faq-4",
    question: "Does the system work offline when my internet is unstable?",
    answer: "Absolutely. We understand that internet connections can be unstable across different regions of Ethiopia. FinTrack ET features a robust offline model allowing you to register daily sales, expenses, and debts without any connection, automatically syncing data securely with the cloud once network connectivity resumes."
  },
  {
    id: "faq-5",
    question: "How do banks or microfinance institutions use my data to offer loans?",
    answer: "Traditional banks often reject small businesses due to a lack of trustworthy formal records. FinTrack ET calculates a reliable Business Trust Score based on transaction consistency and verifiable data. With your explicit consent, lenders can review these reports to assess creditworthiness, making it easier for you to qualify for expansion loans."
  },
  {
    id: "faq-6",
    question: "Can I track Telebirr, Commercial Bank of Ethiopia (CBE), and Cash payments simultaneously?",
    answer: "Yes. FinTrack ET supports multi-payment method tracking. You can tag each invoice or sale as Cash, Telebirr, or Bank Transfer, letting you monitor your exact cash reserves across all physical and digital wallets in one unified dashboard."
  },
  {
    id: "faq-7",
    question: "Are VAT and TOT (Turnover Tax) supported?",
    answer: "Yes, our Premium tier compiles tax summaries based on active Ethiopian regulations, allowing small merchants to automatically categorize taxable transactions, prepare monthly tax summaries, and generate VAT/TOT compliance reports effortlessly."
  }
];

export const TESTIMONIALS = [
  {
    stars: 5,
    quote: '"Before FinTrack ET, I constantly lost track of listing my debtors on notebooks for my shop in Mercato. Now, automated SMS reminders retrieve my receivables in days instead of weeks!"',
    customer: "Meklit T.",
    business: "Boutique Owner, Mercato"
  },
  {
    stars: 5,
    quote: '"Manually cross-referencing Telebirr SMS messages with cash drawer payments was a daily headache. FinTrack logs transactions symmetrically, making our daily profit statements instantly clear."',
    customer: "Abebe D.",
    business: "Kiosk Merchant, Piazza"
  },
  {
    stars: 5,
    quote: '"Sharing our verified financial history statements directly with our microfinance partner helped us secure an expansion loan in record time. It built trust that paper books never could!"',
    customer: "Chala K.",
    business: "Wholesale Distributor, Bole"
  }
];

export const FOOTER_LINKS = [
  {
    title: "Operating Tiers",
    links: [
      { text: "Free Starter", href: "#pricing-section" },
      { text: "Monthly Plan", href: "#pricing-section" },
      { text: "Annual Plan (Discounted)", href: "#pricing-section" }
    ]
  },
  {
    title: "Core Capabilities",
    links: [
      { text: "Sales & Expense tracking", href: "#" },
      { text: "Customer Debt Ledgers (SMS)", href: "#" },
      { text: "Inventory & Low Stock Alerts", href: "#" },
      { text: "Telebirr & Bank Wallet Sync", href: "#" },
      { text: "VAT & TOT Reports Compiler", href: "#" }
    ]
  },
  {
    title: "Lending Partner Scoring",
    links: [
      { text: "Business Trust Score", href: "#" },
      { text: "Consent-Based Bank Reporting", href: "#" },
      { text: "Credit Score Analytics", href: "#" },
      { text: "Verify Transactions Scheme", href: "#" }
    ]
  },
  {
    title: "Ethiopian Help Desk",
    links: [
      { text: "Telebirr Integration Guide", href: "#" },
      { text: "CBE Birr Wallet Settings", href: "#" },
      { text: "How to export PDF/Excel", href: "#" },
      { text: "Amharic Interactive Support", href: "#" }
    ]
  }
];
