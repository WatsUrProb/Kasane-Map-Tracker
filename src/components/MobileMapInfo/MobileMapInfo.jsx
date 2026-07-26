import Legends from "../Legends/legends";
import "./MobileMapInfo.css";

function MobileMapInfo({ mapType }) {
  return (
    <section className="mobile-map-info">
      <div className={`mobile-map-mode mobile-map-mode-${mapType}`}>
        <span>Map</span>
        <strong>{mapType}</strong>
      </div>

      <Legends />
    </section>
  );
}

export default MobileMapInfo;