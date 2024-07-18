import { InputData, ResultData } from '../types';
import calculateProtocolFee from './calculateProtocolFeeHelper';

function calculateRewards(input: InputData): ResultData {
  // Constants
  
  const weeklyRewardConstant = 20000;
  const tokenRewardConstant = 175000;
  // TODO: Tweaks to the formula
  const startWeek = input.joiningWeek;
  const numWeeks = input.endWeek;
  const { estimatedSlope, dilutionRate } = input;
  const powerProductionPerWeek = input.capacity * input.avgPeakSunHours * 7;
  // Average farm stats
  const avgProtocolFee = 20000;
  const avgCarbonCreditProductionPerWeek = 0.08884375;

  const protocolFee = calculateProtocolFee(
    input.electricityPricePerKWh, 
    input.avgPeakSunHours, 
    input.capacity,
    );

  const weeklyProtocolFee = protocolFee / 192;

  console.log('protocolFee', protocolFee);

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

  for (let week = startWeek; week <= numWeeks; week++) {
    weeks.push(week);
    const currentNumFarms = Math.round(dilutionRate * estimatedSlope * week);
    numFarms.push(currentNumFarms);
    
    const totalProtocolFee = currentNumFarms * weeklyProtocolFee;
    totalProtocolFees.push(totalProtocolFee);

    const totalCarbonCreditsPerWeek = currentNumFarms * avgCarbonCreditProductionPerWeek;
    const totalProtocolFeePerWeek = currentNumFarms * avgProtocolFee;

    const weeklyUSDCReward = (input.carbonCreditProductionPerWeek / totalCarbonCreditsPerWeek) * weeklyRewardConstant;
    weeklyUSDCRewards.push(weeklyUSDCReward);

    const weeklyTokenReward = tokenRewardConstant * (protocolFee / totalProtocolFeePerWeek);
    weeklyTokenRewards.push(weeklyTokenReward);

    const weeklyElectricityRevenue = powerProductionPerWeek * input.electricityPricePerKWh;
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