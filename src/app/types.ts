export interface FormData {
  zipCode: string;
  capacity: number;
  joiningDate: string;
  dilutionRate: number;
  avgPeakSunHours: number;
  estimatedSlope: number;
  electricityPriceKWh: number;
}

// export interface ProtocolFee {
//   id: string;
//   totalPayments: string;
// }

export type InputData = {
  electricityPricePerKWh: number;
  carbonCreditProductionPerWeek: number;
  // Add other input fields as needed
  dilutionRate: number;
  joiningWeek: number;
  endWeek: number;
  estimatedSlope: number;
  capacity: number;
  avgPeakSunHours: number;
}

export type ResultData = {
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

export interface ProtocolFee {
  week: number;
  protocolFee: number;
}

export interface RealProtocolFee {
  id: string;
  totalPayments: string;
}