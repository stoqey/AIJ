import { Question, QuestionAnswer } from "../../app/questions/interfaces";

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
    questions: QuestionAnswer[];
    count: number;
    isListRunning?: boolean;
    isAppRunning?: boolean;
    settings: {
        key: string;
        path: string;
    },
    auth?: {
        access_token: string;
        refresh_token: string;
    }
    // TODO: add more states
};