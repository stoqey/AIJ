import { ClientProcess } from "./appx";
import { createRoot } from "react-dom/client";

const root = createRoot(document.body);
root.render(
  <div className="p-5">
    <h1 className="bg-gray-500 text-center text-white">
      Hi Tailwind has been integrated.
    </h1>
    <h2>Hello from React!</h2>
    <ClientProcess />
  </div>
);
