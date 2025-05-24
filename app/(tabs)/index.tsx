import React from "react";
import { StyleSheet } from "react-native";

import ControlPanel from "@/components/business/ControlPanel";
import JobList from "@/components/business/JobList";
import LocationHeader from "@/components/business/LocationHeader";
import GradientScreen from "@/components/ui/GradientScreen";
import { LocationProvider } from "@/context/LocationContext";

export default function HomeScreen() {
  return (
    <GradientScreen>
      <LocationProvider>
        <LocationHeader />
      </LocationProvider>

      <ControlPanel />
      <JobList />
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    paddingTop: 25,
  },
});
