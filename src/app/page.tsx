import SolarFarmDashboard from './components/SolarFarmDashboard';
import getCarbonCreditsHelper from './utils/getCarbonCreditHelper';

async function getData() {
  const response = await fetch('https://glowstats.xyz/api/allData');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();

  return data.weeklyFarmCount;
}



export default async function Home() {
  const data = await getData()

  const d = await getCarbonCreditsHelper('37.7749', '-122.4194');
  console.log("data on avg sun hours and carbon credits", d)

  return (
    <main className="pt-4 pb-20">
      <SolarFarmDashboard weeklyFarmCount={data}/>
    </main>
  );
}
