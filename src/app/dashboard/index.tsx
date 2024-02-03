import {
  Bold,
  Button,
  Card,
  Col,
  Flex,
  Grid,
  List,
  ListItem,
  Metric,
  Text,
  Title,
} from "@tremor/react";
import { RenderQuestion, useQuestions } from "../questions/list";

import { LayoutPageProps } from "../layout";
import { QuestionAnswer } from "../questions/interfaces";
import React from "react";
import { isEmpty } from "lodash";
import { useAppState } from "../hooks";

export const Dashboard = ({ state }: LayoutPageProps) => {
  const {
    isListRunning,
    isAppRunning,
    jobs = [],
    applied = [],
    questions = [],
  } = state;

  const {
    questions: savedQuestions,
    selectedQuestion,
    setSelectedQuestion,
    handleChangeAnswer,
    handleSaveQuestion,
  } = useQuestions();

  const errorQuestions = savedQuestions.filter((q) => !!q.chainRes.error);

  const searchUrl = "https://ca.indeed.com/jobs?q=";

  const [search, setSearch] = React.useState(searchUrl);

  const handleSearch = (search: string) => {
    setSearch(search);
  };

  const invokeEvent = async (eventName: string, args?: any) => {
    await (window as any).api.invoke(eventName, args);
  };

  const allEvents = [
    // { title: "Main", name: "list", isRunning: isListRunning, args: searchUrl },
    {
      title: "Applications",
      name: "app",
      isRunning: isAppRunning,
      applications: applied,
    },
  ];

  return (
    <Card>
      <Grid numItems={1} numItemsSm={2} numItemsLg={2} className="gap-3">
        <div className="flex flex-col items-center w-full">
          <div className="flex items-center">
            <Bold>Jobs</Bold>
            <div className="p-3">
              <Metric> {jobs.length} </Metric>
            </div>
          </div>

          <div className="rounded-md shadow-sm mb-2 w-full">
            <input
              value={search}
              name="search"
              id="search"
              className="h-10 block w-full rounded-md border border-gray-200 pl-9 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Search by name..."
              spellCheck={false}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => invokeEvent("list:start", search)}
              disabled={isListRunning}
              loading={isListRunning}
            >
              {" "}
              {!isListRunning ? "Fetch jobs" : "Fetching jobs ...."}{" "}
            </Button>

            <div className="ml-2">
              {isListRunning && (
                <Button
                  color="red"
                  onClick={() => invokeEvent("list:stop", search)}
                >
                  {" "}
                  Stop fetching{" "}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center w-full justify-center">
          <div className="flex items-center">
            <Bold>Applications</Bold>
            <div className="p-3">
              <Metric> {applied.length} </Metric>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => invokeEvent("app:start", searchUrl)}
              disabled={isAppRunning}
              loading={isAppRunning}
            >
              {" "}
              {!isAppRunning ? "Apply with AI" : "AI Applying ..."}{" "}
            </Button>

            <div className="ml-2">
              {isAppRunning && (
                <Button
                  color="red"
                  onClick={() => invokeEvent("app:stop", searchUrl)}
                >
                  {" "}
                  Stop AI{" "}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Grid>

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
    </Card>
  );
};

export default Dashboard;
