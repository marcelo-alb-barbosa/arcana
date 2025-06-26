import { prisma } from './prisma';
import { getRegionFromIp, getRegionById, getActiveRegions } from './ip-utils';

export type Region = {
  id: string
  name: string
  currencyCode: string
  locale: string
  active?: boolean
}

export type RegionalPlanContent = {
  regionId: string
  title: string
  description: string
  features?: string[]
}

export type SubscriptionPlan = {
  id: string
  interval: "month" | "quarter" | "year"
  type: string
  active?: boolean
  popular?: boolean
  stripePriceId?: string
  regionalContent?: RegionalPlanContent[]
}

export type RegionalPrice = {
  id?: string
  planId: string
  regionId: string
  amount: number
  interval: string
  active?: boolean
  stripePriceId?: string
  savings?: number
}

export type SubscriptionStatus = {
  active: boolean
  plan?: SubscriptionPlan
  region?: Region
  price?: number
  startDate?: string
  endDate?: string
  autoRenew: boolean
  nextBillingDate?: string
  subscription?: any // The subscription object from the database
}

// Get regions from database
export async function getRegions(): Promise<Region[]> {
  // Check if we're running on the server or client
  if (typeof window === 'undefined') {
    // Server-side: Use Prisma directly
    try {
      const regions = await getActiveRegions();
      return regions;
    } catch (error) {
      console.error('Error fetching regions (server):', error);
      // Fallback to default regions if database query fails
      return [
        {
          id: "BR",
          name: "Brasil",
          currencyCode: "BRL",
          locale: "pt-BR",
          active: true,
        }
      ];
    }
  } else {
    // Client-side: Use API endpoint
    try {
      const baseUrl = window.location.origin;

      // Try to fetch from the API endpoint
      try {
        const response = await fetch(`${baseUrl}/api/plans`);

        if (response.ok) {
          const data = await response.json();

          if (data.region) {
            // If the API returns a single region, return it as an array
            return [data.region];
          }
        }
      } catch (fetchError) {
        console.error('Error fetching from API:', fetchError);
        // Continue to fallback if fetch fails
      }

      // Fallback to default regions if API call fails or returns invalid data
      console.log('Using fallback regions');
      return [
        {
          id: "BR",
          name: "Brasil",
          currencyCode: "BRL",
          locale: "pt-BR",
          active: true,
        },
        {
          id: "US",
          name: "United States",
          currencyCode: "USD",
          locale: "en-US",
          active: true,
        },
        {
          id: "EU",
          name: "Europe",
          currencyCode: "EUR",
          locale: "en-GB",
          active: true,
        }
      ];
    } catch (error) {
      console.error('Error fetching regions (client):', error);
      // Fallback to default regions
      return [
        {
          id: "BR",
          name: "Brasil",
          currencyCode: "BRL",
          locale: "pt-BR",
          active: true,
        },
        {
          id: "US",
          name: "United States",
          currencyCode: "USD",
          locale: "en-US",
          active: true,
        },
        {
          id: "EU",
          name: "Europe",
          currencyCode: "EUR",
          locale: "en-GB",
          active: true,
        }
      ];
    }
  }
}

