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
  weeklyUSDCRewards: any;
}

interface FormData {
  zipCode: string;
  capacity: number;
  joiningDate: string;
  dilutionRate: number;
  avgPeakSunHours: number;
  estimatedSlope: number;
  electricityPriceKWh: number;
}

const SolarFarmDashboard: React.FC<SolarFarmDashboardProps> = ({ weeklyFarmCount, weeklyUSDCRewards }) => {
  const [formData, setFormData] = useState<FormData>({
    zipCode: '',
    capacity: 0,
    joiningDate: '',
    dilutionRate: 1,
    avgPeakSunHours: 5,
    estimatedSlope: 1,
    electricityPriceKWh: 0.11,
  });
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [avgPeakSunHours, setAvgPeakSunHours] = useState(0);
  const [averageCarbonCertificates, setAverageCarbonCertificates] = useState(0);

  useEffect(() => {
    const currFarmCountData = weeklyFarmCount[weeklyFarmCount.length - 1];
    const slopeOfEstimate = Number(currFarmCountData.value) / Number(currFarmCountData.week);
    setFormData(prev => ({ ...prev, estimatedSlope: slopeOfEstimate }));
  }, [weeklyFarmCount]);

  useEffect(() => {
    if (showResults) {
      handleSubmit();
    }
  }, [weeklyFarmCount, formData]);

  useEffect(() => {
    const fetchData = async () => {
      if (!formData.zipCode) return;

      const locData = await getLocationDataFromZipcode(formData.zipCode);
      if (!locData) return;

      try {
        const { lat, lng } = locData;
        const { average_sunlight, average_carbon_certificates } = await getCarbonCredit(lat, lng);
        setAvgPeakSunHours(average_sunlight);
        setAverageCarbonCertificates(average_carbon_certificates);   
      } catch (error) {
        console.error('Error fetching carbon credit information:', error);
      }
    };
    fetchData();
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
      electricityPricePerKWh: formData.electricityPriceKWh,
      carbonCreditProductionPerWeek: 0.09,
      dilutionRate: Number(formData.dilutionRate),
      joiningWeek,
      endWeek,
      estimatedSlope: Number(formData.estimatedSlope),
      avgPeakSunHours: avgPeakSunHours,
      capacity: formData.capacity,
      weeklyUSDCRewards: weeklyUSDCRewards,
    };

    const calculatedRewards = await calculateRewards(input);
    
    setShowResults(true);
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
      {showResults && <ResultsSection weeklyFarmCount={weeklyFarmCount} formData={formData} results={results} />}
    </div>
  );
};

export default SolarFarmDashboard;