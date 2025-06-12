import * as Location from 'expo-location';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type LocationType = {
  lat: number;
  lng: number;
  address: string;
};

type LocationContextType = {
  userLocation: LocationType | null;
  selectedLocation: LocationType | null;
  setSelectedLocation: (loc: LocationType) => void;
  loading: boolean;
};

const LocationContext = createContext<LocationContextType>({
  userLocation: null,
  selectedLocation: null,
  setSelectedLocation: () => {},
  loading: true,
});

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userLocation, setUserLocation] = useState<LocationType | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setUserLocation(null);
          setSelectedLocation(null);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const lat = loc.coords.latitude;
        const lng = loc.coords.longitude;

        let address = 'Fetching address...';
        try {
          const apiKey = 'AIzaSyC2wgrkz7bXl48td2VZXQVdTrc0-QPu-XI'; // Replace with secure env usage
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
          );
          const data = await response.json();

          if (data.status === 'OK' && data.results.length > 0) {
            address = data.results[0].formatted_address;
          } else {
            address = 'Unknown location';
          }
        } catch (err) {
          address = 'Unable to fetch address';
        }

        const locationObj = { lat, lng, address };
        setUserLocation(locationObj);
        setSelectedLocation(locationObj);
      } catch (error) {
        setUserLocation(null);
        setSelectedLocation(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        userLocation,
        selectedLocation,
        setSelectedLocation,
        loading,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
