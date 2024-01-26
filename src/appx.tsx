import React, { useEffect } from "react";

const useAppState = () => {
  const [state, setState] = React.useState({ count: 0 });

  const getState = async () => {
    const appstate = await (window as any).api.invoke("state");
    console.log("appstate", appstate);
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

  return state;
};
export const ClientProcess = () => {
  const state = useAppState();

  const handleClick = async () => {
    const myFunc = await (window as any).api.invoke(
      "my-invokable-ipc",
      [1, 2, 3]
    );

    console.log("invoked", myFunc);
  };

  return (
    <div>
      <h3>Client Process</h3>
      {/* <p>Count: {state.count}</p> */}
      <button onClick={handleClick}> Click here </button>
    </div>
  );
};
