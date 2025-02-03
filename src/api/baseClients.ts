import { AxiosError } from "axios";
import apiClient from "./client";
import { toast } from "react-toastify";

export type ResponseWithPagination<T> = T & {
  total: number;
  perPage: number;
  currentPage: number;
};

export async function simpleGet<T, U = undefined>(url: string, query?: U) {
  try {
    const response = await apiClient.get<T>(url, { params: query });
    return response.data;
  } catch (error) {
    const er = error as AxiosError<T>;
    console.error(er);
    toast.error(er.message);
    throw error;
  }
}

export async function simplePost<DataType, ResponseType>(
  url: string,
  data: DataType
) {
  try {
    const response = await apiClient.post<ResponseType>(url, data);
    toast.success("Created successfully");
    return response.data;
  } catch (error) {
    const er = error as AxiosError<ResponseType>;
    console.error(er);
    toast.error(er.message);
    throw error;
  }
}

export async function simplePatch<DataType, ResponseType>(
  url: string,
  data: DataType
) {
  try {
    const response = await apiClient.patch<ResponseType>(url, data);
    toast.success("Updated successfully");
    return response.data;
  } catch (error) {
    const er = error as AxiosError<ResponseType>;
    console.error(er);
    toast.error(er.message);
    throw error;
  }
}
