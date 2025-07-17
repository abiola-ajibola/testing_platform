import { ICreateQuestion, question } from "../models/question";
import { questions } from "./data/questions";

async function loadQuestions(questions: ICreateQuestion[]) {
  try {
    await Promise.all(
      questions.map(async (q) => {
        return await question.createOne(q);
      })
    );
  } catch (error) {
    console.log({ error });
  }
}

loadQuestions(questions)