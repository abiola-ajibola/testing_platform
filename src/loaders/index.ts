import { classes } from "@/api/classes";
import { subject } from "@/api/subject";
import { question } from "@/api/question";
import { users } from "@/api/users";
import { Params } from "react-router-dom";

export async function dashboardLoader() {
  return {
    users: await users.getCount(),
    classes: await classes.getCount(),
    subject: await subject.getCount(),
    question: await question.getCount(),
  };
}

export async function userLoader({ params }: { params: Params<string> }) {
  return params.id && !Number.isNaN(+params.id)
    ? {
        user: await users.get(+params.id),
        classes: await classes.getMany(),
      }
    : null;
}

export async function classesLoader() {
  return await classes.getMany();
}

export async function subjectsLoader() {
  return await subject.getMany();
}

export async function questionsLoader() {
  return await question.getMany();
}

export async function editClassLoader({ params }: { params: Params<string> }) {
  return params.id && !Number.isNaN(+params.id)
    ? classes.get(+params.id)
    : null;
}

export async function editSubjectLoader({
  params,
}: {
  params: Params<string>;
}) {
  return params.id && !Number.isNaN(+params.id)
    ? {
        subject: (await subject.get(+params.id))?.data,
        classes: (await classes.getMany())?.data.classes,
      }
    : null;
}

export async function editQuestionLoader({
  params,
}: {
  params: Params<string>;
}) {
  return params.id && !Number.isNaN(+params.id)
    ? question.get(+params.id)
    : null;
}

export async function studentHomeLoader() {
  return await subject.getUsersubjects();
}

export async function testPageLoader({ params }: { params: Params<string> }) {
  return params.subjectId && !Number.isNaN(+params.subjectId)
    ? question.getBySubjectID(params.subjectId)
    : null;
}
