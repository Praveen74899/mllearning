import axios from "axios";

const url = axios.create({
    baseURL: "http://localhost:5000",
});


url.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


url.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');         //  token remove
            window.location.href = '/login';          //  redirect to login page
        }
        return Promise.reject(error);
    }

);

export default url;
