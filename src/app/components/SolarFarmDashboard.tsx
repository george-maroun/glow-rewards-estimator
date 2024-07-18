"use client"

import React, { useState, useEffect } from 'react';
import { FormSection } from './FormSection';
import { ResultsSection } from './ResultsSection';
import { useSolarFarmForm } from '../hooks/useSolarFarmForm';

interface SolarFarmDashboardProps {
  weeklyFarmCount: any; // Replace 'any' with a more specific type if possible
}

const SolarFarmDashboard: React.FC<SolarFarmDashboardProps> = ({weeklyFarmCount}) => {
  const { formData, handleInputChange, handleSliderChange, handleSubmit, showResults, results } = useSolarFarmForm();


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



// TODO: try to convert this to a server component:
// https://www.youtube.com/watch?v=ukpgxEemXsk