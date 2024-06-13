import axios from "axios";
import {ACCESS_TOKEN} from "../constants";

const apiURL = "http://127.0.0.1:8000";

export const api = axios.create({
    baseURL: apiURL,
});

// const token = localStorage.getItem(ACCESS_TOKEN);
// if (token) {
//     api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// }

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
