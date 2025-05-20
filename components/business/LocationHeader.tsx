import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useLocation } from "@/context/LocationContext";
import Geolocation from "./Geolocation";

const LocationHeader: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { address } = useLocation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.locationBox}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome6 name="location-dot" size={15} color="#5CB338" />
        <Text style={styles.locationText} numberOfLines={1}>
          {address}
        </Text>
        <FontAwesome5 name="chevron-down" size={15} color="#888" />
      </TouchableOpacity>

      <Geolocation
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 16,
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
