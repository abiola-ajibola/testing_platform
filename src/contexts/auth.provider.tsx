import { PropsWithChildren, useState } from "react";
import { userContext } from "./auth";
import { IUser } from "@/api/auth";

export function UserDataProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState<IUser>({
    first_name: "",
    id: 0,
    last_name: "",
    middle_name: "",
    role: "STUDENT",
    username: "",
  });

  return (
    <userContext.Provider value={{ data, setData }}>
      {children}
    </userContext.Provider>
  );
}
