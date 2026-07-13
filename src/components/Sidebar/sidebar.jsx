import SightingForm from "./SightingForm/SightingForm";
import Legends from "../Legends/legends";
import "./sidebar.css";
import MapTypeFlipButton from "./MapTypeFlipButton/MapTypeFlipButton";
import SidebarActionButton from "./SidebarActionButton/SidebarActionButton";

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

  return (
    <>
      <button
        className="mobile-menu-button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? "Close" : "Menu"}
      </button>
      <aside
        className={`sidebar ${isMobileMenuOpen ? "mobile-open" : ""} ${
          isAddMode ? "sidebar-hidden-while-adding" : ""
        }`}

      >

        <div className="sidebar-header">
          <p className="sidebar-label">Kasane Field System</p>

          <h1>Kasane Tracker</h1>

          <p className="sidebar-intro">
            Report sightings, map alerts, and monitor live safari activity
            around Kasane.
          </p>
        </div>

        <div className="sidebar-main-section">
          <div className="sidebar-action-section">
            <SidebarActionButton
              variant="add"
              onClick={handleToggleAddMode}
              isActive={isAddMode}
            >
              {isAddMode ? "Adding Mode On" : "Add Sighting"}
            </SidebarActionButton>

            <SidebarActionButton variant="location" onClick={onAddMyLocation}>
              My Location
            </SidebarActionButton>
          </div>

          <div className="sidebar-map-section">
            <p className="map-description">Click to switch Maps</p>

            <MapTypeFlipButton mapType={mapType} onClick={onCycleMapType} />

            <div className={`current-map-status current-map-${mapType}`}>
              <span className="current-map-label">Current Map</span>
              <strong>{mapType}</strong>
            </div>
          </div>

          <Legends />
        </div>

        <div className="sidebar-sos-section">
          <button className="sos-button" onClick={onSOS}>
            SOS
          </button>

          <p className="sos-description">
            Sends your current custom Kasane location as an emergency marker.
          </p>
        </div>
      </aside>

      {isAddMode && (
        <div className="floating-sighting-form">
          <SightingForm
            selectedPosition={selectedPosition}
            onAddSighting={onAddSighting}
            onCancel={() => setIsAddMode(false)}
          />
        </div>
      )}
    </>
  );
}

export default Sidebar;
