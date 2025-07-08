import { useState } from "react";
import { geocodeAddress } from "../../utils/geocodeAddress";
import "./SearchPanel.css";

const SearchPanel = ({ onSearchSubmit }) => {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(1);

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [wantsStops, setWantsStops] = useState(null);
  const [stopFrequency, setStopFrequency] = useState("");
  const [wantsParking, setWantsParking] = useState(null);
  const [parkingRadius, setParkingRadius] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const togglePanel = () => setVisible(!visible);

  const handleBuscarDireccion = async () => {
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
        };

        console.log("Datos de búsqueda:", result);
        onSearchSubmit(result);

        setVisible(false);
        setStep(1);
      } else {
        alert("No se pudieron obtener coordenadas");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!origin.trim() || !destination.trim()) {
        alert("Por favor, ingresa origen y destino");
        return;
      }
    }
    if (
      step === 2 &&
      wantsStops === true &&
      (!stopFrequency || isNaN(stopFrequency) || stopFrequency <= 0)
    ) {
      alert("Por favor, ingresa una frecuencia válida");
      return;
    }
    if (
      step === 3 &&
      wantsParking === true &&
      (!parkingRadius || isNaN(parkingRadius) || parkingRadius <= 0)
    ) {
      alert("Por favor, ingresa un radio válido");
      return;
    }

    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
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
              }}
            />
          </>
        );

      case 2:
        return (
          <>
            <div style={{ marginBottom: "8px", color: "white" }}>
              Do you want me to schedule stops?
            </div>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
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
                  backgroundColor: wantsStops === false ? "red" : "transparent",
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
                  marginTop: "8px",
                  padding: "8px",
                  backgroundColor: "black",
                  color: "white",
                }}
              />
            )}
          </>
        );

      case 3:
        return (
          <>
            <div style={{ marginBottom: "8px", color: "white" }}>
              Do you want me to find parking at the destination?
            </div>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
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
                  marginTop: "8px",
                  padding: "8px",
                  backgroundColor: "black",
                  color: "white",
                }}
              />
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {visible ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: "32px",
            borderRadius: "8px",
            zIndex: 1000,
            width: "280px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            color: "white",
          }}
        >
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "16px" }}>
              <div className="spinner" style={{ marginBottom: "8px" }} />
              <div>Calculating route...</div>
            </div>
          ) : (
            <>
              {renderStep()}
            </>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              gap: "8px",
            }}
          >
            {step > 1 && (
              <button
                onClick={prevStep}
                style={{
                  flex: 1,
                  backgroundColor: "transparent",
                  color: "white",
                }}
              >
                Back
              </button>
            )}

            {step < 3 && (
              <button
                onClick={nextStep}
                style={{
                  flex: 1,
                  backgroundColor: "transparent",
                  color: "white",
                }}
              >
                Next
              </button>
            )}

            {step === 3 && (
              <button
                onClick={() => handleBuscarDireccion()}
                style={{
                  flex: 1,
                  backgroundColor: "transparent",
                  color: "white",
                }}
              >
                Finish
              </button>
            )}

            <button
              onClick={togglePanel}
              style={{
                background: "transparent",
                padding: "8px",
                color: "white",
              }}
              title="Cerrar panel"
            >
              ❌
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={togglePanel}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            padding: "8px 12px",
            borderRadius: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            cursor: "pointer",
            zIndex: 1000,
            border: "none",
            fontSize: "16px",
            color: "white",
          }}
          title="Mostrar panel"
        >
          🔍
        </button>
      )}
    </>
  );
};

export default SearchPanel;
