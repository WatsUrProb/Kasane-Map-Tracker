import "./ReportsModal.css";
import CloseButton from "../CloseButton/CloseButton";

function getMinutesAgo(timestamp) {
  if (!timestamp) {
    return "just now";
  }

  const minutes = Math.floor((Date.now() - timestamp) / 60000);

  if (minutes <= 0) {
    return "just now";
  }

  if (minutes === 1) {
    return "1 min ago";
  }

  return `${minutes} min ago`;
}

function getReportIcon(sighting) {
  if (sighting.category === "sos") {
    return "🚨";
  }

  if (sighting.category === "animal") {
    return "🐾";
  }

  if (sighting.category === "carcass") {
    return "☠️";
  }

  if (sighting.category === "campsite") {
    return "🏠";
  }

  if (sighting.category === "filmCrew") {
    return "🎥";
  }

  return "📍";
}

function getReportTitle(sighting) {
  if (sighting.category === "sos") {
    return "SOS Alert";
  }

  if (sighting.category === "animal") {
    return sighting.animalType
      ? `${sighting.animalType} sighting`
      : "Animal sighting";
  }

  if (sighting.category === "carcass") {
    return "Carcass hotspot";
  }

  if (sighting.category === "campsite") {
    return "Campsite report";
  }

  if (sighting.category === "filmCrew") {
    return "Film crew report";
  }

  return "Sighting report";
}

function getReportDescription(sighting) {
  if (sighting.category === "animal") {
    return `${sighting.count || 0} reported · ${
      sighting.behaviour || "No behaviour noted"
    }`;
  }

  return sighting.description || "No description provided.";
}

function ReportsModal({ sightings, onClose, onFocusReport }) {
  const sortedSightings = [...sightings].sort(
    (a, b) => b.createdAt - a.createdAt,
  );

  return (
    <div className="reports-modal-backdrop">
      <div className="reports-modal">
        <div className="reports-modal-header">
          <div>
            <h2>Recent Reports</h2>
            <p>Tap a report to zoom to its marker.</p>
          </div>

          <CloseButton onClick={onClose} ariaLabel="Close reports modal" />
        </div>

        <div className="reports-list">
          {sortedSightings.length === 0 && (
            <p className="reports-empty">No active reports right now.</p>
          )}

          {sortedSightings.map((sighting) => (
            <button
              key={sighting.id}
              className={`report-item report-item-${sighting.category}`}
              onClick={() => onFocusReport(sighting)}
            >
              <div className="report-icon">{getReportIcon(sighting)}</div>

              <div className="report-info">
                <strong>{getReportTitle(sighting)}</strong>

                <span>{getReportDescription(sighting)}</span>

                <small>
                  Reported {getMinutesAgo(sighting.createdAt)} · Verified{" "}
                  {sighting.verifiedCount || 0}
                </small>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReportsModal;
