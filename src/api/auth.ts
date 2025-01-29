import apiClient from "@/api/client";
import { toast } from "react-toastify";

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  id: number;
  username: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  role: string;
  createdAt: string;
  lastModified: string;
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      request
    );
    return response.data;
  } catch (error) {
    console.error("Login request failed", error);
    toast.error("Login request failed. Please try again.");
    throw error;
  }
}
