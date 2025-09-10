import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useLocation } from "@/context/LocationContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import Geolocation from "./Geolocation";

const LocationHeader: React.FC = () => {
  const primary = useThemeColor({}, "primary");
  const secondary = useThemeColor({}, "secondary");
  const text = useThemeColor({}, "text");
  const [modalVisible, setModalVisible] = useState(false);
  const { userLocation } = useLocation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.locationBox}
        onPress={() => setModalVisible(true)}
      >
        <MaterialIcons name="location-on" size={18} color={primary} />
        <Text style={[styles.locationText, { color: text }]} numberOfLines={1}>
          {userLocation?.address || "Fetching location..."}
        </Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={24}
          color={secondary}
        />
      </TouchableOpacity>

      <Geolocation
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        global={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  locationBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    marginHorizontal: 8,
    fontSize: 14,
    fontWeight: "600",
    flexShrink: 1,
    width: 200,
  },
});

export default LocationHeader;
