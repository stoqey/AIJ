import React from "react";
import { Textarea } from "@tremor/react";

export const ResumePage = () => {
  const [resume, setResume] = React.useState("");

  React.useEffect(() => {
    const getResume = async () => {
      const resume = await (window as any).api.invoke("resume:get");
      // console.log("current resume", resume);
      setResume(resume);
    };
    getResume();
  }, []);

  const saveResume = async (resumeTxt: string) => {
    await (window as any).api.invoke("resume:save", resumeTxt);
  };

  const handleSaveResume = (resumeTxt: string) => {
    setResume(resumeTxt);
    saveResume(resumeTxt);
  };

  return (
    <div>
      <Textarea
        value={resume}
        rows={100}
        placeholder="Resume"
        onChange={(e) => handleSaveResume(e.target.value)}
      />
    </div>
  );
};

export default ResumePage;
