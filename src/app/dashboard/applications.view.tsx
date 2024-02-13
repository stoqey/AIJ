import { Answer, QuestionAnswer } from "../questions/interfaces";
import { Application, BEState } from "../../utils/state";
import { List, ListItem, Metric, Title } from "@tremor/react";
import React, { useEffect, useLayoutEffect } from "react";
import { UseQuestions, useQuestions } from "../questions/list";
import { isEmpty, uniqBy } from "lodash";

import { RenderEditQuestion } from "../questions/question";

interface ApplicationsViewProps {
  skipped?: boolean;
  state: BEState;
  useQuestions: UseQuestions;
}
export const ApplicationsViews = (props: ApplicationsViewProps) => {
  const { state, useQuestions, skipped = false } = props;
  const [selectedApp, setSelectedApp] = React.useState<Application>(null);
  const { completedApps = [], skippedApps = [] } = state;

  const apps = uniqBy(skipped ? skippedApps : completedApps, "job.id");

  const reApply = async (app: Application) => {
    const job = app.job;
    await (window as any).api.invoke("app:start:ondemand", job);
  };

  const moveToCompleted = async (app: Application) => {
    await (window as any).api.invoke("app:complete", app);
  };

  return (
    <>
      {apps.length > 0 && (
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
              {apps.map((item, index) => {
                const isSelectedJob = selectedApp?.job?.id === item.job.id;

                return (
                  <div className="flex flex-col" key={item.job.id}>
                    <ListItem
                      onClick={() => setSelectedApp(item)}
                      // key={item.question.inputId}
                      className={`${
                        isSelectedJob ? "bg-gray-200" : ""
                      } hover:bg-gray-100 cursor-pointer px-2`}
                    >
                      <Title className="truncate">
                        {index + 1} ({item.questions.length}) {item.job.title} -{" "}
                        {item.job.company}
                      </Title>
                    </ListItem>
                  </div>
                );
              })}
            </List>
          </div>

          {selectedApp && (
            <div
              style={{ height: "70vh" }}
              className="flex flex-col overflow-x-scroll"
            >
              <div style={{ marginBottom: "20px" }}>
                <div style={{ height: "100px" }}>
                  <Metric>
                    {selectedApp.job.title} - {selectedApp.job.company}
                  </Metric>
                </div>

                {skipped && (
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => reApply(selectedApp)}
                      className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded"
                    >
                      Re-Apply
                    </button>

                    <button
                      onClick={() => moveToCompleted(selectedApp)}
                      className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded"
                    >
                      Mark as completed
                    </button>
                  </div>
                )}
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

export default ApplicationsViews;
