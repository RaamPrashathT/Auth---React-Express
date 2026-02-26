import axios from "axios";

export const apiClient = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
})


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

                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                return apiClient(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
)