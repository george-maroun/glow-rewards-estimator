import React from 'react';
import { FormData } from '../types';
import { RewardsDisplay } from './RewardsDisplay';
import { ChartSection } from './ChartSection';

interface ResultsSectionProps {
  formData: FormData;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ formData }) => {
  return (
    <div className="results">
      <h2 className="text-xl font-semibold mb-4">Rewards</h2>
      <RewardsDisplay viewRewardsAfter={formData.viewRewardsAfter} />
      <ChartSection />
    </div>
  );
};