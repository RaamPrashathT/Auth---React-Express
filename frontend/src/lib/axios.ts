import axios from "axios";
import { getAccessToken, setAccessToken } from "./tokenStore";

export const apiClient = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
})

apiClient.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token && config.headers) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const response = await apiClient.post(
                    "/auth/refresh",
                    {},
                    { withCredentials: true }
                )
                
                const newAccessToken = response.data.accessToken;
                setAccessToken(newAccessToken);

                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                return apiClient(originalRequest);
            } catch (refreshError) {
                setAccessToken(null);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
)