import { InputData, ResultData, ProtocolFee } from '../types';
import calculateProtocolFee from './calculateProtocolFee';
import { AnnualEletricityPriceIncreasePerState } from '../constants'

// TODO: get the real values from the API for the bonding curve amount
const BONDING_CURVE_AMOUNT = 4253757.18;
const TOTAL_WEEKS = 208;
const WEEKLY_TOKEN_REWARDS = 175000;

function calculateUSDCReward(currentWeek: number, protocolFees: ProtocolFee[]): number {
  const startWeek = Math.max(0, currentWeek - 16 - TOTAL_WEEKS);
  const endWeek = Math.max(0, currentWeek - 16);

  const relevantFees = protocolFees
    .filter(fee => fee.week >= startWeek && fee.week < endWeek)
    .reduce((sum, fee) => sum + fee.protocolFee, 0);

  const totalRewardPool = BONDING_CURVE_AMOUNT + relevantFees;
  return totalRewardPool / TOTAL_WEEKS;
}


function extendProtocolFees(
  realFees: ProtocolFee[],
  endWeek: number,
  estimatedSlope: number,
  avgProtocolFee: number
): ProtocolFee[] {
  const extendedFees = [...realFees];
  const lastRealWeek = Math.max(...realFees.map(fee => fee.week));

  for (let week = lastRealWeek + 1; week <= endWeek; week++) {
    const estimatedNewFarms = estimatedSlope;
    const estimatedFee = estimatedNewFarms * avgProtocolFee;
    extendedFees.push({ week, protocolFee: estimatedFee });
  }

  return extendedFees;
}

function estimateRewards(input: any): any {
  const {
    state,
    endWeek,
    joiningWeek,
    estimatedSlope,
    dilutionRate,
    electricityPricePerKWh,
    avgPeakSunHours,
    carbonCreditsPerMwh,
    capacity,
    pastProtocolFees,
    avgProtocolFee,
    avgWeeklyCarbonCredits,
  } = input;

  const powerProductionPerWeekKwh = capacity * avgPeakSunHours * 7;
  const avgCarbonCreditProductionPerWeek = avgWeeklyCarbonCredits;
  const carbonCreditProductionPerWeek = carbonCreditsPerMwh * powerProductionPerWeekKwh / 1000;

  const annualEletricityPriceIncreasePercentage = AnnualEletricityPriceIncreasePerState[state] || 0;
  let electricityPricePerKWhWithIncrease = electricityPricePerKWh;

  const protocolFee = calculateProtocolFee(
    electricityPricePerKWh,
    avgPeakSunHours,
    capacity,
  );

  const weeklyProtocolFee = protocolFee / 192;

  // Convert and extend the protocol fees array
  const extendedProtocolFees = extendProtocolFees(pastProtocolFees, endWeek, estimatedSlope, avgProtocolFee);
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
    // every 52 weeks, increase the electricity price by the annual increase percentage
    if ((week - joiningWeek) % 52 === 0) {
      electricityPricePerKWhWithIncrease = electricityPricePerKWhWithIncrease * ( 1 + annualEletricityPriceIncreasePercentage / 100);
    }

    weeks.push(week);
    const currentNumFarms = Math.round(dilutionRate * estimatedSlope * week - 16) - Math.max(0, Math.round(dilutionRate * estimatedSlope * (week - 208) - 16));
    numFarms.push(currentNumFarms);
    
    const totalProtocolFee = currentNumFarms * weeklyProtocolFee;
    totalProtocolFees.push(totalProtocolFee);

    const totalCarbonCreditsPerWeek = currentNumFarms * avgCarbonCreditProductionPerWeek;
    const totalProtocolFeePerWeek = currentNumFarms * avgProtocolFee;

    // Calculate USDC reward using the new function
    const weeklyUSDCReward = calculateUSDCReward(week, extendedProtocolFees) * (carbonCreditProductionPerWeek / totalCarbonCreditsPerWeek);
    weeklyUSDCRewards.push(weeklyUSDCReward);

    const weeklyTokenReward = WEEKLY_TOKEN_REWARDS * (protocolFee / totalProtocolFeePerWeek);
    weeklyTokenRewards.push(weeklyTokenReward);

    const weeklyElectricityRevenue = powerProductionPerWeekKwh * electricityPricePerKWhWithIncrease;
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

  return {
    weeklyData: weeklyData,
    farmStats: { 
      protocolFee,
      carbonCreditProductionPerWeek,
      powerProductionPerWeekKwh,
    }
  };
}

export default estimateRewards;