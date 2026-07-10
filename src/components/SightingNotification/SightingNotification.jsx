import "./SightingNotification.css";

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

function getNotificationTitle(sighting) {
  if (sighting.category === "animal") {
    return "New animal sighting";
  }

  if (sighting.category === "carcass") {
    return "New carcass hotspot";
  }

  if (sighting.category === "campsite") {
    return "New campsite report";
  }

  if (sighting.category === "filmCrew") {
    return "New film crew report";
  }

  return "New sighting report";
}

function getNotificationIcon(sighting) {
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

function getNotificationDetails(sighting) {
  if (sighting.category === "animal") {
    return `${sighting.animalType || "Animal"} · ${
      sighting.count || 0
    } reported · ${sighting.behaviour || "No behaviour noted"}`;
  }

  if (sighting.description) {
    return sighting.description;
  }

  return `Reported at Lat ${sighting.lat.toFixed(4)}, Lng ${sighting.lng.toFixed(4)}`;
}

function SightingNotification({ sighting, onDismiss }) {
  if (!sighting) {
    return null;
  }

  return (
    <div className="sighting-notification">
      <div className="sighting-notification-icon">
        {getNotificationIcon(sighting)}
      </div>

      <div className="sighting-notification-text">
        <strong>{getNotificationTitle(sighting)}</strong>

        <p>{getNotificationDetails(sighting)}</p>

        <span>
          Reported {getMinutesAgo(sighting.createdAt)} · Lat{" "}
          {sighting.lat.toFixed(4)}, Lng {sighting.lng.toFixed(4)}
        </span>
      </div>

      <button className="sighting-notification-dismiss" onClick={onDismiss}>
        ×
      </button>
    </div>
  );
}

export default SightingNotification;