// Get plans from database
export async function getPlans(): Promise<SubscriptionPlan[]> {
  // Check if we're running on the server or client
  if (typeof window === 'undefined') {
    // Server-side: Use Prisma directly
    try {
      const plans = await prisma.plan.findMany({
        where: { active: true },
      });

      // Get all prices to determine intervals
      const allPrices = await prisma.regionalPrice.findMany({
        where: { active: true },
      });

      // Get regional content for plans
      const regionalContent = await prisma.regionalPlanContent.findMany({
        where: { active: true },
      });

      return plans.map(plan => {
        // Find prices for this plan
        const planPrices = allPrices.filter(price => price.planId === plan.id);

        // Determine the interval from the prices if available
        let interval: "month" | "quarter" | "year" = "month"; // Default to month
        if (planPrices.length > 0) {
          // Use the first price's interval or default to month
          interval = planPrices[0].interval as "month" | "quarter" | "year" || "month";
        }

        // Find regional content for this plan
        const planRegionalContent = regionalContent
          .filter(content => content.planId === plan.id)
          .map(content => ({
            regionId: content.regionId,
            title: content.title,
            description: content.description,
            features: content.features,
          }));

        return {
          id: plan.id,
          interval,
          type: plan.type,
          active: plan.active,
          popular: plan.popular || false,
          regionalContent: planRegionalContent.length > 0 ? planRegionalContent : undefined,
        };
      });
    } catch (error) {
      console.error('Error fetching plans (server):', error);
      return [];
    }
  } else {
    // Client-side: Use API endpoint
    try {
      const baseUrl = window.location.origin;

      // Try to fetch from the API endpoint
      try {
        const response = await fetch(`${baseUrl}/api/plans`);

        if (response.ok) {
          const data = await response.json();

          if (data.plans && Array.isArray(data.plans) && data.plans.length > 0) {
            return data.plans.map((plan: any) => {
              // Determine the interval from the prices if available
              let interval: "month" | "quarter" | "year" = "month"; // Default to month
              if (plan.prices && plan.prices.length > 0) {
                // Use the first price's interval or default to month
                interval = plan.prices[0].interval as "month" | "quarter" | "year" || "month";
              }

              return {
                id: plan.id,
                interval,
                type: plan.type,
                active: true,
                popular: plan.popular || false,
                regionalContent: plan.regionalContent,
              };
            });
          }
        }
      } catch (fetchError) {
        console.error('Error fetching plans from API:', fetchError);
        // Continue to fallback if fetch fails
      }

      // Fallback to default plans if API call fails or returns invalid data
      console.log('Using fallback plans');
      return [
        {
          id: "mystic",
          interval: "month",
          type: "basic",
          active: true,
          popular: false,
          regionalContent: [
            {
              regionId: "BR",
              title: "Místico",
              description: "Acesso mensal às leituras dos arcanos",
              features: ["Leitura diária ilimitada", "Acesso a 10 arcanos", "Histórico de leituras"]
            },
            {
              regionId: "US",
              title: "Mystic",
              description: "Monthly access to arcana readings",
              features: ["Unlimited daily readings", "Access to 10 arcana", "Reading history"]
            },
            {
              regionId: "EU",
              title: "Mystique",
              description: "Accès mensuel aux lectures des arcanes",
              features: ["Lectures quotidiennes illimitées", "Accès à 10 arcanes", "Historique des lectures"]
            }
          ]
        },
        {
          id: "oracle",
          interval: "quarter",
          type: "intermediate",
          active: true,
          popular: true,
          regionalContent: [
            {
              regionId: "BR",
              title: "Oráculo",
              description: "Acesso trimestral às leituras dos arcanos",
              features: ["Leitura diária ilimitada", "Acesso a todos os arcanos", "Histórico de leituras", "Análises aprofundadas"]
            },
            {
              regionId: "US",
              title: "Oracle",
              description: "Quarterly access to arcana readings",
              features: ["Unlimited daily readings", "Access to all arcana", "Reading history", "In-depth analyses"]
            },
            {
              regionId: "EU",
              title: "Oracle",
              description: "Accès trimestriel aux lectures des arcanes",
              features: ["Lectures quotidiennes illimitées", "Accès à tous les arcanes", "Historique des lectures", "Analyses approfondies"]
            }
          ]
        },
        {
          id: "master",
          interval: "year",
          type: "premium",
          active: true,
          popular: false,
          regionalContent: [
            {
              regionId: "BR",
              title: "Mestre",
              description: "Acesso anual às leituras dos arcanos",
              features: ["Leitura diária ilimitada", "Acesso a todos os arcanos", "Histórico de leituras", "Leituras personalizadas", "Suporte prioritário"]
            },
            {
              regionId: "US",
              title: "Master",
              description: "Annual access to arcana readings",
              features: ["Unlimited daily readings", "Access to all arcana", "Reading history", "Custom readings", "Priority support"]
            },
            {
              regionId: "EU",
              title: "Maître",
              description: "Accès annuel aux lectures des arcanes",
              features: ["Lectures quotidiennes illimitées", "Accès à tous les arcanes", "Historique des lectures", "Lectures personnalisées", "Support prioritaire"]
            }
          ]
        }
      ];
    } catch (error) {
      console.error('Error fetching plans (client):', error);
      // Fallback to default plans on error
      return [
        {
          id: "mystic",
          interval: "month",
          type: "basic",
          active: true,
          popular: false,
          regionalContent: [
            {
              regionId: "BR",
              title: "Místico",
              description: "Acesso mensal às leituras dos arcanos",
              features: ["Leitura diária ilimitada", "Acesso a 10 arcanos", "Histórico de leituras"]
            },
            {
              regionId: "US",
              title: "Mystic",
              description: "Monthly access to arcana readings",
              features: ["Unlimited daily readings", "Access to 10 arcana", "Reading history"]
            },
            {
              regionId: "EU",
              title: "Mystique",
              description: "Accès mensuel aux lectures des arcanes",
              features: ["Lectures quotidiennes illimitées", "Accès à 10 arcanes", "Historique des lectures"]
            }
          ]
        },
        {
          id: "oracle",
          interval: "quarter",
          type: "intermediate",
          active: true,
          popular: true,
          regionalContent: [
            {
              regionId: "BR",
              title: "Oráculo",
              description: "Acesso trimestral às leituras dos arcanos",
              features: ["Leitura diária ilimitada", "Acesso a todos os arcanos", "Histórico de leituras", "Análises aprofundadas"]
            },
            {
              regionId: "US",
              title: "Oracle",
              description: "Quarterly access to arcana readings",
              features: ["Unlimited daily readings", "Access to all arcana", "Reading history", "In-depth analyses"]
            },
            {
              regionId: "EU",
              title: "Oracle",
              description: "Accès trimestriel aux lectures des arcanes",
              features: ["Lectures quotidiennes illimitées", "Accès à tous les arcanes", "Historique des lectures", "Analyses approfondies"]
            }
          ]
        },
        {
          id: "master",
          interval: "year",
          type: "premium",
          active: true,
          popular: false,
          regionalContent: [
            {
              regionId: "BR",
              title: "Mestre",
              description: "Acesso anual às leituras dos arcanos",
              features: ["Leitura diária ilimitada", "Acesso a todos os arcanos", "Histórico de leituras", "Leituras personalizadas", "Suporte prioritário"]
            },
            {
              regionId: "US",
              title: "Master",
              description: "Annual access to arcana readings",
              features: ["Unlimited daily readings", "Access to all arcana", "Reading history", "Custom readings", "Priority support"]
            },
            {
              regionId: "EU",
              title: "Maître",
              description: "Accès annuel aux lectures des arcanes",
              features: ["Lectures quotidiennes illimitées", "Accès à tous les arcanes", "Historique des lectures", "Lectures personnalisées", "Support prioritaire"]
            }
          ]
        }
      ];
    }
  }
}

