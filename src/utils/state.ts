import { Question, QuestionAnswer } from "../app/questions/interfaces";
import { isEmpty, uniqBy } from "lodash";

import fs from "fs";
import path from "path";

const packageJson = require('../../package.json');

const stateFilename = "state.json";
const appName = packageJson.name;

export interface AppJob {
    company: string,
    title: string,
    id: string,
    easyApply: boolean
};

export interface BEState {
    jobs: AppJob[];
    activeJob: AppJob;
    applied: AppJob[];
    questions: any[];
    count: number;
    isListRunning?: boolean;
    isAppRunning?: boolean;
    settings: {
        key: string;
        path: string;
    }
    // TODO: add more states
};

const initState = { applied: [], jobs: [], questions: [], count: 0, isListRunning: false } as BEState;



export function getAppDataPath() {
    switch (process.platform) {
        case "darwin": {
            return path.join(process.env["HOME"], "Library", "Application Support", appName);
        }
        case "win32": {
            return path.join(process.env.APPDATA, appName);
        }
        case "linux": {
            return path.join(process.env["HOME"], "." + appName);
        }
        default: {
            console.log("Unsupported platform!");
            process.exit(1);
        }
    }
}

export const getState = async (): Promise<BEState> => {
    try {
        const statePath = getAppDataPath();
        const appDataFilePath = path.join(statePath, stateFilename);
        const stateString = fs.readFileSync(appDataFilePath);
        const state = JSON.parse(stateString.toString());
        if (isEmpty(state)) {
            throw new Error("state is empty");
        }

        return state as BEState;
    }
    catch (error) {
        return initState;
    }

};


export async function setState(content: BEState) {
    try {
        const appDatatDirPath = getAppDataPath();

        // Create appDataDir if not exist
        if (!fs.existsSync(appDatatDirPath)) {
            fs.mkdirSync(appDatatDirPath);
        }

        const appDataFilePath = path.join(appDatatDirPath, stateFilename);
        const state = JSON.stringify(content, null, 2);


        fs.writeFileSync(appDataFilePath, state);
        return true;
    }
    catch (error) {
        return false;
    }
}

export const addApplied = async (job: AppJob) => {
    const state = await getState();
    const newJobs = (state.jobs || []).filter((j) => j.id !== job.id);
    const newApplied = uniqBy([...(state.applied || []), job], "id")
    const newState: BEState = { ...state, applied: newApplied, jobs: newJobs, activeJob: null };
    await setState(newState);
    return newState;
};

export const addJob = async (job: AppJob | AppJob[]): Promise<boolean> => {

    try {
        const state = await getState();
        const newJobs = uniqBy([...(state.jobs || []), ...(Array.isArray(job) ? job : [job])], "id")
        const newState = { ...state, jobs: newJobs };
        await setState(newState);
        return true;

    }
    catch (error) {
        console.error("error addJob", error);
        return false;
    }

};


function getReadableId(question: string) {
    return question.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().substring(0, 200);
};


// QUESTIONS
// get one question
export function getQuestion(question: Question): QuestionAnswer | null {
    try {
        const appDataDirPath = getAppDataPath();
        const cachePath = path.join(appDataDirPath, "questions");
        const questionReadableId = getReadableId(question.question)
        const cacheDataString = fs.readFileSync(`${cachePath}/${questionReadableId}.json`);
        const cacheData = JSON.parse(cacheDataString.toString());
        return cacheData as { question: Question; chainRes: any; }
    }
    catch (error) {
        return null;
    }
};

// get questions
export function getAllQuestion(): QuestionAnswer[] {
    try {
        const appDataDirPath = getAppDataPath();
        const questionDirPath = path.join(appDataDirPath, "questions");

        // get all files in questions dir
        const files = fs.readdirSync(questionDirPath);
        const questions = files.map((file) => {
            const questionFile = path.join(questionDirPath, file);
            const questionDataString = fs.readFileSync(questionFile);
            const questionData = JSON.parse(questionDataString.toString());
            return questionData as QuestionAnswer;
        });

        return questions;
    }
    catch (error) {
        return null;
    }
};

export function saveQuestion(questionAnswer: QuestionAnswer): boolean {
    try {
        const appDataDirPath = getAppDataPath();
        const questionDirPath = path.join(appDataDirPath, "questions");

        const questionFile = `${getReadableId(questionAnswer.question.question)}.json`;
        // Create appDataDir if not exist
        if (!fs.existsSync(questionDirPath)) {
            fs.mkdirSync(questionDirPath);
        }

        const questionFilDestination = path.join(appDataDirPath, questionFile);
        const state = JSON.stringify(questionAnswer, null, 2);

        fs.writeFileSync(questionFilDestination, state);
        return true;
    }
    catch (error) {
        return false;
    }
};


// save resume text to file
// load resume text from file
export const getResume = () => {
    try {
        const appDataDirPath = getAppDataPath();
        const resumeFilePath = path.join(appDataDirPath, "resume.txt");
        const resumeText = fs.readFileSync(resumeFilePath);
        return resumeText.toString();
    }
    catch (error) {
        return null;
    }
};

export const saveResume = (resume: string) => {
    try {
        const appDataDirPath = getAppDataPath();
        const resumeFilePath = path.join(appDataDirPath, "resume.txt");
        fs.writeFileSync(resumeFilePath, resume);
        return true;
    }
    catch (error) {
        return false;
    }
};