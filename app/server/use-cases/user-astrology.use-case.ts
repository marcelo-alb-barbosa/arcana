import { prisma } from "@/lib/prisma";
import { updateUserAstrology } from "@/lib/astrology";
import { 
  UserAstrologyRequest, 
  UserAstrologyResponse, 
  validateUserAstrologyRequest 
} from "../entities/user-astrology.entity";

// Use case for updating user astrology information
export async function updateUserAstrologyUseCase(
  userId: string,
  request: UserAstrologyRequest
): Promise<UserAstrologyResponse> {
  try {
    // Validate request
    const validation = validateUserAstrologyRequest(request);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const { dateOfBirth, birthTime } = request;

    // Find or create profile for the user
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: userId }
    });

    if (existingProfile) {
      // Update existing profile with birth date and time
      await prisma.profile.update({
        where: { userId: userId },
        data: {
          dateOfBirth: new Date(dateOfBirth),
          birthTime: birthTime || null,
        },
      });
    } else {
      // Create new profile with birth date and time
      await prisma.profile.create({
        data: {
          userId: userId,
          dateOfBirth: new Date(dateOfBirth),
          birthTime: birthTime || null,
        },
      });
    }

    // Calculate and update astrological information
    const success = await updateUserAstrology(userId);

    if (!success) {
      return { 
        success: false, 
        error: "Erro ao calcular informações astrológicas" 
      };
    }

    // Get updated profile data
    const updatedProfile = await prisma.profile.findUnique({
      where: { userId: userId },
      select: {
        dateOfBirth: true,
        birthTime: true,
        zodiacSign: true,
        moonSign: true,
        ascendant: true,
      },
    });

    return {
      success: true,
      message: "Informações astrológicas atualizadas com sucesso",
      data: updatedProfile,
    };
  } catch (error) {
    console.error("Error updating user astrology:", error);
    return { 
      success: false, 
      error: "Erro ao atualizar informações astrológicas" 
    };
  }
}

// Use case for getting user astrology information
export async function getUserAstrologyUseCase(
  userId: string
): Promise<UserAstrologyResponse> {
  try {
    // Get user's astrological information from profile
    const profile = await prisma.profile.findUnique({
      where: { userId: userId },
      select: {
        dateOfBirth: true,
        birthTime: true,
        zodiacSign: true,
        moonSign: true,
        ascendant: true,
      },
    });

    // If profile doesn't exist, return empty data
    if (!profile) {
      return {
        success: true,
        data: null,
      };
    }

    return {
      success: true,
      data: profile,
    };
  } catch (error) {
    console.error("Error getting user astrology:", error);
    return { 
      success: false, 
      error: "Erro ao obter informações astrológicas" 
    };
  }
}