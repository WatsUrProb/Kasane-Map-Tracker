import "./MapTypeFlipButton.css";

function getMapTypeLabel(mapType) {
  if (mapType === "regular") {
    return "Regular";
  }

  if (mapType === "satellite") {
    return "Satellite";
  }

  if (mapType === "hybrid") {
    return "Hybrid";
  }

  return "Regular";
}

function getNextMapTypeLabel(mapType) {
  if (mapType === "regular") {
    return "Satellite";
  }

  if (mapType === "satellite") {
    return "Hybrid";
  }

  if (mapType === "hybrid") {
    return "Regular";
  }

  return "Satellite";
}

function MapTypeFlipButton({ mapType, onClick }) {
  const currentLabel = getMapTypeLabel(mapType);
  const nextLabel = getNextMapTypeLabel(mapType);

  return (
    <button
      type="button"
      className="map-type-flip-button"
      data-front={`Map: ${currentLabel}`}
      data-back={`Switch to ${nextLabel}`}
      onClick={onClick}
    />
  );
}

export default MapTypeFlipButton;