import { useFetchJobs } from '@/hooks/jobApi';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import JobCard from './JobCard';

export default function JobList({ filters }: { filters: any }) {
  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');
  const secondary = useThemeColor({}, 'secondary');

  const [offset, setOffset] = useState(0);
  const [jobList, setJobList] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchJobs = useFetchJobs();

  const handleFetchJobs = useCallback(() => {
    const payload = {
      ...filters,
      limit: 10,
      offset,
    };

    fetchJobs.mutate(payload, {
      onSuccess: (newJobs: any[]) => {
        setJobList((prev) => (offset === 0 ? newJobs : [...prev, ...newJobs]));
        setIsRefreshing(false);
      },
      onError: () => {
        setJobList([]);
        setIsRefreshing(false);
      },
    });
  }, [offset, filters, fetchJobs]);

  useEffect(() => {
    handleFetchJobs();
  }, [offset, filters]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setOffset(0);
  }, []);

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isNearBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;

    if (isNearBottom && !fetchJobs.isPending) {
      setOffset((prev) => prev + 10);
    }
  };

  if (fetchJobs.isPending && jobList.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size='large' color={primary} />
      </View>
    );
  }

  if (fetchJobs.isError) {
    return (
      <View style={styles.errorContainer}>
        <Image
          source={require('@/assets/images/No connection-pana.svg')}
          style={styles.errorImage}
          resizeMode='contain'
        />
        <Text style={styles.errorTitle}>No Internet Connection</Text>
        <Text style={styles.errorSubtitle}>
          Please check your connection and try again.
        </Text>
      </View>
    );
  }

  if (jobList.length === 0 && !fetchJobs.isPending) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorTitle, { color: text }]}>No Jobs Found</Text>
        <Text style={[styles.errorSubtitle, { color: secondary }]}>
          Try adjusting your filters or check back later.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContainer}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={[primary]}
        />
      }
    >
      {jobList.map((job: any) => (
        <JobCard key={job.jobID} {...job} />
      ))}
      {fetchJobs.isPending && !isRefreshing && (
        <ActivityIndicator
          size='small'
          color={primary}
          style={styles.spinner}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  spinner: {
    marginVertical: 16,
  },
});
