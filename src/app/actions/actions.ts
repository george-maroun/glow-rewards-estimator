"use server";

import getLocationDataFromZipcode from '../utils/getLocationDataFromZipcode';
import prisma from '../../../lib/prisma';

const GEO_STATS_API = process.env.GEO_STATS_API || '';

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

    // const sixMonthsAgo = getDateSixMonthsAgo();

    if (locationData) { // && locationData.lastUpdated > sixMonthsAgo) {
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
    const response = await fetch(`${GEO_STATS_API}?latitude=${lat}&longitude=${lng}`);
    
    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();

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
