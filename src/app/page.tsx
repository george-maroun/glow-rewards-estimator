import Link from 'next/link';
import SolarFarmDashboard from './components/SolarFarmDashboard';
import { ProtocolFee, RealProtocolFee } from './types';
export const revalidate = 0;

async function getData() {
  const response = await fetch('https://glowstats.xyz/api/allData');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();

  return data.weeklyFarmCount;
}

const getWeeklyProtocolFees = async () => {
  try {
    const response = await fetch('https://glowstats.xyz/api/protocolFeesPerWeek');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.protocolFeesPerWeek;
  } catch (error) {
    console.error('Error fetching protocol fees:', error);
    return [];
  }
};

const getAuditData = async () => {
  try {
    const response = await fetch('https://glow.org/api/audits');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching audit data:', error);
    return [];
  }
}

export default async function Home() {
  const weeklyFarmCount = await getData();
  const weeklyProtocolFees = await getWeeklyProtocolFees();
  // const auditData = await getAuditData();

  function convertRealFeesToProtocolFees(realFees: RealProtocolFee[]): ProtocolFee[] {
    return realFees.map(fee => ({
      week: parseInt(fee.id, 10),
      protocolFee: parseFloat(fee.totalPayments) / 1_000_000 // Divide by 1M to get the real value
    })).reverse();
  }

  const realProtocolFees = convertRealFeesToProtocolFees(weeklyProtocolFees);


  return (
    <main className="pt-6 pr-8 ">
      <SolarFarmDashboard 
        weeklyFarmCount={weeklyFarmCount} 
        // weeklyUSDCRewards={weeklyUSDCRewards}
        weeklyProtocolFees={realProtocolFees}
        // auditData={auditData}
      />
      <div className=''>
        
      </div>
    </main>
  );
}
