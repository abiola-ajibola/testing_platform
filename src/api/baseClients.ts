import { AxiosError } from "axios";
import apiClient from "./client";
import { toast } from "react-toastify";

export async function simpleGet<T>(url: string) {
  try {
    const response = await apiClient.get<T>(url);
    return response.data;
  } catch (error) {
    const er = error as AxiosError<{ count: number }>;
    console.error(er);
    toast.error(er.message);
    throw error;
  }
}