// Get regional prices from database
export async function getRegionalPrices(regionId?: string): Promise<RegionalPrice[]> {
  // Check if we're running on the server or client
  if (typeof window === 'undefined') {
    // Server-side: Use Prisma directly
    try {
      const where = regionId ? { regionId, active: true } : { active: true };

      const prices = await prisma.regionalPrice.findMany({
        where,
        include: {
          plan: true,
        },
      });

      return prices.map(price => ({
        id: price.id,
        planId: price.planId,
        regionId: price.regionId,
        amount: price.amount,
        interval: price.interval,
        active: price.active,
        stripePriceId: price.stripePriceId || undefined,
      }));
    } catch (error) {
      console.error('Error fetching regional prices (server):', error);
      // Fallback to empty array if database query fails
      return [];
    }
  } else {
    // Client-side: Use API endpoint
    try {
      const baseUrl = window.location.origin;
      const url = regionId 
        ? `${baseUrl}/api/plans?region=${regionId}` 
        : `${baseUrl}/api/plans`;

      // Wrap the fetch in a try-catch to handle network errors
      try {
        const response = await fetch(url);

        // Only proceed if the response is OK
        if (response.ok) {
          const data = await response.json();

          if (data && data.plans && Array.isArray(data.plans) && data.region) {
            // Extract all prices from all plans
            const allPrices: RegionalPrice[] = [];
            data.plans.forEach((plan: any) => {
              if (plan.prices && Array.isArray(plan.prices)) {
                plan.prices.forEach((price: any) => {
                  allPrices.push({
                    id: price.id,
                    planId: plan.id,
                    regionId: data.region.id,
                    amount: price.amount,
                    interval: price.interval,
                    active: true,
                    stripePriceId: price.stripePriceId,
                  });
                });
              }
            });

            return allPrices;
          }
        }

        // If we get here, something went wrong with the fetch or the data
        console.log('Using fallback empty prices array due to API response issues');
        return [];
      } catch (fetchError) {
        console.error('Error during fetch operation for regional prices:', fetchError);
        // Fallback to empty array if fetch fails
        return [];
      }
    } catch (error) {
      console.error('Error fetching regional prices (client):', error);
      // Fallback to empty array if API call fails
      return [];
    }
  }
}

