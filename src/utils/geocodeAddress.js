// utils/geocodeAddress.js
export async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        display_name: data[0].display_name,
      };
    } else {
      console.warn("No se encontró la dirección:", address);
      return null;
    }
  } catch (error) {
    console.error("Error al geocodificar dirección:", error);
    return null;
  }
}
