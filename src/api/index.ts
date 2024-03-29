// api with axios

import axios, { AxiosInstance } from 'axios';
import { getResume, getState, setState } from "../utils/state";

import _get from "lodash/get";
import { isEmpty } from "lodash";

export const getBaseUrl = (isDev: boolean) => {
    return isDev ? "http://localhost:3001" : "https://www.algojobs.ca";
};

export const getApiInstance = (isDev: boolean): AxiosInstance => {
    const baseURL = getBaseUrl(isDev);
    return axios.create({
        baseURL,
    });
};

interface IResponse {
    status: number;
    // data: any;
};
interface GetAuth {
    access_token: string;
    refresh_token: string;
};

interface GetAuthApiRes {
    success: boolean;
    message: string;
    data: { userId: string, credits: number, auth: any }
};


export const getAuthApi = async (args: GetAuth): Promise<any> => {
    let state = await getState();
    const api = getApiInstance(state.dev || false);
    try {
        const response = await api.post<GetAuthApiRes>('/api/auth', args);
        if (response.status !== 200) {
            throw new Error("error");
        }
        const data = response.data;

        // console.log("getAuthApi /api/auth", { data });
        if (data.success !== true) {
            const message = _get(data, "message");
            const status = _get(data, "status");
            const newAuth = { ...state.auth, res: { status, message, success: data.success } };
            await setState({ ...state, auth: newAuth });
            return newAuth;
        } else {

            const access_token = _get(data, "data.auth.session.access_token");
            const refresh_token = _get(data, "data.auth.session.refresh_token");
            if (isEmpty(access_token) || isEmpty(refresh_token)) {
                throw new Error("error getting tokens");
            };

            const email = _get(data, "data.auth.user.email", "");
            const credits = _get(data, "data.credits", 0);
            const newAuth = { access_token, refresh_token, email, credits, res: { success: true } };
            await setState({ ...state, auth: newAuth });
            return newAuth;
        }

    }
    catch (error) {
        console.log("Error getAuthApi", error?.message || "");
        const newAuth = { ...state.auth, res: { message: error.message || "", success: false } };
        await setState({ ...state, auth: newAuth });
        return null;
    }

}


interface IMainResponse extends IResponse {
    data: any;
};

export const getMainApi = async (): Promise<any> => {
    try {
        const state = await getState();
        const api = getApiInstance(state.dev || false);
        const resume = await getResume();
        const access_token = _get(state, "auth.access_token");
        const refresh_token = _get(state, "auth.refresh_token");
        if (isEmpty(access_token) || isEmpty(refresh_token)) {
            throw new Error("error getting tokens");
        };

        if (isEmpty(resume)) {
            throw new Error("error getting resume");
        }

        const data = {
            access_token,
            refresh_token,
            resume
        };

        const response = await api.post<IMainResponse>('/api/main', data);
        if (response.status !== 200) {
            throw new Error("error");
        }

        const resData: any = response.data;
        if (!resData.success) {
            const resMessage = _get(resData, "data.message", "");
            console.log("Error getMainApi", resMessage);
            await setState({ ...state, auth: { ...state.auth, res: { success: false, message: resMessage } } });
        }

        return resData;

    }
    catch (error) {
        console.log("Error getMainApi", error?.message);
        return null;
    }

}

export const getAppApi = async (): Promise<any> => {
    try {
        const state = await getState();
        const api = getApiInstance(state.dev || false);
        const resume = await getResume();
        const access_token = _get(state, "auth.access_token");
        const refresh_token = _get(state, "auth.refresh_token");
        if (isEmpty(access_token) || isEmpty(refresh_token)) {
            throw new Error("error getting tokens");
        };

        if (isEmpty(resume)) {
            throw new Error("error getting resume");
        }

        const data = {
            access_token,
            refresh_token,
            resume
        };

        const response = await api.post<IMainResponse>('/api/app', data);
        const resData: any = response.data || {};

        // console.log("getAppApi /api/app", { resData, response });
        if (response.status !== 200) {
            throw new Error("error");
        }

        if (!resData.success) {
            const resMessage = resData.message;
            console.log("resData.success", resMessage);
            await setState({ ...state, auth: { ...state.auth, res: { success: false, message: resMessage } } });
        }
        return resData;

    }
    catch (error) {
        console.log("Error getAppApi", error?.message);
        return null;
    }

}

// ui using local file storage


// auth,

// questions, 
// resume sections,

// settings