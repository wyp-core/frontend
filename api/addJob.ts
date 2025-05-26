import axios from 'axios';

export interface JobInput {
  createdBy: string;
  title: string;
  description: string;
  lat: number;
  lon: number;
  price: number;
  category: string;
  mode: 'online' | 'offline';
  duration: string;
}

const baseURL =
  process.env.API_BASE_URL || 'https://wyp-backend.onrender.com/v1'; // Fallback for development

export const addJob = async (data: JobInput) => {
  if (!baseURL) {
    throw new Error(
      'API_BASE_URL is not defined in the environment variables.'
    );
  }
  console.log(`Base URL: ${baseURL}/job/addJob`, data);
  const response = await axios.post(`${baseURL}/job/addJob`, data);

  return response.data;
};
