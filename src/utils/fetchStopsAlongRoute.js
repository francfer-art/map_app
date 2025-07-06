export async function fetchStopsAlongRoute(routeCoords, radius = 1000, amenity = "restaurant") {
  const overpassUrl = "https://overpass-api.de/api/interpreter";

  const sampledPoints = routeCoords.filter((_, i) => i % 10 === 0);

  const queries = sampledPoints
    .map(
      (point) => `node["amenity"="${amenity}"](around:${radius},${point[0]},${point[1]});`
    )
    .join("\n");

  const query = `
    [out:json];
    (
      ${queries}
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
    name: el.tags?.name || amenity,
    type: el.tags?.amenity,
  }));
}
