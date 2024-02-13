import { List, ListItem, Metric, Title } from "@tremor/react";

import { QuestionAnswer } from "../questions/interfaces";
import { RenderQuestion } from "../questions/question";
import { UseQuestions } from "../questions/list";
import { isEmpty } from "lodash";

export const QuestionsError = (props: UseQuestions) => {
  const {
    questions: savedQuestions,
    selectedQuestion,
    setSelectedQuestion,
    handleChangeAnswer,
    handleSaveQuestion,
  } = props;

  const errorQuestions = savedQuestions.filter((q) => !!q.chainRes.error);

  return (
    <>
      {errorQuestions.length > 0 && (
        <div className="flex flex-row">
          <div className="flex mt-3 flex-col" style={{ width: "50%" }}>
            <Title> Error Questions {errorQuestions.length} </Title>
            <List
              style={{
                height: "80vh",
                overflowY: "scroll",
              }}
            >
              {errorQuestions.map((item, index) => (
                <div className="flex flex-col" key={item.question.inputId}>
                  <ListItem
                    onClick={() => setSelectedQuestion(item as QuestionAnswer)}
                    key={item.question.inputId}
                    className={` hover:bg-gray-100 cursor-pointer px-2`}
                  >
                    <Title className="truncate">
                      {index + 1} {item.question.question}
                    </Title>
                    {/* {item.isNew && <Badge>New</Badge>} */}
                  </ListItem>

                  <div className="flex justify-start text-red-500 px-4">
                    {isEmpty(item.chainRes.text) || item.chainRes.text === "."
                      ? "Error with question"
                      : item.chainRes.text}
                  </div>
                </div>
              ))}
            </List>
          </div>

          {selectedQuestion && (
            <div className="flex mt-3 flex-col" style={{ width: "50%" }}>
              <div style={{ marginBottom: "20px" }}>
                <Metric>{selectedQuestion.question.question}</Metric>
              </div>

              <RenderQuestion
                question={selectedQuestion}
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
          )}
        </div>
      )}
    </>
  );
};

export default QuestionsError;
