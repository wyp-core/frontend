import React from "react";

import AddJobForm from "@/components/business/AddJobForm/AddJobForm";
import GradientScreen from "@/components/ui/GradientScreen";
import { StyleSheet } from "react-native";

export default function Create() {
  return (
    <GradientScreen style={styles.container}>
      <AddJobForm />
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
