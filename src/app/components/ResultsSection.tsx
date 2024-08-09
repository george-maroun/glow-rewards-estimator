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
  const { farmStats, weeklyData } = results;
  const { protocolFee, carbonCreditProductionPerWeek, powerProductionPerWeekKwh } = farmStats;

  const annualCarbonCredit = carbonCreditProductionPerWeek * 52;
  const annualPowerProductionMwh = powerProductionPerWeekKwh * 52 / 1000;

  return (
    <div className="results">
      <h2 className="text-xl font-semibold mb-4">Estimated Farm Stats</h2>
      <table className="w-full border-collapse border border-gray-300 max-w-[700px]">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Protocol Fee</th>
            <th className="border border-gray-300 p-2">Annual Electricity Production</th>
            <th className="border border-gray-300 p-2">Annual Carbon Credit Production</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-2 text-center">${Math.round(protocolFee)?.toLocaleString()}</td>
            <td className="border border-gray-300 p-2 text-center">{annualPowerProductionMwh?.toLocaleString()} MWh</td>
            <td className="border border-gray-300 p-2 text-center">{(annualCarbonCredit * 0.65)?.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      <h2 className="text-xl font-semibold mt-8">Estimated Rewards</h2>
      <RewardsDisplay weeklyData={weeklyData} />
      <ChartSection 
        weeklyData={weeklyData} 
        weeklyFarmCount={weeklyFarmCount}
        dilutionRate={formData.dilutionRate}
        estimatedSlope={estimatedSlope}
      />
    </div>
  );
};