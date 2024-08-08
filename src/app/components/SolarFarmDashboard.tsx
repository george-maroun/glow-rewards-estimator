"use client";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FormSection } from './FormSection';
import { ResultsSection } from './ResultsSection';
import estimateRewards from '../utils/estimateRewards';
import { getCarbonCredit } from '../actions/actions';
// import getLocationDataFromZipcode from '../utils/getLocationDataFromZipcode';
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
  average_sunlight: number;
  average_carbon_certificates: number;
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
  const [carbonCreditData, setCarbonCreditData] = useState<CarbonCreditData | null>(null);

  const estimatedSlope = useMemo(() => {
    const lastWeek = weeklyFarmCount[weeklyFarmCount.length - 1];
    return Number(lastWeek.value) / (Number(lastWeek.week) - 16);
  }, [weeklyFarmCount]);

  // Debounced function to fetch carbon credit data
  const fetchCarbonCreditData = useCallback(
    debounce(async (zipCode: string) => {
      if (zipCode.length !== 5) return;

      try {
        const data = await getCarbonCredit(zipCode);
        if (data) {
          setCarbonCreditData(data);
        } else {
          console.error('No data returned from getCarbonCredit');
        }
      } catch (error) {
        console.error('Error fetching carbon credit information:', error);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (formData.zipCode) {
      fetchCarbonCreditData(formData.zipCode);
    }
  }, [formData.zipCode, fetchCarbonCreditData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, dilutionRate: parseFloat(e.target.value) }));
  };

  const handleSubmit = useCallback(async () => {
    if (!carbonCreditData) {
      console.error('Carbon credit data not available');
      // alert user that carbon credit data is not available
      alert('Carbon credit data not available');
      return;
    }

    const joiningWeek = getWeeksSinceStart(formData.joiningDate);
    const endWeek = joiningWeek + 208;

    const input = {
      state: carbonCreditData.state,
      electricityPricePerKWh: formData.electricityPriceKWh,
      carbonCreditsPerMwh: carbonCreditData.average_carbon_certificates,
      dilutionRate: Number(formData.dilutionRate),
      joiningWeek,
      endWeek,
      estimatedSlope,
      avgPeakSunHours: carbonCreditData.average_sunlight,
      capacity: formData.capacity,
      pastProtocolFees: weeklyProtocolFees,
    };

    const estimatedResults = await estimateRewards(input);
    
    setResults(estimatedResults);
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
      {showResults && carbonCreditData &&
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