import React from "react";
import Settings from "./settings";

const Dashboard = () => {
  return <div>Dashboard</div>;
};

const Questions = () => {
  return <div>Questions</div>;
};

const NotFound = () => {
  return <div>Not Found</div>;
};

const routes = [
  { path: "", component: Dashboard },
  { path: "questions", component: Questions },
  { path: "settings", component: Settings },
  { path: "*", component: NotFound },
];

export const useHashState = () => {
  const [hash, setHash] = React.useState(window.location.hash || "");
  React.useEffect(() => {
    const handleHashChange = () => {
      console.log("hash change", window.location.hash);
      setHash(window.location.hash);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);
  return hash;
};

export const Layout = () => {
  const hash = useHashState();
  const route = routes.find((r) => `#/${r.path}` === hash);
  const Component = route ? route.component : NotFound;
  return <div className="h-full bg-gray-50 p-3 pt-5">{<Component />}</div>;
};
