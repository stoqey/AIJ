// api with axios

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3331',
});


interface IResponse {
    status: number;
    // data: any;
};

interface IMainResponse extends IResponse {
    data: any;
};


export const getMainApi = async (): Promise<any> => {
    try {
        const data = {

        };
        const response = await api.post<IMainResponse>('/api/main', data);
        if (response.status !== 200) {
            throw new Error("error");
        }
        return response.data;

    }
    catch (error) {
        console.error("Error getMainApi", error);
        return null;
    }

}

export const getAppApi = async (): Promise<any> => {
    try {
        const data = {

        };
        const response = await api.post<IMainResponse>('/api/app', data);
        if (response.status !== 200) {
            throw new Error("error");
        }
        return response.data;

    }
    catch (error) {
        console.error("Error getAppApi", error);
        return null;
    }

}

// ui using local file storage


// auth,

// questions, 
// resume sections,

// settings

export default api;