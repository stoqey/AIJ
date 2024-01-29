import { Answer, QuestionAnswer } from "./interfaces";
import {
  Badge,
  BadgeDelta,
  Bold,
  Card,
  Col,
  Flex,
  Grid,
  List,
  ListItem,
  Metric,
  Text,
  Textarea,
  Title,
} from "@tremor/react";

import React from "react";
import _get from "lodash/get";
import { questionSamples } from "./list.sample";
import { uniq } from "lodash";

// import {
//   ClockIcon,
//   CogIcon,
//   MinusCircleIcon,
//   ShoppingCartIcon,
//   StatusOnlineIcon,
// } from "@heroicons/react/outline";

const cities = [
  {
    city: "Athens",
    rating: "2 open PR",
  },
  {
    city: "Luzern",
    rating: "1 open PR",
  },
  {
    city: "Zürich",
    rating: "0 open PR",
  },
  {
    city: "Vienna",
    rating: "1 open PR",
  },
  {
    city: "Ermatingen",
    rating: "0 open PR",
  },
  {
    city: "Lisbon",
    rating: "0 open PR",
  },
];

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
}: ICheckbox) => {
  return (
    <div className="inline-flex items-center">
      <label
        className="relative flex items-center p-3 rounded-full cursor-pointer"
        htmlFor={id}
      >
        <input
          checked={checked}
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
        className="mt-px font-light text-gray-700 cursor-pointer select-none w-full"
        htmlFor={id}
      >
        {title}
      </label>
    </div>
  );
};

const RenderQuestion = ({
  question,
  handleChangeAnswer,
}: {
  question: QuestionAnswer;
  handleChangeAnswer: (answer: Answer) => void;
}) => {
  const questionInputType = _get(question, "question.inputType", "text");
  const questionInputTypeValue = _get(
    question,
    "question.inputTypeValue",
    "text"
  );
  const questionAnswerText = _get(question, "chainRes.text", "");

  switch (questionInputType) {
    case "fieldset":
      const questionAnswers = question.question.answers || [];
      return (
        <div>
          <List style={{ display: "flex", flexDirection: "column" }}>
            {questionAnswers.map((answer) => {
              const isChecked = question.chainRes.text.includes(answer.inputId);
              return (
                <RenderCheckbox
                  checked={isChecked}
                  handleClick={() => handleChangeAnswer(answer)}
                  id={answer.inputId}
                  key={answer.inputId}
                  title={answer.answerText}
                />
              );
            })}
          </List>
        </div>
      );
    default:
    case "text":
      return (
        <Textarea
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
      );
  }
};
export const ListQuestions = () => {
  const [selectedQuestion, setSelectedQuestion] =
    React.useState<QuestionAnswer | null>(null);

  const setSelectedAnswerText = (answer: string) => {
    const selQuestion = { ...selectedQuestion, chainRes: { text: answer } };
    setSelectedQuestion(selQuestion);
  };

  const handleChangeAnswer = (answer: Answer) => {
    const isCheckbox = answer.inputType === "checkbox";

    const questionInputType = _get(
      selectedQuestion,
      "question.inputType",
      "text"
    );
    const questionInputTypeValue = _get(
      selectedQuestion,
      "question.inputTypeValue",
      ""
    );

    const questionAnswerText = _get(selectedQuestion, "chainRes.text", "");

    switch (questionInputType) {
      case "fieldset":
        if (isCheckbox) {
          let curAnswer = questionAnswerText
            .replace('"', "")
            .replace('"', "")
            .split(",");

          if (curAnswer.includes(answer.inputId)) {
            curAnswer = curAnswer.filter((item) => item !== answer.inputId);
          } else {
            curAnswer.push(answer.inputId);
          }

          const newAnswerText = uniq(curAnswer).join(",");
          return setSelectedAnswerText(newAnswerText);
        }
        return setSelectedAnswerText(answer.inputId);

      default:
        return setSelectedAnswerText(answer.answerText);
    }
  };

  const handleSaveQuestion = () => {
    console.log("save question");
    
  }

  return (
    <Card className="max-w-xl">
      <Bold>Questions</Bold>

      <div>
        <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-3">
          <Flex className="border border-solid">
            <List
              style={{
                height: "90vh",
                overflowY: "scroll",
              }}
            >
              {questionSamples.map((item) => (
                <ListItem
                  onClick={() => setSelectedQuestion(item as QuestionAnswer)}
                  key={item.question.question}
                  className=" hover:bg-gray-100 cursor-pointer px-2"
                >
                  <Text>{item.question.question}</Text>
                  <Text>
                    <Badge>Some text</Badge>{" "}
                  </Text>
                </ListItem>
              ))}
            </List>
          </Flex>

          {selectedQuestion && (
            <Col numColSpan={1} numColSpanLg={2}>
              <Card>
                <div className="m-1">
                  <Metric>{selectedQuestion.question.question}</Metric>
                </div>

                <RenderQuestion
                  question={selectedQuestion}
                  handleChangeAnswer={handleChangeAnswer}
                />

                <div className="flex justify-center mt-2">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Save
                  </button>
                </div>
              </Card>
            </Col>
          )}

          {/* <Col>
            <Card>
              <Text>Title</Text>
              <Metric>KPI 3</Metric>
            </Card>
          </Col>

          <Card>
            <Text>Title</Text>
            <Metric>KPI 4</Metric>
          </Card>

          <Card>
            <Text>Title</Text>
            <Metric>KPI 5</Metric>
          </Card> */}
        </Grid>
      </div>
    </Card>
  );
};

export default ListQuestions;
