import React from 'react';
import Chart from './Chart';
import FarmCountChart from './FarmCountChart';

interface ChartSectionProps {
  weeklyData: any;
  weeklyFarmCount: {week: string, value: number}[];
  dilutionRate?: number;
  estimatedSlope: number;
}

export const ChartSection: React.FC<ChartSectionProps> = (
  { 
    weeklyData, 
    weeklyFarmCount,
    dilutionRate=1,
    estimatedSlope
  }) => {
  const chartData = weeklyData;

  const slopeOfEstimate = estimatedSlope * dilutionRate;

  const startX = chartData[0].week;
  const endX = chartData[chartData.length - 1].week;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mt-10">
      <FarmCountChart 
        title="Weekly Farm Count" 
        data={weeklyFarmCount} 
        slopeOfEstimate={slopeOfEstimate}
        startX={startX}
        endX={endX}
      />
      <Chart 
        title="Cumulative Glow Token and USDC Rewards"
        data={chartData}
        chartType="composed"
        dataKeys={['totalTokenRevenue', 'totalUSDCRevenue']}
        colors={['#ffc658', '#82ca9d']}
      />
      <Chart 
        title="Weekly Glow Token and USDC Rewards"
        data={chartData}
        chartType="composed"
        dataKeys={['weeklyUSDCRevenue', 'weeklyTokenRevenue']}
        colors={['#82ca9d', '#8884d8']}
      />
      <Chart 
        title="Cumulative Value of Electricity Produced"
        data={chartData}
        chartType="line"
        dataKeys={['totalElectricityRevenue']}
        colors={['#ff7300']}
      />
    </div>
  );
};

