import { Answer, QuestionAnswer } from "../questions/interfaces";
import { Application, BEState } from "../../utils/state";
import { List, ListItem, Metric, Title } from "@tremor/react";
import React, { useEffect, useLayoutEffect } from "react";
import { RenderQuestion, UseQuestions, useQuestions } from "../questions/list";

import { isEmpty } from "lodash";

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
    console.log("savedQuestions.length", savedQuestions.length);
    const selectedSavedQuestion = savedQuestions.find(
      (q) => q?.question?.question === props?.question?.question?.question
    );

    if (!question && selectedSavedQuestion) {
      console.log("selectedSavedQuestion", selectedSavedQuestion);
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
      <div className="flex justify-center mt-2">
        <button
          onClick={handleSaveQuestion}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};

interface ApplicationsErrorProps {
  state: BEState;
  useQuestions: UseQuestions;
}
export const ApplicationsError = (props: ApplicationsErrorProps) => {
  const { state, useQuestions } = props;
  const [selectedApp, setSelectedApp] = React.useState<Application>(null);
  const { completedApps, skippedApps, apps } = state;

  return (
    <>
      {skippedApps.length > 0 && (
        <div className="flex flex-row">
          {/* JOB */}

          {/* Questions */}

          {/* Apps */}
          <div className="flex mt-3 flex-col" style={{ width: "50%" }}>
            <List
              style={{
                height: "80vh",
                overflowY: "scroll",
              }}
            >
              {skippedApps.map((item, index) => {
                const isSelectedJob = selectedApp?.job?.id === item.job.id;

                return (
                <div className="flex flex-col" key={item.job.id}>
                  <ListItem
                    onClick={() => setSelectedApp(item)}
                    // key={item.question.inputId}
                    className={`${isSelectedJob? 'bg-gray-200': ''} hover:bg-gray-100 cursor-pointer px-2`}
                  >
                    <Title className="truncate">
                      {index + 1} {item.job.title} - {item.job.company} (
                      {item.questions.length})
                    </Title>
                  </ListItem>
                </div>
              )})}
            </List>
          </div>

          {selectedApp && (
            <div
              style={{ height: "70vh" }}
              className="flex flex-col overflow-x-scroll"
            >
              <div style={{ marginBottom: "20px" }}>
                <Metric>
                  {selectedApp.job.title} - {selectedApp.job.company}
                </Metric>
              </div>

              {selectedApp.questions.map((question, index) => (
                <RenderEditQuestion
                  key={question?.question?.inputId + index}
                  question={question}
                  {...useQuestions}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ApplicationsError;
