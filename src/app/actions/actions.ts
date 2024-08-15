"use server";

import getLocationDataFromZipcode from '../utils/getLocationDataFromZipcode';
import prisma from '../../../lib/prisma';
import { kv } from '@vercel/kv';
export const revalidate = 0;

const GEO_STATS_API = process.env.GEO_STATS_API || '';
const RATE_LIMIT = 25;
const TIME_WINDOW = 60; // 1 minute

export async function checkRateLimit(key: string): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - TIME_WINDOW;

  const multi = kv.multi();
  multi.zremrangebyscore(key, '-inf' as unknown as number, windowStart.toString() as unknown as number);
  multi.zadd(key, { score: now, member: now.toString() });
  multi.zcard(key);
  multi.expire(key, TIME_WINDOW);
  const results = await multi.exec();

  // The count is the third result (index 2) in the results array
  const count = results[2] as number;

  return count <= RATE_LIMIT;
}


function getDateSixMonthsAgo(): Date {
  const date = new Date();
  date.setMonth(date.getMonth() - 6);
  return date;
}

export const updateCarbonCredits = async (zipcode: string, newValue: number) => {
  try {
    await prisma.locationData.update({
      where: { zipcode },
      data: { 
        carbonCreditsPerMwh: newValue,
        lastUpdated: new Date()
      },
    });
    console.log(`Updated carbon credits for zipcode ${zipcode}`);
  } catch (error) {
    console.error('Error updating carbon credits:', error);
  }
}

export const getCarbonCredit = async (zipcode: string) => {
  try {
    const locationData = await prisma.locationData.findUnique({
      where: { zipcode },
    });

    const sixMonthsAgo = getDateSixMonthsAgo();

    if (locationData && locationData.lastUpdated > sixMonthsAgo) {
      console.log(`Using database data for zipcode ${zipcode}`);
      return {
        average_sunlight: locationData.peakSunHours,
        average_carbon_certificates: locationData.carbonCreditsPerMwh,
        state: locationData.state
      };
    }

    // If data is not found or is outdated, fetch new data
    const geoData = await getLocationDataFromZipcode(zipcode);
    if (!geoData) {
      throw new Error('Failed to get location data from zipcode');
    }

    const { lat, lng, state } = geoData;
    
    
    const rateKey = `ratelimit:geostats:${process.env.VERCEL_ENV || 'development'}`;
    const allowed = await checkRateLimit(rateKey);

    if (!allowed) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    const response = await fetch(`${GEO_STATS_API}?latitude=${lat}&longitude=${lng}`);
    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    // const data = {
    //   average_sunlight: 5.7153538630137275,
    //   average_carbon_certificates: 0.544651860894881
    // };

    // Update or create the database entry
    await prisma.locationData.upsert({
      where: { zipcode },
      update: {
        state,
        carbonCreditsPerMwh: data.average_carbon_certificates,
        peakSunHours: data.average_sunlight,
        latitude: lat,
        longitude: lng,
        lastUpdated: new Date()
      },
      create: {
        zipcode,
        state,
        carbonCreditsPerMwh: data.average_carbon_certificates,
        peakSunHours: data.average_sunlight,
        latitude: lat,
        longitude: lng,
      }
    });

    return {
      average_sunlight: data.average_sunlight,
      average_carbon_certificates: data.average_carbon_certificates,
      state
    };

  } catch (error) {
    console.error('Error in getCarbonCredit:', error);
    throw error;
  }
}

