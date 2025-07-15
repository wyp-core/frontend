import { useThemeColor } from "@/hooks/useThemeColor";
import {
  filterSortOptions,
  modeOptions,
  ModeType,
  SortType,
} from "@/types/job";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import OptionButton from "../ui/OptionButton";

interface FiltersProps {
  visible: boolean;
  onClose: () => void;
}

const Filters = ({
  visible,
  onClose,
  onApply,
  initialFilters,
}: FiltersProps & {
  initialFilters: any;
  onApply: (filters: any) => void;
}) => {
  const [localFilters, setLocalFilters] = useState(initialFilters);

  useEffect(() => {
    if (!visible) {
      setLocalFilters(initialFilters);
    }
  }, [visible, initialFilters]);

  const primary = useThemeColor({}, "primary");
  const text = useThemeColor({}, "text");
  const background = useThemeColor({}, "background");
  const border = useThemeColor({}, "border");

  const updateFilter = (key: any, value: any) => {
    if (["mode", "sort"].includes(key) && localFilters[key] === value) {
      value = null;
    }
    setLocalFilters((prev: any) => ({ ...prev, [key]: value }));
  };

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

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: text }]}>
              Price Range:{" "}
              <Text style={{ color: primary }}>
                ₹{localFilters.minPrice} - ₹
                {localFilters.maxPrice === 10000
                  ? "10000+"
                  : localFilters.maxPrice}
              </Text>
            </Text>
            <MultiSlider
              values={[localFilters.minPrice, localFilters.maxPrice]}
              sliderLength={320}
              onValuesChange={(values) => {
                updateFilter("minPrice", values[0]);
                updateFilter("maxPrice", values[1]);
              }}
              min={100}
              max={10000}
              step={100}
              selectedStyle={{ backgroundColor: primary }}
              unselectedStyle={{ backgroundColor: border }}
              markerStyle={{
                backgroundColor: primary,
                height: 12,
                width: 12,
              }}
            />
          </View>

          <View>
            <Text style={[styles.sectionTitle, { color: text }]}>
              Search Radius:{" "}
              <Text style={{ color: primary }}>
                {localFilters.radius === 50
                  ? "50+ km"
                  : `${localFilters.radius} km`}
              </Text>
            </Text>
            <MultiSlider
              values={[localFilters.radius]}
              sliderLength={320}
              onValuesChange={(values) => updateFilter("radius", values[0])}
              min={5}
              max={51}
              step={1}
              selectedStyle={{ backgroundColor: primary }}
              unselectedStyle={{ backgroundColor: border }}
              markerStyle={{
                backgroundColor: primary,
                height: 12,
                width: 12,
              }}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.subSectionTitle, { color: text }]}>Mode</Text>
            <View style={styles.optionRow}>
              {modeOptions.map(({ key, icon }) => (
                <OptionButton
                  key={key}
                  item={key}
                  selected={localFilters.mode === key}
                  iconName={icon}
                  onPress={(val: ModeType) => updateFilter("mode", val)}
                  displayFunction={(val: string) =>
                    val.charAt(0).toUpperCase() + val.slice(1)
                  }
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.subSectionTitle, { color: text }]}>
              Sort By
            </Text>
            <View style={styles.optionRow}>
              {filterSortOptions.map((option) => (
                <OptionButton
                  key={option.key}
                  item={option.key}
                  selected={localFilters.sort === option.key}
                  iconName={option.icon}
                  onPress={(val) => updateFilter("sort", val as SortType)}
                  displayFunction={() => option.label}
                />
              ))}
            </View>
          </View>

          <Pressable
            style={[styles.modalClose, { backgroundColor: primary }]}
            onPress={() => {
              onApply(localFilters);
              onClose();
            }}
          >
            <Text
              style={{ color: "#fff", fontFamily: "Montserrat_600SemiBold" }}
            >
              Apply Filters
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Montserrat_700Bold",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Montserrat_600SemiBold",
    marginBottom: 8,
  },
  subSectionTitle: {
    fontSize: 13,
    fontFamily: "Montserrat_600SemiBold",
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  modalClose: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#000",
  },
  optionText: {
    fontSize: 13,
    fontFamily: "Montserrat_500Medium",
    textAlign: "center",
  },
});

export default Filters;
