import { useState } from "react";
import MapView from "./components/MapView/MapView";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import SearchPanel from "./components/MapView/SearchPanel";

const App = () => {
  const [searchData, setSearchData] = useState(null);

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
        <MapView searchData={searchData} />
      </div>
      <SearchPanel onSearchSubmit={setSearchData} />
    </div>
  );
};

export default App;
