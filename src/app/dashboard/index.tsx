import {
  Bold,
  Button,
  Card,
  Col,
  Flex,
  Grid,
  Metric,
  Text,
} from "@tremor/react";

import { LayoutPageProps } from "../layout";
import React from "react";
import { useAppState } from "../hooks";

export const Dashboard = ({ state }: LayoutPageProps) => {
  const {
    isListRunning,
    isAppRunning,
    jobs = [],
    applied = [],
    questions = [],
  } = state;

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
        <div>
          <div className="flex items-center">
            <Metric>Jobs</Metric>
            <div className="p-3">
              <Bold> {jobs.length} </Bold>
            </div>
          </div>

          <div className="rounded-md shadow-sm mb-2">
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
              {!isListRunning ? "Run" : "Running"}{" "}
            </Button>

            <div className="ml-2">
              {isListRunning && (
                <Button
                  color="red"
                  onClick={() => invokeEvent("list:stop", search)}
                >
                  {" "}
                  Stop{" "}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center">
            <Metric>Applications</Metric>
            <div className="p-3">
              <Bold> {applied.length} </Bold>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => invokeEvent("app:start", searchUrl)}
              disabled={isAppRunning}
              loading={isAppRunning}
            >
              {" "}
              {!isAppRunning ? "Run" : "Running"}{" "}
            </Button>

            <div className="ml-2">
              {isAppRunning && (
                <Button
                  color="red"
                  onClick={() => invokeEvent("app:stop", searchUrl)}
                >
                  {" "}
                  Stop{" "}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Grid>
    </Card>
  );
};

export default Dashboard;
