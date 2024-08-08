import React from 'react';

type RewardsAtYearY = {
  estimatedTokenRevenue: number;
  estimatedUSDCRevenue: number;
  estimatedElectricityRevenue: number;
};

interface RewardsOverTheYears {
  yearOne: RewardsAtYearY;
  yearTwo: RewardsAtYearY;
  yearThree: RewardsAtYearY;
  yearFour: RewardsAtYearY;
}

export const RewardsDisplay: React.FC<any> = ({
  results
}) => {

  const parseResults = () => {
    const rewardsOverTheYears: RewardsOverTheYears = {
      yearOne: {
        estimatedTokenRevenue: 0,
        estimatedUSDCRevenue: 0,
        estimatedElectricityRevenue: 0,
      },
      yearTwo: {
        estimatedTokenRevenue: 0,
        estimatedUSDCRevenue: 0,
        estimatedElectricityRevenue: 0,
      },
      yearThree: {
        estimatedTokenRevenue: 0,
        estimatedUSDCRevenue: 0,
        estimatedElectricityRevenue: 0,
      },
      yearFour: {
        estimatedTokenRevenue: 0,
        estimatedUSDCRevenue: 0,
        estimatedElectricityRevenue: 0,
      },
    };
    let i = 0;
    let previousYear = {
      totalTokenRevenue: 0,
      totalUSDCRevenue: 0,
      totalElectricityRevenue: 0,
    };
    results.weeklyData?.forEach((result: any) => {
      i++;
      if (i === 52 || i === 104 || i === 156 || i === 208) {
        const yearKey = i === 52 ? 'yearOne' : i === 104 ? 'yearTwo' : i === 156 ? 'yearThree' : 'yearFour';
        rewardsOverTheYears[yearKey].estimatedTokenRevenue = result.totalTokenRevenue - previousYear.totalTokenRevenue;
        rewardsOverTheYears[yearKey].estimatedUSDCRevenue = result.totalUSDCRevenue - previousYear.totalUSDCRevenue;
        rewardsOverTheYears[yearKey].estimatedElectricityRevenue = result.totalElectricityRevenue - previousYear.totalElectricityRevenue;
        previousYear = {
          totalTokenRevenue: result.totalTokenRevenue,
          totalUSDCRevenue: result.totalUSDCRevenue,
          totalElectricityRevenue: result.totalElectricityRevenue,
        };
      }
    });
    return rewardsOverTheYears;
  }

  const {
    yearOne,
    yearTwo,
    yearThree,
    yearFour,
  } = parseResults();

  const totalRewards = {
    estimatedTokenRevenue: yearOne.estimatedTokenRevenue + yearTwo.estimatedTokenRevenue + yearThree.estimatedTokenRevenue + yearFour.estimatedTokenRevenue,
    estimatedUSDCRevenue: yearOne.estimatedUSDCRevenue + yearTwo.estimatedUSDCRevenue + yearThree.estimatedUSDCRevenue + yearFour.estimatedUSDCRevenue,
    estimatedElectricityRevenue: yearOne.estimatedElectricityRevenue + yearTwo.estimatedElectricityRevenue + yearThree.estimatedElectricityRevenue + yearFour.estimatedElectricityRevenue,
  };

  return (
    <div className="my-8">
      <h3 className="text-lg font-semibold mb-2">Total Rewards Received Over 4 Years</h3>
      <table className="w-full border-collapse border border-gray-300 max-w-[800px]">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Year</th>
            <th className="border border-gray-300 p-2">Glow Tokens</th>
            <th className="border border-gray-300 p-2">USDC</th>
            <th className="border border-gray-300 p-2">Electricity Produced Value</th>
          </tr>
        </thead>
        <tbody>
          {[
            { year: 'Year 1', data: yearOne },
            { year: 'Year 2', data: yearTwo },
            { year: 'Year 3', data: yearThree },
            { year: 'Year 4', data: yearFour },
            { year: 'Total', data: totalRewards },
          ].map(({ year, data }) => (
            <tr key={year} className={year === 'Total' ? 'font-bold' : ''}>
              <td className="border border-gray-300 p-2">{year}</td>
              <td className="border border-gray-300 p-2">{data.estimatedTokenRevenue.toLocaleString()}</td>
              <td className="border border-gray-300 p-2">${data.estimatedUSDCRevenue.toLocaleString()}</td>
              <td className="border border-gray-300 p-2">${data.estimatedElectricityRevenue.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};