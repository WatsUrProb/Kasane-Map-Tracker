import SightingForm from "./SightingForm/SightingForm";
import SOS from "../SOS/sos";
import Legends from "../Legends/legends";
import "./sidebar.css";

function Sidebar({
  isAddMode,
  setIsAddMode,
  selectedPosition,
  onAddSighting,
  onAddMyLocation,
  onSOS,
  mapType,
  onCycleMapType,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) {
  function handleToggleAddMode() {
    setIsAddMode(!isAddMode);

    // On mobile, close the menu after pressing Add Sighting
    // so the user can see and tap the map.
    setIsMobileMenuOpen(false);
  }

  function getMapButtonText() {
    if (mapType === "regular") {
      return "Satellite";
    }

    if (mapType === "satellite") {
      return "Hybrid";
    }

    return "Regular";
  }

  return (
    <>
      <button
        className="mobile-menu-button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? "Close" : "Menu"}
      </button>

      <aside className={`sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <h1>Kasane Safari Tracker</h1>
          <p>
            Track recent sightings, SOS alerts, carcass hotspots, campsites,
            film crew vehicles, and safari activity.
          </p>
        </div>

        <div className="sidebar-actions">
          <button className="add-sighting-button" onClick={handleToggleAddMode}>
            {isAddMode ? "Cancel Add" : "Add Sighting"}
          </button>

          <button className="my-location-button" onClick={onAddMyLocation}>
            My Location
          </button>

          <button className="map-type-button" onClick={onCycleMapType}>
            Map: {getMapButtonText()}
          </button>
        </div>

        <p className="current-map-type">
          Current map: <strong>{mapType}</strong>
        </p>

        <SOS onSOS={onSOS} />

        <Legends />
      </aside>

      {isAddMode && (
        <div className="floating-sighting-form">
          <SightingForm
            selectedPosition={selectedPosition}
            onAddSighting={onAddSighting}
          />
        </div>
      )}
    </>
  );
}

export default Sidebar;