// Get price for a plan in a specific region
export async function getPlanPrice(planId: string, regionId: string): Promise<number | undefined> {
  // Check if we're running on the server or client
  if (typeof window === 'undefined') {
    // Server-side: Use Prisma directly
    try {
      const price = await prisma.regionalPrice.findFirst({
        where: {
          planId,
          regionId,
          active: true,
        },
      });
      return price?.amount;
    } catch (error) {
      console.error('Error fetching plan price (server):', error);
      // Return fallback prices based on plan type and region
      if (planId.includes('premium') || planId === 'premium' || planId.includes('master') || planId === 'master') {
        return regionId === 'BR' ? 8999 : regionId === 'US' ? 8999 : 8999;
      } else if (planId.includes('oracle') || planId === 'oracle') {
        return regionId === 'BR' ? 2499 : regionId === 'US' ? 2499 : 2499;
      } else if (planId.includes('basic') || planId === 'basic' || planId.includes('mystic') || planId === 'mystic') {
        return regionId === 'BR' ? 999 : regionId === 'US' ? 999 : 999;
      } else {
        return 0; // Free plan or unknown plan
      }
    }
  } else {
    // Client-side: Use API endpoint
    try {
      const baseUrl = window.location.origin;

      // Wrap the fetch in a try-catch to handle network errors
      try {
        // Fetch only the price for the specified plan and region
        const response = await fetch(`${baseUrl}/api/plans?planId=${planId}&regionId=${regionId}`);

        // Only proceed if the response is OK
        if (response.ok) {
          const data = await response.json();

          // Check if the response contains the price
          if (data.price !== undefined) {
            return data.price;
          }

          // Fallback to the old approach if the new endpoint doesn't return the price directly
          if (data.plans && Array.isArray(data.plans)) {
            // Find the plan in the plans data
            const plan = data.plans.find((p: any) => p.id === planId);

            if (plan && plan.prices) {
              // Find the price for the specified region
              const price = plan.prices.find((p: any) => p.regionId === regionId);

              if (price?.amount !== undefined) {
                return price.amount;
              }
            }
          }
        }

        // If we get here, something went wrong with the fetch or the data
        console.log('Using fallback price for plan:', planId, 'region:', regionId);

        // Return fallback prices based on plan type and region
        if (planId.includes('premium') || planId === 'premium' || planId.includes('master') || planId === 'master') {
          return regionId === 'BR' ? 8999 : regionId === 'US' ? 8999 : 8999;
        } else if (planId.includes('oracle') || planId === 'oracle') {
          return regionId === 'BR' ? 2499 : regionId === 'US' ? 2499 : 2499;
        } else if (planId.includes('basic') || planId === 'basic' || planId.includes('mystic') || planId === 'mystic') {
          return regionId === 'BR' ? 999 : regionId === 'US' ? 999 : 999;
        } else {
          return 0; // Free plan or unknown plan
        }
      } catch (fetchError) {
        console.error('Error during fetch operation:', fetchError);
        // Return fallback prices based on plan type and region
        if (planId.includes('premium') || planId === 'premium' || planId.includes('master') || planId === 'master') {
          return regionId === 'BR' ? 8999 : regionId === 'US' ? 8999 : 8999;
        } else if (planId.includes('oracle') || planId === 'oracle') {
          return regionId === 'BR' ? 2499 : regionId === 'US' ? 2499 : 2499;
        } else if (planId.includes('basic') || planId === 'basic' || planId.includes('mystic') || planId === 'mystic') {
          return regionId === 'BR' ? 999 : regionId === 'US' ? 999 : 999;
        } else {
          return 0; // Free plan or unknown plan
        }
      }
    } catch (error) {
      console.error('Error fetching plan price (client):', error);
      // Return fallback prices based on plan type and region
      if (planId.includes('premium') || planId === 'premium' || planId.includes('master') || planId === 'master') {
        return regionId === 'BR' ? 8999 : regionId === 'US' ? 8999 : 8999;
      } else if (planId.includes('oracle') || planId === 'oracle') {
        return regionId === 'BR' ? 2499 : regionId === 'US' ? 2499 : 2499;
      } else if (planId.includes('basic') || planId === 'basic' || planId.includes('mystic') || planId === 'mystic') {
        return regionId === 'BR' ? 999 : regionId === 'US' ? 999 : 999;
      } else {
        return 0; // Free plan or unknown plan
      }
    }
  }
}

