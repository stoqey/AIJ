import { Bold, Button, Card, Metric, TextInput } from "@tremor/react";

import { LayoutPageProps } from "../layout";
import React from "react";

export const SettingsPage = ({ state }: LayoutPageProps) => {
  const auth = state.auth;

  const handleSignout = async () => {
    await (window as any).api.invoke("logout", null);
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
    </Card>
  );
};

export default SettingsPage;
