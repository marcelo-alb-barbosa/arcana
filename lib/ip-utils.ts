import { prisma } from './prisma';

/**
 * Maps a country code to a region ID in our database
 * @param countryCode ISO 3166-1 alpha-2 country code
 * @returns Region ID or 'BR' as default
 */
export function mapCountryToRegion(countryCode: string): string {
  // Map of country codes to region IDs
  const countryToRegionMap: Record<string, string> = {
    // North America
    'US': 'US',
    'CA': 'US',
    'MX': 'US',

    // Europe
    'GB': 'EU',
    'DE': 'EU',
    'FR': 'EU',
    'IT': 'EU',
    'ES': 'EU',
    'PT': 'EU',
    'NL': 'EU',
    'BE': 'EU',
    'CH': 'EU',
    'AT': 'EU',
    'SE': 'EU',
    'DK': 'EU',
    'NO': 'EU',
    'FI': 'EU',
    'IE': 'EU',
    'PL': 'EU',

    // South America
    'BR': 'BR',
    'AR': 'BR',
    'CL': 'BR',
    'CO': 'BR',
    'PE': 'BR',
    'UY': 'BR',
    'PY': 'BR',
    'BO': 'BR',
    'EC': 'BR',
    'VE': 'BR',
  };

  return countryToRegionMap[countryCode] || 'BR'; // Default to Brazil if country not found
}

/**
 * Gets the region from an IP address
 * @param ip IP address
 * @returns Region ID
 */
export async function getRegionFromIp(ip: string): Promise<string> {
  try {
    // Skip IP lookup for localhost or private IPs
    if (ip === '127.0.0.1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return 'BR'; // Default to Brazil for local development
    }

    // Use a free IP geolocation API
    const response = await fetch(`https://ipapi.co/${ip}/json/`);

    // Check if the response is OK before trying to parse JSON
    if (!response.ok) {
      console.error('IP geolocation API error:', response.status, await response.text());
      return 'BR'; // Default to Brazil on API error
    }

    // Try to parse the response as JSON
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Error parsing IP geolocation response:', jsonError);
      return 'BR'; // Default to Brazil on parsing error
    }

    if (data.error) {
      console.error('IP geolocation error:', data.error);
      return 'BR'; // Default to Brazil on error
    }

    const countryCode = data.country_code;
    return mapCountryToRegion(countryCode);
  } catch (error) {
    console.error('Error getting region from IP:', error);
    return 'BR'; // Default to Brazil on error
  }
}

/**
 * Gets all active regions from the database
 * @returns Array of active regions
 */
export async function getActiveRegions() {
  return await prisma.region.findMany({
    where: { active: true },
  });
}

/**
 * Gets a region by ID from the database
 * @param regionId Region ID
 * @returns Region or null if not found
 */
export async function getRegionById(regionId: string) {
  return await prisma.region.findUnique({
    where: { id: regionId },
  });
}
