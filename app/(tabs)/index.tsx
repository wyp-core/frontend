import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import ControlPanel from '@/components/business/ControlPanel';
import { ModeType, SortType } from '@/components/business/Filters';
import JobList from '@/components/business/JobList';
import LocationHeader from '@/components/business/LocationHeader';

export default function HomeScreen() {
  const [globalFilters, setGlobalFilters] = useState({
    minPrice: 100,
    maxPrice: 10000,
    radius: 10,
    mode: 'both' as ModeType,
    sort: 'nearest' as SortType,
  });

  return (
    <View>
      <LocationHeader />
      <ControlPanel
        initialFilters={globalFilters}
        onApply={(updatedFilters) => setGlobalFilters(updatedFilters)}
      />
      <JobList filters={globalFilters} />
    </View>
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
