import React, { useEffect } from "react";

import { ISettings } from "./shared";
import { useAppState } from "./hooks";

export const ClientProcess = () => {
  const state = useAppState();

  const [settings, setSettings] = React.useState<ISettings>(
    state.settings || ({} as any)
  );

  const handleSettings = (field: string) => {
    return (event: any) => {
      setSettings({ ...settings, [field]: event.target.value });
    };
  };

  const isListRunning = state.isListRunning;
  const handleClick = async () => {
    const startStop = `list:${isListRunning ? "stop" : "start"}`;
    const myFunc = await (window as any).api.invoke(startStop, null);
  };

  const saveSettings = async () => {
    await (window as any).api.invoke("settings:save", settings);
  };

  return (
    <div>
      <h3>Client Process</h3>
      <p>Count: {state.count}</p>
      <p>List is running: {isListRunning ? "Yes" : "No"}</p>
      <button onClick={handleClick}> Click here </button>

      <h3>Settings</h3>

      <p>Path</p>
      <input
        type="text"
        name="path"
        value={settings.path}
        onChange={handleSettings("path")}
      />

      <p>Key</p>
      <input
        type="password"
        name="key"
        value={settings.key}
        onChange={handleSettings("key")}
      />

      <p>Save settings</p>
      <button onClick={saveSettings}> Save </button>
    </div>
  );
};
