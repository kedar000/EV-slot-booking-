"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function HomePage() {
  const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
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

  useEffect(() => {
    if (isMapLoaded && userLocation.lat !== 0 && userLocation.lng !== 0) {
      initMap();
    }
  }, [isMapLoaded, userLocation]);

  const handleScriptLoad = () => {
    setIsMapLoaded(true);
  };

  const initMap = () => {
    const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: userLocation,
      zoom: 10,
    });

    // Try using AdvancedMarkerElement if available, otherwise fallback to Marker
    const AdvancedMarker = google.maps.marker?.AdvancedMarkerElement;
    if (AdvancedMarker) {
      new AdvancedMarker({
        position: userLocation,
        map,
        title: "You are here!",
      });
    } else {
      new google.maps.Marker({
        position: userLocation,
        map,
        title: "You are here!",
      });
      console.warn("AdvancedMarkerElement is unavailable; using standard Marker.");
    }
  };

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyBXGr1UrPFmcav6kib0V7jP8KTN0gIi1eAf&libraries=places,marker`}
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
      <div id="map" style={{ width: "100%", height: "500px" }}></div>
    </>
  );
}