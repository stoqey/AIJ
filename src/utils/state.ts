import fs from "fs";
import { isEmpty } from "lodash";
import path from "path";

const packageJson = require('../../package.json');

const stateFilename = "state.json";
const appName = packageJson.name;
interface State {
    applied: string[];
    questions: any[];
    count: number;
    // TODO: add more states
};

const initState = { applied: [], questions: [], count: 0 } as State;



function getAppDataPath() {
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

export const getState = async (): Promise<State> => {
    try {
        const statePath = getAppDataPath();
        const appDataFilePath = path.join(statePath, stateFilename);
        const stateString = fs.readFileSync(appDataFilePath);
        const state = JSON.parse(stateString.toString());
        if (isEmpty(state)) {
            throw new Error("state is empty");
        }

        return state as State;
    }
    catch (error) {
        return initState;
    }

};


export async function setState(content: State) {
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