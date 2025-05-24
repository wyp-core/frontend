import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
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

  const primary = useThemeColor({}, "primary");
  const secondary = useThemeColor({}, "secondary");
  const text = useThemeColor({}, "text");
  const background = useThemeColor({}, "background");
  const border = useThemeColor({}, "border");

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.overlay]}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: background, shadowColor: border },
              ]}
            >
              <Text style={[styles.modalTitle, { color: text }]}>Filters</Text>

              <Text style={[styles.filterLabel, { color: text }]}>
                Price Range:{" "}
                <Text style={{ fontWeight: "600", color: primary }}>
                  ₹{minPrice} - ₹{formattedMaxPrice}
                </Text>
              </Text>
              <Text style={[styles.sliderLabel, { color: text }]}>
                Min Price
              </Text>
              <Slider
                minimumValue={100}
                maximumValue={10000}
                value={minPrice}
                step={100}
                minimumTrackTintColor={primary}
                maximumTrackTintColor={text}
                onValueChange={onMinPriceChange}
                thumbTintColor={primary}
              />
              <Text style={[styles.sliderLabel, { color: text }]}>
                Max Price
              </Text>
              <Slider
                minimumValue={100}
                maximumValue={10000}
                value={maxPrice}
                step={100}
                minimumTrackTintColor={primary}
                maximumTrackTintColor={text}
                onValueChange={onMaxPriceChange}
                thumbTintColor={primary}
              />

              <Text
                style={[styles.filterLabel, { marginTop: 20, color: text }]}
              >
                Mode
              </Text>
              <View style={styles.optionsRow}>
                {["remote", "onsite", "both"].map((item) => (
                  <Pressable
                    key={item}
                    style={[
                      styles.optionButton,
                      { borderColor: border, backgroundColor: background },
                      mode === item && {
                        borderColor: primary,
                        borderWidth: 1,
                        backgroundColor: background,
                      },
                    ]}
                    onPress={() => setMode(item as ModeType)}
                  >
                    {item === "onsite" ? (
                      <MaterialCommunityIcons
                        name="map-marker-outline"
                        size={16}
                        color={mode === item ? primary : text}
                      />
                    ) : (
                      <MaterialIcons
                        name={
                          item === "remote"
                            ? "wifi"
                            : item === "onsite"
                            ? "location-on"
                            : "public"
                        }
                        size={16}
                        color={mode === item ? primary : text}
                      />
                    )}
                    <Text
                      style={[
                        styles.optionText,
                        { color: text },
                        mode === item && {
                          ...styles.optionTextSelected,
                          color: primary,
                        },
                      ]}
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={[styles.filterLabel, { color: text }]}>
                Search Radius
              </Text>
              <View style={styles.optionsRow}>
                {["5km", "10km", "all"].map((item) => (
                  <Pressable
                    key={item}
                    style={[
                      styles.optionButton,
                      { borderColor: border, backgroundColor: background },
                      radius === item && {
                        borderColor: primary,
                        borderWidth: 1,
                        backgroundColor: background,
                      },
                    ]}
                    onPress={() => setRadius(item as RadiusType)}
                  >
                    <MaterialCommunityIcons
                      name="map-marker-outline"
                      size={15}
                      color={radius === item ? primary : text}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        { color: text },
                        radius === item && {
                          ...styles.optionTextSelected,
                          color: primary,
                        },
                      ]}
                    >
                      {item === "all" ? "All" : item}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={[styles.filterLabel, { color: text }]}>Sort By</Text>
              <View style={styles.optionsRow}>
                {["nearest", "price"].map((item) => (
                  <Pressable
                    key={item}
                    style={[
                      styles.optionButton,
                      { borderColor: border, backgroundColor: background },
                      sort === item && {
                        borderColor: primary,
                        borderWidth: 1,
                        backgroundColor: background,
                      },
                    ]}
                    onPress={() => setSort(item as SortType)}
                  >
                    {item === "nearest" && (
                      <MaterialCommunityIcons
                        name="map-marker-outline"
                        size={15}
                        color={sort === item ? primary : text}
                      />
                    )}
                    <Text
                      style={[
                        styles.optionText,
                        { color: text },
                        sort === item && {
                          color: primary,
                        },
                      ]}
                    >
                      {item === "price" && "₹ "}
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Pressable
                style={[styles.modalClose, { backgroundColor: primary }]}
                onPress={onClose}
              >
                <Text style={{ color: background, fontWeight: "bold" }}>
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
    justifyContent: "flex-end",
  },
  modalContent: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 12,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  priceRangeText: {
    fontSize: 16,
    fontWeight: "600",
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 16,
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: "400",
    marginTop: 8,
    marginBottom: 4,
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
    borderRadius: 8,
    gap: 6,
  },

  optionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  modalClose: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
});
