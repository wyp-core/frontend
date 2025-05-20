import * as Location from "expo-location";
import React, { createContext, useContext, useEffect, useState } from "react";

type Coords = { lat: number; long: number };

type LocationContextType = {
  coords: Coords | null;
  address: string;
  updateLocation: () => Promise<void>;
  setSelectedPlace: (place: {
    description: string;
    location: { lat: number; lng: number };
  }) => void;
};

const LocationContext = createContext<LocationContextType>({
  coords: null,
  address: "Fetching location...",
  updateLocation: async () => {},
  setSelectedPlace: () => {},
});

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [address, setAddress] = useState("Fetching location...");

  const fetchAddress = async (lat: number, lon: number) => {
    try {
      const apiKey = "AIzaSyC2wgrkz7bXl48td2VZXQVdTrc0-QPu-XI";
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`
      );
      const data = await res.json();
      if (data.status === "OK" && data.results.length > 0) {
        setAddress(data.results[0].formatted_address);
      } else {
        setAddress("Unknown location");
      }
    } catch {
      setAddress("Unable to fetch address");
    }
  };

  const updateLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setAddress("Permission denied");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const newCoords = {
        lat: loc.coords.latitude,
        long: loc.coords.longitude,
      };
      setCoords(newCoords);
      await fetchAddress(newCoords.lat, newCoords.long);
    } catch {
      setAddress("Location unavailable");
    }
  };

  const setSelectedPlace = (place: {
    description: string;
    location: { lat: number; lng: number };
  }) => {
    const newCoords = {
      lat: place.location.lat,
      long: place.location.lng,
    };
    setCoords(newCoords);
    setAddress(place.description);
  };

  useEffect(() => {
    updateLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{ coords, address, updateLocation, setSelectedPlace }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
