import React from 'react';
import Chart from './Chart';
import FarmCountChart from './FarmCountChart';

export const ChartSection: React.FC<{ results: any, weeklyFarmCount: {week: string, value: number}[]; }> = ({ results, weeklyFarmCount }) => {
  const chartData = results.weeklyData;
  const currFarmCountData = weeklyFarmCount[weeklyFarmCount.length - 1];
  const slopeOfEstimate = currFarmCountData.value / Number(currFarmCountData.week);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <FarmCountChart 
        title="Weekly Farm Count" 
        data={weeklyFarmCount} 
      />
      <Chart 
        title="Weekly Rewards"
        data={chartData}
        chartType="composed"
        dataKeys={['weeklyUSDCRevenue', 'weeklyTokenRevenue']}
        colors={['#82ca9d', '#8884d8']}
      />
      <Chart 
        title="Cumulative Rewards"
        data={chartData}
        chartType="composed"
        dataKeys={['totalTokenRevenue', 'totalUSDCRevenue']}
        colors={['#ffc658', '#82ca9d']}
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

