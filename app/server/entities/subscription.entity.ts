// Subscription entity definitions
export interface SubscriptionEntity {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  planId: string;
  stripePriceId?: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete';
  cancelAtPeriodEnd: boolean;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionPlanEntity {
  planId: string;
  regionId: string;
  amount: number;
  interval: string;
}

export interface SubscriptionResponseEntity {
  active: boolean;
  subscription?: SubscriptionEntity;
  plan?: SubscriptionPlanEntity;
}

export interface SubscriptionActionEntity {
  action: 'cancel' | 'reactivate' | 'cancel-immediately';
  subscriptionId: string;
  userId: string;
}

export interface SubscriptionActionResponseEntity {
  success: boolean;
  message: string;
}

// Validation functions
export function validateSubscriptionRequest(userId?: string): { isValid: boolean; error?: string } {
  if (!userId) {
    return { isValid: false, error: "Missing userId parameter" };
  }
  
  return { isValid: true };
}

export function validateSubscriptionAction(action: string, subscriptionId?: string, userId?: string): { isValid: boolean; error?: string } {
  if (!action || !subscriptionId || !userId) {
    return { isValid: false, error: "Missing required parameters" };
  }
  
  const validActions = ['cancel', 'reactivate', 'cancel-immediately'];
  if (!validActions.includes(action)) {
    return { isValid: false, error: "Invalid action" };
  }
  
  return { isValid: true };
}