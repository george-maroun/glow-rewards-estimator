type InputData = {
  initialInvestment: number;
  installationCost: number;
  protocolFee: number;
  numberOfPanels: number;
  electricityPricePerKWh: number;
  powerProductionPerWeek: number;
  carbonCreditProductionPerWeek: number;
  // Add other input fields as needed
}

type ResultData = {
  weeklyData: {
    week: number;
    totalUSDCRevenue: number;
    totalElectricityRevenue: number;
    totalTokenRevenue: number;
    weeklyUSDCRevenue: number;
    weeklyElectricityRevenue: number;
    weeklyTokenRevenue: number;
  }[];
  // Add other result fields as needed
}

function calculateRewards(input: InputData): ResultData {
  // Constants
  const weeklyProtocolFee = input.protocolFee / 192;
  const weeklyRewardConstant = 20000;
  const tokenRewardConstant = 175000;
  const numWeeks = 4 * 52;
  const startWeek = 34;

  // Average farm stats
  const avgProtocolFee = 20000;
  const avgCarbonCreditProductionPerWeek = 0.08884375;

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
    const currentNumFarms = Math.round(4 * week - 29.429);
    numFarms.push(currentNumFarms);
    
    const totalProtocolFee = currentNumFarms * weeklyProtocolFee;
    totalProtocolFees.push(totalProtocolFee);

    const totalCarbonCreditsPerWeek = currentNumFarms * avgCarbonCreditProductionPerWeek;
    const totalProtocolFeePerWeek = currentNumFarms * avgProtocolFee;

    const weeklyUSDCReward = (input.carbonCreditProductionPerWeek / totalCarbonCreditsPerWeek) * weeklyRewardConstant;
    weeklyUSDCRewards.push(weeklyUSDCReward);

    const weeklyTokenReward = tokenRewardConstant * (input.protocolFee / totalProtocolFeePerWeek);
    weeklyTokenRewards.push(weeklyTokenReward);

    const weeklyElectricityRevenue = input.powerProductionPerWeek * input.electricityPricePerKWh;
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