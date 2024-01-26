import type { Browser, Page } from "puppeteer";

import puppeteer from "puppeteer";

let browser: Browser;

const userDataDir =  "./browser-data";

export const getBrowser = async () => {
    if (browser) {
        return browser;
    }
    browser = await puppeteer.launch({
        headless: false,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        // userDataDir
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    });
    return browser;
};



