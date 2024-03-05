import type { Browser, Page } from "puppeteer";

import fs from "fs";
import { getAppDataPath } from "../utils/state"
import path from "path";
import puppeteer from "puppeteer";

let browser: Browser;


export function getDefaultBrowserPath() {
    switch (process.platform) {
        case "darwin": {
            return `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`;
        }
        case "win32": {
            return `\/Program Files\/Google\/Chrome\/Application\/chrome.exe`;
        }
        case "linux": {
            return `/usr/bin/google-chrome`;
        };

        default: {
            // console.log("Unsupported platform!");
            process.exit(1);
        }
    }
};

export const getBrowser = async () => {

    const browserPath = getDefaultBrowserPath();
    const statePath = getAppDataPath();
    const userDataDir = path.join(statePath, "browser_data");

    if (browser) {
        return browser;
    }
    if (!fs.existsSync(userDataDir)) {
        fs.mkdirSync(userDataDir);
    };

    browser = await puppeteer.launch({
        headless: false,
        args: [
            // `--window-size=1920,1080`,
            '--disable-extensions',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--no-sandbox',
            // '--single-process',
            '--disable-background-timers-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--disable-web-security',
            '--mute-audio',
            "--disable-setuid-sandbox"],
        userDataDir,
        executablePath: browserPath,
    });
    return browser;
};

export const closeBrowser = async () => {
    if (browser) {
        await browser.close();
    }
};

export const getBrowserPage = async () => {
    const browser = await getBrowser();
    const page = await browser.newPage();
    return page;
};

export const closeBrowserPage = async (page: Page) => {
    await page.close();
};


