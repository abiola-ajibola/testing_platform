import { ResponseWithPagination } from "@/api/baseClients";
import { SubjectResponse } from "@/api/subject";
import { buttonVariants } from "@/components/ui/button";
import { Link, useLoaderData } from "react-router-dom";

export function StudentHome() {
  const loaderData = useLoaderData<{
    data: ResponseWithPagination<{
      subjects: Omit<SubjectResponse, "class">[];
    }>;
  }>();
  const subjects = loaderData.data.subjects;
  console.log({ loaderData, subjects });
  return (
    <div>
      <h1>Select subject</h1>
      <ul>
        {subjects.map((subject) => (
          <li className="my-4" key={subject.id}>
            <Link
              className={buttonVariants()}
              to={`/student/test/${subject.id}`}
            >
              {subject.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
