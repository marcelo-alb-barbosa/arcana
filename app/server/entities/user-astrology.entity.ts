// User astrology entity definitions
export interface UserAstrologyRequest {
  dateOfBirth: string;
  birthTime?: string;
}

export interface UserAstrologyProfile {
  dateOfBirth: Date;
  birthTime?: string | null;
  zodiacSign?: string | null;
  moonSign?: string | null;
  ascendant?: string | null;
}

export interface UserAstrologyResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: UserAstrologyProfile | null;
}

// Validation functions
export function validateUserAstrologyRequest(request: Partial<UserAstrologyRequest>): { isValid: boolean; error?: string } {
  if (!request.dateOfBirth) {
    return { isValid: false, error: "Data de nascimento é obrigatória" };
  }

  // Validate date format (simple validation)
  try {
    const date = new Date(request.dateOfBirth);
    if (isNaN(date.getTime())) {
      return { isValid: false, error: "Formato de data inválido" };
    }
  } catch (error) {
    return { isValid: false, error: "Formato de data inválido" };
  }

  return { isValid: true };
}