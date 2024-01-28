export interface ISettings {
    key: string;
    path: string;
}
export interface State {
    applied: string[];
    questions: any[];
    count: number;
    isListRunning?: boolean;
    isAppRunning?: boolean;
    settings: ISettings;
    // TODO: add more states
};