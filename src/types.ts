export interface CountryOpt {
  code: string;
  name: string;
  flag: string;
  redirect: string;
  currency?: string;
}

export interface LanguageOpt {
  code: string;
  name: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  basePrice: number;
  discountPrice: number;
  savedAmount: number;
  features: string[];
  isPopular?: boolean;
}

export interface TestimonialData {
  customer: string;
  business: string;
  stars: number;
  quote: string;
}
