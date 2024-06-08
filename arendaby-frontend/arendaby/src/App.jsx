import './App.css';
import React, {Component} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import City from "./pages/city/city";
import Apartment from "./pages/apartment/apartment";
import RentOut from "./pages/RentOutHousing/RentOut";
import NotFound from "./pages/NotFound";
import Reservations from "./pages/Reservation/Reservation";
import Favorites from "./pages/Favorites/Favorites";


function Logout() {
    localStorage.clear()
    return <Navigate to="/login"/>
}

function RegisterAndLogout() {
    localStorage.clear()
    return <Register/>
}

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/logout" element={<Logout/>}/>
                    <Route path="/register" element={<RegisterAndLogout/>}/>
                    <Route path="/country/:country/:id" element={<City/>}/>
                    <Route path="/apartment/city/:city" element={<Apartment/>}/>
                    <Route path="/rent-out" element={<RentOut/>}/>
                    <Route path="/reservation" element={<Reservations/>}/>
                    <Route path="/favorites" element={<Favorites/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </BrowserRouter>
        );
    }
}

export default App;
