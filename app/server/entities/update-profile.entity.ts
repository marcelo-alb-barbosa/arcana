// Update profile entity definitions
import { z } from "zod";

// Schema for validating update profile requests
export const updateProfileSchema = z.object({
  username: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").optional(),
  dateOfBirth: z.string().optional(),
  birthTime: z.string().optional(),
  avatarUrl: z.string().optional(),
});

// Type for update profile request
export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;

// Function to validate update profile request
export function validateUpdateProfileRequest(data: any): { isValid: boolean; error?: string } {
  const result = updateProfileSchema.safeParse(data);
  
  if (!result.success) {
    const errorMessage = result.error.errors.map(err => `${err.path}: ${err.message}`).join(", ");
    return { isValid: false, error: errorMessage };
  }
  
  return { isValid: true };
}

// Response type for update profile operations
export interface UpdateProfileResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}