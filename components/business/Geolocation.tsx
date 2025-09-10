import { haversineDistance } from "@/constants/Utils";
import { useLocation } from "@/context/LocationContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const GOOGLE_API_KEY = "AIzaSyC2wgrkz7bXl48td2VZXQVdTrc0-QPu-XI";

interface GeolocationProps {
  visible: boolean;
  onClose: () => void;
  global: boolean | null;
}

const Geolocation: React.FC<GeolocationProps> = ({
  visible,
  onClose,
  global,
}) => {
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { userLocation, setSelectedLocation, setUserLocation } = useLocation();

  const primary = useThemeColor({}, "primary");
  const text = useThemeColor({}, "text");
  const background = useThemeColor({}, "background");
  const border = useThemeColor({}, "border");
  const secondary = useThemeColor({}, "secondary");

  useEffect(() => {
    if (query.length > 2) {
      const delayDebounce = setTimeout(() => {
        fetchPredictions(query);
      }, 200);
      return () => clearTimeout(delayDebounce);
    } else {
      setPredictions([]);
    }
  }, [query]);

  const fetchPredictions = async (input: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          input
        )}&key=${GOOGLE_API_KEY}`
      );
      const json = await response.json();

      if (json.status === "OK") {
        if (userLocation) {
          const enriched = await Promise.all(
            json.predictions.map(async (item: any) => {
              const details = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&key=${GOOGLE_API_KEY}`
              ).then((res) => res.json());

              const loc = details.result?.geometry?.location;

              if (loc) {
                const distance = haversineDistance(
                  userLocation.lat,
                  userLocation.lon,
                  loc.lat,
                  loc.lng
                );
                return {
                  ...item,
                  distance,
                  location: loc,
                  address:
                    details.result?.formatted_address || item.description,
                };
              }
              return item;
            })
          );

          enriched.sort(
            (a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity)
          );
          setPredictions(enriched);
        } else {
          setPredictions(json.predictions);
        }
      } else {
        setPredictions([]);
      }
    } catch (error) {
      console.error("Error fetching predictions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (userLocation) {
      setSelectedLocation(userLocation);
    }
    handleClose();
  };

  const handleSelectPrediction = (item: any) => {
    if (global) {
      setUserLocation({
        lat: item.location.lat,
        lon: item.location.lon,
        address: item.address || item.description,
      });
    } else {
      setSelectedLocation({
        lat: item.location.lat,
        lon: item.location.lon,
        address: item.address || item.description,
      });
    }

    handleClose();
  };

  const handleClose = () => {
    setQuery("");
    setPredictions([]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.overlay, { backgroundColor: background }]}>
            <View style={styles.header}>
              <TouchableOpacity onPress={handleClose}>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={20}
                  color={text}
                />
              </TouchableOpacity>
              <Text style={[styles.headerText, { color: text }]}>
                Choose your location
              </Text>
            </View>

            <View style={[styles.searchContainer, { borderColor: border }]}>
              <MaterialIcons
                name="search"
                size={18}
                color={primary}
                style={styles.searchIcon}
              />

              <TextInput
                style={[styles.input, { color: text }]}
                value={query}
                onChangeText={setQuery}
                placeholder="Search for a place"
                placeholderTextColor={secondary}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.currentLocationButton,
                { borderColor: border, backgroundColor: background },
              ]}
              onPress={handleUseCurrentLocation}
            >
              <MaterialIcons
                name="my-location"
                size={18}
                color={primary}
                style={{ marginRight: 8 }}
              />

              <Text style={[styles.currentLocationText, { color: primary }]}>
                Use current location
              </Text>
            </TouchableOpacity>

            {loading ? (
              <ActivityIndicator style={{ marginTop: 20 }} color={primary} />
            ) : (
              <FlatList
                data={predictions}
                keyExtractor={(item) => item.place_id}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.predictionItem}
                    onPress={() => handleSelectPrediction(item)}
                  >
                    <View style={styles.predictionRow}>
                      <View style={styles.iconContainer}>
                        <MaterialIcons
                          name="location-on"
                          size={16}
                          color={border}
                        />
                        {item.distance && (
                          <Text
                            style={[styles.distanceText, { color: secondary }]}
                          >
                            {Math.round(item.distance)} km
                          </Text>
                        )}
                      </View>

                      <View style={styles.textContainer}>
                        <Text style={[styles.primaryText, { color: text }]}>
                          {item.structured_formatting?.main_text ||
                            item.description}
                        </Text>
                        <Text
                          style={[styles.secondaryText, { color: secondary }]}
                        >
                          {item.structured_formatting?.secondary_text || ""}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  currentLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  currentLocationText: {
    fontSize: 16,
  },
  predictionItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  predictionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 3,
    width: 32,
  },

  textContainer: {
    flex: 1,
    justifyContent: "center",
  },

  primaryText: {
    fontSize: 16,
    fontWeight: "600",
  },

  secondaryText: {
    fontSize: 13,
    marginTop: 2,
  },

  distanceText: {
    fontSize: 11,
    marginTop: 4,
    textAlign: "center",
  },
});

export default Geolocation;
