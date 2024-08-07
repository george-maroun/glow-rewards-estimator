import React from 'react';
import Chart from './Chart';
import FarmCountChart from './FarmCountChart';

interface ChartSectionProps {
  results: any;
  weeklyFarmCount: {week: string, value: number}[];
  dilutionRate?: number;
}

export const ChartSection: React.FC<ChartSectionProps> = (
  { 
    results, 
    weeklyFarmCount,
    dilutionRate=1
  }) => {
  const chartData = results.weeklyData;
  const currFarmCountData = weeklyFarmCount[weeklyFarmCount.length - 1];
  const slopeOfEstimate = Number(currFarmCountData.value) / (Number(currFarmCountData.week) - 16) * dilutionRate;

  const startX = 34;
  const endX = 208;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <FarmCountChart 
        title="Weekly Farm Count" 
        data={weeklyFarmCount} 
        slopeOfEstimate={slopeOfEstimate}
        startX={startX}
        endX={endX}
      />
      <Chart 
        title="Cumulative Rewards"
        data={chartData}
        chartType="composed"
        dataKeys={['totalTokenRevenue', 'totalUSDCRevenue']}
        colors={['#ffc658', '#82ca9d']}
      />
      <Chart 
        title="Weekly Rewards"
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

