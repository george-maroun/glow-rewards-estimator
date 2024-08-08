"use client";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FormSection } from './FormSection';
import { ResultsSection } from './ResultsSection';
import calculateRewards from '../utils/estimateRewards';
import getCarbonCredit from '../utils/getCarbonCredit';
import getLocationDataFromZipcode from '../utils/getLocationDataFromZipcode';
import getWeeksSinceStart from '../utils/getWeeksSinceStart';
import debounce from 'lodash/debounce';

interface SolarFarmDashboardProps {
  weeklyFarmCount: Array<{ week: string; value: number }>;
  weeklyProtocolFees: any;
}

interface FormData {
  zipCode: string;
  capacity: number;
  joiningDate: string;
  dilutionRate: number;
  electricityPriceKWh: number;
}

interface CarbonCreditData {
  avgPeakSunHours: number;
  carbonCreditsPerMwh: number;
  state: string;
}

const SolarFarmDashboard: React.FC<SolarFarmDashboardProps> = ({ weeklyFarmCount, weeklyProtocolFees }) => {
  const [formData, setFormData] = useState<FormData>({
    zipCode: '',
    capacity: 0,
    joiningDate: '',
    dilutionRate: 1,
    electricityPriceKWh: 0.11,
  });
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [carbonCreditData, setCarbonCreditData] = useState<CarbonCreditData>({
    avgPeakSunHours: 0,
    carbonCreditsPerMwh: 0,
    state: '',
  });

  const estimatedSlope = useMemo(() => {
    const lastWeek = weeklyFarmCount[weeklyFarmCount.length - 1];
    return Number(lastWeek.value) / (Number(lastWeek.week) - 16);
  }, [weeklyFarmCount]);

  // Memoize the getCarbonCredit function to cache results
  const memoizedGetCarbonCredit = useMemo(() => {
    const cache = new Map<string, CarbonCreditData>();
    return async (lat: number, lng: number): Promise<CarbonCreditData> => {
      const key = `${lat},${lng}`;
      if (cache.has(key)) {
        return cache.get(key)!;
      }
      const result = await getCarbonCredit(lat, lng);
      cache.set(key, {
        avgPeakSunHours: result.average_sunlight,
        carbonCreditsPerMwh: result.average_carbon_certificates,
        state: '',  // This will be set later
      });
      return cache.get(key)!;
    };
  }, []);
  
  // Debounced function to fetch location data and carbon credits
  const fetchData = useCallback(async (zipCode: string) => {
    if (zipCode.length !== 5) return;

    const locData = await getLocationDataFromZipcode(zipCode);
    if (!locData) return;

    try {
      const { lat, lng, state } = locData;
      const carbonData = await memoizedGetCarbonCredit(lat, lng);
      setCarbonCreditData({ ...carbonData, state });
    } catch (error) {
      console.error('Error fetching carbon credit information:', error);
    }
  }, [memoizedGetCarbonCredit]);

  const debouncedFetchData = useMemo(
    () => debounce(fetchData, 500),
    [fetchData]
  );

  useEffect(() => {
    if (formData.zipCode) {
      debouncedFetchData(formData.zipCode);
    }
  }, [formData.zipCode, debouncedFetchData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, dilutionRate: parseFloat(e.target.value) }));
  };

  const handleSubmit = useCallback(async () => {
    const joiningWeek = getWeeksSinceStart(formData.joiningDate);
    const endWeek = joiningWeek + 208;

    const input = {
      state: carbonCreditData.state,
      electricityPricePerKWh: formData.electricityPriceKWh,
      carbonCreditsPerMwh: carbonCreditData.carbonCreditsPerMwh,
      dilutionRate: Number(formData.dilutionRate),
      joiningWeek,
      endWeek,
      estimatedSlope,
      avgPeakSunHours: carbonCreditData.avgPeakSunHours,
      capacity: formData.capacity,
      pastProtocolFees: weeklyProtocolFees,
    };

    const calculatedRewards = await calculateRewards(input);
    
    setResults(calculatedRewards);
    setShowResults(true);
  }, [formData, carbonCreditData, estimatedSlope, weeklyProtocolFees]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Glow Farm Rewards Estimator</h1>
      <FormSection 
        formData={formData}
        handleInputChange={handleInputChange}
        handleSliderChange={handleSliderChange}
        handleSubmit={handleSubmit}
      />
      {showResults &&
        <ResultsSection 
          weeklyFarmCount={weeklyFarmCount} 
          formData={formData} 
          results={results} 
          estimatedSlope={estimatedSlope}
        />
      }
    </div>
  );
};

export default SolarFarmDashboard;