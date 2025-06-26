import { prisma } from "@/lib/prisma";
import { 
  UpdateProfileRequest, 
  UpdateProfileResponse, 
  validateUpdateProfileRequest 
} from "../entities/update-profile.entity";

// Use case for updating user profile information
export async function updateProfileUseCase(
  userId: string,
  request: UpdateProfileRequest
): Promise<UpdateProfileResponse> {
  try {
    // Validate request
    const validation = validateUpdateProfileRequest(request);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const { username, dateOfBirth, birthTime, avatarUrl } = request;

    // Update user name if provided
    if (username) {
      await prisma.user.update({
        where: { id: userId },
        data: { name: username }
      });
    }

    // Find or create profile for the user
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: userId }
    });

    if (existingProfile) {
      // Update existing profile
      await prisma.profile.update({
        where: { userId: userId },
        data: {
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
          birthTime: birthTime !== undefined ? birthTime : undefined,
        },
      });
    } else {
      // Create new profile
      await prisma.profile.create({
        data: {
          userId: userId,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          birthTime: birthTime || null,
        },
      });
    }

    // Update user image if provided
    if (avatarUrl) {
      await prisma.user.update({
        where: { id: userId },
        data: { image: avatarUrl }
      });
    }

    // Get updated user and profile data
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (!updatedUser) {
      return { 
        success: false, 
        error: "Usuário não encontrado após atualização" 
      };
    }

    // Format the response data
    const responseData = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
      profile: updatedUser.profile
    };

    return {
      success: true,
      message: "Perfil atualizado com sucesso",
      data: responseData,
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { 
      success: false, 
      error: "Erro ao atualizar perfil" 
    };
  }
}