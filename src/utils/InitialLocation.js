export async function getApproxUserLocation() {
  try {
    const response = await fetch('http://ip-api.com/json/');
    const data = await response.json();

    if (data.status === 'success') {
      return {
        lat: data.lat,
        lng: data.lon,
        city: data.city,
        region: data.regionName,
        country: data.country,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error obteniendo ubicación aproximada:', error);
    return null;
  }
}
