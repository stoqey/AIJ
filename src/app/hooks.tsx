import React, { useEffect } from "react";

import { BEState } from "../utils/state";

export const useAppState = (): BEState => {
  const [state, setState] = React.useState<BEState>({
    count: 0,
    jobs: [],
    applied: [],
    questions: [],
    settings: { key: "", path: "", speedApply: 1000, speedJobs: 1000 },
    activeJob: null,
  });

  const getState = async () => {
    const appstate = await (window as any).api.invoke("state");
    setState(appstate);
    return appstate;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      getState().then((fetchedData) => {
        // console.log("fetchedData", fetchedData);
      });
    }, 1000);

    // Cleanup function to clear the interval when the component is unmounted or dependencies change
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  return state as BEState;
};
