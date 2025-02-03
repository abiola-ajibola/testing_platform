import { ResponseWithPagination, simpleGet } from "./baseClients";

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
  getMany: (query?: Partial<ICreateClass>) =>
    simpleGet<
      ResponseWithPagination<{ data: ClassResponse[] }>,
      Partial<ICreateClass>
    >("/class", query),
};
