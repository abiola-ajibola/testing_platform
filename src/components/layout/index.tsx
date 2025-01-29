import { Button } from "@/components/ui/button";
import { useUserContext } from "@/contexts/auth";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Home, User, Settings, LogOut, User2Icon, Users, Boxes, Book, FileQuestion } from "lucide-react";
import { toast } from "react-toastify";
import { logout, me } from "@/api/auth";

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

  const handleLogout =async () => {
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
        className={`bg-white shadow-lg ${
          isSidebarOpen ? "w-64" : "w-16"
        } p-4 transition-all duration-300 fixed md:relative h-full z-50 flex flex-col`}
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
          Dashboard
        </h2>
        <ul className="mt-4">
          <li className="my-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <Users className="mr-2" size={40} />
              {isSidebarOpen && <span>Users</span>}
            </Link>
          </li>
          <li className="my-6">
            <Link
              to="/profile"
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <Boxes className="mr-2" size={40} />
              {isSidebarOpen && <span>Classes</span>}
            </Link>
          </li>
          <li className="my-6">
            <Link
              to="/settings"
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <Book className="mr-2" size={40} />
              {isSidebarOpen && <span>Subjects</span>}
            </Link>
          </li>
          <li className="my-6">
            <Link
              to="/settings"
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <FileQuestion className="mr-2" size={40} />
              {isSidebarOpen && <span>Questions</span>}
            </Link>
          </li>
          <li className="my-6">
            <button
              className="text-gray-600 hover:text-gray-900 flex items-center"
              onClick={handleLogout}
            >
              <LogOut className="mr-2" size={40} />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* Navbar */}
        <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-bold">Welcome</h1>
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
