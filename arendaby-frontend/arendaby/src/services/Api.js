import axios from "axios";
import {ACCESS_TOKEN} from "../constants";

const apiURL = "http://127.0.0.1:8000";

export const api = axios.create({
    baseURL: apiURL,
});

const token = localStorage.getItem(ACCESS_TOKEN);
if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export const getUser = async (id) =>
    api.get(`/api/user/${id}`);

export const authUser = async (username, email, password) =>
    api.post("/api/user/register/", {username, email, password});

export const loginUser = async (username, password) =>
    api.post("/api/token/", {username, password});

export const verifyToken = async (token) =>
    await axios.post(apiURL + "/api/token/verify/", {token});

export const getRefreshToken = async (refresh) =>
    api.post("/api/token/refresh/", refresh);
// api.interceptors.request.use(
//     (config) => {
//
//         return config
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

export const getCities = async (id) =>
    api.get(`/api/cities/${id}`);

export const getApartment = async (city) =>
    api.get(`/api/apartment/city/${city}`);
