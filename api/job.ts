import { CreateJobPayload, FetchJobsParams } from '@/types/job';
import axios from 'axios';

const baseURL =
  process.env.API_BASE_URL || 'https://wyp-backend.onrender.com/v1';

export const addJob = async (data: CreateJobPayload) => {
  if (!baseURL) {
    throw new Error(
      'API_BASE_URL is not defined in the environment variables.'
    );
  }
  console.log(
    `Base URL: ${baseURL}/job/addJob`,
    data,
    process.env.API_BASE_URL
  );
  const response = await axios.post(`${baseURL}/job`, data);

  return response.data;
};

export const getJobs = async (data: FetchJobsParams) => {
  if (!baseURL) {
    throw new Error(
      'API_BASE_URL is not defined in the environment variables.'
    );
  }

  console.log(`Base URL: ${baseURL}/job/all`, data, process.env.API_BASE_URL);
  const response = await axios.post(`${baseURL}/job/all`, data);
  console.log(response.data);

  return response.data.data;
};
