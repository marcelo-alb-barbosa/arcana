// User entity definition
export interface UserEntity {
  id?: string;
  email: string;
  password: string;
  name: string;
  image?: string;
}

// User validation functions
export function validateUserData(userData: Partial<UserEntity>): { isValid: boolean; error?: string } {
  const { email, password, name } = userData;

  if (!email || !password || !name) {
    return { isValid: false, error: "Campos obrigatórios não preenchidos" };
  }

  // Verificar se os campos não estão vazios ou contêm apenas espaços em branco
  if (email.trim() === "" || password.trim() === "" || name.trim() === "") {
    return { isValid: false, error: "Campos obrigatórios não podem estar vazios" };
  }

  // Validações
  if (name.length < 3) {
    return { isValid: false, error: "O nome de invocador deve ter pelo menos 3 caracteres" };
  }

  if (password.length < 6) {
    return { isValid: false, error: "A palavra de poder deve ter pelo menos 6 caracteres" };
  }

  return { isValid: true };
}