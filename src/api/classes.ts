import { simpleGet } from "./baseClients";

export const classes = {
  getCount: () => simpleGet<{ count: number }>("/class/count"),
};
