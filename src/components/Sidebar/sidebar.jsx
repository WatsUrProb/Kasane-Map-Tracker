import SightingForm from "./SightingForm/SightingForm";
import SOS from "../SOS/sos";
import Legends from "../Legends/legends";
import "./sidebar.css";
import SidebarActionButton from "./SidebarActionButton/SidebarActionButton";
import MapTypeFlipButton from "./MapTypeFlipButton/MapTypeFlipButton";

//icons imports
import pawIconUrl from "../../assets/icons/paw.svg";
import deadIconUrl from "../../assets/icons/dead.svg";
import campsiteIconUrl from "../../assets/icons/tent.svg";
import filmIconUrl from "../../assets/icons/film.svg";
import helpIconUrl from "../../assets/icons/help.svg";

const markerTypes = [
  {
    label: "Animal",
    icon: pawIconUrl,
  },
  {
    label: "Carcass",
    icon: deadIconUrl,
  },
  {
    label: "Campsite",
    icon: campsiteIconUrl,
  },
  {
    label: "Film Crew",
    icon: filmIconUrl,
  },
  {
    label: "SOS",
    icon: helpIconUrl,
  },
];

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
          <SidebarActionButton
            variant="add"
            onClick={() => setIsAddMode(!isAddMode)}
            isActive={isAddMode}
          >
            {isAddMode ? "Adding Mode On" : "Add Sighting"}
          </SidebarActionButton>

          <SidebarActionButton variant="location" onClick={onAddMyLocation}>
            My Location
          </SidebarActionButton>

          <MapTypeFlipButton mapType={mapType} npm onClick={onCycleMapType} />
        </div>

        <div className="current-map-status">
          <span className="current-map-label">Current Map:</span>
          <strong>{mapType}</strong>
        </div>

        <SOS onSOS={onSOS} />

        <Legends />
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
