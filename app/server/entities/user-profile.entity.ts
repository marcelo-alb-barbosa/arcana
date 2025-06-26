// User profile entity definitions
export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt: Date;
  profile?: UserProfile | null;
}

export interface UserProfile {
  id?: string;
  userId: string;
  dateOfBirth?: Date | null;
  birthTime?: string | null;
  zodiacSign?: string | null;
  moonSign?: string | null;
  ascendant?: string | null;
}

export interface UserProfileResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: UserProfileData | null;
}