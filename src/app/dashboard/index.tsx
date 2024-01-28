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

import React from "react";
import { useAppState } from "../hooks";

export const Dashboard = () => {
  const state = useAppState();
  const { isListRunning, isAppRunning } = state;

  const toggleStartStop = async (eventName: string) => {
    const startStop = `${eventName}:${isListRunning ? "stop" : "start"}`;
    await (window as any).api.invoke(startStop, null);
  };

  const allEvents = [
    { title: "Main", name: "list", isRunning: isListRunning },
    { title: "App", name: "app", isRunning: isAppRunning },
  ];

  return (
    <Grid numItems={1} numItemsSm={2} numItemsLg={2} className="gap-3">
      {allEvents.map(({ isRunning, name: eventName, title }) => {
        return (
          <Card key={eventName}>
            <div className="flex items-center">
              <Metric>{title}</Metric>
              <div className="p-3">
                <Bold> some nice number </Bold>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => toggleStartStop(eventName)}
                disabled={isRunning}
                loading={isRunning}
              >
                {" "}
                {!isListRunning ? "Run" : "Running"}{" "}
              </Button>

              <div className="ml-2">
                {isListRunning && (
                  <Button
                    color="red"
                    onClick={() => toggleStartStop(eventName)}
                  >
                    {" "}
                    Stop{" "}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        );
      })}

      {/* Analytics */}
      {/* <Col numColSpan={3}>
        <Card>
          <Text>Title</Text>
        </Card>
      </Col> */}
    </Grid>
  );
};

export default Dashboard;
