import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import ControlPanel from "@/components/business/ControlPanel";
import JobList from "@/components/business/JobList";
import LocationHeader from "@/components/business/LocationHeader";
import { LocationProvider } from "@/context/LocationContext";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";

export default function HomeScreen() {
  useEffect(() => {
    NavigationBar.setStyle("dark");
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <LinearGradient
        colors={["#d4f7dc", "#ffffff"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <LocationProvider>
          <LocationHeader />
        </LocationProvider>
        <ControlPanel />
      </LinearGradient>

      <JobList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fefefe",
  },
  gradient: {
    paddingTop: 25,
  },
});
