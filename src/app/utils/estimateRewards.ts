import { InputData, ResultData } from '../types';
import calculateProtocolFee from './calculateProtocolFee';

function calculateRewards(input: InputData): ResultData {
  // Constants
  const WEEKLY_USDC_REWARD = 20000;
  const WEEKLY_TOKEN_REWARDS = 175000;
  // TODO: Tweaks to the formula
  const { 
    endWeek, 
    joiningWeek, 
    estimatedSlope, 
    dilutionRate,
    electricityPricePerKWh, 
    avgPeakSunHours, 
    carbonCreditProductionPerWeek,
    capacity 
  } = input;
  const powerProductionPerWeek = capacity * avgPeakSunHours * 7;
  // Average farm stats
  const avgProtocolFee = 20000;
  const avgCarbonCreditProductionPerWeek = 0.08884375;

  const protocolFee = calculateProtocolFee(
    electricityPricePerKWh, 
    avgPeakSunHours, 
    capacity,
  );

  const weeklyProtocolFee = protocolFee / 192;

  // Initialize arrays to store weekly data
  const weeks: number[] = [];
  const numFarms: number[] = [];
  const totalProtocolFees: number[] = [];
  const weeklyUSDCRewards: number[] = [];
  const weeklyTokenRewards: number[] = [];
  const weeklyElectricityRevenues: number[] = [];
  const totalUSDCRevenues: number[] = [];
  const totalElectricityRevenues: number[] = [];
  const totalTokenRevenues: number[] = [];

  for (let week = joiningWeek; week <= endWeek; week++) {
    weeks.push(week);
    const currentNumFarms = Math.round(dilutionRate * estimatedSlope * week);
    numFarms.push(currentNumFarms);
    
    const totalProtocolFee = currentNumFarms * weeklyProtocolFee;
    totalProtocolFees.push(totalProtocolFee);

    const totalCarbonCreditsPerWeek = currentNumFarms * avgCarbonCreditProductionPerWeek;
    const totalProtocolFeePerWeek = currentNumFarms * avgProtocolFee;

    const weeklyUSDCReward = (carbonCreditProductionPerWeek / totalCarbonCreditsPerWeek) * WEEKLY_USDC_REWARD;
    weeklyUSDCRewards.push(weeklyUSDCReward);

    const weeklyTokenReward = WEEKLY_TOKEN_REWARDS * (protocolFee / totalProtocolFeePerWeek);
    weeklyTokenRewards.push(weeklyTokenReward);

    const weeklyElectricityRevenue = powerProductionPerWeek * electricityPricePerKWh;
    weeklyElectricityRevenues.push(weeklyElectricityRevenue);

    const totalUSDCRevenue = weeklyUSDCRewards.reduce((a, b) => a + b, 0);
    totalUSDCRevenues.push(totalUSDCRevenue);

    const totalElectricityRevenue = weeklyElectricityRevenues.reduce((a, b) => a + b, 0);
    totalElectricityRevenues.push(totalElectricityRevenue);

    const totalTokenRevenue = weeklyTokenRewards.reduce((a, b) => a + b, 0);
    totalTokenRevenues.push(totalTokenRevenue);
  }

  // Prepare the result data with rounded values
  const weeklyData = weeks.map((week, index) => ({
    week,
    totalUSDCRevenue: Math.round(totalUSDCRevenues[index]),
    totalElectricityRevenue: Math.round(totalElectricityRevenues[index]),
    totalTokenRevenue: Math.round(totalTokenRevenues[index]),
    weeklyUSDCRevenue: Math.round(weeklyUSDCRewards[index]),
    weeklyElectricityRevenue: Math.round(weeklyElectricityRevenues[index]),
    weeklyTokenRevenue: Math.round(weeklyTokenRewards[index]),
  }));

  return { weeklyData };
}

export default calculateRewards;