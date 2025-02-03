import {
  ResponseWithPagination,
  simpleDelete,
  simpleGet,
  simplePatch,
  simplePost,
} from "./baseClients";

export interface ICreateClass {
  name: string;
  description?: string;
}

export type ClassResponse = ICreateClass & {
  id: number;
  createdAt: string;
  updatedAt: string;
};

export const classes = {
  getCount: () => simpleGet<{ count: number }>("/class/count"),
  get: (id: number) => simpleGet<ClassResponse>(`/class/${id}`),
  getMany: (query?: Partial<ICreateClass>) =>
    simpleGet<
      // ResponseWithPagination<{ data: ClassResponse[] }>,
      {
        data: ResponseWithPagination<{ classes: ClassResponse[] }>;
      },
      Partial<ICreateClass>
    >("/class", query),
  create: (data: Omit<ICreateClass, "id">) =>
    simplePost<Omit<ICreateClass, "id">, { message: string }>("/class", data),
  update: (id: number, data: Partial<ICreateClass>) =>
    simplePatch<Partial<ICreateClass>, { message: string }>(
      `/class/${id}`,
      data
    ),
  delete: (id: number) => simpleDelete<{ message: string }>(`/class`, id),
};
