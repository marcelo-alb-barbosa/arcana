// Checkout session entity definitions
export interface CheckoutSessionRequest {
  planId: string;
  regionId: string;
  userId?: string;
}

export interface Plan {
  id: string;
  interval: 'month' | 'quarter' | 'year';
  title?: string;
  description?: string;
}

export interface Region {
  id: string;
  currencyCode: string;
  name?: string;
}

export interface RegionalPlanContent {
  title: string;
  description: string;
}

export interface CheckoutSessionResponse {
  url?: string;
  error?: string;
}

// Validation functions
export function validateCheckoutSessionRequest(request: Partial<CheckoutSessionRequest>): { isValid: boolean; error?: string } {
  if (!request.planId || !request.regionId) {
    return { isValid: false, error: "Missing required parameters" };
  }

  if (request.planId.trim() === "" || request.regionId.trim() === "") {
    return { isValid: false, error: "Plan ID and Region ID cannot be empty" };
  }

  return { isValid: true };
}