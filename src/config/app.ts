import * as cheerio from "cheerio";

import { APPEVENTS, AppEvents } from "../events";
import { AppJob, addJob, getAllQuestion, getQuestion, getResume, getState, saveQuestion, setState } from "../utils/state";
import _, { debounce, isEmpty } from "lodash";
import { getAppApi, getMainApi } from "../api";

import _get from "lodash/get";
import axios from "axios";
import { getBrowser } from "./browser";

const appEvents = AppEvents.Instance;
appEvents.setMaxListeners(0);

const emitApi = (response: any) => {
    // console.log("emitApi response", response);
    appEvents.emit(APPEVENTS.API, response);
};

appEvents.on(APPEVENTS.API, async (response: any) => {
    const state = await getState();
    const newState = { ...state, auth: { ...state.auth, res: response } };
    await setState(newState);
});

export const gotoMainPage = async (url: string) => {
    try {

        const state = await getState();
        const speedApply = _get(state, "settings.speedApply", 500);
        const speedJobs = _get(state, "settings.speedJobs", 100);

        const browser = await getBrowser();
        const page = await browser.newPage();

        const ctx = {
            speedApply,
            speedJobs,
            emitApi,
            cheerio,
            _,
            browser,
            page,
            url,
            debounce,
            addJob,
        };

        const getMain = await getMainApi();
        if (!getMain) {
            throw new Error("Error getMain api");
        }

        const mainFunc = getMain.data;

        return await new Promise((resolve, reject) => {

            const listStop = () => {
                appEvents.removeListener(APPEVENTS.LIST_STOP, listStop);
                page.close();
                resolve(true);
            }

            appEvents.on(APPEVENTS.LIST_STOP, listStop);

            const funcFunc = new Function(mainFunc);
            funcFunc.call(null).call(null, ctx, resolve, reject);
        });

    }
    catch (error) {
        console.error("Error gotoAppPage", error);
    }
}


export const gotoAppPage = async (job: AppJob) => {
    try {

        const state = await getState();
        const speedApply = _get(state, "settings.speedApply", 500);
        const speedJobs = _get(state, "settings.speedJobs", 100);

        const resume = await getResume();
        const browser = await getBrowser();
        const page = await browser.newPage();

        const close = () => {
            appEvents.emit(APPEVENTS.APP_STOP, job.id);
        };

        const ctx = {
            speedApply,
            speedJobs,
            emitApi,
            resume,
            cheerio,
            _,
            browser,
            page,
            job,
            debounce,
            addJob,
            axios,
            getQuestion,
            getAllQuestion,
            saveQuestion,
            setState,
            getState,
            close,
        };

        const getAppRes = await getAppApi();

        if (isEmpty(getAppRes && getAppRes.data)) {
            throw new Error("Error getApp api");
        }

        const mainFunc = getAppRes.data;

        // console.log("mainFunc", mainFunc);


        return await new Promise((resolve, reject) => {

            // Define the event listener function
            const onAppStop = (jobId: string) => {
                if (jobId === job.id) {
                    // Clean up the event listener to avoid memory leaks
                    appEvents.removeListener(APPEVENTS.APP_STOP, onAppStop);

                    // Close the page and resolve the promise
                    page.close();
                    resolve(true);
                }
            };

            // Attach the event listener to the APP_STOP event
            appEvents.on(APPEVENTS.APP_STOP, onAppStop);


            const funcFunc = new Function(mainFunc);
            funcFunc.call(null).call(null, ctx, resolve, reject);



        });

    }
    catch (error) {
        console.error("Error gotoAppPage", error);
    }
}