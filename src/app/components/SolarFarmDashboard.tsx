"use client";

import React, { useEffect, useState } from 'react';
import { FormSection } from './FormSection';
import { ResultsSection } from './ResultsSection';
import calculateRewards from '../utils/estimateRewards';
import getCarbonCredit from '../utils/getCarbonCredit';
import getLocationDataFromZipcode from '../utils/getLocationDataFromZipcode';
import getWeeksSinceStart from '../utils/getWeeksSinceStart';

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

const SolarFarmDashboard: React.FC<SolarFarmDashboardProps> = ({ weeklyFarmCount, weeklyProtocolFees }) => {
  const [formData, setFormData] = useState<FormData>({
    zipCode: '',
    capacity: 0,
    joiningDate: '',
    dilutionRate: 1,
    electricityPriceKWh: 0.11,
  });
  const [showResults, setShowResults] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [avgPeakSunHours, setAvgPeakSunHours] = useState(0);
  const [carbonCreditsPerMwh, setCarbonCreditsPerMwh] = useState(0);
  const [state, setState] = useState('');

  const estimatedSlope = Number(weeklyFarmCount[weeklyFarmCount.length - 1].value) / (Number(weeklyFarmCount[weeklyFarmCount.length - 1].week) - 16);

  
  
  useEffect(() => {
    if (showResults) {
      handleSubmit();
    }
  }, [weeklyFarmCount, formData]);

  useEffect(() => {
    const fetchData = async () => {
      if (!formData.zipCode) return;

      const locData = await getLocationDataFromZipcode(formData.zipCode);
      console.log('locData:', locData);
      if (!locData) return;

      try {
        const { lat, lng, state } = locData;
        setState(state);
        const { average_sunlight, average_carbon_certificates } = await getCarbonCredit(lat, lng);
        setAvgPeakSunHours(average_sunlight);
        setCarbonCreditsPerMwh(average_carbon_certificates);   
      } catch (error) {
        console.error('Error fetching carbon credit information:', error);
      }
    };

    if (formData.zipCode.toString().length === 5) fetchData();
  }, [formData.zipCode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, dilutionRate: parseFloat(e.target.value) }));
  };

  const handleSubmit = async () => {
    const joiningWeek = getWeeksSinceStart(formData.joiningDate);
    const endWeek = joiningWeek + 208;

    const input = {
      state: state,
      electricityPricePerKWh: formData.electricityPriceKWh,
      carbonCreditsPerMwh: carbonCreditsPerMwh,
      dilutionRate: Number(formData.dilutionRate),
      joiningWeek,
      endWeek,
      estimatedSlope: estimatedSlope,
      avgPeakSunHours: avgPeakSunHours,
      capacity: formData.capacity,
      pastProtocolFees: weeklyProtocolFees,
    };

    const calculatedRewards = await calculateRewards(input);
    
    setShowResults(prev => prev + 1);
    setResults(calculatedRewards);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Glow Farm Rewards Estimator</h1>
      <FormSection 
        formData={formData}
        handleInputChange={handleInputChange}
        handleSliderChange={handleSliderChange}
        handleSubmit={handleSubmit}
      />
      {showResults > 0 ?
      <ResultsSection 
        weeklyFarmCount={weeklyFarmCount} 
        formData={formData} 
        results={results} 
        estimatedSlope={estimatedSlope}
      /> : null}
    </div>
  );
};

export default SolarFarmDashboard;