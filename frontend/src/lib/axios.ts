import axios from "axios";

export const apiClient = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => {
        console.log(response);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await axios.post(
                    "http://localhost:5000/auth/refresh",
                    {},
                    { withCredentials: true },
                )
                return apiClient(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    },
);


