import { useThemeColor } from '@/hooks/useThemeColor';
import { ScrollView, StyleSheet } from 'react-native';
import JobCard from './JobCard';

const jobs = [
  {
    title: 'To clean my room?',
    description:
      'Looking for someone to clean and organize a medium-sized bedroom. Tasks include dusting, vacuuming, changing bed linens, and tidying up clutter. Attention to detail and respect for personal space is important. Estimated time: 1.5 hours.',
    location: 'HSR, Bangalore',
    price: '100',
    duration: '1.5 hours',
    mode: 'Onsite',
    views: 42,
    createdAt: 1742232435,
  },
  {
    title: 'To help me with kitchen?',
    description:
      'Seeking assistance with kitchen tasks such as chopping vegetables, washing dishes, organizing the pantry, and general cleanup. Prefer someone with basic cooking knowledge. Should take around 2 hours.',
    location: 'Whitefield, Bangalore',
    price: '500',
    duration: '2 hours',
    mode: 'Both',
    views: 87,
    createdAt: 1747522635,
  },
  {
    title: 'To do my job?',
    description:
      'Need temporary help completing a professional assignment involving basic data entry, organizing documents, and formatting spreadsheets. Remote work is possible. Estimated effort: 3–4 hours.',
    location: 'Kadma, Jamshedpur',
    price: '300',
    duration: '3-4 hours',
    mode: 'Remote',
    views: 112,
    createdAt: 1715736000,
  },
];

export default function JobList() {
  const text = useThemeColor({}, 'text');
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {jobs.map((job, index) => (
        <JobCard key={index} {...job} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    margin: 16,
  },
});