// Get region by ID
export async function getRegion(regionId: string): Promise<Region | undefined> {
  // Check if we're running on the server or client
  if (typeof window === 'undefined') {
    // Server-side: Use Prisma directly
    try {
      return await getRegionById(regionId);
    } catch (error) {
      console.error('Error fetching region (server):', error);
      return undefined;
    }
  } else {
    // Client-side: Use API endpoint
    try {
      const baseUrl = window.location.origin;

      // Wrap the fetch in a try-catch to handle network errors
      try {
        const response = await fetch(`${baseUrl}/api/plans`);

        // Only proceed if the response is OK
        if (response.ok) {
          const data = await response.json();

          if (data && data.region && data.region.id === regionId) {
            return data.region;
          }
        }

        // If we get here, something went wrong with the fetch or the data
        console.log('Using fallback region for ID:', regionId);

        // Return a default region with the requested ID
        return {
          id: regionId,
          name: regionId === 'BR' ? 'Brasil' : 
                regionId === 'US' ? 'United States' : 
                regionId === 'EU' ? 'Europe' : regionId,
          currencyCode: regionId === 'BR' ? 'BRL' : 
                       regionId === 'US' ? 'USD' : 
                       regionId === 'EU' ? 'EUR' : 'BRL',
          locale: regionId === 'BR' ? 'pt-BR' : 
                 regionId === 'US' ? 'en-US' : 
                 regionId === 'EU' ? 'en-GB' : 'pt-BR',
        };
      } catch (fetchError) {
        console.error('Error during fetch operation for region:', fetchError);
        // Return a default region with the requested ID
        return {
          id: regionId,
          name: regionId === 'BR' ? 'Brasil' : 
                regionId === 'US' ? 'United States' : 
                regionId === 'EU' ? 'Europe' : regionId,
          currencyCode: regionId === 'BR' ? 'BRL' : 
                       regionId === 'US' ? 'USD' : 
                       regionId === 'EU' ? 'EUR' : 'BRL',
          locale: regionId === 'BR' ? 'pt-BR' : 
                 regionId === 'US' ? 'en-US' : 
                 regionId === 'EU' ? 'en-GB' : 'pt-BR',
        };
      }
    } catch (error) {
      console.error('Error fetching region (client):', error);
      // Return a default region with the requested ID
      return {
        id: regionId,
        name: regionId === 'BR' ? 'Brasil' : 
              regionId === 'US' ? 'United States' : 
              regionId === 'EU' ? 'Europe' : regionId,
        currencyCode: regionId === 'BR' ? 'BRL' : 
                     regionId === 'US' ? 'USD' : 
                     regionId === 'EU' ? 'EUR' : 'BRL',
        locale: regionId === 'BR' ? 'pt-BR' : 
               regionId === 'US' ? 'en-US' : 
               regionId === 'EU' ? 'en-GB' : 'pt-BR',
      };
    }
  }
}

// Get user's region from profile or IP
export async function getUserRegion(userId?: string, ip?: string): Promise<Region> {
  // Check if we're running on the server or client
  if (typeof window === 'undefined') {
    // Server-side: Use Prisma directly
    try {
      // If userId is provided, try to get region from user profile
      if (userId) {
        const profile = await prisma.profile.findUnique({
          where: { userId },
        });

        if (profile?.region) {
          const region = await getRegionById(profile.region);
          if (region) return region;
        }
      }

      // If IP is provided, try to get region from IP
      if (ip) {
        const regionId = await getRegionFromIp(ip);
        const region = await getRegionById(regionId);
        if (region) return region;
      }

      // Default to US if no region is found
      const defaultRegion = await getRegionById('US');
      return defaultRegion || {
        id: 'US',
        name: 'United States',
        currencyCode: 'USD',
        locale: 'en-US',
      };
    } catch (error) {
      console.error('Error getting user region (server):', error);
      // Default fallback to US
      return {
        id: 'US',
        name: 'United States',
        currencyCode: 'USD',
        locale: 'en-US',
      };
    }
  } else {
    // Client-side: Use API endpoint
    try {
      // For client-side, we can't directly access the user's profile or IP
      // So we'll use the /api/plans endpoint which already detects the region from IP
      const baseUrl = window.location.origin;

      // Wrap the fetch in a try-catch to handle network errors
      try {
        const response = await fetch(`${baseUrl}/api/plans`);

        // Only proceed if the response is OK
        if (response.ok) {
          const data = await response.json();

          if (data && data.region) {
            return data.region;
          }
        }

        // If we get here, something went wrong with the fetch or the data
        console.log('Using fallback region due to API response issues');

        // Return a default region (US)
        return {
          id: 'US',
          name: 'United States',
          currencyCode: 'USD',
          locale: 'en-US',
        };
      } catch (fetchError) {
        console.error('Error during fetch operation for region:', fetchError);
        // Return a default region (US) on fetch error
        return {
          id: 'US',
          name: 'United States',
          currencyCode: 'USD',
          locale: 'en-US',
        };
      }
    } catch (error) {
      console.error('Error getting user region (client):', error);
      // Default fallback to US
      return {
        id: 'US',
        name: 'United States',
        currencyCode: 'USD',
        locale: 'en-US',
      };
    }
  }
}

