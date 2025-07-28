import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { AccordionComponent } from "./ui/accordion";

export const Question = ({
  question,
  imageUrl,
  options,
  explanation,
  explanationImageUrl,
}: {
  question: string;
  imageUrl?: string;
  options: ReactNode;
  explanation?: string;
  explanationImageUrl?: string;
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="pb-12 mb-16 border-b">
      <p className="mb-4">{question}</p>
      {imageUrl && (
        <img src={imageUrl} alt="Question" className="object-contain mb-4" />
      )}
      <div>{options}</div>

      {false && (
        <>
          <Button
            className="mt-2"
            onClick={() => setShowExplanation(!showExplanation)}
          >
            {showExplanation ? "Hide Explanation" : "Show Explanation"}
          </Button>
          <AccordionComponent
            label="Explanation"
            content={
              <div className="mt-2 p-3 bg-gray-100 rounded-lg">
                {explanationImageUrl && (
                  <img
                    src={explanationImageUrl}
                    alt="Explanation"
                    className="w-full h-40 object-cover rounded-lg mb-2"
                  />
                )}
                <p>{explanation}</p>
              </div>
            }
          />
        </>
      )}
    </div>
  );
};
