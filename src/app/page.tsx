import SolarFarmDashboard from './components/SolarFarmDashboard';

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

  return (
    <main className="pt-4 pb-20">
      <SolarFarmDashboard weeklyFarmCount={data}/>
    </main>
  );
}
