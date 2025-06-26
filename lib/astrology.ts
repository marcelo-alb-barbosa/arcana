import { prisma } from "@/lib/prisma";
import { serverTranslate } from "@/lib/server-translation";

// Function to determine zodiac sign based on date of birth
export function getZodiacSign(dateOfBirth: Date, language = "pt"): string {
  const month = dateOfBirth.getMonth() + 1; // JavaScript months are 0-indexed
  const day = dateOfBirth.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return serverTranslate("zodiac.aries", language as any);
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return serverTranslate("zodiac.taurus", language as any);
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return serverTranslate("zodiac.gemini", language as any);
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return serverTranslate("zodiac.cancer", language as any);
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return serverTranslate("zodiac.leo", language as any);
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return serverTranslate("zodiac.virgo", language as any);
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return serverTranslate("zodiac.libra", language as any);
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return serverTranslate("zodiac.scorpio", language as any);
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return serverTranslate("zodiac.sagittarius", language as any);
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return serverTranslate("zodiac.capricorn", language as any);
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return serverTranslate("zodiac.aquarius", language as any);
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return serverTranslate("zodiac.pisces", language as any);

  return serverTranslate("zodiac.unknown", language as any);
}

// Simplified function to determine moon sign based on date of birth
// Note: A real implementation would require more complex calculations
export function getMoonSign(dateOfBirth: Date, language = "pt"): string {
  // This is a simplified approximation - in reality, moon sign calculation
  // requires ephemeris data and more complex astronomical calculations
  const month = dateOfBirth.getMonth();
  const moonSignKeys = [
    "zodiac.capricorn", "zodiac.aquarius", "zodiac.pisces", "zodiac.aries", "zodiac.taurus", "zodiac.gemini",
    "zodiac.cancer", "zodiac.leo", "zodiac.virgo", "zodiac.libra", "zodiac.scorpio", "zodiac.sagittarius"
  ];

  // Simple approximation based on birth month
  // In a real app, this would use proper astronomical calculations
  return serverTranslate(moonSignKeys[month], language as any);
}

// Simplified function to determine ascendant based on date and time of birth
// Note: A real implementation would require more complex calculations
export function getAscendant(dateOfBirth: Date, birthTime: string, language = "pt"): string {
  // This is a simplified approximation - in reality, ascendant calculation
  // requires location data, precise time, and complex astronomical calculations
  if (!birthTime) return serverTranslate("zodiac.unknown", language as any);

  // Extract hour from birth time (assuming format like "14:30")
  const hour = parseInt(birthTime.split(":")[0], 10);

  // Simple approximation based on birth hour
  // In a real app, this would use proper astronomical calculations
  const ascendantKeys = [
    "zodiac.aries", "zodiac.taurus", "zodiac.gemini", "zodiac.cancer", "zodiac.leo", "zodiac.virgo",
    "zodiac.libra", "zodiac.scorpio", "zodiac.sagittarius", "zodiac.capricorn", "zodiac.aquarius", "zodiac.pisces"
  ];

  // Simple mapping of hour to ascendant (2 hours per sign)
  const index = Math.floor(hour / 2) % 12;
  return serverTranslate(ascendantKeys[index], language as any);
}

// Function to calculate and update user's astrological information
export async function updateUserAstrology(userId: string, language = "pt"): Promise<boolean> {
  try {
    // Find or create profile for the user
    let profile = await prisma.profile.findUnique({
      where: { userId: userId }
    });

    // If profile doesn't exist, create it
    if (!profile) {
      profile = await prisma.profile.create({
        data: { userId: userId }
      });
    }

    // If no date of birth, can't calculate astrological info
    if (!profile.dateOfBirth) {
      return false;
    }

    const zodiacSign = getZodiacSign(profile.dateOfBirth, language);
    const moonSign = getMoonSign(profile.dateOfBirth, language);
    const ascendant = profile.birthTime 
      ? getAscendant(profile.dateOfBirth, profile.birthTime, language) 
      : serverTranslate("zodiac.unknown", language as any);

    // Update profile with astrological information
    await prisma.profile.update({
      where: { userId: userId },
      data: {
        zodiacSign,
        moonSign,
        ascendant
      }
    });

    return true;
  } catch (error) {
    console.error("Error updating user astrology:", error);
    return false;
  }
}
