import {
  ResponseWithPagination,
  simpleDelete,
  simpleGet,
  simplePatch,
  simplePost,
} from "./baseClients";
import { ClassResponse } from "./classes";

export interface ICreateSubject {
  name: string;
  classId: number;
  description?: string;
}

export type SubjectResponse = ICreateSubject & {
  id: number;
  class: ClassResponse;
  createdAt: string;
  updatedAt: string;
};

export const subject = {
  getCount: () => simpleGet<{ count: number }>("/subject/count"),
  get: (id: number) => simpleGet<{ data: SubjectResponse }>(`/subject/${id}`),
  getMany: (query?: Partial<ICreateSubject>) =>
    simpleGet<
      {
        data: ResponseWithPagination<{ subjects: SubjectResponse[] }>;
      },
      Partial<ICreateSubject>
    >("/subject", query),
  create: (data: Omit<ICreateSubject, "id">) =>
    simplePost<Omit<ICreateSubject, "id">, { message: string }>(
      "/subject",
      data
    ),
  update: (id: number, data: Partial<ICreateSubject>) =>
    simplePatch<Partial<ICreateSubject>, { message: string }>(
      `/subject/${id}`,
      data
    ),
  delete: (id: number) => simpleDelete<{ message: string }>(`/subject`, id),
};
