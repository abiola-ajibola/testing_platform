import { DashboardData } from "@/App";
import { Book, Boxes, FileQuestion, User } from "lucide-react";
import { Link, useLoaderData } from "react-router-dom";

export function Dashboard() {
  const data = useLoaderData<DashboardData>();
  console.log(data);
  const stats = [
    {
      label: "Users",
      count: data.users.count,
      icon: <User size={48} />,
      to: "/users",
    },
    {
      label: "Classes",
      count: data.classes.count,
      icon: <Boxes size={48} />,
      to: "/classes",
    },
    {
      label: "Subjects",
      count: data.subject.count,
      icon: <Book size={48} />,
      to: "/subjects",
    },
    {
      label: "Questions",
      count: data.question.count,
      icon: <FileQuestion size={48} />,
      to: "/questions",
    },
  ];
  return (
    // <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-6">
    <div
      className="grid gap-4 p-6"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}
    >
      {stats.map((stat, index) => (
        <Link to={stat.to} key={index}>
          <div
            key={index}
            className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md border border-gray-300"
          >
            <div className="flex items-center space-x-4">
              <div className="text-gray-700">{stat.icon}</div>
              <p className="text-3xl font-bold text-black">{stat.count}</p>
            </div>
            <p className="text-gray-600 text-lg mt-2">{stat.label}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
