import Stripe from 'stripe';

// Initialize Stripe with the secret key from environment variables
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // Use the latest API version
  appInfo: {
    name: 'ARCANA',
    version: '1.0.0',
  },
});

// Helper function to format amount based on currency
export const formatAmountForStripe = (
  amount: number,
  currency: string
): number => {
  const currencies = ['BRL', 'USD', 'EUR', 'GBP'];
  const multiplier = currencies.includes(currency.toUpperCase()) ? 100 : 1;
  return Math.round(amount * multiplier);
};

// Helper function to format amount for display
export const formatAmountFromStripe = (
  amount: number,
  currency: string
): number => {
  const currencies = ['BRL', 'USD', 'EUR', 'GBP'];
  const divider = currencies.includes(currency.toUpperCase()) ? 100 : 1;
  return amount / divider;
};

// Helper function to format currency for display
export const formatCurrency = (
  amount: number,
  currency: string,
  locale: string = 'pt-BR'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};