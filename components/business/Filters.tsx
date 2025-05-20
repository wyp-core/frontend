import { FontAwesome6 } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface FiltersProps {
  visible: boolean;
  onClose: () => void;
}

type ModeType = "remote" | "onsite" | "both";
type SortType = "nearest" | "price" | "location";
type RadiusType = "5km" | "10km" | "all";

export default function Filters({ visible, onClose }: FiltersProps) {
  const [minPrice, setMinPrice] = useState(100);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [mode, setMode] = useState<ModeType>("both");
  const [radius, setRadius] = useState<RadiusType>("all");
  const [sort, setSort] = useState<SortType>("nearest");

  const onMinPriceChange = (value: number) => {
    setMinPrice(value > maxPrice ? maxPrice : value);
  };

  const onMaxPriceChange = (value: number) => {
    setMaxPrice(value < minPrice ? minPrice : value);
  };

  const formattedMaxPrice = maxPrice === 10000 ? "10000+" : maxPrice;

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Filters</Text>

              <Text style={styles.filterLabel}>
                Price Range:{" "}
                <Text style={{ fontWeight: "600", color: "#5CB338" }}>
                  ₹{minPrice} - ₹{formattedMaxPrice}
                </Text>
              </Text>
              <Text style={styles.sliderLabel}>Min Price</Text>
              <Slider
                minimumValue={100}
                maximumValue={10000}
                value={minPrice}
                step={100}
                minimumTrackTintColor="#5CB338"
                maximumTrackTintColor="#ccc"
                onValueChange={onMinPriceChange}
                thumbTintColor="#5CB338"
              />
              <Text style={styles.sliderLabel}>Max Price</Text>
              <Slider
                minimumValue={100}
                maximumValue={10000}
                value={maxPrice}
                step={100}
                minimumTrackTintColor="#5CB338"
                maximumTrackTintColor="#ccc"
                onValueChange={onMaxPriceChange}
                thumbTintColor="#5CB338"
              />

              <Text style={[styles.filterLabel, { marginTop: 20 }]}>Mode</Text>
              <View style={styles.optionsRow}>
                {["remote", "onsite", "both"].map((item) => (
                  <Pressable
                    key={item}
                    style={[
                      styles.optionButton,
                      mode === item && styles.optionSelected,
                    ]}
                    onPress={() => setMode(item as ModeType)}
                  >
                    <FontAwesome6
                      name={
                        item === "remote"
                          ? "wifi"
                          : item === "onsite"
                          ? "location-dot"
                          : "globe"
                      }
                      size={13}
                      color={mode === item ? "#5CB338" : "#555"}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        mode === item && styles.optionTextSelected,
                      ]}
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.filterLabel}>Search Radius</Text>
              <View style={styles.optionsRow}>
                {["5km", "10km", "all"].map((item) => (
                  <Pressable
                    key={item}
                    style={[
                      styles.optionButton,
                      radius === item && styles.optionSelected,
                    ]}
                    onPress={() => setRadius(item as RadiusType)}
                  >
                    <FontAwesome6
                      name="location-dot"
                      size={13}
                      color={radius === item ? "#5CB338" : "#000"}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        radius === item && styles.optionTextSelected,
                      ]}
                    >
                      {item === "all" ? "All" : item}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.filterLabel}>Sort By</Text>
              <View style={styles.optionsRow}>
                {["nearest", "price"].map((item) => (
                  <Pressable
                    key={item}
                    style={[
                      styles.optionButton,
                      sort === item && styles.optionSelected,
                    ]}
                    onPress={() => setSort(item as SortType)}
                  >
                    {item === "nearest" && (
                      <FontAwesome6
                        name="location-dot"
                        size={13}
                        color={sort === item ? "#5CB338" : "#000"}
                      />
                    )}
                    <Text
                      style={[
                        styles.optionText,
                        sort === item && styles.optionTextSelected,
                      ]}
                    >
                      {item === "price" && "₹ "}{" "}
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Pressable style={styles.modalClose} onPress={onClose}>
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Apply Filters
                </Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#000",
  },
  priceRangeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5CB338",
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 16,
    marginBottom: 8,
    color: "#000",
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: "400",
    marginTop: 4,
    marginBottom: 4,
    color: "#000",
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  optionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    gap: 6,
  },
  optionSelected: {
    borderColor: "#5CB338",
    backgroundColor: "#fff",
  },
  optionText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  optionTextSelected: {
    color: "#5CB338",
  },
  modalClose: {
    marginTop: 24,
    backgroundColor: "#5CB338",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
});
