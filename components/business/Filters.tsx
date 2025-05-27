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
type SortType = "nearest" | "price";
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
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay]}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: background, shadowColor: border },
          ]}
        >
          <Text style={[styles.modalTitle, { color: text }]}>Filters</Text>

          {/* Price Range */}
          <View style={[styles.cardSection, { backgroundColor: background }]}>
            <Text style={[styles.sectionTitle, { color: text }]}>
              Price Range:{" "}
              <Text style={{ color: primary }}>
                ₹{minPrice} - ₹{formattedMaxPrice}
              </Text>
            </Text>
            <Text style={[styles.sliderLabel, { color: text }]}>Min Price</Text>
            <Slider
              minimumValue={100}
              maximumValue={10000}
              value={minPrice}
              step={100}
              minimumTrackTintColor={primary}
              maximumTrackTintColor={border}
              onValueChange={onMinPriceChange}
              thumbTintColor={primary}
            />
            <Text style={[styles.sliderLabel, { color: text }]}>Max Price</Text>
            <Slider
              minimumValue={100}
              maximumValue={10000}
              value={maxPrice}
              step={100}
              minimumTrackTintColor={primary}
              maximumTrackTintColor={border}
              onValueChange={onMaxPriceChange}
              thumbTintColor={primary}
            />
          </View>

          {/* Mode */}
          <View style={[styles.cardSection, { backgroundColor: background }]}>
            <Text style={[styles.sectionTitle, { color: text }]}>Mode</Text>
            <View style={styles.pillRow}>
              {["remote", "onsite", "both"].map((item) => (
                <Pressable
                  key={item}
                  style={[
                    styles.pillButton,
                    {
                      borderColor: mode === item ? primary : border,
                      backgroundColor:
                        mode === item ? primary + "20" : background,
                    },
                  ]}
                  onPress={() => setMode(item as ModeType)}
                >
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
                  <Text
                    style={[
                      styles.pillText,
                      { color: mode === item ? primary : text },
                    ]}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Radius */}
          <View style={[styles.cardSection, { backgroundColor: background }]}>
            <Text style={[styles.sectionTitle, { color: text }]}>
              Search Radius
            </Text>
            <View style={styles.pillRow}>
              {["5km", "10km", "all"].map((item) => (
                <Pressable
                  key={item}
                  style={[
                    styles.pillButton,
                    {
                      borderColor: radius === item ? primary : border,
                      backgroundColor:
                        radius === item ? primary + "20" : background,
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
                      styles.pillText,
                      { color: radius === item ? primary : text },
                    ]}
                  >
                    {item === "all" ? "All" : item}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Sort By */}
          <View style={[styles.cardSection, { backgroundColor: background }]}>
            <Text style={[styles.sectionTitle, { color: text }]}>Sort By</Text>
            <View style={styles.pillRow}>
              {["nearest", "price"].map((item) => (
                <Pressable
                  key={item}
                  style={[
                    styles.pillButton,
                    {
                      borderColor: sort === item ? primary : border,
                      backgroundColor:
                        sort === item ? primary + "20" : background,
                    },
                  ]}
                  onPress={() => setSort(item as SortType)}
                >
                  <MaterialCommunityIcons
                    name={
                      item === "nearest" ? "map-marker-outline" : "currency-inr"
                    }
                    size={15}
                    color={sort === item ? primary : text}
                  />
                  <Text
                    style={[
                      styles.pillText,
                      { color: sort === item ? primary : text },
                    ]}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
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
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  cardSection: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  sliderLabel: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pillButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
    gap: 6,
  },
  pillText: {
    fontSize: 14,
    fontWeight: "500",
  },
  modalClose: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
});
