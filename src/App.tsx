import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import { LoginPage } from "./pages/Login";
import Layout from "./components/layout";
import { UserDataProvider } from "./contexts/auth.provider";
import { Dashboard } from "./pages/Dashboard";
import { users } from "./api/users";
import { classes } from "./api/classes";
import { subject } from "./api/subject";
import { question } from "./api/question";
import { Users } from "./pages/Users";
import { EditUser } from "./pages/EditUsers";

async function dashboardLoader() {
  return {
    users: await users.getCount(),
    classes: await classes.getCount(),
    subject: await subject.getCount(),
    question: await question.getCount(),
  };
}
export type DashboardData = Awaited<ReturnType<typeof dashboardLoader>>;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <></>,
        loader: async () => {
          return redirect("/dashboard");
        },
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        loader: dashboardLoader,
      },
      {
        path: "_users",
        element: <Users />,
        loader: dashboardLoader,
      },
      {
        path: "_users/:id",
        element:<EditUser  />,
        loader: dashboardLoader,
      },
      {
        path: "_classes",
        element: <h1>Classes</h1>,
        loader: dashboardLoader,
      },
      {
        path: "_subjects",
        element: <h1>Subjects</h1>,
        loader: dashboardLoader,
      },
      {
        path: "_questions",
        element: <h1>Questions</h1>,
        loader: dashboardLoader,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

function App() {
  return (
    <>
      <UserDataProvider>
        <RouterProvider router={router} />
        <ToastContainer />
      </UserDataProvider>
    </>
  );
}

export default App;
