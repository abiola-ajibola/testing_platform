import { simpleGet } from "./baseClients";

export const subject = {
  getCount: () => simpleGet<{ count: number }>("/subject/count"),
};
