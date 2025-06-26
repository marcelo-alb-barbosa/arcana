import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { stripe } from "@/lib/stripe";
import { UserEntity, validateUserData } from "../entities/user.entity";

interface RegisterUserInput {
  email: string;
  password: string;
  name: string;
}

interface RegisterUserOutput {
  success: boolean;
  message?: string;
  error?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    image: string | null;
  };
}

export async function registerUserUseCase(input: RegisterUserInput): Promise<RegisterUserOutput> {
  try {
    // Validate user data
    const validation = validateUserData(input);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      return { 
        success: false, 
        error: "Este email já está vinculado a outro invocador dos arcanos" 
      };
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(input.password, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        password: hashedPassword,
        image: "/placeholder.svg?width=120&height=120",
      },
    });

    // Criar perfil para o usuário
    await prisma.profile.create({
      data: {
        userId: user.id,
        // Deixamos dateOfBirth e birthTime como null para serem preenchidos posteriormente
      },
    });

    // Criar cliente na Stripe
    try {
      // Verificar se email e name existem antes de criar o cliente
      if (!user.email || !user.name) {
        throw new Error("Email ou nome do usuário não disponíveis para criar cliente Stripe");
      }

      const stripeCustomer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      });

      // Criar registro de subscription com o ID do cliente Stripe
      await prisma.subscription.create({
        data: {
          userId: user.id,
          stripeCustomerId: stripeCustomer.id,
          planId: "free", // Plano gratuito inicial
          status: "active",
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 100)), // Data distante no futuro para plano gratuito
        },
      });
    } catch (stripeError) {
      console.error("Erro ao criar cliente na Stripe:", stripeError);
      // Continuamos mesmo se houver erro na criação do cliente Stripe
      // para não impedir o registro do usuário
    }

    // Usamos uma mensagem genérica que será traduzida no frontend
    return {
      success: true,
      message: `profile.welcomeMessage`,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
    };
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return { success: false, error: "Erro ao processar o registro" };
  }
}
