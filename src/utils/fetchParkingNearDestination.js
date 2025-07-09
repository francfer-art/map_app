export async function fetchParkingNearDestination(dest, radius = 1000) {
  const overpassUrl = "https://overpass-api.de/api/interpreter";

  const query = `
    [out:json];
    (
      node["amenity"="parking"](around:${radius},${dest.lat},${dest.lng});
    );
    out body;
  `;

  const response = await fetch(overpassUrl, {
    method: "POST",
    body: query,
  });

  const data = await response.json();
  return data.elements.map((el) => ({
    lat: el.lat,
    lng: el.lon,
    name: el.tags?.name || "Parking",
    type: el.tags?.amenity,
  }));
}
