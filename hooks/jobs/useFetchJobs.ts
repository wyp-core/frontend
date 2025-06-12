import { getJobs } from '@/api/job';
import { FetchJobsParams } from '@/types/job';
import { useMutation } from '@tanstack/react-query';

export const useFetchJobs = () => {
  return useMutation({
    mutationFn: (data: FetchJobsParams) => getJobs(data),
  });
};
