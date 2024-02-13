import { Answer, InputOption, QuestionAnswer } from "./interfaces";
import {
  List,
  SearchSelect,
  SearchSelectItem,
  TextInput,
  Textarea,
  Title,
} from "@tremor/react";
import { UseQuestions, useQuestions } from "./list";

import _get from "lodash/get";
import { useEffect } from "react";

interface ICheckbox {
  title: string;
  checked: boolean;
  id: string;
  handleClick: () => void;
}

const RenderCheckbox = ({
  title,
  checked = false,
  id,
  handleClick,
  ...otherProps
}: ICheckbox) => {
  return (
    <div className="inline-flex items-center">
      <label
        className="relative flex items-center p-3 rounded-full cursor-pointer"
        htmlFor={id}
      >
        <input
          name={id}
          checked={checked}
          value={checked || ("" as any)}
          onChange={handleClick}
          type="checkbox"
          className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
          id={id}
        />
        <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </label>
      <label
        className="mt-px font-light text-gray-700 cursor-pointer select-none w-full text-xl"
        htmlFor={id}
      >
        {title}
      </label>
    </div>
  );
};

export interface IRenderQuestion {
  autosave?: boolean;
  question: QuestionAnswer;
  handleChangeAnswer: (answer: Answer) => void;
}
export const RenderQuestion = ({
  autosave = false,
  question,
  handleChangeAnswer,
}: IRenderQuestion) => {
  // console.log("question", question);
  const questionInputType = _get(question, "question.inputType", "text");
  const questionInputTypeValue = _get(
    question,
    "question.inputTypeValue",
    "text"
  );
  const isCheckbox = questionInputTypeValue === "checkbox";
  const questionAnswerText = _get(question, "chainRes.text", "");
  const questionAnswerError = _get(question, "chainRes.error", false);

  switch (questionInputType) {
    case "fieldset":
      const questionAnswers = question.question.answers || [];
      return (
        <div>
          <div>
            {questionAnswerError && (
              <div className="text-red-500">Please select an answer</div>
            )}
          </div>
          <List style={{ display: "flex", flexDirection: "column" }}>
            {questionAnswers.map((answer) => {
              const chainResText = _get(question, "chainRes.text", "");
              const chainResJson = _get(question, "chainRes.json", null);
              let isChecked = false;
              let chainResTextJson: string[] = [];

              if (isCheckbox) {
                if (chainResJson) {
                  chainResTextJson = chainResJson;
                } else {
                  try {
                    chainResTextJson = JSON.parse(chainResText);
                  } catch (error) {}
                }

                if (chainResTextJson && Array.isArray(chainResTextJson)) {
                  isChecked = chainResTextJson.some(
                    (x: string) =>
                      x === answer?.inputId || x === answer?.answerText
                  );
                }
              } else {
                // radio single value
                isChecked = chainResText.includes(answer.inputId);
              }

              return (
                <RenderCheckbox
                  checked={isChecked}
                  handleClick={() => handleChangeAnswer(answer)}
                  id={answer.inputId || answer.answerText}
                  key={answer.inputId || answer.answerText}
                  title={answer.answerText}
                />
              );
            })}
          </List>
        </div>
      );

    case "select":
      const questionInputOptions: InputOption[] =
        question?.question?.inputOptions || [];

      // console.log("questionInputOptions", questionInputOptions);

      const selectQuesTextAnswer = questionAnswerText
        .replace('"', "")
        .replace('"', "");
        
      return (
        <div>
          <div>
            {questionAnswerError && (
              <div className="text-red-500">Please select an answer</div>
            )}
          </div>
          <SearchSelect
            className="w-full text-xl"
            value={selectQuesTextAnswer}
            onChange={(e: any) => {
              const value = e;
              const answer = {
                inputId: question.question.inputId,
                inputType: question.question.inputType,
                answerText: value,
              };
              handleChangeAnswer(answer);
            }}
          >
            {questionInputOptions.map((option) => (
              <SearchSelectItem key={option?.value} value={option.value}>
                {option.label || (option as any).text}
              </SearchSelectItem>
            ))}
          </SearchSelect>
        </div>
      );

    case "text":
    default:
      const isNumber = questionInputTypeValue === "number";
      return (
        <>
          <div>
            {questionAnswerError && (
              <div className="text-red-500">
                Please select enter the correct answer or update resume to cover
                this question
              </div>
            )}
          </div>
          {isNumber ? (
            <TextInput
              className="w-full text-xl"
              type={"number" as any}
              value={questionAnswerText}
              onChange={(e) => {
                const answer = {
                  inputId: question.question.inputId,
                  inputType: question.question.inputType,
                  answerText: e.target.value,
                };
                handleChangeAnswer(answer);
              }}
            />
          ) : (
            <Textarea
              className="w-full text-xl"
              rows={5}
              value={questionAnswerText}
              onChange={(e) => {
                const answer = {
                  inputId: question.question.inputId,
                  inputType: question.question.inputType,
                  answerText: e.target.value,
                };
                handleChangeAnswer(answer);
              }}
            />
          )}
        </>
      );
  }
};

interface RenderEditQuestionProps extends UseQuestions {
  question: QuestionAnswer;
}

export const RenderEditQuestion = (props: RenderEditQuestionProps) => {
  const {
    questions: savedQuestions,
    handleChangeAnswer,
    handleSaveQuestion,
    setSelectedQuestion,
    selectedQuestion,
  } = useQuestions();

  const question = selectedQuestion;

  useEffect(() => {
    // console.log("savedQuestions.length", savedQuestions.length);
    const selectedSavedQuestion = savedQuestions.find(
      (q) => q?.question?.question === props?.question?.question?.question
    );

    if (!question && selectedSavedQuestion) {
      // console.log("selectedSavedQuestion", selectedSavedQuestion);
      setSelectedQuestion(selectedSavedQuestion);
    }
  }, [props?.question, savedQuestions]);

  if (!question || !question?.question) return null;

  return (
    <div className="flex mt-3 flex-col">
      <div style={{ marginBottom: "20px" }}>
        <Title>{question.question.question}</Title>
      </div>

      <RenderQuestion
        question={question}
        handleChangeAnswer={handleChangeAnswer}
      />
    </div>
  );
};