export async function getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
  if (!userId) {
    return {
      active: false,
      autoRenew: false,
    }
  }

  // Check if we're running on the server or client
  if (typeof window === 'undefined') {
    // Server-side: Use Prisma directly
    try {
      // Fetch subscription directly from the database
      const subscription = await prisma.subscription.findFirst({
        where: {
          userId,
          status: 'active',
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!subscription) {
        return {
          active: false,
          autoRenew: false,
        }
      }

      // Get plan details from database
      const plan = await prisma.plan.findUnique({
        where: { id: subscription.planId },
      });

      // Get user's region
      const profile = await prisma.profile.findUnique({
        where: { userId },
      });

      const regionId = profile?.region || 'BR';
      const region = await getRegionById(regionId);

      if (!plan || !region) {
        return {
          active: false,
          autoRenew: false,
        }
      }

      // Get price for this plan and region
      const price = await prisma.regionalPrice.findFirst({
        where: {
          planId: plan.id,
          regionId: region.id,
          active: true,
        },
      });

      // Try to determine the interval from the price
      let interval: "month" | "quarter" | "year" = "month"; // Default to month

      if (price?.interval) {
        interval = price.interval as "month" | "quarter" | "year";
      }

      const subscriptionPlan: SubscriptionPlan = {
        id: plan.id,
        interval,
        type: plan.type,
        active: plan.active,
        popular: plan.popular || false,
      };

      return {
        active: true,
        plan: subscriptionPlan,
        region,
        price: price?.amount,
        startDate: subscription.currentPeriodStart.toISOString(),
        endDate: subscription.currentPeriodEnd.toISOString(),
        autoRenew: !subscription.cancelAtPeriodEnd,
        nextBillingDate: subscription.currentPeriodEnd.toISOString(),
        subscription, // Include the full subscription object
      }
    } catch (error) {
      console.error('Error fetching subscription status (server):', error)
      // Return default status on error
      return {
        active: false,
        autoRenew: false,
      }
    }
  } else {
    // Client-side: Use API endpoint
    try {
      const baseUrl = window.location.origin;

      // Wrap the subscription fetch in a try-catch to handle network errors
      try {
        const response = await fetch(`${baseUrl}/api/subscription?userId=${userId}`);

        // Only proceed if the response is OK
        if (response.ok) {
          const data = await response.json();

          if (data && data.active) {
            // Wrap the plans fetch in a try-catch to handle network errors
            try {
              const planResponse = await fetch(`${baseUrl}/api/plans`);

              // Only proceed if the response is OK
              if (planResponse.ok) {
                const plansData = await planResponse.json();

                if (plansData && plansData.region && plansData.plans) {
                  // Find the plan in the plans data
                  const planId = data.plan?.planId;
                  const plan = plansData.plans.find((p: any) => p.id === planId);

                  if (plan && plansData.region) {
                    // Determine the interval from the subscription data or plan prices
                    let interval: "month" | "quarter" | "year" = data.plan?.interval as "month" | "quarter" | "year" || "month";

                    // If the plan has prices, try to use the interval from there as a backup
                    if (plan.prices && plan.prices.length > 0) {
                      const planPrice = plan.prices.find((p: any) => p.interval === interval) || plan.prices[0];
                      if (planPrice?.interval) {
                        interval = planPrice.interval as "month" | "quarter" | "year";
                      }
                    }

                    const subscriptionPlan: SubscriptionPlan = {
                      id: plan.id,
                      interval,
                      type: plan.type,
                      active: true,
                      popular: plan.popular || false,
                    };

                    return {
                      active: true,
                      plan: subscriptionPlan,
                      region: plansData.region,
                      price: data.plan?.amount,
                      startDate: data.subscription.currentPeriodStart,
                      endDate: data.subscription.currentPeriodEnd,
                      autoRenew: !data.subscription.cancelAtPeriodEnd,
                      nextBillingDate: data.subscription.currentPeriodEnd,
                      subscription: data.subscription,
                    }
                  }
                }
              }

              // If we get here, something went wrong with the plans fetch or the data
              console.log('Using default subscription status due to plans API response issues');
            } catch (plansError) {
              console.error('Error during fetch operation for plans:', plansError);
            }
          }
        }

        // If we get here, something went wrong with the subscription fetch or the data
        console.log('Using default subscription status due to API response issues');
        return {
          active: false,
          autoRenew: false,
        }
      } catch (fetchError) {
        console.error('Error during fetch operation for subscription status:', fetchError);
        // Return default status on fetch error
        return {
          active: false,
          autoRenew: false,
        }
      }
    } catch (error) {
      console.error('Error fetching subscription status (client):', error)
      // Return default status on error
      return {
        active: false,
        autoRenew: false,
      }
    }
  }
}

// Synchronous version for initial state
export function getInitialSubscriptionStatus(): SubscriptionStatus {
  return {
    active: false,
    autoRenew: false,
  }
}

// Format currency based on region
export async function formatCurrency(value: number, regionId: string = "BR"): Promise<string> {
  // Check if we're running on the server or client
  if (typeof window === 'undefined') {
    // Server-side: Use Prisma directly
    try {
      const region = await getRegionById(regionId);
      const defaultRegion = {
        locale: "pt-BR",
        currencyCode: "BRL",
      };

      return new Intl.NumberFormat(region?.locale || defaultRegion.locale, {
        style: "currency",
        currency: region?.currencyCode || defaultRegion.currencyCode,
      }).format(value / 100)
    } catch (error) {
      console.error('Error formatting currency (server):', error);
      // Fallback to default formatting
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value / 100)
    }
  } else {
    // Client-side: Use formatCurrencySync with default values
    // or try to get region info from the API
    try {
      // First try to use the synchronous version with default values
      const formatted = formatCurrencySync(value, regionId);

      // If we have a non-default regionId, try to get more accurate region info
      if (regionId !== "BR") {
        // Try to fetch region info from the API
        const baseUrl = window.location.origin;
        const response = await fetch(`${baseUrl}/api/plans`);

        if (response.ok) {
          const data = await response.json();
          if (data.region && data.region.id === regionId) {
            // If we got the correct region, use its locale and currency code
            return formatCurrencySync(
              value, 
              regionId, 
              data.region.locale, 
              data.region.currencyCode
            );
          }
        }
      }

      return formatted;
    } catch (error) {
      console.error('Error formatting currency (client):', error);
      // Fallback to default formatting
      return formatCurrencySync(value, regionId);
    }
  }
}

