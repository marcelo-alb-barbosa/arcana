// Plan entity definitions
export interface PlanEntity {
  id: string;
  type: string;
  popular?: boolean;
  active: boolean;
}

export interface RegionalPriceEntity {
  id: string;
  planId: string;
  regionId: string;
  amount: number;
  interval: string;
  stripePriceId: string;
  active: boolean;
}

export interface RegionalPlanContentEntity {
  regionId: string;
  planId: string;
  title: string;
  description: string;
  features?: string[];
  active: boolean;
}

export interface RegionEntity {
  id: string;
  name: string;
  currencyCode: string;
  locale: string;
}

export interface PlanWithPricesEntity {
  id: string;
  type: string;
  popular: boolean;
  regionalContent: {
    regionId: string;
    title: string;
    description: string;
    features: string[];
  }[];
  prices: {
    id: string;
    amount: number;
    interval: string;
    stripePriceId: string;
  }[];
}

export interface PlansResponseEntity {
  region: {
    id: string;
    name: string;
    currencyCode: string;
    locale: string;
  };
  plans: PlanWithPricesEntity[];
  price?: number;
}

// Validation functions
export function validatePlanRequest(regionId?: string, planId?: string): { isValid: boolean; error?: string } {
  // Both parameters are optional, but if planId is provided, regionId should also be provided
  if (planId && !regionId) {
    return { isValid: false, error: "Region ID is required when Plan ID is provided" };
  }

  return { isValid: true };
}