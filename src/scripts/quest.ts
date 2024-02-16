import { QuestionAnswer } from "../app/questions/interfaces";
import fs from "fs";
import { getReadableId } from "../utils/state";

const inputDir = "./questions_og";
const outputDir = "./questions_new";

const renameAllJsonFiles = () => {
    const files = fs.readdirSync(inputDir);
    for (const file of files) {
        try {
            const questionFile = `${inputDir}/${file}`;
            const questionDataString = fs.readFileSync(questionFile, { encoding: "utf-8" });
            const questionJson: QuestionAnswer = JSON.parse(questionDataString);
            if (questionJson) {
                const questionReadableId = getReadableId(questionJson?.question?.question);
                const newQuestionFile = `${outputDir}/${questionReadableId}.json`;
                fs.writeFileSync(newQuestionFile, questionDataString, { encoding: "utf-8" });
                console.log("questionFile", questionFile);
                console.log("newQuestionFile", newQuestionFile);
            }

        }
        catch (error) {
            console.log("error renameAllJsonFiles", error?.message);
        }
    }
}

renameAllJsonFiles();