// Synchronous version for initial rendering
export function formatCurrencySync(value: number, regionId: string = "BR", locale: string = "pt-BR", currencyCode: string = "BRL"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(value / 100)
}

// Get regional content for a plan based on region ID, with fallback to US
export async function getRegionalPlanContent(plan: SubscriptionPlan, regionId: string): Promise<{ title: string, description: string, features: string[] }> {
  // Check if we're running on the server or client
  if (typeof window === 'undefined') {
    // Server-side: Use Prisma directly
    try {
      // If plan ID is provided, fetch regional content from database
      if (plan.id) {
        // First try to find content for the specified region
        let content = await prisma.regionalPlanContent.findFirst({
          where: {
            planId: plan.id,
            regionId: regionId,
            active: true,
          },
        });

        // If region-specific content isn't found, try to use US content as fallback
        if (!content) {
          content = await prisma.regionalPlanContent.findFirst({
            where: {
              planId: plan.id,
              regionId: 'US',
              active: true,
            },
          });
        }

        // If content is found, return it
        if (content) {
          return {
            title: content.title,
            description: content.description,
            features: content.features || [],
          };
        }

        // If no content is found in the database, fall back to in-memory content
      }
    } catch (error) {
      console.error('Error fetching regional plan content (server):', error);
      // Fall back to in-memory content
    }
  } else {
    // Client-side: Try to fetch from API
    try {
      const baseUrl = window.location.origin;

      // Only attempt API fetch if we have a plan ID
      if (plan.id) {
        try {
          const response = await fetch(`${baseUrl}/api/plan-content?planId=${plan.id}&regionId=${regionId}`);

          if (response.ok) {
            const data = await response.json();

            if (data && data.content) {
              return {
                title: data.content.title,
                description: data.content.description,
                features: data.content.features || [],
              };
            }
          }
        } catch (fetchError) {
          console.error('Error fetching plan content from API:', fetchError);
          // Fall back to in-memory content
        }
      }
    } catch (error) {
      console.error('Error fetching regional plan content (client):', error);
      // Fall back to in-memory content
    }
  }

  // Fall back to in-memory content processing
  // If the plan has regional content in memory, use it
  if (plan.regionalContent && plan.regionalContent.length > 0) {
    // Try to find content for the specified region
    const regionContent = plan.regionalContent.find(content => content.regionId === regionId);

    if (regionContent) {
      return {
        title: regionContent.title,
        description: regionContent.description,
        features: regionContent.features || []
      };
    }

    // If region-specific content isn't found, try to use US content as fallback
    const usContent = plan.regionalContent.find(content => content.regionId === 'US');

    if (usContent) {
      return {
        title: usContent.title,
        description: usContent.description,
        features: usContent.features || []
      };
    }

    // If US content isn't available either, use the first available regional content
    return {
      title: plan.regionalContent[0].title,
      description: plan.regionalContent[0].description,
      features: plan.regionalContent[0].features || []
    };
  }

  // If no regional content is available at all, create default content based on plan type
  const defaultContent = {
    basic: {
      title: "Basic Plan",
      description: "Basic subscription plan",
      features: ["Basic features"]
    },
    intermediate: {
      title: "Intermediate Plan",
      description: "Intermediate subscription plan",
      features: ["Intermediate features"]
    },
    premium: {
      title: "Premium Plan",
      description: "Premium subscription plan",
      features: ["Premium features"]
    }
  };

  // Use plan type to determine default content, fallback to basic if type is unknown
  const planType = plan.type as keyof typeof defaultContent;
  return defaultContent[planType] || defaultContent.basic;
}

