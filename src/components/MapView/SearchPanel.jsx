import { useState } from "react";
import { geocodeAddress } from "../../utils/geocodeAddress";

const SearchPanel = ({ onSearchSubmit }) => {
  const [visible, setVisible] = useState(false);

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [wantsStops, setWantsStops] = useState(null);
  const [stopFrequency, setStopFrequency] = useState("");
  const [wantsParking, setWantsParking] = useState(null);
  const [parkingRadius, setParkingRadius] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
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


  const togglePanel = () => setVisible(!visible);

  const resetForm = () => {
    setOrigin("");
    setDestination("");
    setWantsStops(null);
    setStopFrequency("");
    setWantsParking(null);
    setParkingRadius("");
    setErrorMessage("");
  };

  const toggleType = (typeKey) => {
    setSelectedTypes((prev) =>
      prev.includes(typeKey)
        ? prev.filter((key) => key !== typeKey)
        : [...prev, typeKey]
    );
  };

  const validateAllFields = () => {
    if (!origin.trim() || !destination.trim()) {
      setErrorMessage("Please fill in both origin and destination.");
      return false;
    }
    if (wantsStops === null) {
      setErrorMessage("Please select whether you want to schedule stops.");
      return false;
    }
    if (
      wantsStops === true &&
      (!stopFrequency || isNaN(stopFrequency) || stopFrequency <= 0)
    ) {
      setErrorMessage("Please enter a valid stop frequency.");
      return false;
    }
    if (wantsParking === null) {
      setErrorMessage("Please select whether you want to find parking.");
      return false;
    }
    if (
      wantsParking === true &&
      (!parkingRadius || isNaN(parkingRadius) || parkingRadius <= 0)
    ) {
      setErrorMessage("Please enter a valid parking radius.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleBuscarDireccion = async () => {
    if (!validateAllFields()) {
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    setIsLoading(true);
    try {
      const originCoords = await geocodeAddress(origin);
      const destinationCoords = await geocodeAddress(destination);

      if (originCoords && destinationCoords) {
        const result = {
          origin: originCoords,
          destination: destinationCoords,
          wantsStops,
          stopFrequency: wantsStops ? Number(stopFrequency) : null,
          wantsParking,
          parkingRadius: wantsParking ? Number(parkingRadius) : null,
          selectedStopTypes: wantsStops ? selectedTypes : [],
        };

        console.log("Datos de búsqueda:", result);
        onSearchSubmit(result);

        setVisible(false);
        resetForm();
      } else {
        setErrorMessage(
          "Please check the addresses you entered. They could not be geocoded."
        );
        setTimeout(() => setErrorMessage(""), 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {visible ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "320px",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            padding: "24px 16px",
            display: "flex",
            flexDirection: "column",
            color: "white",
            zIndex: 1000,
            overflow: "visible",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ marginBottom: "16px" }}>Plan your route</h2>
            <button
              onClick={togglePanel}
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                color: "white",
                cursor: "pointer",
              }}
              title="Close"
            >
              ☰
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              paddingRight: "8px",
              marginBottom: "16px",
            }}
          >
            {isLoading ? (
              <div style={{ textAlign: "center", padding: "16px" }}>
                <div className="spinner" style={{ marginBottom: "8px" }} />
                <div>Calculating route...</div>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Where are you coming from?"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    backgroundColor: "black",
                    color: "white",
                    marginBottom: "12px",
                  }}
                />
                <input
                  type="text"
                  placeholder="Where are you going?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    backgroundColor: "black",
                    color: "white",
                    marginBottom: "20px",
                  }}
                />
                <div style={{ marginBottom: "8px" }}>
                  Do you want me to schedule stops?
                </div>
                <div
                  style={{ display: "flex", gap: "10px", marginBottom: "12px" }}
                >
                  <button
                    onClick={() => setWantsStops(true)}
                    style={{
                      flex: 1,
                      backgroundColor:
                        wantsStops === true ? "green" : "transparent",
                      color: wantsStops === true ? "white" : "inherit",
                      padding: "8px",
                      borderRadius: "4px",
                    }}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setWantsStops(false)}
                    style={{
                      flex: 1,
                      backgroundColor:
                        wantsStops === false ? "red" : "transparent",
                      color: wantsStops === false ? "white" : "inherit",
                      padding: "8px",
                      borderRadius: "4px",
                    }}
                  >
                    No
                  </button>
                </div>
                {wantsStops && (
                  <input
                    type="number"
                    placeholder="Frecuencia (km)"
                    value={stopFrequency}
                    onChange={(e) => setStopFrequency(e.target.value)}
                    style={{
                      width: "100%",
                      marginBottom: "20px",
                      padding: "8px",
                      backgroundColor: "black",
                      color: "white",
                    }}
                  />
                )}
                {wantsStops && (
                  <>
                    <div style={{ marginBottom: "8px" }}>
                      Choose stop types:
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginBottom: "20px",
                      }}
                    >
                      {Object.keys(typeMap).map((typeKey) => (
                        <button
                          key={typeKey}
                          onClick={() => toggleType(typeKey)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "4px",
                            backgroundColor: selectedTypes.includes(typeKey)
                              ? "dodgerblue"
                              : "transparent",
                            color: selectedTypes.includes(typeKey)
                              ? "white"
                              : "inherit",
                            border: "1px solid white",
                            cursor: "pointer",
                          }}
                        >
                          {typeKey.replace(/_/g, " ")}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <div style={{ marginBottom: "8px" }}>
                  Do you want me to find parking at the destination?
                </div>
                <div
                  style={{ display: "flex", gap: "10px", marginBottom: "12px" }}
                >
                  <button
                    onClick={() => setWantsParking(true)}
                    style={{
                      flex: 1,
                      backgroundColor:
                        wantsParking === true ? "green" : "transparent",
                      color: wantsParking === true ? "white" : "inherit",
                      padding: "8px",
                      borderRadius: "4px",
                    }}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setWantsParking(false)}
                    style={{
                      flex: 1,
                      backgroundColor:
                        wantsParking === false ? "red" : "transparent",
                      color: wantsParking === false ? "white" : "inherit",
                      padding: "8px",
                      borderRadius: "4px",
                    }}
                  >
                    No
                  </button>
                </div>
                {wantsParking && (
                  <input
                    type="number"
                    placeholder="Radio de búsqueda (km)"
                    value={parkingRadius}
                    onChange={(e) => setParkingRadius(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      backgroundColor: "black",
                      color: "white",
                    }}
                  />
                )}

                {errorMessage && (
                  <div
                    style={{
                      backgroundColor: "#ff4d4f",
                      color: "white",
                      padding: "8px",
                      borderRadius: "4px",
                      marginTop: "12px",
                      fontSize: "14px",
                      textAlign: "center",
                    }}
                  >
                    {errorMessage}
                  </div>
                )}
              </>
            )}
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              gap: "8px",
              justifyContent: "center",
              paddingBottom: "3rem",
            }}
          >
            <button
              onClick={handleBuscarDireccion}
              className="nav-btn"
              disabled={isLoading}
            >
              Finish
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={togglePanel}
          style={{
            position: "fixed",
            top: "20px",
            left: "20px",
            padding: "8px 12px",
            borderRadius: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            cursor: "pointer",
            zIndex: 1000,
            border: "none",
            fontSize: "16px",
            color: "white",
          }}
          title="Open panel"
        >
          ☰
        </button>
      )}
    </>
  );
};

export default SearchPanel;
