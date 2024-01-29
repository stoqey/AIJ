import { Button, Card, TextInput } from "@tremor/react";

import { LayoutPageProps } from "../layout";
import React from "react";

export const SettingsPage = ({ state }: LayoutPageProps) => {
  return (
    <Card>
      <div className="p-2">
        <TextInput placeholder="path" />
      </div>

      <div className="p-2">
        <TextInput placeholder="key" />
      </div>

      <div className="flex center p-2">
        <Button>Save</Button>
      </div>
    </Card>
  );
};

export default SettingsPage;
