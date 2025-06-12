import { useLocation } from '@/context/LocationContext';
import { useFetchJobs } from '@/hooks/jobs/useFetchJobs';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useCallback, useEffect, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import JobCardSkeleton from '../ui/JobCardSkeleton';
import JobCard from './JobCard';

const JobList = ({ filters }: { filters: any }) => {
  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');
  const secondary = useThemeColor({}, 'secondary');

  const [offset, setOffset] = useState(0);
  const [jobList, setJobList] = useState<any[]>([]);

  const fetchJobs = useFetchJobs();
  const { userLocation } = useLocation();

  const handleFetchJobs = useCallback(() => {
    console.log(userLocation);
    if (!userLocation) return;
    const payload = {
      ...filters,
      limit: 10,
      offset,
      sortBy: 'radius_asc',
      radius: 100,
      lat: userLocation?.lat,
      lon: userLocation?.lng,
    };

    fetchJobs.mutate(payload, {
      onSuccess: (newJobs: any[]) => {
        setJobList((prev) => (offset === 0 ? newJobs : [...prev, ...newJobs]));
      },
      onError: () => {
        setJobList([]);
      },
    });
  }, [offset, filters, fetchJobs, userLocation]);

  useEffect(() => {
    handleFetchJobs();
  }, [offset, filters]);

  const handleRefresh = useCallback(() => {
    if (offset > 0) {
      setOffset(0);
    } else {
      handleFetchJobs();
    }
  }, [offset, handleFetchJobs]);

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
      <View style={styles.skeletonContainer}>
        {[...Array(5)].map((_, index) => (
          <JobCardSkeleton key={index} />
        ))}
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
          refreshing={fetchJobs.isPending}
          onRefresh={handleRefresh}
          colors={[primary]}
        />
      }
    >
      {jobList.map((job: any) => (
        <JobCard key={job.jobID} {...job} />
      ))}
    </ScrollView>
  );
};

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
  skeletonContainer: {
    flex: 1,
    padding: 16,
  },
  skeletonCard: {
    height: 100,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
  },
  skeletonBase: {
    flex: 1,
    position: 'relative',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f0f0f0',
    opacity: 0.5,
    width: '100%',
  },
});

export default JobList;
