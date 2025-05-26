import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addJob, JobInput } from '../api/addJob';

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

  return mutation; // `mutation.isLoading` can be accessed directly when using this hook
};
