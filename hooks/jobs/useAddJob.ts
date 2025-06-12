import { addJob } from '@/api/job';
import { CreateJobPayload } from '@/types/job';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddJob = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateJobPayload) => addJob(data),
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
