import { IUser } from "@/api/auth";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
} from "react";

const USER_KEY = "user";

export const userContext = createContext<{
  data: IUser;
  setData: Dispatch<SetStateAction<IUser>>;
}>({
  data: {
    role: "STUDENT",
    id: 0,
    username: "",
    first_name: "",
    middle_name: "",
    last_name: "",
  },
  setData: () => {},
});

export function useUserContext() {
  const { data, setData } = useContext(userContext);

  useEffect(() => {
    localStorage.setItem(USER_KEY, JSON.stringify(data));
  }, [data]);

  return { data, setData };
}
