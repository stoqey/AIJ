import { Badge, List, ListItem, Metric, Title } from "@tremor/react";

import { QuestionAnswer } from "../questions/interfaces";
import { RenderQuestion } from "../questions/question";
import { UseQuestions } from "../questions/list";

export const QuestionsNew = (props: UseQuestions) => {
  const {
    questions: savedQuestions,
    selectedQuestion,
    setSelectedQuestion,
    handleChangeAnswer,
  } = props;

  const newQuestions = savedQuestions.filter((q) => q.isNew);

  return (
    <>
      {newQuestions.length > 0 && (
        <div className="flex flex-row">
          <div className="flex mt-3 flex-col" style={{ width: "50%" }}>
            <Title> New questions {newQuestions.length} </Title>
            <List
              style={{
                height: "80vh",
                overflowY: "scroll",
              }}
            >
              {newQuestions.map((item, index) => (
                <div className="flex flex-col" key={item.question.inputId}>
                  <ListItem
                    onClick={() => setSelectedQuestion(item as QuestionAnswer)}
                    key={item.question.inputId}
                    className={` hover:bg-gray-100 cursor-pointer px-2`}
                  >
                    <Title className="truncate">
                      {index + 1} {item.question.question}
                    </Title>
                    {item.isNew && <Badge>New</Badge>}
                  </ListItem>
                </div>
              ))}
            </List>
          </div>

          {selectedQuestion && (
            <div className="flex mt-3 flex-col p-2" style={{ width: "50%" }}>
              <div style={{ marginBottom: "20px" }}>
                <Metric>{selectedQuestion.question.question}</Metric>
              </div>

              <RenderQuestion
                question={selectedQuestion}
                handleChangeAnswer={handleChangeAnswer}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default QuestionsNew;
