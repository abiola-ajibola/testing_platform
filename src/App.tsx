import {
  createBrowserRouter,
  Params,
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
import { Classes } from "./pages/Classes";
import { EditClass } from "./pages/EditClasses";
import { Subjects } from "./pages/Subjects";
import { EditSubject } from "./pages/EditSubjects";

async function dashboardLoader() {
  return {
    users: await users.getCount(),
    classes: await classes.getCount(),
    subject: await subject.getCount(),
    question: await question.getCount(),
  };
}

async function userLoader({ params }: { params: Params<string> }) {
  return params.id && !Number.isNaN(+params.id)
    ? {
        user: await users.get(+params.id),
        classes: await classes.getMany(),
      }
    : null;
}

async function classesLoader() {
  return await classes.getMany();
}

async function subjectsLoader() {
  return await subject.getMany();
}

async function editClassLoader({ params }: { params: Params<string> }) {
  return params.id && !Number.isNaN(+params.id)
    ? classes.get(+params.id)
    : null;
}

async function editSubjectLoader({ params }: { params: Params<string> }) {
  return params.id && !Number.isNaN(+params.id)
    ? {
        subject: (await subject.get(+params.id)).data,
        classes: (await classes.getMany()).data.classes,
      }
    : null;
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
