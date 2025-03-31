import apiClient from "@/api/client";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { ClassResponse } from "./classes";

interface LoginRequest {
  username: string;
  password: string;
}

export interface IUser {
  id: number;
  username: string;
  first_name: string;
  middle_name: string;
  password?: string;
  last_name: string;
  classes?: ClassResponse[] | number[];
  role: "ADMIN" | "STUDENT";
}

export interface LoginResponse extends Omit<IUser, "password"> {
  createdAt: string;
  lastModified: string;
}

export async function login(
  request: LoginRequest
): Promise<LoginResponse | void> {
  try {
    const response = await apiClient.post<{ data: LoginResponse }>(
      "/auth/login",
      request
    );
    return response.data.data;
  } catch (error) {
    const er = error as AxiosError;
    console.error("Login request failed", er?.response?.data);
    toast.error(
      er.status === 401
        ? "Username or password incorrect"
        : "Login request failed. Please try again."
    );
    // throw error;
  }
}

export async function me() {
  try {
    const response = await apiClient.get<{ data: LoginResponse }>("/auth/me");
    return response.data.data;
  } catch (error) {
    console.error("Me request failed", error);
    // toast.error("Please login");
    // throw error;
  }
}

export async function logout() {
  try {
    const response = await apiClient.get("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Logout request failed", error);
    // throw error;
  }
}
