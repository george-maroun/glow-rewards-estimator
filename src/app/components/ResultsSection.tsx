import React from 'react';
import { FormData } from '../types';
import { RewardsDisplay } from './RewardsDisplay';
import { ChartSection } from './ChartSection';

interface ResultsSectionProps {
  formData: FormData;
  results: any;
  weeklyFarmCount: {week: string, value: number}[];
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ formData, results, weeklyFarmCount }) => {
  return (
    <div className="results">
      <h2 className="text-xl font-semibold mb-4">Rewards</h2>
      <RewardsDisplay viewRewardsAfter={formData.viewRewardsAfter} />
      <ChartSection results={results} weeklyFarmCount={weeklyFarmCount}/>
    </div>
  );
};