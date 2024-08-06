interface ZipCodeInfo {
  country: string;
  state: string;
  city: string;
  lat: number;
  lng: number;
}

async function getZipCodeInfo(zipCode: string): Promise<ZipCodeInfo | null> {
  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
    const data = await response.json();


    if (data && data.places && data.places[0]) {
      return {
        country: data.country,
        state: data.places[0].state,
        city: data.places[0]['place name'],
        lat: parseFloat(data.places[0].latitude),
        lng: parseFloat(data.places[0].longitude)
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching zip code information:', error);
    return null;
  }
}
