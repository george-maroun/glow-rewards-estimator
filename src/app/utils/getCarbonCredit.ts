// TODO: Remove mock data and implement the actual API call
// TODO: Implement a caching mechanism to avoid calling the API multiple times
const getCarbonCredit = async (lat:number, lon:number) => {
  console.log('lat:', lat);
  console.log('lon:', lon);
  try {
    // const response = await fetch(`http://95.217.194.59:35015/api/v1/geo-stats?latitude=${lat}&longitude=${lon}`);
    const response = await fetch(`https://api.carbonkit.net/`);
    const data = await response.json();
    console.log('data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching carbon credit information:', error);
    return {
      average_sunlight: 4.696276712328763,
      average_carbon_certificates: 0.407455669122476
    }
  }
}

export default getCarbonCredit;