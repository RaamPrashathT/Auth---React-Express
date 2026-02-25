import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    const token = getAccessToken();
})