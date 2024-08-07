import React from 'react';
import { FormData } from '../types';
import { RewardsDisplay } from './RewardsDisplay';
import { ChartSection } from './ChartSection';

interface ResultsSectionProps {
  formData: any;
  results: any;
  weeklyFarmCount: {week: string, value: number}[];
  estimatedSlope: number;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ formData, results, weeklyFarmCount, estimatedSlope }) => {
  return (
    <div className="results">
      <h2 className="text-xl font-semibold mb-4">Rewards</h2>
      <RewardsDisplay results={results} />
      <ChartSection 
        results={results} 
        weeklyFarmCount={weeklyFarmCount}
        dilutionRate={formData.dilutionRate}
        estimatedSlope={estimatedSlope}
      />
    </div>
  );
};