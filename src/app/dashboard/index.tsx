import { Bold, Button, Card, Flex, Grid, Metric, Text, Title } from "@tremor/react";
import {
  CheckCircleIcon,
  CheckIcon,
  ForwardIcon,
  QuestionMarkCircleIcon,
  StopIcon,
} from "@heroicons/react/20/solid";
import {
  ProgressBar,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@tremor/react";

import { AppJob } from "../../utils/state";
import ApplicationsViews from "./applications.view";
import { LayoutPageProps } from "../layout";
import QuestionsError from "./questions.error";
import React from "react";
import { useQuestions } from "../questions/list";

export const Dashboard = ({ state }: LayoutPageProps) => {
  const {
    activeJob,
    apps = [],
    completedApps = [],
    skippedApps = [],
    isListRunning,
    isAppRunning,
    jobs = [],
    applied = [],
    questions = [],
  } = state;

  const useQuestionState = useQuestions();

  const {
    questions: savedQuestions,
    selectedQuestion,
    setSelectedQuestion,
    handleChangeAnswer,
    handleSaveQuestion,
  } = useQuestionState;

  const errorQuestions = savedQuestions.filter((q) => !!q.chainRes.error) || [];

  const searchUrl = "https://ca.indeed.com/jobs?q=";

  const [search, setSearch] = React.useState(searchUrl);

  const handleSearch = (search: string) => {
    setSearch(search);
  };

  const invokeEvent = async (eventName: string, args?: any) => {
    await (window as any).api.invoke(eventName, args);
  };

  const skipJob = async (job: AppJob) => {
    const app = (apps || []).find((ap) => ap.job.id === job.id) || {
      job,
      questions: [] as any,
    };

    await (window as any).api.invoke("app:skip", app);
  };

  const moveToCompleted = async (job: AppJob) => {
    const app = (apps || []).find((ap) => ap.job.id === job.id) || {
      job,
      questions: [] as any,
    };
    await (window as any).api.invoke("app:complete", app);
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

          {activeJob && (
            <div className="flex items-center flex-col p-3 w-full overflow-hidden">
              <div className="truncate">
                <Title>
                  {activeJob.title} - {activeJob.company}
                </Title>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  loading={true}
                  className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
                ></Button>

                <button
                  onClick={() => invokeEvent("app:stop", searchUrl)}
                  className="flex items-center bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
                >
                  <StopIcon className="h-5 w-5 text-white-400" /> Stop
                </button>

                <button
                  onClick={() => skipJob(activeJob)}
                  className="flex items-center bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded"
                >
                  <ForwardIcon className="h-5 w-5 text-white-400" />
                  Skip
                </button>

                <button
                  onClick={() => moveToCompleted(activeJob)}
                  className="flex items-center bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded"
                >
                  <CheckIcon className="h-5 w-5 text-white-400" />
                  Mark as completed
                </button>
              </div>
            </div>
          )}

          {!activeJob && (
            <div className="flex justify-center">
              <Button
                onClick={() => invokeEvent("app:start", searchUrl)}
                disabled={isAppRunning}
                loading={isAppRunning}
              >
                {" "}
                {!isAppRunning ? "Apply with AI" : "AI Applying ..."}{" "}
              </Button>
            </div>
          )}
        </div>
      </Grid>

      <div style={{ marginTop: "20px" }}>
        <TabGroup>
          <TabList className="mt-8">
            <Tab icon={QuestionMarkCircleIcon}>
              Questions: error {errorQuestions.length && errorQuestions.length}
            </Tab>
            <Tab icon={StopIcon}>
              Applications: skipped {skippedApps.length && skippedApps.length}
            </Tab>
            <Tab icon={CheckCircleIcon}>
              Applications: completed{" "}
              {completedApps.length && completedApps.length}
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <QuestionsError {...useQuestionState} />
            </TabPanel>
            <TabPanel>
              <ApplicationsViews
                skipped={true}
                state={state}
                useQuestions={useQuestionState}
              />
            </TabPanel>
            <TabPanel>
              <ApplicationsViews
                skipped={false}
                state={state}
                useQuestions={useQuestionState}
              />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </Card>
  );
};

export default Dashboard;
