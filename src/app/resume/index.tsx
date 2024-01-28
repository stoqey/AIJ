import React from "react";
import { Textarea } from "@tremor/react";

export const ResumePage = () => {
  return (
    <div>
      <Textarea rows={100} placeholder="Resume" />
      <div className="flex justify-center mt-2 mb-2">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Save
        </button>
      </div>
    </div>
  );
};

export default ResumePage;
