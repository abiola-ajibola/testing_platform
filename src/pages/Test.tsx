import { question } from "@/api/question";
import { TestPageData } from "@/App";
import { Question } from "@/components/question";
import { Button } from "@/components/ui/button";
import { Popup } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router-dom";

export function Test() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [score, setScore] = useState("");
  const loaderData = useLoaderData<TestPageData>();
  const questions = loaderData?.data.questions;

  const { register, handleSubmit } = useForm<{
    [k: string]: `${number}:${number}` | null;
  }>();

  const onSubmit = async (data: {
    [k: string]: `${number}:${number}` | null;
  }) => {
    console.log(data);
    const answers = Object.values(data).map((value) => {
      const [questionId, optionId] = value?.split(",") || [];
      return value ? { questionId: +questionId, optionId: +optionId } : null;
    });
    console.log({ answers, total: questions?.length || 0 });
    try {
      const data = await question.submitAnswers({
        answers,
        total: questions?.length || 0,
      });
      if (data) {
        console.log({ data });
        setScore(data.score);
        setPopupOpen(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {questions
          ? questions.map((question, index) => (
              <Question
                imageUrl={question.imageUrl}
                key={question.id}
                options={
                  question.options?.map((option) => (
                    <div
                      className="flex items-center justify-start gap-4"
                      key={option.id}
                    >
                      <Input
                        className="shadow-none basis-6"
                        type="radio"
                        id={
                          question.id.toString() + (option.id?.toString() || "")
                        }
                        {...register(`${index}`)}
                        value={[
                          question.id.toString(),
                          option.id?.toString() || "",
                        ]}
                      />
                      <label
                        htmlFor={
                          question.id.toString() + (option.id?.toString() || "")
                        }
                      >
                        <div className={option.image_url ? "mb-4" : ""}>
                          {option.text || ""}
                        </div>
                        {option.image_url && (
                          <img
                            className="object-contain mb-6"
                            src={option.image_url}
                            alt={option.text}
                          />
                        )}
                      </label>
                    </div>
                  )) || []
                }
                question={`${index + 1}) ${question.text.trim()}`}
                explanation={question.explanation?.trim()}
                explanationImageUrl={question.explanationImageUrl}
              />
            ))
          : null}
        <div>
          <Button className="mt-8" type="submit">
            Submit
          </Button>
        </div>
      </form>
      <Popup
        open={popupOpen}
        content={
          <div className="text-center text-xl mb-4">
            <h1>Test Submitted</h1>
            <h3>Score:</h3>
            <h1 className="font-bold text-6xl mt-6">{score}</h1>
          </div>
        }
        onClose={() => setPopupOpen(false)}
        title="Test Submitted"
      />
    </>
  );
}
