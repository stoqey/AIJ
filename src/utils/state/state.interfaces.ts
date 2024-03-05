export interface InputOption {
    value: string;
    label: string;
}

export interface Answer {
    inputId: string;
    inputType: string;
    answerText: string;
}

export interface Question {
    question: string;
    inputId: string;
    inputType: "input" | "text" | "radio" | "checkbox" | "select" | "textarea" | "fieldset";
    inputOptions?: InputOption[];
    inputTypeValue?: string;
    answers?: Answer[];
}


export interface QuestionAnswer {
    question: Question;
    chainRes: {
        text: string;
        error?: boolean;
        [key: string]: any;
    }
    isNew?: boolean;
    date?: Date;
}

export type JobBoard = "indeed" | "linkedin" | "monster" | "glassdoor" | "careerbuilder" | "ziprecruiter" | "simplyhired";

export interface AppJob {
    company: string,
    title: string,
    id: string,
    easyApply: boolean;

    board?: JobBoard;

    range?: string;
    location?: string;
};

export interface Application {
    job: AppJob;
    questions?: QuestionAnswer[];
};

export interface BEState {
    dev: boolean;
    apps: Application[];
    completedApps: Application[];
    skippedApps: Application[];

    jobs: AppJob[];
    activeJob: AppJob;
    applied: AppJob[];
    deletedJobs: AppJob[];

    questions: QuestionAnswer[];

    count: number;

    isListRunning?: boolean;
    isAppRunning?: boolean;

    settings: {
        key: string;
        path: string;
        speedJobs: number;
        speedApply: number;
    },
    auth?: {
        email?: string;
        credits?: number;
        access_token: string;
        refresh_token: string;
        res: {
            status?: number;
            message?: string;
            success: boolean;
        }
    }
    // TODO: add more states
};