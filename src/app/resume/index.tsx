import React from "react";
import { Textarea } from "@tremor/react";

export const ResumePage = () => {
  const [resume, setResume] = React.useState("");

  React.useEffect(() => {
    const getResume = async () => {
      const resume = await (window as any).api.invoke("resume:get");
      console.log("current resume", resume);
      setResume(resume);
    };
    getResume();
  }, []);

  const saveResume = async () => {
    await (window as any).api.invoke("resume:save", resume);
  };

  return (
    <div>
      <Textarea
        value={resume}
        rows={100}
        placeholder="Resume"
        onChange={(e) => setResume(e.target.value)}
      />
      <div className="flex justify-center mt-2 mb-2">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => saveResume()}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ResumePage;
