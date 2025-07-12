export async function fetchStopsAlongRoute(routeCoords, radius = 1000, amenity = "restaurant") {
  const overpassUrl = "https://overpass-api.de/api/interpreter";

  const sampledPoints = routeCoords.filter((_, i) => i % 10 === 0);

  const queries = sampledPoints
    .map(
      (point) => `node["amenity"="${amenity}"](around:${radius},${point.lat},${point.lng});`
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


async function fetchPOIsNearby(lat, lng, type, radius) {
  const typeMap = {
    restaurant: { key: "amenity", value: "restaurant" },
    parking: { key: "amenity", value: "parking" },
    fuel: { key: "amenity", value: "fuel" },
    rest_area: { key: "highway", value: "rest_area" },
    hotel: { key: "tourism", value: "hotel" },
    supermarket: { key: "shop", value: "supermarket" },
    station: { key: "railway", value: "station" },
    bus_stop: { key: "highway", value: "bus_stop" },
    toilets: { key: "amenity", value: "toilets" }
  };

  const selected = typeMap[type];
  if (!selected) {
    console.warn("Unknown type:", type);
    return [];
  }

  const query = `
    [out:json];
    node(around:${radius},${lat},${lng})["${selected.key}"="${selected.value}"];
    out body;
  `;

  const url = "https://overpass-api.de/api/interpreter";

  try {
    const response = await fetch(url, {
      method: "POST",
      body: query,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    const data = await response.json();

    return data.elements.map((el) => ({
      id: el.id,
      lat: el.lat,
      lng: el.lon,
      name: el.tags?.name || type,
      type: type,
    }));
  } catch (error) {
    console.error("Overpass API error:", error);
    return [];
  }
}


function calculateDistance(p1, p2) {
  const R = 6371000; // radio Tierra en metros
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(p2.lat - p1.lat);
  const dLng = toRad(p2.lng - p1.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(p1.lat)) *
      Math.cos(toRad(p2.lat)) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function fetchPOIsAlongRoute(routeCoords, type, stopFrequency, radius = 1000) {
  const results = [];
  let distanceAccum = 0;
  let lastStopPoint = routeCoords[0];

  for (let i = 1; i < routeCoords.length; i++) {
    const prev = routeCoords[i - 1];
    const curr = routeCoords[i];

    const segmentDist = calculateDistance(prev, curr);
    distanceAccum += segmentDist;

    if (distanceAccum >= stopFrequency) {
      const pois = await fetchPOIsNearby(curr.lat, curr.lng, type, radius);
      results.push(...pois);
      distanceAccum = 0;
      lastStopPoint = curr;

      // Si quieres poner un delay pequeño para evitar 429s, aquí puedes usar:
      // await new Promise(res => setTimeout(res, 20));
    }
  }

  // Eliminar duplicados
  const unique = {};
  results.forEach((poi) => {
    unique[poi.id] = poi;
  });

  return Object.values(unique);
}


