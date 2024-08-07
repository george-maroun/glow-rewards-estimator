import SolarFarmDashboard from './components/SolarFarmDashboard';
// import getCarbonCreditsHelper from './utils/getCarbonCreditHelper';
import { getWeeklyRewardsForWeeksMulticall } from './multicalls/getWeeklyUSDCRewards';
import { createPublicClient, http, isAddress } from 'viem'
import { mainnet } from 'wagmi/chains'
import getWeeksSinceStart from './utils/getWeeksSinceStart';

async function getData() {
  const response = await fetch('https://glowstats.xyz/api/allData');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();

  return data.weeklyFarmCount;
}

const getWeeklyUSDCRewards = async () => {
  const transport = http(process.env.PRIVATE_RPC_URL!)
  const viemClient = createPublicClient({
    transport: transport,
    chain: mainnet, //need mainnet import for the multicll
  })

  const currentWeek = getWeeksSinceStart('');
  const lastWeekToFetch = currentWeek + 208

  const weeklyUSDCRewards = await getWeeklyRewardsForWeeksMulticall({
    client: viemClient,
    weekStart: currentWeek,
    weekEnd: lastWeekToFetch,
  })

  return weeklyUSDCRewards
}

export default async function Home() {
  const data = await getData()
  const weeklyUSDCRewards = await getWeeklyUSDCRewards()

  return (
    <main className="pt-4 pb-20">
      <SolarFarmDashboard 
        weeklyFarmCount={data} 
        weeklyUSDCRewards={weeklyUSDCRewards}
      />
    </main>
  );
}
