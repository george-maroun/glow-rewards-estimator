'use server'

import calculateRewards from '../utils/estimateRewards';

import type { InputData, FormData } from '../types';
 
export async function getEstimate(formData: FormData) {

  // console.log(formData)
  // // const inputData = {
  // //   estimatedSlope: formData.get('estimatedSlope') as string,
  // //   location: formData.get('location') as string,
  // //   capacity: formData.get('capacity') as string,
  // //   joiningDate: formData.get('joiningDate') as string,
  // //   dilutionRate: formData.get('dilutionRate') as string,
  // //   viewRewardsAfter: formData.get('viewRewardsAfter') as string,
  // // };
  // const inputData = {
  //   estimatedSlope: formData.estimatedSlope,
  //   location: formData.location,
  //   capacity: formData.capacity,
  //   joiningDate: formData.joiningDate,
  //   dilutionRate: formData.dilutionRate,
  //   viewRewardsAfter: formData.viewRewardsAfter,
  // };

  // console.log(inputData);

  // const input:InputData = {
  //   initialInvestment: 50000,
  //   installationCost: 30000,
  //   protocolFee: 20000,
  //   numberOfPanels: 42,
  //   electricityPricePerKWh: 0.11,
  //   powerProductionPerWeek: 300,
  //   carbonCreditProductionPerWeek: 0.09,
  //   dilutionRate: Number(inputData.dilutionRate),
  //   joiningDate: 34,
  //   endDate: 208,
  //   estimatedSlope: Number(inputData.estimatedSlope),
  // }

  // const results = calculateRewards(input);

  // return results;
}


