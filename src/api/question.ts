import { AxiosProgressEvent } from "axios";
import {
  ResponseWithPagination,
  simpleDelete,
  simpleGet,
  simplePatch,
  simplePost,
  uploadFile,
} from "./baseClients";
import { SubjectResponse } from "./subject";

export interface ICreateQuestion {
  text: string;
  subjectId: number;
  explanation?: string;
  explanationImageUrl?: string;
  imageUrl?: string;
  options?: {
    id?: number;
    text: string;
    image_url?: string;
    correct: boolean;
  }[];
}

export type QuestionResponse = ICreateQuestion & {
  id: number;
  subject: SubjectResponse;
  createdAt: string;
  updatedAt: string;
};

export const question = {
  getCount: () => simpleGet<{ count: number }>("/question/count"),
  get: (id: number) =>
    simpleGet<{ data: QuestionResponse }>(`/question/${id}`),
  getMany: (query?: Partial<ICreateQuestion>) =>
    simpleGet<
      {
        data: ResponseWithPagination<{ questions: QuestionResponse[] }>;
      },
      Partial<ICreateQuestion>
    >("/question", query),
  create: (data: Omit<ICreateQuestion, "id">) =>
    simplePost<Omit<ICreateQuestion, "id">, { message: string }>(
      "/question",
      data
    ),
  update: (id: number, data: Partial<ICreateQuestion>) =>
    simplePatch<Partial<ICreateQuestion>, { message: string }>(
      `/question/${id}`,
      data
    ),
  delete: (id: number) => simpleDelete<{ message: string }>(`/question`, id),
  updloadImage: (
    file: File | Blob,
    body: { currentName: string } | null,
    onUploadProgress?: (e: AxiosProgressEvent) => void,
  ) =>
    uploadFile<{ filename: string }>(
      "/static/upload",
      file,
      body,
      onUploadProgress
    ),
};
