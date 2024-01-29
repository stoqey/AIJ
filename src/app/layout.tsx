import Dashboard from "./dashboard";
import Navbar from "./navbar";
import Questions from "./questions";
import React from "react";
import Resume from "./resume";
import Settings from "./settings";
import { isEmpty } from "lodash";

const NotFound = () => {
  return <div>Not Found</div>;
};

const routes = [
  { path: "", component: Dashboard },
  { path: "questions", component: Questions },
  { path: "settings", component: Settings },
  { path: "resume", component: Resume },
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
  const isMain = isEmpty(hash);
  const route = routes.find((r) => `#/${r.path}` === hash);
  const Component = isMain
    ? routes[0].component
    : route
    ? route.component
    : NotFound;
  return (
    <div className="h-full bg-gray-50 w-full">
      <Navbar user={null} />
      <div className="p-3" style={{ paddingTop: "50px" }}>
        <Component />
      </div>
    </div>
  );
};
