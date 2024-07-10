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

export const getCity = async (city_id) =>
    api.get(`/api/city/${city_id}`);

export const loginUser = async (username, password) =>
    api.post("/api/token/", {username, password});

export const verifyToken = async (token) =>
    await axios.post(apiURL + "/api/token/verify/", {token});

export const getRefreshToken = async (refresh) =>
    api.post("/api/token/refresh/", refresh);


export const getGroupApartmentType = async () =>
    api.get("/api/apartment/groups/");

export const getApartmentTypes = async (group_id) =>
    api.get(`/api/apartment/types/${group_id}`);

export const getApartmentById = async (id) =>
    api.get(`/api/apartment/${id}`);

export const createApartment = async (data) => {
    const cfg = {headers: {"Content-Type": "multipart/form-data"}};
    return api.post("/api/apartment/create/", data, cfg);
}

export const createBooking = async (data) => {
    const cfg = {headers: {"Content-Type": "multipart/form-data"}};
    return api.post(`/api/apartment/booking/create/`, data, cfg);
}

export const getCities = async (id) =>
    api.get(`/api/cities/${id}`);

export const getUserBooking = async (user_id) =>
    api.get(`/api/booking/user/${user_id}`);

export const getIdea = async (v_id) =>
    api.get(`/api/v-ideas/idea/${v_id}`);

export const filterApartment = async (dataFilter) => {
    const cfg = {headers: {"Content-Type": "multipart/form-data"}};
    return api.post(`/api/apartment/booking/filter/`, dataFilter, cfg);
}

export const getApartment = async (city) =>
    api.get(`/api/apartment/city/${city}`);
