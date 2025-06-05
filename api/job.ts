import axios from "axios";

export type SortBy =
  | "price_asc"
  | "price_desc"
  | "createdAt_desc"
  | "created_at"
  | "createdAt_asc"
  | "created_at_asc";

export interface FetchJobsPayload {
  userId: string;
  minPrice?: number;
  maxPrice?: number;
  mode: "remote" | "onsite" | "both";
  radius?: number;
  sortBy?: SortBy;
  limit?: number;
  offset?: number;
}

export interface JobInput {
  createdBy: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
  price: number;
  category: string;
  mode: "remote" | "onsite" | "both";
  duration: string;
}

const baseURL =
  process.env.API_BASE_URL || "https://wyp-backend.onrender.com/v1";

export const addJob = async (data: JobInput) => {
  if (!baseURL) {
    throw new Error(
      "API_BASE_URL is not defined in the environment variables."
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

export const getJobs = async (data: FetchJobsPayload) => {
  if (!baseURL) {
    throw new Error(
      "API_BASE_URL is not defined in the environment variables."
    );
  }

  console.log(`Base URL: ${baseURL}/job/all`, data, process.env.API_BASE_URL);
  const response = await axios.post(`${baseURL}/job/all`, data);
  console.log(response.data);

  return response.data.data;
};
