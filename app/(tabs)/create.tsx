import React from "react";
import { StyleSheet } from "react-native";

import AddJobForm from "@/components/business/AddJobForm";
import GradientScreen from "@/components/ui/GradientScreen";

export default function Create() {
  return (
    <GradientScreen>
      <AddJobForm />
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
