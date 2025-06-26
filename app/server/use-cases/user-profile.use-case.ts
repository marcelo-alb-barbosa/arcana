import { prisma } from "@/lib/prisma";
import { UserProfileData, UserProfileResponse } from "../entities/user-profile.entity";

// Use case for getting user profile information
export async function getUserProfileUseCase(
  userId: string
): Promise<UserProfileResponse> {
  try {
    // Get user data from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    // If user doesn't exist, return error
    if (!user) {
      return {
        success: false,
        error: "Usuário não encontrado"
      };
    }

    // Format the response data
    const responseData: UserProfileData = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
      profile: user.profile
    };

    return {
      success: true,
      data: responseData
    };
  } catch (error) {
    console.error("Error getting user profile:", error);
    return { 
      success: false, 
      error: "Erro interno do servidor" 
    };
  }
}