import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.regionalPrice.deleteMany();
  await prisma.regionalPlanContent.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.region.deleteMany();

  // Create regions
  const regions = [
    {
      id: 'BR',
      name: 'Brasil',
      currencyCode: 'BRL',
      locale: 'pt-BR',
      active: true,
    },
    {
      id: 'US',
      name: 'United States',
      currencyCode: 'USD',
      locale: 'en-US',
      active: true,
    },
    {
      id: 'EU',
      name: 'Europe',
      currencyCode: 'EUR',
      locale: 'en-GB',
      active: true,
    },
  ];

  for (const region of regions) {
    await prisma.region.create({
      data: region,
    });
  }

  console.log('Regions seeded successfully');

  // Create plans
  const plans = [
    {
      type: 'basic',
      active: true,
      popular: false,
    },
    {
      type: 'intermediate',
      active: true,
      popular: true,
    },
    {
      type: 'premium',
      active: true,
      popular: false,
    },
  ];

  // Define regional content for plans
  type RegionContent = {
    title: string;
    description: string;
    features: string[];
  };

  type PlanContent = {
    BR: RegionContent;
    US: RegionContent;
    EU: RegionContent;
  };

  type RegionalContent = {
    basic: PlanContent;
    intermediate: PlanContent;
    premium: PlanContent;
  };

  const regionalContent: RegionalContent = {
    basic: {
      BR: {
        title: 'Místico',
        description: 'Acesso mensal às leituras dos arcanos',
        features: ['Leitura diária ilimitada', 'Acesso a 10 arcanos', 'Histórico de leituras'],
      },
      US: {
        title: 'Mystic',
        description: 'Monthly access to arcana readings',
        features: ['Unlimited daily readings', 'Access to 10 arcana', 'Reading history'],
      },
      EU: {
        title: 'Mystique',
        description: 'Accès mensuel aux lectures des arcanes',
        features: ['Lectures quotidiennes illimitées', 'Accès à 10 arcanes', 'Historique des lectures'],
      },
    },
    intermediate: {
      BR: {
        title: 'Oráculo',
        description: 'Acesso trimestral às leituras dos arcanos',
        features: ['Leitura diária ilimitada', 'Acesso a todos os arcanos', 'Histórico de leituras', 'Análises aprofundadas'],
      },
      US: {
        title: 'Oracle',
        description: 'Quarterly access to arcana readings',
        features: ['Unlimited daily readings', 'Access to all arcana', 'Reading history', 'In-depth analyses'],
      },
      EU: {
        title: 'Oracle',
        description: 'Accès trimestriel aux lectures des arcanes',
        features: ['Lectures quotidiennes illimitées', 'Accès à tous les arcanes', 'Historique des lectures', 'Analyses approfondies'],
      },
    },
    premium: {
      BR: {
        title: 'Mestre',
        description: 'Acesso anual às leituras dos arcanos',
        features: ['Leitura diária ilimitada', 'Acesso a todos os arcanos', 'Histórico de leituras', 'Leituras personalizadas', 'Suporte prioritário'],
      },
      US: {
        title: 'Master',
        description: 'Annual access to arcana readings',
        features: ['Unlimited daily readings', 'Access to all arcana', 'Reading history', 'Custom readings', 'Priority support'],
      },
      EU: {
        title: 'Maître',
        description: 'Accès annuel aux lectures des arcanes',
        features: ['Lectures quotidiennes illimitées', 'Accès à tous les arcanes', 'Historique des lectures', 'Lectures personnalisées', 'Support prioritaire'],
      },
    },
  };

  for (const plan of plans) {
    const createdPlan = await prisma.plan.create({
      data: plan,
    });

    // Create regional content for each plan
    const planType = plan.type as keyof RegionalContent;
    for (const regionId of ['BR', 'US', 'EU']) {
      const content = regionalContent[planType][regionId as keyof PlanContent];
      await prisma.regionalPlanContent.create({
        data: {
          planId: createdPlan.id,
          regionId,
          title: content.title,
          description: content.description,
          features: content.features,
          active: true,
        },
      });
    }

    // Create regional prices for each plan
    const regionalPrices = [
      // Místico plan (monthly)
      ...(plan.type === 'basic'
        ? [
            {
              planId: createdPlan.id,
              regionId: 'BR',
              amount: 999, // R$9.99
              interval: 'month',
              active: true,
            },
            {
              planId: createdPlan.id,
              regionId: 'US',
              amount: 999, // $9.99
              interval: 'month',
              active: true,
            },
            {
              planId: createdPlan.id,
              regionId: 'EU',
              amount: 999, // €9.99
              interval: 'month',
              active: true,
            },
          ]
        : []),

      // Oráculo plan (quarterly)
      ...(plan.type === 'intermediate'
        ? [
            {
              planId: createdPlan.id,
              regionId: 'BR',
              amount: 2499, // R$24.99
              interval: 'quarter',
              active: true,
            },
            {
              planId: createdPlan.id,
              regionId: 'US',
              amount: 2499, // $24.99
              interval: 'quarter',
              active: true,
            },
            {
              planId: createdPlan.id,
              regionId: 'EU',
              amount: 2499, // €24.99
              interval: 'quarter',
              active: true,
            },
          ]
        : []),

      // Mestre plan (yearly)
      ...(plan.type === 'premium'
        ? [
            {
              planId: createdPlan.id,
              regionId: 'BR',
              amount: 8999, // R$89.99
              interval: 'year',
              active: true,
            },
            {
              planId: createdPlan.id,
              regionId: 'US',
              amount: 8999, // $89.99
              interval: 'year',
              active: true,
            },
            {
              planId: createdPlan.id,
              regionId: 'EU',
              amount: 8999, // €89.99
              interval: 'year',
              active: true,
            },
          ]
        : []),
    ];

    for (const price of regionalPrices) {
      await prisma.regionalPrice.create({
        data: price,
      });
    }
  }

  console.log('Plans and prices seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
