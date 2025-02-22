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
import { Users } from "./pages/Users";
import { EditUser } from "./pages/EditUsers";
import { Classes } from "./pages/Classes";
import { EditClass } from "./pages/EditClasses";
import { Subjects } from "./pages/Subjects";
import { EditSubject } from "./pages/EditSubjects";
import { Questions } from "./pages/Questions";
import { EditQuestion } from "./pages/EditQuestions";
import { AdminGuard } from "./components/AdminGuard";
import { StudentHome } from "./pages/StudentHome";
import { Test } from "./pages/Test";
import {
  classesLoader,
  dashboardLoader,
  editClassLoader,
  editQuestionLoader,
  editSubjectLoader,
  questionsLoader,
  studentHomeLoader,
  subjectsLoader,
  testPageLoader,
  userLoader,
} from "./loaders";

export type DashboardData = Awaited<ReturnType<typeof dashboardLoader>>;
export type TestPageData = Awaited<ReturnType<typeof testPageLoader>>;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "student",
        children: [
          {
            path: "",
            element: <StudentHome />,
            loader: studentHomeLoader,
          },
          {
            path: "test/:subjectId",
            element: <Test />,
            loader: testPageLoader,
          },
        ],
      },
      {
        path: "admin",
        element: <AdminGuard />,
        children: [
          {
            path: "",
            element: <></>,
            loader: async () => {
              return redirect("/admin/dashboard");
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
            loader: async () => {
              return await users.getMany();
            },
          },
          {
            path: "_users/view/:id",
            element: <EditUser />,
            loader: userLoader,
          },
          {
            path: "_users/:id",
            element: <EditUser />,
            loader: userLoader,
          },
          {
            path: "_classes",
            element: <Classes />,
            loader: classesLoader,
          },
          {
            path: "_classes/:id",
            element: <EditClass />,
            loader: editClassLoader,
          },
          {
            path: "_classes/view/:id",
            element: <EditClass />,
            loader: editClassLoader,
          },
          {
            path: "_subjects",
            element: <Subjects />,
            loader: subjectsLoader,
          },
          {
            path: "_subjects/:id",
            element: <EditSubject />,
            loader: editSubjectLoader,
          },
          {
            path: "_subjects/view/:id",
            element: <EditSubject />,
            loader: editSubjectLoader,
          },
          {
            path: "_questions",
            element: <Questions />,
            loader: questionsLoader,
          },
          {
            path: "_questions/:id",
            element: <EditQuestion />,
            loader: editQuestionLoader,
          },
          {
            path: "_questions/view/:id",
            element: <EditQuestion />,
            loader: editQuestionLoader,
          },
        ],
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
