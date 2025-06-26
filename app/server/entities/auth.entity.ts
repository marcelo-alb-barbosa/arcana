// Authentication entity definitions
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
}

export interface SocialAuthProfile {
  email?: string;
  name?: string;
  image?: string;
  birthday?: string;
  birth_date?: string;
}

// Validation functions
export function validateCredentials(credentials: Partial<AuthCredentials>): { isValid: boolean; error?: string } {
  if (!credentials.email || !credentials.password) {
    return { isValid: false, error: "Email e senha são obrigatórios" };
  }

  if (credentials.email.trim() === "" || credentials.password.trim() === "") {
    return { isValid: false, error: "Email e senha não podem estar vazios" };
  }

  return { isValid: true };
}