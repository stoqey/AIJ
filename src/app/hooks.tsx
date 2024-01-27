import React, { useEffect } from "react";

import { State } from "./shared";

export const useAppState = (): State => {
  const [state, setState] = React.useState({ count: 0 });

  const getState = async () => {
    const appstate = await (window as any).api.invoke("state");
    setState(appstate);
    return appstate;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      getState().then((fetchedData) => {
        console.log("fetchedData", fetchedData);
      });
    }, 1000);

    // Cleanup function to clear the interval when the component is unmounted or dependencies change
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  return state as State;
};
