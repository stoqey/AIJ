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
