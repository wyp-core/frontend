import React, { useState } from "react";
import { StyleSheet } from "react-native";

import ControlPanel from "@/components/business/ControlPanel";
import JobList from "@/components/business/JobList";
import LocationHeader from "@/components/business/LocationHeader";
import GradientScreen from "@/components/ui/GradientScreen";
import { ModeType, SortType } from "@/types/job";

export default function HomeScreen() {
  const [globalFilters, setGlobalFilters] = useState({
    minPrice: 100,
    maxPrice: 10000,
    radius: 10,
    mode: "hybrid" as ModeType,
    sort: "nearest" as SortType,
  });

  return (
    <GradientScreen style={styles.container}>
      <LocationHeader />
      <ControlPanel
        initialFilters={globalFilters}
        onApply={(updatedFilters) => setGlobalFilters(updatedFilters)}
      />
      <JobList filters={globalFilters} />
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
