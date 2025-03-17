import { logout } from "@/api/auth";
import { USER_KEY, useUserContext } from "@/contexts/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Logout() {
  const { setData } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await logout();
      localStorage.removeItem(USER_KEY);
      setData({
        role: "STUDENT",
        id: 0,
        username: "",
        first_name: "",
        middle_name: "",
        last_name: "",
      });
      navigate("/login");
    };
    handleLogout();
  }, [navigate, setData]);

  return null;
}
