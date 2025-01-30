import { Button } from "@/components/ui/button";
import { useUserContext } from "@/contexts/auth";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Users, Boxes, Book, FileQuestion } from "lucide-react";
import { toast } from "react-toastify";
import { logout, me } from "@/api/auth";

const navItems = [
  { to: "/users", icon: Users, label: "Users" },
  { to: "/profile", icon: Boxes, label: "Classes" },
  { to: "/settings", icon: Book, label: "Subjects" },
  { to: "/questions", icon: FileQuestion, label: "Questions" },
  { to: window.location.pathname, icon: LogOut, label: "Logout" },
];

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { setData } = useUserContext();
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const data = await me();
      if (data) {
        setData(data);
      } else {
        toast.error("Please login to continue");
        navigate("/login");
      }
    })();
  }, [navigate, setData]);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("user");
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
        >
          {isSidebarOpen ? "←" : "→"}
        </Button>
        <h2
          className={`text-xl font-bold text-gray-800 ${
            !isSidebarOpen && "hidden"
          }`}
        >
          <Link to="/dashboard">Dashboard</Link>
        </h2>
        <ul className="mt-4">
          <div className={isSidebarOpen ? "md:block" : "hidden md:block"}>
            {navItems.map(({ to, icon: Icon, label }) => (
              <li className="my-6" key={label}>
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
            ))}
          </div>
          {/* <li className="my-6">
            <Link
              to={window.location.pathname}
              className="text-gray-600 hover:text-gray-900 flex items-center"
              onClick={handleLogout}
            >
              <LogOut className="mr-2" size={40} />
              {isSidebarOpen && <span>Logout</span>}
            </Link>
          </li> */}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* Navbar */}
        <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-bold ml-12 md:ml-0">Welcome</h1>
          <div>
            <Button className="bg-blue-600 text-white">Profile</Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 overflow-auto flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
