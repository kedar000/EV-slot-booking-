"use client"; // Keep this if you're using hooks or scripts

import { useEffect, useState } from "react";
import Script from "next/script";

export default function HomePage() {
  const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    // Get the user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleScriptLoad = () => {
    setIsMapLoaded(true);
  };

  console.log("User Location:", userLocation);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyDRE48bscExYHq3vV9Gxs10dfGSYknIrsY`}
        onLoad={handleScriptLoad}
      />
      {isMapLoaded && (
        <div style={{ width: "100%", height: "500px", background: "lightgrey" }}>
          Map Placeholder (User Location: {userLocation.lat}, {userLocation.lng})
        </div>
      )}
    </>
  );
}