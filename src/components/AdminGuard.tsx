import { useUserContext } from "@/contexts/auth";
import { Link, Outlet } from "react-router-dom";

export function AdminGuard() {
  const { data } = useUserContext();
  console.log({ data });
  if (data.role !== "ADMIN") {
    return (
      <>
        <h1 className="text-center">Unauthorized</h1>
        <h4 className="text-center">
          <Link to={"/login"}>Please Login as Admin</Link>
        </h4>
        <p className="text-center">Or</p>
        <h4 className="text-center">
          <Link to={"/student"}>Go to Home</Link>
        </h4>
      </>
    );
  }
  return <Outlet />;
}