export async function calculateAnnualSavings(planId: string, regionId: string): Promise<number> {
  // Check if we're running on the server or client
  if (typeof window === 'undefined') {
    // Server-side: Use Prisma directly
    try {
      // Get plan details
      const plan = await prisma.plan.findUnique({
        where: { id: planId },
      });

      // Get all monthly plans
      const monthlyPlans = await prisma.regionalPrice.findMany({
        where: {
          regionId,
          interval: "month",
          active: true,
        },
        include: {
          plan: true,
        },
      });

      // Find the basic monthly plan (assuming it's the cheapest)
      const monthlyPlan = monthlyPlans.sort((a, b) => a.amount - b.amount)[0];

      if (!plan || !monthlyPlan || plan.id === monthlyPlan.planId) {
        return 0;
      }

      // Get price for the current plan
      const planPrice = await prisma.regionalPrice.findFirst({
        where: {
          planId,
          regionId,
          active: true,
        },
      });

      if (!planPrice) {
        return 0;
      }

      const interval = planPrice.interval;

      if (interval === "quarter") {
        const quarterlyTotal = planPrice.amount;
        const monthlyTotal = monthlyPlan.amount * 3;
        return ((monthlyTotal - quarterlyTotal) / monthlyTotal) * 100;
      }

      if (interval === "year") {
        const yearlyTotal = planPrice.amount;
        const monthlyTotal = monthlyPlan.amount * 12;
        return ((monthlyTotal - yearlyTotal) / monthlyTotal) * 100;
      }

      return 0;
    } catch (error) {
      console.error('Error calculating annual savings (server):', error);
      return 0;
    }
  } else {
    // Client-side: Use API endpoint
    try {
      const baseUrl = window.location.origin;

      // Wrap the fetch in a try-catch to handle network errors
      try {
        const response = await fetch(`${baseUrl}/api/plans`);

        // Only proceed if the response is OK
        if (response.ok) {
          const data = await response.json();

          if (data.plans && Array.isArray(data.plans)) {
            // Find the plan in the plans data
            const plan = data.plans.find((p: any) => p.id === planId);

            if (plan) {
              // Get all prices for the region
              const allPrices: any[] = [];
              data.plans.forEach((p: any) => {
                if (p.prices) {
                  p.prices.forEach((price: any) => {
                    allPrices.push({
                      ...price,
                      planId: p.id,
                      planType: p.type,
                    });
                  });
                }
              });

              // Find monthly prices
              const monthlyPrices = allPrices.filter((price: any) => price.interval === 'month');

              if (monthlyPrices.length > 0) {
                // Find the cheapest monthly price
                const cheapestMonthlyPrice = monthlyPrices.sort((a: any, b: any) => a.amount - b.amount)[0];

                // Find the price for the current plan
                const planPrices = allPrices.filter((price: any) => price.planId === planId);

                if (planPrices.length > 0) {
                  // Find the price with the specified interval
                  const planPrice = planPrices[0]; // Default to first price

                  if (planPrice) {
                    const interval = planPrice.interval;

                    if (interval === "quarter") {
                      const quarterlyTotal = planPrice.amount;
                      const monthlyTotal = cheapestMonthlyPrice.amount * 3;
                      return ((monthlyTotal - quarterlyTotal) / monthlyTotal) * 100;
                    }

                    if (interval === "year") {
                      const yearlyTotal = planPrice.amount;
                      const monthlyTotal = cheapestMonthlyPrice.amount * 12;
                      return ((monthlyTotal - yearlyTotal) / monthlyTotal) * 100;
                    }
                  }
                }
              }
            }
          }
        }

        // If we get here, something went wrong with the fetch or the data
        console.log('Using fallback savings for plan:', planId, 'region:', regionId);

        // Return fallback savings based on plan interval
        if (planId.includes('quarter') || planId.includes('trimestral')) {
          return 16.7; // Typical quarterly savings
        } else if (planId.includes('year') || planId.includes('anual')) {
          return 25.0; // Typical annual savings
        } else {
          return 0; // No savings for monthly plans
        }
      } catch (fetchError) {
        console.error('Error during fetch operation for savings calculation:', fetchError);
        // Return fallback savings based on plan interval
        if (planId.includes('quarter') || planId.includes('trimestral')) {
          return 16.7; // Typical quarterly savings
        } else if (planId.includes('year') || planId.includes('anual')) {
          return 25.0; // Typical annual savings
        } else {
          return 0; // No savings for monthly plans
        }
      }

      return 0;
    } catch (error) {
      console.error('Error calculating annual savings (client):', error);
      return 0;
    }
  }
}
