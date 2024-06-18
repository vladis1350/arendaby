import './App.css';
import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home";
import City from "./pages/city/city";
import Apartment from "./pages/apartment/apartment";
import RentOut from "./pages/RentOutHousing/RentOut";
import NotFound from "./pages/NotFound";
import Reservations from "./pages/Reservation/Reservation";
import Favorites from "./pages/Favorites/Favorites";
import {verifyToken} from "./services/Api";
import {login, logout} from "./Redux/authReducer";
import {useDispatch, useSelector} from "react-redux";
import {showMessageInfo} from "./Redux/messagesReducer";


function Logout() {
    localStorage.clear()
    return <Navigate to="/login"/>
}

function RegisterAndLogout() {
    localStorage.clear()
    return <Register/>
}

export default function App() {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);

    React.useEffect(() => {
        const verifyUserToken = async () => {
            if (token) {
                try {
                    const response = await verifyToken(token);
                    if (response.status === 200) {
                        const refreshToken = localStorage.getItem("refreshToken");
                        dispatch(login({accessToken: token, refreshToken: refreshToken}));
                    } else {
                        dispatch(logout());
                        return <Navigate to="/login"/>;
                    }
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        dispatch(logout());
                        return <Navigate to="/login"/>;
                    }
                }
            } else {
                dispatch(
                    showMessageInfo({
                        type: "error",
                        text: "Авторизация не прошла. Пожалуйста, авторизуйтесь",
                    })
                );
                return <Navigate to="/login"/>;
            }
        };

        verifyUserToken();
    }, [token, dispatch]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/logout" element={<Logout/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/country/:country/:id" element={<City/>}/>
                <Route path="/apartment/city/:id" element={<Apartment/>}/>
                <Route path="/rent-out" element={<RentOut/>}/>
                <Route path="/reservation" element={<Reservations/>}/>
                <Route path="/favorites" element={<Favorites/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    );
}

