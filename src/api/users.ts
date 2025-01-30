// import { AxiosError } from "axios";
import { LoginResponse } from "./auth";
import apiClient from "./client";
// import { toast } from "react-toastify";
import { simpleGet } from "./baseClients";

type ResponseWithPagination<T> = T & {
  total: number;
  perPage: number;
  currentPage: number;
};

async function getMany() {
  try {
    const response = await apiClient.get<
      ResponseWithPagination<{ users: LoginResponse[] }>
    >("/users");
    return response.data;
  } catch (error) {
    console.error("Users request failed", error);
    throw error;
  }
}

export const users = {
  getMany,
  getCount: () => simpleGet<{ count: number }>("/users/count"),
};
