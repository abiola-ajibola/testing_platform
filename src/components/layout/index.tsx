import { Button } from "@/components/ui/button";
import { USER_KEY, useUserContext } from "@/contexts/auth";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  LogOut,
  Users,
  Boxes,
  Book,
  FileQuestion,
  Home,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { logout, me } from "@/api/auth";

const navItems = [
  { to: "/admin/_users", icon: Users, label: "Users" },
  { to: "/admin/_classes", icon: Boxes, label: "Classes" },
  { to: "/admin/_subjects", icon: Book, label: "Subjects" },
  { to: "/admin/_questions", icon: FileQuestion, label: "Questions" },
  { to: window.location.pathname, icon: LogOut, label: "Logout" },
];

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { setData, data } = useUserContext();
  const isAdmin = data.role === "ADMIN";
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        const data = await me();
        if (data) {
          setData(data);
        } else {
          toast.error("Please login to continue");
          navigate("/login");
        }
      } catch (error) {
        console.error(error);
        toast.error("Please login to continue");
        navigate("/login");
      }
    })();
  }, [navigate, setData]);

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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-transparent md:bg-white md:shadow-lg ${
          isSidebarOpen ? "w-64 bg-white h-full" : "w-16 h-[4.2rem]"
        } p-4 transition-all duration-300 fixed md:relative  md:h-full z-50 flex flex-col`}
      >
        <Button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="mb-4 self-end"
          variant="ghost"
          size="icon"
        >
          {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </Button>
        <h2 className={`text-xl font-bold text-gray-800`}>
          <Link
            className="flex items-center"
            to={isAdmin ? "/admin/dashboard" : "/student"}
          >
            <Home className="mr-2" size={40} />{" "}
            {isSidebarOpen &&
              (isAdmin ? <span>Dashboard</span> : <span>Home</span>)}
          </Link>
        </h2>
        <ul className="mt-4 h-full">
          <div
            className={`md:flex flex-col h-full ${
              isSidebarOpen ? "" : "hidden"
            }`}
          >
            {navItems.map(({ to, icon: Icon, label }) =>
              isAdmin || to === window.location.pathname ? (
                <li className="my-4 last:mt-auto" key={label}>
                  <Link
                    to={to}
                    className="text-gray-600 hover:text-gray-900 flex items-center"
                    onClick={
                      to === window.location.pathname ? handleLogout : () => {}
                    }
                  >
                    <Icon className="mr-2" size={40} />
                    {isSidebarOpen && <span>{label}</span>}
                  </Link>
                </li>
              ) : null
            )}
          </div>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* Navbar */}
        <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-bold ml-12 md:ml-0">Welcome</h1>
          {/* <div>
            <Button className="bg-blue-600 text-white">Profile</Button>
          </div> */}
        </header>

        {/* Page Content */}
        <main className="p-6 overflow-auto flex-1">
          <nav className="pb-6 mb-4 border-b border-gray-200">
            <div className="flex justify-between">
              <Button
                onClick={() => navigate(-1)}
                className="bg-blue-600 text-white"
              >
                <ArrowLeft /> <span>Back</span>
              </Button>
              <Button
                onClick={() => navigate(1)}
                className="bg-blue-600 text-white"
              >
                <span>Forward</span> <ArrowRight />
              </Button>
            </div>
          </nav>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
