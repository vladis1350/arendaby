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

export const deleteBooking = async (id) =>
    api.get(`/api/apartment/booking/delete/${id}`);

export const getUserActivity = async (userId) =>
    api.get(`/api/user-activities/${userId}`);

export const checkUserActivity = async  (userId, apart_id) =>
    api.get(`/api/user-activity/${userId}/${apart_id}`);

export const saveUserActivity = async (data) =>
    api.post(`/api/user-activities/create/`, data);

export const updateUserFavorite = async (id, data) =>
    api.patch(`/api/user-activities/update/${id}`, data);

export const authUser = async (userData) =>
    api.post("/api/user/register/", userData);

export const filterApartByParam = async (selectedGroups, priceRange) =>
    api.post(`/api/apartment/filter-by-param/`, selectedGroups, priceRange);

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

export const getRating = async (apart_id, user_id) =>
    api.get(`/api/apartment/rating/${apart_id}/${user_id}`);

export const getComment = async (apart_id) =>
    api.get(`/api/apartment/comment/${apart_id}`);

export const createRating = async (data) => {
    const cfg = {headers: {"Content-Type": "multipart/form-data"}};
    return api.post(`/api/apartment/rating/create/`, data, cfg);
}

export const createComment = async (data) => {
    const cfg = {headers: {"Content-Type": "multipart/form-data"}};
    return api.post(`/api/apartment/comment/create/`, data, cfg);
}

export const filterApartment = async (dataFilter) => {
    const cfg = {headers: {"Content-Type": "multipart/form-data"}};
    return api.post(`/api/apartment/booking/filter/`, dataFilter, cfg);
}

export const getBookedDates = async (apart_id) =>
    api.get(`/api/bookings/${apart_id}`);

export const getApartment = async (city) =>
    api.get(`/api/apartment/city/${city}`);

export const getAllApartment = async () =>
    api.get(`/api/apartment/cities/`);
