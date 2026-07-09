import "./SOSBanner.css";

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

function SOSBanner({ sosAlert, onDismiss }) {
  if (!sosAlert) {
    return null;
  }

  return (
    <div className="sos-banner">
      <div className="sos-banner-content">
        <div className="sos-banner-icon">!</div>

        <div className="sos-banner-text">
          <strong>SOS alert nearby</strong>
          <p>
            {sosAlert.description || "Emergency alert reported."}
          </p>
          <span>
            Reported {getMinutesAgo(sosAlert.createdAt)} · Lat{" "}
            {sosAlert.lat.toFixed(4)}, Lng {sosAlert.lng.toFixed(4)}
          </span>
        </div>
      </div>

      <button className="sos-banner-dismiss" onClick={onDismiss}>
        Dismiss
      </button>
    </div>
  );
}

export default SOSBanner;