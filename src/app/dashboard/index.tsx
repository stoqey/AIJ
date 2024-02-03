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
import {
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  StopIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import {
  ProgressBar,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@tremor/react";
import { RenderQuestion, useQuestions } from "../questions/list";

import { LayoutPageProps } from "../layout";
import { QuestionAnswer } from "../questions/interfaces";
import QuestionsError from "./questions.error";
import React from "react";
import { TabExample } from "./tabs";
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

      <div style={{ marginTop: "20px" }}>
        <TabGroup>
          <TabList className="mt-8">
            <Tab icon={QuestionMarkCircleIcon}>
              Questions: error ({errorQuestions.length})
            </Tab>
            <Tab icon={StopIcon}>Applications: skipped</Tab>
            <Tab icon={CheckCircleIcon}>Applications: completed</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <QuestionsError {...useQuestionState} />
            </TabPanel>
            <TabPanel>
              <div className="mt-10">
                <Flex className="mt-4">
                  <Text className="w-full">Product Z</Text>
                  <Flex className="space-x-2" justifyContent="end">
                    <Text>$ 99,484</Text>
                    <Text>16%</Text>
                  </Flex>
                </Flex>
                <ProgressBar value={12} className="mt-2" />
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </Card>
  );
};

export default Dashboard;
