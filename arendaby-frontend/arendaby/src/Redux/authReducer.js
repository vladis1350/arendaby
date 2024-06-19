import {jwtDecode} from "jwt-decode";
import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    isLoggedIn: !!localStorage.getItem("token"),
    token: localStorage.getItem("token"),
    refreshToken: localStorage.getItem("refreshToken"),
    userId: localStorage.getItem("token")
        ? jwtDecode(localStorage.getItem("token")).user_id
        : "",
};


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        verifyUser: (state) => {
            state.isLoggedIn = true;
        },
        login: (state, action) => {
            try {
                state.isLoggedIn = true;
                state.token = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.userId = jwtDecode(action.payload.accessToken).user_id;
                localStorage.setItem("token", action.payload.accessToken);
                localStorage.setItem("refreshToken", action.payload.refreshToken);
            } catch (error) {
                console.log(error);
            }
        },
    }
});

export const { login, logout, verifyUser } =
  authSlice.actions;

export default authSlice.reducer;
