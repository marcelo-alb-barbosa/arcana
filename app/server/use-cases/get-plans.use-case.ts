import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRegionFromIp } from "@/lib/ip-utils";
import { 
  PlansResponseEntity, 
  PlanWithPricesEntity,
  validatePlanRequest 
} from "../entities/plan.entity";

export async function getPlansUseCase(
  ip: string,
  regionIdParam?: string,
  planIdParam?: string
): Promise<{ success: boolean; data?: PlansResponseEntity; error?: string }> {
  try {
    // Validate request parameters
    const validation = validatePlanRequest(regionIdParam, planIdParam);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    // Determine region ID
    let regionId = regionIdParam;
    if (!regionId) {
      regionId = await getRegionFromIp(ip);
    }

    // If planId is provided, only get that plan
    const planWhere = planIdParam ? { id: planIdParam, active: true } : { active: true };
    const plans = await prisma.plan.findMany({
      where: planWhere,
    });

    // Get prices for the region
    const priceWhere = planIdParam 
      ? { planId: planIdParam, regionId, active: true } 
      : { regionId, active: true };
    const prices = await prisma.regionalPrice.findMany({
      where: priceWhere,
    });

    // Get regional content for plans
    const regionalContent = await prisma.regionalPlanContent.findMany({
      where: { 
        active: true,
        regionId,
      },
    });

    // Fallback to US content if region-specific content is not available
    const usRegionalContent = await prisma.regionalPlanContent.findMany({
      where: { 
        active: true,
        regionId: 'US',
      },
    });

    // Get region details
    const region = await prisma.region.findUnique({
      where: { id: regionId },
    });

    if (!region) {
      return { success: false, error: "Region not found" };
    }

    // Combine plans with their prices and regional content
    const plansWithPrices: PlanWithPricesEntity[] = plans.map(plan => {
      const planPrices = prices.filter(price => price.planId === plan.id);

      // Find regional content for this plan
      let content = regionalContent.find(content => content.planId === plan.id);

      // If region-specific content isn't found, try to use US content as fallback
      if (!content) {
        content = usRegionalContent.find(content => content.planId === plan.id);
      }

      // Create regional content object
      const planRegionalContent = content ? {
        regionId: content.regionId,
        title: content.title,
        description: content.description,
        features: content.features || [],
      } : null;

      return {
        id: plan.id,
        type: plan.type,
        popular: plan.popular || false,
        regionalContent: planRegionalContent ? [planRegionalContent] : [],
        prices: planPrices.map(price => ({
          id: price.id,
          amount: price.amount,
          interval: price.interval,
          stripePriceId: price.stripePriceId,
        })),
      };
    });

    // If planId and regionId are provided, return the price directly
    if (planIdParam && regionId && prices.length === 1) {
      return {
        success: true,
        data: {
          region: {
            id: region.id,
            name: region.name,
            currencyCode: region.currencyCode,
            locale: region.locale,
          },
          price: prices[0].amount,
          plans: plansWithPrices,
        }
      };
    }

    return {
      success: true,
      data: {
        region: {
          id: region.id,
          name: region.name,
          currencyCode: region.currencyCode,
          locale: region.locale,
        },
        plans: plansWithPrices,
      }
    };
  } catch (error) {
    console.error("Error fetching plans:", error);
    return { success: false, error: "Error fetching plans" };
  }
}