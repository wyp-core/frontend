import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Filters from "./Filters";

export default function ControlPanel() {
  const [search, setSearch] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const examples = [
    "online math tutor",
    "weekend househelp",
    "dog walking gigs",
    "homework help jobs",
    "remote tax assistant",
    "freelance developer",
    "evening babysitter",
    "local gardening work",
    "fitness coach clients",
    "part-time writer",
    "moving help offers",
    "mobile car mechanic",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(animatedValue, {
        toValue: -20, // move current word up
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setPlaceholderIndex((prev) => (prev + 1) % examples.length);
        animatedValue.setValue(20); // move next word below
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.searchWrapper}>
          <View style={styles.searchBox}>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="#888"
              value={search}
              onChangeText={setSearch}
            />
            {search === "" && (
              <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderStatic}>Search for </Text>
                <View style={styles.animatedTextWrapper}>
                  <Animated.Text
                    style={[
                      styles.placeholderAnimated,
                      {
                        transform: [{ translateY: animatedValue }],
                      },
                    ]}
                  >
                    "{examples[placeholderIndex]}"
                  </Animated.Text>
                </View>
              </View>
            )}
            <MaterialIcons name="search" size={20} color="#5CB338" />
          </View>
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <MaterialIcons name="tune" size={20} color="#5CB338" />
        </TouchableOpacity>
      </View>

      <Filters
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchWrapper: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 2,
    overflow: "hidden",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    paddingVertical: 8,
    marginRight: 8,
  },
  placeholderContainer: {
    position: "absolute",
    left: 5,
    top: 8,
    flexDirection: "row",
  },
  placeholderStatic: {
    fontSize: 14,
    color: "#888",
  },
  animatedTextWrapper: {
    height: 20,
    overflow: "hidden",
  },
  placeholderAnimated: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
  filterButton: {
    marginLeft: 8,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#eee",
  },
});
