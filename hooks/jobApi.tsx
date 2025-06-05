import { addJob, FetchJobsPayload, getJobs, JobInput } from '@/api/job';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddJob = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: JobInput) => addJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      console.log('Job added successfully');
    },
    onError: (error) => {
      console.error('Failed to add job:', error.message);
    },
  });

  return mutation;
};

export const useFetchJobs = () => {
  return useMutation({
    mutationFn: (data: FetchJobsPayload) => getJobs(data),
  });
};
