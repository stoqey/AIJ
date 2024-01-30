import { Bold, Button, Card, Metric, TextInput } from "@tremor/react";

import { LayoutPageProps } from "../layout";
import React from "react";

export const SettingsPage = ({ state }: LayoutPageProps) => {
  const auth = state.auth;

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
    </Card>
  );
};

export default SettingsPage;
