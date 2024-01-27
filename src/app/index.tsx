import { ClientProcess } from "./appx";
import { Layout } from "./layout";
import Navbar from "./navbar";
import { createRoot } from "react-dom/client";

const root = createRoot(document.body);
root.render(
  <div className="h-full bg-gray-50">
    <Layout />
  </div>
);
