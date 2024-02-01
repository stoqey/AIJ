import {
  Bold,
  Button,
  Card,
  Metric,
  NumberInput,
  TextInput,
} from "@tremor/react";

import { LayoutPageProps } from "../layout";
import React from "react";
import _get from "lodash/get";

export const SettingsPage = ({ state }: LayoutPageProps) => {
  const auth = state.auth;

  const speedApply = _get(state, "settings.speedApply", 500);
  const speedJobs = _get(state, "settings.speedJobs", 100);

  const handleSignout = async () => {
    await (window as any).api.invoke("logout", null);
  };

  const changeSpeed = (isApp: boolean) => async (speed: number) => {
    await (window as any).api.invoke("change:speed", [isApp, speed]);
  };

  const setDefaultSpeed = async () => {
    await (window as any).api.invoke("speed:default", null);
  };

  if (!auth) {
    // TODO login
    return null;
  }

  const { email, credits } = auth;
  return (
    <Card>
      <div className="p-2 flex justify-between">
        <Bold>Credits: </Bold>
        <Metric>{credits}</Metric>
      </div>

      <div className="p-2 flex justify-between">
        <Bold>Email: </Bold>
        <Bold>{email}</Bold>
      </div>

      <div className="p-2 flex justify-between">
        <Bold></Bold>
        <div className="flex justify-center mt-2">
          <button
            onClick={handleSignout}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* <div className="flex py-1">
        <div className="flex-1">
          <Bold>Speed fetching JOBS: </Bold>
        </div>
        <div>
          <NumberInput
            min={70}
            defaultValue={speedJobs}
            onChange={(e) => {
              const speed = +e.target.value;
              console.log("speed jobs", speed);
              changeSpeed(false)(speed);
            }}
          />
        </div>
      </div> */}

      {/* <div className="flex py-1">
        <div className="flex-1">
          <Bold>Speed applying: </Bold>
        </div>
        <div>
          <NumberInput
            min={100}
            defaultValue={speedApply}
            onChange={(e) => {
              const speed = +e.target.value;
              console.log("speed apps", speed);
              changeSpeed(true)(speed);
            }}
          />
        </div>
      </div> */}

      {/* changeSpeed */}
    </Card>
  );
};

export default SettingsPage;
