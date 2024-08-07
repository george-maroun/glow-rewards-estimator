import { useState } from 'react';
import { FormData } from '../types';
import getWeeksSinceStart from '../utils/getWeeksSinceStart';
import calculateRewards from '../utils/estimateRewards'

export const useSolarFarmForm = () => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, dilutionRate: parseFloat(e.target.value) });
  };

  const handleSetEstimatedSlope = (slope: number) => {
    setFormData({ ...formData, estimatedSlope: slope });
  };

  const handleSubmit = async () => {
    const joiningWeek = getWeeksSinceStart(formData.joiningDate);
    const endWeek = joiningWeek + 208;

    const input:any = {
      electricityPricePerKWh: formData.electricityPriceKWh,
      carbonCreditProductionPerWeek: 0.09,
      dilutionRate: Number(formData.dilutionRate),
      joiningWeek: joiningWeek,
      endWeek: endWeek,
      estimatedSlope: Number(formData.estimatedSlope),
      avgPeakSunHours: formData.avgPeakSunHours,
      capacity: formData.capacity,
    }

    const calculatedRewards = await calculateRewards(input);
    
    setShowResults(true);
    setResults(calculatedRewards);
  };

  return { formData, handleInputChange, handleSliderChange, handleSubmit, handleSetEstimatedSlope, showResults, results };
};