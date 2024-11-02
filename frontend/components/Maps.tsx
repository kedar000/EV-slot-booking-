import { useEffect, useRef } from "react";

interface MapProps {
  lat: number;
  lng: number;
}

const Map: React.FC<MapProps> = ({ lat, lng }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current && typeof window !== "undefined") {
      // Initialize the map
      const map = new google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 12,
      });

      // Add a marker for the user's location
      new google.maps.Marker({
        position: { lat, lng },
        map,
        title: "Your Location",
      });
    }
  }, [lat, lng]);

  return <div ref={mapRef} style={{ width: "100%", height: "500px" }} />;
};

export default Map;