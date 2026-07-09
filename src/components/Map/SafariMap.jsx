import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./SafariMap.css";
import "../../utils/leaficon.js";

//Icon Imports://
import pawIconUrl from "../../assets/icons/paw.svg";
import deadIconUrl from "../../assets/icons/dead.svg";
import homeIconUrl from "../../assets/icons/home.svg";
import filmIconUrl from "../../assets/icons/film.svg";
import helpIconUrl from "../../assets/icons/tent.svg";

const kasaneCenter = [-17.8167, 25.15];

const userLocationIcon = L.divIcon({
  className: "user-location-icon",
  html: `<div class="user-location-dot"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function createSvgMarker(iconUrl, markerClass) {
  return L.divIcon({
    className: `svg-map-marker ${markerClass}`,
    html: `<img src="${iconUrl}" alt="" />`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19],
  });
}

const animalIcon = createSvgMarker(pawIconUrl, "animal-svg-marker");
const carcassIcon = createSvgMarker(deadIconUrl, "carcass-svg-marker");
const campsiteIcon = createSvgMarker(homeIconUrl, "campsite-svg-marker");
const filmCrewIcon = createSvgMarker(filmIconUrl, "film-svg-marker");
const sosIcon = createSvgMarker(helpIconUrl, "sos-svg-marker");



function MapClickHandler({ isAddMode, onMapClick }) {
  useMapEvents({
    click(event) {
      if (isAddMode) {
        onMapClick(event.latlng);
      }
    },
  });

  return null;
}

function RecenterMap({
  userLocation,
  shouldCenterOnUser,
  onFinishedCenteringUser,
}) {
  const map = useMap();

  useEffect(() => {
    if (userLocation && shouldCenterOnUser) {
      map.setView([userLocation.lat, userLocation.lng], 14);
      onFinishedCenteringUser();
    }
  }, [userLocation, shouldCenterOnUser, map, onFinishedCenteringUser]);

  return null;
}

function getSightingTitle(spot) {
  if (spot.category === "animal") {
    return spot.animalType;
  }

  if (spot.category === "carcass") {
    return "Carcass Hotspot";
  }

  if (spot.category === "campsite") {
    return "Temporary Campsite";
  }

  if (spot.category === "filmCrew") {
    return "Film Crew Vehicle";
  }

  if (spot.category === "sos") {
    return "SOS Alert";
  }

  return "Sighting";
}

function getMarkerIcon(spot) {
  if (spot.category === "animal") {
    return animalIcon;
  }

  if (spot.category === "carcass") {
    return carcassIcon;
  }

  if (spot.category === "campsite") {
    return campsiteIcon;
  }

  if (spot.category === "filmCrew") {
    return filmCrewIcon;
  }

  if (spot.category === "sos") {
    return sosIcon;
  }

  return animalIcon;
}

function BaseMapLayers({ mapType }) {
  if (mapType === "satellite") {
    return (
      <TileLayer
        attribution="Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
    );
  }

  if (mapType === "hybrid") {
    return (
      <>
        <TileLayer
          attribution="Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />

        <TileLayer
          attribution="Labels &copy; Esri"
          url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        />

        <TileLayer
          attribution="Roads &copy; Esri"
          url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
        />
      </>
    );
  }

  return (
    <TileLayer
      attribution="&copy; OpenStreetMap contributors"
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
  );
}

function SafariMap({
  sightings,
  isAddMode,
  selectedPosition,
  userLocation,
  shouldCenterOnUser,
  onFinishedCenteringUser,
  onMapClick,
  mapType,
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const carcassRadius = isMobile ? 100 : 100;
  return (
    <MapContainer
      center={kasaneCenter}
      zoom={15}
      scrollWheelZoom={true}
      className="safari-map"
    >
      <RecenterMap
        userLocation={userLocation}
        shouldCenterOnUser={shouldCenterOnUser}
        onFinishedCenteringUser={onFinishedCenteringUser}
      />

      <BaseMapLayers mapType={mapType} />

      <MapClickHandler isAddMode={isAddMode} onMapClick={onMapClick} />

      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={userLocationIcon}
        >
          <Popup>
            <strong>You are here</strong>
            <br />
            Custom temporary location near Kasane.
            <br />
            Lat: {userLocation.lat}
            <br />
            Lng: {userLocation.lng}
          </Popup>
        </Marker>
      )}

     {sightings.map((spot) => {
  const customIcon = getMarkerIcon(spot);

  return (
    <Marker
      key={spot.id}
      position={[spot.lat, spot.lng]}
      icon={customIcon}
    >
      <Popup>
        <strong>{getSightingTitle(spot)}</strong>
        <br />
        Category: {spot.category}
        <br />

        {spot.category === "animal" && (
          <>
            Animal: {spot.animalType}
            <br />
            Group: {spot.groupType}
            <br />
            Count: {spot.count}
            <br />
            Behaviour: {spot.behaviour}
            <br />
          </>
        )}

        {spot.description && (
          <>
            Notes: {spot.description}
            <br />
          </>
        )}

        Lat: {spot.lat}
        <br />
        Lng: {spot.lng}
      </Popup>
    </Marker>
  );
})}

      {selectedPosition && (
        <Marker position={[selectedPosition.lat, selectedPosition.lng]}>
          <Popup>
            <strong>New sighting location selected</strong>
            <br />
            Fill in the form and press Add to Map.
            <br />
            Lat: {selectedPosition.lat.toFixed(4)}
            <br />
            Lng: {selectedPosition.lng.toFixed(4)}
          </Popup>
        </Marker>
      )}

      {sightings
        .filter((spot) => spot.category === "carcass")
        .map((spot) => (
          <Circle
            key={`circle-${spot.id}`}
            center={[spot.lat, spot.lng]}
            radius={carcassRadius}
            pathOptions={{
              color: "red",
              fillColor: "red",
              fillOpacity: 0.15,
            }}
          />
        ))}
    </MapContainer>
  );
}

export default SafariMap;
