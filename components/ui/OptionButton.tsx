import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type Props<T> = {
  item: T;
  selected: boolean;
  onPress: (item: T) => void;
  iconName: keyof typeof MaterialIcons.glyphMap;
  displayFunction?: (item: T) => string;
};

export default function OptionButton<T>({
  item,
  selected,
  onPress,
  iconName,
  displayFunction,
}: Props<T>) {
  const primary = useThemeColor({}, "primary");
  const text = useThemeColor({}, "text");
  const border = useThemeColor({}, "border");
  const theme = useThemeColor({}, "theme") as "light" | "dark";

  return (
    <Pressable
      style={[
        styles.optionButton,
        { borderColor: selected ? primary : border },
      ]}
      onPress={() => onPress(item)}
    >
      {selected && (
        <MaterialIcons
          name="check-circle"
          size={13}
          color={primary}
          style={[
            styles.checkIcon,
            {
              backgroundColor: theme === "dark" ? "black" : "white",
            },
          ]}
        />
      )}
      <MaterialIcons
        name={iconName}
        size={15}
        color={selected ? primary : text}
        style={styles.icon}
      />
      <Text style={[styles.optionText, { color: selected ? primary : text }]}>
        {displayFunction ? displayFunction(item) : String(item)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  optionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: "center",
    position: "relative",
  },
  optionText: {
    fontSize: 14,
    fontFamily: "Montserrat_500Medium",
    textAlign: "center",
  },
  icon: {
    alignSelf: "center",
    marginRight: 8,
  },
  checkIcon: {
    position: "absolute",
    right: -5,
    top: -5,
    borderRadius: 50,
  },
});
