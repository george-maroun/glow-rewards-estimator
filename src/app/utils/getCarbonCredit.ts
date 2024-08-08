const getCarbonCredit = async (lat:number, lon:number) => {
  console.log('lat:', lat);
  console.log('lon:', lon);
  try {
    const response = await fetch(`http://95.217.194.59:35015/api/v1/geo-stats?latitude=${lat}&longitude=${lon}`);
    const data = await response.json();
    console.log('API works:', data);
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