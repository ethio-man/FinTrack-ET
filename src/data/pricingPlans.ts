import { PricingPlan } from "../types";

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Free Starter",
    basePrice: 0,
    discountPrice: 0,
    savedAmount: 0,
    features: [
      "Basic tracking of daily sales",
      "Record essential expense entries",
      "Saves up to 10 customer/supplier debt records",
      "Simple cash balance overview",
      "Mobile-friendly offline fallback",
      "Single user (Business Owner access)"
    ]
  },
  {
    id: "monthly",
    name: "Monthly",
    basePrice: 400,
    discountPrice: 300,
    savedAmount: 100,
    features: [
      "Full sales & operational expense records",
      "Dynamic customer & supplier debt ledgers",
      "Set payment due dates & deadlines",
      "Generate and print professional receipt invoices",
      "Weekly profit & cash flow summaries",
      "Up to 2 users (Owner + Accountant)"
    ]
  },
  {
    id: "annual",
    name: "Annual",
    basePrice: 300,
    discountPrice: 199,
    savedAmount: 101,
    isPopular: true,
    features: [
      "All Monthly features included",
      "Save over 40% compared to Monthly billing",
      "Automated low stock alerts & product monitoring",
      "SMS Debt reminders via integrated gateway",
      "Audit logs, fraud prevention & branch support",
      "Unlimited users & multi-branch tracking",
      "Priority local bank support & setup assistance"
    ]
  }
];
