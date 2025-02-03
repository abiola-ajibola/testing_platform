// import { AxiosError } from "axios";
import { IUser, LoginResponse } from "./auth";
import apiClient from "./client";
// import { toast } from "react-toastify";
import {
  ResponseWithPagination,
  simpleDelete,
  simpleGet,
  simplePatch,
  simplePost,
} from "./baseClients";

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
  get: (id: number) => simpleGet<LoginResponse>(`/users/${id}`),
  create: (data: Omit<IUser, "id">) =>
    simplePost<Omit<IUser, "id">, { message: string }>("/users", data),
  update: (
    id: number,
    data: Partial<Omit<IUser & { _classes: number[] }, "id">>
  ) =>
    simplePatch<Partial<Omit<IUser, "id">>, { message: string }>(
      `/users/${id}`,
      data
    ),
  delete: (id: number) => simpleDelete<{ message: string }>(`/users`, id),
};
