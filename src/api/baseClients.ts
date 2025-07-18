import { AxiosError, AxiosProgressEvent } from "axios";
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
    toast.error(
      (er.response?.data as { message: string })?.message || er.message
    );
    // throw error;
  }
}

export async function simpleDelete<T>(url: string, id: number) {
  try {
    const response = await apiClient.delete<T>(url + "/" + id.toString());
    toast.success("Deleted successfully");
    return response.data;
  } catch (error) {
    const er = error as AxiosError<T>;
    console.error(er);
    toast.error(
      (er.response?.data as { message: string })?.message || er.message
    );
    // throw error;
  }
}

export async function simplePost<DataType, ResponseType>(
  url: string,
  data: DataType,
  config: { showSuccessToast?: boolean } = { showSuccessToast: true }
) {
  try {
    const response = await apiClient.post<ResponseType>(url, data);
    if (config.showSuccessToast) {
      toast.success("Created successfully");
    }
    return response.data;
  } catch (error) {
    const er = error as AxiosError<ResponseType>;
    console.error(er);
    toast.error(
      (er.response?.data as { message: string })?.message || er.message
    );
    // throw error;
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
    // throw error;
  }
}

export async function uploadFile<ResponseType>(
  url: string,
  file: File | Blob,
  body: { currentName: string } | null,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) {
  const formData = new FormData();
  formData.append("file", file);
  if (body) {
    formData.append("currentName", body.currentName);
  }
  try {
    const response = await apiClient.post<ResponseType>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
    // toast.success("Uploaded successfully");
    return response.data;
  } catch (error) {
    const er = error as AxiosError;
    console.error(er);
    toast.error(er.message);
    // throw error;
  }
}
