// helpers/MapUpdater.jsx
import { useMap } from "react-leaflet";
import { useEffect } from "react";

const MapUpdater = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center]);

  return null;
};

export default MapUpdater;
