import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import IntroPage from "./components/IntroPage/IntroPage";
import Sidebar from "./components/Sidebar/sidebar";
import SafariMap from "./components/Map/SafariMap";
import SOSBanner from "./components/SOSBanner/SOSBanner";
import SightingNotification from "./components/SightingNotification/SightingNotification";
import ReportsModal from "./components/ReportsModal/ReportsModal";

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
    verifiedCount: row.verified_count || 0,
    lastVerifiedAt: row.last_verified_at
      ? new Date(row.last_verified_at).getTime()
      : null,
  };
}

function App() {
  const [hasEnteredApp, setHasEnteredApp] = useState(false);
  const [activeSightingNotification, setActiveSightingNotification] =
    useState(null);
  const [sightings, setSightings] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [shouldCenterOnUser, setShouldCenterOnUser] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSOSAlert, setActiveSOSAlert] = useState(null);

  //For notification modal
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [selectedReportToFocus, setSelectedReportToFocus] = useState(null);

  // "regular", "satellite", or "hybrid"
  const [mapType, setMapType] = useState("regular");

  //Main sighting-loading function
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

  //For real-time updates with multiple users
  useEffect(() => {
    const channel = supabase
      .channel("sightings-realtime-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sightings",
        },
        (payload) => {
          console.log("Realtime event received:", payload);

          if (payload.eventType === "INSERT") {
            const newSighting = convertDatabaseSighting(payload.new);

            if (newSighting.category === "sos") {
              setActiveSOSAlert(newSighting);
            } else {
              setActiveSightingNotification(newSighting);
            }

            setSightings((prevSightings) => {
              const alreadyExists = prevSightings.some(
                (sighting) => sighting.id === newSighting.id,
              );

              if (alreadyExists) {
                return prevSightings;
              }

              return [newSighting, ...prevSightings];
            });
          }

          if (payload.eventType === "UPDATE") {
            const updatedSighting = convertDatabaseSighting(payload.new);

            setSightings((prevSightings) =>
              prevSightings.map((sighting) =>
                sighting.id === updatedSighting.id ? updatedSighting : sighting,
              ),
            );
          }
        },
      )
      .subscribe((status, error) => {
        console.log("Realtime subscription status:", status);

        if (error) {
          console.error("Realtime subscription error:", error);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  //60 seconds timer to remove expired sightings at interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();

      setSightings((prevSightings) =>
        prevSightings.filter((sighting) => sighting.expiresAt > now),
      );
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  //6 seconds function to remove sighting notification
  useEffect(() => {
    if (!activeSightingNotification) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setActiveSightingNotification(null);
    }, 10000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [activeSightingNotification]);

  function handleMapClick(latlng) {
    if (!isAddMode) {
      return;
    }

    setSelectedPosition({
      lat: latlng.lat,
      lng: latlng.lng,
    });
  }

  async function handleVerifySighting(sightingId) {
    const currentSighting = sightings.find(
      (sighting) => sighting.id === sightingId,
    );

    if (!currentSighting) {
      alert("Could not find this sighting.");
      return;
    }

    const newVerifiedCount = currentSighting.verifiedCount + 1;
    const newLastVerifiedAt = new Date().toISOString();

    const { data, error } = await supabase
      .from("sightings")
      .update({
        verified_count: newVerifiedCount,
        last_verified_at: newLastVerifiedAt,
      })
      .eq("id", sightingId)
      .select()
      .single();

    if (error) {
      console.error("Error verifying sighting:", error);
      alert("Failed to verify sighting.");
      return;
    }

    const updatedSighting = convertDatabaseSighting(data);

    setSightings((prevSightings) =>
      prevSightings.map((sighting) =>
        sighting.id === sightingId ? updatedSighting : sighting,
      ),
    );
  }

  async function handleAddSighting(formData) {
    if (!selectedPosition) {
      alert("Please click a location on the map first.");
      return;
    }

    const expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();

    //collect from sighting form
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
    setActiveSightingNotification(convertedSighting);
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
    setActiveSOSAlert(convertedSOS);
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

  function handleFocusReport(sighting) {
    setSelectedReportToFocus(sighting);
    setIsReportsModalOpen(false);
  }

  if (!hasEnteredApp) {
    return <IntroPage onEnter={() => setHasEnteredApp(true)} />;
  }

  return (
    <div className="app">
      <SOSBanner
        sosAlert={activeSOSAlert}
        onDismiss={() => setActiveSOSAlert(null)}
      />

      {
        <SightingNotification
          sighting={activeSightingNotification}
          onDismiss={() => setActiveSightingNotification(null)}
        />
      }
      <button
        className="reports-open-button"
        onClick={() => setIsReportsModalOpen(true)}
      >
        Recent Reports
      </button>

      {isReportsModalOpen && (
        <ReportsModal
          sightings={sightings}
          onClose={() => setIsReportsModalOpen(false)}
          onFocusReport={handleFocusReport}
        />
      )}
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
          onVerifySighting={handleVerifySighting}
          reportToFocus={selectedReportToFocus}
        />
      </main>
    </div>
  );
}

export default App;
