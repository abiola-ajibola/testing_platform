import { simpleGet } from "./baseClients";

export const question = {
  getCount: () => simpleGet<{ count: number }>("/question/count"),
};
