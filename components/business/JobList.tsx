import { useFetchJobs } from "@/hooks/jobApi";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import JobCard from "./JobCard";

export default function JobList() {
  const text = useThemeColor({}, "text");

  const { data: jobs, mutate: fetchJobs, isPending } = useFetchJobs();
  console.log(jobs);

  const handleFetchJobs = () => {
    const payload = {
      // userId: "user123",
      minPrice: 50.0,
      maxPrice: 1500.0,
      mode: "online",
      radius: 25.5,
      sortBy: "price",
      limit: 20,
      offset: 0,
    };

    fetchJobs(payload, {
      onSuccess: () => {},
      onError: () => {},
    });
  };

  useEffect(() => {
    handleFetchJobs();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {jobs.map((job: any) => (
        <JobCard {...job} />
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
    fontWeight: "600",
    margin: 16,
  },
});
