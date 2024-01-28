import * as cheerio from "cheerio";

import { APPEVENTS, AppEvents } from "../events";
import _, { debounce } from "lodash";
import { getAppApi, getMainApi } from "../api";

import _get from "lodash/get";
import { addJob } from "../utils/state";
import { getBrowser } from "./browser";

const appEvents = AppEvents.Instance;

export const gotoMainPage = async (url: string) => {
    try {

        const browser = await getBrowser();
        const page = await browser.newPage();

        const ctx = {
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

        console.log("mainFunc", mainFunc);

        return await new Promise((resolve, reject) => {


            appEvents.on(APPEVENTS.LIST_STOP, () => {
                console.log("list stop");
                page.close();
                resolve(true);
            });
            const funcFunc = new Function(mainFunc);
            funcFunc.call(null).call(null, ctx, resolve, reject);
        });

    }
    catch (error) {
        console.error("Error gotoAppPage", error);
    }
}


export const gotoAppPage = async (url: string) => {
    try {

        const browser = await getBrowser();
        const page = await browser.newPage();

        const ctx = {
            cheerio,
            _,
            browser,
            page,
            url,
            debounce,
            addJob,
        };

        const getAppRes = await getAppApi();
        if (!getAppRes) {
            throw new Error("Error getApp api");
        }

        const mainFunc = getAppRes.data;

        console.log("getAppApi", mainFunc);

        return await new Promise((resolve, reject) => {

            appEvents.on(APPEVENTS.APP_STOP, () => {
                console.log("app stop");
                page.close();
                resolve(true);
            });
            const funcFunc = new Function(mainFunc);
            funcFunc.call(null).call(null, ctx, resolve, reject);
        });

    }
    catch (error) {
        console.error("Error gotoAppPage", error);
    }
}

