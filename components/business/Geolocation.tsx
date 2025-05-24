import { haversineDistance } from "@/constants/Utils";
import { useLocation } from "@/context/LocationContext";
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
}

const Geolocation: React.FC<GeolocationProps> = ({ visible, onClose }) => {
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { coords, updateLocation, setSelectedPlace } = useLocation();

  useEffect(() => {
    if (query.length > 2) {
      const delayDebounce = setTimeout(() => {
        fetchPredictions(query);
      }, 500);
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
        if (coords) {
          const enriched = await Promise.all(
            json.predictions.map(async (item: any) => {
              const details = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&key=${GOOGLE_API_KEY}`
              ).then((res) => res.json());

              const loc = details.result?.geometry?.location;
              if (loc) {
                const distance = haversineDistance(
                  coords.lat,
                  coords.long,
                  loc.lat,
                  loc.lng
                );
                return { ...item, distance, location: loc };
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
    updateLocation();
    handleClose();
  };

  const handleSelectPrediction = (item: any) => {
    setSelectedPlace({
      description: item.description,
      location: item.location,
    });
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
          <View style={styles.overlay}>
            <View style={styles.header}>
              <TouchableOpacity onPress={handleClose}>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={18}
                  color="#000"
                />
              </TouchableOpacity>
              <Text style={styles.headerText}>Choose your location</Text>
            </View>

            <View style={styles.searchContainer}>
              <MaterialIcons
                name="search"
                size={18}
                color="#5CB338"
                style={styles.searchIcon}
              />

              <TextInput
                style={styles.input}
                value={query}
                onChangeText={setQuery}
                placeholder="Search for a place"
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity
              style={styles.currentLocationButton}
              onPress={handleUseCurrentLocation}
            >
              <MaterialIcons
                name="my-location"
                size={18}
                color="#5CB338"
                style={{ marginRight: 8 }}
              />

              <Text style={styles.currentLocationText}>
                Use current location
              </Text>
            </TouchableOpacity>

            {loading ? (
              <ActivityIndicator style={{ marginTop: 20 }} />
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
                          color="#ccc"
                        />
                        {item.distance && (
                          <Text style={styles.distanceText}>
                            {Math.round(item.distance)} km
                          </Text>
                        )}
                      </View>

                      <View style={styles.textContainer}>
                        <Text style={styles.primaryText}>
                          {item.structured_formatting?.main_text ||
                            item.description}
                        </Text>
                        <Text style={styles.secondaryText}>
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
    backgroundColor: "#fff",
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
    borderColor: "#ccc",
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
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
  },
  currentLocationText: {
    fontSize: 16,
    color: "#5CB338",
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
    color: "#333",
  },

  secondaryText: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },

  distanceText: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
    textAlign: "center",
  },
});

export default Geolocation;
