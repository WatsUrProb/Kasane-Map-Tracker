import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import IntroPage from "./components/IntroPage/IntroPage";
import Sidebar from "./components/Sidebar/sidebar";
import SafariMap from "./components/Map/SafariMap";

import "./App.css";

//mini-function to convert row in Supabase into object for react
function convertDatabaseSighting(row) {
  return {
    id: row.id,
    category: row.category,
    animalType: row.animal_type || "",
    groupType: row.group_type || "",
    count: row.count || 0,
    behaviour: row.behaviour || "",
    description: row.description || "",
    lat: row.lat,
    lng: row.lng,
    createdAt: new Date(row.created_at).getTime(),
    expiresAt: new Date(row.expires_at).getTime(),
  };
}

function App() {
  const [hasEnteredApp, setHasEnteredApp] = useState(false);

  const [sightings, setSightings] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [shouldCenterOnUser, setShouldCenterOnUser] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // "regular", "satellite", or "hybrid"
  const [mapType, setMapType] = useState("regular");


useEffect(() => {
  async function loadSightings() {
    const { data, error } = await supabase
      .from("sightings")
      .select("*")
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading sightings:", error);
      return;
    }

    console.log("Raw Supabase rows:", data);

    const convertedSightings = data.map(convertDatabaseSighting);

    console.log("Converted sightings for map:", convertedSightings);

    setSightings(convertedSightings);
  }

  loadSightings();
}, []);

  function handleMapClick(latlng) {
    if (!isAddMode) {
      return;
    }

    setSelectedPosition({
      lat: latlng.lat,
      lng: latlng.lng,
    });
  }

  async function handleAddSighting(formData) {
  if (!selectedPosition) {
    alert("Please click a location on the map first.");
    return;
  }

  const expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();

  const newSightingForDatabase = {
    category: formData.category,
    animal_type: formData.animalType,
    group_type: formData.groupType,
    count: Number(formData.count),
    behaviour: formData.behaviour,
    description: formData.description,
    lat: selectedPosition.lat,
    lng: selectedPosition.lng,
    expires_at: expiresAt,
  };

  const { data, error } = await supabase
    .from("sightings")
    .insert(newSightingForDatabase)
    .select()
    .single();

  if (error) {
    console.error("Error adding sighting:", error);
    alert("Failed to save sighting to Supabase.");
    return;
  }

  const convertedSighting = convertDatabaseSighting(data);

  setSightings((prevSightings) => [convertedSighting, ...prevSightings]);

  setSelectedPosition(null);
  setIsAddMode(false);
}

  function handleAddMyLocation() {
    const allowCustomLocation = window.confirm(
      "Allow Safari Map to add your temporary location near Kasane?",
    );

    if (!allowCustomLocation) {
      return;
    }

    const customKasaneLocation = {
      lat: -17.8167,
      lng: 25.15,
    };

    setUserLocation(customKasaneLocation);
    setShouldCenterOnUser(true);
  }

  function handleFinishedCenteringUser() {
    setShouldCenterOnUser(false);
  }
async function handleSOS() {
  const description = window.prompt("Describe your emergency:");

  if (description === null) {
    return;
  }

  const customKasaneSOSLocation = {
    lat: -17.8367,
    lng: 25.18,
  };

  const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString();

  const newSOSForDatabase = {
    category: "sos",
    animal_type: "",
    group_type: "",
    count: 0,
    behaviour: "",
    description: description || "SOS emergency alert",
    lat: customKasaneSOSLocation.lat,
    lng: customKasaneSOSLocation.lng,
    expires_at: expiresAt,
  };

  const { data, error } = await supabase
    .from("sightings")
    .insert(newSOSForDatabase)
    .select()
    .single();

  if (error) {
    console.error("Error adding SOS:", error);
    alert("Failed to save SOS alert to Supabase.");
    return;
  }

  const convertedSOS = convertDatabaseSighting(data);

  setUserLocation(customKasaneSOSLocation);
  setShouldCenterOnUser(true);
  setSightings((prevSightings) => [convertedSOS, ...prevSightings]);
}

  function handleCycleMapType() {
    setMapType((prevMapType) => {
      if (prevMapType === "regular") {
        return "satellite";
      }

      if (prevMapType === "satellite") {
        return "hybrid";
      }

      return "regular";
    });
  }

  if (!hasEnteredApp) {
    return <IntroPage onEnter={() => setHasEnteredApp(true)} />;
  }

  return (
    <div className="app">
      <Sidebar
        isAddMode={isAddMode}
        setIsAddMode={setIsAddMode}
        selectedPosition={selectedPosition}
        onAddSighting={handleAddSighting}
        onAddMyLocation={handleAddMyLocation}
        onSOS={handleSOS}
        mapType={mapType}
        onCycleMapType={handleCycleMapType}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="map-area">
        <SafariMap
          sightings={sightings}
          isAddMode={isAddMode}
          selectedPosition={selectedPosition}
          userLocation={userLocation}
          shouldCenterOnUser={shouldCenterOnUser}
          onFinishedCenteringUser={handleFinishedCenteringUser}
          onMapClick={handleMapClick}
          mapType={mapType}
        />
      </main>
    </div>
  );
}

export default App;

/*

# Kasane Safari Tracker

Kasane Safari Tracker is a React + Vite web application prototype for mapping safari activity around Kasane, Botswana. 
The app allows users to view and add recent wildlife-related map markers such as animal sightings, carcass hotspots, temporary campsites, 
film crew vehicles, and SOS alerts.

The project uses React state to manage the interface, React Leaflet to render an interactive map, a
nd Supabase as the backend database for persistent sighting storage. 

## Current Features

- Interactive map centered around Kasane
- Add wildlife sightings by selecting a point on the map
- Support for categories such as animals, carcasses, campsites, film crew vehicles, and SOS alerts
- Custom SVG-based map markers for different sighting categories
- Map type switching between regular, satellite, and hybrid views
- Mobile-responsive layout with a floating menu and compact sighting form
- Supabase PostgreSQL table for storing sightings persistently
- Row Level Security policies for public read and insert access during prototype testing

## Tech Stack

- React
- Vite
- React Leaflet / Leaflet
- Supabase
- PostgreSQL
- CSS media queries for responsive design

## Project Goal

The goal of this project is to explore how a real-time safari field tool could help users share temporary location-based information,
 such as recent animal sightings or emergency alerts, while learning frontend development, interactive maps, database integration,
  and multi-user web app architecture. */
