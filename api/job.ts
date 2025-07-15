import { CreateJobPayload, FetchJobsParams } from "@/types/job";
import axios from "axios";

const baseURL = process.env.API_BASE_URL || "http://192.168.1.13:8000/v1";

export const addJob = async (data: CreateJobPayload) => {
  if (!baseURL) {
    throw new Error(
      "API_BASE_URL is not defined in the environment variables."
    );
  }
  const response = await axios.post(`${baseURL}/job`, data);

  return response.data;
};

export const getJobs = async (data: FetchJobsParams) => {
  if (!baseURL) {
    throw new Error(
      "API_BASE_URL is not defined in the environment variables."
    );
  }

  const response = await axios.post(`${baseURL}/job/all`, data);

  return response.data.data;
};
