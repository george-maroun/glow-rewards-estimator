'use server'

import calculateRewards from '../utils/estimateRewardsHelper';

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
 
export async function getEstimate(formData: FormData) {
  const inputData = {
    location: formData.get('location') as string,
    capacity: formData.get('capacity') as string,
    joiningDate: formData.get('joiningDate') as string,
    dilutionRate: formData.get('dilutionRate') as string,
    viewRewardsAfter: formData.get('viewRewardsAfter') as string,
  };

  console.log(inputData);

  const input:InputData = {
    initialInvestment: 50000,
    installationCost: 30000,
    protocolFee: 20000,
    numberOfPanels: 42,
    electricityPricePerKWh: 0.11,
    powerProductionPerWeek: 300,
    carbonCreditProductionPerWeek: 0.09,
  }

  const results = calculateRewards(input);

  return results;
}


