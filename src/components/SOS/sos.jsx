import "./sos.css";

function SOS({ onSOS }) {
  return (
    <div className="sos-section">
      <button className="sos-button" onClick={onSOS}>
        SOS
      </button>

      <p className="sos-description">
        Sends your current custom Kasane location as an emergency marker.
      </p>
    </div>
  );
}

export default SOS;